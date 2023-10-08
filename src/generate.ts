import * as constants from './constant'
import {readJsonSchemaBuilder} from './processors/jsonschemabuilder'
import {foreignkeys} from './storage'
import {TypeGenerateDocumentVariable,ChildModels,ModuleObject } from './type'
import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();
const clc = require("cli-color");
const path = require('path');
import {mkdirSync, readdir,readFileSync,writeFileSync,existsSync,copyFileSync, readdirSync} from 'fs'
import _ from 'lodash'

const { Eta } = require('eta');
const { capitalizeFirstLetter }= require('./libs');
const X_DOCUMENT_TYPE='x-document-type'
const X_DOCUMENT_NAME='x-document-name'
const X_COLLECTION_NAME='x-collection-name'
const extFb = '.xfb.json';
const extHfb = '.xhfb.json';
const extjsonschema = '.jsonschema.json';
const extgroups = '.group.json';
let jsonschemas = {};
let configs:any = {}
const docs = [];
let frontendFolder=''
let backendFolder=''
let frontendpagefolder=''
const allroles:any={}
let activatemodules:ModuleObject[]=[]
let generateTypes:any = {}
export const run =  async (paraconfigs:any,callback:Function) => {
  configs = paraconfigs
  frontendFolder=configs.frontendFolder
  backendFolder=configs.backendFolder
  const groupFolder = configs.groupFolder
  
  generateTypes['nest']=backendFolder
  // generateTypes['nuxt']=frontendFolder
  frontendpagefolder = `${frontendFolder}/pages/[xorg]`  
  const buildinschemas = readdirSync(constants.buildinschemafolder)
  for(let i = 0; i< buildinschemas.length;i++){
    const file = buildinschemas[i]
    await processSchema(file,constants.buildinschemafolder)
  }
  // load available bpmn into array
  const files = readdirSync(configs.jsonschemaFolder)
  for(let j = 0; j< files.length;j++){
    const file = files[j]
    await processSchema(file,configs.jsonschemaFolder)    
  }
  //generate groups
  const systemgroups = readdirSync(`${groupFolder}`)
  for(let g = 0; g< systemgroups.length;g++){
    const groupfile = systemgroups[g]
    const groupjsonstr = readFileSync(`${groupFolder}/${groupfile}`, 'utf-8');      
    const groupdata = JSON.parse(groupjsonstr);
    const documentname = groupfile.split('.')[0]
    const roles = prepareRoles(groupdata)
    allroles[documentname]=roles
  }
  finalize(activatemodules)
  callback()
}
export const initialize =  async (defFolder:string,groupFolder:string,bpmnFolder:string,parabackendfolder:string,parafrontendfolder:string,callback:Function) => {
  frontendFolder=parafrontendfolder
  backendFolder=parabackendfolder
  generateTypes['nest']=backendFolder
  // generateTypes['nuxt']=frontendFolder
  frontendpagefolder = `${frontendFolder}/pages/[xorg]`  
  // prepareEnvironments()
  

  //load build in schema for user and tenant
  
  const buildinschemas = readdirSync(constants.buildinschemafolder)
  for(let i = 0; i< buildinschemas.length;i++){
    const file = buildinschemas[i]
    await processSchema(file,constants.buildinschemafolder)
  }
  // load available bpmn into array
  // const files = readdirSync(defFolder)
  // for(let j = 0; j< files.length;j++){
  //   const file = files[j]
  //   await processSchema(file,defFolder)    
  // }
  
  //generate group to role 
  // extgroups
  const systemgroups = readdirSync(`${groupFolder}`)
  
  for(let g = 0; g< systemgroups.length;g++){
    const groupfile = systemgroups[g]
    const groupjsonstr = readFileSync(`${groupFolder}/${groupfile}`, 'utf-8');      
    console.log(groupfile,groupjsonstr)
    const groupdata = JSON.parse(groupjsonstr);
    const documentname = groupfile.split('.')[0]
    const roles = prepareRoles(groupdata)
    allroles[documentname]=roles
  }
  finalize(activatemodules)
  callback()
}

