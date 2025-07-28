<template>
  <div class="tollgate-view">
    <div class="explorer-content">
      <!-- Logo e Título -->
      <div class="explorer-header">
        <div class="explorer-logo">
          <i class="fas fa-compass"></i>
          <span class="logo-text">Explorer</span>
        </div>
        <p class="explorer-subtitle">Pesquise produtos ou canonize notas fiscais</p>
      </div>

      <!-- Seleção de Jornada -->
      <div class="journey-selector">
        <div class="journey-tabs">
          <button 
            @click="activeJourney = 'search'" 
            :class="['journey-tab', { active: activeJourney === 'search' }]"
          >
            <i class="fas fa-search"></i>
            Pesquisar Produto
          </button>
          <button 
            @click="activeJourney = 'canonize'" 
            :class="['journey-tab', { active: activeJourney === 'canonize' }]"
          >
            <i class="fas fa-file-invoice"></i>
            Canonizar NFe
          </button>
        </div>
      </div>

      <!-- Jornada: Pesquisar Produto -->
      <div v-if="activeJourney === 'search'" class="journey-content">
        <!-- Barra de Pesquisa -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="searchQuery"
              @keyup.enter="performProductSearch"
              type="text"
              class="search-input"
              placeholder="Digite o nome do produto, código de barras..."
            />
            <button @click="performProductSearch" class="search-button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Resultados de Produtos -->
        <div v-if="productResults.length > 0" class="results-section">
          <div class="results-header">
            <h3>Produtos Encontrados ({{ productResults.length }})</h3>
            <button @click="clearProductResults" class="clear-button">
              <i class="fas fa-times"></i>
              Limpar
            </button>
          </div>
          
          <div class="results-grid">
            <div
              v-for="product in productResults"
              :key="product.id"
              class="service-card product-card"
            >
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-box"></i>
                </div>
                <div class="card-title">
                  <h4>{{ product.name }}</h4>
                  <span class="card-subtitle">{{ product.category }}</span>
                </div>
                <div class="card-actions">
                  <button @click="askDiverAboutProduct(product)" class="btn btn-sm btn-success">
                    <i class="fas fa-question"></i>
                    Perguntar ao Diver
                  </button>
                </div>
              </div>
              
              <div class="card-content">
                <p class="card-description">{{ product.description }}</p>
                
                <div class="card-meta">
                  <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span>R$ {{ product.price }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-barcode"></i>
                    <span>{{ product.barcode }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-building"></i>
                    <span>{{ product.brand }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Histórico de Pesquisas -->
        <div v-if="searchHistory.length > 0 && !productResults.length" class="history-section">
          <div class="results-header">
            <h3>Pesquisas Recentes</h3>
            <button @click="clearHistory" class="clear-button">
              <i class="fas fa-trash"></i>
              Limpar Histórico
            </button>
          </div>
          
          <div class="results-grid">
            <div
              v-for="item in searchHistory"
              :key="item.id"
              @click="loadHistoryItem(item)"
              class="service-card history-card"
            >
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-history"></i>
                </div>
                <div class="card-title">
                  <h4>{{ item.query }}</h4>
                  <span class="card-subtitle">Pesquisa Anterior</span>
                </div>
                <div class="card-actions">
                  <button @click.stop="loadHistoryItem(item)" class="btn btn-sm btn-primary">
                    <i class="fas fa-search"></i>
                  </button>
                  <button @click.stop="removeHistoryItem(item)" class="btn btn-sm btn-danger">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              
              <div class="card-content">
                <div class="card-meta">
                  <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>{{ formatDate(item.date) }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span>{{ formatTime(item.date) }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-search"></i>
                    <span>{{ item.query.length }} caracteres</span>
                  </div>
                </div>
                
                <div class="card-details">
                  <div class="detail-item">
                    <strong>Tipo:</strong> Pesquisa de Produto
                  </div>
                  <div class="detail-item">
                    <strong>Status:</strong> 
                    <span class="status-badge info">
                      <i class="fas fa-check-circle"></i>
                      Concluída
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Jornada: Canonizar NFe -->
      <div v-if="activeJourney === 'canonize'" class="journey-content">
        <!-- Upload de NFe -->
        <div class="upload-section">
          <div class="upload-area" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
            <i class="fas fa-file-upload"></i>
            <p>Arraste uma NFe aqui ou clique para selecionar</p>
            <input type="file" ref="fileInput" @change="handleFileSelect" accept=".xml" style="display: none;" />
            <button @click="$refs.fileInput.click()" class="upload-button">Selecionar NFe</button>
          </div>
        </div>

        <!-- Botão para Carregar NFe Fake -->
        <div class="fake-nfe-section">
          <button @click="loadFakeNFe" class="fake-nfe-button">
            <i class="fas fa-magic"></i>
            Carregar NFe Fake para Demonstração
          </button>
          <p class="fake-nfe-info">NFe com dados reais de empresas e produtos existentes</p>
        </div>

        <!-- Resultado da Canonização -->
        <div v-if="canonizedNFe" class="canonization-result">
          <div class="result-header">
            <h3>NFe Canonizada</h3>
            <div class="status-badge success">
              <i class="fas fa-check-circle"></i>
              Canonização Concluída
            </div>
          </div>
          
          <div class="nfe-details">
            <div class="nfe-section">
              <h4>Informações da Nota</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <strong>Número:</strong> {{ canonizedNFe.number }}
                </div>
                <div class="detail-item">
                  <strong>Data Emissão:</strong> {{ formatDate(canonizedNFe.issueDate) }}
                </div>
                <div class="detail-item">
                  <strong>Valor Total:</strong> R$ {{ canonizedNFe.totalValue }}
                </div>
              </div>
            </div>
            
            <div class="nfe-section">
              <h4>Emitente</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <strong>Razão Social:</strong> {{ canonizedNFe.issuer.name }}
                </div>
                <div class="detail-item">
                  <strong>CNPJ:</strong> {{ canonizedNFe.issuer.cnpj }}
                </div>
              </div>
            </div>
            
            <div class="nfe-section">
              <h4>Produtos Canonizados</h4>
              <div class="products-list">
                <div
                  v-for="product in canonizedNFe.products"
                  :key="product.id"
                  class="product-item"
                >
                  <div class="product-info">
                    <h5>{{ product.name }}</h5>
                    <p>{{ product.description }}</p>
                  </div>
                  <div class="product-meta">
                    <span class="quantity">{{ product.quantity }}x</span>
                    <span class="price">R$ {{ product.unitPrice }}</span>
                    <span class="total">R$ {{ product.totalPrice }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="nfe-section">
              <h4>Análise do Diver</h4>
              <div class="diver-analysis">
                <div class="analysis-item">
                  <i class="fas fa-check-circle text-success"></i>
                  <span>Produtos identificados e categorizados</span>
                </div>
                <div class="analysis-item">
                  <i class="fas fa-check-circle text-success"></i>
                  <span>Empresas validadas na base de dados</span>
                </div>
                <div class="analysis-item">
                  <i class="fas fa-info-circle text-info"></i>
                  <span>Dados canonizados para uso interno</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button @click="askDiverAboutNFe" class="btn btn-success">
              <i class="fas fa-question"></i>
              Perguntar ao Diver
            </button>
            <button @click="clearCanonization" class="btn btn-secondary">
              <i class="fas fa-times"></i>
              Nova Canonização
            </button>
          </div>
        </div>
      </div>

      <!-- Chat com Diver -->
      <div v-if="showDiverChat" class="diver-chat">
        <div class="chat-header">
          <h4><i class="fas fa-robot"></i> Diver - Assistente IA</h4>
          <button @click="closeDiverChat" class="close-chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="chat-messages">
          <div
            v-for="message in diverMessages"
            :key="message.id"
            :class="['message', message.type]"
          >
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <input
            v-model="chatInput"
            @keyup.enter="sendMessageToDiver"
            type="text"
            placeholder="Digite sua pergunta..."
            class="chat-input-field"
          />
          <button @click="sendMessageToDiver" class="send-button">
            <i class="fas fa-paper-plane"></i>
          </button>
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
      productResults: [],
      searchHistory: [
        { id: 1, query: 'Produto XYZ-789', date: '2024-01-14' },
        { id: 2, query: 'Código 987654', date: '2024-01-13' }
      ],
      activeJourney: 'search', // 'search' or 'canonize'
      canonizedNFe: null,
      showDiverChat: false,
      diverMessages: [],
      chatInput: '',
      diver: {
        name: 'Diver',
        avatar: 'https://via.placeholder.com/50',
        isHuman: false
      }
    }
  },
  methods: {
    performProductSearch() {
      if (!this.searchQuery.trim()) return
      
      // Simular pesquisa de produtos
      this.productResults = [
        { id: 1, name: 'Produto A', category: 'Categoria 1', description: 'Descrição do Produto A', price: 10.50, barcode: '1234567890123', brand: 'Marca A' },
        { id: 2, name: 'Produto B', category: 'Categoria 2', description: 'Descrição do Produto B', price: 20.00, barcode: '9876543210987', brand: 'Marca B' },
        { id: 3, name: 'Produto C', category: 'Categoria 1', description: 'Descrição do Produto C', price: 5.75, barcode: '1122334455667', brand: 'Marca A' }
      ].filter(product => 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.barcode.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      this.addToHistory(this.searchQuery)
    },

         clearProductResults() {
       this.productResults = []
       this.searchQuery = ''
     },

     clearHistory() {
       this.searchHistory = []
     },

     removeHistoryItem(item) {
       const index = this.searchHistory.findIndex(historyItem => historyItem.id === item.id)
       if (index > -1) {
         this.searchHistory.splice(index, 1)
       }
     },

    askDiverAboutProduct(product) {
      this.showDiverChat = true
      this.diverMessages.push({
        id: Date.now(),
        text: `Você gostaria de saber mais sobre o produto "${product.name}"?`,
        type: 'human',
        timestamp: new Date().toISOString()
      })
      this.diverMessages.push({
        id: Date.now() + 1,
        text: `Este produto é da categoria "${product.category}" e custa R$ ${product.price}. Ele tem um código de barras ${product.barcode} e é da marca "${product.brand}".`,
        type: 'diver',
        timestamp: new Date().toISOString()
      })
    },

    askDiverAboutNFe() {
      this.showDiverChat = true
      this.diverMessages.push({
        id: Date.now(),
        text: 'Você gostaria de saber mais sobre a nota fiscal que acabou de canonizar?',
        type: 'human',
        timestamp: new Date().toISOString()
      })
      this.diverMessages.push({
        id: Date.now() + 1,
        text: `A nota fiscal Nº ${this.canonizedNFe.number} de emissão ${this.formatDate(this.canonizedNFe.issueDate)} tem um valor total de R$ ${this.canonizedNFe.totalValue}. A empresa emitente é ${this.canonizedNFe.issuer.name} (CNPJ: ${this.canonizedNFe.issuer.cnpj}).`,
        type: 'diver',
        timestamp: new Date().toISOString()
      })
    },

    loadFakeNFe() {
      this.canonizedNFe = {
        number: '12345678901234',
        issueDate: '2024-01-15T10:00:00',
        totalValue: 1250.00,
        issuer: {
          name: 'Empresa Exemplo Ltda',
          cnpj: '12.345.678/0001-90'
        },
        products: [
          { id: 1, name: 'Produto A', description: 'Descrição do Produto A', quantity: 2, unitPrice: 10.50, totalPrice: 21.00 },
          { id: 2, name: 'Produto B', description: 'Descrição do Produto B', quantity: 1, unitPrice: 20.00, totalPrice: 20.00 },
          { id: 3, name: 'Produto C', description: 'Descrição do Produto C', quantity: 3, unitPrice: 5.75, totalPrice: 17.25 }
        ]
      }
      this.showDiverChat = true
      this.diverMessages.push({
        id: Date.now(),
        text: 'Carregando NFe Fake...',
        type: 'diver',
        timestamp: new Date().toISOString()
      })
      setTimeout(() => {
        this.diverMessages.push({
          id: Date.now() + 1,
          text: `NFe Fake carregada com sucesso! Número: ${this.canonizedNFe.number}, Valor Total: R$ ${this.canonizedNFe.totalValue}.`,
          type: 'diver',
          timestamp: new Date().toISOString()
        })
      }, 1000)
    },

    clearCanonization() {
      this.canonizedNFe = null
      this.diverMessages = []
      this.chatInput = ''
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
      this.canonizedNFe = {
        number: '12345678901234',
        issueDate: '2024-01-15T10:00:00',
        totalValue: 1250.00,
        issuer: {
          name: 'Empresa Exemplo Ltda',
          cnpj: '12.345.678/0001-90'
        },
        products: [
          { id: 1, name: 'Produto A', description: 'Descrição do Produto A', quantity: 2, unitPrice: 10.50, totalPrice: 21.00 },
          { id: 2, name: 'Produto B', description: 'Descrição do Produto B', quantity: 1, unitPrice: 20.00, totalPrice: 20.00 },
          { id: 3, name: 'Produto C', description: 'Descrição do Produto C', quantity: 3, unitPrice: 5.75, totalPrice: 17.25 }
        ]
      }
      this.showDiverChat = true
      this.diverMessages.push({
        id: Date.now(),
        text: 'XML processado. Iniciando canonização...',
        type: 'diver',
        timestamp: new Date().toISOString()
      })
      setTimeout(() => {
        this.diverMessages.push({
          id: Date.now() + 1,
          text: `Canonização concluída! Número: ${this.canonizedNFe.number}, Valor Total: R$ ${this.canonizedNFe.totalValue}.`,
          type: 'diver',
          timestamp: new Date().toISOString()
        })
      }, 2000)
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR')
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: 'numeric', minute: 'numeric' })
    },

    sendMessageToDiver() {
      if (!this.chatInput.trim()) return
      this.diverMessages.push({
        id: Date.now(),
        text: this.chatInput,
        type: 'human',
        timestamp: new Date().toISOString()
      })
      this.chatInput = ''
      this.diverMessages.push({
        id: Date.now() + 1,
        text: 'Esta é uma resposta simulada do Diver. Em um cenário real, ele usaria uma API de IA para processar a pergunta.',
        type: 'diver',
        timestamp: new Date().toISOString()
      })
    },

    closeDiverChat() {
      this.showDiverChat = false
      this.diverMessages = []
      this.chatInput = ''
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
    },

    loadHistoryItem(item) {
      this.searchQuery = item.query
      this.performProductSearch()
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

.journey-selector {
  margin-bottom: 30px;
}

.journey-tabs {
  display: flex;
  gap: 10px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 10px;
  overflow: hidden;
}

.journey-tab {
  flex: 1;
  padding: 15px 25px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.journey-tab:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.journey-tab.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.journey-tab i {
  font-size: 1.1rem;
}

.journey-content {
  margin-top: 30px;
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

.fake-nfe-section {
  margin-top: 20px;
  text-align: center;
}

.fake-nfe-button {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.fake-nfe-button:hover {
  background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
  transform: translateY(-1px);
}

.fake-nfe-info {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 10px;
}

.canonization-result {
  margin-top: 30px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 10px;
  padding: 25px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.result-header h3 {
  color: #e2e8f0;
  margin: 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-badge.success {
  background-color: rgba(10, 100, 50, 0.1);
  color: #059669;
  border: 1px solid rgba(10, 100, 50, 0.2);
}

.status-badge.info {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.nfe-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.nfe-section h4 {
  color: #e2e8f0;
  margin-bottom: 15px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #94a3b8;
}

.detail-item strong {
  color: #e2e8f0;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
}

.product-info h5 {
  color: #e2e8f0;
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.product-info p {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-bottom: 5px;
}

.product-meta {
  display: flex;
  gap: 10px;
  font-size: 0.9rem;
  color: #94a3b8;
}

.diver-analysis {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.analysis-item i {
  font-size: 1rem;
}

.text-success {
  color: #10b981;
}

.text-info {
  color: #3b82f6;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.diver-chat {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 450px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-bottom: 1px solid #475569;
}

.chat-header h4 {
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-header i {
  font-size: 1.2rem;
  color: white;
}

.close-chat {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: white;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.close-chat:hover {
  transform: scale(1.1);
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.message.human {
  flex-direction: row-reverse;
}

.message.diver {
  flex-direction: row;
}

.message-content {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 10px;
  position: relative;
}

.message.human .message-content {
  background-color: #3b82f6;
  color: white;
}

.message.diver .message-content {
  background-color: #475569;
  color: #e2e8f0;
}

.message-text {
  margin-bottom: 5px;
  line-height: 1.4;
}

.message-time {
  font-size: 0.7rem;
  color: #94a3b8;
  text-align: right;
}

.message.human .message-time {
  text-align: left;
}

.chat-input {
  display: flex;
  padding: 15px 20px;
  background: #263238;
  border-top: 1px solid #475569;
}

.chat-input-field {
  flex-grow: 1;
  padding: 10px 15px;
  border: 1px solid #475569;
  border-radius: 20px;
  background: #374151;
  color: #e2e8f0;
  outline: none;
  transition: all 0.2s ease;
}

.chat-input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.send-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.send-button i {
  font-size: 1.1rem;
}

/* Estilos para o histórico com service-cards */
.history-section {
  margin-top: 30px;
}

.history-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #8b5cf6;
}

.history-card .card-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.history-card .card-subtitle {
  color: #a78bfa;
  font-size: 0.8rem;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

/* Estilos para service-cards */
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
  
  .diver-chat {
    width: 90%;
    height: 60%;
    bottom: 10px;
    right: 10px;
  }
}
</style> 