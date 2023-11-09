<template>
  <FieldContainer :hidelabel="hidelabel" v-model="modelValue" :label="label" :description="description" :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">        
     
  <div v-if="componentErr!=''" class="input-error">{{componentErr}}</div>
  <span v-else-if="isReadonly" readonly class="readonly-input">{{ selecteditem[optionLabel] }}</span>
  <AutoComplete v-else 
      class="simpleapp-inputfield simpleapp-autocomplete flex flex-row "    
      :inputId="slotprops.uuid"   
      v-model="selecteditem"
      v-bind="$attrs"        
      :optionLabel="optionLabel"
      :path="setting.instancepath"   
      @blur="onblur"
      @item-select="pickValue"
      @complete="getListFromAutocompleteApi"
      :suggestions="list"
      forceSelection
      
      :dropdown="dropdown"
      :pt="{
        // root:{class: 'w-full' },
        // container:{class: 'w-full' },
        input:{class:'border w-full'}
      }"
      
        />       
        
  </FieldContainer>
</template>
<script lang="ts" setup>

import {computed,watch,ref} from 'vue'
import AutoComplete from 'primevue/autocomplete';
import FieldContainer from './SimpleAppFieldContainer.vue'
import {prepareList} from './helper'
import type {SimpleAppFieldSetting,ListOptionType} from './type'
import { SimpleAppClient } from  '../simpleapp/generate/clients/SimpleAppClient'
import type { JSONSchema7 } from 'json-schema';

type autocompletetype={[key:string]:any}

const props = withDefaults(defineProps<{
  label?:string  
  description?:string
  error?:string
  setting:SimpleAppFieldSetting
  instancepath?:string
  optionLabel:string
  dropdown?: boolean
  remoteSrc?: any
  hidelabel?:boolean
  readonly?:boolean
}>(),{
  dropdown:true,
  hidelabel:false
})
//{type:boolean, default:true, require:false},
// {type:boolean, default:false, require:false},
interface typefieldsetting extends JSONSchema7 {
  'x-foreignkey'?:string
}
const modelValue = defineModel<autocompletetype>()
const labelfield = props.optionLabel
const list = ref()
const componentErr = ref('')
let tmp:autocompletetype={} 
const fieldsetting:typefieldsetting  = props.setting.fieldsetting 

Object.assign(tmp,modelValue.value)
const selecteditem=ref(tmp)

if(!selecteditem.value[labelfield]){    
  selecteditem.value[labelfield]=''
}

const getListFromAutocompleteApi =  (event:any)=>{    
  const keyword = event.query??''  
  const remoteSrc =  props.remoteSrc
  remoteSrc.autoComplete(keyword).then((res:any)=>{
          list.value = res.data                   
      }).catch((res:any)=>{
          console.error(res)
      })
}
const emit = defineEmits(['change'])
watch(modelValue,(newvalue:autocompletetype)=>{
  selecteditem.value=newvalue
  if(newvalue){
    console.log("newvalue",newvalue,props.optionLabel)
    if(typeof newvalue[props.optionLabel] == 'undefined'){
        selecteditem.value[props.optionLabel]=''
    }
    // props.setting.document.validateFailed()
    emit('change',modelValue.value)
  }
  
})

if(fieldsetting['x-foreignkey'] == 'undefined'){
  componentErr.value='undefine "x-foreignkey" of this field in jsonschema'
}else if( !props['remoteSrc'] || !props['remoteSrc']['autoComplete']){
  componentErr.value='invalid property "remoteSrc" cause props.remoteSrc.autoComplete(keyword:string) does not exists)'
}else{
  componentErr.value=''
}


const pickValue = (event:any)=>{
  if(typeof event.value.query == 'undefined'){
      modelValue.value=event.value
  }
}

const onblur = ()=>{
  selecteditem.value={...modelValue.value}
  if(typeof selecteditem.value[labelfield]=='undefined'){
      selecteditem.value[labelfield]=''
  }  
}
const capitalizeFirstLetter = (str: string) => {
  const res = str == '' ? '' : str.slice(0, 1).toUpperCase() + str.slice(1);
  // const res = str;
  return res;
};

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
