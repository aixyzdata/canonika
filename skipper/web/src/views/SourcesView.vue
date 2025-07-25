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
    <div v-if="showAddModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content canonika-card">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingSource ? 'Editar Fonte' : 'Adicionar Nova Fonte' }}
            </h5>
            <button @click="closeModal" class="btn-close btn-close-white"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSource">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nome da Fonte</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      class="form-control"
                      placeholder="Ex: Amazon, Mercado Livre"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Tipo de Fonte</label>
                    <select v-model="formData.type" class="form-select" required>
                      <option value="">Selecione um tipo</option>
                      <option value="fabricante">Fabricante</option>
                      <option value="marketplace">Marketplace</option>
                      <option value="buscador">Buscador</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">URL Base</label>
                <input
                  v-model="formData.base_url"
                  type="url"
                  class="form-control"
                  placeholder="https://www.exemplo.com"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label class="form-label">Tags de Recomendação</label>
                <input
                  v-model="formData.tags"
                  type="text"
                  class="form-control"
                  placeholder="Ex: eletronicos, smartphones, tecnologia"
                >
                <small class="form-text text-muted">Separe as tags por vírgula</small>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input
                    v-model="formData.is_active"
                    type="checkbox"
                    class="form-check-input"
                    id="isActive"
                  >
                  <label class="form-check-label" for="isActive">
                    Fonte ativa
                  </label>
                </div>
              </div>
              
              <div class="text-end">
                <button type="button" @click="closeModal" class="btn btn-outline-secondary me-2">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-canonika-primary">
                  {{ editingSource ? 'Atualizar' : 'Adicionar' }}
                </button>
              </div>
            </form>
          </div>
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
        is_active: true
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
        is_active: source.is_active
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
          recommendation_tags: this.formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
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
        is_active: true
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