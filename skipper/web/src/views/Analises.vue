<template>
  <div class="canonika-view">
    <!-- Header Padronizado -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-chart-bar"></i>
        <div class="title-content">
          <h1>Análises e Relatórios</h1>
          <p>Relatórios e insights sobre extrações e pesquisas</p>
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
        <button @click="exportReport()" class="action-btn primary">
          <i class="fas fa-download"></i>
          Exportar Relatório
        </button>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="view-content">
      <!-- Dashboard de Métricas -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Métricas Gerais</h3>
            <div class="card-icon">
              <i class="fas fa-chart-line"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <div class="metric-icon">
                  <i class="fas fa-search"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-number">{{ metrics.totalSearches }}</span>
                  <span class="metric-label">Pesquisas Realizadas</span>
                </div>
              </div>
              
              <div class="metric-item">
                <div class="metric-icon">
                  <i class="fas fa-database"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-number">{{ metrics.totalProducts }}</span>
                  <span class="metric-label">Produtos Extraídos</span>
                </div>
              </div>
              
              <div class="metric-item">
                <div class="metric-icon">
                  <i class="fas fa-globe"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-number">{{ metrics.activeSources }}</span>
                  <span class="metric-label">Fontes Ativas</span>
                </div>
              </div>
              
              <div class="metric-item">
                <div class="metric-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-number">{{ metrics.avgTime }}</span>
                  <span class="metric-label">Tempo Médio (s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos e Relatórios -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Relatórios por Período</h3>
            <div class="card-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="period-selector">
              <button 
                v-for="period in periods" 
                :key="period.value"
                @click="selectPeriod(period.value)"
                :class="['period-btn', { active: selectedPeriod === period.value }]"
              >
                {{ period.label }}
              </button>
            </div>
            
            <div class="chart-container">
              <div class="chart-placeholder">
                <i class="fas fa-chart-bar"></i>
                <p>Gráfico de atividades - {{ selectedPeriodLabel }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Relatórios -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Relatórios Disponíveis</h3>
            <div class="card-icon">
              <i class="fas fa-file-alt"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="reports-grid">
              <div v-for="report in reports" :key="report.id" class="report-item">
                <div class="report-icon">
                  <i :class="report.icon"></i>
                </div>
                <div class="report-content">
                  <h6 class="report-title">{{ report.title }}</h6>
                  <p class="report-description">{{ report.description }}</p>
                  <span class="report-date">{{ report.date }}</span>
                </div>
                <div class="report-actions">
                  <button @click="viewReport(report)" class="action-btn" title="Visualizar">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="downloadReport(report)" class="action-btn" title="Baixar">
                    <i class="fas fa-download"></i>
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
  name: 'SkipperAnalises',
  data() {
    return {
      metrics: {
        totalSearches: 1247,
        totalProducts: 8934,
        activeSources: 8,
        avgTime: 2.3
      },
      periods: [
        { value: 'today', label: 'Hoje' },
        { value: 'week', label: 'Esta Semana' },
        { value: 'month', label: 'Este Mês' },
        { value: 'year', label: 'Este Ano' }
      ],
      selectedPeriod: 'week',
      reports: [
        {
          id: 1,
          title: 'Relatório de Produtos Mais Pesquisados',
          description: 'Análise dos produtos com maior volume de pesquisas',
          icon: 'fas fa-chart-line',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Performance das Fontes',
          description: 'Métricas de eficiência por fonte de dados',
          icon: 'fas fa-database',
          date: '2024-01-14'
        },
        {
          id: 3,
          title: 'Tendências de Mercado',
          description: 'Análise de tendências e padrões de consumo',
          icon: 'fas fa-trending-up',
          date: '2024-01-13'
        }
      ]
    }
  },
  computed: {
    selectedPeriodLabel() {
      const period = this.periods.find(p => p.value === this.selectedPeriod);
      return period ? period.label : '';
    }
  },
  methods: {
    selectPeriod(period) {
      this.selectedPeriod = period;
      this.loadReportData();
    },
    loadReportData() {
      console.log(`Carregando dados para período: ${this.selectedPeriod}`);
    },
    viewReport(report) {
      console.log(`Visualizando relatório: ${report.title}`);
    },
    downloadReport(report) {
      console.log(`Baixando relatório: ${report.title}`);
    },
    refreshData() {
      console.log('Atualizando dados...');
      // Implementar lógica de atualização dos dados
    },
    exportReport() {
      console.log('Exportando relatório...');
      // Implementar lógica de exportação do relatório
    }
  },
  mounted() {
    this.loadReportData();
  }
}
</script>

