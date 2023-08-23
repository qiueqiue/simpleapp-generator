#! /usr/bin/env node
import { Command }  from "commander"; // add this line
import {Fieldtypes} from './type'
import {initialize} from './generate'
import {} from 'prettier'
import {capitalizeFirstLetter} from './libs'
const figlet = require("figlet");
const program = new Command();
import fs from 'fs'



program
  .version("1.0.0")
  .description("An simpleapp CLI tool for generate frontend (vuejs) and backend(nestjs) codes")  
  .option("-s, --definations-folder <value>", "load defination files from which folder")
  .option("-b, --backend-folder <value>", "Create backend code at which folder")
  .option("-f, --frontend-folder <value>", "Create frontend code at which folder")
  .option("-c, --config-file <value>", 'configuration file content such as:{"definationsFolder":"./definations", "backendFolder":"./nestproject/src/docs", "frontendFolder":"./nuxt/server"}')
  .parse(process.argv);
const a:Fieldtypes=Fieldtypes.string

const options = program.opts();
console.log(figlet.textSync("SimpleApp Generator"));
// console.log(options)
const configs = require(options.configFile)
console.log("configurations: ",configs)
const definationsFolder = configs.definationsFolder ?? options.definationsFolder
const backendFolder = configs.backendFolder ?? options.backendFolder
const frontendFolder = configs.frontendFolder ?? options.frontendFolder
initialize(definationsFolder,backendFolder,frontendFolder)


// pnpm exec prettier ./src/docs  --write
// 	pnpm exec prettier ./apiclients  --write