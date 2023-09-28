// import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { JSONSchema7, JSONSchema7Definition,JSONSchema7Array,JSONSchema7TypeName } from 'json-schema';
import * as js7 from 'json-schema';
import { capitalizeFirstLetter } from '../libs';
import {JsonSchemaProperties} from "../type"
import { Logger, ILogObj } from "tslog";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import {foreignkeys} from '../storage'
// import { ConflictException } from '@nestjs/common';
import {
  FieldModel,
  Fieldtypes,
  ChildModels,
  SchemaModel,
  TypeForeignKey,
  TypeForeignKeyCatalogue,
  DocSetting,ApiSetting,DocStatusSetting,
  
} from '../type';
import { json } from 'stream/consumers';
const log: Logger<ILogObj> = new Logger();

const X_DOCUMENT_NO='x-document-no'
const X_DOCUMENT_LABEL='x-document-label'
const X_AUTOCOMPLETE_FIELD='x-autocomplete-field'
const X_DOCUMENT_NAME='x-document-name'
const X_DOCUMENT_TYPE='x-document-type'
const X_COLLECTION_NAME='x-document-collection'
const X_DOCUMENT_STATUS='x-document-status'
const X_DOCUMENT_API='x-document-api'
const X_IGNORE_AUTOCOMPLETE='x-ignore-autocomplete'
const FOREIGNKEY_PROPERTY='x-foreignkey'
const X_TEL_NO='x-tel'
const X_ISOLATION_TYPE='x-isolation-type'

let docSetting:DocSetting={} as DocSetting



let allmodels: ChildModels = {};
let fullschema={}
// let fieldAutoCompleteCode=''
// let fieldAutoCompleteName=''
let moreAutoComplete:string[]=[]


const newDocSetting=(doctype:string,docname:string):DocSetting=>{
  return {
    docName:docname,  //done
    docType:doctype,  //done
    colDocNo:'',      //done
    colDocLabel:'',   //done
    collectionName:docname, //done
    autocompleteFields:[],
    docStatusSettings:[],
    apiSettings:[],
    requireautocomplete:true,
    isolationtype:"org"

  }
}
export const readJsonSchemaBuilder = async (
  doctype: string,
  docname: string,
  orijsondata:JSONSchema7,
  allforeignkeys:TypeForeignKeyCatalogue
) => {
  docSetting=newDocSetting(doctype,docname)
  // fieldAutoCompleteCode=''
  // fieldAutoCompleteName=''
  moreAutoComplete=[]
  allmodels = {};
  
  const validateddata: JSONSchema7 = { ...orijsondata };
  let schema: SchemaModel | SchemaModel[];
  const  tmpjsondata = await $RefParser.dereference(orijsondata).then((schema)=>{
    // console.log("schema",doctype, schema['properties']['category']? schema['properties']['category']:'')
    return schema
  })
  const  jsondata:JSONSchema7 = {...tmpjsondata} as JSONSchema7

  
  if (jsondata && jsondata.type == 'object') {
    //no _id then need add
    // console.log(jsondata)
    schema = processObject(doctype,docname, jsondata)
    // console.log("schema",schema)
  } else if (jsondata.type == 'array') {
    throw(`unsupport array type for ${docname}.${doctype}`)
  }

  if(docSetting.colDocNo=='' && docSetting.requireautocomplete) {
    log.error(`you shall define 1 field with property:'${X_DOCUMENT_NO}'`)
    throw "missing field property"
  }
  if(docSetting.colDocLabel=='' && docSetting.requireautocomplete) {
    log.error(`you shall define 1 field with property: '${X_DOCUMENT_LABEL}'}`)
    throw "missing field property"
  }
  
  return Promise.resolve(allmodels);
};


