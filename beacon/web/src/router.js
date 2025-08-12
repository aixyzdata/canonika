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
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: HomeView,
    meta: {
      title: 'Página não encontrada',
      subtitle: 'Redirecionando...'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Adicionar tratamento de erro global
router.onError((error) => {
  console.error('Erro de roteamento:', error)
  
  // Se o erro for relacionado a componente não encontrado
  if (error.message.includes('component') || error.message.includes('Cannot read properties of null')) {
    console.error('Componente não encontrado, redirecionando para home')
    router.push('/')
  }
})

// Adicionar guarda de navegação
router.beforeEach((to, from, next) => {
  console.log('Navegando para:', to.path)
  
  // Verificar se o componente existe
  if (to.matched.length === 0) {
    console.error('Rota não encontrada:', to.path)
    next('/')
    return
  }
  
  next()
})

export default router 