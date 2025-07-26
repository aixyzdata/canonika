<template>
  <div class="tollgate-view">
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

<style scoped>
.tollgate-view {
  /* height: 100vh; */
  /* padding: 2rem; */
  /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); */
  /* color: #e2e8f0; */
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 1rem;
  border: 1px solid #475569;
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
  font-size: 0.875rem;
  font-weight: 600;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.view-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.view-content {
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.service-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.card-icon {
  color: #3b82f6;
  font-size: 1.25rem;
}

.card-content {
  color: #94a3b8;
}

/* Métricas */
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

/* Períodos */
.period-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #475569;
  background: transparent;
  color: #94a3b8;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.period-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #3b82f6;
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
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  border-radius: 0.5rem;
}

.chart-placeholder {
  text-align: center;
  color: #64748b;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #3b82f6;
}

.chart-placeholder p {
  margin: 0;
  font-size: 0.875rem;
}

/* Relatórios */
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
  border-color: #3b82f6;
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
  flex-shrink: 0;
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
  line-height: 1.4;
}

.report-date {
  font-size: 0.75rem;
  color: #64748b;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.report-actions .action-btn {
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid #475569;
  background: transparent;
  color: #94a3b8;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.report-actions .action-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .period-selector {
    justify-content: center;
  }
}
</style> 