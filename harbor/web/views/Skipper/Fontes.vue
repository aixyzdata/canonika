<template>
  <div class="fontes-view">
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
                      class="action-btn"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="deleteSource(source.id)"
                      class="action-btn danger"
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
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editingSource ? 'Editar Fonte' : 'Adicionar Nova Fonte' }}
          </h5>
          <button @click="closeModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveSource" class="source-form">
            <div class="form-group">
              <label class="form-label">Nome da Fonte</label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="Ex: Amazon, Mercado Livre"
                required
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">URL Base</label>
              <input
                v-model="formData.base_url"
                type="url"
                class="form-input"
                placeholder="https://www.exemplo.com"
                required
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">Tipo de Fonte</label>
              <select v-model="formData.type" class="form-select" required>
                <option value="">Selecione um tipo</option>
                <option value="marketplace">Marketplace</option>
                <option value="search_engine">Motor de Busca</option>
                <option value="api">API</option>
                <option value="scraper">Web Scraper</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Tags de Recomendação</label>
              <input
                v-model="formData.tags"
                type="text"
                class="form-input"
                placeholder="Ex: eletronicos, smartphones, tecnologia"
              >
              <small class="form-help">Separe as tags por vírgula</small>
            </div>
            
            <div class="form-group">
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
            
            <div class="form-actions">
              <button type="button" @click="closeModal" class="canonika-btn canonika-btn-outline">
                Cancelar
              </button>
              <button type="submit" class="canonika-btn canonika-btn-primary">
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
export default {
  name: 'SkipperFontes',
  data() {
    return {
      showAddModal: false,
      editingSource: null,
      formData: {
        name: '',
        base_url: '',
        type: '',
        tags: '',
        is_active: true
      },
      sources: [
        {
          id: 1,
          name: 'Amazon',
          base_url: 'https://www.amazon.com.br',
          type: 'marketplace',
          is_active: true,
          recommendation_tags: ['eletronicos', 'smartphones', 'tecnologia']
        },
        {
          id: 2,
          name: 'Mercado Livre',
          base_url: 'https://www.mercadolivre.com.br',
          type: 'marketplace',
          is_active: true,
          recommendation_tags: ['geral', 'usados', 'novos']
        },
        {
          id: 3,
          name: 'Americanas',
          base_url: 'https://www.americanas.com.br',
          type: 'marketplace',
          is_active: true,
          recommendation_tags: ['eletronicos', 'casa', 'moda']
        },
        {
          id: 4,
          name: 'Casas Bahia',
          base_url: 'https://www.casasbahia.com.br',
          type: 'marketplace',
          is_active: false,
          recommendation_tags: ['eletrodomesticos', 'moveis', 'casa']
        },
        {
          id: 5,
          name: 'Google Shopping',
          base_url: 'https://shopping.google.com',
          type: 'search_engine',
          is_active: true,
          recommendation_tags: ['comparacao', 'precos', 'geral']
        }
      ]
    }
  },
  methods: {
    getTypeBadgeClass(type) {
      const classes = {
        marketplace: 'badge-marketplace',
        search_engine: 'badge-search',
        api: 'badge-api',
        scraper: 'badge-scraper'
      };
      return classes[type] || 'badge-default';
    },
    getTypeText(type) {
      const texts = {
        marketplace: 'Marketplace',
        search_engine: 'Motor de Busca',
        api: 'API',
        scraper: 'Web Scraper'
      };
      return texts[type] || 'Desconhecido';
    },
    editSource(source) {
      this.editingSource = source;
      this.formData = {
        name: source.name,
        base_url: source.base_url,
        type: source.type,
        tags: source.recommendation_tags.join(', '),
        is_active: source.is_active
      };
      this.showAddModal = true;
    },
    deleteSource(sourceId) {
      if (confirm('Tem certeza que deseja excluir esta fonte?')) {
        this.sources = this.sources.filter(s => s.id !== sourceId);
        console.log(`Fonte ${sourceId} excluída`);
      }
    },
    saveSource() {
      if (this.editingSource) {
        // Atualizar fonte existente
        const index = this.sources.findIndex(s => s.id === this.editingSource.id);
        if (index !== -1) {
          this.sources[index] = {
            ...this.editingSource,
            name: this.formData.name,
            base_url: this.formData.base_url,
            type: this.formData.type,
            is_active: this.formData.is_active,
            recommendation_tags: this.formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          };
        }
      } else {
        // Adicionar nova fonte
        const newSource = {
          id: Date.now(),
          name: this.formData.name,
          base_url: this.formData.base_url,
          type: this.formData.type,
          is_active: this.formData.is_active,
          recommendation_tags: this.formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        this.sources.push(newSource);
      }
      
      this.closeModal();
    },
    closeModal() {
      this.showAddModal = false;
      this.editingSource = null;
      this.formData = {
        name: '',
        base_url: '',
        type: '',
        tags: '',
        is_active: true
      };
    }
  }
}
</script>

<style scoped>
.fontes-view {
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

.add-source-section {
  margin-bottom: 2rem;
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

.canonika-btn-primary:hover {
  background: #2563eb;
}

.canonika-btn-outline {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #475569;
}

.canonika-btn-outline:hover {
  background: #475569;
  color: white;
}

.sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.source-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.source-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.source-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.source-badges {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-marketplace {
  background: #3b82f6;
  color: white;
}

.badge-search {
  background: #10b981;
  color: white;
}

.badge-api {
  background: #f59e0b;
  color: white;
}

.badge-scraper {
  background: #8b5cf6;
  color: white;
}

.badge-default {
  background: #64748b;
  color: white;
}

.status-active {
  background: #10b981;
  color: white;
}

.status-inactive {
  background: #ef4444;
  color: white;
}

.source-info {
  margin-bottom: 1rem;
}

.info-item {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.info-item strong {
  color: #e2e8f0;
  margin-right: 0.5rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
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

.action-btn.danger:hover {
  background: #ef4444;
  border-color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
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
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #475569;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-close:hover {
  color: #e2e8f0;
}

.modal-body {
  padding: 1.5rem;
}

.source-form {
  display: flex;
  flex-direction: column;
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

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-help {
  font-size: 0.75rem;
  color: #94a3b8;
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style> 