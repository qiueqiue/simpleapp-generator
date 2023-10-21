import { foreignkeys } from './storage';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
export type ChildModels = {
  [key: string]: { 
    type: string; 
    model: SchemaModel,
    codeField:string,
    nameField:string,
    moreAutoComplete?:string[],
    docStatusSettings?:DocStatusSetting[],
    apiSettings?:ApiSetting[],
    requireautocomplete: boolean
    isolationtype:string
    hasdocformat:boolean,
    foreignkeys:any
  };
};
export enum Fieldtypes {
  'string' = 'string',
  'object' = 'object',
  'array' = 'array',
  'boolean' = 'boolean',
  'integer' = 'integer',
  'number' = 'number',
}
export type FieldModel = {
  title?: string; //display name
  description?: string; //small text for explain at inputs
  default?: any;
  type: Fieldtypes;
  // oritype: string;
  format?: string;
  required?: boolean;
  example?: any;
  examples?: any;
};

// export type SchemaCategoryModel = {
//   [key: string]: FieldModel;
// };

export type SchemaModel = {
  [key: string]: string | string[] | FieldModel | SchemaModel | SchemaModel[];
};

export type JsonSchemaProperties= {
  [key: string]: JSONSchema7Definition
  // JSONSchema7Definition ,JSONSchema7
}

//foreign key setting in current document
export type MyForeignKey = {
  [collectionname:string]:string[]
}


//centralize foreignkey catalogue for all document
export type TypeForeignKeyCatalogue = {
  [cataloguename:string]:TypeForeignKey
}
export type TypeForeignKey={
  [collection:string]:string[]
}
export type ModuleObject = {
  doctype:string
  docname:string
  pagetype:string
  api:any[]
}
export type TypeGenerateDocumentVariable ={
name: string
doctype: string
models: ChildModels
autocompletecode:string
autocompletename:string
moreAutoComplete:string[]
schema: SchemaModel
apiSchemaName: string
typename: string
fullApiSchemaName: string
fullTypeName:string
jsonschema: JSONSchema7
bothEndCode: string
frontEndCode: string
backEndCode: string
controllerCode:string
apiSchemaCode:string
docStatusSettings:DocStatusSetting[],
apiSettings:ApiSetting[],
requireautocomplete:boolean,
isolationtype:string
hasdocformat:boolean,
foreignkeys: MyForeignKey

}

export type DocStatusSetting = {
  statusCode:string,
  statusName:string,
  allowApi:string[],
  readonly?:boolean,
  description?:''
}

export type ApiSetting = {
  method:string,
  action:string,  
  setDocStatus?:'',
  description?:'',
  bpmnApi?:'',
  data?:any
}
export type DocSetting = {
  docName:string,
  docType:string,
  colDocNo:string,
  colDocLabel:string,
  collectionName:string,
  autocompleteFields:string[],
  docStatusSettings:DocStatusSetting[],
  apiSettings:ApiSetting[],
  requireautocomplete:boolean
  isolationtype:string
  foreignkeys: MyForeignKey
}