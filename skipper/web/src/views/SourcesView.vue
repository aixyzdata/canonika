<template>
  <div class="sources-view">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="canonika-card p-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h2 class="mb-2">
                <i class="fas fa-database me-2"></i>
                Gerenciamento de Fontes
              </h2>
              <p class="text-muted mb-0">
                Configure as fontes de pesquisa para extração de dados
              </p>
            </div>
            <div class="col-md-4 text-end">
              <button 
                @click="showAddModal = true" 
                class="btn btn-canonika-primary"
              >
                <i class="fas fa-plus me-2"></i>
                Nova Fonte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Fontes -->
    <div class="row">
      <div class="col-12">
        <div class="canonika-card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">
              <i class="fas fa-list me-2"></i>
              Fontes Cadastradas
            </h4>
            <div class="d-flex gap-2">
              <span class="badge bg-success">
                {{ activeSourcesCount }} Ativas
              </span>
              <span class="badge bg-secondary">
                {{ inactiveSourcesCount }} Inativas
              </span>
            </div>
          </div>

          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-light" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div v-else-if="sources.length === 0" class="text-center py-4">
            <i class="fas fa-database fa-3x text-muted mb-3"></i>
            <h5>Nenhuma fonte cadastrada</h5>
            <p class="text-muted">Adicione sua primeira fonte para começar</p>
            <button @click="showAddModal = true" class="btn btn-canonika-primary">
              <i class="fas fa-plus me-2"></i>
              Adicionar Primeira Fonte
            </button>
          </div>

          <div v-else class="row">
            <div 
              v-for="source in sources" 
              :key="source.id"
              class="col-md-6 col-lg-4 mb-3"
            >
              <div class="source-card">
                <div class="source-header">
                  <div class="source-icon">
                    <i :class="getSourceIcon(source.name)"></i>
                  </div>
                  <div class="source-status">
                    <div class="status-indicator" :class="{ active: source.is_active }"></div>
                  </div>
                </div>
                
                <div class="source-content">
                  <h5 class="source-title">{{ source.name }}</h5>
                  <div class="source-badges">
                    <span class="badge" :class="getTypeBadgeClass(source.type)">
                      {{ getTypeText(source.type) }}
                    </span>
                    <span v-if="source.is_active" class="badge bg-success">
                      Ativo
                    </span>
                    <span v-else class="badge bg-secondary">
                      Inativo
                    </span>
                  </div>
                  
                  <div class="source-url">
                    <i class="fas fa-link me-1"></i>
                    <span>{{ source.base_url }}</span>
                  </div>
                  
                  <div class="source-tags">
                    <div class="tags-label">
                      <i class="fas fa-tags me-1"></i>
                      Tags:
                    </div>
                    <div class="tags-container">
                      <span 
                        v-for="tag in source.recommendation_tags" 
                        :key="tag"
                        class="tag-badge"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Prompts Configurados -->
                  <div class="source-prompts">
                    <div class="prompts-label">
                      <i class="fas fa-robot me-1"></i>
                      Prompts Configurados:
                    </div>
                    <div class="prompts-container">
                      <div class="prompt-item">
                        <span class="prompt-label">Busca:</span>
                        <span class="prompt-text">{{ source.search_prompt || 'Não configurado' }}</span>
                      </div>
                      <div class="prompt-item">
                        <span class="prompt-label">Navegação:</span>
                        <span class="prompt-text">{{ source.navigation_prompt || 'Não configurado' }}</span>
                      </div>
                      <div class="prompt-item">
                        <span class="prompt-label">Extração:</span>
                        <span class="prompt-text">{{ source.extraction_prompt || 'Não configurado' }}</span>
                      </div>
                      <div v-if="source.search_autofeedback || source.navigation_autofeedback || source.extraction_autofeedback" class="autofeedback-section">
                        <div class="autofeedback-label">
                          <i class="fas fa-brain me-1"></i>
                          Auto-feedback:
                        </div>
                        <div class="autofeedback-items">
                          <div v-if="source.search_autofeedback" class="autofeedback-item">
                            <span class="autofeedback-type">Busca:</span>
                            <span class="autofeedback-text">{{ source.search_autofeedback }}</span>
                          </div>
                          <div v-if="source.navigation_autofeedback" class="autofeedback-item">
                            <span class="autofeedback-type">Navegação:</span>
                            <span class="autofeedback-text">{{ source.navigation_autofeedback }}</span>
                          </div>
                          <div v-if="source.extraction_autofeedback" class="autofeedback-item">
                            <span class="autofeedback-type">Extração:</span>
                            <span class="autofeedback-text">{{ source.extraction_autofeedback }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="source-actions">
                  <button 
                    @click="editSource(source)"
                    class="btn btn-sm btn-outline-primary"
                    title="Editar fonte"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="testSource(source)"
                    class="btn btn-sm btn-outline-success"
                    title="Testar conexão"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    @click="deleteSource(source.id)"
                    class="btn btn-sm btn-outline-danger"
                    title="Excluir fonte"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Adicionar/Editar Fonte -->
    <div v-if="showAddModal" class="canonika-modal-overlay">
      <div class="canonika-modal">
        <div class="canonika-modal-header">
          <div class="canonika-modal-title">
            <i class="fas fa-database canonika-modal-icon"></i>
            <h3 class="canonika-h3">{{ editingSource ? 'Editar Fonte' : 'Adicionar Nova Fonte' }}</h3>
          </div>
          <button @click="closeModal" class="canonika-btn canonika-btn-icon">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="canonika-modal-body">
          <form @submit.prevent="saveSource" class="canonika-form">
            <!-- Informações Básicas -->
            <div class="canonika-form-section">
              <div class="canonika-section-subheader">
                <h4 class="canonika-h4">Informações Básicas</h4>
                <p class="canonika-text-sm">Configure os dados principais da fonte</p>
              </div>
              
              <div class="canonika-form-row">
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-tag"></i>
                    Nome da Fonte
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="canonika-form-input"
                    placeholder="Ex: Amazon, Mercado Livre"
                    required
                  >
                </div>
                
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-list"></i>
                    Tipo de Fonte
                  </label>
                  <select v-model="formData.type" class="canonika-form-select" required @change="loadTemplates">
                    <option value="">Selecione um tipo</option>
                    <option value="fabricante">Fabricante</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="buscador">Buscador</option>
                  </select>
                </div>
              </div>
              
              <div class="canonika-form-group">
                <label class="canonika-form-label">
                  <i class="fas fa-link"></i>
                  URL Base
                </label>
                <input
                  v-model="formData.base_url"
                  type="url"
                  class="canonika-form-input"
                  placeholder="https://www.exemplo.com"
                  required
                >
              </div>
              
              <div class="canonika-form-group">
                <label class="canonika-form-label">
                  <i class="fas fa-tags"></i>
                  Tags de Recomendação
                </label>
                <input
                  v-model="formData.tags"
                  type="text"
                  class="canonika-form-input"
                  placeholder="Ex: eletronicos, smartphones, tecnologia"
                >
                <small class="canonika-text-sm canonika-text-muted">Separe as tags por vírgula</small>
              </div>
              
              <div class="canonika-form-group">
                <div class="canonika-form-check">
                  <input
                    v-model="formData.is_active"
                    type="checkbox"
                    class="canonika-form-check-input"
                    id="isActive"
                  >
                  <label class="canonika-form-check-label" for="isActive">
                    <i class="fas fa-toggle-on"></i>
                    Fonte ativa
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Prompts dos Agentes -->
            <div class="canonika-form-section">
              <div class="canonika-section-subheader">
                <h4 class="canonika-h4">
                  <i class="fas fa-robot"></i>
                  Prompts dos Agentes
                </h4>
                <p class="canonika-text-sm">Configure os prompts específicos para cada tipo de agente</p>
              </div>
              
              <div class="canonika-form-row">
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-search"></i>
                    Prompt do Agente de Busca
                  </label>
                  <textarea
                    v-model="formData.search_prompt"
                    class="canonika-form-textarea"
                    rows="3"
                    placeholder="Ex: Pesquise por {product} no {source_name}"
                    required
                  ></textarea>
                </div>
                
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-mouse-pointer"></i>
                    Prompt do Agente de Navegação
                  </label>
                  <textarea
                    v-model="formData.navigation_prompt"
                    class="canonika-form-textarea"
                    rows="3"
                    placeholder="Ex: Acesse a página do produto e extraia o conteúdo"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div class="canonika-form-row">
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-download"></i>
                    Prompt do Agente de Extração
                  </label>
                  <textarea
                    v-model="formData.extraction_prompt"
                    class="canonika-form-textarea"
                    rows="3"
                    placeholder="Ex: Extraia os atributos: nome, marca, preço, descrição"
                    required
                  ></textarea>
                </div>
                
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-brain"></i>
                    Auto-feedback (Busca)
                  </label>
                  <textarea
                    v-model="formData.search_autofeedback"
                    class="canonika-form-textarea"
                    rows="3"
                    placeholder="Prompt de auto-feedback para busca"
                  ></textarea>
                </div>
              </div>
              
              <div class="canonika-form-row">
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-brain"></i>
                    Auto-feedback (Navegação)
                  </label>
                  <textarea
                    v-model="formData.navigation_autofeedback"
                    class="canonika-form-textarea"
                    rows="3"
                    placeholder="Prompt de auto-feedback para navegação"
                  ></textarea>
                </div>
                
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-brain"></i>
                    Auto-feedback (Extração)
                  </label>
                  <textarea
                    v-model="formData.extraction_autofeedback"
                    class="canonika-form-textarea"
                    rows="3"
                    placeholder="Prompt de auto-feedback para extração"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- Configurações Avançadas -->
            <div class="canonika-form-section">
              <div class="canonika-section-subheader">
                <h4 class="canonika-h4">
                  <i class="fas fa-cog"></i>
                  Configurações Avançadas
                </h4>
                <p class="canonika-text-sm">Configurações de conexão, headers e rate limiting</p>
              </div>
              
              <div class="canonika-form-row">
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-clock"></i>
                    Timeout de Conexão (segundos)
                  </label>
                  <input
                    v-model="formData.connection_timeout"
                    type="number"
                    class="canonika-form-input"
                    min="5"
                    max="120"
                    step="5"
                  >
                </div>
                
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-hourglass-half"></i>
                    Delay entre Requests (segundos)
                  </label>
                  <input
                    v-model="formData.request_delay"
                    type="number"
                    class="canonika-form-input"
                    min="0.1"
                    max="10"
                    step="0.1"
                  >
                </div>
              </div>
              
              <div class="canonika-form-row">
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-redo"></i>
                    Máximo de Tentativas
                  </label>
                  <input
                    v-model="formData.max_retries"
                    type="number"
                    class="canonika-form-input"
                    min="1"
                    max="10"
                  >
                </div>
                
                <div class="canonika-form-group">
                  <label class="canonika-form-label">
                    <i class="fas fa-tachometer-alt"></i>
                    Requests por Minuto
                  </label>
                  <input
                    v-model="formData.max_requests_per_minute"
                    type="number"
                    class="canonika-form-input"
                    min="5"
                    max="100"
                    step="5"
                  >
                </div>
              </div>
              
              <div class="canonika-form-group">
                <label class="canonika-form-label">
                  <i class="fas fa-user"></i>
                  User Agent
                </label>
                <input
                  v-model="formData.user_agent"
                  type="text"
                  class="canonika-form-input"
                  placeholder="User agent personalizado"
                >
              </div>
              
              <div class="canonika-form-group">
                <label class="canonika-form-label">
                  <i class="fas fa-code"></i>
                  Headers Personalizados (JSON)
                </label>
                <textarea
                  v-model="formData.custom_headers"
                  class="canonika-form-textarea"
                  rows="3"
                  placeholder='{"Accept": "text/html", "Referer": "https://example.com"}'
                ></textarea>
              </div>
              
              <div class="canonika-form-group">
                <label class="canonika-form-label">
                  <i class="fas fa-network-wired"></i>
                  Configurações de Proxy (JSON)
                </label>
                <textarea
                  v-model="formData.proxy_settings"
                  class="canonika-form-textarea"
                  rows="3"
                  placeholder='{"http": "http://proxy:8080", "https": "https://proxy:8080"}'
                ></textarea>
              </div>
            </div>
            
            <!-- Ações -->
            <div class="canonika-form-actions">
              <button type="button" @click="closeModal" class="canonika-btn canonika-btn-outline">
                <i class="fas fa-times"></i>
                Cancelar
              </button>
              <button type="submit" class="canonika-btn canonika-btn-primary">
                <i class="fas fa-save"></i>
                {{ editingSource ? 'Atualizar' : 'Adicionar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SourcesView',
  data() {
    return {
      loading: false,
      sources: [],
      showAddModal: false,
      editingSource: null,
      formData: {
        name: '',
        type: '',
        base_url: '',
        tags: '',
        is_active: true,
        search_prompt: '',
        navigation_prompt: '',
        extraction_prompt: '',
        search_autofeedback: '',
        navigation_autofeedback: '',
        extraction_autofeedback: '',
        // Novos campos de configuração
        connection_timeout: 30,
        request_delay: 1.0,
        max_retries: 3,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        custom_headers: '',
        proxy_settings: '',
        rate_limit_delay: 2.0,
        max_requests_per_minute: 30
      }
    }
  },
  computed: {
    activeSourcesCount() {
      return this.sources.filter(s => s.is_active).length
    },
    inactiveSourcesCount() {
      return this.sources.filter(s => !s.is_active).length
    }
  },
  async mounted() {
    await this.loadSources()
  },
  methods: {
    async loadSources() {
      try {
        this.loading = true
        const response = await axios.get('/api/sources')
        this.sources = response.data
      } catch (error) {
        console.error('Erro ao carregar fontes:', error)
      } finally {
        this.loading = false
      }
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

    getTypeBadgeClass(type) {
      const classes = {
        'fabricante': 'bg-primary',
        'marketplace': 'bg-success',
        'buscador': 'bg-info'
      }
      return classes[type] || 'bg-secondary'
    },

    getTypeText(type) {
      const texts = {
        'fabricante': 'Fabricante',
        'marketplace': 'Marketplace',
        'buscador': 'Buscador'
      }
      return texts[type] || 'Desconhecido'
    },

    editSource(source) {
      this.editingSource = source
      this.formData = {
        name: source.name,
        type: source.type,
        base_url: source.base_url,
        tags: source.recommendation_tags.join(', '),
        is_active: source.is_active,
        search_prompt: source.search_prompt || '',
        navigation_prompt: source.navigation_prompt || '',
        extraction_prompt: source.extraction_prompt || '',
        search_autofeedback: source.search_autofeedback || '',
        navigation_autofeedback: source.navigation_autofeedback || '',
        extraction_autofeedback: source.extraction_autofeedback || '',
        // Novos campos de configuração
        connection_timeout: source.connection_timeout || 30,
        request_delay: source.request_delay || 1.0,
        max_retries: source.max_retries || 3,
        user_agent: source.user_agent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        custom_headers: source.custom_headers ? JSON.stringify(source.custom_headers, null, 2) : '',
        proxy_settings: source.proxy_settings ? JSON.stringify(source.proxy_settings, null, 2) : '',
        rate_limit_delay: source.rate_limit_delay || 2.0,
        max_requests_per_minute: source.max_requests_per_minute || 30
      }
      this.showAddModal = true
    },

    async deleteSource(sourceId) {
      if (confirm('Tem certeza que deseja excluir esta fonte?')) {
        try {
          await axios.delete(`/api/sources/${sourceId}`)
          await this.loadSources()
        } catch (error) {
          console.error('Erro ao excluir fonte:', error)
        }
      }
    },

    testSource(source) {
      alert(`Testando conexão com ${source.name}...`)
    },

    async saveSource() {
      try {
        const sourceData = {
          ...this.formData,
          recommendation_tags: this.formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          search_prompt: this.formData.search_prompt,
          navigation_prompt: this.formData.navigation_prompt,
          extraction_prompt: this.formData.extraction_prompt,
          search_autofeedback: this.formData.search_autofeedback,
          navigation_autofeedback: this.formData.navigation_autofeedback,
          extraction_autofeedback: this.formData.extraction_autofeedback,
          // Novos campos de configuração
          connection_timeout: parseInt(this.formData.connection_timeout),
          request_delay: parseFloat(this.formData.request_delay),
          max_retries: parseInt(this.formData.max_retries),
          user_agent: this.formData.user_agent,
          custom_headers: this.formData.custom_headers ? JSON.parse(this.formData.custom_headers) : null,
          proxy_settings: this.formData.proxy_settings ? JSON.parse(this.formData.proxy_settings) : null,
          rate_limit_delay: parseFloat(this.formData.rate_limit_delay),
          max_requests_per_minute: parseInt(this.formData.max_requests_per_minute)
        }

        if (this.editingSource) {
          await axios.put(`/api/sources/${this.editingSource.id}`, sourceData)
        } else {
          await axios.post('/api/sources', sourceData)
        }

        await this.loadSources()
        this.closeModal()
      } catch (error) {
        console.error('Erro ao salvar fonte:', error)
      }
    },

    closeModal() {
      this.showAddModal = false
      this.editingSource = null
      this.formData = {
        name: '',
        type: '',
        base_url: '',
        tags: '',
        is_active: true,
        search_prompt: '',
        navigation_prompt: '',
        extraction_prompt: '',
        search_autofeedback: '',
        navigation_autofeedback: '',
        extraction_autofeedback: '',
        // Novos campos de configuração
        connection_timeout: 30,
        request_delay: 1.0,
        max_retries: 3,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        custom_headers: '',
        proxy_settings: '',
        rate_limit_delay: 2.0,
        max_requests_per_minute: 30
      }
    },

    async loadTemplates() {
      try {
        this.loading = true
        const response = await axios.get(`/api/sources/templates/${this.formData.type}`)
        this.formData.search_prompt = response.data.search_prompt || ''
        this.formData.navigation_prompt = response.data.navigation_prompt || ''
        this.formData.extraction_prompt = response.data.extraction_prompt || ''
      } catch (error) {
        console.error('Erro ao carregar templates de prompts:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.sources-view {
  padding: 1rem 0;
}

.source-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border: 1px solid #444;
  border-radius: 10px;
  padding: 1.5rem;
  height: 100%;
  transition: all 0.3s ease;
}

.source-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: var(--canonika-green);
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.source-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--canonika-green), #00a085);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.status-indicator {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #dc3545;
  transition: all 0.3s ease;
}

.status-indicator.active {
  background: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);
}

.source-content {
  margin-bottom: 1rem;
}

.source-title {
  color: #e2e8f0;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.source-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.source-url {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.source-tags {
  margin-bottom: 1rem;
}

.tags-label {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag-badge {
  background: #475569;
  color: #e2e8f0;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.source-prompts {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #475569;
}

.prompts-label {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.prompts-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prompt-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.prompt-label {
  font-weight: 600;
  color: #e2e8f0;
}

.prompt-text {
  flex-grow: 1;
  text-align: right;
}

.autofeedback-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #475569;
}

.autofeedback-label {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.autofeedback-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.autofeedback-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.autofeedback-type {
  font-weight: 600;
  color: #e2e8f0;
}

.autofeedback-text {
  flex-grow: 1;
  text-align: right;
}

.source-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.form-control, .form-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
}

.form-control:focus, .form-select:focus {
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

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
}

.modal-header {
  border-bottom: 1px solid #475569;
}

.modal-title {
  color: #e2e8f0;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}
</style>