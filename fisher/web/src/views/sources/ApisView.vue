<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão Skipper -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-plug"></i>
        <div class="title-content">
          <h1>APIs Externas</h1>
          <p>APIs de terceiros e serviços externos</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button @click="syncData" class="btn btn-primary btn-sm">
          <i class="fas fa-sync me-2"></i>
          Sincronizar Dados
        </button>
        <button @click="refreshData" class="btn btn-secondary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <!-- Status da Fonte -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-signal"></i>
            </div>
            <div class="card-title">
              <h4>Status da Fonte</h4>
              <span class="card-subtitle">Informações da conexão</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">{{ sourceStatus.status }}</span>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">{{ sourceStatus.status }}</div>
              <div class="balance-label">{{ sourceStatus.description }}</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Última Sincronização:</span>
                <span class="detail-value">{{ sourceStatus.lastSync }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">APIs Ativas:</span>
                <span class="detail-value">{{ sourceStatus.activeApis }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Sucesso:</span>
                <span class="detail-value">{{ sourceStatus.successRate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- APIs Conectadas -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-network-wired"></i>
            </div>
            <div class="card-title">
              <h4>APIs Conectadas</h4>
              <span class="card-subtitle">Serviços externos ativos</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">{{ apis.length }} APIs</span>
            </div>
          </div>
          <div class="card-content">
            <div class="apis-grid">
              <div v-for="api in apis" :key="api.id" class="api-item">
                <div class="api-icon">
                  <i :class="api.icon"></i>
                </div>
                <div class="api-details">
                  <div class="api-name">{{ api.name }}</div>
                  <div class="api-status" :class="api.status">
                    {{ api.statusText }}
                  </div>
                  <div class="api-metrics">
                    <span>{{ api.requests }} req/min</span>
                    <span>{{ api.responseTime }}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de Performance -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="card-title">
              <h4>Métricas de Performance</h4>
              <span class="card-subtitle">Indicadores de desempenho</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">{{ performanceMetrics.length }} Métricas</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div v-for="metric in performanceMetrics" :key="metric.id" class="metric-item">
                <div class="metric-icon">
                  <i :class="metric.icon"></i>
                </div>
                <div class="metric-details">
                  <div class="metric-value">{{ metric.value }}</div>
                  <div class="metric-label">{{ metric.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="card-title">
              <h4>Configurações</h4>
              <span class="card-subtitle">Parâmetros da API</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">{{ apiConfigs.length }} Configs</span>
            </div>
          </div>
          <div class="card-content">
            <div class="config-list">
              <div v-for="config in apiConfigs" :key="config.id" class="config-item">
                <div class="config-name">{{ config.name }}</div>
                <div class="config-value">{{ config.value }}</div>
                <div class="config-description">{{ config.description }}</div>
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
  name: 'FisherApisView',
  data() {
    return {
      sourceStatus: {
        status: 'ONLINE',
        description: 'Todas as APIs funcionando normalmente',
        lastSync: '2024-01-15 14:30:00',
        activeApis: '8',
        successRate: '98.5%'
      },
      apis: [
        {
          id: 1,
          name: 'Receita Federal',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-building',
          requests: '150',
          responseTime: '250'
        },
        {
          id: 2,
          name: 'Serasa',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-shield-alt',
          requests: '200',
          responseTime: '180'
        },
        {
          id: 3,
          name: 'SPC Brasil',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-credit-card',
          requests: '120',
          responseTime: '300'
        },
        {
          id: 4,
          name: 'Banco Central',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-university',
          requests: '80',
          responseTime: '400'
        },
        {
          id: 5,
          name: 'IBGE',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-chart-bar',
          requests: '50',
          responseTime: '500'
        },
        {
          id: 6,
          name: 'Anvisa',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-pills',
          requests: '90',
          responseTime: '350'
        },
        {
          id: 7,
          name: 'Inmetro',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-certificate',
          requests: '70',
          responseTime: '280'
        },
        {
          id: 8,
          name: 'Procon',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-balance-scale',
          requests: '60',
          responseTime: '320'
        }
      ],
      performanceMetrics: [
        {
          id: 1,
          name: 'Total de Requisições',
          value: '820',
          label: 'req/min',
          icon: 'fas fa-chart-line'
        },
        {
          id: 2,
          name: 'Tempo Médio de Resposta',
          value: '310',
          label: 'ms',
          icon: 'fas fa-clock'
        },
        {
          id: 3,
          name: 'Taxa de Sucesso',
          value: '98.5%',
          label: 'sucesso',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          name: 'APIs Ativas',
          value: '8/8',
          label: 'ativas',
          icon: 'fas fa-plug'
        }
      ],
      apiConfigs: [
        {
          id: 1,
          name: 'Rate Limit',
          value: '1000 req/min',
          description: 'Limite de requisições por minuto'
        },
        {
          id: 2,
          name: 'Timeout',
          value: '30s',
          description: 'Tempo limite de resposta'
        },
        {
          id: 3,
          name: 'Retry Policy',
          value: '3 tentativas',
          description: 'Política de retry'
        },
        {
          id: 4,
          name: 'Cache TTL',
          value: '3600s',
          description: 'Tempo de vida do cache'
        }
      ]
    }
  },
  methods: {
    syncData() {
      console.log('Sincronizando dados das APIs...')
      // Implementar lógica de sincronização
    },
    refreshData() {
      console.log('Atualizando dados das APIs...')
      // Implementar lógica de atualização
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do ApisView mantidos */
.balance-display {
  text-align: center;
  margin-bottom: 1rem;
}

.balance-value {
  font-size: 2rem;
  font-weight: bold;
  color: #10b981;
}

.balance-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.balance-details {
  display: grid;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.detail-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
  color: #1f2937;
}

.apis-grid {
  display: grid;
  gap: 0.75rem;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.api-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d1fae5;
  color: #10b981;
  flex-shrink: 0;
}

.api-details {
  flex: 1;
}

.api-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.api-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.api-status.online {
  background-color: #d1fae5;
  color: #10b981;
}

.api-status.offline {
  background-color: #fee2e2;
  color: #ef4444;
}

.api-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.metric-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d1fae5;
  color: #10b981;
  flex-shrink: 0;
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 0.25rem;
}

.metric-label {
  color: #6b7280;
  font-size: 0.75rem;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.config-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.config-value {
  color: #10b981;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.config-description {
  color: #6b7280;
  font-size: 0.875rem;
}
</style> 