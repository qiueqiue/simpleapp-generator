"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonSchemaBuilder = void 0;
const libs_1 = require("../libs");
const tslog_1 = require("tslog");
const json_schema_ref_parser_1 = __importDefault(require("@apidevtools/json-schema-ref-parser"));
const storage_1 = require("../storage");
// import { ConflictException } from '@nestjs/common';
const type_1 = require("../type");
const log = new tslog_1.Logger();
const FIELD_AUTOCOMPLETE_CODE = 'field-autocomplete-code';
const FIELD_AUTOCOMPLETE_NAME = 'field-autocomplete-name';
const FOREIGNKEY_PROPERTY = 'x-foreignkey';
let allmodels = {};
let fullschema = {};
let fieldAutoCompleteCode = '';
let fieldAutoCompleteName = '';
const readJsonSchemaBuilder = async (doctype, docname, orijsondata, allforeignkeys) => {
    fieldAutoCompleteCode = '';
    fieldAutoCompleteName = '';
    allmodels = {};
    const validateddata = Object.assign({}, orijsondata);
    let schema;
    const tmpjsondata = await json_schema_ref_parser_1.default.dereference(orijsondata).then((schema) => {
        // console.log("schema",doctype, schema['properties']['category']? schema['properties']['category']:'')
        return schema;
    });
    const jsondata = Object.assign({}, tmpjsondata);
    if (jsondata && jsondata.type == 'object') {
        //no _id then need add
        // console.log(jsondata)
        schema = processObject(doctype, docname, jsondata);
        // console.log("schema",schema)
    }
    else if (jsondata.type == 'array') {
        throw (`unsupport array type for ${docname}.${doctype}`);
    }
    if (fieldAutoCompleteCode == '') {
        log.error(`you shall define 1 field with format:'${FIELD_AUTOCOMPLETE_CODE}'`);
        throw "missing field format";
    }
    if (fieldAutoCompleteName == '') {
        log.error(`you shall define 1 field with format: '${FIELD_AUTOCOMPLETE_NAME}'}`);
        throw "missing field format";
    }
    return Promise.resolve(allmodels);
};
exports.readJsonSchemaBuilder = readJsonSchemaBuilder;
const processObject = (doctype, docname, jsondata) => {
    if (!jsondata['properties']) {
        throw ("Invalid json schema {doctype}.{docname}, no 'properties' defined");
    }
    //ensure some field exists, also override it
    jsondata.properties['_id'] = { type: 'string', description: 'Control value, dont edit it', };
    jsondata.properties['doctype'] = { type: 'string', default: doctype, examples: [doctype], description: 'Control value, dont edit it', };
    jsondata.properties['tenant_id'] = { type: 'number', description: 'Control value, dont edit it', };
    jsondata.properties['organization_id'] = { type: 'number', description: 'Control value, dont edit it', };
    jsondata.properties['branch_id'] = { type: 'number', description: 'Control value, dont edit it', };
    jsondata.properties['created'] = { type: 'string', description: 'Control value, dont edit it', };
    jsondata.properties['updated'] = { type: 'string', description: 'Control value, dont edit it', };
    jsondata.properties['createdby'] = { type: 'string', description: 'Control value, dont edit it', };
    jsondata.properties['updatedby'] = { type: 'string', description: 'Control value, dont edit it', };
    return genSchema((0, libs_1.capitalizeFirstLetter)(docname), 'object', jsondata.properties, jsondata['required'] ? jsondata['required'] : []);
};
const genSchema = (docname, schematype, jsondata, //JSONSchema7,//|JsonSchemaProperties|JSONSchema7Definition,
requiredlist) => {
    var _a, _b;
    const newmodel = {};
    const props = Object.getOwnPropertyNames(jsondata !== null && jsondata !== void 0 ? jsondata : {});
    // console.log('==== jsondata', jsondata);
    for (let i = 0; i < props.length; i++) {
        const key = props[i];
        //below is Object.assign use for force datatype compatibility
        const obj = {};
        Object.assign(obj, jsondata[key]);
        const objectitem = {};
        Object.assign(objectitem, obj.items);
        const isrequired = requiredlist && requiredlist.includes(key);
        const newName = docname + (0, libs_1.capitalizeFirstLetter)(key);
        if (obj.format && obj.format == FIELD_AUTOCOMPLETE_CODE) {
            fieldAutoCompleteCode = key;
        }
        if (obj.format && obj.format == FIELD_AUTOCOMPLETE_NAME) {
            fieldAutoCompleteName = key;
        }
        //  if (obj.type == 'object' && obj.items  ){
        //   console.log("Refer to another object",docname,': ',key,obj,obj.items)
        // obj,obj.items
        //foreignkeys
        //FOREIGNKEY_PROPERTY
        // newmodel[key] = 'Object';
        // }
        // else 
        if (obj.type == 'object') {
            if (obj[FOREIGNKEY_PROPERTY]) {
                console.warn("FOREIGNKEY_PROPERTY exists", FOREIGNKEY_PROPERTY, obj[FOREIGNKEY_PROPERTY]);
                const masterdatacollection = obj[FOREIGNKEY_PROPERTY];
                const clientdatacollection = docname.toLowerCase();
                const foreignkeyidentity = key + '._id';
                if (!storage_1.foreignkeys[masterdatacollection]) {
                    let tmp = {};
                    tmp[clientdatacollection] = [foreignkeyidentity];
                    storage_1.foreignkeys[masterdatacollection] = tmp;
                }
                else {
                    storage_1.foreignkeys[masterdatacollection][clientdatacollection].push(foreignkeyidentity);
                }
            }
            genSchema(newName, obj.type, obj.properties, obj.required);
            newmodel[key] = newName;
        }
        else if (obj.type == 'array' && obj.items && (objectitem === null || objectitem === void 0 ? void 0 : objectitem.type) == 'object') {
            //array need submodel
            // console.log("======",newName,key)
            genSchema(newName, obj.type, objectitem === null || objectitem === void 0 ? void 0 : objectitem.properties, obj.required);
            newmodel[key] = [newName];
        }
        else if (obj.type == 'array' && (objectitem === null || objectitem === void 0 ? void 0 : objectitem.type) != 'object') {
            //array need submodel
            // genSchema(newName, obj.type, obj.items.properties);
            const objecttype = (_b = (_a = objectitem.type) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'string';
            newmodel[key] = [objecttype];
        }
        else {
            newmodel[key] = getField(key, obj, isrequired);
            // console.log(key,'--------newmodel',obj, newmodel[key]);
        }
    }
    allmodels[docname] = { type: schematype, model: newmodel, codeField: fieldAutoCompleteCode, nameField: fieldAutoCompleteName };
    return newmodel;
};
const getField = (fieldname, obj, isrequired) => {
    let datatype = obj.type;
    // console.log(datatype)
    //Fieldtypes.string;
    let format = obj.format;
    if (obj.type == 'integer') {
        datatype = type_1.Fieldtypes.number;
        format = 'integer';
    }
    const f = {
        type: datatype,
        // oritype: obj.type,
        required: isrequired,
    };
    if (obj.title)
        f.title = obj.title;
    if (obj.description)
        f.description = obj.description;
    if (obj.format)
        f.format = obj.format;
    if (obj.examples)
        f.examples = obj.examples;
    if (obj.default) {
        f.default = obj.default;
    }
    else {
        if (f.type == 'string')
            f.default = '';
        else if (f.type == 'number' || f.type == 'integer')
            f.default = 0;
        else if (f.type == 'boolean')
            f.default = false;
        else if (f.type == 'array')
            f.default = [];
        else
            f.default = {};
    }
    return f;
};
//# sourceMappingURL=jsonschemabuilder.js.map