import { Logger, ILogObj } from "tslog";
import { capitalizeFirstLetter } from './../libs';
import {mkdirSync, readdir,readFileSync,writeFileSync,existsSync,copyFileSync, readdirSync} from 'fs'
import BpmnModdle from 'bpmn-moddle';
import _ from 'lodash'
import * as constants from '../constant'
import {moddleOptions} from '../resource/camunda-moodle'
const log: Logger<ILogObj> = new Logger();
const { Eta } = require('eta');
export const  generateWorkflows = async (configs,genFor:string[]) =>{
    const invalidDelegate = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    const moddle = new BpmnModdle({moddleOptions});
    const frontendFolder=configs.frontendFolder
    const backendFolder=configs.backendFolder
    const bpmnFolder = configs.bpmnFolder
    const filelist = readdirSync(bpmnFolder)
    
    console.log("filelist",filelist)
    const generateTemplatefolder = `${constants.templatedir}/workflow`        
    let workflows:string[] = []

    if(genFor.includes('nest')){
        mkdirSync(`${backendFolder}/src/simpleapp/workflows/bpmn`,{recursive:true})
        mkdirSync(`${backendFolder}/src/simpleapp/workflows/delegates`,{recursive:true})
    }
    if(genFor.includes('nuxt')){
        mkdirSync(`${frontendFolder}/simpleapp/workflows/bpmn`,{recursive:true})
        mkdirSync(`${frontendFolder}/simpleapp/workflows/forms`,{recursive:true})
        copyFormKeys(`${bpmnFolder}/../forms`,`${frontendFolder}/simpleapp/workflows/forms`)
    }

    for(let w = 0; w< filelist.length;w++){
      const bpmnfile = filelist[w]      
      if(bpmnfile=='.'){
        continue
      }
      const bpmnfilepath = `${bpmnFolder}/${bpmnfile}`
      const processName = bpmnfile.split('.')[0]
    
    const xmlstring = readFileSync(`${bpmnfilepath}`, 'utf-8');      

      const xmlobj = await moddle.fromXML(xmlstring);
      const elements = xmlobj.rootElement.rootElements[0].flowElements
      let delegates:string[]=[]
      for(let i=0; i<elements.length;i++){
        const e = elements[i]
        
        switch(e.$type){
            case 'bpmn:UserTask':             
                const setting = e.get('extensionElements')       
                if(setting && setting.values){
                    for(let j=0;j<setting.values.length;j++){
                        const s = setting.values[j]
                        if(s.$type=='camunda:taskListener'){
                            if(!invalidDelegate.test(s.delegateExpression)){
                                delegates.push(s.delegateExpression)
                            }else{
                                log.error(`bpmn File : ${bpmnfile} -> UserTask(${s.name}/${s.id}) defined invalid symbol in delegate Expression: "${s.delegateExpression}"`);
                                throw "quite"
                            }
                            
                        }
                        
                    }
                    
                }
                console.log("Element user task type", e.$type, ", id:",e.id, setting)
            break;
            case 'bpmn:ServiceTask':                
                console.log("Element service type", e.$type, ", id:",e.id)    
                if(!invalidDelegate.test(e.delegateExpression)){
                        delegates.push(e.delegateExpression)
                }else{
                    log.error(`bpmn File : ${bpmnfile} -> ServiceTask(${e.name}/${e.id}) defined invalid symbol in delegate Expression: "${e.delegateExpression}"`);
                    throw "quite"
                }
                
            break;
        }
      }
      
      delegates = _.uniq(delegates)
      const variables = {
        processName: capitalizeFirstLetter(processName),
        delegates: delegates
      }
    //   console.log("sample--------sample",xmlobj.rootElement.rootElements[0].name, )

      //copy workflow definition file to frontend and backend    
      if(genFor.includes('nest')){
        copyFileSync(`${bpmnfilepath}`,`${backendFolder}/src/simpleapp/workflows/bpmn/${bpmnfile}`)
        const targetdelegate = `${backendFolder}/src/simpleapp/workflows/delegates/${processName}.delegate.ts`

        const eta = new Eta({
            views: '/',
            functionHeader: getCodeGenHelper()
        });
        if(!existsSync(targetdelegate) || readFileSync(targetdelegate, 'utf-8').includes('--remove-this-line-to-prevent-override--')){
        //     //write something
            const templatepath = `${generateTemplatefolder}/next/delegate.ts.eta`        
            const filecontent = eta.render(templatepath, variables)     
            writeFileSync(targetdelegate,filecontent)
        }
      }
      if(genFor.includes('nuxt')){
        copyFileSync(`${bpmnfilepath}`,`${frontendFolder}/simpleapp/workflows/bpmn/${bpmnfile}`)  

        //create form key
      }
      
      
      
      


      workflows.push(processName)

      //modify workflowdeletegate to import all files
      
      
  
      //copy file backend
      //copy file frontend
  
  
      // const groupdata = JSON.parse(groupjsonstr);
      // const documentname = groupfile.split('.')[0]
      // const roles = prepareRoles(groupdata)
      // allroles[documentname]=roles
    }



    return workflows
  }
  const copyFormKeys=(fromtPath:string , toPath:string)=>{
    const files = readdirSync(fromtPath)
    for(let i=0; i< files.length;i++){
        const filename = files[i]
        if(filename=='.') continue

        copyFileSync(`${fromtPath}/${filename}`,`${toPath}/${filename}`)
    }
  }
  const getCodeGenHelper = () => 'const capitalizeFirstLetter = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);' +
  'const initType=(str)=>{return ["string","number","boolean","array","object"].includes(str) ? capitalizeFirstLetter(str) : str;};' +
  'const camelCaseToWords = (s) => {const result = s.replace(/([A-Z])/g, \' $1\');return result.charAt(0).toUpperCase() + result.slice(1);}'