import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './src/App.vue'
import FisherView from './src/views/FisherView.vue'
import StatusView from './src/views/StatusView.vue'

// Importar estilos compartilhados
import '../shared/styles/scss/main.scss'

// Configuração das rotas
const routes = [
  {
    path: '/',
    name: 'FisherView',
    component: FisherView
  },
  {
    path: '/status',
    name: 'StatusView',
    component: StatusView
  }
]

// Criação do router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Criação da aplicação
const app = createApp(App)

// Uso do router
app.use(router)

// Montagem da aplicação
app.mount('#app') 