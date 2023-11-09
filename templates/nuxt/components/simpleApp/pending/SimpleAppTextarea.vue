
<template>
    <FieldContainer v-bind="$attrs" v-model="modelValue" :label="label" :description="description" :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">        
        <Textarea
            class="simpleapp-inputfield"
            :id="slotprops.uuid"
            v-model="modelValue" 
            v-bind="$attrs"
            :autoResize="autoResize"
            :path="setting.instancepath"
            :readonly="isReadonly"
         ></Textarea>         
    </FieldContainer>
</template>
<script lang="ts" setup>
import {computed,watch,ref} from 'vue'
import Textarea from 'primevue/textarea';

import FieldContainer from './SimpleAppFieldContainer.vue'
const modelValue = defineModel()
const props = defineProps<{
    label?:string,
    id?:string,
    description?:string,
    error?:string,
    setting:any,
    autoResize?:boolean,
    instancepath?:string,
    readonly?:boolean

}>()
const isReadonly = computed(()=>{
    if(props.readonly){
        return props.readonly
    }else if(props.setting.readonly){
        return props.setting.readonly
    }else{
        return false
    }
})
</script>