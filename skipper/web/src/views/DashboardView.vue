<template>
  <div class="status-view-container">
    <!-- Header Padrão do Serviço -->
    <div class="canonika-status-header">
      <div class="canonika-status-header-content">
        <div class="canonika-status-header-info">
          <div class="canonika-service-icon">
            <i class="fas fa-ship"></i>
          </div>
          <div class="canonika-service-info">
            <div class="canonika-service-title">
              <h1 class="canonika-service-name">Skipper</h1>
            </div>
            <p class="canonika-service-description">Sistema de navegação e extração inteligente de dados</p>
          </div>
        </div>
        
        <div class="canonika-status-indicator online">
          <div class="canonika-status-dot"></div>
          <span>ONLINE</span>
        </div>
        
        <div class="canonika-status-actions">
          <button @click="refreshData" class="canonika-btn canonika-btn-outline">
            <i class="fas fa-sync-alt"></i>
            Atualizar
          </button>
          <button @click="navigateToSimulation" class="canonika-btn canonika-btn-primary">
            <i class="fas fa-play"></i>
            Simulação
          </button>
        </div>
      </div>
    </div>

    <!-- Métricas do Serviço -->
    <div class="canonika-metrics-grid">
      <div class="canonika-metric-card">
        <div class="canonika-metric-header">
          <div class="canonika-metric-icon">
            <i class="fas fa-database"></i>
          </div>
          <h3 class="canonika-metric-title">Fontes Cadastradas</h3>
        </div>
        <div class="canonika-metric-value">{{ metrics.totalSources }}</div>
        <p class="canonika-metric-label">Total de fontes disponíveis</p>
      </div>
      
      <div class="canonika-metric-card">
        <div class="canonika-metric-header">
          <div class="canonika-metric-icon">
            <i class="fas fa-play"></i>
          </div>
          <h3 class="canonika-metric-title">Simulações Ativas</h3>
        </div>
        <div class="canonika-metric-value">{{ metrics.activeSimulations }}</div>
        <p class="canonika-metric-label">Executando agora</p>
      </div>
      
      <div class="canonika-metric-card">
        <div class="canonika-metric-header">
          <div class="canonika-metric-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3 class="canonika-metric-title">Simulações Concluídas</h3>
        </div>
        <div class="canonika-metric-value">{{ metrics.completedSimulations }}</div>
        <p class="canonika-metric-label">Total finalizadas</p>
      </div>
      
      <div class="canonika-metric-card">
        <div class="canonika-metric-header">
          <div class="canonika-metric-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3 class="canonika-metric-title">Taxa de Sucesso</h3>
        </div>
        <div class="canonika-metric-value">{{ metrics.successRate }}%</div>
        <p class="canonika-metric-label">Eficiência do sistema</p>
      </div>
    </div>

    <!-- Status dos Sistemas e Atividade Recente -->
    <div class="canonika-system-grid">
      <!-- Status dos Sistemas -->
      <div class="canonika-system-card">
        <div class="canonika-system-card-header">
          <div class="canonika-system-card-icon">
            <i class="fas fa-server"></i>
          </div>
          <h3 class="canonika-system-card-title">Status dos Sistemas</h3>
        </div>
        <div class="canonika-system-list">
          <div 
            v-for="system in systemStatus" 
            :key="system.name"
            class="canonika-system-item"
            :class="system.status"
          >
            <div class="canonika-system-status-dot" :class="system.status"></div>
            <div class="canonika-system-info">
              <h4 class="canonika-system-name">{{ system.name }}</h4>
              <p class="canonika-system-description">{{ system.description }}</p>
            </div>
            <div class="canonika-system-port">{{ system.port }}</div>
          </div>
        </div>
      </div>

      <!-- Atividade Recente -->
      <div class="canonika-system-card">
        <div class="canonika-system-card-header">
          <div class="canonika-system-card-icon">
            <i class="fas fa-clock"></i>
          </div>
          <h3 class="canonika-system-card-title">Atividade Recente</h3>
        </div>
        <div class="canonika-activity-list">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id"
            class="canonika-activity-item"
          >
            <div class="canonika-activity-icon">
              <i :class="getActivityIcon(activity.type)"></i>
            </div>
            <div class="canonika-activity-content">
              <h4 class="canonika-activity-title">{{ activity.title }}</h4>
              <p class="canonika-activity-description">{{ activity.description }}</p>
              <small class="canonika-activity-time">{{ formatTime(activity.timestamp) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fontes Mais Utilizadas -->
    <div class="canonika-system-grid">
      <div class="canonika-system-card">
        <div class="canonika-system-card-header">
          <div class="canonika-system-card-icon">
            <i class="fas fa-star"></i>
          </div>
          <h3 class="canonika-system-card-title">Fontes Mais Utilizadas</h3>
        </div>
        <div class="canonika-sources-grid">
          <div 
            v-for="source in topSources" 
            :key="source.id"
            class="canonika-source-item"
          >
            <div class="canonika-source-header">
              <div class="canonika-source-icon">
                <i :class="getSourceIcon(source.name)"></i>
              </div>
              <div class="canonika-source-info">
                <h4 class="canonika-source-name">{{ source.name }}</h4>
                <div class="canonika-source-type">
                  <span class="canonika-badge" :class="getTypeBadgeClass(source.type)">
                    {{ getTypeText(source.type) }}
                  </span>
                </div>
                <div class="canonika-source-stats">
                  <span class="canonika-source-usage">{{ source.usageCount }} usos</span>
                  <span class="canonika-source-rate">{{ source.successRate }}% sucesso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações Rápidas -->
    <div class="canonika-actions-grid">
      <div class="canonika-action-card" @click="navigateToSimulation">
        <div class="canonika-action-icon">
          <i class="fas fa-search"></i>
        </div>
        <h4 class="canonika-action-title">Nova Simulação</h4>
        <p class="canonika-action-description">Iniciar pesquisa de produto</p>
      </div>
      
      <div class="canonika-action-card" @click="navigateToSources">
        <div class="canonika-action-icon">
          <i class="fas fa-database"></i>
        </div>
        <h4 class="canonika-action-title">Gerenciar Fontes</h4>
        <p class="canonika-action-description">Configurar fontes de dados</p>
      </div>
      
      <div class="canonika-action-card" @click="viewLogs">
        <div class="canonika-action-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <h4 class="canonika-action-title">Ver Logs</h4>
        <p class="canonika-action-description">Histórico de atividades</p>
      </div>
      
      <div class="canonika-action-card" @click="exportData">
        <div class="canonika-action-icon">
          <i class="fas fa-download"></i>
        </div>
        <h4 class="canonika-action-title">Exportar Dados</h4>
        <p class="canonika-action-description">Baixar relatórios</p>
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

