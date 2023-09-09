after generate
1. `./backend/tsconfig.ts` add bolow into compile options
```typescript
"resolveJsonModule": true,
"esModuleInterop": true,
```
2.`./backend/.env` change mongodb setting as below example:
```bash
MONGODB_URL='mongodb://mongoadmin:secret@localhost:27017/admin?authMechanism=DEFAULT'
```
3. download http://localhost:8080/api into `./openapi.yaml`
4. regenerate code (for frontend can function completely)
5. 


1. install openapi-generator, pnpm, nest, rename openapi for new setup
2. load backend tsconfig and add more property: **
3. add prettier formating option for frontend
4. error messages
5. fix single and multi select bugs
6. function of remain menulist
7. security of string input, block xss


errors formating
18.keep audit trail into db
10.add backend find options
10.add frontend find options
11.retain modifications of controller, service, apiclients
14.add permission control
16.access right
17.setting of tenants

authentication in nuxt
jwt in backend


9. beautify default tailwind ui
  1. front page
  2. top bar
  3. menu bars
  4. default with of each component is it nicely fit
  5. table layout  
  7. error formating
9. write proper user guide
13.add workflow functions



hold

10.plugin for ajv
  long string format for description

# Todo
x21.control csrf
x8. simpleapp generate currentfolder error **
x1. override app.vue * 
x2. create layout  
  simpleapp (first time only) 
      /default *
x3. components/  (first time only)
x    /MonitorEvent.vue *
x    /CrudBasic.vue **
x    /Menubar *
4. create page/docs (everytime)
  /index.ts
  //create page if docs/documentname not exists  ***
  //override if docs/documentname/delete-me-for-avoid-override exists  *
5. login/logout sessions
x6. auto create *
x    server/api to backend *





1. define foreign key relationship in json schema2
2. auto index and block deletion
3. when delete identify foreign connected documents
4. how to unique key
5. how to multi-tenancy
6. login/logout in nuxt
7. jwt in nestjs
8. format errors at server side link back client side
9. how to auto toast
10.server side custom validation link back client side
11.permission controls
12.find records
13.audit trail
14.data isolation by org, branch and tenant
15.statistics, aggregations
16.auto generate frontend page
17.





# simpleapp-generator
## this project still in alpha stage!

SimpleApp is an frontend and backend code generator, the ideal of this project is to allow developer build reliable and scalable application with low code methods. 

It suitable for complex schema +complex calculation such as:
1. sales invoice: having parent and childs as 1 document, it need to calculate tax, discount, exchange rate
2. delivery order: need to calculate total quantity, unit of measurement conversion

Key Ideal:
1. Every data store as json format, name as `document`
2. Every document defined by jsonschema, and store in folder `definations`
3. We store jsonschema as `<uniquedocumentname>.<uniquedocumentshortname>.jsonschema.json`. Example: `purchaseorder.po.jsonschema.json`, `student.std.jsonschema.json`
4. `JsonSchema` used to generate:
    - multiple pattern of data types for database, dto, frontend, backend. The data type match to `jsonschema`
    - api controller (openapi)
    - simpleapp frontend and backend objects
5. Generated code will control data validation in both frontend and backend using `ajv`
6. There is few important keyword need to know:
    - `jsondata`: actual data like `{"document_no":"PO001",amount:300}`
    - `jsonschema`: it is schema of `jsondata`, we use it to generate CRUD codes 
    - `frontend`: user interface framework using nuxt (vue+typescript), it doesn't store any data
    - `backend`: api server using nest(typescript), it provide openapi, and store data into mongodb
    - `doc service`: a typescript class use for process specific document in server. example" `po.service.ts`
    - `doc controller`: it is api router for route http traffic to document service. example: `po.controller.ts`
    - `doc client`: frontend client, it provide reactive data and data processing mechanism for frontend

6. To make our app useful, we perform development at
    - backend: modify `api controller` and `backend document service`
    - frontend: layout user interface, bind input fields to `doc client` , and modify `doc client` required
7. We may frequently change `jsonschema`, `doc service`, `doc controller`, `doc client`:
    - the previous modified code remain when you regenerate code (with specific rules)
8. After regenerate codes, some data processing codes in `doc service` will sync into `doc client`, to reduce repeat coding at both end

## Benefit
- Use `jsonschema` generate most of the frontend and backend code
- Generated frontend and backend code in typescript+OOP.
- it control as tight as possible the frontend and backend data consistency
- support complex data schema, included parent and childs, nested objects
- enforce frontend and backend use same data type
- data store in mongodb, exactly same with schema, no join no headache
- flexible frontend, you can code react or vue, no problem. `simpleapp generator` only focus data, not ui
- allow developer enforce specific data processing in frontend and backend
- you can regenerate source code multiple time without worry your customization gone (there is a way!)


Init Nuxt script
1. npm i -D @sidebase/nuxt-auth
2. pnpm i --save next-auth@4.21.1
npm i -D @sidebase/nuxt-session



## You shall know
This project assume you familiar with below:
1. typescript (no typescript, not reliable frontend)
2. mongodb
3. vue/react kind of ecosystem

