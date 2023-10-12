
<template>
    <FieldContainer v-bind="$attrs" v-model="modelValue" :label="label" :description="description" :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">        
        <Password
            class="simpleapp-inputfield"
            :inputId="slotprops.uuid"   
            v-model="modelValue" 
            v-bind="$attrs"
            :path="setting.instancepath"
         ></Password>         
    </FieldContainer>
</template>
<script lang="ts" setup>
import {computed,watch,ref} from 'vue'
import Password from 'primevue/password';
import FieldContainer from './SimpleFieldContainer.vue'
const modelValue = defineModel()
const props = defineProps<{
    label?:string,
    id?:string,
    description?:string,
    error?:string,
    setting:any,
    instancepath?:string,
}>()

// const modelValue = defineModel<{modelValue?:string}>()
// console.log(modelValue.value)


// const emits = defineEmits(['update:modelValue'])
// const onchange=(e:any)=>{    
//     emits('update:modelValue',e.target.value)
// }


// watch(props ,(after,before)=>{
//     // console.log("B4",before,"after",after)
//     inputvalue.value=after.modelValue
// })
</script>