<template>
  <div class="canonika-view">
    <!-- View Header (padrão template) -->
    <div class="view-header-card">
      <div class="header-content">
        <div class="header-left">
          <div class="service-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="service-info">
            <h2>MARKETPLACES - Sistema de E-commerce</h2>
            <p>Monitoramento e gestão de plataformas de venda online</p>
          </div>
        </div>
        <div class="header-center">
          <div class="status-indicator-large">
            <div class="status-dot online"></div>
            <span>Sistema Operacional</span>
          </div>
        </div>
        <div class="header-right">
          <button @click="syncData" class="btn btn-primary">
            <i class="fas fa-sync-alt me-2"></i>
            Sincronizar Marketplaces
          </button>
          <button @click="refreshData" class="btn btn-secondary">
            <i class="fas fa-cog me-2"></i>
            Configurar
          </button>
        </div>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status das Conexões -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-shopping-cart section-icon text-success"></i>
            STATUS DAS CONEXÕES
          </h3>
          <p class="section-description">
            Monitoramento em tempo real das conexões com plataformas de marketplace.
          </p>
        </div>
        <div class="section-content">
          <div class="service-cards-grid">
            <div class="service-card-large">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="card-info">
                  <h4>Conexões Marketplace</h4>
                  <div class="card-subtitle">6 plataformas conectadas</div>
                </div>
                <div class="card-status">
                  <span class="status-badge functioning">Funcionando</span>
                </div>
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.status }}</span>
                  <span class="metric-label">Status</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.activePlatforms }}</span>
                  <span class="metric-label">Plataformas Ativas</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.successRate }}%</span>
                  <span class="metric-label">Taxa Sucesso</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.lastSync }}</span>
                  <span class="metric-label">Última Sincronização</span>
                </div>
              </div>
            </div>

            <div class="service-card-large">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <div class="card-info">
                  <h4>Estatísticas</h4>
                  <div class="card-subtitle">Dados coletados</div>
                </div>
                <div class="card-status">
                  <span class="status-badge functioning">Ativo</span>
                </div>
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.totalProducts }}</span>
                  <span class="metric-label">Total Produtos</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.totalOrders }}</span>
                  <span class="metric-label">Total Pedidos</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.revenue }}</span>
                  <span class="metric-label">Receita</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.growth }}%</span>
                  <span class="metric-label">Crescimento</span>
                </div>
              </div>
            </div>
          </div>

          <h3 class="section-title mt-4">
            <i class="fas fa-store section-icon text-primary"></i>
            PLATAFORMAS CONECTADAS
          </h3>
          <p class="section-description">
            Monitoramento detalhado de cada marketplace e suas métricas.
          </p>
          <div class="feature-cards-grid">
            <div 
              v-for="marketplace in marketplaces" 
              :key="marketplace.id" 
              class="feature-card"
            >
              <div class="feature-icon">
                <i :class="marketplace.icon"></i>
              </div>
              <div class="feature-title">{{ marketplace.name }}</div>
              <div class="feature-description">{{ marketplace.status }}</div>
              <div class="feature-description">{{ marketplace.products }} produtos</div>
              <div class="feature-actions">
                <button class="btn btn-sm btn-outline-primary">Ver Detalhes</button>
                <button class="btn btn-sm btn-outline-secondary">Config</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="canonika-footer">
        <div class="footer-content">
          <div class="footer-info">
            <h3>Marketplaces - Fisher Service</h3>
            <p>Sistema de monitoramento e integração com plataformas de e-commerce</p>
          </div>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-value">{{ marketplaces.length }}</span>
              <span class="stat-label">Plataformas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ dataStats.totalProducts }}</span>
              <span class="stat-label">Produtos</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ dataStats.revenue }}</span>
              <span class="stat-label">Receita</span>
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



