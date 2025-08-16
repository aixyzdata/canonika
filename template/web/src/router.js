import { createRouter, createWebHistory } from 'vue-router'
import AgGridReferenceView from './views/AgGridReferenceView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue'),
    meta: {
      title: 'Template Service',
      description: 'Serviço de validação da componentização'
    }
  },
  {
    path: '/aggrid-reference',
    name: 'AgGridReference',
    component: AgGridReferenceView,
    meta: {
      title: 'AG-Grid Reference',
      description: 'Template oficial AG-Grid seguindo documentação Vue'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navegação global guard
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Canonika Template`
  }
  next()
})

export default router