/**
 * Configuração de Ambiente para Fisher Service
 * Define as variáveis de ambiente e configurações do Fisher
 */

const config = {
  // Configurações da API
  api: {
    baseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:3706',
    timeout: 30000,
    retries: 3
  },
  
  // Configurações do WebSocket
  websocket: {
    url: process.env.VITE_WS_URL || 'ws://localhost:3706/ws',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  },
  
  // Configurações da aplicação
  app: {
    name: 'Fisher',
    version: '1.0.0',
    description: 'Tripulante de Pesca de Dados',
    port: process.env.VITE_PORT || 3706
  },
  
  // Configurações de autenticação
  auth: {
    tokenKey: 'canonika_token',
    refreshKey: 'canonika_refresh',
    authKey: 'canonika_authenticated',
    userKey: 'canonika_user'
  },
  
  // Configurações de serviços externos
  services: {
    harbor: 'http://localhost:3701',
    diver: 'http://localhost:3704',
    skipper: 'http://localhost:3702',
    beacon: 'http://localhost:3703',
    quarter: 'http://localhost:3700',
    guardian: 'http://localhost:3705'
  }
}

export default config 