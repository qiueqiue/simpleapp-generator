import {SchemaType,RESTMethods,IsolationType} from '../type'

export const permission:SchemaType ={
    type: "object",
    "x-simpleapp-config":{
        documentType:'perm',
        documentName:'permission',        
        isolationType:IsolationType.tenant,
        additionalApis:[{
            action:"listUser",
            entrypoint:"listuser",
            requiredrole:["SuperAdmin"],
            method:RESTMethods.get,
            execute:"listUser",
            description:"Get current permissionlist lookup user info"
          }]
    },
    properties: {
        _id:{type:'string'},
        created:{type:'string'},
        updated:{type:'string'},
        createdby:{type:'string'},
        updatedby:{type:'string'},
        tenantId: {type:'integer',default:1,minimum:0 ,"x-foreignkey":"tenant" },
        orgId: {type:'integer',default:1,minimum:0 ,"x-foreignkey":"organization" },
        branchId: {type:'integer',default:1,minimum:0 ,"x-foreignkey":"branch" },
        group: {"type": "string"},
        uid: {"type": "string","x-foreignkey":"user"},
        user_id : {"type":"string"}
      }
}