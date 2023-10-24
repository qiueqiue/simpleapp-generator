import { allforeignkeys } from './storage';
import { JSONSchema7, JSONSchema7Definition,JSONSchema7Object } from 'json-schema';
export type ChildModels = {
  [key: string]: { 
    type: string; 
    model: SchemaModel,
    codeField:string,
    nameField:string,
    moreAutoComplete?:string[],
    docStatusSettings?:DocumentStatus[],
    apiSettings?:DocumentApi[],
    // requireautocomplete: boolean
    isolationtype:string
    hasdocformat:boolean,
    foreignkeys:MyForeignKey
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
  api:DocumentApi[]
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
docStatusSettings:DocumentStatus[],
apiSettings:DocumentApi[],
isolationtype:string
hasdocformat:boolean,
foreignkeys: MyForeignKey

}

export type DocSetting = {
  docName:string,
  docType:string,
  colDocNo:string,
  colDocLabel:string,
  collectionName:string,
  autocompleteFields:string[],
  docStatusSettings:DocumentStatus[],
  apiSettings:DocumentApi[],
  // requireautocomplete:boolean
  isolationtype:string
  foreignkeys: MyForeignKey
}

export type DocumentStatus = {
  status:string  //'CO', 'V', 'CL', 'D' and etc
  statusName:string
  readOnly:boolean
  actions: string[]    //api name ['confirm','revert','close','void' and etc]
}
export enum RESTMethods {'post'='post','get'='get', 'delete'='delete','put'='put', 'patch'='patch'}
export type DocumentApi = {
  action:string   //api action name
  entrypoint:string   //api entry point example:':id', ':id/confirm'
  querypara?:string[]   //what query parameter wish to accept, example:  ['description','date']
  requiredrole?: string[]   // what special user role wish to allow for this api, example: ['SuperUser']
  method:RESTMethods
  execute:string,   //what service class method name to execute, example: 'ping','getDocumentName'
  description:string //description of api
}
export enum IsolationType {"none"="none" , "tenant"="tenant","org"="org", "branch"="branch"}
export type ImportLibs = {"lib":string,"as":string}
export type Formula =  {
  "jsonpath":string  //example: "$.subtotal","$.details[*]"
  "formula":string  //example "jslib.getDocumentSubTotal(@F{$.details})"
} 

export type SchemaConfig = {
  isolationType: IsolationType
  requiredRoles?:string[]
  pageType?: string  
  uniqueKey?:string  
  documentTitle?:string 
  generateDocumentNumber?:boolean
  documentDate?:string
  allStatus?:DocumentStatus[]
  additionalApis?:DocumentApi[]      
  additionalAutoCompleteFields ?: string[]
  libs?:ImportLibs[]   // both process class and frontend client class will import same lib
  formulas?: Formula[]  
  documentType: string
  documentName: string
  collectionName?: string
  foreignKeys?:MyForeignKey,
}

// export type DefaultSchemaDefinitions = {
//   [key:string]:JSONSchema7Object
// }
export type ForeignKeyProperty = {'x-foreignkey' ?:string}
export type SchemaFields = {
  _id: JSONSchema7 
  tenantId: JSONSchema7 & ForeignKeyProperty
  orgId: JSONSchema7 & ForeignKeyProperty
  branchId: JSONSchema7 & ForeignKeyProperty
  created: JSONSchema7 
  updated: JSONSchema7 
  createdby: JSONSchema7 
  updatedby: JSONSchema7 
  [key:string]:JSONSchema7  & ForeignKeyProperty
}

export type AdditionalSchemaType = {     
  "x-simpleapp-config":SchemaConfig  
  properties: SchemaFields
} 

export type SchemaType = JSONSchema7 & AdditionalSchemaType



