// Rotas principais e submenus dos serviços
export default [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Diver - Primeiro item do menu
  {
    path: '/diver',
    name: 'Diver',
    component: () => import('../../diver/web/src/views/DiverView.vue')
  },
  
  // Fisher - Pesca de dados
  {
    path: '/fisher',
    name: 'Fisher',
    component: () => import('../../fisher/web/src/views/FisherView.vue')
  },
  
  // Skipper
  {
    path: '/skipper',
    name: 'Skipper',
    component: () => import('../../skipper/web/src/views/Dashboard.vue')
  },
  {
    path: '/skipper/status',
    name: 'SkipperStatus',
    component: () => import('../../skipper/web/src/views/Dashboard.vue')
  },
  {
    path: '/skipper/simulacao',
    name: 'SkipperSimulacao',
    component: () => import('../../skipper/web/src/views/Simulacao.vue')
  },
  {
    path: '/skipper/fontes',
    name: 'SkipperFontes',
    component: () => import('../../skipper/web/src/views/Fontes.vue')
  },
  {
    path: '/skipper/analises',
    name: 'SkipperAnalises',
    component: () => import('../../skipper/web/src/views/Analises.vue')
  },
  {
    path: '/skipper/extracao',
    name: 'SkipperExtracao',
    component: () => import('../../skipper/web/src/views/Extracao.vue')
  },
  
  // Ledger
  {
    path: '/ledger',
    name: 'Ledger',
    component: () => import('../../ledger/web/src/views/Dashboard.vue')
  },
  {
    path: '/ledger/status',
    name: 'LedgerStatus',
    component: () => import('../../ledger/web/src/views/Dashboard.vue')
  },
  {
    path: '/ledger/lancamentos',
    name: 'LedgerLancamentos',
    component: () => import('../../ledger/web/src/views/Lancamentos.vue')
  },
  {
    path: '/ledger/relatorios',
    name: 'LedgerRelatorios',
    component: () => import('../../ledger/web/src/views/Relatorios.vue')
  },
  
  // Tollgate
  {
    path: '/tollgate',
    name: 'Tollgate',
    component: () => import('../../tollgate/web/src/views/Dashboard.vue')
  },
  {
    path: '/tollgate/status',
    name: 'TollgateStatus',
    component: () => import('../../tollgate/web/src/views/Dashboard.vue')
  },
  {
    path: '/tollgate/pedagios',
    name: 'TollgatePedagios',
    component: () => import('../../tollgate/web/src/views/Pedagios.vue')
  },
  {
    path: '/tollgate/auditoria',
    name: 'TollgateAuditoria',
    component: () => import('../../tollgate/web/src/views/Auditoria.vue')
  },
  
  // Quarter
  {
    path: '/quarter',
    name: 'Quarter',
    component: () => import('../../quarter/web/src/views/Dashboard.vue')
  },
  {
    path: '/quarter/status',
    name: 'QuarterStatus',
    component: () => import('../../quarter/web/src/views/Dashboard.vue')
  }
] 