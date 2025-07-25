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
    <div class="sources-section">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-database"></i>
          <h2>Fontes Cadastradas</h2>
        </div>
        <div class="section-stats">
          <span class="stat-badge">
            <i class="fas fa-check-circle"></i>
            {{ sources.filter(s => s.is_active).length }} Ativas
          </span>
          <span class="stat-badge">
            <i class="fas fa-pause-circle"></i>
            {{ sources.filter(s => !s.is_active).length }} Inativas
          </span>
        </div>
      </div>
      
      <div class="sources-container">
        <div v-if="sources.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-database"></i>
          </div>
          <h3>Nenhuma fonte cadastrada</h3>
          <p>Adicione sua primeira fonte de dados para começar</p>
          <button @click="showAddModal = true" class="canonika-btn canonika-btn-primary">
            <i class="fas fa-plus"></i>
            Adicionar Primeira Fonte
          </button>
        </div>
        
        <div v-else class="sources-grid">
          <div
            v-for="source in sources"
            :key="source.id"
            class="source-card"
          >
            <div class="source-card-header">
              <div class="source-icon">
                <i :class="getSourceIcon(source.name)"></i>
              </div>
              <div class="source-status">
                <div class="status-indicator" :class="{ active: source.is_active }"></div>
              </div>
            </div>
            
            <div class="source-card-content">
              <div class="source-title-section">
                <h3 class="source-title">{{ source.name }}</h3>
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
              
              <div class="source-url">
                <i class="fas fa-link"></i>
                <span>{{ source.base_url }}</span>
              </div>
              
              <div class="source-tags">
                <div class="tags-label">
                  <i class="fas fa-tags"></i>
                  <span>Tags de Recomendação</span>
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
              
              <div class="source-stats">
                <div class="stat-item">
                  <i class="fas fa-clock"></i>
                  <span>Última verificação: 2h atrás</span>
                </div>
                <div class="stat-item">
                  <i class="fas fa-check-circle"></i>
                  <span>Disponibilidade: 98%</span>
                </div>
              </div>
            </div>
            
            <div class="source-card-actions">
              <button
                @click="editSource(source)"
                class="action-btn primary"
                title="Editar fonte"
              >
                <i class="fas fa-edit"></i>
                <span>Editar</span>
              </button>
              <button
                @click="testSource(source)"
                class="action-btn"
                title="Testar conexão"
              >
                <i class="fas fa-play"></i>
                <span>Testar</span>
              </button>
              <button
                @click="deleteSource(source.id)"
                class="action-btn danger"
                title="Excluir fonte"
              >
                <i class="fas fa-trash"></i>
                <span>Excluir</span>
              </button>
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
    getSourceIcon(sourceName) {
      const icons = {
        'Amazon': 'fab fa-amazon',
        'Mercado Livre': 'fas fa-shopping-cart',
        'Americanas': 'fas fa-store',
        'Casas Bahia': 'fas fa-home',
        'Google Shopping': 'fab fa-google',
        'default': 'fas fa-globe'
      };
      return icons[sourceName] || icons.default;
    },
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
    testSource(source) {
      console.log(`Testando conexão com: ${source.name}`);
      // Aqui seria implementada a lógica de teste de conexão
      alert(`Testando conexão com ${source.name}...`);
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
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 3rem;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.page-title i {
  color: #3b82f6;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #94a3b8;
  margin: 0;
}

.add-source-section {
  margin-bottom: 3rem;
  text-align: center;
}

.sources-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid #475569;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-title i {
  font-size: 1.5rem;
  color: #3b82f6;
}

.section-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.section-stats {
  display: flex;
  gap: 1rem;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(71, 85, 105, 0.3);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-badge i {
  color: #10b981;
}

.stat-badge:last-child i {
  color: #f59e0b;
}

.sources-container {
  padding: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #94a3b8;
  margin: 0 0 2rem 0;
}

.sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.source-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.source-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #3b82f6;
}

.source-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
}

.source-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.source-status {
  position: relative;
}

.status-indicator {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #ef4444;
  transition: all 0.3s ease;
}

.status-indicator.active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.source-card-content {
  padding: 1.5rem;
}

.source-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.source-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
  flex: 1;
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

.source-url {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.source-url i {
  color: #3b82f6;
  font-size: 0.875rem;
}

.source-tags {
  margin-bottom: 1.5rem;
}

.tags-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
}

.tags-label i {
  color: #3b82f6;
}

.source-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.stat-item i {
  color: #10b981;
  font-size: 0.875rem;
}

.source-card-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.5);
  border-top: 1px solid #475569;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #475569;
  background: transparent;
  color: #94a3b8;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-color: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

.action-btn.danger:hover {
  background: #ef4444;
  border-color: #ef4444;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
</style> 