# simpleapp-generator
generate openapi3 compatible frontend/backend codes using jsonschema

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