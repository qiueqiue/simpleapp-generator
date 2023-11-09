
<template>
    <FieldContainer v-bind="$attrs"
    v-model="modelValue"
     :label="label"
    :description="description" 
     :setting="setting" 
     :instancepath="instancepath" 
     :error="error"
      #default="slotprops">
        <div v-for="(o, index) in options" :key="index" class="simpleapp-inputradio">
            <RadioButton 
                v-model="modelValue"  
                :inputId="`${slotprops.uuid}_${index}`" 
                :value="o.value" />
            <label :for="`${slotprops.uuid}_${index}`">{{ o.label }}</label>
        </div>        

              
    </FieldContainer>
</template>
<script lang="ts" setup>
import RadioButton from 'primevue/radiobutton';
import FieldContainer from './SimpleAppFieldContainer.vue'
import {prepareList,simpleArrayToObject} from './helper'
import type {ListOptionType} from './type'
const modelValue = defineModel()
const props = defineProps<{
    label?:string,
    description?:string,
    error?:string,
    setting:any,
    optionLabel?:string,
    optionValue?:string,
    instancepath?:string,
    options?:any[],
}>()
const optionValue = props.optionValue ?? 'label' 
const optionLabel  = props.optionLabel ?? 'value' 
const options = prepareList('oneOf',props.setting.fieldsetting,optionLabel,optionValue,props.options,)

</script>