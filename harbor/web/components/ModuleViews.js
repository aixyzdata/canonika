// Importação dinâmica das views de todos os módulos
const moduleViews = {
  'skipper': () => import('../../../skipper/views/SkipperView.harbor.vue'),
  'quarter': () => import('../../../quarter/views/QuarterView.harbor.vue'),
  'tollgate': () => import('../../../tollgate/views/TollgateView.harbor.vue'),
  'beacon': () => import('../../../beacon/views/BeaconView.harbor.vue'),
  'dock': () => import('../../../dock/views/DockView.vue'),
  'echo': () => import('../../../echo/views/EchoView.vue'),
  'guardian': () => import('../../../guardian/views/GuardianView.vue'),
  'ledger': () => import('../../../ledger/views/LedgerView.vue'),
  'mapmaker': () => import('../../../mapmaker/views/MapmakerView.vue'),
  'seagull': () => import('../../../seagull/views/SeagullView.vue'),
  'wayfinder': () => import('../../../wayfinder/views/WayfinderView.vue')
};

export default moduleViews; 