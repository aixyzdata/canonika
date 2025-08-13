<template>
  <div class="canonika-view">
    <!-- Header Padronizado -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-download"></i>
        <div class="title-content">
          <h1>Extração de Dados</h1>
          <p>Histórico e gerenciamento de extrações realizadas</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>ONLINE</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData()" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="exportData()" class="action-btn primary">
          <i class="fas fa-download"></i>
          Exportar Dados
        </button>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="view-content">
      <!-- Estatísticas de Extração -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Estatísticas de Extração</h3>
            <div class="card-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
          </div>
          <div class="card-content">
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
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Filtros e Controles</h3>
            <div class="card-icon">
              <i class="fas fa-filter"></i>
            </div>
          </div>
          <div class="card-content">
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
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Histórico de Extrações</h3>
            <div class="card-icon">
              <i class="fas fa-list"></i>
            </div>
          </div>
          <div class="card-content">
            <div v-if="extractions.length === 0" class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-download"></i>
              </div>
              <h3>Nenhuma extração encontrada</h3>
              <p>Não há extrações para exibir com os filtros atuais</p>
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
                  <button @click="viewExtraction(extraction)" class="action-btn" title="Visualizar">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="downloadExtraction(extraction)" class="action-btn" title="Baixar">
                    <i class="fas fa-download"></i>
                  </button>
                  <button v-if="extraction.status === 'running'" @click="stopExtraction(extraction)" class="action-btn danger" title="Parar">
                    <i class="fas fa-stop"></i>
                  </button>
                  <button v-if="extraction.status === 'failed'" @click="retryExtraction(extraction)" class="action-btn" title="Tentar Novamente">
                    <i class="fas fa-redo"></i>
                  </button>
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
    refreshData() {
      console.log('Atualizando dados de extração...');
    },
    exportData() {
      console.log('Exportando dados de extração...');
    },
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

