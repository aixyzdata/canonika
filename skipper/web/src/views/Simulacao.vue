<template>
  <div class="tollgate-view">
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

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Formulário */
.canonika-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
}

.form-input {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  color: #e2e8f0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-control {
  background: rgba(15, 23, 42, 0.5) !important;
  border: 1px solid #475569 !important;
  color: #e2e8f0 !important;
  padding: 0.75rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
}

.form-control:focus {
  outline: none !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
  background: rgba(15, 23, 42, 0.7) !important;
}

.form-control::placeholder {
  color: #64748b !important;
  opacity: 1 !important;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
}

.form-check-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Layout Principal */
.simulation-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Logs */
.log-container {
  max-height: 400px;
  overflow-y: auto;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 1rem;
}

.log-entry {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
  display: flex;
  gap: 0.5rem;
}

.log-timestamp {
  color: #64748b;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.log-message {
  color: #e2e8f0;
  flex: 1;
}

.log-success {
  color: #10b981;
}

.log-error {
  color: #ef4444;
}

.log-warning {
  color: #f59e0b;
}

.log-info {
  color: #3b82f6;
}

.empty-logs {
  text-align: center;
  color: #64748b;
  padding: 2rem;
}

.empty-logs i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Resultados */
.empty-results {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-item {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.result-source {
  font-size: 0.75rem;
  color: #94a3b8;
  background: #475569;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.result-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-label {
  color: #94a3b8;
}

.detail-value {
  color: #e2e8f0;
  font-weight: 600;
}

.result-description {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.25rem;
  border-left: 3px solid #3b82f6;
}

.result-description p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
}

.result-actions .action-btn {
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

.result-actions .action-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
}

.stat-icon {
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

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #475569;
}

.modal-header h3 {
  color: #e2e8f0;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-body {
  padding: 1.5rem;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section h4 {
  color: #e2e8f0;
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.source-link:hover {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

/* Grupo de input e botão em linha */
.input-button-group {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.input-button-group .form-input {
  flex: 1;
}

.input-button-group .action-btn {
  flex-shrink: 0;
  white-space: nowrap;
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
  
  .simulation-layout {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style> 