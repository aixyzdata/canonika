<template>
  <div class="simulacao-view">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-chart-line"></i>
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
            </div>
          </div>
        </div>
      </div>

      <!-- Painel de Resultados -->
      <div class="results-panel">
        <div class="canonika-card">
          <div class="card-header">
            <h6 class="card-title">
              <i class="fas fa-list"></i>
              Resultados da Pesquisa
            </h6>
          </div>
          <div class="card-body">
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
                  <h6 class="result-title">{{ result.title }}</h6>
                  <span class="result-source">{{ result.source }}</span>
                </div>
                <div class="result-details">
                  <div class="detail-item">
                    <span class="detail-label">Preço:</span>
                    <span class="detail-value">{{ result.price }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Avaliação:</span>
                    <span class="detail-value">{{ result.rating }}/5</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Disponibilidade:</span>
                    <span class="detail-value">{{ result.availability }}</span>
                  </div>
                </div>
                <div class="result-actions">
                  <button @click="viewProduct(result)" class="action-btn">
                    <i class="fas fa-external-link-alt"></i>
                  </button>
                  <button @click="saveProduct(result)" class="action-btn">
                    <i class="fas fa-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estatísticas da Simulação -->
    <div class="simulation-stats">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-chart-bar"></i>
            Estatísticas da Simulação
          </h5>
        </div>
        <div class="card-body">
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
      logs: [
        '🚀 Iniciando simulação de pesquisa...',
        '📡 Conectando com fontes de dados...',
        '✅ Amazon conectada com sucesso',
        '✅ Mercado Livre conectada com sucesso',
        '✅ Americanas conectada com sucesso',
        '🔍 Pesquisando produtos...',
        '📊 Processando resultados...'
      ],
      results: [
        {
          id: 1,
          title: 'iPhone 15 Pro Max 256GB',
          source: 'Amazon',
          price: 'R$ 8.999,00',
          rating: 4.8,
          availability: 'Em estoque'
        },
        {
          id: 2,
          title: 'iPhone 15 Pro 128GB',
          source: 'Mercado Livre',
          price: 'R$ 7.499,00',
          rating: 4.6,
          availability: 'Em estoque'
        },
        {
          id: 3,
          title: 'iPhone 15 128GB',
          source: 'Americanas',
          price: 'R$ 6.999,00',
          rating: 4.5,
          availability: 'Em estoque'
        }
      ],
      stats: {
        sourcesChecked: 3,
        productsFound: 12,
        duration: '2m 15s',
        successRate: 95
      }
    }
  },
  methods: {
    startSimulation() {
      if (!this.productName) return;
      
      this.isRunning = true;
      this.logs = ['🚀 Iniciando simulação de pesquisa...'];
      
      // Simular processo de pesquisa
      setTimeout(() => {
        this.logs.push('📡 Conectando com fontes de dados...');
      }, 1000);
      
      setTimeout(() => {
        this.logs.push('✅ Amazon conectada com sucesso');
      }, 2000);
      
      setTimeout(() => {
        this.logs.push('✅ Mercado Livre conectada com sucesso');
      }, 3000);
      
      setTimeout(() => {
        this.logs.push('✅ Americanas conectada com sucesso');
      }, 4000);
      
      setTimeout(() => {
        this.logs.push('🔍 Pesquisando produtos...');
      }, 5000);
      
      setTimeout(() => {
        this.logs.push('📊 Processando resultados...');
        this.isRunning = false;
      }, 6000);
    },
    viewProduct(product) {
      console.log(`Visualizando produto: ${product.title}`);
    },
    saveProduct(product) {
      console.log(`Salvando produto: ${product.title}`);
    }
  }
}
</script>

<style scoped>
.simulacao-view {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  color: #94a3b8;
  margin: 0;
}

.simulation-form {
  margin-bottom: 2rem;
}

.canonika-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
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
}

.form-check-label {
  font-size: 0.875rem;
  color: #e2e8f0;
}

.canonika-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.canonika-btn-primary {
  background: #3b82f6;
  color: white;
}

.canonika-btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.canonika-btn-primary:disabled {
  background: #64748b;
  cursor: not-allowed;
}

.simulation-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.log-container {
  max-height: 400px;
  overflow-y: auto;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.25rem;
  padding: 1rem;
}

.log-entry {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
}

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

.result-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
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

.action-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.simulation-stats {
  margin-bottom: 2rem;
}

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

@media (max-width: 768px) {
  .simulation-layout {
    grid-template-columns: 1fr;
  }
}
</style> 