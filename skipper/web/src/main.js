import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import SimulationView from './views/SimulationView.vue'
import SourcesView from './views/SourcesView.vue'
import DashboardView from './views/DashboardView.vue'
import './styles/global.css'

// Configuração das rotas
const routes = [
  {
    path: '/',
    redirect: '/simulation'
  },
  {
    path: '/simulation',
    name: 'Simulation',
    component: SimulationView
  },
  {
    path: '/sources',
    name: 'Sources',
    component: SourcesView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Criação da aplicação
const app = createApp(App)

// Configuração global
app.config.globalProperties.$apiBase = '/api'

// Uso do router
app.use(router)

// Montagem da aplicação
app.mount('#app') 