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
    component: () => import('./views/Diver/DiverView.vue')
  },
  
  // Fisher - Pesca de dados
  {
    path: '/fisher',
    name: 'Fisher',
    component: () => import('./views/Fisher/FisherView.vue')
  },
  
  // Skipper
  {
    path: '/skipper',
    name: 'Skipper',
    component: () => import('./views/Skipper/Dashboard.vue')
  },
  {
    path: '/skipper/status',
    name: 'SkipperStatus',
    component: () => import('./views/Skipper/Dashboard.vue')
  },
  {
    path: '/skipper/simulacao',
    name: 'SkipperSimulacao',
    component: () => import('./views/Skipper/Simulacao.vue')
  },
  {
    path: '/skipper/fontes',
    name: 'SkipperFontes',
    component: () => import('./views/Skipper/Fontes.vue')
  },
  {
    path: '/skipper/analises',
    name: 'SkipperAnalises',
    component: () => import('./views/Skipper/Analises.vue')
  },
  {
    path: '/skipper/extracao',
    name: 'SkipperExtracao',
    component: () => import('./views/Skipper/Extracao.vue')
  },
  
  // Ledger
  {
    path: '/ledger',
    name: 'Ledger',
    component: () => import('./views/Ledger/Dashboard.vue')
  },
  {
    path: '/ledger/status',
    name: 'LedgerStatus',
    component: () => import('./views/Ledger/Dashboard.vue')
  },
  {
    path: '/ledger/lancamentos',
    name: 'LedgerLancamentos',
    component: () => import('./views/Ledger/Lancamentos.vue')
  },
  {
    path: '/ledger/relatorios',
    name: 'LedgerRelatorios',
    component: () => import('./views/Ledger/Relatorios.vue')
  },
  
  // Tollgate
  {
    path: '/tollgate',
    name: 'Tollgate',
    component: () => import('./views/Tollgate/Dashboard.vue')
  },
  {
    path: '/tollgate/status',
    name: 'TollgateStatus',
    component: () => import('./views/Tollgate/Dashboard.vue')
  },
  {
    path: '/tollgate/pedagios',
    name: 'TollgatePedagios',
    component: () => import('./views/Tollgate/Pedagios.vue')
  },
  {
    path: '/tollgate/auditoria',
    name: 'TollgateAuditoria',
    component: () => import('./views/Tollgate/Auditoria.vue')
  },
  
  // Quarter
  {
    path: '/quarter',
    name: 'Quarter',
    component: () => import('./views/Quarter/Dashboard.vue')
  },
  {
    path: '/quarter/status',
    name: 'QuarterStatus',
    component: () => import('./views/Quarter/Dashboard.vue')
  },
  
  // Beacon
  {
    path: '/beacon',
    name: 'Beacon',
    component: () => import('./views/Beacon/Dashboard.vue')
  },
  {
    path: '/beacon/status',
    name: 'BeaconStatus',
    component: () => import('./views/Beacon/Dashboard.vue')
  },
  
  // Echo
  {
    path: '/echo',
    name: 'Echo',
    component: () => import('./views/Echo/Dashboard.vue')
  },
  {
    path: '/echo/status',
    name: 'EchoStatus',
    component: () => import('./views/Echo/Dashboard.vue')
  },
  
  // Guardian
  {
    path: '/guardian',
    name: 'Guardian',
    component: () => import('./views/Guardian/Dashboard.vue')
  },
  {
    path: '/guardian/status',
    name: 'GuardianStatus',
    component: () => import('./views/Guardian/Dashboard.vue')
  },
  
  // Mapmaker
  {
    path: '/mapmaker',
    name: 'Mapmaker',
    component: () => import('./views/Mapmaker/Dashboard.vue')
  },
  {
    path: '/mapmaker/status',
    name: 'MapmakerStatus',
    component: () => import('./views/Mapmaker/Dashboard.vue')
  },
  
  // Seagull
  {
    path: '/seagull',
    name: 'Seagull',
    component: () => import('./views/Seagull/Dashboard.vue')
  },
  {
    path: '/seagull/status',
    name: 'SeagullStatus',
    component: () => import('./views/Seagull/Dashboard.vue')
  },
  
  // Wayfinder
  {
    path: '/wayfinder',
    name: 'Wayfinder',
    component: () => import('./views/Wayfinder/Dashboard.vue')
  },
  {
    path: '/wayfinder/status',
    name: 'WayfinderStatus',
    component: () => import('./views/Wayfinder/Dashboard.vue')
  }
] 