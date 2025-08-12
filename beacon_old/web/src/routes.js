// Rotas principais do Beacon
export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/websocket',
    name: 'WebSocket',
    component: () => import('./views/WebSocketView.vue')
  },
  {
    path: '/api',
    name: 'REST API',
    component: () => import('./views/ApiView.vue')
  },
  {
    path: '/push',
    name: 'Push Notifications',
    component: () => import('./views/PushView.vue')
  },
  {
    path: '/email',
    name: 'Email Service',
    component: () => import('./views/EmailView.vue')
  },
  {
    path: '/sms',
    name: 'SMS Gateway',
    component: () => import('./views/SmsView.vue')
  },
  {
    path: '/voice',
    name: 'Voice Service',
    component: () => import('./views/VoiceView.vue')
  },
  {
    path: '/configuracoes',
    name: 'Configuracoes',
    component: () => import('./views/ConfiguracoesView.vue')
  }
] 