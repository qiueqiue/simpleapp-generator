import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
export type ChildModels = {
  [key: string]: { type: string; model: SchemaModel,codeField:string,nameField:string,moreAutoComplete:string[] };
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

export type TypeForeignKeyCatalogue = {
  [cataloguename:string]:TypeForeignKey
}
export type TypeForeignKey={
  [collection:string]:string[]
}
export type ModuleObject = {
  doctype:string
  docname:string
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
}