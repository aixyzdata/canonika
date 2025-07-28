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
  {
    path: '/diver/status',
    name: 'DiverStatus',
    component: () => import('../../diver/web/src/views/StatusView.vue')
  },
  
  // Fisher - Pesca de dados
  {
    path: '/fisher',
    name: 'Fisher',
    component: () => import('../../fisher/web/src/views/FisherView.vue')
  },
  {
    path: '/fisher/status',
    name: 'FisherStatus',
    component: () => import('../../fisher/web/src/views/StatusView.vue')
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
    component: () => import('../../quarter/web/src/views/StatusView.vue')
  },
  
  // Dock
  {
    path: '/dock',
    name: 'Dock',
    component: () => import('../../dock/views/DockView.vue')
  },
  {
    path: '/dock/status',
    name: 'DockStatus',
    component: () => import('../../dock/views/StatusView.vue')
  },
  
  // Beacon
  {
    path: '/beacon',
    name: 'Beacon',
    component: () => import('../../beacon/views/BeaconView.vue')
  },
  {
    path: '/beacon/status',
    name: 'BeaconStatus',
    component: () => import('../../beacon/views/StatusView.vue')
  },
  
  // Echo
  {
    path: '/echo',
    name: 'Echo',
    component: () => import('../../echo/views/EchoView.vue')
  },
  {
    path: '/echo/status',
    name: 'EchoStatus',
    component: () => import('../../echo/views/StatusView.vue')
  },
  
  // Guardian
  {
    path: '/guardian',
    name: 'Guardian',
    component: () => import('../../guardian/views/GuardianView.vue')
  },
  {
    path: '/guardian/status',
    name: 'GuardianStatus',
    component: () => import('../../guardian/views/StatusView.vue')
  },
  
  // Mapmaker
  {
    path: '/mapmaker',
    name: 'Mapmaker',
    component: () => import('../../mapmaker/views/MapmakerView.vue')
  },
  {
    path: '/mapmaker/status',
    name: 'MapmakerStatus',
    component: () => import('../../mapmaker/views/StatusView.vue')
  },
  
  // Seagull
  {
    path: '/seagull',
    name: 'Seagull',
    component: () => import('../../seagull/views/SeagullView.vue')
  },
  {
    path: '/seagull/status',
    name: 'SeagullStatus',
    component: () => import('../../seagull/views/StatusView.vue')
  },
  
  // Wayfinder
  {
    path: '/wayfinder',
    name: 'Wayfinder',
    component: () => import('../../wayfinder/views/WayfinderView.vue')
  },
  {
    path: '/wayfinder/status',
    name: 'WayfinderStatus',
    component: () => import('../../wayfinder/views/StatusView.vue')
  }
] 