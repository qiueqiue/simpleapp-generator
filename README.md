# simpleapp-generator
generate openapi3 compatible frontend/backend codes using jsonschema

# Backend NestJS project preparation
1. install backend nest application: `npm i -g pnpm @nestjs/cli` (cli tools for pnpm and nestjs)
2. create a folder `~/myapp`
3. cd `~/myapp`
4. create blank nest project `nest new backend`, pick `pnpm`
5. enter backend folder: `cd backend`
6. install dependency: `pnpm install --save @nestjs/swagger @nestjs/mongoose mongoose  ajv ajv-formats @nestjs/config` (ignore ✕ missing peer webpack)
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

  await app.listen(3000); //listen which port
}
bootstrap();
```

8. create .env file with following settings:
```sh
    MONGODB_URL='mongodb://<user>:<pass>@<host>:<port>/<db>?authMechanism=DEFAULT
```
9. start backend server `pnpm start:dev`, monitor [http://localhost:3000/api](http://localhost:3000/api)


# Frontend NuxtJS project preparation (or, any others framework if you have know how)


# how to use:
1. create json schema file, may use online tool from https://redocly.com/tools/json-to-json-schema
2. create a blank folder, name as project1
3. save the json schema file as `<documentname>`.`<doctype>`.jsonschema.json, example `purchaseorder.po.jsonschema.json`
4. install generator using `npm install -g simpleapp-generator`
5. `simpleapp-generator -h` to see how to create configuration file
6. `simpleapp-generator -c config.json` to generate code. the `definations` point to folder `project1` 


# how to build and run the source
1. `npm run build`
2. `npm -g install`
3. follow step how to use