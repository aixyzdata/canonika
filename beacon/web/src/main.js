import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import BeaconView from './views/BeaconView.vue'
import StatusView from './views/StatusView.vue'

// Configuração das rotas
const routes = [
  {
    path: '/',
    name: 'BeaconView',
    component: BeaconView
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