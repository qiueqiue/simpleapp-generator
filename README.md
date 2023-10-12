todo:
## high priority Job

[ ] add special search like isolate by user for autocomplete (add property of)
    choose org then branch
[ ] create invoice and receipt
[x] fix error reporting and success reporting at frontend
[x] define some allow override and some not
[ ] json schema can set generate what page type, no define = no generate page
[ ] create tenant/org/branch auto increament
[ ] focus on functions customer, product, invoice and receipt
[~] repeat same typscript formula at frontend and backend
[ ] frontend search
[ ] new transaction CRUD ui
[ ] student UI
[ ] structure of save into another document

Permission and Authorization
[x] hide no permission window
[ ] hide no permission buttons
[x] permission user/group (pick hard coded group from some place)
[ ] figure how to get enum list from permission list for user schema



1. copy group-to-role to both frontend and backend 
2. loop backend role code, and define into user role
3. loop frontend role code, and 
    1 update to getMenus, 
    2. existing all menus store as permission list
    3. crud and etc page need verify existing user can go in this menu or not. if can't will render no permission
    4. use directive to control show or not show button (new, save, delete)



Custom Document Status and API
[ ] document status control
[ ] document api touch up
1. auto add document status column
2. change document status when change status
3. enum document status, but UI dont show the field
4. have document action, then show document button


