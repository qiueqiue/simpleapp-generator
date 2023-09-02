// import { readFormBuilder } from './processors/formbuilder.tsa';
// import { readJsonSchemaBuilder } from './processors/jsonschemabuilder';
import * as constants from './constant'
import {readJsonSchemaBuilder} from './processors/jsonschemabuilder'
import {foreignkeys} from './storage'
// import { compile } from 'json-schema-to-typescript';
// import { Fieldtypes, SchemaModel, ChildModels } from './type';
import { TypeForeignKeyCatalogue,  ChildModels,ModuleObject } from './type'
import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();
const clc = require("cli-color");


const path = require('path');
import {mkdirSync,readdir,readFileSync,writeFileSync,existsSync,copyFileSync, readdirSync} from 'fs'
const { Eta } = require('eta');
const { capitalizeFirstLetter }= require('./libs');
const extFb = '.xfb.json';
const extHfb = '.xhfb.json';
const extjsonschema = '.jsonschema.json';
let jsonschemas = {};
const docs = [];

export const initialize =  async (defFolder:string,backendfolder:string,frontendfolder:string) => {
  prepareEnvironments(backendfolder,frontendfolder)
  let activatemodules:ModuleObject[]=[]
  // 
  const files = readdirSync(defFolder)
  // readdir(defFolder, (err, files) => {
    // files.forEach((file) => {
    for(let j = 0; j< files.length;j++){
      const file = files[j]
      const filearr = file.split('.');
      let rendertype = 'basic';
      const docname = filearr[0].toLowerCase();
      const doctype = filearr[1].toLowerCase();
      const jsonstring = readFileSync(defFolder +path.sep+ file, 'utf-8');
      const jsondata = JSON.parse(jsonstring);
      let allmodels: ChildModels = {} as ChildModels;
      
      if (file.endsWith(extjsonschema)) {
        log.info(`Load `+clc.green(file))
        rendertype = 'basic';
        jsonschemas[docname] = jsondata;
        // foreignkeys:
        // tmpforeignkeys:TypeForeignKey
        allmodels = await readJsonSchemaBuilder(doctype, docname, jsondata,foreignkeys);
         
        //foreignkeycatalogues
        // foreignkeys
        generate(docname, doctype, rendertype, allmodels,backendfolder,frontendfolder);        
        activatemodules.push({doctype:doctype,docname:capitalizeFirstLetter(docname)})
      } else {
        log.warn(`Load `+clc.yellow(file) + ` but it is not supported`)
      }      
    }
    // log.warn("foreignkeys---",foreignkeys)
    log.info("Activated backend modules: ",activatemodules)
    // log.info(activatemodules)
    finalize(activatemodules,backendfolder)
    return Promise.resolve(true)
  }
  


