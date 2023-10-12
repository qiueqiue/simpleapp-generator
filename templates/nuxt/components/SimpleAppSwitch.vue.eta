

<template>
    <FieldContainer v-bind="$attrs" v-model="modelValue" :label="label" :description="description" :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">        
        <InputSwitch
            class="simpleapp-inputswitch"
            :inputId="slotprops.uuid"
            v-model="modelValue"  
            :binary="true"
            v-bind="$attrs"
            :path="setting.instancepath"
         ></InputSwitch>         
    </FieldContainer>
</template>
<script lang="ts" setup>
// import {Ref} from 'vue'
import InputSwitch from 'primevue/inputswitch';
import FieldContainer from './SimpleFieldContainer.vue'

const modelValue = defineModel<boolean>()
const props = defineProps<{
    label?:string,
    id?:string,
    description?:string,
    error?:string,
    setting:any,
    instancepath?:string,
}>()

</script>