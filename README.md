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
explore codes in:
* myapp/backend/src/class/docs/*, especially `controller,service,apischema`   
* myapp/backend/.env
* myapp/backend/dicts/foreignkeys.json 
* myapp/frontend/pages/*
* myapp/frontend/simpleapps/docs
* myapp/frontend/.env

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


# Todo
## Update documentation and reference
1. create github simpleapp-generator-template and documentation
2. update documentation for `simpleapp-generator` and `simpleapp-vue-component`



## high priority Job
x1. auto pretty backend and frontend
x2. fix pages:id issue
x3. search at backend
1. remain codes after regenerate (frontend)
x    - pages
x    - composable  (no need )
    - menulist  ** less priority, can customize manually
1. remain codes after regenerate (backend)
x    - service
x    - schema
x    - controller
5. tenant setting
6. user management
2. tidy up error at frontend/backend messages
3. settle instancePath in form
5. security of string input, block xss
x6. fill in data for tenant/org/branch created,updated,createdby,updatedby
7. update record need replace  updated,updatedby, line item also need headache
x8. block uniquekey

## Lower Priority
3. multi-lingual
6. audit trails
7. permissions
x8. jwt
x9. frontend authentication
11.frontend add parent/child ui for invoices

## Bug fix
1. Openapi some schema like primarykey/more not generated, cause error in ide



SimpleApp-Vue-Component Fix:
1. table
  a. column title
  b. nested column data, like primarykey label
  c. search and functions like filters, pagination, large datas
1. single/multi select
4. search at frontend