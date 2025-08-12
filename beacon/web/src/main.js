import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './styles/main.scss'

const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('🚀 Beacon iniciado com sucesso!') 