# Special Format:
There is special format value:
1. `field-autcomplete-code`:field for document code, like `student_code,document_no`
2. `field-autocomplete-label`: field for document name, like `student_name, product_name`

# Special properties:
## object:
* autocomplete-src=category  => autocomplete list from server-url/category/autocomplete

You need to install mongodb and openapi generator:
1. https://www.mongodb.com/docs/manual/installation/
2. https://openapi-generator.tech/docs/installation/

# Quick Start
This quick start create a example project developed by simpleapp-generator      
1. Install `simpleapp-generator`
```sh
npm install -g simpleapp-generator
```
2. mkdir project folder for store frontend and backend codes
```sh
mkdir ~/myapp
cd myapp
```
3. generate sample project 
```sh
simpleapp-generator -e person    # -e mean use example schema "person". Currently only 1 example
```

4. run backend apiserver
```sh
cd backend
pnpm start:dev
```
5. browse to `http://localhost:8000/api` for swagger ui, `http://localhost:8000/api-yaml` for openapi documents
6. You may use vscode to see the example code in `backend/src/docs/pes`:
- pes.controller.ts   //document api controller
- pes.service.ts      //document service controller
- pes.type.ts, pes.apischema.ts, pes.model.ts         //multiple datatype or schema








```
mkdir definations   #we put json schema here

```
3. create configuration file `config.json` 
```sh
echo '{"definationsFolder":"./definations","backendFolder":"./backend", "frontendFolder":"./frontend","openapi3Yaml":""}' > config.json
```
4. create below content and save as `~/myapp/definations/person.pes.jsonschema.json`
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
5. generate backend and frontend codes, and define backend/.env `mongodb connection` string:
```sh
simpleapp-generator -c ./config.json
code backend # use vscode open backend project, edit .env
```
6. You can start backend server and try the generated api at `http://localhost:8000/api`
```sh
cd ~/myapp/backend
pnpm start:dev   
```
7. Next we need more frontend work, put content of `http://localhost:8000/api-yaml` into `~/myapp/openapi.yaml`, and edit config.json as:
```json
{
    "definationsFolder":"./definations",
    "backendFolder":"./backend",
    "frontendFolder":"./frontend",
    "openapi3Yaml":"./openapi.yaml"
 }
```
8. regenerate source code, and use vscode open both backend and frontend project:
 ```sh
simpleapp-generator -c ./config.json
code ./frontend ;
code ./backend ;
```


# The complete development process:
1. Prepare documents
    a. Prepare sample json data
    b. Convert `json` data to `jsonschema`
    c. touch up jsonschema, like define require fields, format, minLength and etc
    d. place json schema into `definations` folder
2. Generate source codes
    a. generate source code into backend project
    b. start backend service, obtain yaml content and save into project folder
    c. re-generate source code, it create required codes for frontend 
3. Begin Frontend development:
    a. use vscode open frontend project
    b. create user interface with several input fields, bind to generated simpleapp object

