

<template>
    <FieldContainer v-bind="$attrs" v-model="modelValue" :label="label" :description="description" :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">        
        <Checkbox
            class="simpleapp-inputfield"
            :inputId="slotprops.uuid"
            v-model="modelValue" 
            :binary="true"
            v-bind="$attrs"
            :path="setting.instancepath"
         ></Checkbox>         
    </FieldContainer>
</template>
<script lang="ts" setup>
// import {Ref} from 'vue'
import Checkbox from 'primevue/checkbox';
import FieldContainer from './SimpleFieldContainer.vue'

const modelValue = defineModel<boolean>()
const props = defineProps<{
    label?:string,    
    description?:string,
    error?:string,
    setting:any,
    instancepath?:string,
}>()

</script>