
<template>
    <FieldContainer v-bind="$attrs" v-model="modelValue" :label="label" :description="description" :setting="setting" :error="error" #default="slotprops">
        <Chips class="simpleapp-inputfield simpleapp-inputchip"
            v-model="modelValue"    
            :inputId="slotprops.uuid"
            v-bind="$attrs"
         ></Chips>         
    </FieldContainer>
</template>
<script lang="ts" setup>
import {computed,watch,ref} from 'vue'
import Chips from 'primevue/chips';
import FieldContainer from './SimpleFieldContainer.vue'
// const modelValue = defineModel()

const modelValue=defineModel()
const props = defineProps<{
    label?:string,
    description?:string,
    setting?:any,
    error?:string
}>()
</script>
<style >


</style>