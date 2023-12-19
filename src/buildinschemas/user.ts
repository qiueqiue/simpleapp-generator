import {SchemaType,RESTMethods,IsolationType} from '../type'

export const user:SchemaType ={
    type: "object",
    "x-simpleapp-config":{
        documentType:'user',
        documentName:'user',
        pageType:'crud',
        isolationType:IsolationType.tenant,
        uniqueKey:'email',        
        documentTitle:'fullname',
        requiredRoles:["SuperUser"],    
        additionalAutoCompleteFields:['uid'],
        additionalApis:[{
          action:"moredata",
          entryPoint:"/moredata",
          method:"post",
          requiredRole:["Agent_update"],     
          description:"get customer more"
        },
        {
          action:"searchCertainValue",
          entryPoint:"/searchCertainValue",
          method:"post",
          requiredRole:["Agent_update"],     
          description:"get agent more"
        }
      
      ]      
    },
    properties: {
        _id:{type:'string'},
        created:{type:'string'},
        updated:{type:'string'},
        createdBy:{type:'string'},
        updatedBy:{type:'string'},
        tenantId: {type:'integer',default:1,minimum:0 },
        orgId: {type:'integer',default:1,minimum:0 },
        branchId: {type:'integer',default:1,minimum:0 },
        uid: {type: "string",},
        fullName: {type: "string",minLength:3},
        email: {type: "string",minLength:10,format: "email"},
        active: {type: "boolean",default:true},
        description: {type:"string"},
        lastActivity: {type: "string",description:"capture ISO8601 last api call"},
        agentType: {
          type: "object",
          "x-foreignkey": "agenttype",
          properties: {
            _id: {
              "type": "string"
            },
            code: {
              "type": "string"
            },
            label: {
              "type": "string"
            }
          }
        },
        agentIcno: {type:'string'},
        agentDob: {
          type: "string",
          oneOf: [{ "format": "date" }, { "enum": [""] }]
        },
        agentTel1: {
          type: "string",
          minLength:9,
          maxLength:17
        },
        agentTel2: {
          type: "string"
        },
        agentGender: {
          type: "string",
          enum:[
              "female",
              "male"
          ]
        },
        agentRace: {
          type: "object",
          "x-foreignkey": "race",
          properties: {
              _id: {
                  type: "string"
              },
              code: {
                  type: "string"
              },
              label: {
                  type: "string"
              }
          }
        },
        agentColor: {
          type: "string",
          minLength:6,
          maxLength:6
        },
        textColor: {
          type: "string",
          default:"000000"
        },
        groups: {
          type: "array",
          items: {
            type: "object",
            "x-foreignkey": "agentgroup",
            properties: {
              _id: {
                type: "string"
              },
              code: {
                type: "string"
              },
              label: {
                type: "string"
              }
            }
          }
        },
        clients: {
          type: "array",
          items: {
            type: "object",
            "x-foreignkey": "client",
            properties: {
              _id: {
                type: "string"
              },
              code: {
                type: "string"
              },
              label: {
                type: "string"
              }
            }
          }
        },
        opportunityCount:{
          type:"number"
        },
        clientCount:{
          type:"number"
        },
        activityCount:{
          type:"number"
        }
      }
}
