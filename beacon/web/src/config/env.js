// Configuração de ambiente para o Beacon
const config = {
  // URLs dos serviços
  services: {
    harbor: 'http://localhost:3701',
    quarter: 'http://localhost:3700',
    beacon: 'http://localhost:3703',
    skipper: 'http://localhost:3702',
    fisher: 'http://localhost:3706',
    diver: 'http://localhost:3704',
    guardian: 'http://localhost:3705',
    tollgate: 'http://localhost:3707',
    dock: 'http://localhost:3708',
    echo: 'http://localhost:3709',
    mapmaker: 'http://localhost:3710',
    seagull: 'http://localhost:3711',
    wayfinder: 'http://localhost:3712'
  },

  // Configurações da API
  api: {
    baseUrl: 'http://localhost:3703/api',
    timeout: 30000,
    retries: 3
  },

  // Configurações de autenticação
  auth: {
    tokenKey: 'canonika_access_token',
    refreshTokenKey: 'canonika_refresh_token',
    userKey: 'canonika_user',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 horas
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000 // 7 dias
  },

  // Configurações de WebSocket
  websocket: {
    url: 'ws://localhost:3703/ws',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  },

  // Configurações de notificações
  notifications: {
    position: 'top-right',
    duration: 5000,
    maxNotifications: 5
  },

  // Configurações de desenvolvimento
  development: {
    debug: true,
    hotReload: true,
    mockData: false
  },

  // Métodos utilitários
  getServiceUrl(serviceName) {
    return this.services[serviceName] || null
  },

  getApiUrl(endpoint = '') {
    return `${this.api.baseUrl}${endpoint}`
  },

  getWebSocketUrl() {
    return this.websocket.url
  },

  isDevelopment() {
    return process.env.NODE_ENV === 'development'
  },

  isProduction() {
    return process.env.NODE_ENV === 'production'
  }
}

export default config 