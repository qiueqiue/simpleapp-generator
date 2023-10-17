<script setup lang="ts">
import type {SimpleAppFieldSetting} from './type';
import SimpleAppAutocomplete from './SimpleAppAutocomplete.vue';
import SimpleAppText from './SimpleAppText.vue';
import SimpleAppSelect from './SimpleAppSelect.vue';
import type {JSONSchema7} from 'json-schema'
import {watch} from 'vue'
import SimpleAppTextarea from './SimpleAppTextarea.vue';
import SimpleAppCheckbox from './SimpleAppCheckbox.vue';

const props = defineProps<{setting:SimpleAppFieldSetting, getAutocomplete:Function, hidelabel?:boolean}>()
interface customSchema extends JSONSchema7  {
    'x-foreignkey'?:string
}

// by right use 'customSchema', but been force to use any for avoid some error
const f:any = props.setting.fieldsetting
const modelValue = defineModel()
</script>
<template>    
    <SimpleAppAutocomplete v-if="f['x-foreignkey']" v-model="modelValue" :setting="props.setting" :hidelabel="hidelabel" :remote-src="getAutocomplete(typeof f['x-foreignkey']=='string' ? f['x-foreignkey'] : f['x-foreignkey']['target'])" optionLabel="label"/>
    <SimpleAppCheckbox v-else-if="f.type=='boolean'" v-model="modelValue" :setting="props.setting"  :hidelabel="hidelabel"/>
    <SimpleAppNumber v-else-if="f.type=='number' || f.type=='integer'" v-model="modelValue" :setting="props.setting"  :hidelabel="hidelabel"></SimpleAppNumber>
    <SimpleAppSelect v-else-if="f.enum" v-model="modelValue" :setting="props.setting"  :hidelabel="hidelabel"></SimpleAppSelect>
    <SimpleAppChip v-else-if="f.type=='array' && f.items && f.items.type=='string'" v-model="modelValue" :setting="props.setting"  :hidelabel="hidelabel"></SimpleAppChip>
    <SimpleAppTextarea v-else-if="f.type=='string' && f.format=='text'" v-model="modelValue" :setting="props.setting"  :hidelabel="hidelabel"></SimpleAppTextarea>
    <SimpleAppText v-else-if="f.type=='string' && f.format" :type="f.format" v-model="modelValue" :setting="props.setting"  :hidelabel="hidelabel"></SimpleAppText>
    <SimpleAppText v-else v-model="modelValue" :setting="props.setting"  :hidelabel="hidelabel"></SimpleAppText>
</template>