## 1. Prepare documents
1.  [click here](https://www.convertsimple.com/convert-javascript-to-json/) allow you create json data with lesser effort. Lets use this example:
```json
{
  "docNo": "SI001",
  "customer": "My Customer Pte Ltd",
  "amount": 200,
  "products": [
    "apple",
    "orange"
  ],
  "details": [
    {
      "item": "apple",
      "qty": 100,
      "unitprice": 1,
      "subtotal": 100
    },
    {
      "item": "orange",
      "qty": 100,
      "unitprice": 1,
      "subtotal": 100
    }
  ],
  "remarks": "need fast delivery"
}
```
b. Copy generated json data to [here](https://redocly.com/tools/json-to-json-schema) using below setting, you may define data type/format/required parameters according [jsonschema standard](https://json-schema.org/understanding-json-schema/reference/index.html)
```
output format: json
add example to schema: true
infer require property for array items: true
disable additionalProperty: true
```
Here is the result:
```json
{
  "type": "object",
  "properties": {
    "docNo": {
      "type": "string",
      "examples": [
        "SI001"
      ]
    },
    "customer": {
      "type": "string",
      "examples": [
        "My Customer Pte Ltd"
      ]
    },
    "amount": {
      "type": "integer",
      "examples": [
        200
      ]
    },
    "products": {
      "type": "array",
      "items": {
        "type": "string",
        "examples": [
          "apple",
          "orange"
        ]
      }
    },
    "details": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "item",
          "qty",
          "unitprice",
          "subtotal"
        ],
        "properties": {
          "item": {
            "type": "string",
            "examples": [
              "apple",
              "orange"
            ]
          },
          "qty": {
            "type": "integer",
            "examples": [
              100,
              100
            ]
          },
          "unitprice": {
            "type": "integer",
            "examples": [
              1,
              1
            ]
          },
          "subtotal": {
            "type": "integer",
            "examples": [
              100,
              100
            ]
          }
        }
      }
    },
    "remarks": {
      "type": "string",
      "examples": [
        "need fast delivery"
      ]
    }
  }
}
```
c. save the json data into `definations` folder





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
PROJECT_NAME='SimpleApp Demo1'
PROJECT_DESCRIPTION='Try CRUD'
PROJECT_Version='1.0.0'
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
    .setTitle(process.env.PROJECT_NAME)
    .setDescription(process.env.PROJECT_DESCRIPTION)
    .setVersion(process.env.PROJECT_VERSION)
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
** remember create database, and define suitable credentials (user/password)

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
    "openapi3Yaml":"openapi.yaml"
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
    <div>
      <label>Firstname</label>
      <input v-model="reactivedata.name.firstName">  
    </div>
    {{ reactivedata }}
    <button @click="person.create().then((res)=>console.log(res.data))">try</button>
  </div>
</template>
<script setup lang="ts">
import {PersonDoc} from './server/docs/PersonDoc'
const person = new PersonDoc()

// person.update().then((res)=>console.log("dosomething"))
// person.delete('record-id').then((res)=>console.log("dosomething"))
// person.getById('record-id').then((res)=>console.log("dosomething"))
// person.list().then((res)=>console.log(res))
const noreactivedata = person.getData()  //give not reactive data, it cant apply 2 way data binding
const reactivedata = person.getReactiveData() //give vue reactive data, it can apply 2 way data binding using v-model
</script>
```

We notice:
1. `PersonDoc` auto generated, it come with plenty of build in crud features which you can use without knowing API:
```typescript
person.create().then((res)=>console.log("dosomething"))
person.update().then((res)=>console.log("dosomething"))
person.delete('record-id').then((res)=>console.log("dosomething"))
person.getById('record-id').then((res)=>console.log("dosomething"))
person.list().then((res)=>console.log(res))
```
2. `person.getData()` gave reactive object, we can bind all properties directly to `vue` component using `v-model`
3. you may try add more input bind to `reactivedata.name.lastName`,`reactivedata.email`, `reactivedata.age` and monitor result
4. `button` can directly trigger `save` method from person.getData()
5. You wont able to save the record because it not pass validation rules, check browser console it tell you what is happening
6. There is UI component `simpleapp-uicomponent` which can integrate nicely with with `PersonDoc`. Refer the link [here](...)

# We can do more With SimpleApp
## no time for full documentation yet
1. Monitor variable change at frontend
step 1: add new methods for frontend's class `PesonDoc.ts` 
```
    watchChanges = ()=>{
        watch(this.getReactiveData(),(newdata)=>{ 
            this.getReactiveData().age=calculateAge(newdata.dob)
            //apply others changes here
            })
    }
```
step 2: edit `app.vue` to on the watcher
```typescript
//others codes
const person = new PersonDoc()
person.watchChanges()  //<-- add this line to on watcher at frontend
//others codes
```

2. create more api to `person`, such as `post /person/:id/sendEmail {title:"title",body:"body"}`
step 1: edit backend `<backend>/src/docs/pes/pes.controller.ts`, add new source code between `<begin-controller-code>` and `<end-controller-code>`:
```typescript
//<begin-controller-code>
//new api, wont override when regenerate code
  @Get('/try/:id')
  @ApiResponse({
    status: 200,
    description: 'success',
    type: pesapischema.Person,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  @ApiOperation({ operationId: 'newFindOne' })  //important, frontend access it via person.newFindOne()
  async newFindOne(@Param('id') id: string) {
    return this._findOne(id);
  } 
  //<end-controller-code>
```
step 2: try browse to `http://localhost:8000/api` to check new api appear or not. 
step 3: You shall regenerate the code
```bash
simpleapp-generator -c ./config.json
```
step 4: go frontend project, edit `app.vue` you may try type  `person.newFindOne()` see new method exists?

step 3: Regenerate code for frontend  

4. create backend only execution for `person`. It is useful cause some work only 
step 1: Edit backend `backend/src/docs/pes/pes.service.ts`, add new source code between `<begin-backend-code>` and `<end-backend-code>`:
```typescript
//<begin-backend-code>
   //new method, wont override when regenerate code
  logSomething = () => {
    console.log('Access try api');
  };
  //<end-backend-code>
```
step 2: modify `<backend>/src/docs/pes/pes.controller.ts`, call the new method
```typescript
async newFindOne(@Param('id') id: string) {
    this.service.logSomething();  //this.service is our service class
    return this._findOne(id);
  }
```


5. create frontend only code for `person`, such as:
    `person.addHobbies('hobby1')`,`person.addAddress({})`,`person.delAddress(index:number)` edit `newFindOne`:
```
```
6. create bothend code for `person`



foreign key
cat
  category_id
  category_code
  category_name

product
  product_id
  product_code
  product_name
  category => category_id: category_code



invoice
  invoice_id
  invoice_no
  invoice_date
  total
  details => 
    product => product_id: product_code
    qty 
    price 
    subtotal

order
  order_id
  order_no
  order_date
  total
  details => 
    product => product_id: product_code
    qty 
    price 
    subtotal

    
cat => foreignkey: []
prd => foreignkey: category => category
invoice => foreignkey: detail.product=>product
order => foreignkey: detail.product=>product

cat =[product.category]
product=[invoice.detail.product, order.detail.product]