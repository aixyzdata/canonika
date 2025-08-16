<template>
  <div class="canonika-view">
    <!-- View Header (padrão template) -->
    <div class="view-header-card">
      <div class="header-content">
        <div class="header-left">
          <div class="service-icon">
            <i class="fas fa-plug"></i>
          </div>
          <div class="service-info">
            <h2>APIS EXTERNAS - Sistema de Integração</h2>
            <p>Gerenciamento e monitoramento de APIs de terceiros</p>
          </div>
        </div>
        <div class="header-center">
          <div class="status-indicator-large">
            <div class="status-dot online"></div>
            <span>Sistema Operacional</span>
          </div>
        </div>
        <div class="header-right">
          <button @click="testConnections" class="btn btn-primary">
            <i class="fas fa-play me-2"></i>
            Testar Conexões
          </button>
          <button @click="configureApis" class="btn btn-secondary">
            <i class="fas fa-cog me-2"></i>
            Configurar
          </button>
        </div>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Monitoramento de APIs -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-chart-line section-icon text-success"></i>
            MONITORAMENTO DE APIS
          </h3>
          <p class="section-description">
            Status em tempo real das conexões e performance das APIs externas.
          </p>
        </div>
        <div class="section-content">
          <div class="service-cards-grid">
            <div class="service-card-large">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-plug"></i>
                </div>
                <div class="card-info">
                  <h4>STATUS DAS CONEXÕES</h4>
                  <p class="card-subtitle">Monitoramento em tempo real</p>
                </div>
                <div class="card-status">
                  <span class="status-badge functioning">Funcionando</span>
                </div>
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.activeApis }}</span>
                  <span class="metric-label">APIs Ativas</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.successRate }}%</span>
                  <span class="metric-label">Taxa Sucesso</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.avgResponse }}ms</span>
                  <span class="metric-label">Tempo Médio</span>
                </div>
              </div>
            </div>

            <div class="service-card-large">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <div class="card-info">
                  <h4>ESTATÍSTICAS DE USO</h4>
                  <p class="card-subtitle">Volume de requisições</p>
                </div>
                <div class="card-status">
                  <span class="status-badge functioning">Ativo</span>
                </div>
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.totalRequests }}</span>
                  <span class="metric-label">Total Requisições</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.successfulRequests }}</span>
                  <span class="metric-label">Sucessos</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.dataVolume }}</span>
                  <span class="metric-label">Volume</span>
                </div>
              </div>
            </div>
          </div>

          <h3 class="section-title mt-4">
            <i class="fas fa-list-alt section-icon text-primary"></i>
            LISTA DE APIS CONECTADAS
          </h3>
          <p class="section-description">
            Detalhes e performance de cada API integrada.
          </p>
          <div class="feature-cards-grid">
            <div 
              v-for="api in apis" 
              :key="api.id" 
              class="feature-card"
            >
              <div class="feature-icon">
                <i :class="api.icon"></i>
              </div>
              <div class="feature-title">{{ api.name }}</div>
              <div class="feature-description">{{ api.status }} - {{ api.responseTime }}ms</div>
              <div class="feature-actions">
                <button class="btn btn-sm btn-outline-primary">
                  <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary">
                  <i class="fas fa-cog"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="canonika-footer">
        <div class="footer-content">
          <div class="footer-info">
            <h3>APIs Externas - Fisher Service</h3>
            <p>Sistema de integração e monitoramento de APIs de terceiros</p>
          </div>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-value">{{ apis.length }}</span>
              <span class="stat-label">APIs</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ connectionStatus.successRate }}%</span>
              <span class="stat-label">Sucesso</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ dataStats.totalRequests }}</span>
              <span class="stat-label">Requisições</span>
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



