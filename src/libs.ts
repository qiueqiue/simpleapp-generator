// const clc = require("cli-color");

export const capitalizeFirstLetter = (str: string) => {
    const res = str == '' ? '' : str.slice(0, 1).toUpperCase() + str.slice(1);
    // const res = str;
    return res;
  };

// export const logsuccess = (data:any)=>console.log(clc.green(data))
// export const logerror = (data:any)=>console.log(clc.error(data))
// export const logwarn = (data:any)=>console.log(clc.yellow(data))
// export const logdefault = (data:any)=>console.log(data)

  