
<template>
    <FieldContainer v-bind="$attrs" v-model="modelValue" :label="label" :description="description" :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">        
        <Editor
            class="simpleapp-inputfield"
            :inputId="slotprops.uuid"
            v-model="modelValue" 
            v-bind="$attrs"
            :autoResize="autoResize"
            :path="setting.instancepath"
         ></Editor>         
    </FieldContainer>
</template>
<script lang="ts" setup>
import {computed,watch,ref} from 'vue'
import Editor from 'primevue/editor';


import FieldContainer from './SimpleFieldContainer.vue'
const modelValue = defineModel()
const props = defineProps<{
    label?:string,
    id?:string,
    description?:string,
    error?:string,
    setting:any,
    autoResize?:boolean,
    instancepath?:string,
}>()

</script>