const processSchema=async (file:string,defFolder:string)=>{
  
    
    const filearr = file.split('.');
    let rendertype = 'basic';
    let docname = filearr[0].toLowerCase();
    let doctype = filearr[1].toLowerCase();
  
    const jsonstring = readFileSync(defFolder +path.sep+ file, 'utf-8');      
    let allmodels: ChildModels = {} as ChildModels;
    
    if (file.endsWith(extjsonschema)) {  
      log.info(`Load `+clc.green(file))
      const jsondata = JSON.parse(jsonstring);    
      rendertype = 'basic';
      jsonschemas[docname] = jsondata;
      allmodels = await readJsonSchemaBuilder(doctype, docname, jsondata,foreignkeys);
      generateSchema(docname, doctype, rendertype, allmodels);        
      activatemodules.push({doctype:doctype,docname:capitalizeFirstLetter(docname),api:jsondata['x-document-api']})
    } else {
      // log.warn(`Load `+clc.yellow(file) + ` but it is not supported`)
    }      
}
  
/**
 * generate frontend nuxt and backend nest codes.
 * 
*/
const generateSchema = async( docname: string,
  doctype: string,
  rendertype: string,
  allmodels: ChildModels)=>{
    const simpleapptemplates = `${constants.templatedir}/basic`
    const finalizefolder = `${constants.templatedir}/nest`
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
      isolationtype:allmodels[capitalizeFirstLetter(docname)].isolationtype,      
    };

    const templatefolder = `${constants.templatedir}/${rendertype}`
    log.info(`- Generate ${docname}, ${doctype}, ${templatefolder}`)
    const eta = new Eta({
      views: '/',
      functionHeader:
        'const capitalizeFirstLetter = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);' +
        'const initType=(str)=>{return ["string","number","boolean","array","object"].includes(str) ? capitalizeFirstLetter(str) : str;}',
    });
    
    const backendTargetFolder = `${backendFolder}/src/simpleapp/generate`
    const backendServiceFolder = `${backendFolder}/src/simpleapp/services`    
    
    
    Object.getOwnPropertyNames(generateTypes).forEach((foldertype)=>{
      

      //generate code for every schema      
      const generateTemplatefolder = `${constants.templatedir}/basic/${foldertype}`    
      const allfiles = readdirSync(generateTemplatefolder,{recursive:true})      
      for(let j=0; j<allfiles.length;j++){
        const filename:string = String(allfiles[j])      
        const templatepath = `${generateTemplatefolder}/${filename}`
        const arrfilename:string[] = filename.split('.')
        const filecategory = arrfilename[0]
        const filetype = arrfilename[1]
          
        const autogeneratetypes = ['apischema','controller','jsonschema','model','processor','type']
        if(autogeneratetypes.includes(filecategory)){
          //multiple files in folder, append s at folder name
          const storein = `${backendTargetFolder}/${filecategory}s`  
          const targetfile = `${storein}/${doctype}.${filecategory}.${filetype}`
          if(!existsSync(storein)){
            mkdirSync(storein,{recursive:true})
          }                
          const filecontent = eta.render(templatepath, variables)     
          writeFileSync(targetfile,filecontent);
        }else if(filecategory=='service'){ //service file won't override if exists

          const targetfile = `${backendServiceFolder}/${doctype}.${filecategory}.${filetype}`
          if(!existsSync(backendServiceFolder)){
            mkdirSync(backendServiceFolder,{recursive:true})
          }         
          if(!existsSync(targetfile)){
            const filecontent = eta.render(templatepath, variables)     
            writeFileSync(targetfile,filecontent);
          }
          
        }      
      }
      

    })
    
   

}
const generate2 = (
  docname: string,
  doctype: string,
  rendertype: string,
  allmodels: ChildModels  
) => {
  const generatefolder = `${backendFolder}/src/generate`;
  const simpleappfolder = `${backendFolder}/src/simpleapp`;

  
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
      isolationtype:allmodels[capitalizeFirstLetter(docname)].isolationtype,      
    };

    const targetfiles = {
      './type': { target: `${generatefolder}/types/${doctype}.type.ts`, override:true},
      './jsonschema':{ target: `${generatefolder}/jsonschemas/${doctype}.jsonschema.ts`, override:true},
      './model':{ target: `${generatefolder}/models/${doctype}.model.ts`, override:true},
      './apischema':{ target: `${generatefolder}/apischemas/${doctype}.apischema.ts`, override:true},
      './processor':{ target: `${generatefolder}/processors/${doctype}.processor.ts`, override:true},
      './controller':{ target: `${generatefolder}/controllers/${doctype}.controller.ts`, override:true},
      './service':{ target: `${simpleappfolder}/${doctype}.service.ts`, override:false},
      

      // './simpleappclient.eta': { target: `${frontendFolder}/generate/docs/${variables.typename}Client.ts`, override:true},      
      // './simpleappdoc.eta': { target: `${frontendFolder}/simpleapp/${variables.typename}Doc.ts`, override:false},
      
      
    }

    const templates = Object.getOwnPropertyNames(targetfiles)
    for(let i=0;i<templates.length;i++){
      const sourcefile = templates[i]
      const targetsetting = targetfiles[sourcefile]
      const targetfile = targetsetting.target
      if(targetsetting.override==false && existsSync(targetfile)){
        log.warn(targetfile," exists, skip generate")
      }else{
        log.info("Writing:",targetfile)
        writeFileSync(targetfile,eta.render(sourcefile, variables));
      }
      
    }    


    //generateClientPage(variables,eta)    
    log.info(`- write completed: ${doctype}`)        
  
};

