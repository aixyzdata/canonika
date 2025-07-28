<template>
  <div class="explorer-view">
    <div class="explorer-content">
      <!-- Logo e Título -->
      <div class="explorer-header">
        <div class="explorer-logo">
          <i class="fas fa-compass"></i>
          <span class="logo-text">Explorer</span>
        </div>
        <p class="explorer-subtitle">Descubra o que você procura</p>
      </div>

      <!-- Barra de Pesquisa -->
      <div class="search-container">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @input="handleSearchInput"
            type="text"
            class="search-input"
            placeholder="Digite sua pesquisa..."
            autocomplete="off"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="clear-button"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Botões de Ação -->
        <div class="search-actions">
          <button @click="performSearch" class="search-button">
            <i class="fas fa-search"></i>
            Pesquisar
          </button>
          <button @click="performAdvancedSearch" class="advanced-button">
            <i class="fas fa-cog"></i>
            Pesquisa Avançada
          </button>
        </div>
      </div>

      <!-- Sugestões de Pesquisa -->
      <div v-if="searchSuggestions.length > 0 && !searchResults.length" class="suggestions-container">
        <h3>Sugestões</h3>
        <div class="suggestions-list">
          <div
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            @click="selectSuggestion(suggestion)"
            class="suggestion-item"
          >
            <i class="fas fa-lightbulb"></i>
            <span>{{ suggestion }}</span>
          </div>
        </div>
      </div>

      <!-- Resultados da Pesquisa -->
      <div v-if="searchResults.length > 0" class="results-container">
        <div class="results-header">
          <h3>Resultados da Pesquisa</h3>
          <span class="results-count">{{ searchResults.length }} resultados encontrados</span>
        </div>
        
        <div class="results-list">
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="result-item"
          >
            <div class="result-title">
              <a :href="result.url" target="_blank">{{ result.title }}</a>
            </div>
            <div class="result-url">{{ result.url }}</div>
            <div class="result-description">{{ result.description }}</div>
            <div class="result-meta">
              <span class="result-type">{{ result.type }}</span>
              <span class="result-date">{{ result.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Histórico de Pesquisas -->
      <div v-if="!searchQuery && !searchResults.length" class="history-container">
        <h3>Pesquisas Recentes</h3>
        <div class="history-list">
          <div
            v-for="(item, index) in searchHistory"
            :key="index"
            @click="loadHistoryItem(item)"
            class="history-item"
          >
            <i class="fas fa-history"></i>
            <span>{{ item.query }}</span>
            <span class="history-date">{{ item.date }}</span>
          </div>
        </div>
      </div>

      <!-- Filtros Avançados -->
      <div v-if="showAdvancedFilters" class="filters-container">
        <h3>Filtros Avançados</h3>
        <div class="filters-grid">
          <div class="filter-group">
            <label>Tipo de Conteúdo</label>
            <select v-model="filters.contentType" class="filter-select">
              <option value="">Todos os tipos</option>
              <option value="web">Páginas Web</option>
              <option value="images">Imagens</option>
              <option value="videos">Vídeos</option>
              <option value="documents">Documentos</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Período</label>
            <select v-model="filters.timeRange" class="filter-select">
              <option value="">Qualquer data</option>
              <option value="day">Últimas 24 horas</option>
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="year">Último ano</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Idioma</label>
            <select v-model="filters.language" class="filter-select">
              <option value="">Todos os idiomas</option>
              <option value="pt">Português</option>
              <option value="en">Inglês</option>
              <option value="es">Espanhol</option>
            </select>
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
      searchSuggestions: [],
      searchHistory: [
        { query: 'microserviços arquitetura', date: '2024-01-15' },
        { query: 'vue.js desenvolvimento', date: '2024-01-14' },
        { query: 'docker containers', date: '2024-01-13' },
        { query: 'nginx configuração', date: '2024-01-12' }
      ],
      showAdvancedFilters: false,
      filters: {
        contentType: '',
        timeRange: '',
        language: ''
      },
      isSearching: false
    }
  },
  methods: {
    handleSearchInput() {
      // Simular sugestões baseadas na entrada
      if (this.searchQuery.length > 2) {
        this.searchSuggestions = [
          `${this.searchQuery} tutorial`,
          `${this.searchQuery} documentação`,
          `${this.searchQuery} exemplos`,
          `${this.searchQuery} melhores práticas`
        ]
      } else {
        this.searchSuggestions = []
      }
    },

    performSearch() {
      if (!this.searchQuery.trim()) return
      
      this.isSearching = true
      this.searchResults = []
      
      // Simular pesquisa
      setTimeout(() => {
        this.searchResults = [
          {
            title: 'Resultado da Pesquisa 1',
            url: 'https://exemplo.com/resultado1',
            description: 'Descrição detalhada do primeiro resultado da pesquisa realizada.',
            type: 'Página Web',
            date: '2024-01-15'
          },
          {
            title: 'Resultado da Pesquisa 2',
            url: 'https://exemplo.com/resultado2',
            description: 'Segundo resultado com informações relevantes sobre o tema pesquisado.',
            type: 'Documento',
            date: '2024-01-14'
          },
          {
            title: 'Resultado da Pesquisa 3',
            url: 'https://exemplo.com/resultado3',
            description: 'Terceiro resultado com dados complementares e insights adicionais.',
            type: 'Página Web',
            date: '2024-01-13'
          }
        ]
        
        // Adicionar ao histórico
        this.addToHistory(this.searchQuery)
        this.isSearching = false
      }, 1000)
    },

    performAdvancedSearch() {
      this.showAdvancedFilters = !this.showAdvancedFilters
      if (this.showAdvancedFilters) {
        this.performSearch()
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.searchResults = []
      this.searchSuggestions = []
    },

    selectSuggestion(suggestion) {
      this.searchQuery = suggestion
      this.performSearch()
    },

    loadHistoryItem(item) {
      this.searchQuery = item.query
      this.performSearch()
    },

    addToHistory(query) {
      const existingIndex = this.searchHistory.findIndex(item => item.query === query)
      if (existingIndex > -1) {
        this.searchHistory.splice(existingIndex, 1)
      }
      
      this.searchHistory.unshift({
        query,
        date: new Date().toISOString().split('T')[0]
      })
      
      // Manter apenas os últimos 10 itens
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10)
      }
    }
  }
}
</script>

