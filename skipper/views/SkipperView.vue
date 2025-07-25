<template>
  <div class="skipper-view">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-center mb-3">
            <i class="fas fa-ship me-3"></i>
            Skipper - Orquestrador de Navegação
          </h1>
          <p class="text-center text-muted">
            Pesquisa e extração inteligente de dados de produtos
          </p>
        </div>
      </div>

      <!-- Cards de Funcionalidades -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-search fa-3x text-primary mb-3"></i>
              <h5 class="card-title">Simulação de Pesquisa</h5>
              <p class="card-text">
                Teste a extração de dados de produtos em tempo real com logs detalhados
              </p>
              <button @click="goToSimulation" class="btn btn-primary">
                <i class="fas fa-play me-2"></i>
                Iniciar Simulação
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-database fa-3x text-success mb-3"></i>
              <h5 class="card-title">Gerenciar Fontes</h5>
              <p class="card-text">
                Configure fontes de pesquisa, prompts e parâmetros de extração
              </p>
              <button @click="goToSources" class="btn btn-success">
                <i class="fas fa-cog me-2"></i>
                Configurar Fontes
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-chart-line fa-3x text-info mb-3"></i>
              <h5 class="card-title">Estatísticas</h5>
              <p class="card-text">
                Visualize métricas de performance e resultados das extrações
              </p>
              <button @click="showStats" class="btn btn-info">
                <i class="fas fa-chart-bar me-2"></i>
                Ver Estatísticas
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Status dos Serviços -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-server me-2"></i>
                Status dos Serviços
              </h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-2">
                  <div class="d-flex align-items-center">
                    <div class="status-indicator bg-success me-2"></div>
                    <span>API Skipper</span>
                  </div>
                </div>
                <div class="col-md-3 mb-2">
                  <div class="d-flex align-items-center">
                    <div class="status-indicator bg-success me-2"></div>
                    <span>PostgreSQL</span>
                  </div>
                </div>
                <div class="col-md-3 mb-2">
                  <div class="d-flex align-items-center">
                    <div class="status-indicator bg-success me-2"></div>
                    <span>Redis</span>
                  </div>
                </div>
                <div class="col-md-3 mb-2">
                  <div class="d-flex align-items-center">
                    <div class="status-indicator bg-success me-2"></div>
                    <span>Milvus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Últimas Simulações -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-history me-2"></i>
                Últimas Simulações
              </h6>
            </div>
            <div class="card-body">
              <div v-if="recentSimulations.length === 0" class="text-center text-muted">
                <i class="fas fa-inbox fa-2x mb-3"></i>
                <p>Nenhuma simulação realizada ainda</p>
              </div>
              <div v-else>
                <div
                  v-for="simulation in recentSimulations"
                  :key="simulation.id"
                  class="simulation-item mb-3 p-3 border rounded"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">{{ simulation.product_name }}</h6>
                      <small class="text-muted">
                        {{ formatDate(simulation.created_at) }}
                      </small>
                    </div>
                    <div>
                      <span class="badge" :class="getStatusClass(simulation.status)">
                        {{ getStatusText(simulation.status) }}
                      </span>
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
  name: 'SkipperView',
  data() {
    return {
      recentSimulations: []
    }
  },
  mounted() {
    this.loadRecentSimulations()
  },
  methods: {
    goToSimulation() {
      // Navega para a página de simulação
      window.open('/simulation', '_blank')
    },
    
    goToSources() {
      // Navega para a página de fontes
      window.open('/sources', '_blank')
    },
    
    showStats() {
      // Mostra estatísticas (implementar futuramente)
      alert('Funcionalidade de estatísticas será implementada em breve!')
    },
    
    async loadRecentSimulations() {
      // Mock de simulações recentes
      this.recentSimulations = [
        {
          id: '1',
          product_name: 'iPhone 15 Pro',
          status: 'completed',
          created_at: new Date()
        },
        {
          id: '2',
          product_name: 'Samsung Galaxy S24',
          status: 'running',
          created_at: new Date(Date.now() - 60000)
        }
      ]
    },
    
    formatDate(date) {
      return new Date(date).toLocaleString('pt-BR')
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'running':
          return 'bg-warning'
        case 'completed':
          return 'bg-success'
        case 'error':
          return 'bg-danger'
        default:
          return 'bg-secondary'
      }
    },
    
    getStatusText(status) {
      switch (status) {
        case 'running':
          return 'Executando'
        case 'completed':
          return 'Concluído'
        case 'error':
          return 'Erro'
        default:
          return 'Desconhecido'
      }
    }
  }
}
</script>

<style scoped>
.skipper-view {
  min-height: calc(100vh - 200px);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.simulation-item {
  background: rgba(255, 255, 255, 0.05);
  transition: background-color 0.3s ease;
}

.simulation-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.btn {
  border-radius: 8px;
  font-weight: 500;
}

.text-primary {
  color: var(--canonika-green) !important;
}

.text-success {
  color: #28a745 !important;
}

.text-info {
  color: #17a2b8 !important;
}
</style>
