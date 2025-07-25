<template>
  <div class="sources-view">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-database"></i>
        Gerenciamento de Fontes
      </h1>
      <p class="page-subtitle">
        Configure as fontes de pesquisa para extração de dados
      </p>
    </div>

    <!-- Botão Adicionar -->
    <div class="add-source-section">
      <button @click="showAddModal = true" class="canonika-btn canonika-btn-primary">
        <i class="fas fa-plus"></i>
        Adicionar Nova Fonte
      </button>
    </div>

    <!-- Lista de Fontes -->
    <div class="sources-list">
      <div class="canonika-card">
        <div class="card-header">
          <h6 class="card-title">
            <i class="fas fa-list"></i>
            Fontes Cadastradas
          </h6>
        </div>
        <div class="card-body">
          <div v-if="sources.length === 0" class="empty-state">
            <i class="fas fa-database"></i>
            <p>Nenhuma fonte cadastrada</p>
          </div>
          
          <div v-else class="sources-grid">
            <div
              v-for="source in sources"
              :key="source.id"
              class="source-card"
            >
              <div class="canonika-card">
                <div class="card-header">
                  <div class="source-header">
                    <h6 class="source-title">{{ source.name }}</h6>
                    <div class="source-badges">
                      <span class="status-badge" :class="getTypeBadgeClass(source.type)">
                        {{ getTypeText(source.type) }}
                      </span>
                      <span v-if="source.is_active" class="status-badge status-active">
                        Ativo
                      </span>
                      <span v-else class="status-badge status-inactive">
                        Inativo
                      </span>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="source-info">
                    <div class="info-item">
                      <strong>URL:</strong> {{ source.base_url }}
                    </div>
                    <div class="info-item">
                      <strong>Tags:</strong>
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
                      class="canonika-btn canonika-btn-outline"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="deleteSource(source.id)"
                      class="canonika-btn canonika-btn-danger"
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
    </div>

    <!-- Modal Adicionar/Editar Fonte -->
    <div
      v-if="showAddModal || showEditModal"
      class="modal-overlay"
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">
            {{ showEditModal ? 'Editar' : 'Adicionar' }} Fonte
          </h5>
          <button
            type="button"
            class="modal-close"
            @click="closeModal"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveSource" class="canonika-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">Nome</label>
                <input
                  type="text"
                  class="form-input"
                  id="name"
                  v-model="editingSource.name"
                  required
                >
              </div>
              <div class="form-group">
                <label for="type" class="form-label">Tipo</label>
                <select
                  class="form-input"
                  id="type"
                  v-model="editingSource.type"
                  required
                >
                  <option value="search_engine">Buscador</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="manufacturer">Fabricante</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="baseUrl" class="form-label">URL Base</label>
              <input
                type="url"
                class="form-input"
                id="baseUrl"
                v-model="editingSource.base_url"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="searchPrompt" class="form-label">Prompt de Busca</label>
              <textarea
                class="form-input"
                id="searchPrompt"
                v-model="editingSource.search_prompt"
                rows="3"
                required
              ></textarea>
              <small class="form-help">
                Use {product_name} como placeholder para o nome do produto
              </small>
            </div>
            
            <div class="form-group">
              <label for="navigationPrompt" class="form-label">Prompt de Navegação</label>
              <textarea
                class="form-input"
                id="navigationPrompt"
                v-model="editingSource.navigation_prompt"
                rows="3"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="extractionPrompt" class="form-label">Prompt de Extração</label>
              <textarea
                class="form-input"
                id="extractionPrompt"
                v-model="editingSource.extraction_prompt"
                rows="3"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="tags" class="form-label">Tags de Recomendação</label>
              <input
                type="text"
                class="form-input"
                id="tags"
                v-model="tagsInput"
                placeholder="Ex: eletronicos, livros, casa (separadas por vírgula)"
              >
              <small class="form-help">
                Tags separadas por vírgula para categorização
              </small>
            </div>
            
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="isActive"
                v-model="editingSource.is_active"
              >
              <label class="form-check-label" for="isActive">
                Fonte ativa
              </label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="canonika-btn canonika-btn-secondary"
            @click="closeModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="canonika-btn canonika-btn-primary"
            @click="saveSource"
          >
            {{ showEditModal ? 'Atualizar' : 'Adicionar' }}
          </button>
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
      sources: [],
      showAddModal: false,
      showEditModal: false,
      editingSource: {
        name: '',
        type: 'search_engine',
        base_url: '',
        search_prompt: '',
        navigation_prompt: '',
        extraction_prompt: '',
        recommendation_tags: [],
        is_active: true
      },
      tagsInput: ''
    }
  },
  async mounted() {
    await this.loadSources()
  },
  methods: {
    async loadSources() {
      try {
        const response = await axios.get('/api/sources')
        this.sources = response.data
      } catch (error) {
        console.error('Erro ao carregar fontes:', error)
      }
    },

    editSource(source) {
      this.editingSource = { ...source }
      this.tagsInput = source.recommendation_tags.join(', ')
      this.showEditModal = true
    },

    async deleteSource(sourceId) {
      if (!confirm('Tem certeza que deseja excluir esta fonte?')) {
        return
      }

      try {
        await axios.delete(`/api/sources/${sourceId}`)
        await this.loadSources()
      } catch (error) {
        console.error('Erro ao excluir fonte:', error)
        alert('Erro ao excluir fonte')
      }
    },

    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.editingSource = {
        name: '',
        type: 'search_engine',
        base_url: '',
        search_prompt: '',
        navigation_prompt: '',
        extraction_prompt: '',
        recommendation_tags: [],
        is_active: true
      }
      this.tagsInput = ''
    },

    async saveSource() {
      // Processa tags
      this.editingSource.recommendation_tags = this.tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      try {
        if (this.showEditModal) {
          await axios.put(`/api/sources/${this.editingSource.id}`, this.editingSource)
        } else {
          await axios.post('/api/sources', this.editingSource)
        }
        
        await this.loadSources()
        this.closeModal()
      } catch (error) {
        console.error('Erro ao salvar fonte:', error)
        alert('Erro ao salvar fonte')
      }
    },

    getTypeBadgeClass(type) {
      switch (type) {
        case 'search_engine':
          return 'type-search'
        case 'marketplace':
          return 'type-marketplace'
        case 'manufacturer':
          return 'type-manufacturer'
        default:
          return 'type-unknown'
      }
    },

    getTypeText(type) {
      switch (type) {
        case 'search_engine':
          return 'Buscador'
        case 'marketplace':
          return 'Marketplace'
        case 'manufacturer':
          return 'Fabricante'
        default:
          return 'Desconhecido'
      }
    }
  }
}
</script>

