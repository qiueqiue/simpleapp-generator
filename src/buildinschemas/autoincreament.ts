import {SchemaType,RESTMethods,IsolationType} from '../type'

export const autoincreament:SchemaType = {
    type: "object",
    "x-simpleapp-config":{
      documentType:'autoinc',
      documentName:'autoincreament',
      isolationType:IsolationType.tenant,
      pageType:"crud",      
      additionalApis:[{
        action:"genNextNumber",
        entrypoint:"gennextno/:collection/:field",
        requiredrole:["User"],
        method:RESTMethods.get, 
        execute:"generateNextNo",        
        description:"Get next no and trigger increase nextno"
      }],
    },        
    required:["nextno","collectionName","fieldName"],
    properties: {     
      _id:{type:'string'},
      created:{type:'string'},
      updated:{type:'string'},
      createdby:{type:'string'},
      updatedby:{type:'string'},
      tenantId: {type:'integer',default:1,minimum:1 },
      orgId: {type:'integer',default:1,minimum:1 },
      branchId: {type:'integer',default:1,minimum:1 },
      collectionName: {type: "string",minLength:1,},
      fieldName: {type: "string",minLength:1,},
      nextno:{type: "integer","minimum":1}
    }
}

