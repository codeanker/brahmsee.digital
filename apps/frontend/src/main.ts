import './assets/main.scss'

import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.scss'
import router from './router'

createApp(App).use(router).use(PrimeVue).use(VueQueryPlugin).mount('#app')

// Set Document Title relate to the Hostname
document.title = window.location.hostname
