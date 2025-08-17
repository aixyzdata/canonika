import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './src/App.vue'
import FisherView from './src/views/FisherView.vue'
import StatusView from './src/views/StatusView.vue'
import GridTestView from './src/views/GridTestView.vue'
import SimpleTestView from './src/views/SimpleTestView.vue'

// Importar views de fontes de dados
import SefazView from './src/views/sources/SefazView.vue'
import MarketplacesView from './src/views/sources/MarketplacesView.vue'
import ApisView from './src/views/sources/ApisView.vue'
import DatabasesView from './src/views/sources/DatabasesView.vue'
import ScrapingView from './src/views/sources/ScrapingView.vue'
import FilesView from './src/views/sources/FilesView.vue'

// Importar estilos compartilhados
import '../../shared/styles/scss/main.scss'

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
  },
  {
    path: '/grid-test',
    name: 'GridTestView',
    component: GridTestView
  },
  {
    path: '/simple-test',
    name: 'SimpleTestView',
    component: SimpleTestView
  },
  // Rotas para fontes de dados
  {
    path: '/sources/sefaz',
    name: 'SefazView',
    component: SefazView
  },
  {
    path: '/sources/marketplaces',
    name: 'MarketplacesView',
    component: MarketplacesView
  },
  {
    path: '/sources/apis',
    name: 'ApisView',
    component: ApisView
  },
  {
    path: '/sources/databases',
    name: 'DatabasesView',
    component: DatabasesView
  },
  {
    path: '/sources/scraping',
    name: 'ScrapingView',
    component: ScrapingView
  },
  {
    path: '/sources/files',
    name: 'FilesView',
    component: FilesView
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