<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão Skipper -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-spider"></i>
        <div class="title-content">
          <h1>Web Scraping</h1>
          <p>Coleta de dados web automatizada</p>
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
              <div class="balance-label">Scrapers ativos</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Última Sincronização:</span>
                <span class="detail-value">2024-01-15 14:30:00</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Scrapers Ativos:</span>
                <span class="detail-value">8</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Sucesso:</span>
                <span class="detail-value">94.2%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Scrapers Ativos -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-spider"></i>
            </div>
            <div class="card-title">
              <h4>Scrapers Ativos</h4>
              <span class="card-subtitle">Robôs de coleta</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">8 Scrapers</span>
            </div>
          </div>
          <div class="card-content">
            <div class="scrapers-grid">
              <div v-for="scraper in scrapers" :key="scraper.id" class="scraper-item">
                <div class="scraper-icon">
                  <i :class="scraper.icon"></i>
                </div>
                <div class="scraper-details">
                  <div class="scraper-name">{{ scraper.name }}</div>
                  <div class="scraper-status" :class="scraper.status">
                    {{ scraper.statusText }}
                  </div>
                  <div class="scraper-metrics">
                    <span>{{ scraper.pages }} páginas</span>
                    <span>{{ scraper.data }} dados</span>
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
              <span class="card-subtitle">Parâmetros dos scrapers</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">4 Configs</span>
            </div>
          </div>
          <div class="card-content">
            <div class="config-list">
              <div v-for="config in scraperConfigs" :key="config.id" class="config-item">
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
  name: 'FisherScrapingView',
  data() {
    return {
      scrapers: [
        {
          id: 1,
          name: 'E-commerce Scraper',
          status: 'online',
          statusText: 'ATIVO',
          icon: 'fas fa-shopping-cart',
          pages: '1,250',
          data: '45.2K'
        },
        {
          id: 2,
          name: 'News Scraper',
          status: 'online',
          statusText: 'ATIVO',
          icon: 'fas fa-newspaper',
          pages: '890',
          data: '12.8K'
        },
        {
          id: 3,
          name: 'Social Media Scraper',
          status: 'online',
          statusText: 'ATIVO',
          icon: 'fas fa-share-alt',
          pages: '2,100',
          data: '78.5K'
        },
        {
          id: 4,
          name: 'Job Sites Scraper',
          status: 'online',
          statusText: 'ATIVO',
          icon: 'fas fa-briefcase',
          pages: '650',
          data: '15.3K'
        },
        {
          id: 5,
          name: 'Real Estate Scraper',
          status: 'online',
          statusText: 'ATIVO',
          icon: 'fas fa-home',
          pages: '1,450',
          data: '32.1K'
        },
        {
          id: 6,
          name: 'Product Reviews Scraper',
          status: 'online',
          statusText: 'ATIVO',
          icon: 'fas fa-star',
          pages: '980',
          data: '28.7K'
        },
        {
          id: 7,
          name: 'Price Comparison Scraper',
          status: 'online',
          statusText: 'ATIVO',
          icon: 'fas fa-tags',
          pages: '1,750',
          data: '52.4K'
        },
        {
          id: 8,
          name: 'Directory Scraper',
          status: 'online',
          statusText: 'ATIVO',
          icon: 'fas fa-address-book',
          pages: '420',
          data: '8.9K'
        }
      ],
      performanceMetrics: [
        {
          id: 1,
          name: 'Páginas Processadas',
          value: '8,440',
          label: 'hoje',
          icon: 'fas fa-globe'
        },
        {
          id: 2,
          name: 'Dados Coletados',
          value: '273.9K',
          label: 'registros',
          icon: 'fas fa-database'
        },
        {
          id: 3,
          name: 'Taxa de Sucesso',
          value: '94.2%',
          label: 'coleta',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          name: 'Scrapers Ativos',
          value: '8/8',
          label: 'funcionando',
          icon: 'fas fa-spider'
        }
      ],
      scraperConfigs: [
        {
          id: 1,
          name: 'Rate Limiting',
          value: '2 req/s',
          description: 'Limite de requisições por segundo'
        },
        {
          id: 2,
          name: 'User Agent Rotation',
          value: 'Ativado',
          description: 'Rotação de user agents'
        },
        {
          id: 3,
          name: 'Proxy Pool',
          value: '25 proxies',
          description: 'Pool de proxies ativos'
        },
        {
          id: 4,
          name: 'Auto Retry',
          value: '3 tentativas',
          description: 'Tentativas automáticas'
        }
      ]
    }
  },
  methods: {
    syncData() {
      console.log('Sincronizando dados dos scrapers...')
      // Implementar lógica de sincronização
    },
    refreshData() {
      console.log('Atualizando dados dos scrapers...')
      // Implementar lógica de atualização
    }
  }
}
</script>


