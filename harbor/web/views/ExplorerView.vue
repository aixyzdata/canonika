<template>
  <div class="tollgate-view">
    <div class="explorer-content">
      <!-- Logo e Título -->
      <div class="explorer-header">
        <div class="explorer-logo">
          <i class="fas fa-compass"></i>
          <span class="logo-text">Explorer</span>
        </div>
        <p class="explorer-subtitle">Pesquise informações canônicas de produtos e notas fiscais</p>
      </div>

      <!-- Barra de Pesquisa -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            class="search-input"
            placeholder="Digite o nome do produto, código da nota fiscal, XML da SEFAZ..."
          />
          <button @click="performSearch" class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- Upload de XML -->
      <div class="upload-section">
        <div class="upload-area" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
          <i class="fas fa-file-upload"></i>
          <p>Arraste um XML da SEFAZ aqui ou clique para selecionar</p>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept=".xml" style="display: none;" />
          <button @click="$refs.fileInput.click()" class="upload-button">Selecionar Arquivo</button>
        </div>
      </div>

      <!-- Filtros Avançados -->
      <div class="advanced-filters">
        <button @click="showAdvancedFilters = !showAdvancedFilters" class="advanced-button">
          <i class="fas fa-filter"></i>
          Filtros Avançados
        </button>
        
        <div v-if="showAdvancedFilters" class="filters-grid">
          <div class="filter-group">
            <label>Tipo de Busca:</label>
            <select v-model="searchType" class="filter-select">
              <option value="all">Todos os Tipos</option>
              <option value="product">Produtos</option>
              <option value="invoice">Notas Fiscais</option>
              <option value="code">Códigos</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Período:</label>
            <select v-model="period" class="filter-select">
              <option value="all">Todos os Períodos</option>
              <option value="today">Hoje</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="year">Último Ano</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Resultados da Pesquisa -->
      <div v-if="searchResults.length > 0" class="results-section">
        <div class="results-header">
          <h3>Resultados Encontrados ({{ searchResults.length }})</h3>
          <button @click="clearResults" class="clear-button">
            <i class="fas fa-times"></i>
            Limpar
          </button>
        </div>
        
        <div class="results-grid">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="service-card"
          >
            <div class="card-header">
              <div class="card-icon">
                <i :class="getResultIcon(result.type)"></i>
              </div>
              <div class="card-title">
                <h4>{{ result.title }}</h4>
                <span class="card-subtitle">{{ result.type }}</span>
              </div>
              <div class="card-actions">
                <button @click="viewDetails(result)" class="btn btn-sm btn-primary">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="downloadResult(result)" class="btn btn-sm btn-secondary">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
            
            <div class="card-content">
              <p class="card-description">{{ result.description }}</p>
              
              <div class="card-meta">
                <div class="meta-item">
                  <i class="fas fa-calendar"></i>
                  <span>{{ formatDate(result.date) }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-percentage"></i>
                  <span>Relevância: {{ result.score }}%</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-link"></i>
                  <span>{{ result.source }}</span>
                </div>
              </div>
              
              <div v-if="result.details" class="card-details">
                <div v-for="(value, key) in result.details" :key="key" class="detail-item">
                  <strong>{{ key }}:</strong> {{ value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notificação de Pesquisa em Andamento -->
      <div v-if="searchInProgress" class="notification-section">
        <div class="notification-card">
          <div class="notification-header">
            <i class="fas fa-search"></i>
            <h4>Pesquisa em Andamento</h4>
          </div>
          <p>Estamos buscando informações em nossa base de dados e fontes externas...</p>
          
          <div class="notification-options">
            <h5>Deseja ser notificado quando concluirmos?</h5>
            <div class="notification-buttons">
              <button @click="enableEmailNotification" class="btn btn-primary">
                <i class="fas fa-envelope"></i>
                Email
              </button>
              <button @click="enableWhatsAppNotification" class="btn btn-success">
                <i class="fab fa-whatsapp"></i>
                WhatsApp
              </button>
              <button @click="disableNotification" class="btn btn-secondary">
                <i class="fas fa-times"></i>
                Não notificar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Histórico de Pesquisas -->
      <div v-if="searchHistory.length > 0 && !searchResults.length" class="history-section">
        <h3>Pesquisas Recentes</h3>
        <div class="history-list">
          <div
            v-for="item in searchHistory"
            :key="item.id"
            @click="loadHistoryItem(item)"
            class="history-item"
          >
            <i class="fas fa-history"></i>
            <span>{{ item.query }}</span>
            <small class="history-date">{{ formatDate(item.date) }}</small>
          </div>
        </div>
      </div>

      <!-- Sugestões -->
      <div v-if="suggestions.length > 0 && !searchQuery && !searchResults.length" class="suggestions-section">
        <h3>Sugestões de Pesquisa</h3>
        <div class="suggestions-list">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            @click="loadSuggestion(suggestion)"
            class="suggestion-item"
          >
            <i class="fas fa-lightbulb"></i>
            <span>{{ suggestion.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExplorerView',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      searchHistory: [
        { id: 1, query: 'Nota Fiscal 123456', date: '2024-01-15' },
        { id: 2, query: 'Produto XYZ-789', date: '2024-01-14' },
        { id: 3, query: 'Código 987654', date: '2024-01-13' }
      ],
      suggestions: [
        { id: 1, text: 'Pesquisar por código de barras' },
        { id: 2, text: 'Buscar nota fiscal por número' },
        { id: 3, text: 'Consultar produto por nome' },
        { id: 4, text: 'Upload de XML da SEFAZ' }
      ],
      showAdvancedFilters: false,
      searchType: 'all',
      period: 'all',
      searchInProgress: false,
      notificationEnabled: false,
      notificationType: null
    }
  },
  methods: {
    performSearch() {
      if (!this.searchQuery.trim()) return
      
      this.searchInProgress = true
      this.searchResults = []
      
      // Simular pesquisa em base de dados
      setTimeout(() => {
        // Verificar se encontrou resultados
        const foundResults = this.searchInDatabase(this.searchQuery)
        
        if (foundResults.length > 0) {
          this.searchResults = foundResults
          this.addToHistory(this.searchQuery)
        } else {
          // Se não encontrou, iniciar pesquisa externa
          this.startExternalSearch()
        }
        
        this.searchInProgress = false
      }, 2000)
    },

    searchInDatabase(query) {
      // Simular busca na base de dados
      const mockResults = [
        {
          id: 1,
          title: 'Nota Fiscal 123456',
          type: 'Nota Fiscal',
          description: 'Nota fiscal eletrônica emitida em 15/01/2024',
          date: '2024-01-15',
          score: 95,
          source: 'Base Local',
          details: {
            'Número': '123456',
            'Emitente': 'Empresa ABC Ltda',
            'Valor': 'R$ 1.250,00',
            'Status': 'Aprovada'
          }
        },
        {
          id: 2,
          title: 'Produto XYZ-789',
          type: 'Produto',
          description: 'Produto cadastrado no sistema com código de barras',
          date: '2024-01-14',
          score: 88,
          source: 'Base Local',
          details: {
            'Código': 'XYZ-789',
            'Categoria': 'Eletrônicos',
            'Preço': 'R$ 299,90',
            'Estoque': '15 unidades'
          }
        }
      ]
      
      return mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      )
    },

    startExternalSearch() {
      this.searchInProgress = true
      
      // Simular pesquisa externa
      setTimeout(() => {
        this.searchInProgress = false
        
        // Mostrar opções de notificação
        this.notificationEnabled = true
      }, 3000)
    },

    handleFileDrop(event) {
      event.preventDefault()
      const files = event.dataTransfer.files
      if (files.length > 0) {
        this.processXMLFile(files[0])
      }
    },

    handleFileSelect(event) {
      const files = event.target.files
      if (files.length > 0) {
        this.processXMLFile(files[0])
      }
    },

    processXMLFile(file) {
      if (file.type !== 'text/xml' && !file.name.endsWith('.xml')) {
        alert('Por favor, selecione um arquivo XML válido.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const xmlContent = e.target.result
        this.extractDataFromXML(xmlContent)
      }
      reader.readAsText(file)
    },

    extractDataFromXML(xmlContent) {
      // Simular extração de dados do XML
      this.searchQuery = 'XML Processado - ' + new Date().toLocaleString()
      this.performSearch()
    },

    getResultIcon(type) {
      const icons = {
        'Nota Fiscal': 'fas fa-file-invoice',
        'Produto': 'fas fa-box',
        'Código': 'fas fa-barcode',
        'XML': 'fas fa-file-code'
      }
      return icons[type] || 'fas fa-file'
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR')
    },

    viewDetails(result) {
      // Implementar visualização detalhada
      console.log('Visualizar detalhes:', result)
    },

    downloadResult(result) {
      // Implementar download do resultado
      console.log('Download:', result)
    },

    enableEmailNotification() {
      this.notificationType = 'email'
      this.notificationEnabled = false
      this.showNotificationSuccess('Email configurado para notificação!')
    },

    enableWhatsAppNotification() {
      this.notificationType = 'whatsapp'
      this.notificationEnabled = false
      this.showNotificationSuccess('WhatsApp configurado para notificação!')
    },

    disableNotification() {
      this.notificationType = null
      this.notificationEnabled = false
    },

    showNotificationSuccess(message) {
      // Implementar toast de sucesso
      console.log(message)
    },

    clearResults() {
      this.searchResults = []
      this.searchQuery = ''
    },

    loadHistoryItem(item) {
      this.searchQuery = item.query
      this.performSearch()
    },

    loadSuggestion(suggestion) {
      this.searchQuery = suggestion.text
      this.performSearch()
    },

    addToHistory(query) {
      const existingIndex = this.searchHistory.findIndex(item => item.query === query)
      if (existingIndex > -1) {
        this.searchHistory.splice(existingIndex, 1)
      }
      
      this.searchHistory.unshift({
        id: Date.now(),
        query,
        date: new Date().toISOString().split('T')[0]
      })
      
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10)
      }
    }
  }
}
</script>

