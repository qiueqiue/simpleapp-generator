import { exec ,spawn}  from "child_process";
import {mkdirSync, writeFileSync} from 'fs'
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

export const installDependency = async () =>{
    log.info("installDependency 'npm install -g pnpm @nestjs/cli @openapitools/openapi-generator-cli nuxi'")
    return await exec("npm install -g pnpm @nestjs/cli @openapitools/openapi-generator-cli nuxi")
}
export const createNuxt= (targetfolder:string,callback)=>{
    log.info("setting up nuxt frontend ${targetfolder}")

    log.info(`frontend nuxt project "${targetfolder}" created, installing module`)
    exec(`cd ${targetfolder};pnpm install;pnpm install -D @types/node @vueuse/nuxt @sidebase/nuxt-auth @vueuse/core nuxt-security prettier @nuxtjs/tailwindcss`, (error, stdout, stderr)=>{                
    //;pnpm install    
    console.log(error, stdout, stderr)
        exec(`cd ${targetfolder};pnpm install --save ajv dotenv @fullcalendar/core @fullcalendar/vue3 quill uuid ajv-formats primeflex primeicons prettier primevue axios json-schema mitt @simitgroup/simpleapp-vue-component@latest`, (error, stdout, stderr)=>{                
        console.log(error, stdout, stderr)
        
        mkdirSync(`${targetfolder}/assets/css/`,{recursive:true})
        mkdirSync(`${targetfolder}/layouts`,{recursive:true})
        mkdirSync(`${targetfolder}/components`,{recursive:true})
        mkdirSync(`${targetfolder}/server/api`,{recursive:true})
        mkdirSync(`${targetfolder}/pages`,{recursive:true})
        mkdirSync(`${targetfolder}/plugins`,{recursive:true})
        const eta = new Eta({views: `${constants.templatedir}/nuxt`});              
        const variables=[]            
        const writes = {
            './app.vue.eta':'app.vue',            
            './components.eventmonitor.vue.eta':'components/EventMonitor.vue',
            './components.menus.vue.eta':'components/Menus.vue',
            './components.crudsimple.vue.eta':'components/CrudSimple.vue',            
            './components.debugdocdata.vue.eta':'components/DebugDocumentData.vue',            
            './layouts.default.vue.eta':'layouts/default.vue',
            './server.api.ts.eta':'server/api/[...].ts',
            './nuxt.config.ts.eta':'nuxt.config.ts',
            './pages.index.vue.eta':'pages/index.vue',
            './plugins.simpleapp.ts.eta':'plugins/simpleapp.ts',
            './tailwind.config.ts.eta':'tailwind.config.ts',
            './tailwind.css.eta':'assets/css/tailwind.css',
            './env.eta':'.env',
        }

        const templates = Object.getOwnPropertyNames(writes)
        for(let i=0; i<templates.length;i++){
            const template = templates[i]
            const filename = writes[template]
            const txt = eta.render(template, variables);                
            const file =`${targetfolder}/${filename}`
            log.info("writing ",file)
            writeFileSync(file, txt);    
        }
       
        log.info("nuxt project completed")                
        callback()
        })
    
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
            const tsconfigpath = process.cwd()+'/'+`${targetfolder}/tsconfig.json`
            const tsconfig = require(tsconfigpath)
            tsconfig.compilerOptions.esModuleInterop=true
            tsconfig.compilerOptions.resolveJsonModule=true
            writeFileSync(tsconfigpath, JSON.stringify(tsconfig));

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