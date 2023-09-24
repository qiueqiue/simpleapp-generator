import * as constants from './constant'
import {readJsonSchemaBuilder} from './processors/jsonschemabuilder'
import {foreignkeys} from './storage'
import {TypeGenerateDocumentVariable,ChildModels,ModuleObject } from './type'
import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();
const clc = require("cli-color");
const path = require('path');
import {mkdirSync, readdir,readFileSync,writeFileSync,existsSync,copyFileSync, readdirSync} from 'fs'


const { Eta } = require('eta');
const { capitalizeFirstLetter }= require('./libs');
const X_DOCUMENT_TYPE='x-document-type'
const X_DOCUMENT_NAME='x-document-name'
const X_COLLECTION_NAME='x-collection-name'
const extFb = '.xfb.json';
const extHfb = '.xhfb.json';
const extjsonschema = '.jsonschema.json';
let jsonschemas = {};
const docs = [];
let frontendFolder=''
let backendFolder=''
let frontendpagefolder=''
let activatemodules:ModuleObject[]=[]
export const initialize =  async (defFolder:string,bpmnFolder:string,parabackendfolder:string,parafrontendfolder:string,callback:Function) => {
  frontendFolder=parafrontendfolder
  backendFolder=parabackendfolder
  frontendpagefolder = `${frontendFolder}/pages/[xorg]`  
  prepareEnvironments()
  

  //load build in schema for user and tenant
  const buildinschemafolder = `${constants.templatedir}/buildinschemas`
  const buildinschemas = readdirSync(buildinschemafolder)
  for(let i = 0; i< buildinschemas.length;i++){
    const file = buildinschemas[i]
    await processSchema(file,buildinschemafolder)
  }
  //load available bpmn into array
  const files = readdirSync(defFolder)
  for(let j = 0; j< files.length;j++){
    const file = files[j]
    await processSchema(file,defFolder)    
  }
  finalize(activatemodules)
  callback()
}

const processSchema=async (file:string,defFolder:string)=>{
  
    log.info(`Load `+clc.green(file))
    const filearr = file.split('.');
    let rendertype = 'basic';
    let docname = filearr[0].toLowerCase();
    let doctype = filearr[1].toLowerCase();
  
    const jsonstring = readFileSync(defFolder +path.sep+ file, 'utf-8');      
    let allmodels: ChildModels = {} as ChildModels;
    
    if (file.endsWith(extjsonschema)) {  
      const jsondata = JSON.parse(jsonstring);    
      rendertype = 'basic';
      jsonschemas[docname] = jsondata;
      allmodels = await readJsonSchemaBuilder(doctype, docname, jsondata,foreignkeys);
      generate(docname, doctype, rendertype, allmodels);        
      activatemodules.push({doctype:doctype,docname:capitalizeFirstLetter(docname)})
    } else {
      log.warn(`Load `+clc.yellow(file) + ` but it is not supported`)
    }      
}
  


const generate = (
  docname: string,
  doctype: string,
  rendertype: string,
  allmodels: ChildModels  
) => {
  const targetfolder = `${backendFolder}/src/generate/${doctype}`;
  const hooksfolder = `${backendFolder}/src/hooks`;
  try {
    
    mkdirSync(targetfolder,{ recursive: true });    
    mkdirSync(hooksfolder,{ recursive: true });
    mkdirSync(`${frontendFolder}/generate/docs/`,{ recursive: true });
    
    
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
    
    const variables:TypeGenerateDocumentVariable = {
      name: docname,
      doctype: doctype,
      models: allmodels,
      autocompletecode:allmodels[capitalizeFirstLetter(docname)].codeField,
      autocompletename:allmodels[capitalizeFirstLetter(docname)].nameField,
      moreAutoComplete:allmodels[capitalizeFirstLetter(docname)].moreAutoComplete,
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
      controllerCode:'',
      apiSchemaCode:'',
      docStatusSettings:allmodels[capitalizeFirstLetter(docname)].docStatusSettings,
      apiSettings:allmodels[capitalizeFirstLetter(docname)].apiSettings,
      requireautocomplete:allmodels[capitalizeFirstLetter(docname)].requireautocomplete,
      isolationtype:allmodels[capitalizeFirstLetter(docname)].isolationtype
    };

    const targetfiles = {
      './type':`${targetfolder}/${doctype}.type.ts`,
      './jsonschema':`${targetfolder}/${doctype}.jsonschema.ts`,
      './model':`${targetfolder}/${doctype}.model.ts`,
      './apischema':`${targetfolder}/${doctype}.apischema.ts`,
      './service':`${targetfolder}/${doctype}.service.ts`,
      './controller':`${targetfolder}/${doctype}.controller.ts`,
      './module':`${targetfolder}/${doctype}.module.ts`,
      './hook':`${hooksfolder}/${doctype}.hook.ts`,
      './simpleappclient.eta': `${frontendFolder}/generate/docs/${variables.typename}Client.ts`,
      './simpleappdoc.eta': `${frontendFolder}/simpleapp/${variables.typename}Doc.ts`,
      
    }
    const templates = Object.getOwnPropertyNames(targetfiles)
    for(let i=0;i<templates.length;i++){
      const sourcefile = templates[i]
      const targetfile = targetfiles[sourcefile]
      log.info("Writing:",targetfile)
      writeFileSync(targetfile,eta.render(sourcefile, variables));
    }    
    generateClientPage(variables,eta)    
    log.info(`- write completed: ${doctype}`)        
  }
};

