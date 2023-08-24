// import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { JSONSchema7, JSONSchema7Definition,JSONSchema7Array,JSONSchema7TypeName } from 'json-schema';
import * as js7 from 'json-schema';
import { capitalizeFirstLetter } from '../libs';
import {JsonSchemaProperties} from "../type"
// import { ConflictException } from '@nestjs/common';
import {
  FieldModel,
  Fieldtypes,
  ChildModels,
  SchemaModel,
} from '../type';
import { json } from 'stream/consumers';

let allmodels: ChildModels = {};
export const readJsonSchemaBuilder = (
  doctype: string,
  docname: string,
  jsondata:JSONSchema7,
): ChildModels => {
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
  jsondata: JsonSchemaProperties|undefined,//JSONSchema7,//|JsonSchemaProperties|JSONSchema7Definition,
  requiredlist: string[] | undefined,
): SchemaModel => {
  const newmodel: SchemaModel = {};
  const props = Object.getOwnPropertyNames(jsondata);
  // console.log('==== requirelist', requiredlist);
  
  for (let i = 0; i < props.length; i++) {    
    const key = props[i];
    
    //below is Object.assign use for force datatype compatibility
    const obj:JSONSchema7={}
    Object.assign(obj,jsondata[key]);
    const objectitem:JSONSchema7= {} as JSONSchema7    
    Object.assign(objectitem,obj.items);

    // Object.assign(objtmp,jsondata?[key]:{});
    const isrequired = requiredlist && requiredlist.includes(key);
    // console.log('----', key, isrequired, obj);
    const newName: string = docname + capitalizeFirstLetter(key);
    // console.log(key);
    //need create sub model
    // console.log("----",key,obj.type,objectitem.type)
    if (obj.type == 'object') {
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
      // console.log('--------newmodel', newmodel[key]);
    }
  }
  allmodels[docname] = { type: schematype, model: newmodel };
  return newmodel;
};

const getField = (
  fieldname: string,
  obj: any,
  isrequired: boolean | undefined,
): FieldModel => {
  let datatype: Fieldtypes = Fieldtypes.string;
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
  if (obj.example) f.example = obj.example;
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
