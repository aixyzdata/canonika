<template>
  <div class="canonika-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-chart-line"></i>
        <div class="title-content">
          <h1>Simulação de Pesquisa</h1>
          <p>Orquestrador de Navegação e Extração de Dados</p>
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
      </div>
    </div>

    <div class="view-content">
      <!-- Configuração da Pesquisa -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Configuração da Pesquisa</h3>
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
          </div>
          <div class="card-content">
            <form @submit.prevent="startSimulation" class="canonika-form">
              <div class="row align-items-start">
                <!-- Nome do Produto + Checkbox -->
                <div class="col-sm-6 mb-2">
                  <label for="productName" class="form-label">Nome do Produto</label>
                  <input
                    type="text"
                    class="form-control mb-2"
                    id="productName"
                    v-model="productName"
                    placeholder="Ex: iPhone 15, Samsung Galaxy, etc."
                    :disabled="isRunning"
                  >
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="autoSelectSources"
                      v-model="autoSelectSources"
                      :disabled="isRunning"
                    >
                    <label class="form-check-label" for="autoSelectSources">
                      Selecionar automaticamente as melhores fontes
                    </label>
                  </div>
                </div>
                <!-- Máximo de Resultados -->
                <div class="col-sm-3 mb-2">
                  <label for="maxResults" class="form-label">Máximo de Resultados</label>
                  <input
                    type="number"
                    class="form-control"
                    id="maxResults"
                    v-model="maxResults"
                    min="1"
                    max="10"
                    :disabled="isRunning"
                  >
                </div>
                <!-- Botão Pesquisar -->
                <div class="col-sm-3 mb-2 d-flex align-items-center justify-content-center h-100">
                  <button type="submit" :disabled="!productName || isRunning" class="btn btn-primary w-100 mt-3">
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
        <div class="service-cards">
          <div class="service-card">
            <div class="card-header">
              <h3>Logs em Tempo Real</h3>
              <div class="card-icon">
                <i class="fas fa-terminal"></i>
              </div>
            </div>
            <div class="card-content">
              <div class="log-container">
                <div
                  v-for="(log, index) in logs"
                  :key="index"
                  class="log-entry"
                  :class="getLogClass(log.status)"
                >
                  <span class="log-timestamp">{{ formatTimestamp(log.timestamp) }}</span>
                  <span class="log-message">{{ log.message }}</span>
                </div>
                <div v-if="logs.length === 0" class="empty-logs">
                  <i class="fas fa-info-circle"></i>
                  <p>Nenhum log disponível</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Painel de Resultados -->
        <div class="service-cards">
          <div class="service-card">
            <div class="card-header">
              <h3>Resultados da Pesquisa</h3>
              <div class="card-icon">
                <i class="fas fa-list"></i>
              </div>
            </div>
            <div class="card-content">
              <div v-if="results.length === 0" class="empty-results">
                <i class="fas fa-search"></i>
                <p>Nenhum resultado encontrado</p>
              </div>
              
              <div v-else class="results-list">
                <div
                  v-for="result in results"
                  :key="result.id"
                  class="result-item"
                >
                  <div class="result-header">
                    <h6 class="result-title">{{ result.nome || result.title }}</h6>
                    <span class="result-source">{{ result.source || result.source_name }}</span>
                  </div>
                  <div class="result-details">
                    <div class="detail-item" v-if="result.preco">
                      <span class="detail-label">Preço:</span>
                      <span class="detail-value">{{ result.preco }}</span>
                    </div>
                    <div class="detail-item" v-if="result.marca">
                      <span class="detail-label">Marca:</span>
                      <span class="detail-value">{{ result.marca }}</span>
                    </div>
                    <div class="detail-item" v-if="result.categoria">
                      <span class="detail-label">Categoria:</span>
                      <span class="detail-value">{{ result.categoria }}</span>
                    </div>
                    <div class="detail-item" v-if="result.disponibilidade">
                      <span class="detail-label">Disponibilidade:</span>
                      <span class="detail-value">{{ result.disponibilidade }}</span>
                    </div>
                    <div class="detail-item" v-if="result.score_confianca">
                      <span class="detail-label">Confiança:</span>
                      <span class="detail-value">{{ (result.score_confianca * 100).toFixed(1) }}%</span>
                    </div>
                  </div>
                  <div class="result-description" v-if="result.descricao">
                    <p>{{ result.descricao }}</p>
                  </div>
                  <div class="result-actions">
                    <button @click="viewProduct(result)" class="action-btn" title="Ver Produto">
                      <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button @click="saveProduct(result)" class="action-btn" title="Salvar Produto">
                      <i class="fas fa-bookmark"></i>
                    </button>
                    <button @click="showDetails(result)" class="action-btn" title="Ver Detalhes">
                      <i class="fas fa-info-circle"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estatísticas da Simulação -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Estatísticas da Simulação</h3>
            <div class="card-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-search"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ stats.sourcesChecked }}</span>
                  <span class="stat-label">Fontes Verificadas</span>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-list"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ stats.productsFound }}</span>
                  <span class="stat-label">Produtos Encontrados</span>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ stats.duration }}</span>
                  <span class="stat-label">Tempo de Execução</span>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-percentage"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ stats.successRate }}%</span>
                  <span class="stat-label">Taxa de Sucesso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalhes do Produto</h3>
          <button @click="closeDetailsModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedProduct" class="product-details">
            <div class="detail-section">
              <h4>Informações Básicas</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Nome:</span>
                  <span class="detail-value">{{ selectedProduct.nome || selectedProduct.title }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Marca:</span>
                  <span class="detail-value">{{ selectedProduct.marca }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Preço:</span>
                  <span class="detail-value">{{ selectedProduct.preco }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Categoria:</span>
                  <span class="detail-value">{{ selectedProduct.categoria }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Disponibilidade:</span>
                  <span class="detail-value">{{ selectedProduct.disponibilidade }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Confiança:</span>
                  <span class="detail-value">{{ (selectedProduct.score_confianca * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedProduct.descricao">
              <h4>Descrição</h4>
              <p>{{ selectedProduct.descricao }}</p>
            </div>
            
            <div class="detail-section" v-if="selectedProduct.especificacoes">
              <h4>Especificações</h4>
              <p>{{ selectedProduct.especificacoes }}</p>
            </div>
            
            <div class="detail-section" v-if="selectedProduct.dimensoes || selectedProduct.peso">
              <h4>Dimensões e Peso</h4>
              <div class="detail-grid">
                <div class="detail-item" v-if="selectedProduct.dimensoes">
                  <span class="detail-label">Dimensões:</span>
                  <span class="detail-value">{{ selectedProduct.dimensoes }}</span>
                </div>
                <div class="detail-item" v-if="selectedProduct.peso">
                  <span class="detail-label">Peso:</span>
                  <span class="detail-value">{{ selectedProduct.peso }}</span>
                </div>
                <div class="detail-item" v-if="selectedProduct.volume">
                  <span class="detail-label">Volume:</span>
                  <span class="detail-value">{{ selectedProduct.volume }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedProduct.url">
              <h4>Fonte</h4>
              <a :href="selectedProduct.url" target="_blank" class="source-link">
                <i class="fas fa-external-link-alt"></i>
                Ver na fonte original
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkipperSimulacao',
  data() {
    return {
      productName: '',
      maxResults: 5,
      autoSelectSources: true,
      isRunning: false,
      currentSimulationId: null,
      logs: [],
      results: [],
      stats: {
        sourcesChecked: 0,
        productsFound: 0,
        duration: '0s',
        successRate: 0
      },
      showDetailsModal: false,
      selectedProduct: null,
      apiBaseUrl: 'http://localhost:7722/api'
    }
  },
  methods: {
    async refreshData() {
      console.log('Atualizando dados da simulação...');
      this.logs = [];
      this.results = [];
      this.resetStats();
    },
    
    async startSimulation() {
      if (!this.productName) return;
      
      this.isRunning = true;
      this.logs = [];
      this.results = [];
      this.resetStats();
      
      const startTime = Date.now();
      
      try {
        // Verificar se a API está disponível
        const apiOnline = await this.checkApiStatus();
        
        if (apiOnline) {
          // Usar API real
          await this.runApiSimulation(startTime);
        } else {
          // Usar simulação local
          await this.runLocalSimulation(startTime);
        }
        
      } catch (error) {
        console.error('Erro na simulação:', error);
        this.addLog(`❌ Erro: ${error.message}`, 'error');
        this.isRunning = false;
      }
    },

    async checkApiStatus() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/health`, { 
          method: 'GET',
          timeout: 3000 
        });
        return response.ok;
      } catch (error) {
        console.log('API offline, usando simulação local');
        return false;
      }
    },

    async runApiSimulation(startTime) {
      // Iniciar simulação na API
      const response = await fetch(`${this.apiBaseUrl}/api/simulation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: this.productName,
          auto_select_sources: this.autoSelectSources
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const simulation = await response.json();
      this.currentSimulationId = simulation.id;
      
      this.addLog('🚀 Iniciando simulação de pesquisa (API)...', 'info');
      this.addLog(`📦 Produto: ${this.productName}`, 'info');
      this.addLog(`🔗 ID da Simulação: ${simulation.id}`, 'info');
      
      // Processar resultados da simulação
      if (simulation.status === 'completed') {
        await this.processApiResults(simulation, startTime);
      } else {
        // Monitorar progresso da simulação
        await this.monitorSimulation(simulation.id, startTime);
      }
    },

    async processApiResults(simulation, startTime) {
      this.addLog('📊 Processando resultados da API...', 'info');
      
      // Processar resultados de cada fonte
      for (const [sourceName, result] of Object.entries(simulation.results)) {
        this.addLog(`🔍 Processando ${sourceName}...`, 'info');
        
        const attributes = result.attributes;
        const product = {
          nome: attributes.nome,
          marca: attributes.marca,
          preco: attributes.preco,
          categoria: attributes.categoria,
          disponibilidade: attributes.disponibilidade,
          avaliacao: attributes.avaliacao,
          num_avaliacoes: attributes.num_avaliacoes,
          score_confianca: attributes.score_confianca,
          fonte: sourceName,
          url: result.urls[0] || '#'
        };
        
        this.results.push(product);
        this.addLog(`✅ ${sourceName}: ${product.nome} - ${product.preco}`, 'success');
      }
      
      // Processar produto consolidado
      if (simulation.consolidated_product) {
        const consolidated = simulation.consolidated_product;
        this.consolidatedProduct = {
          nome: consolidated.nome,
          marca: consolidated.marca,
          preco: consolidated.preco,
          categoria: consolidated.categoria,
          disponibilidade: consolidated.disponibilidade,
          avaliacao: consolidated.avaliacao,
          num_avaliacoes: consolidated.num_avaliacoes,
          score_confianca: consolidated.score_confianca,
          fontes_consultadas: consolidated.fontes_consultadas
        };
      }
      
      // Atualizar estatísticas
      this.updateStats(startTime);
      this.isRunning = false;
      
      this.addLog('🎉 Simulação concluída com sucesso!', 'success');
    },

    async runLocalSimulation(startTime) {
      this.addLog('🚀 Iniciando simulação de pesquisa (Modo Offline)...', 'info');
      this.addLog(`📦 Produto: ${this.productName}`, 'info');
      this.addLog('⚠️ API offline - usando dados simulados', 'warning');
      
      // Simular fontes
      const sources = ['Amazon', 'Mercado Livre', 'Google Shopping'];
      
      for (const source of sources) {
        this.addLog(`🔍 Buscando em ${source}...`, 'info');
        await this.delay(1000);
        
        this.addLog(`📄 Navegando páginas em ${source}...`, 'info');
        await this.delay(1500);
        
        this.addLog(`📊 Extraindo dados de ${source}...`, 'info');
        await this.delay(1000);
        
        // Gerar dados simulados
        const mockProduct = this.generateMockProduct(source);
        this.results.push(mockProduct);
        
        this.addLog(`✅ ${source}: ${mockProduct.nome} - ${mockProduct.preco}`, 'success');
      }
      
      this.addLog('🎉 Simulação concluída com sucesso!', 'success');
      this.updateStats({ status: 'completed' }, startTime);
      this.isRunning = false;
    },

    generateMockProduct(source) {
      const productKey = this.productName.toLowerCase().split(' ')[0];
      const mockProducts = {
        'iphone': {
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
        },
        'samsung': {
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
        },
        'macbook': {
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
      };
      
      const baseProduct = mockProducts[productKey] || mockProducts.iphone;
      const product = { ...baseProduct };
      
      // Variações de preço por fonte
      const priceVariations = {
        'Amazon': 1.0,
        'Mercado Livre': 0.95,
        'Google Shopping': 0.98
      };
      
      if (source in priceVariations) {
        const originalPrice = parseFloat(product.preco.replace('R$ ', '').replace('.', '').replace(',', '.'))
        const newPrice = originalPrice * priceVariations[source];
        product.preco = `R$ ${newPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      }
      
      product.source = source;
      product.url = `https://${source.toLowerCase().replace(' ', '')}.com/${this.productName.toLowerCase().replace(' ', '-')}`;
      
      return product;
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    async monitorSimulation(simulationId, startTime) {
      const maxAttempts = 60; // 5 minutos máximo
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        try {
          // Verificar status da simulação
          const statusResponse = await fetch(`${this.apiBaseUrl}/simulation/${simulationId}`);
          const simulation = await statusResponse.json();
          
          // Obter logs atualizados
          const logsResponse = await fetch(`${this.apiBaseUrl}/simulation/${simulationId}/logs`);
          const apiLogs = await logsResponse.json();
          
          // Atualizar logs
          this.updateLogs(apiLogs);
          
          // Atualizar estatísticas
          this.updateStats(simulation, startTime);
          
          if (simulation.status === 'completed') {
            this.addLog('✅ Simulação concluída com sucesso!', 'success');
            this.processResults(simulation);
            break;
          } else if (simulation.status === 'failed') {
            this.addLog(`❌ Simulação falhou: ${simulation.error || 'Erro desconhecido'}`, 'error');
            break;
          }
          
          // Aguardar antes da próxima verificação
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
          
        } catch (error) {
          console.error('Erro ao monitorar simulação:', error);
          this.addLog(`❌ Erro ao monitorar: ${error.message}`, 'error');
          break;
        }
      }
      
      if (attempts >= maxAttempts) {
        this.addLog('⏰ Timeout: Simulação demorou muito para completar', 'warning');
      }
      
      this.isRunning = false;
    },
    
    updateLogs(apiLogs) {
      // Converter logs da API para formato local
      const newLogs = apiLogs.map(log => ({
        timestamp: new Date(log.timestamp),
        message: `[${log.agent_type.toUpperCase()}] ${log.source_name}: ${log.message}`,
        status: log.status
      }));
      
      // Adicionar apenas logs novos
      newLogs.forEach(newLog => {
        const exists = this.logs.some(log => 
          log.message === newLog.message && 
          log.timestamp.getTime() === newLog.timestamp.getTime()
        );
        
        if (!exists) {
          this.logs.push(newLog);
        }
      });
    },
    
    updateStats(simulation, startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      
      this.stats = {
        sourcesChecked: simulation.sources_used?.length || 0,
        productsFound: Object.keys(simulation.results || {}).length,
        duration: `${minutes}m ${seconds}s`,
        successRate: simulation.status === 'completed' ? 95 : 0
      };
    },
    
    processResults(simulation) {
      if (simulation.results) {
        this.results = Object.values(simulation.results).map((result, index) => ({
          id: index + 1,
          ...result
        }));
      }
      
      if (simulation.consolidated_product) {
        this.results.unshift({
          id: 'consolidated',
          ...simulation.consolidated_product,
          source: 'Resultado Consolidado'
        });
      }
    },
    
    addLog(message, status = 'info') {
      this.logs.push({
        timestamp: new Date(),
        message,
        status
      });
    },
    
    resetStats() {
      this.stats = {
        sourcesChecked: 0,
        productsFound: 0,
        duration: '0s',
        successRate: 0
      };
    },
    
    getLogClass(status) {
      return {
        'log-success': status === 'completed',
        'log-error': status === 'failed',
        'log-warning': status === 'warning',
        'log-info': status === 'info' || !status
      };
    },
    
    formatTimestamp(timestamp) {
      return timestamp.toLocaleTimeString('pt-BR');
    },
    
    viewProduct(product) {
      if (product.url) {
        window.open(product.url, '_blank');
      } else {
        this.showDetails(product);
      }
    },
    
    saveProduct(product) {
      console.log('Salvando produto:', product);
      // Implementar salvamento na base de dados
      this.addLog(`💾 Produto "${product.nome || product.title}" salvo`, 'success');
    },
    
    showDetails(product) {
      this.selectedProduct = product;
      this.showDetailsModal = true;
    },
    
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedProduct = null;
    }
  },
  
  mounted() {
    this.refreshData();
  }
}
</script>

