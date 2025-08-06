// Rotas principais do Beacon
export default [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('./views/BeaconView.vue')
  },
  
  // Status - Interface de monitoramento
  {
    path: '/status',
    name: 'Status',
    component: () => import('./views/StatusView.vue')
  }
] 