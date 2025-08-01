// Configuração de ambiente para Canonika
// Centraliza todas as URLs dos serviços

const config = {
  // URLs dos microserviços
  services: {
    quarter: process.env.VUE_APP_QUARTER_URL || 'http://localhost',
    harbor: process.env.VUE_APP_HARBOR_URL || 'http://localhost:3701',
    guardian: process.env.VUE_APP_GUARDIAN_URL || 'http://localhost:3705',
    skipper: process.env.VUE_APP_SKIPPER_URL || 'http://localhost:3702',
    beacon: process.env.VUE_APP_BEACON_URL || 'http://localhost:3703',
    fisher: process.env.VUE_APP_FISHER_URL || 'http://localhost:3706',
    tollgate: process.env.VUE_APP_TOLLGATE_URL || 'http://localhost:3707',
    ledger: process.env.VUE_APP_LEDGER_URL || 'http://localhost:3708'
  },

  // URLs da infraestrutura
  infrastructure: {
    keycloak: process.env.VUE_APP_KEYCLOAK_URL || 'http://localhost:8080',
    postgres: process.env.VUE_APP_POSTGRES_URL || 'postgresql://canonika:canonika123@localhost:5432/canonika',
    redis: process.env.VUE_APP_REDIS_URL || 'redis://localhost:6379',
    opa: process.env.VUE_APP_OPA_URL || 'http://localhost:8181',
    clickhouse: process.env.VUE_APP_CLICKHOUSE_URL || 'http://localhost:8123'
  },

  // Configurações gerais
  general: {
    devMode: process.env.VUE_APP_DEV_MODE === 'true',
    apiTimeout: parseInt(process.env.VUE_APP_API_TIMEOUT) || 30000,
    retryAttempts: parseInt(process.env.VUE_APP_RETRY_ATTEMPTS) || 3
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