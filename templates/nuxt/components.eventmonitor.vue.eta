<template>
    <Toast group="default"/>
    <Toast group="list">
        <template #message="p">
            <ol>
                <li v-for="(item,index) in  p.message.detail" :key="index">{{item.instancePath}} {{ item.message }}</li>
            </ol>            
        </template>
    </Toast>
</template>
<script setup lang="ts">

import { useToast, } from 'primevue/usetoast';
import type {  ToastMessageOptions } from 'primevue/toast';
import Toast from 'primevue/toast';
import { stringify } from 'ajv';
const toast = useToast();
const { $event,$listen } = useNuxtApp()
let resmsg:ToastMessageOptions = {} as ToastMessageOptions

$listen('*',(type:string,data:any)=>{
    
    
    let duration = 3000
    let severity:typeof resmsg['severity'] 
    let isshow=true
    let toastgroup='default'
    if(type.indexOf('error')>=0){
        duration = 0
        severity='error'
        
    }
    else if(type.indexOf('warn')>=0){
        duration = 10000
        severity='warn'
    }
    else if(type.indexOf('info')>=0){
        duration = 3000
        severity='info'
        isshow=false
    }
    else if(type.indexOf('success')>=0){
        duration = 3000
        severity='success'
    }
    if(Array.isArray(data)){
        toastgroup='list'
    }
    // let msg:string=prepareMsg(data,severity?.toString()??'')

    if(isshow){
        toast.removeAllGroups()
        resmsg = { severity: severity, summary: type, detail :data, life: duration, group:toastgroup}
        toast.add(resmsg)
    }
    
    
})
const prepareMsg=(data:any,msgtype:string):string=>{
    let res : string =''
    
    if(typeof data == 'string'){
        res = data
    }else if(Array.isArray(data)){
        res+='<ul>'
        for(let i=0;i<data.length;i++){
            const d=data[i]
            res+= '<li>'+d['instancePath']+':'+(d['message']?? JSON.stringify(d))+'</li>'
        }
        res+='</ul>'
    }else if(typeof data =='object'){
        res=JSON.stringify(data)
    }
    return res

    
}

</script>