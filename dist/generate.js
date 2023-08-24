"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
// import { readFormBuilder } from './processors/formbuilder.tsa';
// import { readJsonSchemaBuilder } from './processors/jsonschemabuilder';
const constants = __importStar(require("./constant"));
const jsonschemabuilder_1 = require("./processors/jsonschemabuilder");
const tslog_1 = require("tslog");
const log = new tslog_1.Logger();
const clc = require("cli-color");
const path = require('path');
const fs_1 = require("fs");
const { Eta } = require('eta');
const { capitalizeFirstLetter } = require('./libs');
const extFb = '.xfb.json';
const extHfb = '.xhfb.json';
const extjsonschema = '.jsonschema.json';
let jsonschemas = {};
const docs = [];
const initialize = (defFolder, backendfolder, frontendfolder) => {
    prepareEnvironments(backendfolder, frontendfolder);
    let activatemodules = [];
    const files = (0, fs_1.readdirSync)(defFolder);
    // readdir(defFolder, (err, files) => {
    // files.forEach((file) => {
    for (let j = 0; j < files.length; j++) {
        const file = files[j];
        const filearr = file.split('.');
        let rendertype = 'basic';
        const docname = filearr[0].toLowerCase();
        const doctype = filearr[1].toLowerCase();
        const jsonstring = (0, fs_1.readFileSync)(defFolder + path.sep + file, 'utf-8');
        const jsondata = JSON.parse(jsonstring);
        let allmodels = {};
        if (file.endsWith(extjsonschema)) {
            log.info(`Load ` + clc.green(file));
            rendertype = 'basic';
            jsonschemas[docname] = jsondata;
            allmodels = (0, jsonschemabuilder_1.readJsonSchemaBuilder)(doctype, docname, jsondata);
            generate(docname, doctype, rendertype, allmodels, backendfolder, frontendfolder);
            activatemodules.push({ doctype: doctype, docname: capitalizeFirstLetter(docname) });
        }
        else {
            log.warn(`Load ` + clc.yellow(file) + ` but it is not supported`);
        }
    }
    log.info("Activated backend modules: ");
    log.info(activatemodules);
    loadSimpleAppModules(activatemodules, backendfolder);
    return Promise.resolve(true);
};
exports.initialize = initialize;
const generate = (docname, doctype, rendertype, allmodels, backendfolder, frontendfolder) => {
    const targetfolder = `${backendfolder}/src/docs/${doctype}`;
    try {
        (0, fs_1.mkdirSync)(targetfolder, { recursive: true });
        (0, fs_1.mkdirSync)(`${frontendfolder}/server/docs/`, { recursive: true });
    }
    catch (err) {
        //do nothing if folder exists
    }
    finally {
        const templatefolder = `${constants.templatedir}/${rendertype}`;
        log.info(`- Generate ${docname}, ${doctype}, ${templatefolder}`);
        const eta = new Eta({
            views: templatefolder,
            functionHeader: 'const capitalizeFirstLetter = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);' +
                'const initType=(str)=>{return ["string","number","boolean","array","object"].includes(str) ? capitalizeFirstLetter(str) : str;}',
        });
        const variables = {
            name: docname,
            doctype: doctype,
            models: allmodels,
            schema: allmodels[capitalizeFirstLetter(docname)].model,
            apiSchemaName: capitalizeFirstLetter(docname),
            typename: capitalizeFirstLetter(docname),
            fullApiSchemaName: doctype + 'apischema.' + capitalizeFirstLetter(docname),
            fullTypeName: doctype + 'type.' + capitalizeFirstLetter(docname),
            jsonschema: jsonschemas[docname],
            bothEndCode: '',
            frontEndCode: '',
            backEndCode: '',
            controllerCode: ''
        };
        // console.log('generate 2', JSON.stringify(variables));
        // // const txtUISchema = eta.render('./uischema', variables);
        // console.log('generate 4');
        // console.log('generate 2', variables);
        const txtType = eta.render('./type', variables);
        (0, fs_1.writeFileSync)(`${targetfolder}/${doctype}.type.ts`, txtType);
        // compile(jsonschemas[docname], docname).then((txtType: string) => {
        //   writeFileSync(`${targetfolder}/${doctype}.type.ts`, txtType);
        // });
        // generate jsonschema object, use for data validation
        const txtJsonSchema = eta.render('./jsonschema', variables);
        (0, fs_1.writeFileSync)(`${targetfolder}/${doctype}.jsonschema.ts`, txtJsonSchema);
        // generate before save source code, wont override after regenerate
        const customizefilename = `${targetfolder}/${doctype}.beforesave.ts`;
        if (!(0, fs_1.existsSync)(customizefilename)) {
            const txtBeforeSave = eta.render('./beforesave', variables);
            (0, fs_1.writeFileSync)(`${targetfolder}/${doctype}.beforesave.ts`, txtBeforeSave);
        }
        // write mongoose model file
        const txtModel = eta.render('./model', variables);
        (0, fs_1.writeFileSync)(`${targetfolder}/${doctype}.model.ts`, txtModel);
        // prepare openapi schema
        const txtApiSchema = eta.render('./apischema', variables);
        (0, fs_1.writeFileSync)(`${targetfolder}/${doctype}.apischema.ts`, txtApiSchema);
        // prepare backend classes
        // prepare frontend api client
        const servicefile = `${targetfolder}/${doctype}.service.ts`;
        let bothEndCode = '';
        let backEndCode = '';
        if ((0, fs_1.existsSync)(servicefile)) {
            const servicecodes = (0, fs_1.readFileSync)(servicefile).toString();
            /* extract string bothend and backend, put in back */
            const regex1 = /\/\/<begin-bothend-code>([\s\S]*?)\/\/<end-bothend-code>/g;
            const regex2 = /\/\/<begin-backend-code>([\s\S]*?)\/\/<end-backend-code>/g;
            const bothendresult = servicecodes.match(regex1);
            const backendresult = servicecodes.match(regex2);
            if (bothendresult) {
                bothEndCode = bothendresult[0];
            }
            if (backendresult) {
                backEndCode = backendresult[0];
            }
        }
        variables.bothEndCode = bothEndCode !== null && bothEndCode !== void 0 ? bothEndCode : "//<begin-bothend-code>\n//<end-bothend-code>";
        variables.backEndCode = backEndCode !== null && backEndCode !== void 0 ? backEndCode : "//<begin-backend-code>\n//<end-backend-code>";
        const txtService = eta.render('./service', variables);
        (0, fs_1.writeFileSync)(`${targetfolder}/${doctype}.service.ts`, txtService);
        // prepare api router, allow add more api and wont override after regenerate
        const controllerfile = `${targetfolder}/${doctype}.controller.ts`;
        let controllerCode = '';
        if ((0, fs_1.existsSync)(controllerfile)) {
            /* extract customized controller, put in back */
            const controllersourcecodes = (0, fs_1.readFileSync)(controllerfile).toString();
            const controllerregex = /\/\/<begin-controller-code>([\s\S]*?)\/\/<end-controller-code>/g;
            const controllerresult = controllersourcecodes.match(controllerregex);
            if (controllerresult) {
                controllerCode = controllerresult[0];
            }
        }
        variables.controllerCode = controllerCode != '' ? controllerCode : "\n//<begin-controller-code>\n//<end-controller-code>";
        const txtController = eta.render('./controller', variables);
        (0, fs_1.writeFileSync)(controllerfile, txtController);
        // prepare module
        const txtModule = eta.render('./module', variables);
        (0, fs_1.writeFileSync)(`${targetfolder}/${doctype}.module.ts`, txtModule);
        // prepare readme
        const txtReadme = eta.render('./readme', variables);
        (0, fs_1.writeFileSync)(`${targetfolder}/README.md`, txtReadme);
        const frontendfile = `${frontendfolder}/server/docs/${variables.typename}Doc.ts`;
        let frontEndCode = '';
        if ((0, fs_1.existsSync)(frontendfile)) {
            const clientcodes = (0, fs_1.readFileSync)(frontendfile).toString();
            /* extract string frontend code, put in back */
            const regex3 = /\/\/<begin-frontend-code>([\s\S]*?)\/\/<end-frontend-code>/g;
            const frontendresult = clientcodes.match(regex3);
            if (frontendresult) {
                frontEndCode = frontendresult[0];
            }
        }
        variables.frontEndCode = frontEndCode !== null && frontEndCode !== void 0 ? frontEndCode : '';
        const txtDocClient = eta.render('./apiclient', variables);
        (0, fs_1.writeFileSync)(frontendfile, txtDocClient);
        // // fs.writeFileSync(`${targetfolder}/${doctype}.uischema.ts`, txtUISchema);
        log.info(`- write completed: ` + clc.green(doctype));
        //create type
        //create service
        //create controller
        //create module
        //create apischema
        //create beforesave if not exists
        // console.log(schema, res);
    }
};
const prepareEnvironments = (backendfolder, frontendfolder) => {
    const targetfolder = `${backendfolder}/src/class`;
    const targetfrontendfolder = `${frontendfolder}/server/class`;
    try {
        (0, fs_1.mkdirSync)(targetfolder, { recursive: true });
        (0, fs_1.mkdirSync)(targetfrontendfolder);
    }
    catch (error) {
        //do nothing
    }
    //copy over backend service class
    (0, fs_1.copyFileSync)(`${constants.templatedir}/SimpleAppService.eta`, `${targetfolder}/SimpleAppService.ts`);
    //copy over backend controller
    (0, fs_1.copyFileSync)(`${constants.templatedir}/SimpleAppController.eta`, `${targetfolder}/SimpleAppController.ts`);
    //copy over frontend apiabstract class
    (0, fs_1.copyFileSync)(`${constants.templatedir}/SimpleAppClient.eta`, `${targetfrontendfolder}/SimpleAppClient.ts`);
    //prepare backend config.ts
    //copy over frontend config.ts
};
const loadSimpleAppModules = (modules, targetfolder) => {
    const eta = new Eta({ views: constants.templatedir });
    const txtMainModule = eta.render('app.module.eta', modules);
    (0, fs_1.writeFileSync)(`${targetfolder}/src/app.module.ts`, txtMainModule);
};
//# sourceMappingURL=generate.js.map