<template>
  <div class="analises-view">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-chart-bar"></i>
        Análises e Relatórios
      </h1>
      <p class="page-subtitle">
        Relatórios e insights sobre extrações e pesquisas
      </p>
    </div>

    <!-- Dashboard de Métricas -->
    <div class="metrics-dashboard">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-chart-line"></i>
            Métricas Gerais
          </h5>
        </div>
        <div class="card-body">
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
    <div class="reports-section">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-chart-pie"></i>
            Relatórios por Período
          </h5>
        </div>
        <div class="card-body">
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
    <div class="reports-list">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-file-alt"></i>
            Relatórios Disponíveis
          </h5>
        </div>
        <div class="card-body">
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
                <button @click="viewReport(report)" class="action-btn">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="downloadReport(report)" class="action-btn">
                  <i class="fas fa-download"></i>
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
    }
  },
  mounted() {
    this.loadReportData();
  }
}
</script>

<style scoped>
.analises-view {
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

.metrics-dashboard {
  margin-bottom: 2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
}

.metric-icon {
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

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.metric-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

.reports-section {
  margin-bottom: 2rem;
}

.period-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #475569;
  background: transparent;
  color: #94a3b8;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.chart-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #64748b;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.report-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.report-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.report-icon {
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

.report-content {
  flex: 1;
}

.report-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.25rem;
}

.report-description {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0 0 0.25rem;
}

.report-date {
  font-size: 0.75rem;
  color: #64748b;
}

.report-actions {
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
</style> 