<style scoped>
.sources-view {
  min-height: calc(100vh - 200px);
  padding: 2rem;
}

.add-source-section {
  margin-bottom: 2rem;
}

.sources-list {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--canonika-gray);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.source-card {
  min-height: 200px;
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.source-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.source-badges {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--canonika-border-radius);
  font-size: 0.75rem;
  font-weight: 500;
}

.type-search {
  background: var(--canonika-blue);
  color: white;
}

.type-marketplace {
  background: var(--canonika-green);
  color: white;
}

.type-manufacturer {
  background: #ffc107;
  color: var(--canonika-dark);
}

.type-unknown {
  background: var(--canonika-gray);
  color: white;
}

.status-active {
  background: #28a745;
  color: white;
}

.status-inactive {
  background: var(--canonika-gray);
  color: white;
}

.source-info {
  margin-bottom: 1rem;
}

.info-item {
  margin-bottom: 0.75rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.tag-badge {
  background: var(--canonika-light-gray);
  color: var(--canonika-dark);
  padding: 0.25rem 0.5rem;
  border-radius: var(--canonika-border-radius);
  font-size: 0.75rem;
}

.source-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: var(--canonika-border-radius);
  box-shadow: var(--canonika-shadow);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--canonika-light-gray);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--canonika-gray);
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--canonika-light-gray);
  color: var(--canonika-dark);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--canonika-light-gray);
}

.form-help {
  color: var(--canonika-gray);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .sources-grid {
    grid-template-columns: 1fr;
  }
  
  .source-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .source-badges {
    align-self: flex-end;
  }
}
</style> 