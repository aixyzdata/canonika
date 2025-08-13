<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão do Beacon -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-plug"></i>
        <div class="title-content">
          <h1>APIs Externas</h1>
          <p>Integração com serviços terceiros</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Conectado</span>
      </div>
      <div class="view-actions">
        <button @click="testConnections" class="btn btn-primary btn-sm">
          <i class="fas fa-play me-2"></i>
          Testar Conexões
        </button>
        <button @click="configureApis" class="btn btn-secondary btn-sm">
          <i class="fas fa-cog me-2"></i>
          Configurar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status da Conexão -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-plug text-success me-2"></i>
            Status da Conexão
          </h3>
          <p class="section-description">
            Monitoramento das APIs externas conectadas.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-plug"></i>
                </div>
                <div class="card-title">
                  <h4>Conexão APIs</h4>
                  <span class="card-subtitle">8 APIs conectadas</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Conectado</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.activeApis }}</span>
                    <span class="metric-label">APIs Ativas</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.successRate }}%</span>
                    <span class="metric-label">Taxa Sucesso</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.avgResponse }}ms</span>
                    <span class="metric-label">Tempo Médio</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.lastTest }}</span>
                    <span class="metric-label">Último Teste</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <div class="card-title">
                  <h4>Estatísticas</h4>
                  <span class="card-subtitle">Dados coletados</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.totalRequests }}</span>
                    <span class="metric-label">Total Requisições</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.successfulRequests }}</span>
                    <span class="metric-label">Requisições OK</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.failedRequests }}</span>
                    <span class="metric-label">Falhas</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.dataVolume }}</span>
                    <span class="metric-label">Volume de Dados</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-code"></i>
                </div>
                <div class="card-title">
                  <h4>APIs Conectadas</h4>
                  <span class="card-subtitle">Serviços ativos</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">{{ apis.length }} Ativas</span>
                </div>
              </div>
              <div class="card-content">
                <div class="apis-list">
                  <div 
                    v-for="api in apis" 
                    :key="api.id" 
                    class="api-item"
                  >
                    <div class="api-icon">
                      <i :class="api.icon"></i>
                    </div>
                    <div class="api-content">
                      <div class="api-name">{{ api.name }}</div>
                      <div class="api-status">{{ api.status }}</div>
                    </div>
                    <div class="api-metrics">
                      <span>{{ api.responseTime }}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApisView',
  data() {
    return {
      connectionStatus: {
        activeApis: 8,
        successRate: 94.2,
        avgResponse: 245,
        lastTest: '2 min atrás'
      },
      dataStats: {
        totalRequests: '125.8K',
        successfulRequests: '118.5K',
        failedRequests: '7.3K',
        dataVolume: '2.8GB'
      },
      apis: [
        {
          id: 1,
          name: 'Google Maps API',
          status: 'Online',
          icon: 'fas fa-map-marker-alt',
          responseTime: 180
        },
        {
          id: 2,
          name: 'Stripe Payment',
          status: 'Online',
          icon: 'fas fa-credit-card',
          responseTime: 95
        },
        {
          id: 3,
          name: 'SendGrid Email',
          status: 'Online',
          icon: 'fas fa-envelope',
          responseTime: 320
        },
        {
          id: 4,
          name: 'AWS S3',
          status: 'Online',
          icon: 'fas fa-cloud',
          responseTime: 150
        },
        {
          id: 5,
          name: 'Twilio SMS',
          status: 'Online',
          icon: 'fas fa-sms',
          responseTime: 280
        },
        {
          id: 6,
          name: 'Slack Webhook',
          status: 'Online',
          icon: 'fab fa-slack',
          responseTime: 200
        },
        {
          id: 7,
          name: 'GitHub API',
          status: 'Online',
          icon: 'fab fa-github',
          responseTime: 165
        },
        {
          id: 8,
          name: 'Weather API',
          status: 'Online',
          icon: 'fas fa-cloud-sun',
          responseTime: 420
        }
      ]
    }
  },
  methods: {
    testConnections() {
      console.log('Testando conexões das APIs...')
      // Lógica para testar conexões
    },
    configureApis() {
      console.log('Configurando APIs...')
      // Lógica para configurar APIs
    }
  }
}
</script>

<style scoped>
/* Estilos específicos das APIs seguindo padrão Beacon */
.apis-list {
  margin-top: 1rem;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.api-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.api-icon {
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.api-content {
  flex: 1;
}

.api-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.api-status {
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 500;
}

.api-metrics {
  font-size: 0.7rem;
  color: #94a3b8;
}
</style>

