// Rotas principais e submenus dos serviços
export default [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Teste de Navegação
  {
    path: '/test',
    name: 'Test',
    component: () => import('./views/TestView.vue')
  },
  
  // Explorer - Interface de pesquisa
  {
    path: '/explorer',
    name: 'Explorer',
    component: () => import('./views/ExplorerView.vue')
  },
  
  // Diver - Placeholder (não existe ainda)
  {
    path: '/diver',
    name: 'Diver',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/diver/status',
    name: 'DiverStatus',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Fisher - Views centralizadas no Harbor
  {
    path: '/fisher',
    name: 'Fisher',
    component: () => import('./views/Fisher/FisherView.vue')
  },
  {
    path: '/fisher/status',
    name: 'FisherStatus',
    component: () => import('./views/Fisher/StatusView.vue')
  },
  {
    path: '/fisher/sefaz',
    name: 'FisherSefaz',
    component: () => import('./views/Fisher/sources/SefazView.vue')
  },
  {
    path: '/fisher/marketplaces',
    name: 'FisherMarketplaces',
    component: () => import('./views/Fisher/sources/MarketplacesView.vue')
  },
  {
    path: '/fisher/apis',
    name: 'FisherApis',
    component: () => import('./views/Fisher/sources/ApisView.vue')
  },
  {
    path: '/fisher/databases',
    name: 'FisherDatabases',
    component: () => import('./views/Fisher/sources/DatabasesView.vue')
  },
  {
    path: '/fisher/scraping',
    name: 'FisherScraping',
    component: () => import('./views/Fisher/sources/ScrapingView.vue')
  },
  {
    path: '/fisher/files',
    name: 'FisherFiles',
    component: () => import('./views/Fisher/sources/FilesView.vue')
  },
  
  // Skipper - Views reais do microserviço
  {
    path: '/skipper',
    name: 'Skipper',
    component: () => import('skipper/views/DashboardView.vue')
  },
  {
    path: '/skipper/status',
    name: 'SkipperStatus',
    component: () => import('skipper/views/DashboardView.vue')
  },
  {
    path: '/skipper/simulacao',
    name: 'SkipperSimulacao',
    component: () => import('skipper/views/Simulacao.vue')
  },
  {
    path: '/skipper/fontes',
    name: 'SkipperFontes',
    component: () => import('skipper/views/Fontes.vue')
  },
  {
    path: '/skipper/analises',
    name: 'SkipperAnalises',
    component: () => import('skipper/views/Analises.vue')
  },
  {
    path: '/skipper/extracao',
    name: 'SkipperExtracao',
    component: () => import('skipper/views/Extracao.vue')
  },
  
  // Ledger - Placeholder (não existe ainda)
  {
    path: '/ledger',
    name: 'Ledger',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/ledger/status',
    name: 'LedgerStatus',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/ledger/lancamentos',
    name: 'LedgerLancamentos',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/ledger/relatorios',
    name: 'LedgerRelatorios',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Tollgate - Placeholder (não existe ainda)
  {
    path: '/tollgate',
    name: 'Tollgate',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/tollgate/status',
    name: 'TollgateStatus',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/tollgate/pedagios',
    name: 'TollgatePedagios',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/tollgate/auditoria',
    name: 'TollgateAuditoria',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Quarter - Placeholder (não existe ainda)
  {
    path: '/quarter',
    name: 'Quarter',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/quarter/status',
    name: 'QuarterStatus',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Dock - Placeholder (não existe ainda)
  {
    path: '/dock',
    name: 'Dock',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/dock/status',
    name: 'DockStatus',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Beacon - Placeholder (não existe ainda)
  {
    path: '/beacon',
    name: 'Beacon',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/beacon/status',
    name: 'BeaconStatus',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Echo - Placeholder (não existe ainda)
  {
    path: '/echo',
    name: 'Echo',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/echo/status',
    name: 'EchoStatus',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Guardian - Placeholder (não existe ainda)
  {
    path: '/guardian',
    name: 'Guardian',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/guardian/status',
    name: 'GuardianStatus',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Mapmaker - Placeholder (não existe ainda)
  {
    path: '/mapmaker',
    name: 'Mapmaker',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/mapmaker/status',
    name: 'MapmakerStatus',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Seagull - Placeholder (não existe ainda)
  {
    path: '/seagull',
    name: 'Seagull',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/seagull/status',
    name: 'SeagullStatus',
    component: () => import('./views/DashboardView.vue')
  },
  
  // Wayfinder - Placeholder (não existe ainda)
  {
    path: '/wayfinder',
    name: 'Wayfinder',
    component: () => import('./views/DashboardView.vue')
  },
  {
    path: '/wayfinder/status',
    name: 'WayfinderStatus',
    component: () => import('./views/DashboardView.vue')
  }
] 