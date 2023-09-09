<template>
    <header>      
        <!-- <MegaMenu :model="getMenus()" orientation="horizontal" />               -->
        <Menubar :model="getMenus()">
            <template #start>
                <h1>[Logo Container]</h1>
            </template>
            <template #end>
                <InputText placeholder="Search" type="text" />
            </template>
        </Menubar>
    </header>
</template>
<script setup lang="ts">
    // import MegaMenu from 'primevue/megamenu';
    import Menubar from 'primevue/menubar';

</script>