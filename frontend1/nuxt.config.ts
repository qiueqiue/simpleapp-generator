export default defineNuxtConfig({
  // colorMode: {}  ,  
  runtimeConfig:{    
    public:{
      SIMPLEAPP_BACKEND_URL: process.env.SIMPLEAPP_BACKEND_URL,
      APP_URL: process.env.APP_URL,
    }
  },
  vite: {
    vue: {
        script: {
            defineModel: true,
            propsDestructure: true
        }
    }
},
tailwindcss: {
    // Options
  },
  modules: [
//    '@sidebase/nuxt-auth',
    "nuxt-security",
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    // '@nuxtjs/color-mode'

  ],  
  ssr: true,
  security: {
    csrf: true,
  },
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    'primeicons/primeicons.css'
  ],
  devtools: { enabled: true },
  build: {
                transpile: ["primevue"]
        },
  

})
