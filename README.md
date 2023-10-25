# Quick start
1. create project folder
```sh
mkdir project1
cd project1
```
2. install simpleapp-generator 
```sh
npm install -g @simitgroup/simpleapp-generator
```
3. init project folder, it will create some samples too
```sh
simpleapp-generator -g init
```
4. prepare backend
```sh
sh build.sh backend
cd backend
pnpm start:dev
```
5. prepare frontend
```sh
sh build.sh frontend
cd frontend
pnpm start
```

# Perform Development
1. add some schemas from project1/schemas
2. then run 
```sh
sh build.sh updatebackend
sh build.sh updatefrontend
```
3. to add different user group permission, you may change `project1/groups`



