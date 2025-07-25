<template>
  <div class="view-container">
    <!-- Header da Simulação -->
    <div class="canonika-page-header">
      <div class="canonika-page-header-content">
        <div class="canonika-page-header-text">
          <div class="canonika-section-title">
            <i class="fas fa-search canonika-section-icon"></i>
            <h2 class="canonika-h2">Simulação de Pesquisa</h2>
          </div>
          <p class="canonika-subtitle">
            Pesquise produtos em múltiplas fontes e extraia atributos estruturados
          </p>
        </div>
        <div class="canonika-page-header-actions">
          <button 
            @click="refreshSources" 
            class="canonika-btn canonika-btn-outline"
            :disabled="loading"
          >
            <i class="fas fa-sync-alt"></i>
            Atualizar Fontes
          </button>
        </div>
      </div>
    </div>

    <!-- Formulário de Pesquisa -->
    <div class="canonika-mb-xl">
      <div class="canonika-card">
        <div class="canonika-card-header">
          <div class="canonika-section-title">
            <i class="fas fa-cog canonika-section-icon"></i>
            <h3 class="canonika-h3">Configuração da Simulação</h3>
          </div>
        </div>
        
        <form @submit.prevent="startSimulation" class="canonika-form">
          <!-- Campo de Produto -->
          <div class="canonika-form-group">
            <label for="productName" class="canonika-form-label">
              <i class="fas fa-box"></i>
              Nome do Produto
            </label>
            <input
              v-model="simulationForm.productName"
              type="text"
              class="canonika-form-input"
              id="productName"
              placeholder="Ex: iPhone 15, Samsung Galaxy, etc."
              required
              :disabled="simulationRunning"
            >
          </div>

          <!-- Configuração de Fontes -->
          <div class="canonika-form-group">
            <label class="canonika-form-label">
              <i class="fas fa-database"></i>
              Configuração de Fontes
            </label>
            <div class="canonika-flex canonika-flex-gap-lg">
              <div class="canonika-form-check">
                <input
                  v-model="simulationForm.autoSelectSources"
                  class="canonika-form-check-input"
                  type="radio"
                  id="autoSelect"
                  value="true"
                  :disabled="simulationRunning"
                >
                <label class="canonika-form-check-label" for="autoSelect">
                  Seleção Automática
                </label>
              </div>
              <div class="canonika-form-check">
                <input
                  v-model="simulationForm.autoSelectSources"
                  class="canonika-form-check-input"
                  type="radio"
                  id="manualSelect"
                  value="false"
                  :disabled="simulationRunning"
                >
                <label class="canonika-form-check-label" for="manualSelect">
                  Seleção Manual
                </label>
              </div>
            </div>
          </div>

          <!-- Seleção Manual de Fontes -->
          <div v-if="!simulationForm.autoSelectSources" class="canonika-form-group">
            <label class="canonika-form-label">
              <i class="fas fa-list"></i>
              Fontes Disponíveis
            </label>
            <div class="canonika-sources-grid">
              <div 
                v-for="source in availableSources" 
                :key="source.id"
                class="canonika-source-item"
              >
                <div class="canonika-form-check">
                  <input
                    v-model="simulationForm.selectedSources"
                    class="canonika-form-check-input"
                    type="checkbox"
                    :value="source.id"
                    :id="`source-${source.id}`"
                    :disabled="simulationRunning"
                  >
                  <label class="canonika-form-check-label" :for="`source-${source.id}`">
                    <i :class="getSourceIcon(source.name)"></i>
                    <span class="source-name">{{ source.name }}</span>
                    <span class="canonika-badge canonika-badge-info">{{ source.type }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Botão de Ação -->
          <div class="canonika-form-actions">
            <button 
              type="submit" 
              class="canonika-btn canonika-btn-primary canonika-btn-lg"
              :disabled="simulationRunning || loading"
            >
              <i class="fas fa-play"></i>
              {{ simulationRunning ? 'Executando...' : 'Iniciar Simulação' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Painel de Logs em Tempo Real -->
    <div v-if="currentSimulation" class="canonika-mb-xl">
      <div class="canonika-card">
        <div class="canonika-card-header">
          <div class="canonika-section-title">
            <i class="fas fa-terminal canonika-section-icon"></i>
            <h3 class="canonika-h3">Logs de Execução</h3>
          </div>
          <div class="canonika-flex canonika-flex-gap-sm">
            <span class="canonika-badge" :class="getStatusBadgeClass(currentSimulation.status)">
              {{ currentSimulation.status }}
            </span>
            <button @click="clearLogs" class="canonika-btn canonika-btn-outline canonika-btn-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="canonika-card-body">
          <div class="canonika-log-container">
            <div 
              v-for="log in simulationLogs" 
              :key="log.timestamp"
              class="canonika-log-entry"
              :class="getLogEntryClass(log)"
            >
              <div class="canonika-log-header">
                <span class="canonika-log-timestamp">{{ formatTime(log.timestamp) }}</span>
                <span class="canonika-log-agent">{{ log.agent_type.toUpperCase() }}</span>
                <span class="canonika-log-source">{{ log.source_name }}</span>
                <span class="canonika-log-status" :class="`status-${log.status}`">
                  {{ log.status }}
                </span>
              </div>
              <div class="canonika-log-message">{{ log.message }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultados da Simulação -->
    <div v-if="currentSimulation && currentSimulation.status === 'completed'" class="canonika-mb-xl">
      <div class="canonika-card">
        <div class="canonika-card-header">
          <div class="canonika-section-title">
            <i class="fas fa-chart-bar canonika-section-icon"></i>
            <h3 class="canonika-h3">Resultados Consolidados</h3>
          </div>
        </div>
        
        <div class="canonika-card-body">
          <!-- Produto Consolidado -->
          <div class="canonika-mb-xl">
            <div class="canonika-section-subheader">
              <h4 class="canonika-h4">Produto Final</h4>
              <p class="canonika-text-sm">Dados consolidados de todas as fontes</p>
            </div>
            <div class="canonika-consolidated-product">
              <div class="canonika-attributes-grid">
                <div 
                  v-for="(value, key) in currentSimulation.consolidated_product" 
                  :key="key"
                  class="canonika-attribute-item"
                >
                  <span class="canonika-attribute-label">{{ formatAttributeName(key) }}:</span>
                  <span class="canonika-attribute-value">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Resultados por Fonte -->
          <div>
            <div class="canonika-section-subheader">
              <h4 class="canonika-h4">Resultados por Fonte</h4>
              <p class="canonika-text-sm">Dados extraídos de cada fonte individual</p>
            </div>
            <div class="canonika-results-grid">
              <div 
                v-for="(result, sourceName) in currentSimulation.results" 
                :key="sourceName"
                class="canonika-source-result-card"
              >
                <div class="canonika-source-header">
                  <h5 class="canonika-h5">{{ sourceName }}</h5>
                  <span class="canonika-confidence-score">
                    {{ (result.score_confianca * 100).toFixed(0) }}%
                  </span>
                </div>
                <div class="canonika-source-attributes">
                  <div 
                    v-for="(value, key) in result" 
                    :key="key"
                    v-if="key !== 'score_confianca'"
                    class="canonika-attribute-item"
                  >
                    <span class="canonika-attribute-label">{{ formatAttributeName(key) }}:</span>
                    <span class="canonika-attribute-value">{{ value }}</span>
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
        'running': 'canonika-badge-warning',
        'completed': 'canonika-badge-success',
        'failed': 'canonika-badge-error'
      }
      return classes[status] || 'canonika-badge-info'
    },

    getLogEntryClass(log) {
      return {
        'canonika-log-entry': true,
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
/* Estilos específicos da view de simulação */
.view-container {
  padding: var(--canonika-spacing-lg) 0;
}

/* Melhorias específicas para a view de simulação */
.canonika-form-group {
  margin-bottom: var(--canonika-spacing-lg);
}

.canonika-form-group:last-child {
  margin-bottom: 0;
}

/* Melhor espaçamento para campos de formulário */
.canonika-form-input {
  margin-top: var(--canonika-spacing-xs);
}

/* Melhor alinhamento para checkboxes de fontes */
.canonika-form-check {
  margin-bottom: var(--canonika-spacing-sm);
}

.canonika-form-check:last-child {
  margin-bottom: 0;
}

/* Melhor contraste para textos de descrição */
.canonika-text-sm {
  opacity: 0.8;
}

/* Melhor espaçamento para seções */
.canonika-mb-xl {
  margin-bottom: var(--canonika-spacing-2xl);
}

/* Melhor responsividade para mobile */
@media (max-width: 768px) {
  .view-container {
    padding: var(--canonika-spacing-md) 0;
  }
  
  .canonika-form-group {
    margin-bottom: var(--canonika-spacing-md);
  }
  
  .canonika-mb-xl {
    margin-bottom: var(--canonika-spacing-xl);
  }
}
</style> 