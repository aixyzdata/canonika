<template>
  <div class="dashboard-view">
    <!-- Header do Dashboard -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="canonika-card p-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h2 class="mb-2">
                <i class="fas fa-chart-bar me-2"></i>
                Dashboard Skipper
              </h2>
              <p class="text-muted mb-0">
                Visão geral do sistema de navegação e extração
              </p>
            </div>
            <div class="col-md-4 text-end">
              <div class="d-flex justify-content-end gap-2">
                <button @click="refreshData" class="btn btn-outline-light">
                  <i class="fas fa-sync-alt me-1"></i>
                  Atualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Principais -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ metrics.totalSources }}</h3>
            <p class="metric-label">Fontes Cadastradas</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-play"></i>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ metrics.activeSimulations }}</h3>
            <p class="metric-label">Simulações Ativas</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ metrics.completedSimulations }}</h3>
            <p class="metric-label">Simulações Concluídas</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ metrics.successRate }}%</h3>
            <p class="metric-label">Taxa de Sucesso</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Status dos Sistemas -->
    <div class="row mb-4">
      <div class="col-md-6 mb-3">
        <div class="canonika-card p-4">
          <h4 class="mb-3">
            <i class="fas fa-server me-2"></i>
            Status dos Sistemas
          </h4>
          <div class="system-status-list">
            <div 
              v-for="system in systemStatus" 
              :key="system.name"
              class="system-status-item"
            >
              <div class="status-indicator" :class="system.status"></div>
              <div class="system-info">
                <h6 class="system-name">{{ system.name }}</h6>
                <p class="system-description">{{ system.description }}</p>
              </div>
              <div class="system-port">
                <span class="badge" :class="getStatusBadgeClass(system.status)">
                  {{ system.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <div class="canonika-card p-4">
          <h4 class="mb-3">
            <i class="fas fa-clock me-2"></i>
            Atividade Recente
          </h4>
          <div class="recent-activity-list">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon">
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="activity-content">
                <h6 class="activity-title">{{ activity.title }}</h6>
                <p class="activity-description">{{ activity.description }}</p>
                <small class="activity-time">{{ formatTime(activity.timestamp) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fontes Mais Utilizadas -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="canonika-card p-4">
          <h4 class="mb-3">
            <i class="fas fa-star me-2"></i>
            Fontes Mais Utilizadas
          </h4>
          <div class="row">
            <div 
              v-for="source in topSources" 
              :key="source.id"
              class="col-md-4 mb-3"
            >
              <div class="source-usage-card">
                <div class="source-header">
                  <div class="source-icon">
                    <i :class="getSourceIcon(source.name)"></i>
                  </div>
                  <div class="usage-stats">
                    <span class="usage-count">{{ source.usageCount }}</span>
                    <span class="usage-label">usos</span>
                  </div>
                </div>
                <div class="source-info">
                  <h6 class="source-name">{{ source.name }}</h6>
                  <div class="source-type">
                    <span class="badge" :class="getTypeBadgeClass(source.type)">
                      {{ getTypeText(source.type) }}
                    </span>
                  </div>
                  <div class="success-rate">
                    <span class="rate-label">Taxa de Sucesso:</span>
                    <span class="rate-value">{{ source.successRate }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações Rápidas -->
    <div class="row">
      <div class="col-12">
        <div class="canonika-card p-4">
          <h4 class="mb-3">
            <i class="fas fa-bolt me-2"></i>
            Ações Rápidas
          </h4>
          <div class="row">
            <div class="col-md-3 mb-3">
              <button @click="navigateToSimulation" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-search"></i>
                </div>
                <h6 class="action-title">Nova Simulação</h6>
                <p class="action-description">Iniciar pesquisa de produto</p>
              </button>
            </div>
            <div class="col-md-3 mb-3">
              <button @click="navigateToSources" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-database"></i>
                </div>
                <h6 class="action-title">Gerenciar Fontes</h6>
                <p class="action-description">Configurar fontes de dados</p>
              </button>
            </div>
            <div class="col-md-3 mb-3">
              <button @click="viewLogs" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-file-alt"></i>
                </div>
                <h6 class="action-title">Ver Logs</h6>
                <p class="action-description">Histórico de atividades</p>
              </button>
            </div>
            <div class="col-md-3 mb-3">
              <button @click="exportData" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-download"></i>
                </div>
                <h6 class="action-title">Exportar Dados</h6>
                <p class="action-description">Baixar relatórios</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      loading: false,
      metrics: {
        totalSources: 12,
        activeSimulations: 3,
        completedSimulations: 47,
        successRate: 94
      },
      systemStatus: [
        {
          name: 'API Skipper',
          description: 'Backend principal',
          status: 'online',
          port: 8000
        },
        {
          name: 'Redis Cache',
          description: 'Cache de sessões',
          status: 'online',
          port: 6379
        },
        {
          name: 'PostgreSQL',
          description: 'Banco de dados',
          status: 'online',
          port: 5432
        },
        {
          name: 'Milvus',
          description: 'Vetor semântico',
          status: 'online',
          port: 19530
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'simulation',
          title: 'Simulação Concluída',
          description: 'Pesquisa por "iPhone 15" finalizada com sucesso',
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: 2,
          type: 'source',
          title: 'Fonte Adicionada',
          description: 'Nova fonte "Amazon" configurada',
          timestamp: new Date(Date.now() - 15 * 60 * 1000)
        },
        {
          id: 3,
          type: 'error',
          title: 'Erro de Conexão',
          description: 'Falha na conexão com Mercado Livre',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        }
      ],
      topSources: [
        {
          id: 1,
          name: 'Amazon',
          type: 'marketplace',
          usageCount: 23,
          successRate: 96
        },
        {
          id: 2,
          name: 'Mercado Livre',
          type: 'marketplace',
          usageCount: 18,
          successRate: 89
        },
        {
          id: 3,
          name: 'Google Shopping',
          type: 'buscador',
          usageCount: 15,
          successRate: 92
        }
      ]
    }
  },
  methods: {
    async refreshData() {
      this.loading = true
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.loading = false
    },

    getStatusBadgeClass(status) {
      const classes = {
        'online': 'bg-success',
        'offline': 'bg-danger',
        'warning': 'bg-warning'
      }
      return classes[status] || 'bg-secondary'
    },

    getActivityIcon(type) {
      const icons = {
        'simulation': 'fas fa-search',
        'source': 'fas fa-database',
        'error': 'fas fa-exclamation-triangle'
      }
      return icons[type] || 'fas fa-info-circle'
    },

    getSourceIcon(sourceName) {
      const icons = {
        'Amazon': 'fab fa-amazon',
        'Mercado Livre': 'fas fa-shopping-cart',
        'Google Shopping': 'fab fa-google',
        'default': 'fas fa-globe'
      }
      return icons[sourceName] || icons.default
    },

    getTypeBadgeClass(type) {
      const classes = {
        'fabricante': 'bg-primary',
        'marketplace': 'bg-success',
        'buscador': 'bg-info'
      }
      return classes[type] || 'bg-secondary'
    },

    getTypeText(type) {
      const texts = {
        'fabricante': 'Fabricante',
        'marketplace': 'Marketplace',
        'buscador': 'Buscador'
      }
      return texts[type] || 'Desconhecido'
    },

    formatTime(timestamp) {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      
      if (minutes < 1) return 'Agora'
      if (minutes < 60) return `${minutes} min atrás`
      
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours}h atrás`
      
      const days = Math.floor(hours / 24)
      return `${days}d atrás`
    },

    navigateToSimulation() {
      this.$router.push('/simulation')
    },

    navigateToSources() {
      this.$router.push('/sources')
    },

    viewLogs() {
      alert('Funcionalidade de logs em desenvolvimento...')
    },

    exportData() {
      alert('Funcionalidade de exportação em desenvolvimento...')
    }
  }
}
</script>

<style scoped>
.dashboard-view {
  padding: 1rem 0;
}

.metric-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: var(--canonika-green);
}

.metric-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--canonika-green), #00a085);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.metric-content {
  flex: 1;
}

.metric-value {
  color: #e2e8f0;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.metric-label {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

.system-status-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.system-status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #666;
}

.system-status-item .status-indicator.online {
  border-left-color: #28a745;
}

.system-status-item .status-indicator.offline {
  border-left-color: #dc3545;
}

.system-status-item .status-indicator.warning {
  border-left-color: #ffc107;
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #dc3545;
  transition: all 0.3s ease;
}

.status-indicator.online {
  background: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);
}

.status-indicator.offline {
  background: #dc3545;
}

.status-indicator.warning {
  background: #ffc107;
}

.system-info {
  flex: 1;
}

.system-name {
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.system-description {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

.recent-activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.activity-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(0, 123, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007bff;
  font-size: 1rem;
}

.activity-content {
  flex: 1;
}

.activity-title {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.activity-description {
  color: #94a3b8;
  font-size: 0.75rem;
  margin: 0 0 0.25rem;
}

.activity-time {
  color: #64748b;
  font-size: 0.75rem;
}

.source-usage-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.source-usage-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: var(--canonika-green);
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.source-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, var(--canonika-green), #00a085);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.usage-stats {
  text-align: right;
}

.usage-count {
  display: block;
  color: #e2e8f0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.usage-label {
  color: #94a3b8;
  font-size: 0.75rem;
}

.source-name {
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.source-type {
  margin-bottom: 0.5rem;
}

.success-rate {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rate-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.rate-value {
  color: #28a745;
  font-weight: 600;
}

.action-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 1.5rem;
  width: 100%;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: var(--canonika-green);
  color: inherit;
  text-decoration: none;
}

.action-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--canonika-green), #00a085);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin: 0 auto 1rem;
}

.action-title {
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.action-description {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}
</style> 