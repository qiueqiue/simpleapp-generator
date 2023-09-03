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
exports.createNest = exports.createNuxt = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const constants = __importStar(require("./constant"));
const tslog_1 = require("tslog");
const log = new tslog_1.Logger();
const { Eta } = require('eta');
const checkNodeJS = (callback) => {
    return (0, child_process_1.exec)(`npx -v`, (error, stdout, stderr) => {
        if (error) {
            throw ("Nodejs not exists");
        }
        else {
            callback();
        }
    });
};
const checkNestCli = (callback) => {
    log.info("setting up nest backend");
    return (0, child_process_1.exec)(`npx -v`, (error, stdout, stderr) => {
        if (error) {
            return (0, child_process_1.exec)(`npm i -g @nestjs/cli`, (error, stdout, stderr) => {
                callback();
            });
        }
        else {
            callback();
        }
    });
};
const createNuxt = (targetfolder, callback) => {
    log.info("setting up nuxt frontend ${targetfolder}");
    log.info(`frontend nuxt project "${targetfolder}" created, installing module`);
    (0, child_process_1.exec)(`cd ${targetfolder};pnpm install;pnpm install -D @types/node prettier @nuxtjs/tailwindcss`, (error, stdout, stderr) => {
        //;pnpm install    
        console.log(error, stdout, stderr);
        (0, child_process_1.exec)(`cd ${targetfolder};pnpm install --save ajv ajv-formats primeflex primeicons prettier primevue axios json-schema mitt @simitgroup/simpleapp-vue-component@latest`, (error, stdout, stderr) => {
            (0, fs_1.mkdirSync)(`${targetfolder}/assets/css/`, { recursive: true });
            (0, fs_1.mkdirSync)(`${targetfolder}/layouts`, { recursive: true });
            (0, fs_1.mkdirSync)(`${targetfolder}/components`, { recursive: true });
            (0, fs_1.mkdirSync)(`${targetfolder}/server/api`, { recursive: true });
            (0, fs_1.mkdirSync)(`${targetfolder}/pages`, { recursive: true });
            (0, fs_1.mkdirSync)(`${targetfolder}/plugins`, { recursive: true });
            const eta = new Eta({ views: `${constants.templatedir}/nuxt` });
            const variables = [];
            const writes = {
                './app.vue.eta': 'app.vue',
                './components.eventmonitor.vue.eta': 'components/EventMonitor.vue',
                './components.menus.vue.eta': 'components/Menus.vue',
                './components.crudsimple.vue.eta': 'components/CrudSimple.vue',
                './components.debugdocdata.vue.eta': 'components/DebugDocumentData.vue',
                './layouts.default.vue.eta': 'layouts/default.vue',
                './server.api.ts.eta': 'server/api/[...].ts',
                './nuxt.config.ts.eta': 'nuxt.config.ts',
                './pages.index.vue.eta': 'pages/index.vue',
                './plugins.simpleapp.ts.eta': 'plugins/simpleapp.ts',
                './tailwind.config.ts.eta': 'tailwind.config.ts',
                './tailwind.css.eta': 'assets/css/tailwind.css',
                './env.eta': '.env',
            };
            const templates = Object.getOwnPropertyNames(writes);
            for (let i = 0; i < templates.length; i++) {
                const template = templates[i];
                const filename = writes[template];
                const txt = eta.render(template, variables);
                const file = `${targetfolder}/${filename}`;
                log.info("writing ", file);
                (0, fs_1.writeFileSync)(file, txt);
            }
            log.info("nuxt project completed");
            callback();
        });
    });
};
exports.createNuxt = createNuxt;
const createNest = (targetfolder, callback) => {
    //   checkNestCli(()=>{                    
    log.info(`creating backend project ${targetfolder}`);
    (0, child_process_1.exec)(`cd ${targetfolder};pnpm install --save @nestjs/swagger @nestjs/mongoose mongoose  ajv ajv-formats @nestjs/config`, async (error, stdout, stderr) => {
        // log.info(`dependency installed`)
        if (!error) {
            (0, child_process_1.exec)(`pnpm install ajv ajv-formats axios json-schema`, (error, stdout, stderr) => {
                const eta = new Eta({ views: constants.templatedir });
                const variables = [];
                const txtEnv = eta.render('./nest.env.eta', variables);
                const txtMain = eta.render('./nest.main.eta', variables);
                (0, fs_1.writeFileSync)(`${targetfolder}/.env`, txtEnv);
                (0, fs_1.writeFileSync)(`${targetfolder}/src/main.ts`, txtMain);
                log.info("nest project completed");
                callback();
            });
        }
        else {
            log.error(stderr);
            throw error;
        }
    });
    // 
    // })                    
};
exports.createNest = createNest;
//# sourceMappingURL=createproject.js.map