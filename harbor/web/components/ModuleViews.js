// Importação dinâmica das views de todos os módulos
const moduleViews = {
  'skipper': () => import('../../../skipper/views/SkipperView.harbor.vue'),
  'quarter': () => import('../../../quarter/views/QuarterView.harbor.vue'),
  'tollgate': () => import('../../../tollgate/views/TollgateView.harbor.vue'),

  'dock': () => import('../../../dock/views/DockView.vue'),

  'ledger': () => import('../../../ledger/views/LedgerView.vue')
};

export default moduleViews; 