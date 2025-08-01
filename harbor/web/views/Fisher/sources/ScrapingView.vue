<template>
  <CanonikaViewTemplate
    title="Web Scraping"
    description="Coleta de dados web"
    header-icon="fas fa-spider"
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
              <span class="detail-label">Sites Monitorados:</span>
              <span class="detail-value">{{ sourceStatus.monitoredSites }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Taxa de Sucesso:</span>
              <span class="detail-value">{{ sourceStatus.successRate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sites Monitorados -->
      <div class="service-card">
        <div class="card-header">
          <h3>Sites Monitorados</h3>
          <div class="card-icon">
            <i class="fas fa-globe"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="sites-grid">
            <div v-for="site in monitoredSites" :key="site.id" class="site-item">
              <div class="site-icon">
                <i :class="site.icon"></i>
              </div>
              <div class="site-details">
                <div class="site-name">{{ site.name }}</div>
                <div class="site-status" :class="site.status">
                  {{ site.statusText }}
                </div>
                <div class="site-metrics">
                  <span>{{ site.pages }} páginas</span>
                  <span>{{ site.lastUpdate }}</span>
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
  name: 'ScrapingView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      sourceStatus: {
        status: 'ONLINE',
        description: 'Conexão ativa com sites monitorados',
        lastSync: '2024-01-15 14:30:00',
        monitoredSites: '12/15',
        successRate: '96.8%'
      },
      monitoredSites: [
        {
          id: 1,
          name: 'E-commerce Sites',
          status: 'online',
          statusText: 'ATIVO',
          pages: '2.5K',
          lastUpdate: '2 min atrás',
          icon: 'fas fa-shopping-cart'
        },
        {
          id: 2,
          name: 'News Sites',
          status: 'online',
          statusText: 'ATIVO',
          pages: '1.8K',
          lastUpdate: '5 min atrás',
          icon: 'fas fa-newspaper'
        },
        {
          id: 3,
          name: 'Product Catalogs',
          status: 'online',
          statusText: 'ATIVO',
          pages: '3.2K',
          lastUpdate: '10 min atrás',
          icon: 'fas fa-box'
        },
        {
          id: 4,
          name: 'Price Comparison',
          status: 'offline',
          statusText: 'INATIVO',
          pages: '0',
          lastUpdate: '1 hora atrás',
          icon: 'fas fa-tags'
        },
        {
          id: 5,
          name: 'Review Sites',
          status: 'online',
          statusText: 'ATIVO',
          pages: '950',
          lastUpdate: '15 min atrás',
          icon: 'fas fa-star'
        },
        {
          id: 6,
          name: 'Social Media',
          status: 'online',
          statusText: 'ATIVO',
          pages: '1.2K',
          lastUpdate: '20 min atrás',
          icon: 'fas fa-share-alt'
        }
      ],
      performanceMetrics: [
        {
          id: 1,
          value: '12.2K',
          label: 'Páginas Processadas',
          icon: 'fas fa-file-alt'
        },
        {
          id: 2,
          value: '45ms',
          label: 'Tempo Médio',
          icon: 'fas fa-clock'
        },
        {
          id: 3,
          value: '96.8%',
          label: 'Taxa de Sucesso',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          value: '1.8GB',
          label: 'Dados Coletados',
          icon: 'fas fa-download'
        }
      ],
      configurations: [
        {
          id: 1,
          name: 'Rate Limiting',
          value: '2 req/seg',
          status: 'online',
          statusText: 'ATIVO'
        },
        {
          id: 2,
          name: 'User Agent Rotation',
          value: 'Ativo',
          status: 'online',
          statusText: 'CONFIGURADO'
        },
        {
          id: 3,
          name: 'Proxy Rotation',
          value: '5 proxies',
          status: 'online',
          statusText: 'OK'
        },
        {
          id: 4,
          name: 'Retry Policy',
          value: '3 tentativas',
          status: 'online',
          statusText: 'ATIVO'
        }
      ],
      recentLogs: [
        {
          id: 1,
          title: 'E-commerce Scraping',
          message: '2.5K páginas processadas com sucesso',
          timestamp: '2 min atrás',
          level: 'success',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          title: 'News Sites Update',
          message: '1.8K artigos coletados',
          timestamp: '5 min atrás',
          level: 'info',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          title: 'Price Comparison Error',
          message: 'Site temporariamente indisponível',
          timestamp: '1 hora atrás',
          level: 'error',
          icon: 'fas fa-exclamation-circle'
        },
        {
          id: 4,
          title: 'Proxy Rotation',
          message: 'Proxies alternados automaticamente',
          timestamp: '2 horas atrás',
          level: 'info',
          icon: 'fas fa-sync'
        }
      ]
    }
  },
  methods: {
    refreshData() {
      console.log('Refreshing Scraping data...')
      // Implementar refresh dos dados
    },
    syncData() {
      console.log('Synchronizing Scraping data...')
      // Implementar sincronização
    }
  }
}
</script>

<style scoped>
.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.site-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.site-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.site-details {
  flex: 1;
}

.site-name {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.site-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
  display: inline-block;
}

.site-status.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.site-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.site-metrics {
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
@import '../../../../shared/styles/canonika-view.css';
</style> 