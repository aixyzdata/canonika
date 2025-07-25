<template>
  <div class="simulation-view">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-search"></i>
        Simulação de Pesquisa
      </h1>
      <p class="page-subtitle">
        Orquestrador de Navegação e Extração de Dados
      </p>
    </div>

    <!-- Formulário de Pesquisa -->
    <div class="simulation-form">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-cog"></i>
            Configuração da Pesquisa
          </h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="startSimulation" class="canonika-form">
            <div class="form-row">
              <div class="form-group">
                <label for="productName" class="form-label">Nome do Produto</label>
                <input
                  type="text"
                  class="form-input"
                  id="productName"
                  v-model="productName"
                  placeholder="Ex: iPhone 15, Samsung Galaxy, etc."
                >
              </div>
              
              <div class="form-group">
                <label for="maxResults" class="form-label">Máximo de Resultados por Fonte</label>
                <input
                  type="number"
                  class="form-input"
                  id="maxResults"
                  v-model="maxResults"
                  min="1"
                  max="10"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="autoSelectSources"
                    v-model="autoSelectSources"
                  >
                  <label class="form-check-label" for="autoSelectSources">
                    Selecionar automaticamente as melhores fontes
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <button
                  @click="startSimulation"
                  :disabled="!productName || isRunning"
                  class="canonika-btn canonika-btn-primary"
                >
                  <i class="fas fa-search"></i>
                  {{ isRunning ? 'Pesquisando...' : '🔍 Pesquisar' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Layout Principal -->
    <div class="simulation-layout">
      <!-- Painel de Logs -->
      <div class="logs-panel">
        <div class="canonika-card">
          <div class="card-header">
            <h6 class="card-title">
              <i class="fas fa-terminal"></i>
              Logs em Tempo Real
            </h6>
          </div>
          <div class="card-body">
            <div class="log-container">
              <div
                v-for="(log, index) in logs"
                :key="index"
                class="log-entry"
              >
                {{ log }}
              </div>
              <div v-if="logs.length === 0" class="text-muted text-center">
                Nenhum log disponível
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div class="results-panel">
        <div v-if="currentSimulation" class="canonika-card">
          <div class="card-header">
            <h6 class="card-title">
              <i class="fas fa-chart-bar"></i>
              Resultados da Simulação
            </h6>
          </div>
          <div class="card-body">
            <!-- Status da Simulação -->
            <div class="simulation-status">
              <span class="status-indicator" :class="getStatusClass(currentSimulation.status)">
                {{ getStatusText(currentSimulation.status) }}
              </span>
              <small class="text-muted">
                ID: {{ currentSimulation.id }}
              </small>
            </div>

            <!-- Resultados por Fonte -->
            <div v-if="currentSimulation.sources_results" class="sources-results">
              <h6>Resultados por Fonte:</h6>
              <div class="results-grid">
                <div
                  v-for="(result, sourceName) in currentSimulation.sources_results"
                  :key="sourceName"
                  class="result-card"
                >
                  <div class="canonika-card">
                    <div class="card-header">
                      <h6 class="card-title">{{ sourceName }}</h6>
                    </div>
                    <div class="card-body">
                      <div v-if="result.attributes">
                        <div class="result-item">
                          <strong>Nome:</strong> {{ result.attributes.nome }}
                        </div>
                        <div class="result-item">
                          <strong>Marca:</strong> {{ result.attributes.marca }}
                        </div>
                        <div class="result-item">
                          <strong>Preço:</strong> {{ result.attributes.preco }}
                        </div>
                        <div class="result-item">
                          <strong>Confiança:</strong>
                          <span :class="getConfidenceClass(result.confidence)">
                            {{ (result.confidence * 100).toFixed(1) }}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Produto Consolidado -->
            <div v-if="currentSimulation.consolidated_product" class="consolidated-product">
              <h6>Produto Consolidado:</h6>
              <div class="canonika-card">
                <div class="card-body">
                  <div class="product-info">
                    <div class="info-column">
                      <div class="info-item">
                        <strong>Nome:</strong> {{ currentSimulation.consolidated_product.nome }}
                      </div>
                      <div class="info-item">
                        <strong>Marca:</strong> {{ currentSimulation.consolidated_product.marca }}
                      </div>
                      <div class="info-item">
                        <strong>Preço:</strong> {{ currentSimulation.consolidated_product.preco }}
                      </div>
                    </div>
                    <div class="info-column">
                      <div class="info-item">
                        <strong>Confiança Global:</strong>
                        <span :class="getConfidenceClass(currentSimulation.consolidated_product.confianca_global)">
                          {{ (currentSimulation.consolidated_product.confianca_global * 100).toFixed(1) }}%
                        </span>
                      </div>
                      <div class="info-item">
                        <strong>Fontes Consultadas:</strong> {{ currentSimulation.consolidated_product.fontes_consultadas }}
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="currentSimulation.consolidated_product.descricao" class="product-description">
                    <strong>Descrição:</strong>
                    <p>{{ currentSimulation.consolidated_product.descricao }}</p>
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
import axios from 'axios'

export default {
  name: 'SimulationView',
  data() {
    return {
      productName: '',
      maxResults: 5,
      autoSelectSources: true,
      isRunning: false,
      currentSimulation: null,
      logs: [],
      logInterval: null
    }
  },
  methods: {
    async startSimulation() {
      if (!this.productName) {
        alert('Por favor, insira o nome do produto')
        return
      }

      this.isRunning = true
      this.logs = []
      this.currentSimulation = null

      try {
        // Inicia simulação
        const response = await axios.post('/api/simulation', {
          product_name: this.productName,
          auto_select_sources: this.autoSelectSources,
          max_results_per_source: this.maxResults
        })

        this.currentSimulation = response.data

        // Inicia polling de logs
        this.startLogPolling(response.data.id)

        // Inicia polling de resultados
        this.startResultPolling(response.data.id)

      } catch (error) {
        console.error('Erro ao iniciar simulação:', error)
        this.logs.push('❌ Erro ao iniciar simulação')
        this.isRunning = false
      }
    },

    startLogPolling(simulationId) {
      this.logInterval = setInterval(async () => {
        try {
          const response = await axios.get(`/api/simulation/${simulationId}/logs`)
          this.logs = response.data.logs
        } catch (error) {
          console.error('Erro ao buscar logs:', error)
        }
      }, 1000)
    },

    async startResultPolling(simulationId) {
      const pollResults = async () => {
        try {
          const response = await axios.get(`/api/simulation/${simulationId}`)
          this.currentSimulation = response.data

          if (response.data.status === 'completed' || response.data.status === 'error') {
            this.isRunning = false
            if (this.logInterval) {
              clearInterval(this.logInterval)
            }
          } else {
            // Continua polling
            setTimeout(pollResults, 2000)
          }
        } catch (error) {
          console.error('Erro ao buscar resultados:', error)
          this.isRunning = false
        }
      }

      pollResults()
    },

    getStatusClass(status) {
      switch (status) {
        case 'running':
          return 'status-running'
        case 'completed':
          return 'status-completed'
        case 'error':
          return 'status-error'
        default:
          return 'status-unknown'
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
    },

    getConfidenceClass(confidence) {
      if (confidence >= 0.7) {
        return 'confidence-high'
      } else if (confidence >= 0.4) {
        return 'confidence-medium'
      } else {
        return 'confidence-low'
      }
    }
  },

  beforeUnmount() {
    if (this.logInterval) {
      clearInterval(this.logInterval)
    }
  }
}
</script>

<style scoped>
.simulation-view {
  min-height: calc(100vh - 200px);
  padding: 2rem;
}

.simulation-form {
  margin-bottom: 2rem;
}

.simulation-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.logs-panel {
  height: fit-content;
}

.log-container {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  max-height: 400px;
  overflow-y: auto;
}

.log-entry {
  font-size: 0.8em;
  word-break: break-word;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--canonika-light-gray);
}

.simulation-status {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--canonika-light-gray);
  border-radius: var(--canonika-border-radius);
}

.status-indicator {
  padding: 0.5rem 1rem;
  border-radius: var(--canonika-border-radius);
  font-weight: bold;
  margin-right: 1rem;
}

.status-running {
  background: var(--canonika-green);
  color: white;
}

.status-completed {
  background: #28a745;
  color: white;
}

.status-error {
  background: #dc3545;
  color: white;
}

.status-unknown {
  background: var(--canonika-gray);
  color: white;
}

.sources-results {
  margin-bottom: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.result-card {
  min-height: 200px;
}

.result-item {
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
}

.consolidated-product {
  margin-top: 2rem;
}

.product-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1rem;
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  padding: 0.5rem;
  background: var(--canonika-light-gray);
  border-radius: var(--canonika-border-radius);
}

.product-description {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--canonika-light-gray);
  border-radius: var(--canonika-border-radius);
}

.confidence-high {
  color: #28a745;
  font-weight: bold;
}

.confidence-medium {
  color: #ffc107;
  font-weight: bold;
}

.confidence-low {
  color: #dc3545;
  font-weight: bold;
}

@media (max-width: 768px) {
  .simulation-layout {
    grid-template-columns: 1fr;
  }
  
  .product-info {
    grid-template-columns: 1fr;
  }
}
</style> 