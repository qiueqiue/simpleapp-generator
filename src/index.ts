#! /usr/bin/env node
const program =  require("commander") // add this line
const Fieldtypes= require( './type')
const generator= require( './generate')
const fs = require( 'fs')
const  {createNuxt,createNest} =require( './createproject')
const {exec} =  require( "child_process")

const capitalizeFirstLetter= require( './libs')
// const {Logger, ILogObj} = require( "tslog");

// const log:  Logger = new Logger();
const figlet = require("figlet");
// const program = new Command();


let version='1.0.8'
program
  .version(version)
  .description("An simpleapp CLI tool for generate frontend (vuejs) and backend(nestjs) codes")  
  .option("-c, --config-file <value>", 'configuration file content such as:{"definationsFolder":"./definations", "backendFolder":"./nestproject/src/docs", "frontendFolder":"./nuxt/server"}')
  .option("-s, --definations-folder <value>", "load defination files from which folder")
  .option("-b, --backend-folder <value>", "Create backend code at which folder")
  .option("-f, --frontend-folder <value>", "Create frontend code at which folder")
  .option("-i, --openapi3-yaml <value>", 'openapi3.yaml generated by backend server')  
  .parse(process.argv);


const options = program.opts();
console.log(figlet.textSync(`SimpleApp Generator ${version}`));
// console.log(options)
const configs = require(options.configFile)
console.log("configurations: ",configs)
const definationsFolder = configs.definationsFolder ?? options.definationsFolder
const backendFolder = configs.backendFolder ?? options.backendFolder
const frontendFolder = configs.frontendFolder ?? options.frontendFolder
const openapi3Yaml:string = configs.openapi3Yaml ?? options.openapi3Yaml

const runGenNext = (callback)=>{
  if(!fs.existsSync(backendFolder)){
    console.error(`${backendFolder} does not exists, please run "nest new -p pnpm ${backendFolder}"`)
  }else if(!fs.existsSync(`${backendFolder}/.env`)){
    console.log(`initial nest configuratoin for simpleapp generator`)
    createNest(backendFolder,callback)
  }else{
    console.log(`.env file exists, skip nest initialization`)
    callback()
  }
}
const runGenNuxt = (callback)=>{  
  if(!fs.existsSync(frontendFolder)){
    console.error(`${frontendFolder} does not exists, please run "npx nuxi@latest init ${frontendFolder}"`)
  }else if(!fs.existsSync(`${frontendFolder}/.env`)){
    console.log(`initial nuxt configuratoin for simpleapp generator`)
    createNuxt(frontendFolder,callback)
  }else{
    console.log(`.env file exists, skip nuxt initialization`)
    callback()

  }
}
runGenNext(()=>{
  console.log("runGenNext (backen) done")
  runGenNuxt(()=>{   
    console.log("runGenNuxt (frontend) done")
    generator.initialize(definationsFolder,backendFolder,frontendFolder)    
    if(openapi3Yaml !=''){
      
      exec(`openapi-generator generate -i ${openapi3Yaml} -o ${frontendFolder}/server/openapi -g typescript-axios --skip-validate-spec`,(error, stdout, stderr)=>{  
          if(error){
            console.error(stderr);      
          } 
        });  
    }
  })
})




// pnpm exec prettier ./src/docs  --write
// 	pnpm exec prettier ./apiclients  --write