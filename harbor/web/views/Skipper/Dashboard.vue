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
          <i class="fas fa-play"></i>
          Simulação
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
          Simulação
        </button>
        <button @click="manageSources" class="action-btn">
          <i class="fas fa-database"></i>
          Fontes
        </button>
        <button @click="viewLogs" class="action-btn">
          <i class="fas fa-chart-bar"></i>
          Análises
        </button>
        <button @click="exportResults" class="action-btn">
          <i class="fas fa-download"></i>
          Extração
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
      // Navega para a view de simulação
      this.$router.push('/skipper/simulacao');
    },
    startSimulation() {
      console.log('🚀 Iniciando simulação - Navegando para simulação');
      this.$router.push('/skipper/simulacao');
    },
    manageSources() {
      console.log('⚙️ Configurando fontes - Navegando para fontes');
      this.$router.push('/skipper/fontes');
    },
    viewLogs() {
      console.log('📊 Visualizando análises - Navegando para análises');
      this.$router.push('/skipper/analises');
    },
    exportResults() {
      console.log('📥 Exportando resultados - Navegando para extração');
      this.$router.push('/skipper/extracao');
    }
  }
}
</script>

<style scoped>
.skipper-harbor-view {
  padding: 1.5rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  min-height: 100%;
  color: #e2e8f0;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.view-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-title i {
  color: #3b82f6;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.title-content {
  flex: 1;
}

.title-content h1 {
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.title-content p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.3;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #059669;
  font-size: 0.875rem;
}

.view-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: 1px solid #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-header i {
  color: #3b82f6;
  font-size: 1.25rem;
}

.card-header h3 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.125rem;
  font-weight: 600;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric .number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.metric .label {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.actions-panel {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.actions-panel h3 {
  margin: 0 0 1rem 0;
  color: #e2e8f0;
  font-size: 1.125rem;
  font-weight: 600;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.action-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.recent-extractions {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recent-extractions h3 {
  margin: 0 0 1rem 0;
  color: #e2e8f0;
  font-size: 1.125rem;
  font-weight: 600;
}

.extraction-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.extraction-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.extraction-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.extraction-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.extraction-text {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.875rem;
}

.extraction-time {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.extraction-status {
  flex-shrink: 0;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status.success {
  background: #d1fae5;
  color: #065f46;
}

.status.processing {
  background: #fef3c7;
  color: #92400e;
}

.status.error {
  background: #fee2e2;
  color: #991b1b;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style> 