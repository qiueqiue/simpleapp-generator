<template>
    <div class="simpleapp-crudsimple">    
        <button class="bg-primary" type="reset" @click="newData">New</button>
        
      
      <SimpleAppDatatable
            @row-dblclick="editRecord"
            v-model="recordlist"
            :setting="{}"
            :columns="listColumns"
          ></SimpleAppDatatable>

      <DebugDocumentData v-model="data"/>
    </div>

    <Dialog v-model:visible="visible" modal header="Header" class="crudsimple-dialog" :autoZIndex="false" :style="{zIndex:100, width: '80vw' }">        
        <SimpleAppForm :document="obj" :title="title" #default="o">     
          <div class="simpleapp-tool-bar"   >
            <button class="bg-default" :disabled="disabled" @click="newData" type="reset">New</button>
            <button class="bg-primary" :disabled="disabled" @click="saveData" type="submit">Save</button>
            <button class="bg-danger" :disabled="disabled" @click="deleteData($event)">Delete</button>
            <ProgressSpinner v-if="disabled==true" style="width: 2rem; height: 2rem" ></ProgressSpinner>
            <ConfirmPopup></ConfirmPopup>
          </div>
        <slot :data="o.data" :getField="o.getField" name="default"></slot>
      </SimpleAppForm>
    </Dialog>
</template>
<script setup lang="ts">

import { SimpleAppClient } from '@simitgroup//simpleapp-vue-component/src/SimpleAppClient';
import SimpleAppForm from '@simitgroup/simpleapp-vue-component/src/components/SimpleAppForm.vue';
import SimpleAppDatatable from '@simitgroup/simpleapp-vue-component/src/components/SimpleAppDatatable.vue';
import Dialog from 'primevue/dialog';
import axios from 'axios'
import ProgressSpinner from 'primevue/progressspinner';

import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const props = defineProps<{
    document:SimpleAppClient<any,any>
    listColumns:string[]
    title:string
}>()
const visible = ref(false)
const obj = props.document
const data = obj.getReactiveData()
const disabled=ref(false)
const recordlist = ref();
const setCsrf=()=>{
  // const { csrf } = useCsrf()
  //   console.log('csrf',csrf)
  //   axios.defaults.headers.common = {      
  //     "X-CSRF-TOKEN": csrf
  //   };
}

const refresh = () => {
  obj.list().then((res:any) => {    
    recordlist.value = res;
    disabled.value=false
  });
};
const newData = () => {
    obj.setNew()
    setCsrf()
    visible.value=true;
};

const editRecord = (event: any) => {
  obj.getById(event.data._id);
  setCsrf()
  visible.value=true
};

const saveData = () => {
  disabled.value=true
  if (data.value._id == "") {
    obj.create().then(()=>{visible.value=false}).catch(()=>setCsrf()).finally(() => refresh());
  } else {
    obj.update().then(()=>visible.value=false).catch(()=>setCsrf()).finally(() => refresh());
  }
};
const deleteData = (event:Event) => {
    
    confirm.require({
        target: event.currentTarget as HTMLElement,
        message:'Delete?',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: ()=>{
            disabled.value=true 
            obj.delete(data.value._id ?? "").then(()=>visible.value=false).finally(() => {
                refresh();    
            });
        },
        reject: () => {
            setCsrf()            
            console.log("Cancel delete")
        }
    })
  
};
refresh();
</script>
<style scoped>
.crudsimple-dialog{
    z-index: 100;
}
</style>