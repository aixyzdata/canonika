<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão do Beacon -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-building"></i>
        <div class="title-content">
          <h1>SEFAZ</h1>
          <p>Receita Federal - Coleta de Dados</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Conectado</span>
      </div>
      <div class="view-actions">
        <button @click="startCollection" class="btn btn-primary btn-sm">
          <i class="fas fa-play me-2"></i>
          Iniciar Coleta
        </button>
        <button @click="configureConnection" class="btn btn-secondary btn-sm">
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
            Monitoramento da conexão com a Receita Federal.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-building"></i>
                </div>
                <div class="card-title">
                  <h4>Conexão SEFAZ</h4>
                  <span class="card-subtitle">api.sefaz.gov.br</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Conectado</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ sefazServices.status }}</span>
                    <span class="metric-label">Status</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ sefazServices.latency }}ms</span>
                    <span class="metric-label">Latência</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ sefazServices.uptime }}</span>
                    <span class="metric-label">Uptime</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ sefazServices.version }}</span>
                    <span class="metric-label">Versão API</span>
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
                    <span class="metric-value">{{ dataStats.totalRecords }}</span>
                    <span class="metric-label">Total Registros</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.lastUpdate }}</span>
                    <span class="metric-label">Última Atualização</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.successRate }}%</span>
                    <span class="metric-label">Taxa Sucesso</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.errors }}</span>
                    <span class="metric-label">Erros</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-cogs"></i>
                </div>
                <div class="card-title">
                  <h4>Configurações</h4>
                  <span class="card-subtitle">Parâmetros de coleta</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Configurado</span>
                </div>
              </div>
              <div class="card-content">
                <div class="config-list">
                  <div class="config-item">
                    <span class="config-label">Intervalo de Coleta:</span>
                    <span class="config-value">30 minutos</span>
                  </div>
                  <div class="config-item">
                    <span class="config-label">Timeout:</span>
                    <span class="config-value">60 segundos</span>
                  </div>
                  <div class="config-item">
                    <span class="config-label">Retry:</span>
                    <span class="config-value">3 tentativas</span>
                  </div>
                  <div class="config-item">
                    <span class="config-label">Cache:</span>
                    <span class="config-value">Ativado</span>
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
  name: 'SefazView',
  data() {
    return {
      sefazServices: {
        status: 'ONLINE',
        latency: 45,
        uptime: '99.8%',
        version: '2.1'
      },
      dataStats: {
        totalRecords: '2.5M',
        lastUpdate: '5 min atrás',
        successRate: 98.5,
        errors: 12
      }
    }
  },
  methods: {
    startCollection() {
      console.log('Iniciando coleta SEFAZ...')
      // Lógica para iniciar coleta
    },
    configureConnection() {
      console.log('Configurando conexão SEFAZ...')
      // Lógica para configurar conexão
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do SEFAZ seguindo padrão Beacon */
.config-list {
  margin-top: 1rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.config-label {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.config-value {
  font-size: 0.8rem;
  color: #e2e8f0;
  font-weight: 600;
}
</style>

