#! /usr/bin/env node
"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander"); // add this line
const type_1 = require("./type");
const generate_1 = require("./generate");
const figlet = require("figlet");
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("An simpleapp CLI tool for generate frontend (vuejs) and backend(nestjs) codes")
    .option("-s, --definations-folder <value>", "load defination files from which folder")
    .option("-b, --backend-folder <value>", "Create backend code at which folder")
    .option("-f, --frontend-folder <value>", "Create frontend code at which folder")
    .option("-c, --config-file <value>", 'configuration file content such as:{"definationsFolder":"./definations", "backendFolder":"./nestproject/src/docs", "frontendFolder":"./nuxt/server"}')
    .parse(process.argv);
const a = type_1.Fieldtypes.string;
const options = program.opts();
console.log(figlet.textSync("SimpleApp Code"));
// console.log(options)
const configs = require(options.configFile);
console.log(configs);
const definationsFolder = (_a = configs.definationsFolder) !== null && _a !== void 0 ? _a : options.definationsFolder;
const backendFolder = (_b = configs.backendFolder) !== null && _b !== void 0 ? _b : options.backendFolder;
const frontendFolder = (_c = configs.frontendFolder) !== null && _c !== void 0 ? _c : options.frontendFolder;
(0, generate_1.initialize)(definationsFolder, backendFolder, frontendFolder);
//# sourceMappingURL=index.js.map