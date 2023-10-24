import {SchemaType,RESTMethods,IsolationType} from '../type'

export const tenant:SchemaType ={
    type: "object",
    "x-simpleapp-config":{
        isolationType:IsolationType.none,
        requiredRoles:["SuperAdmin"],    
        pageType:'crud',
        uniqueKey:'tenantId',
        documentTitle:'tenantName',
        documentName:'tenant',
        documentType:'tenant',
    },        
    required:["tenantId","tenantName","owner"],
    properties: {
        _id:{type:'string'},
        created:{type:'string'},
        updated:{type:'string'},
        createdby:{type:'string'},
        updatedby:{type:'string'},
        tenantId: {type:'integer',default:1,minimum:1 },
        orgId: {type:'integer',default:1,minimum:1 },
        branchId: {type:'integer',default:1,minimum:1 },
        tenantName: {type: "string", minLength:3},
        active: {"type": "boolean","examples": [true],default:true},
        description: {"type": "string"},
        owner: {
            type: "object",
            "x-foreignkey":"user", 
            required :["_id","label","uid"],
            properties:{
                _id: {type:'string'},
                label: {type:'string'},
                uid: {type:'string'},
            }
        }      
    }
  }