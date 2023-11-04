import {SchemaType,RESTMethods,IsolationType} from '../type'

export const branch:SchemaType ={
    type: "object",
    "x-simpleapp-config":{
        isolationType:IsolationType.tenant,
        documentType:'branch',
        documentName:'branch',
        // pageType:"crud", 
        uniqueKey:'branchCode',
        uniqueKeys:[['branchId']],
        documentTitle:'branchName',
        additionalAutoCompleteFields: ['branchId']
    },
    "properties": {
        _id:{type:'string'},
        created:{type:'string'},
        updated:{type:'string'},
        createdby:{type:'string'},
        updatedby:{type:'string'},
        tenantId: {type:'integer',default:1,minimum:1 },
        orgId: {type:'integer',default:1,minimum:1 },
        branchId: {type:'integer',default:1,minimum:1 },
        organization:{
          type:"object",
          "x-foreignkey":"organization",
          properties:{
              "_id":{"type":"string"},
              "code":{"type":"string"},
              "label":{"type":"string"},
              "orgId":{"type":"integer"}
          }
        },
        branchCode: {type: "string",minLength:1},
        branchName: {type: "string",minLength:1},
        active: {type: "boolean",default:true},
        description: {type: "string",}
      }
    
}