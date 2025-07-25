<template>
  <div class="extracao-view">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-download"></i>
        Extração de Dados
      </h1>
      <p class="page-subtitle">
        Histórico e gerenciamento de extrações realizadas
      </p>
    </div>

    <!-- Estatísticas de Extração -->
    <div class="extraction-stats">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-chart-pie"></i>
            Estatísticas de Extração
          </h5>
        </div>
        <div class="card-body">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-download"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ stats.totalExtractions }}</span>
                <span class="stat-label">Total de Extrações</span>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ stats.successfulExtractions }}</span>
                <span class="stat-label">Extrações Bem-sucedidas</span>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ stats.avgDuration }}</span>
                <span class="stat-label">Duração Média (min)</span>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-database"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ stats.totalDataSize }}</span>
                <span class="stat-label">Dados Extraídos (MB)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros e Controles -->
    <div class="extraction-controls">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-filter"></i>
            Filtros e Controles
          </h5>
        </div>
        <div class="card-body">
          <div class="controls-row">
            <div class="control-group">
              <label class="control-label">Status</label>
              <select v-model="selectedStatus" class="control-select">
                <option value="">Todos</option>
                <option value="completed">Concluídas</option>
                <option value="running">Em Execução</option>
                <option value="failed">Falhadas</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>
            
            <div class="control-group">
              <label class="control-label">Fonte</label>
              <select v-model="selectedSource" class="control-select">
                <option value="">Todas</option>
                <option v-for="source in sources" :key="source.id" :value="source.id">
                  {{ source.name }}
                </option>
              </select>
            </div>
            
            <div class="control-group">
              <label class="control-label">Período</label>
              <select v-model="selectedPeriod" class="control-select">
                <option value="today">Hoje</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="year">Este Ano</option>
              </select>
            </div>
            
            <div class="control-group">
              <button @click="refreshExtractions" class="control-btn">
                <i class="fas fa-sync-alt"></i>
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Extrações -->
    <div class="extractions-list">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-list"></i>
            Histórico de Extrações
          </h5>
        </div>
        <div class="card-body">
          <div v-if="extractions.length === 0" class="empty-state">
            <i class="fas fa-download"></i>
            <p>Nenhuma extração encontrada</p>
          </div>
          
          <div v-else class="extractions-grid">
            <div v-for="extraction in filteredExtractions" :key="extraction.id" class="extraction-item">
              <div class="extraction-header">
                <div class="extraction-icon">
                  <i :class="getStatusIcon(extraction.status)"></i>
                </div>
                <div class="extraction-info">
                  <h6 class="extraction-title">{{ extraction.title }}</h6>
                  <span class="extraction-source">{{ extraction.source }}</span>
                </div>
                <div class="extraction-status">
                  <span :class="['status-badge', `status-${extraction.status}`]">
                    {{ getStatusText(extraction.status) }}
                  </span>
                </div>
              </div>
              
              <div class="extraction-details">
                <div class="detail-item">
                  <span class="detail-label">Início:</span>
                  <span class="detail-value">{{ extraction.startTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Duração:</span>
                  <span class="detail-value">{{ extraction.duration }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Produtos:</span>
                  <span class="detail-value">{{ extraction.productsCount }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tamanho:</span>
                  <span class="detail-value">{{ extraction.dataSize }}</span>
                </div>
              </div>
              
              <div class="extraction-actions">
                <button @click="viewExtraction(extraction)" class="action-btn">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="downloadExtraction(extraction)" class="action-btn">
                  <i class="fas fa-download"></i>
                </button>
                <button v-if="extraction.status === 'running'" @click="stopExtraction(extraction)" class="action-btn danger">
                  <i class="fas fa-stop"></i>
                </button>
                <button v-if="extraction.status === 'failed'" @click="retryExtraction(extraction)" class="action-btn">
                  <i class="fas fa-redo"></i>
                </button>
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
  name: 'SkipperExtracao',
  data() {
    return {
      stats: {
        totalExtractions: 1247,
        successfulExtractions: 1189,
        avgDuration: 3.2,
        totalDataSize: 2456
      },
      selectedStatus: '',
      selectedSource: '',
      selectedPeriod: 'week',
      sources: [
        { id: 1, name: 'Amazon' },
        { id: 2, name: 'Mercado Livre' },
        { id: 3, name: 'Americanas' },
        { id: 4, name: 'Casas Bahia' }
      ],
      extractions: [
        {
          id: 1,
          title: 'iPhone 15 - Pesquisa Completa',
          source: 'Amazon',
          status: 'completed',
          startTime: '2024-01-15 14:30',
          duration: '2m 15s',
          productsCount: 45,
          dataSize: '2.3 MB'
        },
        {
          id: 2,
          title: 'Samsung Galaxy - Análise de Preços',
          source: 'Mercado Livre',
          status: 'running',
          startTime: '2024-01-15 15:45',
          duration: '1m 30s',
          productsCount: 23,
          dataSize: '1.1 MB'
        },
        {
          id: 3,
          title: 'Notebooks Gaming - Comparativo',
          source: 'Americanas',
          status: 'failed',
          startTime: '2024-01-15 13:20',
          duration: '0m 45s',
          productsCount: 0,
          dataSize: '0 MB'
        },
        {
          id: 4,
          title: 'Smartphones Android - Pesquisa Geral',
          source: 'Casas Bahia',
          status: 'completed',
          startTime: '2024-01-15 12:15',
          duration: '3m 10s',
          productsCount: 67,
          dataSize: '3.8 MB'
        }
      ]
    }
  },
  computed: {
    filteredExtractions() {
      let filtered = this.extractions;
      
      if (this.selectedStatus) {
        filtered = filtered.filter(e => e.status === this.selectedStatus);
      }
      
      if (this.selectedSource) {
        filtered = filtered.filter(e => e.source === this.getSourceName(this.selectedSource));
      }
      
      return filtered;
    }
  },
  methods: {
    getStatusIcon(status) {
      const icons = {
        completed: 'fas fa-check-circle',
        running: 'fas fa-spinner fa-spin',
        failed: 'fas fa-times-circle',
        pending: 'fas fa-clock'
      };
      return icons[status] || 'fas fa-question-circle';
    },
    getStatusText(status) {
      const texts = {
        completed: 'Concluída',
        running: 'Em Execução',
        failed: 'Falhou',
        pending: 'Pendente'
      };
      return texts[status] || 'Desconhecido';
    },
    getSourceName(sourceId) {
      const source = this.sources.find(s => s.id === sourceId);
      return source ? source.name : '';
    },
    refreshExtractions() {
      console.log('Atualizando lista de extrações...');
    },
    viewExtraction(extraction) {
      console.log(`Visualizando extração: ${extraction.title}`);
    },
    downloadExtraction(extraction) {
      console.log(`Baixando extração: ${extraction.title}`);
    },
    stopExtraction(extraction) {
      console.log(`Parando extração: ${extraction.title}`);
    },
    retryExtraction(extraction) {
      console.log(`Tentando novamente extração: ${extraction.title}`);
    }
  },
  mounted() {
    this.refreshExtractions();
  }
}
</script>

<style scoped>
.extracao-view {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  color: #94a3b8;
  margin: 0;
}

.extraction-stats {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

.extraction-controls {
  margin-bottom: 2rem;
}

.controls-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
}

.control-select {
  padding: 0.5rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.extractions-list {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.extractions-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.extraction-item {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.3s ease;
}

.extraction-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.extraction-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.extraction-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.extraction-info {
  flex: 1;
}

.extraction-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.25rem;
}

.extraction-source {
  font-size: 0.875rem;
  color: #94a3b8;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-completed {
  background: #10b981;
  color: white;
}

.status-running {
  background: #3b82f6;
  color: white;
}

.status-failed {
  background: #ef4444;
  color: white;
}

.status-pending {
  background: #f59e0b;
  color: white;
}

.extraction-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-label {
  color: #94a3b8;
}

.detail-value {
  color: #e2e8f0;
  font-weight: 600;
}

.extraction-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border: 1px solid #475569;
  background: transparent;
  color: #94a3b8;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-btn.danger:hover {
  background: #ef4444;
  border-color: #ef4444;
}
</style> 