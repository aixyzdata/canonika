// Rotas principais do Beacon
export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/sinalizacao',
    name: 'Sinalizacao',
    component: () => import('./views/SinalizacaoView.vue')
  },
  {
    path: '/transmissao',
    name: 'Transmissao',
    component: () => import('./views/TransmissaoView.vue')
  },
  {
    path: '/configuracoes',
    name: 'Configuracoes',
    component: () => import('./views/ConfiguracoesView.vue')
  }
] 