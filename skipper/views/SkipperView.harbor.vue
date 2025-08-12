<template>
  <div class="skipper-harbor-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-ship"></i>
        <div class="title-content">
          <h1>Skipper - Orquestrador de Navegação</h1>
          <p>Pesquisa e extração inteligente de dados de produtos</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>ONLINE</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="openModule" class="action-btn primary">
          <i class="fas fa-external-link-alt"></i>
          Acessar
        </button>
      </div>
    </div>

    <div class="dashboard-cards">
      <div class="card">
        <div class="card-header">
          <i class="fas fa-search"></i>
          <h3>Pesquisas Realizadas</h3>
        </div>
        <div class="card-content">
          <div class="metric">
            <span class="number">{{ stats.searches }}</span>
            <span class="label">Hoje</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <i class="fas fa-database"></i>
          <h3>Produtos Extraídos</h3>
        </div>
        <div class="card-content">
          <div class="metric">
            <span class="number">{{ stats.products }}</span>
            <span class="label">Total</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <i class="fas fa-globe"></i>
          <h3>Fontes Ativas</h3>
        </div>
        <div class="card-content">
          <div class="metric">
            <span class="number">{{ stats.sources }}</span>
            <span class="label">Conectadas</span>
          </div>
        </div>
      </div>
    </div>

    <div class="actions-panel">
      <h3>Ferramentas Disponíveis</h3>
      <div class="action-buttons">
        <button @click="startSimulation" class="action-btn primary">
          <i class="fas fa-play"></i>
          Iniciar Simulação
        </button>
        <button @click="manageSources" class="action-btn">
          <i class="fas fa-cog"></i>
          Configurar Fontes
        </button>
        <button @click="viewLogs" class="action-btn">
          <i class="fas fa-file-alt"></i>
          Ver Logs
        </button>
        <button @click="exportResults" class="action-btn">
          <i class="fas fa-download"></i>
          Exportar Resultados
        </button>
      </div>
    </div>

    <div class="recent-extractions">
      <h3>Extrações Recentes</h3>
      <div class="extraction-list">
        <div v-for="extraction in recentExtractions" :key="extraction.id" class="extraction-item">
          <div class="extraction-icon">
            <i :class="extraction.icon"></i>
          </div>
          <div class="extraction-content">
            <span class="extraction-text">{{ extraction.text }}</span>
            <span class="extraction-time">{{ extraction.time }}</span>
          </div>
          <div class="extraction-status">
            <span :class="['status', extraction.status]">{{ extraction.statusText }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkipperHarborView',
  data() {
    return {
      stats: {
        searches: 47,
        products: 2843,
        sources: 12
      },
      recentExtractions: [
        {
          id: 1,
          icon: 'fas fa-shopping-cart',
          text: 'Extração de produtos eletrônicos - Amazon',
          time: '5 minutos atrás',
          status: 'success',
          statusText: 'Concluído'
        },
        {
          id: 2,
          icon: 'fas fa-search',
          text: 'Pesquisa por tênis esportivos - MercadoLivre',
          time: '12 minutos atrás',
          status: 'processing',
          statusText: 'Processando'
        },
        {
          id: 3,
          icon: 'fas fa-database',
          text: 'Extração de livros - Saraiva',
          time: '1 hora atrás',
          status: 'success',
          statusText: 'Concluído'
        },
        {
          id: 4,
          icon: 'fas fa-exclamation-triangle',
          text: 'Erro na extração - Site indisponível',
          time: '2 horas atrás',
          status: 'error',
          statusText: 'Erro'
        }
      ]
    }
  },
  methods: {
    refreshData() {
      // Simula atualização dos dados
      console.log('Atualizando dados do Skipper...');
      // Aqui poderia fazer uma chamada real para a API para atualizar os stats
    },
    openModule() {
      window.open('http://localhost:7722/web/', '_blank');
    },
    startSimulation() {
      console.log('🚀 Iniciando simulação - Redirecionando para:', 'http://localhost:7722/web/#/simulation');
      window.open('http://localhost:7722/web/#/simulation', '_blank');
    },
    manageSources() {
      window.open('http://localhost:7722/web/#/sources', '_blank');
    },
    viewLogs() {
      // Como não há uma view específica de logs ainda, vamos para simulação
      window.open('http://localhost:7722/web/#/simulation', '_blank');
    },
    exportResults() {
      alert('Funcionalidade de exportação em desenvolvimento...');
    }
  }
}
</script>