const generateClientPage=(variables:TypeGenerateDocumentVariable,eta)=>{
  const docname = variables.name
  const targetfolder = `${frontendpagefolder}/${docname}`
  const overridefilename = `${targetfolder}/delete-me-for-avoid-override`
  if(!existsSync(targetfolder)){
    mkdirSync(targetfolder)
    writeFileSync(overridefilename,'delete this file to prevent override by generator')
  }
  if(existsSync(overridefilename)){
    const txtIndex=  eta.render('./pageindex.vue.eta', variables);
    const txtIndexwithid=  eta.render('./pageindexwithid.vue.eta', variables);
    writeFileSync(`${targetfolder}/index.vue`,txtIndex)
    writeFileSync(`${targetfolder}/[id].vue`,txtIndexwithid)
  }
}
const prepareEnvironments = ()=>{
  const backendClassFolder = `${backendFolder}/src/class`
  const targetfrontendfolder = `${frontendFolder}/server/api`
  mkdirSync(`${backendFolder}/src/dicts/`,{ recursive: true });
  mkdirSync(`${frontendFolder}/composables/`,{ recursive: true });
  mkdirSync(backendClassFolder,{recursive:true});
  mkdirSync(targetfrontendfolder,{recursive:true});
  mkdirSync(`${frontendFolder}/simpleapp`,{ recursive: true });
  mkdirSync(frontendpagefolder,{recursive:true})
  copyFileSync(`${constants.templatedir}/nest/SimpleAppService.eta`,`${backendClassFolder}/SimpleAppService.ts`)
  copyFileSync(`${constants.templatedir}/nest/SimpleAppController.eta`,`${backendClassFolder}/SimpleAppController.ts`)
  copyFileSync(`${constants.templatedir}/nest/Workflow.eta`,`${backendClassFolder}/Workflow.ts`)
  copyFileSync(`${constants.templatedir}/nest/TenantMiddleware.eta`,`${backendClassFolder}/TenantMiddleware.ts`)
  copyFileSync(`${constants.templatedir}/nest/UserProvider.eta`,`${backendClassFolder}/UserProvider.ts`)
  copyFileSync(`${constants.templatedir}/nest/SimpleAppExceptionFilter.eta`,`${backendClassFolder}/SimpleAppExceptionFilter.ts`)
  

  
}


const finalize=(modules:ModuleObject[])=>{
  log.info("Finalizing")
  
  const writefiles = {
    './nest/app.module.eta':`${backendFolder}/src/app.module.ts`,
    './nest/app.service.eta':`${backendFolder}/src/app.service.ts`,
    './nest/app.controller.eta':`${backendFolder}/src/app.controller.ts`,
    './nuxt/composables.getautocomplete.ts.eta':`${frontendFolder}/composables/getAutocomplete.ts`,
    './nuxt/composables.getmenus.ts.eta':`${frontendFolder}/composables/getMenus.ts`,
    './nuxt/composables.stringHelper.ts.eta':`${frontendFolder}/composables/stringHelper.ts`,
    './nuxt/composables.gettenant.ts.eta':`${frontendFolder}/composables/getTenant.ts`,    
    './nuxt/plugins.50.simpleapp-client.ts.eta':`${frontendFolder}/plugins/50.simpleapp-client.ts`
  };
  const eta = new Eta({views:constants.templatedir});
  const sources = Object.getOwnPropertyNames(writefiles)
  for(let i=0;i<sources.length;i++){
    const templatename = sources[i]
    const targetfile = writefiles[templatename]     
    log.info("write:",targetfile)
    writeFileSync(targetfile, eta.render(templatename, modules));
  }

  const foreignkeyfile =`${backendFolder}/src/dicts/foreignkeys.json`
  writeFileSync(foreignkeyfile, JSON.stringify(foreignkeys));
  log.info("write to foreignkey file ",foreignkeyfile)
  
  
}