const processObject =  (doctype: string,
  docname: string,
  jsondata:JSONSchema7,)  =>{
    if(!jsondata['properties']){      
      throw ("Invalid json schema {doctype}.{docname}, no 'properties' defined")
    }
    log.info("processObject document type",doctype,docname)
    

    //ensure some field exists, also override it
    jsondata.properties['_id'] = {type: 'string',description: 'Control value, dont edit it',};
    jsondata.properties['doctype'] = {type: 'string', default:doctype, examples: [doctype],description: 'Control value, dont edit it',};
    jsondata.properties['branchId'] = {type: 'number',description: 'Control value, dont edit it',};
    jsondata.properties['created'] = {type: 'string',description: 'Control value, dont edit it',};
    jsondata.properties['updated'] = {type: 'string',description: 'Control value, dont edit it',};
    jsondata.properties['createdby'] = {type: 'string',description: 'Control value, dont edit it',};
    jsondata.properties['updatedby'] = {type: 'string',description: 'Control value, dont edit it',};

    if(doctype !='tenant'){
      jsondata.properties['tenantId'] = {type: 'number',description: 'Control value, dont edit it',};
    }
    if(doctype !='org'){
      jsondata.properties['orgId'] = {type: 'number',description: 'Control value, dont edit it',};
    }
    
    if(jsondata[X_ISOLATION_TYPE] && ['none','tenant','org','branch'].includes(jsondata[X_ISOLATION_TYPE])  ){      
      docSetting.isolationtype=jsondata[X_ISOLATION_TYPE]
    }
    if(jsondata[X_IGNORE_AUTOCOMPLETE] && jsondata[X_IGNORE_AUTOCOMPLETE]==true){
      docSetting.requireautocomplete=false
    }
    if(jsondata[X_DOCUMENT_API] && Array.isArray(jsondata[X_DOCUMENT_API])){
      // log.warn("x-document-api exists:")
      // log.warn(jsondata[X_DOCUMENT_API])
      for(let i=0; i<jsondata[X_DOCUMENT_API].length;i++){
        
        const tmp:ApiSetting =jsondata[X_DOCUMENT_API][i]
        // console.log(i,jsondata[X_DOCUMENT_API]['action'])
        if(!tmp.action){
          const errmsg = "x-document-api defined but undefine property 'action'"
          log.error(errmsg)
          
          throw errmsg
        }
        if(!tmp.method){
          const errmsg = "x-document-api defined but undefine property 'method'"
          log.error(errmsg)
          throw errmsg
        }
        
        let isexists = false
        for(let i =0; i< docSetting.apiSettings.length ; i++){
          const apiobj = docSetting.apiSettings[i]
          // log.info(docname," validate:tmp["+tmp['action']+"]==apiobj["+apiobj['action'] +"]&&tmp["+ tmp['method']+"] == apiobj["+apiobj['method']+"]")
          if(tmp['action']==apiobj['action'] && tmp['method'] == apiobj['method']){
            //skip
            isexists=true
            break;
          }
        }
        if(!isexists){
          docSetting.apiSettings.push(tmp)
        }
     }
    }
    // log.warn("docSetting.apiSettings",docSetting.apiSettings)
      if(jsondata[X_DOCUMENT_STATUS] && Array.isArray(jsondata[X_DOCUMENT_STATUS])){
        for(let i=0; i<jsondata[X_DOCUMENT_STATUS].length;i++){
          const tmp:DocStatusSetting =jsondata[X_DOCUMENT_STATUS][i]
          if(tmp.statusCode ===undefined){
            const errmsg = "x-document-status defined but undefine property 'statusCode'"
            log.error(errmsg)
            throw errmsg
          }
          if(!tmp.statusName ===undefined){
            const errmsg = "x-document-status defined but undefine property 'statusName'"
            log.error(errmsg)
            throw errmsg            
          }
          docSetting.docStatusSettings.push(tmp)
        }
     }

    //  moreAutoComplete:docSetting.autocompleteFields,
    // docStatusSettings:docSetting.docStatusSettings,
    // apiSettings:docSetting.apiSettings,
    // SchemaModel | SchemaModel[]
    let data =  genSchema(
      capitalizeFirstLetter(docname),
      'object',
      jsondata.properties,
      jsondata['required'] ?? [],
    );
    
    return data
}

