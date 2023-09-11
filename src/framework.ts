import fs from 'fs'
import {spawn,exec} from "child_process"
import { Logger, ILogObj } from "tslog";
import * as constants from './constant'
import  {Eta}  from 'eta';
const log: Logger<ILogObj> = new Logger();

let config = {
    "definationsFolder":"./definations",
    "backendFolder":"./mybackend", 
    "backendPort":"8000",
    "mongoConnectStr":'mongodb://<user>:<pass>@<host>:<port>/<db>?authMechanism=DEFAULT',
    "frontendFolder":"./myfrontend",
    "frontendPort":"8080",
    "openapi3Yaml":"../openapi.yaml",
    "keycloaksetting":{
        "OAUTH2_CONFIGURL":"https://keycloak-server-url/realms/realm-name",
        "OAUTH2_CLIENTID":"client-id",
        "OAUTH2_CLIENTSECRET":"client-secret-value",
        "AUTH_SECRET_KEY":"my-secret",        
    }
}

export const setConfiguration=(paraconfig)=>{
    config=paraconfig
}
//create empty nest project
export const runCreateNest= (callback:Function) =>{
    const backendFolder=config.backendFolder
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
export const runCreateNuxt = (callback:Function) =>{
    const frontendFolder=config.frontendFolder
    if(!fs.existsSync(frontendFolder)){
        const child3 = spawn('npx',['nuxi@latest','init',frontendFolder],{  stdio: 'inherit',})
        child3.on('close',(exitCode)=>{ 
            callback()
        })
    }else{
        callback()
    }
}

export const prepareNest = (callback:Function)=>{
    const targetfolder =config.backendFolder
    log.info(`creating backend project ${targetfolder}`)
    if(!fs.existsSync(`${targetfolder}/.env`)){

    
        exec(`cd ${targetfolder};pnpm install --save @nestjs/serve-static axios @darkwolf/base64url json-schema @wearenova/mongoose-tenant @nestjs/swagger @nestjs/mongoose mongoose  ajv ajv-formats @nestjs/config`,async (error, stdout, stderr)=>{
            // log.info(`dependency installed`)
            if(!error){
                fs.mkdirSync(`${targetfolder}/public_html`,{recursive:true})
                const eta = new Eta({views: constants.templatedir});              
                const variables=config    
                const txtEnv = eta.render('./nest/nest.env.eta', variables);                
                const txtMain = eta.render('./nest/nest.main.eta', variables);   
                const txtRedirectHtml = eta.render('./nest/oauth2-redirect.eta', variables);   

                fs.writeFileSync(`${targetfolder}/.env`, txtEnv);
                fs.writeFileSync(`${targetfolder}/src/main.ts`, txtMain);            
                fs.writeFileSync(`${targetfolder}/public_html/oauth2-redirect.html`, txtRedirectHtml);            
                const tsconfigpath = process.cwd()+'/'+`${targetfolder}/tsconfig.json`
                const tsconfig = require(tsconfigpath)
                tsconfig.compilerOptions.esModuleInterop=true
                tsconfig.compilerOptions.resolveJsonModule=true
                fs.writeFileSync(tsconfigpath, JSON.stringify(tsconfig));

                log.info("nest project completed")                
                callback()
            
            } else{
            log.error(stderr)
            throw error
            }
        })
    }else{
        log.info(`${targetfolder}/.env exists, skip regenerate environment`)
        callback()
    }
}
//prepare nuxt project for simpleapp generator
export const prepareNuxt = (callback:Function)=>{
    const targetfolder = config.frontendFolder
    if(!fs.existsSync(`${targetfolder}/.env`)){
        //asume no environment. prepare now
        exec(`cd ${targetfolder};pnpm install;pnpm install -D @sidebase/nuxt-auth @nuxt/ui @types/node @vueuse/nuxt @sidebase/nuxt-auth @vueuse/core nuxt-security prettier `, (error, stdout, stderr)=>{                
            //;pnpm install    
            console.log(error, stdout, stderr)
                exec(`cd ${targetfolder};pnpm install --save next-auth@4.21.1 @darkwolf/base64url @nuxt/ui ajv dotenv @fullcalendar/core @fullcalendar/vue3 quill uuid ajv-formats primeflex primeicons prettier primevue axios json-schema mitt @simitgroup/simpleapp-vue-component@latest`, (error, stdout, stderr)=>{                
                console.log(error, stdout, stderr)
                
                fs.mkdirSync(`${targetfolder}/assets/css/`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/layouts`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/components`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/server/api/[xorg]`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/server/api/auth`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/pages/[xorg]`,{recursive:true})
                fs.mkdirSync(`${targetfolder}/plugins`,{recursive:true})
                const eta = new Eta({views: `${constants.templatedir}/nuxt`});              
                const variables=config
                const writes = {
                    './app.vue.eta':'app.vue',            
                    './components.eventmonitor.vue.eta':'components/EventMonitor.vue',
                    './components.menus.vue.eta':'components/Menus.vue',
                    './components.crudsimple.vue.eta':'components/CrudSimple.vue',            
                    './components.debugdocdata.vue.eta':'components/DebugDocumentData.vue',            
                    './layouts.default.vue.eta':'layouts/default.vue',
                    './server.api.ts.eta':'server/api/[xorg]/[...].ts',
                    './server.api.auth.logout.ts.eta':'server/api/auth/logout.ts',
                    './server.api.auth[...].ts.eta':'server/api/auth/[...].ts',
                    './nuxt.config.ts.eta':'nuxt.config.ts',
                    './pages.index.vue.eta':'pages/index.vue',
                    './pages.[xorg].index.vue.eta':'pages/[xorg]/index.vue',
                    './pages.login.vue.eta':'pages/login.vue',
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

export const prettyNuxt = ()=>{
    exec(`cd ${config.frontendFolder};npx prettier --write "./pages/**/*.vue" "./simpleapp/**/*" `)
                        
}
export const prettyNest = ()=>{
    exec(`cd ${config.backendFolder};npm run format`)
}

export const prepareOpenApiClient = () => {
    exec(`openapi-generator-cli generate -i ${config.openapi3Yaml} -o ${config.frontendFolder}/simpleapp/openapi -g typescript-axios --skip-validate-spec`)
}