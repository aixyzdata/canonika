<template>
  <div class="canonika-view">
    <!-- Header Padronizado -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-database"></i>
        <div class="title-content">
          <h1>Gerenciamento de Fontes</h1>
          <p>Configure as fontes de pesquisa para extração de dados</p>
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
        <button @click="showAddModal = true" class="action-btn primary">
          <i class="fas fa-plus"></i>
          Adicionar Fonte
        </button>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="view-content">
      <!-- Estatísticas -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Estatísticas das Fontes</h3>
            <div class="card-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ sources.filter(s => s.is_active).length }}</span>
                  <span class="stat-label">Fontes Ativas</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-pause-circle"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ sources.filter(s => !s.is_active).length }}</span>
                  <span class="stat-label">Fontes Inativas</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-globe"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ sources.length }}</span>
                  <span class="stat-label">Total de Fontes</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-percentage"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ sources.length > 0 ? Math.round((sources.filter(s => s.is_active).length / sources.length) * 100) : 0 }}%</span>
                  <span class="stat-label">Taxa de Ativação</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Fontes -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Fontes Cadastradas</h3>
            <div class="card-icon">
              <i class="fas fa-database"></i>
            </div>
          </div>
          <div class="card-content">
            <div v-if="sources.length === 0" class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-database"></i>
              </div>
              <h3>Nenhuma fonte cadastrada</h3>
              <p>Adicione sua primeira fonte de dados para começar</p>
              <button @click="showAddModal = true" class="action-btn primary">
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
              <button type="button" @click="closeModal" class="action-btn">
                Cancelar
              </button>
              <button type="submit" class="action-btn primary">
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
    refreshData() {
      console.log('Atualizando dados das fontes...');
      // Implementar chamadas para a API
    },
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