<style scoped>
.explorer-content {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
}

.explorer-header {
  text-align: center;
  margin-bottom: 40px;
}

.explorer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.explorer-logo i {
  font-size: 3rem;
  color: #3b82f6;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: bold;
  color: #e2e8f0;
}

.explorer-subtitle {
  font-size: 1.2rem;
  color: #94a3b8;
  margin: 0;
}

.search-container {
  margin-bottom: 30px;
}

.search-input-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 15px 60px 15px 50px;
  font-size: 1.1rem;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  border-radius: 25px;
  outline: none;
  transition: all 0.3s ease;
  color: #e2e8f0;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #64748b;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
}

.search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-50%) scale(1.05);
}

.upload-section {
  margin-bottom: 30px;
}

.upload-area {
  border: 2px dashed #475569;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  background: rgba(15, 23, 42, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.upload-area i {
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 15px;
}

.upload-area p {
  color: #e2e8f0;
  margin-bottom: 20px;
}

.upload-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
}

.advanced-filters {
  margin-bottom: 30px;
}

.advanced-button {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.advanced-button:hover {
  background: rgba(59, 130, 246, 0.2);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  padding: 20px;
  border-radius: 10px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.filter-select {
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #e2e8f0;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.results-section {
  margin-top: 30px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h3 {
  color: #e2e8f0;
  margin: 0;
}

.clear-button {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: rgba(239, 68, 68, 0.2);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.service-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.card-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.card-title h4 {
  color: #e2e8f0;
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.card-subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
}

.card-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-secondary {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn:hover {
  transform: translateY(-1px);
}

.card-content {
  color: #e2e8f0;
}

.card-description {
  margin-bottom: 15px;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #94a3b8;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-details {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.notification-section {
  margin-top: 30px;
}

.notification-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.notification-header i {
  font-size: 1.5rem;
  color: #3b82f6;
}

.notification-header h4 {
  color: #e2e8f0;
  margin: 0;
}

.notification-card p {
  color: #94a3b8;
  margin-bottom: 20px;
}

.notification-options h5 {
  color: #e2e8f0;
  margin-bottom: 15px;
}

.notification-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.history-section, .suggestions-section {
  margin-top: 30px;
}

.history-section h3, .suggestions-section h3 {
  color: #e2e8f0;
  margin-bottom: 15px;
}

.history-list, .suggestions-list {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 10px;
  overflow: hidden;
}

.history-item, .suggestion-item {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s ease;
  color: #e2e8f0;
}

.history-item:hover, .suggestion-item:hover {
  background: rgba(15, 23, 42, 0.5);
}

.history-item i, .suggestion-item i {
  color: #3b82f6;
  font-size: 0.9rem;
}

.history-date {
  margin-left: auto;
  color: #64748b;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .explorer-content {
    padding: 20px 15px;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .search-input {
    font-size: 1rem;
    padding: 12px 50px 12px 45px;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .notification-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .card-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 