// Configuração de ambiente para Canonika
// Centraliza todas as URLs dos serviços

const config = {
  // URLs dos microserviços
  services: {
    quarter: import.meta.env.VITE_QUARTER_URL || 'http://localhost:3700',
    harbor: import.meta.env.VITE_HARBOR_URL || 'http://localhost:3701',
    guardian: import.meta.env.VITE_GUARDIAN_URL || 'http://localhost:3705',
    skipper: import.meta.env.VITE_SKIPPER_URL || 'http://localhost:3702',
    beacon: import.meta.env.VITE_BEACON_URL || 'http://localhost:3703',
    fisher: import.meta.env.VITE_FISHER_URL || 'http://localhost:3706',
    tollgate: import.meta.env.VITE_TOLLGATE_URL || 'http://localhost:3707',
    ledger: import.meta.env.VITE_LEDGER_URL || 'http://localhost:3708'
  },

  // URLs da infraestrutura
  infrastructure: {
    keycloak: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
    postgres: import.meta.env.VITE_POSTGRES_URL || 'postgresql://canonika:canonika123@localhost:5432/canonika',
    redis: import.meta.env.VITE_REDIS_URL || 'redis://localhost:6379',
    opa: import.meta.env.VITE_OPA_URL || 'http://localhost:8181',
    clickhouse: import.meta.env.VITE_CLICKHOUSE_URL || 'http://localhost:8123'
  },

  // Configurações gerais
  general: {
    devMode: import.meta.env.VITE_DEV_MODE === 'true',
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    retryAttempts: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS) || 3
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