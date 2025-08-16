<template>
  <div class="canonika-view">
    <!-- View Header (padrão template) -->
    <div class="view-header-card">
      <div class="header-content">
        <div class="header-left">
          <div class="service-icon">
            <i class="fas fa-robot"></i>
          </div>
          <div class="service-info">
            <h2>WEB SCRAPING - Sistema de Bots</h2>
            <p>Gerenciamento e monitoramento de coleta automatizada de dados</p>
          </div>
        </div>
        <div class="header-center">
          <div class="status-indicator-large">
            <div class="status-dot online"></div>
            <span>Sistema Operacional</span>
          </div>
        </div>
        <div class="header-right">
          <button @click="startScraping" class="btn btn-primary">
            <i class="fas fa-play me-2"></i>
            Iniciar Bots
          </button>
          <button @click="configureScraping" class="btn btn-secondary">
            <i class="fas fa-cog me-2"></i>
            Configurar
          </button>
        </div>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Monitoramento de Bots -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-chart-line section-icon text-success"></i>
            MONITORAMENTO DE BOTS
          </h3>
          <p class="section-description">
            Status em tempo real dos bots de web scraping e performance de coleta.
          </p>
        </div>
        <div class="section-content">
          <div class="service-cards-grid">
            <div class="service-card-large">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-robot"></i>
                </div>
                <div class="card-info">
                  <h4>STATUS DOS BOTS</h4>
                  <p class="card-subtitle">Monitoramento em tempo real</p>
                </div>
                <div class="card-status">
                  <span class="status-badge functioning">Funcionando</span>
                </div>
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-value blue">{{ scrapingStatus.activeBots }}</span>
                  <span class="metric-label">Bots Ativos</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ scrapingStatus.successRate }}%</span>
                  <span class="metric-label">Taxa Sucesso</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ scrapingStatus.pagesScraped }}</span>
                  <span class="metric-label">Páginas</span>
                </div>
              </div>
            </div>

            <div class="service-card-large">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <div class="card-info">
                  <h4>ESTATÍSTICAS DE COLETA</h4>
                  <p class="card-subtitle">Volume e qualidade dos dados</p>
                </div>
                <div class="card-status">
                  <span class="status-badge functioning">Ativo</span>
                </div>
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.totalData }}</span>
                  <span class="metric-label">Total Dados</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.sitesMonitored }}</span>
                  <span class="metric-label">Sites</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.dataQuality }}%</span>
                  <span class="metric-label">Qualidade</span>
                </div>
              </div>
            </div>
          </div>

          <h3 class="section-title mt-4">
            <i class="fas fa-list-alt section-icon text-primary"></i>
            LISTA DE BOTS ATIVOS
          </h3>
          <p class="section-description">
            Detalhes e performance de cada bot de coleta automatizada.
          </p>
          <div class="feature-cards-grid">
            <div 
              v-for="bot in bots" 
              :key="bot.id" 
              class="feature-card"
            >
              <div class="feature-icon">
                <i :class="bot.icon"></i>
              </div>
              <div class="feature-title">{{ bot.name }}</div>
              <div class="feature-description">{{ bot.status }} - {{ bot.pagesScraped }} páginas</div>
              <div class="feature-actions">
                <button class="btn btn-sm btn-outline-primary">
                  <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary">
                  <i class="fas fa-pause"></i>
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
            <h3>Web Scraping - Fisher Service</h3>
            <p>Sistema de gerenciamento e monitoramento de bots de coleta de dados</p>
          </div>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-value">{{ bots.length }}</span>
              <span class="stat-label">Bots</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ scrapingStatus.pagesScraped }}</span>
              <span class="stat-label">Páginas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ dataStats.totalData }}</span>
              <span class="stat-label">Dados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrapingView',
  data() {
    return {
      scrapingStatus: {
        activeBots: 4,
        successRate: 92.5,
        pagesScraped: '15.8K',
        lastRun: '10 min atrás'
      },
      dataStats: {
        totalData: '2.3GB',
        sitesMonitored: 25,
        dataQuality: 94.2,
        storageUsed: '1.8GB'
      },
      bots: [
        {
          id: 1,
          name: 'E-commerce Bot',
          status: 'Ativo',
          icon: 'fas fa-shopping-cart',
          pagesScraped: '5.2K'
        },
        {
          id: 2,
          name: 'News Bot',
          status: 'Ativo',
          icon: 'fas fa-newspaper',
          pagesScraped: '3.8K'
        },
        {
          id: 3,
          name: 'Social Media Bot',
          status: 'Ativo',
          icon: 'fas fa-share-alt',
          pagesScraped: '4.1K'
        },
        {
          id: 4,
          name: 'Price Comparison Bot',
          status: 'Ativo',
          icon: 'fas fa-tags',
          pagesScraped: '2.7K'
        }
      ]
    }
  },
  methods: {
    startScraping() {
      console.log('Iniciando web scraping...')
      // Lógica para iniciar scraping
    },
    configureScraping() {
      console.log('Configurando scraping...')
      // Lógica para configurar scraping
    }
  }
}
</script>