# Quick start 
** You need to have mongodb installed **
1. git clone from simpleapp-generator
```sh
npm -i @simitgroup/simpleapp-generator@latest
git clone https://github.com/SIMITGROUP/simpleapp-generator-template myapp
# edit myapp/config.json to match you mongodb connection string
cd ~/myapp
simpleapp-generator -c config.json
```
2. start backend
```sh
cd ~/myapp/backend
pnpm start:dev
```
3. start frontend
```sh
cd ~/myapp/frontend
pnpm dev
```
4. try ui:
* frontend: [http://localhost:8080](http://localhost:8080)
* backend: [http://localhost:8000/api](http://localhost:8000/api)
5. Open project with vscode, explore json schema and the generated forms
```sh
code ~/mydoc
```
you can change your project at:
* myapp/backend/.env
* myapp/backend/src/hooks/*

* myapp/frontend/.env
* myapp/frontend/pages/*



# Special Properties:
## Special root level property
_id: 
tenantId:
orgId:
branchId:
created:
createdby:
updated:
updatedby:
documentStatus
_v:
x-document-status: [optional]array of document satus: such as:
  {
      "":{"readonly":false,"allowApi":["confirm","void"],"description":"new"},
      "D":{"readonly":false,"allowApi":["confirm","void"],"description":"draft"},
      "V":{"readonly":true,"allowApi":[],"description":"v"},
      "CO":{"readonly":true,"allowApi":["void","revert"],"description":"confirmed"},
      "CL":{"readonly":true,"allowApi":[],"description":"closed"}
    }
x-document-api: [optional]array of custom api (beside default)

```typescript
[
      {"action":"confirm","method":"put","setDocumentStatus":"CO", "bpmn":"generic-confirm", 
          "data":{"document":"document"}},
      {"action":"void",,"method":"put", "setDocumentStatus":"V", "bpmn":"generic-void", 
          "data":{"document":"document"}},
      {"action":"revert",,"method":"put", "setDocumentStatus":"D", "bpmn":"generic-revert", 
        "data":{"document":"document"}},
      {"action":"duplicate", ,"method":"post","data":{"document":"document"}},
      {"action":"switchStatus",,"method":"put","data":{"statusName":"string","document":"document"}}
    ]
```
## Custom Format

## Custom Property

# Concept of Development
Development using simpleapp-generator involve below steps:
## Simple
1. create appropriate jsonschema
2. generate frontend and backend architectures
3. start backend service, obtain and save api definations into openapi.yaml
4. regenerate codes so frontend can obtain openapi clients
5. align frontend UI, add necessary component such as css and ui components

## Advance
1. complete simple task
2. add more api/process at backend `controller`,`service`,`schema`. Such as:
  a. customized search and filters
  b. customized workflows
  c. connect external api
  d. additional data processing and validation which is not supported by jsonschema (AJV)
3. security like sso/jwt, plugins
  a. keycloak integration at frontends
  b. backend manage jwt
4. allow additional field formats, validations by modifying ajv
  a. allow custom jsonschema field property, and do something at backend
  b. allow custom field format, and do something at backend
5. repeat same typscript formula at frontend and backend

Special Root Level property
[x] x-ignore-autocomplete: optional boolean, define it to allow undefine x-document-no & x-document-label
[x] x-isolation-type: optional string, how data isolated, 'none,tenant,org,branch', default 'org'

Special Field Level property



# JSON Schema supported String Format
all format recognize by ajv plus below:

1. tel: only digit, auto generate input tel
2. x-document-no : required string, document unique key by organization, will pass to autocomplete too. force by pass using property `x-ignore-autocomplete`
3. x-document-label: required string, document label use by autocomplete, force by pass using `x-ignore-autocomplete`
4. x-autocomplete-field: define this field appear in autocomplete or not
5. x-text: do nothing, will auto generate textarea



# Todo
## Update documentation and reference
1. create github simpleapp-generator-template and documentation
2. update documentation for `simpleapp-generator` and `simpleapp-vue-component`


workflow ideal
1. define apiserver at backend .env
2. api-service class can have standardway for
  a. excute new workflow
  b. get tasklist belong to me or my group
  c. trigger task move
  d. cancel workflow
  e. can define workflow inputs
3. bind hook to workflow?





1. try possibility of no backend modifications
3. completely hide all generated codes of frontend and backend, except allow change items
1. define hidden control infra of admin tenant, user api+ui (like need special role system-admin from keycloak)
add lodash  plugin at both side


autocomplete can have more dependency filter like setting in jsonschema
2. way in jsonschema to use share source code for frontend/backend like
  calculate tax
  calculate subtotal

5. new transaction crud
d. windows
new user no tenant record how to do?
8. way to handle :id/api
9. service class which not using source code



1. create follow data
  a. users
  b. tenant / users
  c. org
      branch/user
      group
  
  
3. json schema setting can define isolation type
2. page/index first login can pick tenant
3. create all window as xorg/index
4. transaction crud window 
    with x-document-api can have button for api-buttons, control by document status
    support readonly status
5. simple crud only support crud
6. support document-no
7. add special isolation method by user
8. beautify nuxt page
9. foreign key with different schema


2. tidy up error at frontend/backend messages
fix success msg at frontend
11.add simple and consistent external hook in service class. 
13.have way to create more api using different openapi schema but on same object
1. support half schema setting in crud, the rest at background

no auto logout after session expired, or auto renew token
    - menulist  ** less priority, can customize manually
10.auto bind apiclient methods to compatible with openapi methods
  a. create backend service method
  b. create controller handle
  
  b. add popup dialog for edit table
  c. separate list table and form table
  d. 
5. tenant setting
6. user management
5. security of string input, block xss
12.add pusher listener in apiclient also

18. add transaction screen templates


## Lower Priority
3. multi-lingual
6. audit trails
7. permissions
7. update record need replace  updated,updatedby, line item also need headache

11.frontend add parent/child ui for invoices

[done]
x16. support table details in generator
x3. settle instancePath in form
x17. auto add source code for addarray item
a. render autocomplete readonly field
xauto index x-document-name
x8. jwt
ximprove tel control to allow empty string
x15. some autocomplete wish to allow additional column like 6% tax, now become additional fields
x9. frontend authentication
x1. auto pretty backend and frontend
x2. fix pages:id issue
x3. search at backend
1. remain codes after regenerate (backend)
x    - service
x    - schema
x    - controller
x8. block uniquekey
1. remain codes after regenerate (frontend)
x    - pages
x    - composable  (no need )
x6. fill in data for tenant/org/branch created,updated,createdby,updatedby
14. force x-document-no/name is required



## Bug fix
1. Openapi some schema like primarykey/more not generated, cause error in ide



SimpleApp-Vue-Component Fix:
1. table
  a. column title
  b. nested column data, like primarykey label
  c. search and functions like filters, pagination, large datas
1. single/multi select
4. search at frontend



