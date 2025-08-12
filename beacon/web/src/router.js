import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ApiView from './views/ApiView.vue'
import WebSocketView from './views/WebSocketView.vue'
import ConfiguracoesView from './views/ConfiguracoesView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Dashboard',
      subtitle: 'Visão Geral'
    }
  },
  {
    path: '/api',
    name: 'api',
    component: ApiView,
    meta: {
      title: 'REST API',
      subtitle: 'HTTP Endpoints'
    }
  },
  {
    path: '/websocket',
    name: 'websocket',
    component: WebSocketView,
    meta: {
      title: 'WebSocket',
      subtitle: 'Conexão Real-time'
    }
  },
  {
    path: '/configuracoes',
    name: 'configuracoes',
    component: ConfiguracoesView,
    meta: {
      title: 'Configurações',
      subtitle: 'Parâmetros'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 