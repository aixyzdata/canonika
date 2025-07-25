<template>
  <div class="simulation-view">
    <!-- Header da Simulação -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="canonika-card p-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h2 class="mb-2">
                <i class="fas fa-search me-2"></i>
                Simulação de Pesquisa
              </h2>
              <p class="text-muted mb-0">
                Pesquise produtos em múltiplas fontes e extraia atributos estruturados
              </p>
            </div>
            <div class="col-md-4 text-end">
              <div class="d-flex justify-content-end gap-2">
                <button 
                  @click="refreshSources" 
                  class="btn btn-outline-light"
                  :disabled="loading"
                >
                  <i class="fas fa-sync-alt me-1"></i>
                  Atualizar Fontes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulário de Pesquisa -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="canonika-card p-4">
          <form @submit.prevent="startSimulation">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="productName" class="form-label">
                    <i class="fas fa-box me-2"></i>
                    Nome do Produto
                  </label>
                  <input
                    v-model="simulationForm.productName"
                    type="text"
                    class="form-control"
                    id="productName"
                    placeholder="Ex: iPhone 15, Samsung Galaxy, etc."
                    required
                    :disabled="simulationRunning"
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">
                    <i class="fas fa-cog me-2"></i>
                    Configuração de Fontes
                  </label>
                  <div class="d-flex gap-2">
                    <div class="form-check">
                      <input
                        v-model="simulationForm.autoSelectSources"
                        class="form-check-input"
                        type="radio"
                        id="autoSelect"
                        value="true"
                        :disabled="simulationRunning"
                      >
                      <label class="form-check-label" for="autoSelect">
                        Seleção Automática
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        v-model="simulationForm.autoSelectSources"
                        class="form-check-input"
                        type="radio"
                        id="manualSelect"
                        value="false"
                        :disabled="simulationRunning"
                      >
                      <label class="form-check-label" for="manualSelect">
                        Seleção Manual
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Seleção Manual de Fontes -->
            <div v-if="!simulationForm.autoSelectSources" class="row mb-3">
              <div class="col-12">
                <label class="form-label">
                  <i class="fas fa-database me-2"></i>
                  Fontes Disponíveis
                </label>
                <div class="row">
                  <div 
                    v-for="source in availableSources" 
                    :key="source.id"
                    class="col-md-4 mb-2"
                  >
                    <div class="form-check">
                      <input
                        v-model="simulationForm.selectedSources"
                        class="form-check-input"
                        type="checkbox"
                        :value="source.id"
                        :id="`source-${source.id}`"
                        :disabled="simulationRunning"
                      >
                      <label class="form-check-label" :for="`source-${source.id}`">
                        <i :class="getSourceIcon(source.name)" class="me-1"></i>
                        {{ source.name }}
                        <span class="badge bg-secondary ms-1">{{ source.type }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button 
                type="submit" 
                class="btn btn-canonika-primary btn-lg"
                :disabled="simulationRunning || loading"
              >
                <i class="fas fa-play me-2"></i>
                {{ simulationRunning ? 'Executando...' : 'Iniciar Simulação' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Painel de Logs em Tempo Real -->
    <div v-if="currentSimulation" class="row mb-4">
      <div class="col-12">
        <div class="canonika-card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">
              <i class="fas fa-terminal me-2"></i>
              Logs de Execução
            </h4>
            <div class="d-flex gap-2">
              <span class="badge" :class="getStatusBadgeClass(currentSimulation.status)">
                {{ currentSimulation.status }}
              </span>
              <button @click="clearLogs" class="btn btn-sm btn-outline-light">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div class="log-container">
            <div 
              v-for="log in simulationLogs" 
              :key="log.timestamp"
              class="log-entry"
              :class="getLogEntryClass(log)"
            >
              <div class="log-header">
                <span class="log-timestamp">{{ formatTime(log.timestamp) }}</span>
                <span class="log-agent">{{ log.agent_type.toUpperCase() }}</span>
                <span class="log-source">{{ log.source_name }}</span>
                <span class="log-status" :class="`status-${log.status}`">
                  {{ log.status }}
                </span>
              </div>
              <div class="log-message">{{ log.message }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultados da Simulação -->
    <div v-if="currentSimulation && currentSimulation.status === 'completed'" class="row">
      <div class="col-12">
        <div class="canonika-card p-4">
          <h4 class="mb-3">
            <i class="fas fa-chart-bar me-2"></i>
            Resultados Consolidados
          </h4>
          
          <!-- Produto Consolidado -->
          <div class="row mb-4">
            <div class="col-12">
              <h5>Produto Final</h5>
              <div class="consolidated-product">
                <div class="row">
                  <div 
                    v-for="(value, key) in currentSimulation.consolidated_product" 
                    :key="key"
                    class="col-md-6 mb-2"
                  >
                    <div class="attribute-item">
                      <span class="attribute-label">{{ formatAttributeName(key) }}:</span>
                      <span class="attribute-value">{{ value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resultados por Fonte -->
          <div class="row">
            <div class="col-12">
              <h5>Resultados por Fonte</h5>
              <div class="row">
                <div 
                  v-for="(result, sourceName) in currentSimulation.results" 
                  :key="sourceName"
                  class="col-md-6 mb-3"
                >
                  <div class="source-result-card">
                    <div class="source-header">
                      <h6>{{ sourceName }}</h6>
                      <span class="confidence-score">
                        {{ (result.score_confianca * 100).toFixed(0) }}%
                      </span>
                    </div>
                    <div class="source-attributes">
                      <div 
                        v-for="(value, key) in result" 
                        :key="key"
                        v-if="key !== 'score_confianca'"
                        class="attribute-item"
                      >
                        <span class="attribute-label">{{ formatAttributeName(key) }}:</span>
                        <span class="attribute-value">{{ value }}</span>
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SimulationView',
  data() {
    return {
      loading: false,
      simulationRunning: false,
      availableSources: [],
      currentSimulation: null,
      simulationLogs: [],
      simulationForm: {
        productName: '',
        autoSelectSources: true,
        selectedSources: []
      },
      logPollingInterval: null
    }
  },
  async mounted() {
    await this.loadSources()
  },
  beforeUnmount() {
    if (this.logPollingInterval) {
      clearInterval(this.logPollingInterval)
    }
  },
  methods: {
    async loadSources() {
      try {
        this.loading = true
        const response = await axios.get('/api/sources')
        this.availableSources = response.data
      } catch (error) {
        console.error('Erro ao carregar fontes:', error)
      } finally {
        this.loading = false
      }
    },

    async refreshSources() {
      await this.loadSources()
    },

    async startSimulation() {
      try {
        this.simulationRunning = true
        this.simulationLogs = []
        
        const requestData = {
          product_name: this.simulationForm.productName,
          auto_select_sources: this.simulationForm.autoSelectSources,
          sources: this.simulationForm.autoSelectSources ? null : this.simulationForm.selectedSources
        }

        const response = await axios.post('/api/simulation', requestData)
        this.currentSimulation = response.data
        
        // Iniciar polling de logs
        this.startLogPolling()
        
      } catch (error) {
        console.error('Erro ao iniciar simulação:', error)
        alert('Erro ao iniciar simulação. Verifique o console para mais detalhes.')
      } finally {
        this.simulationRunning = false
      }
    },

    async startLogPolling() {
      if (this.logPollingInterval) {
        clearInterval(this.logPollingInterval)
      }

      this.logPollingInterval = setInterval(async () => {
        if (!this.currentSimulation) return

        try {
          // Atualizar status da simulação
          const simulationResponse = await axios.get(`/api/simulation/${this.currentSimulation.id}`)
          this.currentSimulation = simulationResponse.data

          // Buscar logs
          const logsResponse = await axios.get(`/api/simulation/${this.currentSimulation.id}/logs`)
          this.simulationLogs = logsResponse.data

          // Parar polling se simulação terminou
          if (this.currentSimulation.status === 'completed' || this.currentSimulation.status === 'failed') {
            clearInterval(this.logPollingInterval)
            this.logPollingInterval = null
          }
        } catch (error) {
          console.error('Erro ao buscar logs:', error)
        }
      }, 1000)
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

    getStatusBadgeClass(status) {
      const classes = {
        'running': 'bg-warning',
        'completed': 'bg-success',
        'failed': 'bg-danger'
      }
      return classes[status] || 'bg-secondary'
    },

    getLogEntryClass(log) {
      return {
        'log-entry': true,
        [`log-${log.agent_type}`]: true,
        [`log-status-${log.status}`]: true
      }
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString()
    },

    formatAttributeName(key) {
      const names = {
        'nome': 'Nome',
        'marca': 'Marca',
        'preco': 'Preço',
        'descricao': 'Descrição',
        'categoria': 'Categoria',
        'disponibilidade': 'Disponibilidade'
      }
      return names[key] || key.charAt(0).toUpperCase() + key.slice(1)
    },

    clearLogs() {
      this.simulationLogs = []
    }
  }
}
</script>

<style scoped>
.simulation-view {
  padding: 1rem 0;
}

.log-container {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.log-entry {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid #666;
}

.log-entry.log-search {
  border-left-color: #007bff;
}

.log-entry.log-navigation {
  border-left-color: #28a745;
}

.log-entry.log-extraction {
  border-left-color: #ffc107;
}

.log-header {
  display: flex;
  gap: 10px;
  margin-bottom: 4px;
  font-size: 0.75rem;
}

.log-timestamp {
  color: #888;
}

.log-agent {
  font-weight: bold;
  color: #007bff;
}

.log-source {
  color: #28a745;
}

.log-status {
  font-weight: bold;
}

.log-status.status-started {
  color: #ffc107;
}

.log-status.status-completed {
  color: #28a745;
}

.log-status.status-failed {
  color: #dc3545;
}

.log-message {
  color: #e2e8f0;
}

.consolidated-product {
  background: rgba(0, 123, 255, 0.1);
  border: 1px solid rgba(0, 123, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
}

.source-result-card {
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.2);
  border-radius: 8px;
  padding: 15px;
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.confidence-score {
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.attribute-label {
  font-weight: 600;
  color: #94a3b8;
}

.attribute-value {
  color: #e2e8f0;
}

.form-control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--canonika-green);
  color: #e2e8f0;
  box-shadow: 0 0 0 0.2rem rgba(0, 191, 166, 0.25);
}

.form-check-input:checked {
  background-color: var(--canonika-green);
  border-color: var(--canonika-green);
}

.form-label {
  color: #e2e8f0;
  font-weight: 600;
}

.form-check-label {
  color: #e2e8f0;
}
</style> 