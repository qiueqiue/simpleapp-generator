# Quick start 
1. git clone from simpleapp-generator
```sh
git clone https://github.com/SIMITGROUP/simpleapp-generator-template myapp
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
[Simple]
1. create appropriate jsonschema
2. generate frontend and backend architectures
3. start backend service, obtain and save api definations into openapi.yaml
4. regenerate codes so frontend can obtain openapi clients
5. align frontend UI, add necessary component such as css and ui components

[Advance]
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
