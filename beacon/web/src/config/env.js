// Configuração de ambiente para Beacon
// Versão simplificada para o browser

const config = {
  // URLs dos microserviços
  services: {
    quarter: 'http://localhost:3700',
    harbor: 'http://localhost:3701',
    guardian: 'http://localhost:3705',
    skipper: 'http://localhost:3702',
    beacon: 'http://localhost:3704',
    fisher: 'http://localhost:3706',
    tollgate: 'http://localhost:3707',
    ledger: 'http://localhost:3708'
  },

  // URLs da infraestrutura
  infrastructure: {
    keycloak: 'http://localhost:8080',
    postgres: 'postgresql://canonika:canonika123@localhost:5432/canonika',
    redis: 'redis://localhost:6379',
    opa: 'http://localhost:8181',
    clickhouse: 'http://localhost:8123'
  },

  // Configurações gerais
  general: {
    devMode: true,
    apiTimeout: 30000,
    retryAttempts: 3
  },

  // Métodos utilitários
  utils: {
    // Obter URL de um serviço
    getServiceUrl(serviceName) {
      return this.services[serviceName] || null
    },

    // Obter URL de infraestrutura
    getInfraUrl(infraName) {
      return this.infrastructure[infraName] || null
    },

    // Verificar se está em modo de desenvolvimento
    isDevMode() {
      return this.general.devMode
    },

    // Construir URL de API
    buildApiUrl(serviceName, endpoint) {
      const baseUrl = this.getServiceUrl(serviceName)
      if (!baseUrl) return null
      return `${baseUrl}/api${endpoint}`
    },

    // Construir URL de health check
    buildHealthUrl(serviceName) {
      return this.buildApiUrl(serviceName, '/health')
    }
  }
}

// Adicionar métodos utilitários ao objeto principal
Object.assign(config, config.utils)

export default config 