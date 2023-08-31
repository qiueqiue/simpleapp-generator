// import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { JSONSchema7, JSONSchema7Definition,JSONSchema7Array,JSONSchema7TypeName } from 'json-schema';
import * as js7 from 'json-schema';
import { capitalizeFirstLetter } from '../libs';
import {JsonSchemaProperties} from "../type"
import { Logger, ILogObj } from "tslog";
// import { ConflictException } from '@nestjs/common';
import {
  FieldModel,
  Fieldtypes,
  ChildModels,
  SchemaModel,
} from '../type';
import { json } from 'stream/consumers';
const log: Logger<ILogObj> = new Logger();
const FIELD_AUTOCOMPLETE_CODE='field-autocomplete-code'
const FIELD_AUTOCOMPLETE_NAME='field-autocomplete-name'
let allmodels: ChildModels = {};
let fieldAutoCompleteCode=''
let fieldAutoCompleteName=''
export const readJsonSchemaBuilder = (
  doctype: string,
  docname: string,
  jsondata:JSONSchema7,
): ChildModels => {
  fieldAutoCompleteCode=''
  fieldAutoCompleteName=''
  allmodels = {};
  const validateddata: JSONSchema7 = { ...jsondata };
  let schema: SchemaModel | SchemaModel[];
  
  if (jsondata && jsondata.type == 'object') {
    //no _id then need add
    // console.log(jsondata)
    schema = processObject(doctype,docname, jsondata)
    // console.log("schema",schema)
  } else if (jsondata.type == 'array') {
    throw(`unsupport array type for ${docname}.${doctype}`)
  }
  if(fieldAutoCompleteCode=='') {
    log.error(`you shall define 1 field with format:'${FIELD_AUTOCOMPLETE_CODE}'`)
    throw "missing field format"
  }
  if(fieldAutoCompleteName=='') {
    log.error(`you shall define 1 field with format: '${FIELD_AUTOCOMPLETE_NAME}'}`)
    throw "missing field format"
  }

  return allmodels;
};


const processObject = (doctype: string,
  docname: string,
  jsondata:JSONSchema7,) : SchemaModel =>{
    if(!jsondata['properties']){      
      throw ("Invalid json schema {doctype}.{docname}, no 'properties' defined")
    }
    
    //ensure some field exists, also override it
    jsondata.properties['_id'] = {type: 'string',description: 'Control value, dont edit it',};
    jsondata.properties['doctype'] = {type: 'string', default:doctype, examples: [doctype],description: 'Control value, dont edit it',};
    jsondata.properties['tenant_id'] = {type: 'number',description: 'Control value, dont edit it',};
    jsondata.properties['organization_id'] = {type: 'number',description: 'Control value, dont edit it',};
    jsondata.properties['branch_id'] = {type: 'number',description: 'Control value, dont edit it',};
    jsondata.properties['created'] = {type: 'string',description: 'Control value, dont edit it',};
    jsondata.properties['updated'] = {type: 'string',description: 'Control value, dont edit it',};
    jsondata.properties['createdby'] = {type: 'string',description: 'Control value, dont edit it',};
    jsondata.properties['updatedby'] = {type: 'string',description: 'Control value, dont edit it',};
    return genSchema(
      capitalizeFirstLetter(docname),
      'object',
      jsondata.properties,
      jsondata['required'] ? jsondata['required'] : [],
    );
}

const genSchema = (
  docname: string,
  schematype: string,
  jsondata: JsonSchemaProperties,//JSONSchema7,//|JsonSchemaProperties|JSONSchema7Definition,
  requiredlist: string[] | undefined,
): SchemaModel => {
  const newmodel: SchemaModel = {};
  const props = Object.getOwnPropertyNames(jsondata ??{});
  // console.log('==== jsondata', jsondata);
  
  for (let i = 0; i < props.length; i++) {    
    const key = props[i];
    
    //below is Object.assign use for force datatype compatibility
    const obj:JSONSchema7={}
    Object.assign(obj,jsondata[key]);
    const objectitem:JSONSchema7= {} as JSONSchema7    
    Object.assign(objectitem,obj.items);

    const isrequired = requiredlist && requiredlist.includes(key);
    const newName: string = docname + capitalizeFirstLetter(key);
   if(obj.format && obj.format==FIELD_AUTOCOMPLETE_CODE){
    fieldAutoCompleteCode=key
   }
   if(obj.format && obj.format==FIELD_AUTOCOMPLETE_NAME){
    fieldAutoCompleteName=key
   }

    if (obj.type == 'object' && !obj.properties){
      console.log("Skip empty object",docname,': ',key)
      newmodel[key] = 'Object';
    }
    else if (obj.type == 'object' && obj.properties) {
      genSchema(newName, obj.type, obj.properties, obj.required);
      newmodel[key] = newName;
    } else if (obj.type == 'array' && obj.items && objectitem?.type == 'object') {
      //array need submodel
      // console.log("======",newName,key)
      genSchema(newName, obj.type, objectitem?.properties, obj.required);
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
  allmodels[docname] = { type: schematype, model: newmodel,codeField: fieldAutoCompleteCode ,nameField: fieldAutoCompleteName };
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
