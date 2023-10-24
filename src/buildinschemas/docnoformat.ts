import {SchemaType,RESTMethods,IsolationType} from '../type'

export const docnoformat:SchemaType ={
        type: "object",
        "x-simpleapp-config":{
            isolationType:IsolationType.tenant,
            documentType:'docno',
            documentName:'docnoformat',
            pageType:"crud", 
            uniqueKey:'docNoFormatNo',
            documentTitle:'docNoFormatName',
            additionalAutoCompleteFields: ['default'],
            additionalApis:[{
                "action":"listDocFormats",
                "entrypoint":"/listdocformats/:doctype",
                "requiredrole":["User"],
                "method":RESTMethods.get, 
                "execute":"listDocFormats",
                "description":"get list of document format for 1 doctype"
              } ]
        },
        
        properties: {
            _id:{type:'string'},
            created:{type:'string'},
            updated:{type:'string'},
            createdby:{type:'string'},
            updatedby:{type:'string'},
            tenantId: {type:'integer',default:1,minimum:1 },
            orgId: {type:'integer',default:1,minimum:1 },
            branchId: {type:'integer',default:1,minimum:1 },
          "docNoFormatNo": {"type": "string","examples": ["INV"]},
          "docNoFormatName": { "type": "string", "examples": ["Invoice Default Format"]},
          "active": {"type": "boolean","examples": [true],"default":true},
          "default":{"type": "boolean","examples": [true],"default":true},
          "docNoType": {"type": "string","examples": ["SI","PI"]},
          "docNoPattern": {"type": "string","examples": ["SI{YYMM}-<000>","PI-2023-<0000>"],"description":"{date} format as ISO8601 symbol"},
          "isMonthly": {"type": "boolean","examples": [false]},
          "nextNumber":{"type":"integer","examples":[1],"default":1},
          "monthlySetting": {
            "type": "object",
            "properties": {
              "jan": {"type": "integer","default":1},
              "feb": {"type": "integer","default":1},
              "mar": {"type": "integer","default":1},
              "apr": {"type": "integer","default":1},
              "may": {"type": "integer","default":1},
              "jun": {"type": "integer","default":1},
              "jul": {"type": "integer","default":1},
              "aug": {"type": "integer","default":1},
              "sep": {"type": "integer","default":1},
              "oct": {"type": "integer","default":1},
              "nov": {"type": "integer","default":1},
              "dec": {"type": "integer","default":1}
            }
          }
        }
      }