<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão Skipper -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-shopping-cart"></i>
        <div class="title-content">
          <h1>Marketplaces</h1>
          <p>E-commerce e plataformas de venda</p>
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
              <span class="status-badge online">Online</span>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">ONLINE</div>
              <div class="balance-label">Marketplaces conectados</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Última Sincronização:</span>
                <span class="detail-value">2024-01-15 14:30:00</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Marketplaces Ativos:</span>
                <span class="detail-value">6</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Sucesso:</span>
                <span class="detail-value">96.8%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Marketplaces Conectados -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="card-title">
              <h4>Marketplaces Conectados</h4>
              <span class="card-subtitle">Plataformas ativas</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">6 Marketplaces</span>
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
                  <div class="marketplace-metrics">
                    <span>{{ marketplace.products }} produtos</span>
                    <span>{{ marketplace.orders }} pedidos</span>
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
              <span class="status-badge info">4 Métricas</span>
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
              <span class="card-subtitle">Parâmetros dos marketplaces</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">4 Configs</span>
            </div>
          </div>
          <div class="card-content">
            <div class="config-list">
              <div v-for="config in marketplaceConfigs" :key="config.id" class="config-item">
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
  name: 'FisherMarketplacesView',
  data() {
    return {
      marketplaces: [
        {
          id: 1,
          name: 'Mercado Livre',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-shopping-cart',
          products: '2,450',
          orders: '156'
        },
        {
          id: 2,
          name: 'Amazon',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-amazon',
          products: '1,890',
          orders: '98'
        },
        {
          id: 3,
          name: 'Shopee',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-shopping-bag',
          products: '1,230',
          orders: '87'
        },
        {
          id: 4,
          name: 'Magazine Luiza',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-store',
          products: '890',
          orders: '45'
        },
        {
          id: 5,
          name: 'Americanas',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-shopping-basket',
          products: '1,120',
          orders: '67'
        },
        {
          id: 6,
          name: 'Casas Bahia',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-home',
          products: '750',
          orders: '34'
        }
      ],
      performanceMetrics: [
        {
          id: 1,
          name: 'Total de Produtos',
          value: '8,340',
          label: 'cadastrados',
          icon: 'fas fa-box'
        },
        {
          id: 2,
          name: 'Pedidos Hoje',
          value: '487',
          label: 'processados',
          icon: 'fas fa-shopping-cart'
        },
        {
          id: 3,
          name: 'Receita Total',
          value: 'R$ 45.2K',
          label: 'este mês',
          icon: 'fas fa-dollar-sign'
        },
        {
          id: 4,
          name: 'Marketplaces',
          value: '6/6',
          label: 'ativos',
          icon: 'fas fa-store'
        }
      ],
      marketplaceConfigs: [
        {
          id: 1,
          name: 'Auto Sync',
          value: 'Ativado',
          description: 'Sincronização automática'
        },
        {
          id: 2,
          name: 'Sync Interval',
          value: '30 min',
          description: 'Intervalo de sincronização'
        },
        {
          id: 3,
          name: 'Price Update',
          value: 'Ativado',
          description: 'Atualização automática de preços'
        },
        {
          id: 4,
          name: 'Stock Sync',
          value: 'Ativado',
          description: 'Sincronização de estoque'
        }
      ]
    }
  },
  methods: {
    syncData() {
      console.log('Sincronizando dados dos marketplaces...')
      // Implementar lógica de sincronização
    },
    refreshData() {
      console.log('Atualizando dados dos marketplaces...')
      // Implementar lógica de atualização
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do MarketplacesView mantidos */
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

.marketplaces-grid {
  display: grid;
  gap: 0.75rem;
}

.marketplace-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.marketplace-icon {
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

.marketplace-details {
  flex: 1;
}

.marketplace-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.marketplace-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.marketplace-status.online {
  background-color: #d1fae5;
  color: #10b981;
}

.marketplace-status.offline {
  background-color: #fee2e2;
  color: #ef4444;
}

.marketplace-metrics {
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

<style>
@import '../../../../../shared/styles/canonika-view.css';
</style> 