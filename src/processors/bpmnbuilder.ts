import {mkdirSync, readdir,readFileSync,writeFileSync,existsSync,copyFileSync, readdirSync} from 'fs'
import * as constants from '../constant'

export const  generateWorkflows = async (configs) =>{
    const frontendFolder=configs.frontendFolder
    const backendFolder=configs.backendFolder
    const workflows = readdirSync(`${configs.workflowFolder}`)
    for(let w = 0; w< workflows.length;w++){
      const bpmnfile = workflows[w]


      const xmlstring = readFileSync(`${configs.workflowFolder}/${bpmnfile}`, 'utf-8');      
        





      //copy workflow definition file to frontend and backend    
      copyFileSync(`${configs.workflowFolder}/${bpmnfile}`,`${frontendFolder}/simpleapp/workflows/bpmn/${bpmnfile}`)
      copyFileSync(`${configs.workflowFolder}/${bpmnfile}`,`${backendFolder}/src/simpleapp/workflows/bpmn/${bpmnfile}`)
  
      
      
  
      //copy file backend
      //copy file frontend
  
  
      // const groupdata = JSON.parse(groupjsonstr);
      // const documentname = groupfile.split('.')[0]
      // const roles = prepareRoles(groupdata)
      // allroles[documentname]=roles
    }
  }