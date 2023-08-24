"use strict";
// const clc = require("cli-color");
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFirstLetter = void 0;
const capitalizeFirstLetter = (str) => {
    const res = str == '' ? '' : str.slice(0, 1).toUpperCase() + str.slice(1);
    // const res = str;
    return res;
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
// export const logsuccess = (data:any)=>console.log(clc.green(data))
// export const logerror = (data:any)=>console.log(clc.error(data))
// export const logwarn = (data:any)=>console.log(clc.yellow(data))
// export const logdefault = (data:any)=>console.log(data)
//# sourceMappingURL=libs.js.map