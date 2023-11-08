import type { JSONSchema7,JSONSchema7Definition } from 'json-schema';
import type {ListOptionType} from './type'
export const prepareList=(schemaComposition:string,fsetting:JSONSchema7Definition | JSONSchema7Definition[] | undefined,labelfield:string,valuefield:string,propsoptions?:any[],):ListOptionType[]=>{
    let options :ListOptionType[] = []
    let fieldsetting:JSONSchema7 = {} as JSONSchema7
    Object.assign(fieldsetting,fsetting)
    // {...fsetting} as   JSONSchema7
    try{
        const convertToList=(list:any[]):ListOptionType[]=>{
            let opts :ListOptionType[] = []
            if(list.length>0 && typeof list[0]=='object'){
                for(let i=0;i<list.length;i++){
                    const t = list[i]
                    const item = {value:t[valuefield], label:t[labelfield]}
                    opts.push(item)
                }
            }else{
                opts = simpleArrayToObject(list)
            }
            return opts
        }
        
        if(Array.isArray(propsoptions)){
            if(propsoptions.length>0 && typeof propsoptions[0]== 'string'){
                options = simpleArrayToObject(propsoptions)
            }else{
                options = convertToList(propsoptions)
            }
            
        }
        else if(Array.isArray(fieldsetting.enum)){
            
            options = simpleArrayToObject(fieldsetting.enum)
        }else{
            let list:JSONSchema7Definition[]|undefined=[]
            switch(schemaComposition){
                case 'anyOf':
                    list=fieldsetting.anyOf
                break;
                case 'oneOf':
                    list=fieldsetting.oneOf
                break;
                default:
                break;
            }
            // console.log("get from anyof")
            // let list:any[]=fieldsetting.anyOf
            options = convertToList(list??[])
        }
        
        // else if(fieldsetting.oneOf && Array.isArray(fieldsetting.oneOf)){
        //     let list:any[]=fieldsetting.oneOf
        //     options = convertToList(list)
        // }
        //try validate data
        if(options.length>0){
            const d:any = options[0]        
            if(typeof d.label=='undefined'){
                const errormsg = `undefine property '${labelfield}', correct 'optionLabel'`
                console.error(errormsg,fieldsetting)
                options=[{value:'',label:errormsg}]
            }
            if(typeof d.value=='undefined'){
                const errormsg = `undefine property '${valuefield}', correct 'optionValue`
                console.error(errormsg,fieldsetting)
                options=[{value:'',label:errormsg}]
            }
        }
        return options;
    }catch(error){
        console.error("xxxxx",error)
        return []
    }
}

export const simpleArrayToObject=(list:any[]):ListOptionType[]=>{
    let options :ListOptionType[] = []
    for (let i =0; i< list.length; i++){
        const value:string = list[i].toString()
        let item :any={value:value,label:value}         
        options.push(item)
    }
    return options
}

export const camelCaseToWords = (s: string) =>{
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  