const genSchema = (docname: string,schematype: string,jsondata: JsonSchemaProperties,
  requiredlist: string[] | undefined): SchemaModel => {
  const newmodel: SchemaModel = {};
  const props = Object.getOwnPropertyNames(jsondata ??{});
  // console.log('==== jsondata', jsondata);
  console.log("requiredlist:::::",docname,"::::",requiredlist)
  for (let i = 0; i < props.length; i++) {    
    const key = props[i];
    
    //below is Object.assign use for force datatype compatibility
    const obj:JSONSchema7={}
    Object.assign(obj,jsondata[key]);
    const objectitem:JSONSchema7= {} as JSONSchema7    
    Object.assign(objectitem,obj.items);

    let isrequired = false
    if(requiredlist &&  requiredlist.includes(key)){
      isrequired=true
    }
    const newName: string = docname + capitalizeFirstLetter(key);
    // log.info("property is:",key,newName,obj)
   if(obj[X_DOCUMENT_NO]){
    
    docSetting.colDocNo=key
    obj.minLength=obj.minLength??1
    jsondata[key]['minLength']=obj.minLength
   }
   if(obj[X_DOCUMENT_LABEL]){
    docSetting.colDocLabel=key
    obj.minLength=obj.minLength??1
    jsondata[key]['minLength']=obj.minLength
   }
   
  //  if(obj[X_COLLECTION_NAME]){
  //   docSetting.collectionName=key    
  //  }


   if(obj[X_AUTOCOMPLETE_FIELD]){
    docSetting.autocompleteFields.push(key)
   }
   

  //  if(obj.format && obj.format==X_TEL_NO){
  //   obj.pattern=obj.pattern ?? '/^\d{7,15}$/gm'
  //  }
  //  if (obj.type == 'object' && obj.items  ){
  //   console.log("Refer to another object",docname,': ',key,obj,obj.items)
    
    // obj,obj.items
    //foreignkeys
    //FOREIGNKEY_PROPERTY
    // newmodel[key] = 'Object';
    // }
    // else 
    if (obj.type == 'object') {
      
      if(obj[FOREIGNKEY_PROPERTY]){
        // console.warn("FOREIGNKEY_PROPERTY exists",FOREIGNKEY_PROPERTY,obj[FOREIGNKEY_PROPERTY])
        const masterdatacollection = obj[FOREIGNKEY_PROPERTY]
        const clientdatacollection = docname.toLowerCase()
        const foreignkeyidentity= key
        if(!foreignkeys[masterdatacollection]){
          let tmp:TypeForeignKey = {} as TypeForeignKey
          tmp[clientdatacollection]=[foreignkeyidentity]
          foreignkeys[masterdatacollection] = tmp
        }
        else if(!foreignkeys[masterdatacollection][clientdatacollection]){
          foreignkeys[masterdatacollection][clientdatacollection]=[foreignkeyidentity]
        }else{
          foreignkeys[masterdatacollection][clientdatacollection].push(foreignkeyidentity)
        }
                
      }
      genSchema(newName, obj.type, obj.properties, obj.required);
      newmodel[key] = newName;
    } else if (obj.type == 'array' && obj.items && objectitem?.type == 'object') {
      //array need submodel
      // console.log("======",newName,key)
      genSchema(newName, obj.type, objectitem?.properties, obj.items['required']);
      newmodel[key] = [newName];
    } else if (obj.type == 'array' && objectitem?.type != 'object') {
      //array need submodel
      // genSchema(newName, obj.type, obj.items.properties);
      const objecttype:string = objectitem.type?.toString() ?? 'string'
      newmodel[key] = [objecttype];
    } else {
      newmodel[key] = getField(key, obj, isrequired);
      // console.log(key,'--------newmodel',obj, newmodel[key]);
    }
  }
  allmodels[docname] = { 
    type: schematype, 
    model: newmodel,
    codeField: docSetting.colDocNo ,
    nameField: docSetting.colDocLabel,
    moreAutoComplete:docSetting.autocompleteFields,
    docStatusSettings:docSetting.docStatusSettings,
    apiSettings:docSetting.apiSettings,
    requireautocomplete:docSetting.requireautocomplete,
    isolationtype:docSetting.isolationtype
  };
  // console.warn("-------------apiSettings-----",docname,"::::",docSetting.apiSettings)
  return newmodel;
};

const getField = (
  fieldname: string,
  obj: JSONSchema7,
  isrequired: boolean | undefined,
): FieldModel => {
  let datatype: Fieldtypes = obj.type as Fieldtypes
  // console.log(datatype)
  //Fieldtypes.string;
  let format = obj.format;
  if (obj.type == 'integer') {
    datatype = Fieldtypes.number;
    format = 'integer';
  }

  const f: FieldModel = {
    type: datatype,
    // oritype: obj.type,
    required: isrequired,
  };

  if (obj.title) f.title = obj.title;
  if (obj.description) f.description = obj.description;
  if (obj.format) f.format = obj.format;
  if (obj.examples) f.examples = obj.examples;
  if (obj.default) {
    f.default = obj.default;
  } else {
    if (f.type == 'string') f.default = '';
    else if (f.type == 'number' || f.type == 'integer') f.default = 0;
    else if (f.type == 'boolean') f.default = false;
    else if (f.type == 'array') f.default = [];
    else f.default = {};
  }
  return f;
};

