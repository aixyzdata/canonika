// =============================================================================
// CANONIKA PLATFORM CONFIGURATION
// =============================================================================

module.exports = {
  // Platform Information
  platform: {
    name: 'Canonika',
    version: '1.0.0',
    description: 'Plataforma de Microserviços Moderna',
    author: 'Canonika Team',
    repository: 'https://github.com/aixyzdata/canonika'
  },

  // Services Configuration
  services: {
    quarter: {
      port: 3700,
      name: 'Quarter',
      description: 'Ponto de entrada centralizado',
      url: 'http://localhost:3700'
    },
    template: {
      port: 3790,
      name: 'Template',
      description: 'Layout oficial da plataforma',
      url: 'http://localhost:3790'
    },
    harbor: {
      port: 3701,
      name: 'Harbor',
      description: 'Dashboard principal',
      url: 'http://localhost:3701'
    },
    guardian: {
      port: 3705,
      name: 'Guardian',
      description: 'Sistema de segurança',
      url: 'http://localhost:3705'
    },
    beacon: {
      port: 3703,
      name: 'Beacon',
      description: 'Sistema de monitoramento',
      url: 'http://localhost:3703'
    }
  },

  // Infrastructure Services
  infrastructure: {
    keycloak: {
      port: 8080,
      name: 'Keycloak',
      description: 'Identity Provider'
    },
    postgresql: {
      port: 5432,
      name: 'PostgreSQL',
      description: 'Banco de dados principal'
    },
    redis: {
      port: 6379,
      name: 'Redis',
      description: 'Cache e sessões'
    },
    opa: {
      port: 8181,
      name: 'OPA',
      description: 'Políticas de segurança'
    },
    clickhouse: {
      port: 8123,
      name: 'ClickHouse',
      description: 'Analytics e logs'
    }
  },

  // Authentication
  auth: {
    defaultCredentials: {
      email: 'admin@canonika.io',
      password: 'admin123'
    },
    jwt: {
      secret: 'canonika-secret-key',
      expiresIn: '24h'
    }
  },

  // Design System
  designSystem: {
    colors: {
      primary: '#3b82f6',
      secondary: '#00bfa6',
      accent: '#10b981',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    breakpoints: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1400px'
    }
  },

  // Development
  development: {
    hotReload: true,
    sourceMaps: true,
    debug: false,
    logLevel: 'info'
  },

  // Build Configuration
  build: {
    outputDir: 'dist',
    assetsDir: 'assets',
    publicPath: '/',
    minify: true,
    sourceMap: false
  },

  // Testing
  testing: {
    framework: 'vitest',
    coverage: {
      enabled: true,
      threshold: 80
    },
    e2e: {
      framework: 'cypress',
      baseUrl: 'http://localhost:3700'
    }
  },

  // Documentation
  documentation: {
    outputDir: 'docs',
    structure: {
      architecture: 'docs/architecture',
      development: 'docs/development',
      guides: 'docs/guides',
      api: 'docs/api',
      deployment: 'docs/deployment'
    }
  }
}; 