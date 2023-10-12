
<template>
    <FieldContainer v-bind="$attrs" v-model="modelValue" :label="label" :description="description" :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">        
        <Textarea
            class="simpleapp-inputfield"
            :id="slotprops.uuid"
            v-model="modelValue" 
            v-bind="$attrs"
            :autoResize="autoResize"
            :path="setting.instancepath"
         ></Textarea>         
    </FieldContainer>
</template>
<script lang="ts" setup>
import {computed,watch,ref} from 'vue'
import Textarea from 'primevue/textarea';

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