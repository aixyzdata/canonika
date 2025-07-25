import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import SimulationView from './views/SimulationView.vue'
import SourcesView from './views/SourcesView.vue'

// Importar estilos do AG Grid
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

// Configuração das rotas
const routes = [
  { path: '/', redirect: '/simulation' },
  { path: '/simulation', component: SimulationView },
  { path: '/sources', component: SourcesView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app') 