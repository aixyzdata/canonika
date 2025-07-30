<template>
  <CanonikaViewTemplate
    title="APIs Externas"
    description="APIs de terceiros e serviços externos"
    header-icon="fas fa-plug"
    status-text="ONLINE"
    :primary-action="{
      text: 'Sincronizar Dados',
      icon: 'fas fa-sync',
      handler: syncData
    }"
    @refresh="refreshData"
  >
    <div class="service-cards">
      <!-- Status da Fonte -->
      <div class="service-card">
        <div class="card-header">
          <h3>Status da Fonte</h3>
          <div class="card-icon">
            <i class="fas fa-signal"></i>
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
          <h3>APIs Conectadas</h3>
          <div class="card-icon">
            <i class="fas fa-network-wired"></i>
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
          <h3>Métricas de Performance</h3>
          <div class="card-icon">
            <i class="fas fa-tachometer-alt"></i>
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
          <h3>Configurações</h3>
          <div class="card-icon">
            <i class="fas fa-cog"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="config-list">
            <div v-for="config in configurations" :key="config.id" class="config-item">
              <div class="config-label">{{ config.name }}</div>
              <div class="config-value">{{ config.value }}</div>
              <div class="config-status" :class="config.status">
                {{ config.statusText }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs Recentes -->
      <div class="service-card">
        <div class="card-header">
          <h3>Logs Recentes</h3>
          <div class="card-icon">
            <i class="fas fa-list-alt"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="logs-list">
            <div v-for="log in recentLogs" :key="log.id" :class="`log-item ${log.level}`">
              <div class="log-icon">
                <i :class="log.icon"></i>
              </div>
              <div class="log-content">
                <div class="log-title">{{ log.title }}</div>
                <div class="log-message">{{ log.message }}</div>
                <div class="log-time">{{ log.timestamp }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CanonikaViewTemplate>
</template>

<script>
import CanonikaViewTemplate from 'shared/templates/CanonikaViewTemplate.vue'

export default {
  name: 'ApisView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      sourceStatus: {
        status: 'ONLINE',
        description: 'Conexão ativa com APIs externas',
        lastSync: '2024-01-15 14:30:00',
        activeApis: '8/10',
        successRate: '97.2%'
      },
      apis: [
        {
          id: 1,
          name: 'Open Food Facts',
          status: 'online',
          statusText: 'ATIVO',
          requests: '150',
          responseTime: '45',
          icon: 'fas fa-utensils'
        },
        {
          id: 2,
          name: 'Google Shopping',
          status: 'online',
          statusText: 'ATIVO',
          requests: '200',
          responseTime: '120',
          icon: 'fas fa-shopping-bag'
        },
        {
          id: 3,
          name: 'Bing Shopping',
          status: 'online',
          statusText: 'ATIVO',
          requests: '180',
          responseTime: '95',
          icon: 'fas fa-search'
        },
        {
          id: 4,
          name: 'DuckDuckGo',
          status: 'online',
          statusText: 'ATIVO',
          requests: '100',
          responseTime: '75',
          icon: 'fas fa-duck'
        },
        {
          id: 5,
          name: 'Wikipedia',
          status: 'offline',
          statusText: 'INATIVO',
          requests: '0',
          responseTime: '0',
          icon: 'fas fa-wikipedia-w'
        },
        {
          id: 6,
          name: 'OpenStreetMap',
          status: 'online',
          statusText: 'ATIVO',
          requests: '50',
          responseTime: '60',
          icon: 'fas fa-map'
        }
      ],
      performanceMetrics: [
        {
          id: 1,
          value: '680',
          label: 'Req/min Total',
          icon: 'fas fa-chart-line'
        },
        {
          id: 2,
          value: '82ms',
          label: 'Tempo Médio',
          icon: 'fas fa-clock'
        },
        {
          id: 3,
          value: '97.2%',
          label: 'Taxa de Sucesso',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          value: '2.1GB',
          label: 'Dados Transferidos',
          icon: 'fas fa-database'
        }
      ],
      configurations: [
        {
          id: 1,
          name: 'Rate Limiting',
          value: '1000 req/min',
          status: 'online',
          statusText: 'ATIVO'
        },
        {
          id: 2,
          name: 'Timeout Global',
          value: '30 segundos',
          status: 'online',
          statusText: 'CONFIGURADO'
        },
        {
          id: 3,
          name: 'Retry Policy',
          value: '3 tentativas',
          status: 'online',
          statusText: 'ATIVO'
        },
        {
          id: 4,
          name: 'Cache TTL',
          value: '1 hora',
          status: 'online',
          statusText: 'OK'
        }
      ],
      recentLogs: [
        {
          id: 1,
          title: 'Open Food Facts Sync',
          message: '150 produtos sincronizados com sucesso',
          timestamp: '2 min atrás',
          level: 'success',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          title: 'Google Shopping Update',
          message: '200 produtos atualizados',
          timestamp: '15 min atrás',
          level: 'info',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          title: 'Wikipedia API Error',
          message: 'Timeout na conexão com Wikipedia',
          timestamp: '1 hora atrás',
          level: 'error',
          icon: 'fas fa-exclamation-circle'
        },
        {
          id: 4,
          title: 'Rate Limit Warning',
          message: 'Aproximando limite do Google Shopping',
          timestamp: '2 horas atrás',
          level: 'warning',
          icon: 'fas fa-exclamation-triangle'
        }
      ]
    }
  },
  methods: {
    refreshData() {
      console.log('Refreshing APIs data...')
      // Implementar refresh dos dados
    },
    syncData() {
      console.log('Synchronizing APIs data...')
      // Implementar sincronização
    }
  }
}
</script>

<style scoped>
.apis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.api-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.api-details {
  flex: 1;
}

.api-name {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.api-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
  display: inline-block;
}

.api-status.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.api-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.api-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.metric-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
}

.metric-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.config-label {
  color: #e2e8f0;
  font-weight: 600;
  flex: 1;
}

.config-value {
  color: #94a3b8;
  font-size: 0.875rem;
  flex: 2;
  text-align: center;
}

.config-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  flex: 1;
  text-align: center;
}

.config-status.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.config-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.log-item.success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.log-item.info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.log-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.log-item.error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.log-icon {
  font-size: 1rem;
  margin-top: 0.125rem;
}

.log-item.success .log-icon {
  color: #22c55e;
}

.log-item.info .log-icon {
  color: #3b82f6;
}

.log-item.warning .log-icon {
  color: #f59e0b;
}

.log-item.error .log-icon {
  color: #ef4444;
}

.log-content {
  flex: 1;
}

.log-title {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.log-message {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.log-time {
  color: #64748b;
  font-size: 0.75rem;
}
</style>

<style>
@import '../../../../../shared/styles/canonika-view.css';
</style> 