# Simple Backend Walkthrough
Simpleapp auto generate lot of backend source codes. Most of it maintain by generator and developer shouldn't modify it to avoid future compatibility issue.

To make life easy, this document only explain the backend file which maintain by developer, which is
`service` class. 

# Service Class
It is tiny class for developer customize the behavior of every document. Most of the time you no need to change it unless you want something beyond CRUD process. Usually, we modify this file for 2 purpose:
1. add your before/after hook. such as beforeCreate, afterCreate, beforeSearch, afterSearch and etc.
2. add your own execution methods, which can bind to jsonschema `additionalApis` property


# Understand how to change service class
Example better than 100 words, you may refer:
1. `src/simpleapp/services/branch.service`:
   a. it define autorunning number into `branchId` before create new record
   b. after new branch created, it auto generate suitable document number formats. which use own customize executable `generateDefaultDocNumbers`
   c. `appuser` is compulsory parameter which store current user context, we always carry this variable in backend. we can obtain current user, currentXorg, database transactions and etc from this context
2. `src/simpleapp/services/docno.service`:
    a. there is manual defined execution `listDocFormats`. 
    b. System maintain jsonschema `Docnoformat`, defined below api setting bind to `listDocFormats`

``` typescript 
{
  "x-simpleapp-config":{
    additionalApis:[{
        "action":"listDocFormats",
        "entrypoint":"/listdocformats/:doctype",
        "requiredrole":["User"],
        "method":'get', 
        "execute":"listDocFormats",
        "description":"get list of document format for 1 doctype"
        } ],
    ...
  }, 
}
```

    c. Once `additionalApis` properties defined properly, the controller, and frontend client automatically support the api.
    d. Controller expect parameter `doctype` exists in this methods, cause entrypoint declare that
    e. `appuser` always first parameter, and 2nd parameter will base on entrypoint.

3. `src/simpleapp/services/user.service`:
    a. after specifc user deleted, it will remove all existing user permission in that tenant
4. `src/simpleapp/services/autoinc.service`:
    a. it provide autoincreament number for tenantId/orgId/branchId with execution `generateNextNo`

``` typescript
{
    "x-simpleapp-config":{
      additionalApis:[{
        action:"genNextNumber",
        entrypoint:"gennextno/:collection/:field",
        requiredrole:["User"],
        method: 'get', 
        execute:"generateNextNo",        
        description:"Get next no and trigger increase nextno"
      }],
    }
}
```

    b. same as `docno`, there is api bind to it. however there is 2 parameters in `entrypoint`. mean we will have 3 parameters in executions `appuser`, `collection`, `field`

# About Nestjs
Backend build on top of nestjs, if you role is backend developer you may spend time to learn nestjs from official website. Such as
1. controller
2. service class
3. mongoose + model
4. injection
5. modules

# Create additional api
Sometimes we may create additional API which is not related to jsonschema, in that case you may create under `src`. You may refer example: `src/profile`

# Read more
Once you familiar wit nestjs you may refer below source codes to understand what is running behind the scene:
`src/simpleapp/generate`
- `apischemas`: schema for openapi
- `commons`: many system dictionaries, providers, controls
- `controllers`: api controllers
- `defaults`: default value for every schemas
- `jsonschemas`: polished version of jsonschemas
- `models`: mongoose schema
- `processor`: parent class of service class, define something base on schema and we don't want you to change
- `sharelibs`: store formula generate from project folder, use by `processor` auto calculation.
- `types`: define all types convert from json schema, also store some system types
