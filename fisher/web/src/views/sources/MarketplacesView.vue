<template>
  <CanonikaViewTemplate
    title="Marketplaces"
    description="E-commerce e Marketplaces"
    header-icon="fas fa-shopping-cart"
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
              <span class="detail-label">Produtos Processados:</span>
              <span class="detail-value">{{ sourceStatus.productsProcessed }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Taxa de Sucesso:</span>
              <span class="detail-value">{{ sourceStatus.successRate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Marketplaces Conectados -->
      <div class="service-card">
        <div class="card-header">
          <h3>Marketplaces Conectados</h3>
          <div class="card-icon">
            <i class="fas fa-store"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="marketplaces-grid">
            <div v-for="marketplace in marketplaces" :key="marketplace.id" class="marketplace-item">
              <div class="marketplace-icon">
                <i :class="marketplace.icon"></i>
              </div>
              <div class="marketplace-details">
                <div class="marketplace-name">{{ marketplace.name }}</div>
                <div class="marketplace-status" :class="marketplace.status">
                  {{ marketplace.statusText }}
                </div>
                <div class="marketplace-products">{{ marketplace.products }} produtos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas de Dados -->
      <div class="service-card">
        <div class="card-header">
          <h3>Métricas de Dados</h3>
          <div class="card-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="metrics-grid">
            <div v-for="metric in dataMetrics" :key="metric.id" class="metric-item">
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
import CanonikaViewTemplate from '../../../../../shared/templates/CanonikaViewTemplate.vue'

export default {
  name: 'MarketplacesView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      sourceStatus: {
        status: 'ONLINE',
        description: 'Conexão ativa com Marketplaces',
        lastSync: '2024-01-15 14:30:00',
        productsProcessed: '1.8M',
        successRate: '98.5%'
      },
      marketplaces: [
        {
          id: 1,
          name: 'Mercado Livre',
          status: 'online',
          statusText: 'ATIVO',
          products: '450K',
          icon: 'fas fa-shopping-bag'
        },
        {
          id: 2,
          name: 'Amazon',
          status: 'online',
          statusText: 'ATIVO',
          products: '320K',
          icon: 'fas fa-shopping-cart'
        },
        {
          id: 3,
          name: 'Magazine Luiza',
          status: 'online',
          statusText: 'ATIVO',
          products: '280K',
          icon: 'fas fa-store'
        },
        {
          id: 4,
          name: 'Americanas',
          status: 'offline',
          statusText: 'INATIVO',
          products: '0',
          icon: 'fas fa-store-alt'
        },
        {
          id: 5,
          name: 'Casas Bahia',
          status: 'online',
          statusText: 'ATIVO',
          products: '150K',
          icon: 'fas fa-home'
        },
        {
          id: 6,
          name: 'Kabum',
          status: 'online',
          statusText: 'ATIVO',
          products: '200K',
          icon: 'fas fa-laptop'
        }
      ],
      dataMetrics: [
        {
          id: 1,
          value: '1.4M',
          label: 'Produtos Ativos',
          icon: 'fas fa-box'
        },
        {
          id: 2,
          value: '85K',
          label: 'Vendedores',
          icon: 'fas fa-user-tie'
        },
        {
          id: 3,
          value: '2.1K',
          label: 'Categorias',
          icon: 'fas fa-tags'
        },
        {
          id: 4,
          value: '8.2GB',
          label: 'Dados Armazenados',
          icon: 'fas fa-database'
        }
      ],
      configurations: [
        {
          id: 1,
          name: 'API Rate Limit',
          value: '1000 req/min',
          status: 'online',
          statusText: 'OK'
        },
        {
          id: 2,
          name: 'Intervalo de Sincronização',
          value: 'A cada 4 horas',
          status: 'online',
          statusText: 'CONFIGURADO'
        },
        {
          id: 3,
          name: 'Timeout de Conexão',
          value: '45 segundos',
          status: 'online',
          statusText: 'OK'
        },
        {
          id: 4,
          name: 'Retry Automático',
          value: '5 tentativas',
          status: 'online',
          statusText: 'ATIVO'
        }
      ],
      recentLogs: [
        {
          id: 1,
          title: 'Sincronização Mercado Livre',
          message: '450K produtos atualizados com sucesso',
          timestamp: '2 min atrás',
          level: 'success',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          title: 'Atualização Amazon',
          message: '320K produtos processados',
          timestamp: '15 min atrás',
          level: 'info',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          title: 'Erro Americanas',
          message: 'API temporariamente indisponível',
          timestamp: '1 hora atrás',
          level: 'error',
          icon: 'fas fa-exclamation-circle'
        },
        {
          id: 4,
          title: 'Backup Automático',
          message: 'Backup dos dados de marketplaces realizado',
          timestamp: '2 horas atrás',
          level: 'info',
          icon: 'fas fa-database'
        }
      ]
    }
  },
  methods: {
    refreshData() {
      console.log('Refreshing Marketplaces data...')
      // Implementar refresh dos dados
    },
    syncData() {
      console.log('Synchronizing Marketplaces data...')
      // Implementar sincronização
    }
  }
}
</script>

<style scoped>
.marketplaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.marketplace-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.marketplace-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.marketplace-details {
  flex: 1;
}

.marketplace-name {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.marketplace-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
  display: inline-block;
}

.marketplace-status.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.marketplace-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.marketplace-products {
  font-size: 0.875rem;
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