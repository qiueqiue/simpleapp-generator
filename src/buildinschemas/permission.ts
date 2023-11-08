import {SchemaType,RESTMethods,IsolationType} from '../type'

export const permission:SchemaType ={
    type: "object",
    "x-simpleapp-config":{
        documentType:'perm',
        documentName:'permission',        
        isolationType:IsolationType.org,
        additionalApis:[{
            action:"listUser",
            entryPoint:"listuser",
            requiredRole:["SuperAdmin"],
            method:RESTMethods.get,
            execute:"listUser",
            description:"Get current permissionlist lookup user info"
          }]
    },
    properties: {
        _id:{type:'string'},
        created:{type:'string'},
        updated:{type:'string'},
        createdBy:{type:'string'},
        updatedBy:{type:'string'},
        tenantId: {type:'integer',default:1,minimum:0},
        orgId: {type:'integer',default:1,minimum:0 },
        branchId: {type:'integer',default:1,minimum:0 },
        group: {"type": "string"},
        uid: {"type": "string",},
        userId : {"type":"string","x-foreignkey":"user", minLength:10 }
      }
}