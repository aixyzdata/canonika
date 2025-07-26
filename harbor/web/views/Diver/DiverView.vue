<template>
  <div class="diver-container">
    <!-- Header -->
    <div class="diver-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-diving-helmet"></i>
        </div>
        <div class="header-text">
          <h1>🤿 Diver</h1>
          <p>Tripulante de Consulta Canônica</p>
        </div>
      </div>
    </div>

    <!-- Tabs de Navegação -->
    <div class="diver-tabs">
      <button 
        @click="activeTab = 'consulta'" 
        :class="['tab-btn', { active: activeTab === 'consulta' }]"
      >
        <i class="fas fa-search"></i>
        Consulta Manual
      </button>
      <button 
        @click="activeTab = 'upload'" 
        :class="['tab-btn', { active: activeTab === 'upload' }]"
      >
        <i class="fas fa-file-upload"></i>
        Upload NFe
      </button>
    </div>

    <!-- Conteúdo das Tabs -->
    <div class="diver-content">
      
      <!-- Tab Consulta Manual -->
      <div v-if="activeTab === 'consulta'" class="tab-content">
        <div class="consulta-form">
          <h3>🔍 Consulta por Produto</h3>
          <p class="form-description">
            Digite o EAN ou descrição do produto para obter a ficha técnica canônica
          </p>
          
          <form @submit.prevent="consultarProduto" class="canonika-form">
            <div class="form-row">
              <div class="form-group">
                <label for="ean">EAN (Código de Barras)</label>
                <input
                  type="text"
                  id="ean"
                  v-model="consultaForm.ean"
                  placeholder="Ex: 7891234567890"
                  class="form-control"
                  :disabled="isLoading"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="description">Descrição (Opcional)</label>
                <input
                  type="text"
                  id="description"
                  v-model="consultaForm.description"
                  placeholder="Ex: Notebook Lenovo Ideapad 3 15"
                  class="form-control"
                  :disabled="isLoading"
                >
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!consultaForm.ean || isLoading"
              >
                <i class="fas fa-search"></i>
                {{ isLoading ? 'Consultando...' : '🔍 Consultar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tab Upload NFe -->
      <div v-if="activeTab === 'upload'" class="tab-content">
        <div class="upload-form">
          <h3>📄 Upload de Nota Fiscal</h3>
          <p class="form-description">
            Faça upload de um arquivo XML da NFe para processar emitente e produtos
          </p>
          
          <div class="upload-area" @click="triggerFileInput">
            <div class="upload-content">
              <i class="fas fa-file-upload upload-icon"></i>
              <p class="upload-text">
                Clique para selecionar arquivo XML da NFe
              </p>
              <p class="upload-hint">
                ou arraste o arquivo aqui
              </p>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept=".xml"
              @change="handleFileUpload"
              style="display: none"
            >
          </div>
          
          <div v-if="selectedFile" class="file-info">
            <i class="fas fa-file-code"></i>
            <span>{{ selectedFile.name }}</span>
            <button @click="processarNFe" class="btn btn-primary" :disabled="isLoading">
              <i class="fas fa-cogs"></i>
              {{ isLoading ? 'Processando...' : '⚙️ Processar NFe' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultados -->
    <div v-if="resultados" class="diver-results">
      <div class="results-header">
        <h3>📊 Resultados da Consulta</h3>
        <button @click="limparResultados" class="btn btn-secondary">
          <i class="fas fa-times"></i>
          Limpar
        </button>
      </div>

      <!-- Produto -->
      <div v-if="resultados.produto" class="result-section">
        <h4>📦 Produto</h4>
        <div class="product-card">
          <div class="product-header">
            <h5>{{ resultados.produto.nome }}</h5>
            <span class="product-ean">{{ resultados.produto.ean }}</span>
          </div>
          
          <div class="product-details">
            <div class="detail-row">
              <span class="detail-label">Fabricante:</span>
              <span class="detail-value">{{ resultados.produto.fabricante }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Categoria:</span>
              <span class="detail-value">{{ resultados.produto.categoria }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">NCM:</span>
              <span class="detail-value">{{ resultados.produto.ncm }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Peso:</span>
              <span class="detail-value">{{ resultados.produto.peso_kg }} kg</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Dimensões:</span>
              <span class="detail-value">
                {{ resultados.produto.dimensoes.largura_cm }} x 
                {{ resultados.produto.dimensoes.altura_cm }} x 
                {{ resultados.produto.dimensoes.profundidade_cm }} cm
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fonte:</span>
              <span class="detail-value">{{ resultados.produto.fonte }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empresa -->
      <div v-if="resultados.empresa" class="result-section">
        <h4>🏢 Empresa</h4>
        <div class="company-card">
          <div class="company-header">
            <h5>{{ resultados.empresa.razao_social }}</h5>
            <span class="company-cnpj">{{ resultados.empresa.cnpj }}</span>
          </div>
          
          <div class="company-details">
            <div class="detail-row">
              <span class="detail-label">Nome Fantasia:</span>
              <span class="detail-value">{{ resultados.empresa.nome_fantasia }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Localização:</span>
              <span class="detail-value">{{ resultados.empresa.municipio }} - {{ resultados.empresa.uf }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fonte:</span>
              <span class="detail-value">{{ resultados.empresa.fonte }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Múltiplos Produtos (NFe) -->
      <div v-if="resultados.produtos && resultados.produtos.length > 0" class="result-section">
        <h4>📦 Produtos da NFe ({{ resultados.produtos.length }})</h4>
        <div class="products-grid">
          <div v-for="produto in resultados.produtos" :key="produto.ean" class="product-card">
            <div class="product-header">
              <h5>{{ produto.nome }}</h5>
              <span class="product-ean">{{ produto.ean }}</span>
            </div>
            
            <div class="product-details">
              <div class="detail-row">
                <span class="detail-label">Fabricante:</span>
                <span class="detail-value">{{ produto.fabricante }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Categoria:</span>
                <span class="detail-value">{{ produto.categoria }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fonte:</span>
                <span class="detail-value">{{ produto.fonte }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Erro -->
      <div v-if="resultados.error" class="error-section">
        <div class="error-card">
          <i class="fas fa-exclamation-triangle"></i>
          <h4>Erro na Consulta</h4>
          <p>{{ resultados.error }}</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>🤿 Mergulhando na base canônica...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiverView',
  data() {
    return {
      activeTab: 'consulta',
      isLoading: false,
      consultaForm: {
        ean: '',
        description: ''
      },
      selectedFile: null,
      resultados: null,
      apiBaseUrl: 'http://localhost:7723'
    }
  },
  methods: {
    async consultarProduto() {
      if (!this.consultaForm.ean) return;
      
      this.isLoading = true;
      this.resultados = null;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/diver/consulta`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ean: this.consultaForm.ean,
            description: this.consultaForm.description
          })
        });
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }
        
        this.resultados = await response.json();
        
      } catch (error) {
        console.error('Erro na consulta:', error);
        this.resultados = {
          error: `Erro na consulta: ${error.message}`
        };
      } finally {
        this.isLoading = false;
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'text/xml') {
        this.selectedFile = file;
      } else {
        alert('Por favor, selecione um arquivo XML válido.');
      }
    },

    async processarNFe() {
      if (!this.selectedFile) return;
      
      this.isLoading = true;
      this.resultados = null;
      
      try {
        const xmlContent = await this.readFileAsText(this.selectedFile);
        
        const response = await fetch(`${this.apiBaseUrl}/diver/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            xml_content: xmlContent
          })
        });
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }
        
        this.resultados = await response.json();
        
      } catch (error) {
        console.error('Erro no processamento:', error);
        this.resultados = {
          error: `Erro no processamento: ${error.message}`
        };
      } finally {
        this.isLoading = false;
      }
    },

    readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    },

    limparResultados() {
      this.resultados = null;
      this.consultaForm.ean = '';
      this.consultaForm.description = '';
      this.selectedFile = null;
    }
  }
}
</script>

<style scoped>
.diver-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.diver-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
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

.diver-tabs {
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
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.diver-content {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.tab-content {
  max-width: 800px;
  margin: 0 auto;
}

.consulta-form h3,
.upload-form h3 {
  margin: 0 0 1rem 0;
  color: #e2e8f0;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-description {
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
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
  background: rgba(15, 23, 42, 0.7) !important;
}

.form-control::placeholder {
  color: #64748b !important;
  opacity: 1 !important;
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
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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

.upload-area {
  border: 2px dashed #475569;
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(15, 23, 42, 0.3);
}

.upload-area:hover {
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.5);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  font-size: 3rem;
  color: #64748b;
}

.upload-text {
  color: #e2e8f0;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

.upload-hint {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  color: #e2e8f0;
}

.file-info i {
  color: #3b82f6;
}

.diver-results {
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

.result-section {
  margin-bottom: 2rem;
}

.result-section h4 {
  color: #e2e8f0;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.product-card,
.company-card {
  background: rgba(15, 23, 42, 0.7);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #475569;
}

.product-header,
.company-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #475569;
}

.product-header h5,
.company-header h5 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.1rem;
  font-weight: 600;
}

.product-ean,
.company-cnpj {
  color: #94a3b8;
  font-size: 0.9rem;
  font-family: monospace;
}

.product-details,
.company-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
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
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .diver-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .diver-tabs {
    flex-direction: column;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style> 