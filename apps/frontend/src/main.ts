import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './assets/main.scss'
import PrimeVue from 'primevue/config'

createApp(App).use(router).use(PrimeVue).mount('#app')

// Set Document Title relate to the Hostname
document.title = window.location.hostname
