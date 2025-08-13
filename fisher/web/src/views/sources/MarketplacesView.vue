<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão do Beacon -->
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
        <span>Conectado</span>
      </div>
      <div class="view-actions">
        <button @click="syncData" class="btn btn-primary btn-sm">
          <i class="fas fa-sync me-2"></i>
          Sincronizar
        </button>
        <button @click="refreshData" class="btn btn-secondary btn-sm">
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
            Monitoramento das conexões com marketplaces.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="card-title">
                  <h4>Conexão Marketplaces</h4>
                  <span class="card-subtitle">6 plataformas conectadas</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Conectado</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.status }}</span>
                    <span class="metric-label">Status</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.activePlatforms }}</span>
                    <span class="metric-label">Plataformas Ativas</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.successRate }}%</span>
                    <span class="metric-label">Taxa Sucesso</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.lastSync }}</span>
                    <span class="metric-label">Última Sincronização</span>
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
                    <span class="metric-value">{{ dataStats.totalProducts }}</span>
                    <span class="metric-label">Total Produtos</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.totalOrders }}</span>
                    <span class="metric-label">Total Pedidos</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.revenue }}</span>
                    <span class="metric-label">Receita</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.growth }}%</span>
                    <span class="metric-label">Crescimento</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-store"></i>
                </div>
                <div class="card-title">
                  <h4>Plataformas</h4>
                  <span class="card-subtitle">Marketplaces conectados</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">{{ marketplaces.length }} Ativas</span>
                </div>
              </div>
              <div class="card-content">
                <div class="marketplaces-list">
                  <div 
                    v-for="marketplace in marketplaces" 
                    :key="marketplace.id" 
                    class="marketplace-item"
                  >
                    <div class="marketplace-icon">
                      <i :class="marketplace.icon"></i>
                    </div>
                    <div class="marketplace-content">
                      <div class="marketplace-name">{{ marketplace.name }}</div>
                      <div class="marketplace-status">{{ marketplace.status }}</div>
                    </div>
                    <div class="marketplace-metrics">
                      <span>{{ marketplace.products }} produtos</span>
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
  name: 'MarketplacesView',
  data() {
    return {
      connectionStatus: {
        status: 'ONLINE',
        activePlatforms: 6,
        successRate: 96.8,
        lastSync: '5 min atrás'
      },
      dataStats: {
        totalProducts: '45.2K',
        totalOrders: '12.8K',
        revenue: 'R$ 2.5M',
        growth: 15.3
      },
      marketplaces: [
        {
          id: 1,
          name: 'Mercado Livre',
          status: 'Online',
          icon: 'fas fa-shopping-cart',
          products: '15.2K'
        },
        {
          id: 2,
          name: 'Amazon',
          status: 'Online',
          icon: 'fas fa-amazon',
          products: '8.5K'
        },
        {
          id: 3,
          name: 'Shopee',
          status: 'Online',
          icon: 'fas fa-shopping-bag',
          products: '6.8K'
        },
        {
          id: 4,
          name: 'Magazine Luiza',
          status: 'Online',
          icon: 'fas fa-store',
          products: '4.2K'
        },
        {
          id: 5,
          name: 'Americanas',
          status: 'Online',
          icon: 'fas fa-shopping-basket',
          products: '3.8K'
        },
        {
          id: 6,
          name: 'Casas Bahia',
          status: 'Online',
          icon: 'fas fa-home',
          products: '2.7K'
        }
      ]
    }
  },
  methods: {
    syncData() {
      console.log('Sincronizando dados dos marketplaces...')
      // Lógica para sincronizar dados
    },
    refreshData() {
      console.log('Atualizando dados dos marketplaces...')
      // Lógica para atualizar dados
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do Marketplaces seguindo padrão Beacon */
.marketplaces-list {
  margin-top: 1rem;
}

.marketplace-item {
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

.marketplace-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.marketplace-icon {
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

.marketplace-content {
  flex: 1;
}

.marketplace-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.marketplace-status {
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 500;
}

.marketplace-metrics {
  font-size: 0.7rem;
  color: #94a3b8;
}
</style>


