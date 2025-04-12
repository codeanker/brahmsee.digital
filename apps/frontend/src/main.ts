import './assets/main.scss'

import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

createApp(App).use(router).use(PrimeVue).use(VueQueryPlugin).mount('#app')

// Set Document Title relate to the Hostname
document.title = window.location.hostname
