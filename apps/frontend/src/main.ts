import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './assets/main.scss'

createApp(App).use(router).mount('#app')

// Set Document Title relate to the Hostname
document.title = window.location.hostname
