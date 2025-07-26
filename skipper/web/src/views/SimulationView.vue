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
          <!-- Campo de Produto e Botão em Linha -->
          <div class="canonika-form-group">
            <label for="productName" class="canonika-form-label">
              <i class="fas fa-box"></i>
              Nome do Produto
            </label>
            <div class="canonika-input-button-group">
              <input
                v-model="simulationForm.productName"
                type="text"
                class="canonika-form-input"
                id="productName"
                placeholder="Ex: iPhone 15, Samsung Galaxy, etc."
                required
                :disabled="simulationRunning"
              >
              <button 
                type="submit" 
                class="canonika-btn canonika-btn-primary canonika-btn-lg"
                :disabled="simulationRunning || loading"
              >
                <i class="fas fa-play"></i>
                {{ simulationRunning ? 'Executando...' : 'Pesquisar' }}
              </button>
            </div>
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

          <!-- Máximo de Resultados por Fonte -->
          <div class="canonika-form-group">
            <label for="maxResults" class="canonika-form-label">
              <i class="fas fa-chart-bar"></i>
              Máximo de Resultados por Fonte
            </label>
            <input
              v-model="simulationForm.maxResults"
              type="number"
              class="canonika-form-input"
              id="maxResults"
              min="1"
              max="10"
              :disabled="simulationRunning"
            >
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
        </form>
      </div>
    </div>

    <!-- Aviso de API Offline -->
    <div v-if="apiOffline" class="canonika-mb-xl">
      <div class="canonika-card canonika-card-warning">
        <div class="canonika-card-header">
          <div class="canonika-section-title">
            <i class="fas fa-exclamation-triangle canonika-section-icon"></i>
            <h3 class="canonika-h3">API Offline</h3>
          </div>
        </div>
        <div class="canonika-card-body">
          <p>A API do Skipper não está disponível. Executando em modo de demonstração com dados simulados.</p>
          <button @click="checkApiStatus" class="canonika-btn canonika-btn-outline">
            <i class="fas fa-sync-alt"></i>
            Verificar API
          </button>
        </div>
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
      apiOffline: false,
      availableSources: [],
      currentSimulation: null,
      simulationLogs: [],
      simulationForm: {
        productName: '',
        autoSelectSources: true,
        selectedSources: [],
        maxResults: 3
      },
      logPollingInterval: null,
      // Dados simulados para quando a API estiver offline
      mockSources: [
        { id: 1, name: 'Amazon', type: 'marketplace' },
        { id: 2, name: 'Mercado Livre', type: 'marketplace' },
        { id: 3, name: 'Google Shopping', type: 'buscador' }
      ],
      mockProducts: {
        'iphone': [
          {
            nome: 'iPhone 15 Pro Max 256GB',
            marca: 'Apple',
            preco: 'R$ 8.999,00',
            descricao: 'iPhone 15 Pro Max com chip A17 Pro, câmera tripla de 48MP',
            categoria: 'Smartphone',
            especificacoes: 'Chip A17 Pro, 256GB, 6.7", 48MP + 12MP + 12MP, iOS 17',
            disponibilidade: 'Em estoque',
            dimensoes: '159.9 x 76.7 x 8.25 mm',
            peso: '221g',
            score_confianca: 0.95
          }
        ],
        'samsung': [
          {
            nome: 'Samsung Galaxy S24 Ultra 256GB',
            marca: 'Samsung',
            preco: 'R$ 9.499,00',
            descricao: 'Samsung Galaxy S24 Ultra com chip Snapdragon 8 Gen 3',
            categoria: 'Smartphone',
            especificacoes: 'Snapdragon 8 Gen 3, 256GB, 6.8", 200MP + 12MP + 50MP + 10MP',
            disponibilidade: 'Em estoque',
            dimensoes: '163.4 x 79.0 x 8.6 mm',
            peso: '232g',
            score_confianca: 0.94
          }
        ],
        'macbook': [
          {
            nome: 'MacBook Pro 14" M3 Pro 512GB',
            marca: 'Apple',
            preco: 'R$ 18.999,00',
            descricao: 'MacBook Pro 14 polegadas com chip M3 Pro',
            categoria: 'Notebook',
            especificacoes: 'Chip M3 Pro, 512GB SSD, 18GB RAM, 14" Liquid Retina XDR',
            disponibilidade: 'Em estoque',
            dimensoes: '312.6 x 221.2 x 15.5 mm',
            peso: '1.55kg',
            score_confianca: 0.96
          }
        ]
      }
    }
  },
  async mounted() {
    await this.checkApiStatus()
    await this.loadSources()
  },
  beforeUnmount() {
    if (this.logPollingInterval) {
      clearInterval(this.logPollingInterval)
    }
  },
  methods: {
    async checkApiStatus() {
      try {
        const response = await axios.get('/api/health', { timeout: 3000 })
        this.apiOffline = false
        return true
      } catch (error) {
        this.apiOffline = true
        return false
      }
    },

    async loadSources() {
      try {
        this.loading = true
        if (this.apiOffline) {
          // Usar dados simulados
          this.availableSources = this.mockSources
        } else {
          const response = await axios.get('/api/sources')
          this.availableSources = response.data
        }
      } catch (error) {
        console.error('Erro ao carregar fontes:', error)
        this.apiOffline = true
        this.availableSources = this.mockSources
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
        
        if (this.apiOffline) {
          // Executar simulação local
          await this.runLocalSimulation()
        } else {
          // Executar simulação via API
          await this.runApiSimulation()
        }
        
      } catch (error) {
        console.error('Erro ao iniciar simulação:', error)
        alert('Erro ao iniciar simulação. Verifique o console para mais detalhes.')
      } finally {
        this.simulationRunning = false
      }
    },

    async runApiSimulation() {
      const requestData = {
        product_name: this.simulationForm.productName,
        auto_select_sources: this.simulationForm.autoSelectSources,
        sources: this.simulationForm.autoSelectSources ? null : this.simulationForm.selectedSources
      }

      const response = await axios.post('/api/simulation', requestData)
      this.currentSimulation = response.data
      
      // Iniciar polling de logs
      this.startLogPolling()
    },

    async runLocalSimulation() {
      const simulationId = `local_${Date.now()}`
      
      // Criar simulação inicial
      this.currentSimulation = {
        id: simulationId,
        product_name: this.simulationForm.productName,
        sources_used: this.simulationForm.autoSelectSources 
          ? ['Amazon', 'Mercado Livre', 'Google Shopping']
          : this.simulationForm.selectedSources.map(id => 
              this.availableSources.find(s => s.id === id)?.name
            ).filter(Boolean),
        results: {},
        consolidated_product: {},
        status: 'running',
        created_at: new Date().toISOString()
      }

      // Simular logs e resultados
      await this.simulateLocalExecution(simulationId)
    },

    async simulateLocalExecution(simulationId) {
      const sources = this.currentSimulation.sources_used
      const results = {}

      // Simular execução para cada fonte
      for (const sourceName of sources) {
        // Log de início
        await this.addLog(simulationId, 'search', sourceName, 'started', 
          `Buscando '${this.simulationForm.productName}' em ${sourceName}`)
        
        await this.delay(1000)
        
        await this.addLog(simulationId, 'search', sourceName, 'completed', 
          `Busca concluída em ${sourceName}`)
        
        await this.addLog(simulationId, 'navigation', sourceName, 'started', 
          `Navegando páginas de produtos em ${sourceName}`)
        
        await this.delay(1500)
        
        await this.addLog(simulationId, 'navigation', sourceName, 'completed', 
          `Navegação concluída em ${sourceName}`)
        
        await this.addLog(simulationId, 'extraction', sourceName, 'started', 
          `Extraindo atributos em ${sourceName}`)
        
        await this.delay(1000)
        
        // Gerar dados simulados
        const productKey = this.simulationForm.productName.toLowerCase().split(' ')[0]
        const mockData = this.mockProducts[productKey] || this.mockProducts.iphone
        
        if (mockData.length > 0) {
          const product = { ...mockData[0] }
          product.source = sourceName
          product.url = `https://${sourceName.toLowerCase().replace(' ', '')}.com/${this.simulationForm.productName.toLowerCase().replace(' ', '-')}`
          
          // Variações de preço por fonte
          const priceVariations = {
            'Amazon': 1.0,
            'Mercado Livre': 0.95,
            'Google Shopping': 0.98
          }
          
          if (sourceName in priceVariations) {
            const originalPrice = parseFloat(product.preco.replace('R$ ', '').replace('.', '').replace(',', '.'))
            const newPrice = originalPrice * priceVariations[sourceName]
            product.preco = `R$ ${newPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
          
          results[sourceName] = product
          
          await this.addLog(simulationId, 'extraction', sourceName, 'completed', 
            `Extração concluída em ${sourceName} - ${Object.keys(product).length} atributos extraídos`)
        } else {
          await this.addLog(simulationId, 'extraction', sourceName, 'failed', 
            `Nenhum produto encontrado em ${sourceName}`)
        }
      }

      // Consolidar resultados
      if (Object.keys(results).length > 0) {
        const consolidated = this.consolidateResults(results)
        
        this.currentSimulation.results = results
        this.currentSimulation.consolidated_product = consolidated
        this.currentSimulation.status = 'completed'
        this.currentSimulation.completed_at = new Date().toISOString()
        
        await this.addLog(simulationId, 'system', 'Skipper', 'completed', 
          `Simulação concluída com sucesso - ${Object.keys(results).length} fontes processadas`)
      } else {
        this.currentSimulation.status = 'failed'
        await this.addLog(simulationId, 'system', 'Skipper', 'failed', 
          'Nenhum resultado obtido das fontes')
      }
    },

    async addLog(simulationId, agentType, sourceName, status, message) {
      const log = {
        simulation_id: simulationId,
        agent_type: agentType,
        source_name: sourceName,
        status: status,
        message: message,
        timestamp: new Date().toISOString()
      }
      
      this.simulationLogs.push(log)
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    consolidateResults(results) {
      if (!results || Object.keys(results).length === 0) {
        return {}
      }

      // Encontrar o melhor resultado baseado no score de confiança
      const bestResult = Object.values(results).reduce((best, current) => 
        current.score_confianca > best.score_confianca ? current : best
      )

      const consolidated = {
        nome: bestResult.nome || '',
        marca: bestResult.marca || '',
        preco: bestResult.preco || '',
        descricao: bestResult.descricao || '',
        categoria: bestResult.categoria || '',
        especificacoes: bestResult.especificacoes || '',
        disponibilidade: bestResult.disponibilidade || '',
        dimensoes: bestResult.dimensoes || '',
        peso: bestResult.peso || '',
        score_global: Object.values(results).reduce((sum, r) => sum + (r.score_confianca || 0), 0) / Object.keys(results).length,
        fontes_consultadas: Object.keys(results),
        atributos_por_fonte: results
      }

      return consolidated
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
        'disponibilidade': 'Disponibilidade',
        'especificacoes': 'Especificações',
        'dimensoes': 'Dimensões',
        'peso': 'Peso',
        'score_global': 'Score Global',
        'fontes_consultadas': 'Fontes Consultadas'
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

/* Grupo de input e botão em linha */
.canonika-input-button-group {
  display: flex;
  gap: var(--canonika-spacing-md);
  align-items: flex-end;
}

.canonika-input-button-group .canonika-form-input {
  flex: 1;
  margin-top: var(--canonika-spacing-xs);
}

.canonika-input-button-group .canonika-btn {
  flex-shrink: 0;
  white-space: nowrap;
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

/* Card de aviso */
.canonika-card-warning {
  border-color: var(--canonika-color-warning);
  background-color: var(--canonika-color-warning-light);
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

  .canonika-input-button-group {
    flex-direction: column;
    gap: var(--canonika-spacing-sm);
  }

  .canonika-input-button-group .canonika-btn {
    width: 100%;
  }
}
</style> 