<style scoped>
.explorer-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.explorer-content {
  max-width: 800px;
  width: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 60px 40px;
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
  margin-bottom: 40px;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto 20px;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 50px;
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

.clear-button {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.search-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.search-button, .advanced-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.search-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.search-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.advanced-button {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.advanced-button:hover {
  background: rgba(59, 130, 246, 0.2);
}

.suggestions-container, .results-container, .history-container, .filters-container {
  margin-top: 30px;
}

.suggestions-container h3, .results-container h3, .history-container h3, .filters-container h3 {
  color: #e2e8f0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.suggestions-list, .history-list {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.suggestion-item, .history-item {
  padding: 12px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s ease;
  color: #e2e8f0;
}

.suggestion-item:hover, .history-item:hover {
  background: rgba(15, 23, 42, 0.5);
}

.suggestion-item i, .history-item i {
  color: #3b82f6;
  font-size: 0.9rem;
}

.history-date {
  margin-left: auto;
  color: #64748b;
  font-size: 0.9rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-count {
  color: #94a3b8;
  font-size: 0.9rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-item {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  padding: 20px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
}

.result-title a {
  color: #3b82f6;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
}

.result-title a:hover {
  text-decoration: underline;
}

.result-url {
  color: #10b981;
  font-size: 0.9rem;
  margin: 5px 0;
}

.result-description {
  color: #e2e8f0;
  line-height: 1.5;
  margin: 10px 0;
}

.result-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: #94a3b8;
}

.result-type, .result-date {
  display: flex;
  align-items: center;
  gap: 5px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  padding: 20px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

/* Loading state */
.searching {
  opacity: 0.7;
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .explorer-content {
    padding: 40px 20px;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .search-input {
    font-size: 1rem;
    padding: 12px 45px 12px 45px;
  }
  
  .search-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .search-button, .advanced-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style> 