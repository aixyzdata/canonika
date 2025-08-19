import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

// Import SCSS
import './styles/main.scss'

// Import AG-Grid theme styles only (Theming API)
import 'ag-grid-community/styles/ag-theme-quartz.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('🚀 template iniciado com sucesso!')
