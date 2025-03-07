import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { VueQueryPlugin } from '@tanstack/vue-query'

createApp(App).use(router).use(PrimeVue).use(VueQueryPlugin).mount('#app')

// Set Document Title relate to the Hostname
document.title = window.location.hostname
