
<template>
    <FieldContainer :hidelabel="hidelabel" v-model="modelValue" :label="label" :description="description"  :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">
        <InputNumber class="simpleapp-inputfield" 
            :inputId="slotprops.uuid"
            v-model="modelValue"    
            :path="setting.instancepath"
            :pt="{input:{class:'text-right w-full'}}"                          
            :readonly="isReadonly"
         ></InputNumber>
    </FieldContainer>
</template>
<script lang="ts" setup>
import {computed,watch,ref} from 'vue'
import InputNumber from 'primevue/inputnumber';
import FieldContainer from './SimpleAppFieldContainer.vue'
const props = withDefaults(defineProps<{
    label?:string,
    description?:string,
    setting:any
    error?:string,
    instancepath?:string,
    hidelabel?:boolean
    readonly?:boolean
}>(),{
    hidelabel:false
})
const emit = defineEmits(['change'])
const modelValue =defineModel()
const isReadonly = computed(()=>{
    if(props.readonly){
        return props.readonly
    }else if(props.setting.readonly){
        return props.setting.readonly
    }else{
        return false
    }
})
watch(modelValue,()=>{
    // props.setting.document.validateFailed()
    emit('change',modelValue)
})
</script>
