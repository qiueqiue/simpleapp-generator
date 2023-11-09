
<template>
    <FieldContainer :hidelabel="hidelabel" v-model="modelValue" :label="label" :description="description"  :setting="setting" :instancepath="instancepath" :error="error" #default="slotprops">
        <div class="p-inputgroup ">
            <InputText class="simpleapp-inputfield" 
                :inputId="slotprops.uuid"
                v-model="modelValue"    
                :placeholder="placeholder"
                :path="setting.instancepath"
                :pt="{input:{class:'text-right w-full'}}"                          
            />
            <span class="p-inputgroup-addon p p-0">
                <Button class="pi pi-angle-down"  type="button" @click="toggle"></Button>

                <OverlayPanel ref="op">                    
                    <ul>                      
                        <li v-for="docno in docFormatlist" class="hover-list-primary " >
                            <a class="flex-row p-2 mt-4" @click="chooseFormat(docno)">
                                <span class="pi pi-hashtag mr-2"></span>
                                <span class="">{{docno.docNoFormatName}}</span>
                                <span class="ml-2 text text-green-600">{{docno.sample}}</span>
                            </a>
                        </li>                    
                    </ul>
                </OverlayPanel>
            </span>
            <!-- {{ Object.getOwnPropertyNames(setting) }} -->
        </div>
    </FieldContainer>
</template>
<script lang="ts" setup>
import {ForeignKey} from '~/types'
import OverlayPanel from 'primevue/overlaypanel';
import {computed,watch,ref} from 'vue'
import InputText from 'primevue/inputtext';
import FieldContainer from './SimpleAppFieldContainer.vue'
import {DocNoFormat} from "~/types"
const selectedformat = ref()
const op = ref();
const placeholder = ref('')
const docFormatlist = ref()
const modelValue = defineModel<string>()
const docNoFormat = defineModel<ForeignKey>('docNoFormat')
// const emit = defineEmits(['update:docNoFormat'])

const props = withDefaults(defineProps<{
    // docNoFormat:object,
    // docFormatlist?:DocNoFormat[]
    label?:string,
    description?:string,
    setting:any
    error?:string,
    instancepath?:string,
    hidelabel?:boolean, 
    
}>(),{
    hidelabel:false
})
const documenttype = props.setting.document.doctype


const toggle = async (event:any) => {
    op.value.toggle(event);
    
        
}

const chooseFormat =  (item:any) =>{
    placeholder.value = item.sample    
    const f = item
    docNoFormat.value = { _id : f._id, label : f.docNoFormatName}
    op.value.toggle();
}

const loadDocFormats = async () =>{
    docFormatlist.value= await getDocFormats(documenttype)    
    if(docFormatlist.value.length>0){
        const f = docFormatlist.value[0]
        docNoFormat.value = { _id : f._id, label : f.docNoFormatName}
        placeholder.value = docFormatlist.value[0].sample
        
    }
}


onMounted(()=>{
    loadDocFormats()

})
</script>