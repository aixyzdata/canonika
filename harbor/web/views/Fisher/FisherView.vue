<template>
  <div class="fisher-container">
    <!-- Header -->
    <div class="fisher-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-fish"></i>
        </div>
        <div class="header-text">
          <h1>🎣 Fisher</h1>
          <p>Tripulante de Pesca de Dados</p>
        </div>
      </div>
    </div>

    <!-- Tabs de Navegação -->
    <div class="fisher-tabs">
      <button 
        @click="activeTab = 'missions'" 
        :class="['tab-btn', { active: activeTab === 'missions' }]"
      >
        <i class="fas fa-rocket"></i>
        Missões
      </button>
      <button 
        @click="activeTab = 'sources'" 
        :class="['tab-btn', { active: activeTab === 'sources' }]"
      >
        <i class="fas fa-database"></i>
        Fontes
      </button>
      <button 
        @click="activeTab = 'history'" 
        :class="['tab-btn', { active: activeTab === 'history' }]"
      >
        <i class="fas fa-history"></i>
        Histórico
      </button>
    </div>

    <!-- Conteúdo das Tabs -->
    <div class="fisher-content">
      
      <!-- Tab Missões -->
      <div v-if="activeTab === 'missions'" class="tab-content">
        <div class="missions-section">
          <h3>🚀 Executar Missão de Pesca</h3>
          <p class="section-description">
            Execute missões para baixar e processar dados de fontes externas
          </p>
          
          <form @submit.prevent="executeMission" class="mission-form">
            <div class="form-row">
              <div class="form-group">
                <label for="source">Fonte de Dados</label>
                <select
                  id="source"
                  v-model="missionForm.source"
                  class="form-control"
                  :disabled="isLoading"
                >
                  <option value="">Selecione uma fonte...</option>
                  <option value="receita-federal">Receita Federal - CNPJs</option>
                  <option value="open-food-facts">Open Food Facts</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="missionType">Tipo de Missão</label>
                <select
                  id="missionType"
                  v-model="missionForm.missionType"
                  class="form-control"
                  :disabled="isLoading"
                >
                  <option value="incremental">Incremental (Apenas atualizações)</option>
                  <option value="full">Completa (Todos os dados)</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!missionForm.source || isLoading"
              >
                <i class="fas fa-rocket"></i>
                {{ isLoading ? 'Executando...' : '🚀 Executar Missão' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tab Fontes -->
      <div v-if="activeTab === 'sources'" class="tab-content">
        <div class="sources-section">
          <h3>📊 Fontes de Dados Disponíveis</h3>
          <p class="section-description">
            Fontes externas suportadas para pesca de dados
          </p>
          
          <div class="sources-grid">
            <div v-for="source in sources" :key="source.id" class="source-card">
              <div class="source-header">
                <h4>{{ source.name }}</h4>
                <span class="source-frequency">{{ source.update_frequency }}</span>
              </div>
              
              <div class="source-description">
                <p>{{ source.description }}</p>
              </div>
              
              <div class="source-details">
                <div class="detail-row">
                  <span class="detail-label">Última Atualização:</span>
                  <span class="detail-value">{{ formatDate(source.last_update) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Frequência:</span>
                  <span class="detail-value">{{ source.update_frequency }}</span>
                </div>
              </div>
              
              <div class="source-actions">
                <button @click="executeMissionForSource(source.id)" class="btn btn-secondary">
                  <i class="fas fa-download"></i>
                  Baixar Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Histórico -->
      <div v-if="activeTab === 'history'" class="tab-content">
        <div class="history-section">
          <h3>📋 Histórico de Execuções</h3>
          <p class="section-description">
            Registro das últimas missões executadas
          </p>
          
          <div class="history-list">
            <div v-for="execution in executionHistory" :key="execution.start_time" class="execution-card">
              <div class="execution-header">
                <h4>{{ execution.source }}</h4>
                <span :class="['status-badge', execution.status]">{{ execution.status }}</span>
              </div>
              
              <div class="execution-details">
                <div class="detail-row">
                  <span class="detail-label">Tipo:</span>
                  <span class="detail-value">{{ execution.mission_type }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Início:</span>
                  <span class="detail-value">{{ formatDate(execution.start_time) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duração:</span>
                  <span class="detail-value">{{ execution.duration_seconds.toFixed(2) }}s</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Registros:</span>
                  <span class="detail-value">{{ execution.records_processed }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Arquivos:</span>
                  <span class="detail-value">{{ execution.files_downloaded }}</span>
                </div>
              </div>
              
              <div v-if="execution.errors && execution.errors.length > 0" class="execution-errors">
                <h5>Erros:</h5>
                <ul>
                  <li v-for="error in execution.errors" :key="error">{{ error }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultado da Missão -->
    <div v-if="missionResult" class="fisher-results">
      <div class="results-header">
        <h3>📊 Resultado da Missão</h3>
        <button @click="clearMissionResult" class="btn btn-secondary">
          <i class="fas fa-times"></i>
          Fechar
        </button>
      </div>

      <div class="result-content">
        <div class="result-section">
          <h4>Informações Gerais</h4>
          <div class="result-details">
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span :class="['status-badge', missionResult.status]">{{ missionResult.status }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fonte:</span>
              <span class="detail-value">{{ missionResult.source }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tipo:</span>
              <span class="detail-value">{{ missionResult.mission_type }}</span>
            </div>
          </div>
        </div>

        <div v-if="missionResult.results" class="result-section">
          <h4>Resultados Detalhados</h4>
          <div class="result-details">
            <div class="detail-row">
              <span class="detail-label">Arquivos Baixados:</span>
              <span class="detail-value">{{ missionResult.results.files_downloaded }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Registros Processados:</span>
              <span class="detail-value">{{ missionResult.results.records_processed }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Arquivos de Saída:</span>
              <span class="detail-value">{{ missionResult.results.output_files.length }}</span>
            </div>
          </div>

          <div v-if="missionResult.results.output_files.length > 0" class="output-files">
            <h5>Arquivos Gerados:</h5>
            <ul>
              <li v-for="file in missionResult.results.output_files" :key="file">{{ file }}</li>
            </ul>
          </div>
        </div>

        <div v-if="missionResult.error" class="error-section">
          <div class="error-card">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>Erro na Missão</h4>
            <p>{{ missionResult.error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>🎣 Pesca de dados em andamento...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FisherView',
  data() {
    return {
      activeTab: 'missions',
      isLoading: false,
      missionForm: {
        source: '',
        missionType: 'incremental'
      },
      sources: [],
      executionHistory: [],
      missionResult: null,
      apiBaseUrl: 'http://localhost:7724'
    }
  },
  async mounted() {
    await this.loadSources()
    await this.loadExecutionHistory()
  },
  methods: {
    async executeMission() {
      if (!this.missionForm.source) return;
      
      this.isLoading = true;
      this.missionResult = null;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/fisher/mission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: this.missionForm.source,
            mission_type: this.missionForm.missionType
          })
        });
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }
        
        this.missionResult = await response.json();
        
        // Recarregar histórico após missão
        await this.loadExecutionHistory();
        
      } catch (error) {
        console.error('Erro na missão:', error);
        this.missionResult = {
          status: 'error',
          error: `Erro na missão: ${error.message}`
        };
      } finally {
        this.isLoading = false;
      }
    },

    async executeMissionForSource(sourceId) {
      this.missionForm.source = sourceId;
      await this.executeMission();
    },

    async loadSources() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/fisher/sources`);
        if (response.ok) {
          const data = await response.json();
          this.sources = data.sources;
        }
      } catch (error) {
        console.error('Erro carregando fontes:', error);
      }
    },

    async loadExecutionHistory() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/fisher/history`);
        if (response.ok) {
          this.executionHistory = await response.json();
        }
      } catch (error) {
        console.error('Erro carregando histórico:', error);
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString('pt-BR');
    },

    clearMissionResult() {
      this.missionResult = null;
    }
  }
}
</script>

<style scoped>
.fisher-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.fisher-header {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 3rem;
  opacity: 0.9;
}

.header-text h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-text p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.fisher-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
}

.tab-btn:hover {
  background: rgba(15, 23, 42, 0.7);
  transform: translateY(-2px);
}

.tab-btn.active {
  background: #10b981;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.fisher-content {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.tab-content {
  max-width: 1000px;
  margin: 0 auto;
}

.missions-section h3,
.sources-section h3,
.history-section h3 {
  margin: 0 0 1rem 0;
  color: #e2e8f0;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-description {
  color: #94a3b8;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.form-row {
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.9rem;
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
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
  background: rgba(15, 23, 42, 0.7) !important;
}

.form-actions {
  margin-top: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
}

.btn-secondary:hover {
  background: rgba(15, 23, 42, 0.7);
}

.sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.source-card {
  background: rgba(15, 23, 42, 0.7);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #475569;
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.source-header h4 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.1rem;
  font-weight: 600;
}

.source-frequency {
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.source-description {
  margin-bottom: 1.5rem;
}

.source-description p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.9rem;
}

.source-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.detail-label {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

.detail-value {
  color: #e2e8f0;
  font-size: 0.9rem;
}

.source-actions {
  display: flex;
  justify-content: flex-end;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.execution-card {
  background: rgba(15, 23, 42, 0.7);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #475569;
}

.execution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #475569;
}

.execution-header h4 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.success {
  background: #10b981;
  color: white;
}

.status-badge.error {
  background: #ef4444;
  color: white;
}

.status-badge.skipped {
  background: #f59e0b;
  color: white;
}

.execution-details {
  margin-bottom: 1rem;
}

.execution-errors {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
}

.execution-errors h5 {
  margin: 0 0 0.5rem 0;
  color: #fca5a5;
  font-size: 0.9rem;
}

.execution-errors ul {
  margin: 0;
  padding-left: 1rem;
  color: #fca5a5;
  font-size: 0.8rem;
}

.fisher-results {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 1rem;
  padding: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.results-header h3 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.5rem;
  font-weight: 600;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.result-section h4 {
  color: #e2e8f0;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.output-files {
  margin-top: 1rem;
}

.output-files h5 {
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.output-files ul {
  margin: 0;
  padding-left: 1rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.error-section {
  margin-top: 2rem;
}

.error-card {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  color: #fca5a5;
}

.error-card i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-card h4 {
  margin: 0 0 0.5rem 0;
  color: #fca5a5;
}

.error-card p {
  margin: 0;
  color: #fca5a5;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: #e2e8f0;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #475569;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .fisher-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .fisher-tabs {
    flex-direction: column;
  }
  
  .sources-grid {
    grid-template-columns: 1fr;
  }
}
</style> 