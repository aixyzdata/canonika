<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão do Beacon -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-spider"></i>
        <div class="title-content">
          <h1>Web Scraping</h1>
          <p>Coleta automatizada de dados web</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Ativo</span>
      </div>
      <div class="view-actions">
        <button @click="startScraping" class="btn btn-primary btn-sm">
          <i class="fas fa-play me-2"></i>
          Iniciar
        </button>
        <button @click="configureScraping" class="btn btn-secondary btn-sm">
          <i class="fas fa-cog me-2"></i>
          Configurar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status da Coleta -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-spider text-success me-2"></i>
            Status da Coleta
          </h3>
          <p class="section-description">
            Monitoramento das atividades de web scraping.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-spider"></i>
                </div>
                <div class="card-title">
                  <h4>Status Scraping</h4>
                  <span class="card-subtitle">4 bots ativos</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ scrapingStatus.activeBots }}</span>
                    <span class="metric-label">Bots Ativos</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ scrapingStatus.successRate }}%</span>
                    <span class="metric-label">Taxa Sucesso</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ scrapingStatus.pagesScraped }}</span>
                    <span class="metric-label">Páginas Coletadas</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ scrapingStatus.lastRun }}</span>
                    <span class="metric-label">Última Execução</span>
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
                    <span class="metric-value">{{ dataStats.totalData }}</span>
                    <span class="metric-label">Total de Dados</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.sitesMonitored }}</span>
                    <span class="metric-label">Sites Monitorados</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.dataQuality }}%</span>
                    <span class="metric-label">Qualidade dos Dados</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.storageUsed }}</span>
                    <span class="metric-label">Armazenamento</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-robot"></i>
                </div>
                <div class="card-title">
                  <h4>Bots Ativos</h4>
                  <span class="card-subtitle">Agentes de coleta</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">{{ bots.length }} Ativos</span>
                </div>
              </div>
              <div class="card-content">
                <div class="bots-list">
                  <div 
                    v-for="bot in bots" 
                    :key="bot.id" 
                    class="bot-item"
                  >
                    <div class="bot-icon">
                      <i :class="bot.icon"></i>
                    </div>
                    <div class="bot-content">
                      <div class="bot-name">{{ bot.name }}</div>
                      <div class="bot-status">{{ bot.status }}</div>
                    </div>
                    <div class="bot-metrics">
                      <span>{{ bot.pagesScraped }} páginas</span>
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

<style scoped>
/* Estilos específicos do Scraping seguindo padrão Beacon */
.bots-list {
  margin-top: 1rem;
}

.bot-item {
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

.bot-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.bot-icon {
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

.bot-content {
  flex: 1;
}

.bot-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.bot-status {
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 500;
}

.bot-metrics {
  font-size: 0.7rem;
  color: #94a3b8;
}
</style>


