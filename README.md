# simpleapp-generator
## this project still in alpha stage!

SimpleApp is an frontend and backend code generator, the phylosophy of this project is to allow developer build reliable and scalable application with low code philosophy. 

It suitable to project with a lot of complex data schema, complex calculation requirement:
1. sales invoice: having parent and childs as 1 document, it need to calculate tax, discount, exchange rate
2. delivery order: need to calculate total quantity, unit of measurement conversion


## Benfit
- Use `jsonschema` generate most of the frontend and backend code
- Generated frontend and backend code in typescript+OOP.
- it control as tight as possible the frontend and backend data consistency
- support complex data schema, included parent and childs, nested objects
- enforce frontend and backend use same data type
- data store in mongodb, exactly same with schema, no join no headache
- flexible frontend, you can code react or vue, no problem. `simpleapp generator` only focus data, not ui
- allow developer enforce specific data processing in frontend and backend
- you can regenerate source code multiple time without worry your customization gone (there is a way!)


## You shall know
This project assume you familiar with below:
1. typescript (no typescript, not reliable frontend)
2. mongodb
3. vue/react kind of ecosystem


## Overview of development life cycle
1. prepare environment of backend(nest), frontend (nuxt), mongodb, openapi-generator
2. prepare sample data in json format, and convert it to jsonschem [here](https://redocly.com/tools/json-to-json-schema)
3. store jsonschema somewhere and simpleapp-generator to source code into frontend and backend
4. code your frontend using nuxt and `simpleapp-uicomponent`


# Prepare environment:
it involve 3 major scope of work:
1. setup nestjs
2. setup nuxt
3. setup mongodb
4. install openapi-generator


## Backend NestJS project preparation
1. install backend nest application: `npm i -g pnpm @nestjs/cli` (cli tools for pnpm and nestjs)
2. create a folder `~/myapp`
3. cd `~/myapp`
4. create blank nest project `nest new backend`, pick `pnpm`
5. enter backend folder: `cd backend`
6. install dependency: `pnpm install --save @nestjs/swagger @nestjs/mongoose mongoose  ajv ajv-formats @nestjs/config` (ignore ✕ missing peer webpack)
7. create .env file with following settings:
```sh
MONGODB_URL='mongodb://<user>:<pass>@<host>:<port>/<db>?authMechanism=DEFAULT'
HTTP_PORT=8000
```
7. change `src/main.ts`, allow openapi document:
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Formbuilder API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { showExtensions: true },
  });

  await app.listen(process.env.HTTP_PORT); //listen which port
}
bootstrap();
```
9. start backend server `pnpm start:dev`, monitor [http://localhost:3000/api](http://localhost:3000/api)


## Frontend NuxtJS project preparation (or, any others framework if you have know how)
1. `cd ~/myapp`
2. create new frontend nuxt project `npx nuxi@latest init frontend`
3. `cd frontend`
4. install required package: `pnpm install ajv ajv-formats axios json-schema`
5. create .env file with below content
```sh
SIMPLEAPP_BACKEND_URL=http://localhost:8000
PORT=8800
```
6. run frontend: `pnpm dev -o`


## setup Mongodb
1. you can use mongodb, either docker or install binary
https://www.mongodb.com/docs/manual/installation/

## Setup openapi-generator
Refer below:
https://openapi-generator.tech/docs/installation/

I'm using mac, so i use `brew install openapi-generator`


# Job Begin!
3 steps:
1. Prepare json schema
2. use json schema generate frontend and backend codes
3. persom simple development

## 1. Prepare sample data schema
1. lets assume we have a sample data:
```json
{
    "name":{"firstName":"John","lastName":"Fox"},
    "age":20,
    "email":"john@example.com",
    "dob":"2000-01-01",
    "hobbies":["badminton","dota","reading"],
    "addresses": [{"street1":"11, Fox Road","street2":"My Home Town","postcode":12345}]
  }
```
2. Generate it become `jsonschema` [here](https://redocly.com/tools/json-to-json-schema), format as json. Follow below settings:
```
add example to schema: true
infer require property for array items: true
disable additionalProperty: true
```

Below is the sample of jsonschema:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "object",
      "properties": {
        "firstName": {
          "type": "string",
          "examples": [
            "John"
          ]
        },
        "lastName": {
          "type": "string",
          "examples": [
            "Fox"
          ]
        }
      }
    },
    "age": {
      "type": "integer",
      "examples": [
        20
      ]
    },
    "email": {
      "type": "string",
      "examples": [
        "john@example.com"
      ],
      "format": "email"
    },
    "dob": {
      "type": "string",
      "examples": [
        "2000-01-01"
      ],
      "format": "date"
    },
    "hobbies": {
      "type": "array",
      "items": {
        "type": "string",
        "examples": [
          "badminton",
          "dota",
          "reading"
        ]
      }
    },
    "addresses": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "street1",
          "street2",
          "postcode"
        ],
        "properties": {
          "street1": {
            "type": "string",
            "examples": [
              "11, Fox Road"
            ]
          },
          "street2": {
            "type": "string",
            "examples": [
              "My Home Town"
            ]
          },
          "postcode": {
            "type": "integer",
            "examples": [
              12345
            ]
          }
        }
      }
    }
  }
}
```

## Generate Code
1. install simpleapp-generetor `npm install -g simpleapp-generator`
2. create a folder `~/myapp/definations`
3. copy above jsonschema example as `~/myapp/definations/person.ps.jsonschema.json`. 
* `person`: unique document name (small letter alphabet `[a-z]`)
* `ps`: unique document type (small letter `[a-z]`)
* `jsonschema.json`: all files ending with this extension will process
4. create `~/myapp/config.json` with below content
```json
{
    "definationsFolder":"./definations",
    "backendFolder":"../backend", 
    "frontendFolder":"../frontend",
    "openapi":"openapi.yaml"
}
```
5. run `simpleapp-generator -c ./config.json`
6. restart nestjs, the microservice is ready and you can test at `http://localhost:8000/api`. All generated api accessible via swagger-ui.
7. Frontend need further work. Browse `http://localhost:8000/api-yaml`, save content as `openapi.yaml`
8. Rerun `simpleapp-generator -c ./config.json`, it will help us to generate axios executable using openapi.yaml
9. use vscode open both `~/myapp/frontend` and `~/myapp/backend`



## perform simple development
1. in `frontend` project, edit `app.vue`, put in below code:
```vue
<template>
  <div>
    <input v-mode="reactivedata">{{ reactivedata }}
    <button @click="person.create().then((res)=>console.log(res.data))">try</button>
  </div>
</template>
<script setup lang="ts">
import {PersonDoc} from './server/docs/PersonDoc'
const person = new PersonDoc()

person.update().then((res)=>console.log("dosomething"))
person.delete('record-id').then((res)=>console.log("dosomething"))
person.getById('record-id').then((res)=>console.log("dosomething"))
const noreactivedata = person.getData()
const reactivedata = person.getReactiveData()
</script>

```