import { exec }  from "child_process";
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
    log.info("setting up nuxt frontend")
     checkNodeJS( ()=>{  
        log.info("Nodejs ok")          
        exec(`npx nuxi@latest init  ${targetfolder}`, (error, stdout, stderr)=>{  
          log.info(`frontend nuxt project "${targetfolder}" created, installing module`)
            exec(`cd ${targetfolder};pnpm install`, (error, stdout, stderr)=>{                
            //;pnpm install
            if(!error){
              exec(`pnpm install ajv ajv-formats axios json-schema`, (error, stdout, stderr)=>{                
                const eta = new Eta({views: constants.templatedir});              
                const variables=[]            
                const txtEnv = eta.render('./nuxt.env.eta', variables);                
                writeFileSync(`${targetfolder}/.env`, txtEnv);
                log.info("nuxt project completed")                
                callback()
              })
            }else{
                throw error
            }

          })         
        if(error){
            log.error(stderr)
            throw error
        }
        
      })
    })
}

export const createNest= (targetfolder:string,callback)=>{    
  checkNestCli(()=>{                    
        exec(`nest new -p pnpm ${targetfolder}`,(error, stdout, stderr)=>{
        if(error)throw stderr

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
        })                    
    })
//install nestjs cli
  //create nest project
  //install dependency
  //create empty .env 
  //swap nestjs src/main.ts file
  //try edit the configuration files
  //console log http server how to start
}