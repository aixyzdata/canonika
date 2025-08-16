import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

// Import SCSS
import './styles/main.scss'

const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('🚀 template iniciado com sucesso!')