const generate = (
  docname: string,
  doctype: string,
  rendertype: string,
  allmodels: ChildModels,
  backendfolder:string,
  frontendfolder:string
) => {
  const targetfolder = `${backendfolder}/src/docs/${doctype}`;
  
  try {
    
    mkdirSync(targetfolder,{ recursive: true });    
    mkdirSync(`${frontendfolder}/server/docs/`,{ recursive: true });
    
  } catch (err) {
    //do nothing if folder exists
  } finally {
    const templatefolder = `${constants.templatedir}/${rendertype}`
    log.info(`- Generate ${docname}, ${doctype}, ${templatefolder}`)
    const eta = new Eta({
      views: templatefolder,
      functionHeader:
        'const capitalizeFirstLetter = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);' +
        'const initType=(str)=>{return ["string","number","boolean","array","object"].includes(str) ? capitalizeFirstLetter(str) : str;}',
    });
    
    const variables = {
      name: docname,
      doctype: doctype,
      models: allmodels,
      autocompletecode:allmodels[capitalizeFirstLetter(docname)].codeField,
      autocompletename:allmodels[capitalizeFirstLetter(docname)].nameField,
      schema: allmodels[capitalizeFirstLetter(docname)].model,
      apiSchemaName: capitalizeFirstLetter(docname), //capitalizeFirstLetter(doctype) + 'ApiSchema',
      typename: capitalizeFirstLetter(docname),
      fullApiSchemaName:
        doctype + 'apischema.' + capitalizeFirstLetter(docname),
      fullTypeName: doctype + 'type.' + capitalizeFirstLetter(docname),
      jsonschema: jsonschemas[docname],
      bothEndCode: '',
      frontEndCode: '',
      backEndCode: '',
      controllerCode:''
    };

    // console.log('generate 2', JSON.stringify(variables));

    // // const txtUISchema = eta.render('./uischema', variables);

    // console.log('generate 4');
    // console.log('generate 2', variables);
    const txtType = eta.render('./type', variables);
    writeFileSync(`${targetfolder}/${doctype}.type.ts`, txtType);
    // compile(jsonschemas[docname], docname).then((txtType: string) => {
    //   writeFileSync(`${targetfolder}/${doctype}.type.ts`, txtType);
    // });

    // generate jsonschema object, use for data validation
    const txtJsonSchema = eta.render('./jsonschema', variables);
    writeFileSync(`${targetfolder}/${doctype}.jsonschema.ts`, txtJsonSchema);

    // generate before save source code, wont override after regenerate
    const customizefilename = `${targetfolder}/${doctype}.beforesave.ts`;
    if (!existsSync(customizefilename)) {
      const txtBeforeSave = eta.render('./beforesave', variables);
      writeFileSync(
        `${targetfolder}/${doctype}.beforesave.ts`,
        txtBeforeSave,
      );
    }
    // write mongoose model file
    const txtModel = eta.render('./model', variables);
    writeFileSync(`${targetfolder}/${doctype}.model.ts`, txtModel);

    // prepare openapi schema
    const txtApiSchema = eta.render('./apischema', variables);
    writeFileSync(`${targetfolder}/${doctype}.apischema.ts`, txtApiSchema);

    // prepare backend classes
    // prepare frontend api client

    const servicefile = `${targetfolder}/${doctype}.service.ts`;
    let bothEndCode = '';
    let backEndCode = '';
    if (existsSync(servicefile)) {
      const servicecodes = readFileSync(servicefile).toString();

      /* extract string bothend and backend, put in back */
      const regex1 =
        /\/\/<begin-bothend-code>([\s\S]*?)\/\/<end-bothend-code>/g;
      const regex2 =
        /\/\/<begin-backend-code>([\s\S]*?)\/\/<end-backend-code>/g;
      const bothendresult = servicecodes.match(regex1);
      const backendresult = servicecodes.match(regex2);
      if (bothendresult) {
        bothEndCode = bothendresult[0];
      }

      if (backendresult) {
        backEndCode = backendresult[0];
      }
    }

    variables.bothEndCode = bothEndCode ?? "//<begin-bothend-code>\n//<end-bothend-code>";
    variables.backEndCode = backEndCode ?? "//<begin-backend-code>\n//<end-backend-code>";
    const txtService = eta.render('./service', variables);
    writeFileSync(`${targetfolder}/${doctype}.service.ts`, txtService);

    // prepare api router, allow add more api and wont override after regenerate
    const controllerfile = `${targetfolder}/${doctype}.controller.ts`;
    let controllerCode = ''
    if (existsSync(controllerfile)) {
      /* extract customized controller, put in back */
      const controllersourcecodes = readFileSync(controllerfile).toString();        
      const controllerregex = /\/\/<begin-controller-code>([\s\S]*?)\/\/<end-controller-code>/g;
      const controllerresult = controllersourcecodes.match(controllerregex);
      if (controllerresult) {
        controllerCode = controllerresult[0];
      }
    }
    variables.controllerCode = controllerCode!='' ? controllerCode : "\n//<begin-controller-code>\n//<end-controller-code>";
    const txtController = eta.render('./controller', variables);
    writeFileSync(controllerfile, txtController);

    // prepare module
    const txtModule = eta.render('./module', variables);
    writeFileSync(`${targetfolder}/${doctype}.module.ts`, txtModule);

    // prepare readme
    const txtReadme = eta.render('./readme', variables);
    writeFileSync(`${targetfolder}/README.md`, txtReadme);

    const frontendfile = `${frontendfolder}/server/docs/${variables.typename}Doc.ts`;
    let frontEndCode = '';
    if (existsSync(frontendfile)) {
      const clientcodes = readFileSync(frontendfile).toString();

      /* extract string frontend code, put in back */
      const regex3 =
        /\/\/<begin-frontend-code>([\s\S]*?)\/\/<end-frontend-code>/g;

      const frontendresult = clientcodes.match(regex3);

      if (frontendresult) {
        frontEndCode = frontendresult[0];
      }
    }
    variables.frontEndCode = frontEndCode ?? '';
    const txtDocClient = eta.render('./apiclient', variables);
    writeFileSync(frontendfile, txtDocClient);

    // // fs.writeFileSync(`${targetfolder}/${doctype}.uischema.ts`, txtUISchema);
    log.info(`- write completed: `+clc.green(doctype))
    
    //create type
    //create service
    //create controller
    //create module
    //create apischema
    //create beforesave if not exists
    // console.log(schema, res);
  }
};

const prepareEnvironments = (backendfolder:string,frontendfolder:string)=>{
  const targetfolder = `${backendfolder}/src/class`
  const targetfrontendfolder = `${frontendfolder}/server/api`
  try{
    mkdirSync(targetfolder,{recursive:true});
    mkdirSync(targetfrontendfolder,{recursive:true});
  }catch(error){
    //do nothing
  }
  
  //copy over backend service class
  
  copyFileSync(`${constants.templatedir}/SimpleAppService.eta`,`${targetfolder}/SimpleAppService.ts`)
  
  //copy over backend controller
  copyFileSync(`${constants.templatedir}/SimpleAppController.eta`,`${targetfolder}/SimpleAppController.ts`)

  //copy over frontend apiabstract class
  copyFileSync(`${constants.templatedir}/nuxt.apigateway.eta`,`${targetfrontendfolder}/[...].ts`)

    //prepare backend config.ts

  //copy over frontend config.ts
}


const finalize=(modules:ModuleObject[],backendfolder:string)=>{
  log.info("Finalizing foreignkey:",foreignkeys)
  mkdirSync(`${backendfolder}/src/dicts/`,{ recursive: true });
  const eta = new Eta({views:constants.templatedir});
  const txtMainModule = eta.render('app.module.eta', modules);
  writeFileSync(`${backendfolder}/src/app.module.ts`, txtMainModule);

  const foreignkeyfile =`${backendfolder}/src/dicts/foreignkeys.json`
  writeFileSync(foreignkeyfile, JSON.stringify(foreignkeys));
  console.log("write to foreignkey file ",foreignkeyfile)
  

}