import { exec ,spawn}  from "child_process";
import {writeFileSync} from 'fs'
import * as constants from './constant'
import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();

const { Eta } = require('eta');

const  checkNodeJS= (callback)=>{
    return  exec(`npx -v`,(error, stdout, stderr)=>{
        if(error){            
            throw ("Nodejs not exists")            
        }else{
            callback()
        }
    })
}

const checkNestCli = (callback)=>{
    log.info("setting up nest backend")
    return  exec(`npx -v`, (error, stdout, stderr)=>{
        if(error){            
            return  exec(`npm i -g @nestjs/cli`, (error, stdout, stderr)=>{
                callback()
            })
        }else{
            callback()
        }
    })
}
export const createNuxt= (targetfolder:string,callback)=>{
    log.info("setting up nuxt frontend ${targetfolder}")

    log.info(`frontend nuxt project "${targetfolder}" created, installing module`)
    exec(`cd ${targetfolder};mkdir plugins;pnpm install;pnpm install -D prettier`, (error, stdout, stderr)=>{                
    //;pnpm install    
    if(!error){
        exec(`pnpm install --save ajv ajv-formats primeflex primeicons primevue axios json-schema @simitgroup/simpleapp-doc-client@latest @simitgroup/simpleapp-vue-component@latest
        ;npm run format`, (error, stdout, stderr)=>{                
        const eta = new Eta({views: constants.templatedir});              
        const variables=[]            
        const txtEnv = eta.render('./nuxt.env.eta', variables);                
        writeFileSync(`${targetfolder}/.env`, txtEnv);
        const txtConfig = eta.render('./nuxt.config.eta', variables);                
        writeFileSync(`${targetfolder}/nuxt.config.ts`, txtConfig);
        const txtPlugins = eta.render('./nuxt.plugins.eta', variables);                
        writeFileSync(`${targetfolder}/plugins/simpleapp.ts`, txtPlugins);
        log.info("nuxt project completed")                
        callback()
        })
    }else{
        throw error
    }
    })         

}

export const createNest= (targetfolder:string,callback)=>{    
//   checkNestCli(()=>{                    

    log.info(`creating backend project ${targetfolder}`)
    exec(`cd ${targetfolder};pnpm install --save @nestjs/swagger @nestjs/mongoose mongoose  ajv ajv-formats @nestjs/config`,async (error, stdout, stderr)=>{
        // log.info(`dependency installed`)
        if(!error){
            exec(`pnpm install ajv ajv-formats axios json-schema`, (error, stdout, stderr)=>{                
            const eta = new Eta({views: constants.templatedir});              
            const variables=[]            
            const txtEnv = eta.render('./nest.env.eta', variables);                
            const txtMain = eta.render('./nest.main.eta', variables);                
            writeFileSync(`${targetfolder}/.env`, txtEnv);
            writeFileSync(`${targetfolder}/src/main.ts`, txtMain);
            log.info("nest project completed")                
            callback()
        })
        } else{
        log.error(stderr)
        throw error
        }
    })
    // 
// })                    

}