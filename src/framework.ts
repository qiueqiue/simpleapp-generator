import fs from 'fs'
import {spawn,exec} from "child_process"
import { Logger, ILogObj } from "tslog";
import * as constants from './constant'
import  {Eta}  from 'eta';
const log: Logger<ILogObj> = new Logger();

export let backendFolder='';
export let frontendFolder='';
//create empty nest project
export const runCreateNest= (bkFolder:string,callback:Function) =>{
    backendFolder=bkFolder
    if(!fs.existsSync(backendFolder)){
        const child = spawn('npm',['install','-g','pnpm', '@nestjs/cli', '@openapitools/openapi-generator-cli', 'nuxi'],
                        {  stdio: 'inherit',})
        child.on('close',(exitCode)=>{            
            const child2 = spawn('nest',['new', '-p', 'pnpm', backendFolder],{  stdio: "inherit"})
            child2.on('close',(exitCode)=>{                
                callback()
            })
        })        
    }else{
        callback()
    }
}
//create empty nuxt project
export const runCreateNuxt = (fefolder:string,callback:Function) =>{
    frontendFolder=fefolder
    if(!fs.existsSync(frontendFolder)){
        const child3 = spawn('npx',['nuxi@latest','init',frontendFolder],{  stdio: 'inherit',})
        child3.on('close',(exitCode)=>{ 
            callback()
        })
    }else{
        callback()
    }
}

export const prepareNest = (targetfolder:string,callback:Function)=>{

    log.info(`creating backend project ${targetfolder}`)
    exec(`cd ${targetfolder};pnpm install --save @nestjs/swagger @nestjs/mongoose mongoose  ajv ajv-formats @nestjs/config`,async (error, stdout, stderr)=>{
        // log.info(`dependency installed`)
        if(!error){
            exec(`pnpm install ajv ajv-formats axios json-schema`, (error, stdout, stderr)=>{                
            const eta = new Eta({views: constants.templatedir});              
            const variables=[]            
            const txtEnv = eta.render('./nest.env.eta', variables);                
            const txtMain = eta.render('./nest.main.eta', variables);   

            fs.writeFileSync(`${targetfolder}/.env`, txtEnv);
            fs.writeFileSync(`${targetfolder}/src/main.ts`, txtMain);            
            const tsconfigpath = process.cwd()+'/'+`${targetfolder}/tsconfig.json`
            const tsconfig = require(tsconfigpath)
            tsconfig.compilerOptions.esModuleInterop=true
            tsconfig.compilerOptions.resolveJsonModule=true
            fs.writeFileSync(tsconfigpath, JSON.stringify(tsconfig));

            log.info("nest project completed")                
            callback()
        })
        } else{
        log.error(stderr)
        throw error
        }
    })
}
//prepare nuxt project for simpleapp generator
export const prepareNuxt = (targetfolder:string,callback:Function)=>{
    if(!fs.existsSync(`${targetfolder}/.env`)){
        //asume no environment. prepare now
        exec(`cd ${targetfolder};pnpm install;pnpm install -D @types/node @vueuse/nuxt @sidebase/nuxt-auth @vueuse/core nuxt-security prettier @nuxtjs/tailwindcss`, (error, stdout, stderr)=>{                
            //;pnpm install    
            console.log(error, stdout, stderr)
                exec(`cd ${targetfolder};pnpm install --save ajv dotenv @fullcalendar/core @fullcalendar/vue3 quill uuid ajv-formats primeflex primeicons prettier primevue axios json-schema mitt @simitgroup/simpleapp-vue-component@latest`, (error, stdout, stderr)=>{                
                console.log(error, stdout, stderr)
                
                fs.mkdirSync(`${targetfolder}/assets/css/`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/layouts`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/components`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/server/api`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/pages`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/plugins`,{recursive:true})
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
                    fs.writeFileSync(file, txt);    
                }
               
                log.info("nuxt project completed")                
                callback()
                })
            
            })       
    }else{
        //assume environment ready
        callback()
    }
}

export const prettyNuxt = (frontendFolder:string)=>{
    exec(`cd ${frontendFolder};npx prettier --write "./pages/**/*.vue" "./simpleapp/**/*" `)
                        
}
export const prettyNest = (backendFolder:string)=>{
    exec(`cd ${backendFolder};npx run format `)
}

export const prepareOpenApiClient = (openapi3Yaml:string,frontendFolder:string) => {
    exec(`openapi-generator-cli generate -i ${openapi3Yaml} -o ${frontendFolder}/simpleapp/openapi -g typescript-axios --skip-validate-spec`)
}