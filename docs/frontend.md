# Frontend Walkthrough
There is a 3 kinds of source code generated at frontend:
1. templates of pages (you want to change it always)
2. resource documents (you can assume it is your api client. you may change or may not change it)
3. a lot of dictionaries, libraries, classes, middlewares, plugins which you don't want to change


Frontend codes generated will 0 style, to create good product developer shall familiar with:
1. nuxt 
    a. pages/layouts/components/composables/styles
2. primevue
    a. common components, overlays, dialogs and etc
    b. pass through system
3. tailwind
    a. flex/grids
    b. common design classes like bg, paddings, borders, margins, fonts and etc





## frontend/pages/[xorg]/<resourcename>
1. simpleapp generate simple page here. you shall change the look and feel of the resource
2. remove file `delete-me.txt` to prevent future code generator override your modifications
3. pages auto import `$<resourcename>Doc` from useNuxtApp(). 
4. init document object by `const doc = $CategoryDoc();` 
5. obtain vue reactive variable by `const data = doc.getReactiveData();`
6. You may refer more advance example such as `docnoformat/index.vue`,`organization/index.vue`,`user/index.vue`
7. there is special `SimplAappXXXX` inputs, request `v-model` and `setting`. Once it bind properly will manage data nicely.
8. the inputs not only bind the data, violate input constraint it will give appropriate hint below the input field
9. the pages control by middleware, if user have permission access current page then allow access the pages
10. buttons control by role base access control system too


## frontend/simpleapp/docs/<resourcename>Doc
1. it is tiny class extend from parent <resourcename>Client (you dont want to change it cause it always override by code gen). Technically `client` class:
* store plenty of use useful information such as jsonschemas, data types
* prepare useful methods, like create/update/delete which connect to backend, also provide method for add new item of array property
* it manage auto execution of formula in jsonschemas too
* auto trigger frontend event after CRUD process
* provide default values of data, and sub data

2. Usually no need change <resource>Doc, unless we want to define some reusable codes for different pages. Such as:
a. After user pick value from autocomplete, it trigger some actions
b. some reusable frontend only codes which we don't want to implement as formula at schema

3. Once generated, <resource>Doc will remain as it is. regenerate of source code won't override it (except special system reserved resource control by code generator).

4. refer example of how to use resource document `pages/docnoformat/index.vue`,`pages/organization/index.vue`,`pages/user/index.vue`


## Design for frontend
There is few area effect frontend design:
1. `nuxt.config.ts/css`: store css load sequence
2. `tailwind.config.ts`: define what tailwind overide. there is simple example which define some colors. It is preferable way of extends tailwind, cause vscode intellisense plugin know it and provide autocompletion while we write vue componets. Example `text-primary-300` is recognise as valid class
3. `assets/primevue/passthrough`: we can centralize define all passthrough of each kind of primevue component here
4. `assets/css/style.css`: define your own customize class if tailwind default class not suitable for you