const generateClientPage=(variables:TypeGenerateDocumentVariable,eta)=>{
  const docname = variables.name
  log.warn("Write page",docname)
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
// const prepareEnvironments = ()=>{
//   const generatefolder = `${backendFolder}/src/generate`;
//   const simpleappservicefolder = `${backendFolder}/src/services`;  

//   const targetfrontendfolder = `${frontendFolder}/server/api`

  // mkdirSync(`${generatefolder}/commons/roles`,{ recursive: true });
  // mkdirSync(`${generatefolder}/commons/dicts`,{ recursive: true });
  // mkdirSync(`${generatefolder}/commons/middlewares`,{ recursive: true });
  // mkdirSync(`${generatefolder}/commons/providers`,{ recursive: true });
  
  // mkdirSync(`${generatefolder}/types`,{ recursive: true });
  // mkdirSync(`${generatefolder}/apischemas`,{ recursive: true });
  // mkdirSync(`${generatefolder}/jsonschemas`,{ recursive: true });
  // mkdirSync(`${generatefolder}/models`,{ recursive: true });
  // mkdirSync(`${generatefolder}/controllers`,{ recursive: true });
  // mkdirSync(`${generatefolder}/processors`,{ recursive: true });

  // mkdirSync(simpleappservicefolder,{ recursive: true });
  // mkdirSync(`${backendFolder}/src/dicts/`,{ recursive: true });
  // mkdirSync(`${backendFolder}/src/roles/`,{ recursive: true });
  // mkdirSync(`${backendFolder}/src/shares/`,{ recursive: true });


  // mkdirSync(`${frontendFolder}/generate/docs/`,{ recursive: true });
  // mkdirSync(`${frontendFolder}/composables/`,{ recursive: true });
  // mkdirSync(`${frontendFolder}/components/`,{ recursive: true });
  // mkdirSync(`${frontendFolder}/shares/`,{ recursive: true });
  // mkdirSync(targetfrontendfolder,{recursive:true});
  // mkdirSync(`${frontendFolder}/simpleapp`,{ recursive: true });
  // mkdirSync(`${frontendFolder}/middleware`,{ recursive: true });
  // mkdirSync(`${frontendFolder}/generate/docs`,{ recursive: true });  
  // mkdirSync(frontendpagefolder,{recursive:true})
  
  
// }

const finalize=(modules:ModuleObject[])=>{  
  const renderProperties = {
    configs:configs,
    modules:modules,
    allroles:allroles,
    foreignkeys:foreignkeys,
  }
  
  
  Object.getOwnPropertyNames(generateTypes).forEach((foldertype)=>{
      const frameworkpath = generateTypes[foldertype]
      log.info("Generate ",foldertype)
      const frameworkfolder = `${constants.templatedir}/${foldertype}`
      const frameworkfiles = readdirSync(frameworkfolder,{recursive:true})
      const eta = new Eta({views:frameworkfolder});
      
      //generate code for framework
      for(let index=0; index<frameworkfiles.length; index++){
        const longfilename:string = String(frameworkfiles[index])
        const patharr = longfilename.split('/')
        const filename = _.last(patharr)
        const arrfilename:string[] = filename.split('.')
        // log.info("check longfilename:::",longfilename,"become====",arrfilename)
        //only process .eta
        if(_.last(arrfilename)=='eta'){                    
          const relativepath = longfilename.includes('/') ? longfilename.replace(`/${filename}`,'') : ''
          const foldername = `${frameworkpath}/${relativepath}`
          const shortfilename = filename.replace('.eta','')
          const targetfilename = `${foldername}/${shortfilename}`
          if(!existsSync(foldername)){
            mkdirSync(foldername,{recursive:true})
          }
          const templatename = `${frameworkfolder}/${longfilename}`.replace(".eta","")
          log.info("Write template:",templatename, '----> ',targetfilename)
          const txt = eta.render(longfilename, renderProperties)
          writeFileSync(targetfilename,txt)
          
        }else{
          log.warn("skip: ",longfilename)
        }
        
        }
      })

}
const finalize2=(modules:ModuleObject[])=>{
  log.info("Finalizing")
  
  // copyFileSync(`${constants.templatedir}/nest/SimpleAppService.eta`,`${backendClassFolder}/SimpleAppService.ts`)
  
  const writefiles = {
    './nest/app.module.eta':`${backendFolder}/src/app.module.ts`,
    './nest/app.service.eta':`${backendFolder}/src/app.service.ts`,
    './nest/app.controller.eta':`${backendFolder}/src/app.controller.ts`,
    './nest/SimpleAppService.eta':`${backendFolder}/src/generate/commons/SimpleAppService.ts`,
    './nest/Workflow.eta':`${backendFolder}/src/generate/commons/Workflow.ts`,
    './nest/TenantMiddleware.eta':`${backendFolder}/src/generate/commons/TenantMiddleware.ts`,
    './nest/UserProvider.eta':`${backendFolder}/src/generate/commons/UserProvider.ts`,
    './nest/SimpleAppExceptionFilter.eta':`${backendFolder}/src/generate/commons/SimpleAppExceptionFilter.ts`,
    



    './nest/tenant.model.eta':`${backendFolder}/src/generate/tenant/tenant.model.ts`,
    './nest/tenant.service.eta':`${backendFolder}/src/generate/tenant/tenant.service.ts`,
    './nest/roles.enum.eta':`${backendFolder}/src/roles/roles.enum.ts`,
    './nest/roles.guard.eta':`${backendFolder}/src/roles/roles.guard.ts`,
    './nest/roles.decorator.eta':`${backendFolder}/src/roles/roles.decorator.ts`,
    // './nest/org.service.eta':`${backendFolder}/src/generate/org/org.service.ts`,
    './nest/user.service.eta':`${backendFolder}/src/generate/user/user.service.ts`,
    './nest/autoinc.service.eta':`${backendFolder}/src/generate/autoinc/autoinc.service.ts`,
    './nuxt/composables.getautocomplete.ts.eta':`${frontendFolder}/composables/getAutocomplete.ts`,
    './nuxt/composables.getmenus.ts.eta':`${frontendFolder}/composables/getMenus.ts`,
    './nuxt/composables.stringHelper.ts.eta':`${frontendFolder}/composables/stringHelper.ts`,
    './nuxt/composables.gettenant.ts.eta':`${frontendFolder}/composables/getTenant.ts`,    
    './nuxt/plugins.50.simpleapp-client.ts.eta':`${frontendFolder}/plugins/50.simpleapp-client.ts`,
    // './nuxt/tenant.appclient.ts.eta':`${frontendFolder}/generate/docs/TenantClient.ts`,
    './nuxt/pages.user.vue.eta':`${frontendFolder}/pages/[xorg]/user/index.vue`,
    './nuxt/pages.tenant.vue.eta':`${frontendFolder}/pages/[xorg]/tenant/index.vue`,
    './nuxt/pages.organization.vue.eta':`${frontendFolder}/pages/[xorg]/organization/index.vue`,
    './nuxt/pages.branch.vue.eta':`${frontendFolder}/pages/[xorg]/branch/index.vue`,
    './nuxt/middleware.10.acl.global.ts.eta':`${frontendFolder}/middleware/10.acl.global.ts`,
    
  };
  const eta = new Eta({views:constants.templatedir});
  const sources = Object.getOwnPropertyNames(writefiles)
  for(let i=0;i<sources.length;i++){
    const templatename = sources[i]
    const targetfile = writefiles[templatename]     
    log.info("write:",targetfile)
    writeFileSync(targetfile, eta.render(templatename, modules));
  }

  //prepare group to role mapping
  console.log("allroles",allroles)
  writeFileSync(`${backendFolder}/src/roles/roles.group.ts`, 
      eta.render('./nest/roles.group.eta', allroles));


  const foreignkeyfile =`${backendFolder}/src/dicts/foreignkeys.json`
  writeFileSync(foreignkeyfile, JSON.stringify(foreignkeys));
  log.info("write to foreignkey file ",foreignkeyfile)
 
  
}


const prepareRoles =(groupsettings) => {
  let roles = []
  const docnames = Object.getOwnPropertyNames(groupsettings)
  for(let i = 0; i< docnames.length; i++){
    let docname = docnames[i]
    let docpermissions:string[] = groupsettings[docname]
    for(let j=0;j<docpermissions.length;j++){
      const perm = docpermissions[j]
      const typename = _.upperFirst(docname)
      roles.push(`${typename}_${perm}`)
    }
  }
  return roles
}