
<template>
    <FieldContainer v-bind="$attrs" :refto="id" v-model="modelValue" :label="label" :description="description" :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">        
        <Listbox v-model="modelValue" 
            class="simpleapp-inputfield"
            :id="slotprops.uuid"   
            v-bind="$attrs"
            optionValue="value"
            optionLabel="label"
            :path="setting.instancepath"
            :options="options"
            multiple
          />        
    </FieldContainer>
</template>
<script lang="ts" setup>
import {computed,watch,ref} from 'vue' 
import Listbox from 'primevue/listbox';
import FieldContainer from './SimpleAppFieldContainer.vue'
import {prepareList,simpleArrayToObject} from './helper'
import type {SimpleAppFieldSetting} from './type'
import type { JSONSchema7 } from 'json-schema';
const modelValue = defineModel()
const props = defineProps<{
    label?:string,
    id?:string,
    description?:string,
    error?:string,
    setting:SimpleAppFieldSetting,
    optionLabel?:string,
    optionValue?:string,
    instancepath?:string,
    options?:any[],
}>()
const optionValue = props.optionValue ?? 'label' 
const optionLabel  = props.optionLabel ?? 'value' 

const options = prepareList('anyOf',props.setting.fieldsetting.items,optionLabel,optionValue,props.options,)


</script>