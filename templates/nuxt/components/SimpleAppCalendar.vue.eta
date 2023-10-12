<template>
    <FieldContainer v-bind="$attrs" v-model="modelValue" :label="label" :description="description" :setting="setting" :error="error"  #default="slotprops">
    <Calendar
     v-model="datedata"  
     :inputId="slotprops.uuid"
     @update:modelValue="change"
      :numberOfMonths="2" 
      v-bind="$attrs"
      :dateFormat="dateformat"/>
    </FieldContainer>
</template>
<script setup lang="ts">
import FieldContainer from './SimpleFieldContainer.vue'
import { ref, watch,computed } from "vue" 
import moment from 'moment'
import Calendar from 'primevue/calendar';


const x = new Date()
const date = ref<Date>()
// const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
    label?:string,
    id?:string,
    description?:string,
    setting?:any,
    error?:string,
}>()
const modelValue = defineModel<string>()
const emit = defineEmits(['update:modelValue'])
const getDateFormat=():string=>{
    // const date = new Date();
    const date = new Date();
    const datestr = date.toLocaleDateString()    
    let day =date.getDate().toString()
    day = day.length == 1 ? '0'+day : day
    let month = (date.getMonth() + 1).toString()
    month = month.length == 1 ? '0'+month : month
    const year = date.getFullYear().toString()
    const dateformat = datestr.replace(year,'yy').replace(month,'mm').replace(day,'dd');
    return  dateformat
}
const datestr:string = modelValue.value??''
const datedefaultdata = new Date(datestr)
const dateformat = computed(()=> getDateFormat())
const datedata = ref(datedefaultdata)
watch(props,(newvalue)=>{    
    datedata.value =  new Date(datedefaultdata)
})

const change = (e:Date)=>{
    const newdate:string  = moment(e).format("yyyy-MM-DD")
    emit('update:modelValue',newdate)   
}
</script>