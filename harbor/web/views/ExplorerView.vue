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
              placeholder="Digite o nome do produto, EAN, SKU ou descrição..."
            />
            <button @click="performProductSearch" class="search-button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Pesquisas Recentes (Sempre Visível) -->
        <div v-if="searchHistory.length > 0" class="recent-searches-section">
          <div class="section-header">
            <h3><i class="fas fa-clock"></i> Pesquisas Recentes</h3>
            <button @click="clearHistory" class="clear-button">
              <i class="fas fa-trash"></i>
              Limpar
            </button>
          </div>
          
          <div class="recent-searches-grid">
            <div
              v-for="item in searchHistory"
              :key="item.id"
              @click="loadHistoryItem(item)"
              class="recent-search-card"
            >
              <div class="search-card-content">
                <div class="search-icon-small">
                  <i class="fas fa-search"></i>
                </div>
                <div class="search-info">
                  <h4>{{ item.query }}</h4>
                  <p>{{ formatDate(item.date) }} • {{ formatTime(item.date) }}</p>
                </div>
                <div class="search-actions">
                  <button @click.stop="loadHistoryItem(item)" class="btn-recent-search">
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resultados de Pesquisa (Destaque Principal) -->
        <div v-if="productResults.length > 0" class="search-results-section">
          <div class="results-header">
            <div class="results-title">
              <h2><i class="fas fa-star"></i> Resultados Encontrados</h2>
              <span class="results-count">{{ productResults.length }} produto{{ productResults.length > 1 ? 's' : '' }} canônico{{ productResults.length > 1 ? 's' : '' }}</span>
            </div>
            <button @click="clearProductResults" class="clear-button">
              <i class="fas fa-times"></i>
              Limpar Resultados
            </button>
          </div>
          
          <div class="results-showcase">
            <div
              v-for="product in productResults"
              :key="product.id"
              class="product-showcase-card"
            >
              <div class="product-header">
                <div class="product-badge">
                  <i class="fas fa-box"></i>
                </div>
                <div class="product-title">
                  <h3>{{ product.name }}</h3>
                  <div class="product-meta">
                    <span class="brand">{{ product.brand }}</span>
                    <span class="category">{{ product.category }}</span>
                  </div>
                </div>
                <div class="product-actions">
                  <button @click="viewProductDetails(product)" class="btn-action primary">
                    <i class="fas fa-eye"></i>
                    Ver Detalhes
                  </button>
                  <button @click="askDiverAboutProduct(product)" class="btn-action secondary">
                    <i class="fas fa-robot"></i>
                    Perguntar ao Diver
                  </button>
                </div>
              </div>
              
              <div class="product-content">
                <p class="product-description">{{ product.description }}</p>
                
                <div class="product-highlights">
                  <div class="highlight-item">
                    <i class="fas fa-barcode"></i>
                    <span><strong>EAN:</strong> {{ product.ean }}</span>
                  </div>
                  <div class="highlight-item">
                    <i class="fas fa-tag"></i>
                    <span><strong>SKU:</strong> {{ product.sku || 'N/A' }}</span>
                  </div>
                  <div class="highlight-item">
                    <i class="fas fa-building"></i>
                    <span><strong>Fabricante:</strong> {{ product.manufacturer }}</span>
                  </div>
                </div>
                
                <div class="product-specs">
                  <div class="specs-grid">
                    <div class="spec-item">
                      <span class="spec-label">NCM</span>
                      <span class="spec-value">{{ product.ncm || 'N/A' }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">CEST</span>
                      <span class="spec-value">{{ product.cest || 'N/A' }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Dimensões</span>
                      <span class="spec-value">{{ product.length_cm }}×{{ product.width_cm }}×{{ product.height_cm }}cm</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Peso</span>
                      <span class="spec-value">{{ product.weight_kg }}kg</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Material</span>
                      <span class="spec-value">{{ product.material || 'N/A' }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Cor</span>
                      <span class="spec-value">{{ product.color || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="product.tags && product.tags.length > 0" class="product-tags">
                  <span v-for="tag in product.tags" :key="tag" class="tag-chip">
                    {{ tag }}
                  </span>
                </div>
                
                <div class="product-status">
                  <span class="status-indicator success">
                    <i class="fas fa-check-circle"></i>
                    {{ product.status || 'Ativo' }}
                  </span>
                  <span class="last-updated">
                    Atualizado em {{ formatDate(product.updated_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado Vazio - Sugestões -->
        <div v-if="!productResults.length && !searchQuery" class="empty-state">
          <div class="empty-content">
            <div class="empty-icon">
              <i class="fas fa-search"></i>
            </div>
            <h3>Pesquise Produtos Canônicos</h3>
            <p>Digite o nome, EAN, SKU ou descrição do produto que deseja encontrar</p>
            <div class="search-suggestions">
              <span class="suggestion">iPhone 15 Pro</span>
              <span class="suggestion">Samsung Galaxy</span>
              <span class="suggestion">MacBook Air</span>
              <span class="suggestion">190199267471</span>
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
      
      // Simular pesquisa de produtos canônicos
      this.productResults = [
        {
          id: 1,
          ean: '190199267471',
          sku: 'IPH15P256GB',
          name: 'iPhone 15 Pro 256GB',
          description: 'Smartphone Apple iPhone 15 Pro com chip A17 Pro, 256GB de armazenamento, câmera tripla de 48MP, tela Super Retina XDR de 6.1 polegadas',
          brand: 'Apple',
          manufacturer: 'Apple Inc.',
          category: 'Smartphones',
          subcategories: ['Eletrônicos', 'Telefonia'],
          ncm: '8517.13.00',
          cest: '28.038.00',
          weight_kg: 0.187,
          width_cm: 7.81,
          height_cm: 15.95,
          length_cm: 0.78,
          color: 'Titanium Natural',
          size: '6.1"',
          material: 'Titanium',
          gender: 'Unissex',
          age_group: 'Adulto',
          images: ['https://example.com/iphone15pro1.jpg', 'https://example.com/iphone15pro2.jpg'],
          tags: ['smartphone', 'apple', 'iphone', '5g', 'camera', 'titanium'],
          status: 'Ativo',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          ean: '8806092291234',
          sku: 'SGS24U256GB',
          name: 'Samsung Galaxy S24 Ultra',
          description: 'Smartphone Samsung Galaxy S24 Ultra com S Pen integrada, 256GB de armazenamento, câmera de 200MP, tela Dynamic AMOLED 2X de 6.8 polegadas',
          brand: 'Samsung',
          manufacturer: 'Samsung Electronics',
          category: 'Smartphones',
          subcategories: ['Eletrônicos', 'Telefonia'],
          ncm: '8517.13.00',
          cest: '28.038.00',
          weight_kg: 0.232,
          width_cm: 7.89,
          height_cm: 16.32,
          length_cm: 0.89,
          color: 'Titanium Gray',
          size: '6.8"',
          material: 'Titanium',
          gender: 'Unissex',
          age_group: 'Adulto',
          images: ['https://example.com/s24ultra1.jpg', 'https://example.com/s24ultra2.jpg'],
          tags: ['smartphone', 'samsung', 'galaxy', '5g', 's-pen', 'camera'],
          status: 'Ativo',
          updated_at: '2024-01-14T15:30:00Z'
        },
        {
          id: 3,
          ean: '190199267472',
          sku: 'MBAIRM213',
          name: 'MacBook Air M2 13"',
          description: 'Notebook Apple MacBook Air com chip M2, 13 polegadas, 256GB SSD, tela Retina, até 18 horas de bateria',
          brand: 'Apple',
          manufacturer: 'Apple Inc.',
          category: 'Notebooks',
          subcategories: ['Eletrônicos', 'Computadores'],
          ncm: '8471.30.00',
          cest: '28.038.00',
          weight_kg: 1.24,
          width_cm: 30.41,
          height_cm: 21.24,
          length_cm: 1.13,
          color: 'Space Gray',
          size: '13"',
          material: 'Alumínio',
          gender: 'Unissex',
          age_group: 'Adulto',
          images: ['https://example.com/macbookair1.jpg', 'https://example.com/macbookair2.jpg'],
          tags: ['notebook', 'apple', 'macbook', 'm2', 'laptop', 'macos'],
          status: 'Ativo',
          updated_at: '2024-01-13T09:15:00Z'
        },
        {
          id: 4,
          ean: '190199267473',
          sku: 'AIRPODSPRO2',
          name: 'AirPods Pro 2ª Geração',
          description: 'Fones de ouvido sem fio com cancelamento de ruído ativo, áudio espacial, resistentes a água e suor',
          brand: 'Apple',
          manufacturer: 'Apple Inc.',
          category: 'Fones de Ouvido',
          subcategories: ['Eletrônicos', 'Áudio'],
          ncm: '8518.30.00',
          cest: '28.038.00',
          weight_kg: 0.005,
          width_cm: 2.39,
          height_cm: 3.09,
          length_cm: 2.39,
          color: 'Branco',
          size: 'Padrão',
          material: 'Plástico',
          gender: 'Unissex',
          age_group: 'Adulto',
          images: ['https://example.com/airpodspro1.jpg', 'https://example.com/airpodspro2.jpg'],
          tags: ['fones', 'apple', 'airpods', 'wireless', 'noise-cancelling', 'bluetooth'],
          status: 'Ativo',
          updated_at: '2024-01-12T14:45:00Z'
        }
      ].filter(product => 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.ean.includes(this.searchQuery) ||
        (product.sku && product.sku.toLowerCase().includes(this.searchQuery.toLowerCase()))
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
        text: `Este produto é da categoria "${product.category}" e é da marca "${product.brand}". Ele tem EAN ${product.ean} e SKU ${product.sku}.`,
        type: 'diver',
        timestamp: new Date().toISOString()
      })
    },

    viewProductDetails(product) {
      this.showDiverChat = true
      this.diverMessages.push({
        id: Date.now(),
        text: `Detalhes completos do produto: ${product.name}`,
        type: 'human',
        timestamp: new Date().toISOString()
      })
      this.diverMessages.push({
        id: Date.now() + 1,
        text: `📱 **${product.name}**\n\n` +
              `**Informações Básicas:**\n` +
              `• EAN: ${product.ean}\n` +
              `• SKU: ${product.sku}\n` +
              `• Marca: ${product.brand}\n` +
              `• Fabricante: ${product.manufacturer}\n` +
              `• Categoria: ${product.category}\n\n` +
              `**Especificações Técnicas:**\n` +
              `• NCM: ${product.ncm}\n` +
              `• CEST: ${product.cest}\n` +
              `• Dimensões: ${product.length_cm}x${product.width_cm}x${product.height_cm}cm\n` +
              `• Peso: ${product.weight_kg}kg\n` +
              `• Material: ${product.material}\n` +
              `• Cor: ${product.color}\n\n` +
              `**Status:** ${product.status} (Atualizado em ${this.formatDate(product.updated_at)})`,
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

 .detail-row {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 15px;
   margin-bottom: 10px;
 }

 .detail-row:last-child {
   margin-bottom: 0;
 }

 .tags-section {
   margin-top: 15px;
   padding-top: 15px;
   border-top: 1px solid rgba(148, 163, 184, 0.2);
 }

 .tags-section h5 {
   color: #e2e8f0;
   margin: 0 0 10px 0;
   font-size: 0.9rem;
 }

 .tags-list {
   display: flex;
   flex-wrap: wrap;
   gap: 8px;
 }

 .tag {
   background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
   color: white;
   padding: 4px 8px;
   border-radius: 12px;
   font-size: 0.8rem;
   font-weight: 500;
 }

 /* Estilos para Pesquisas Recentes */
 .recent-searches-section {
   margin-top: 30px;
   margin-bottom: 40px;
 }

 .section-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 20px;
 }

 .section-header h3 {
   color: #e2e8f0;
   margin: 0;
   display: flex;
   align-items: center;
   gap: 10px;
   font-size: 1.3rem;
 }

 .recent-searches-grid {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
   gap: 15px;
 }

 .recent-search-card {
   background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
   border: 1px solid #475569;
   border-radius: 12px;
   padding: 20px;
   cursor: pointer;
   transition: all 0.3s ease;
   position: relative;
   overflow: hidden;
 }

 .recent-search-card::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 3px;
   background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
 }

 .recent-search-card:hover {
   transform: translateY(-3px);
   box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
   border-color: #8b5cf6;
 }

 .search-card-content {
   display: flex;
   align-items: center;
   gap: 15px;
 }

 .search-icon-small {
   width: 40px;
   height: 40px;
   background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
   border-radius: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   color: white;
   font-size: 1rem;
 }

 .search-info {
   flex: 1;
 }

 .search-info h4 {
   color: #e2e8f0;
   margin: 0 0 5px 0;
   font-size: 1.1rem;
 }

 .search-info p {
   color: #94a3b8;
   margin: 0;
   font-size: 0.9rem;
 }

 .search-actions {
   display: flex;
   gap: 8px;
 }

 .btn-recent-search {
   background: rgba(139, 92, 246, 0.1);
   color: #8b5cf6;
   border: 1px solid rgba(139, 92, 246, 0.2);
   border-radius: 8px;
   padding: 8px 12px;
   cursor: pointer;
   transition: all 0.2s ease;
 }

 .btn-recent-search:hover {
   background: rgba(139, 92, 246, 0.2);
   transform: scale(1.05);
 }

 /* Estilos para Resultados de Pesquisa */
 .search-results-section {
   margin-top: 40px;
 }

 .results-title {
   display: flex;
   align-items: center;
   gap: 15px;
 }

 .results-title h2 {
   color: #e2e8f0;
   margin: 0;
   font-size: 1.8rem;
   display: flex;
   align-items: center;
   gap: 10px;
 }

 .results-count {
   background: linear-gradient(135deg, #10b981 0%, #059669 100%);
   color: white;
   padding: 6px 12px;
   border-radius: 20px;
   font-size: 0.9rem;
   font-weight: 600;
 }

 .results-showcase {
   display: flex;
   flex-direction: column;
   gap: 25px;
   margin-top: 25px;
 }

 .product-showcase-card {
   background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
   border: 1px solid #475569;
   border-radius: 16px;
   padding: 25px;
   transition: all 0.3s ease;
   position: relative;
   overflow: hidden;
 }

 .product-showcase-card::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 4px;
   background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
 }

 .product-showcase-card:hover {
   transform: translateY(-5px);
   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
   border-color: #3b82f6;
 }

 .product-header {
   display: flex;
   align-items: center;
   gap: 20px;
   margin-bottom: 20px;
 }

 .product-badge {
   width: 60px;
   height: 60px;
   background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
   border-radius: 12px;
   display: flex;
   align-items: center;
   justify-content: center;
   color: white;
   font-size: 1.5rem;
 }

 .product-title h3 {
   color: #e2e8f0;
   margin: 0 0 8px 0;
   font-size: 1.4rem;
   font-weight: 600;
 }

 .product-meta {
   display: flex;
   gap: 15px;
 }

 .brand {
   background: rgba(59, 130, 246, 0.1);
   color: #3b82f6;
   padding: 4px 8px;
   border-radius: 6px;
   font-size: 0.8rem;
   font-weight: 600;
 }

 .category {
   background: rgba(16, 185, 129, 0.1);
   color: #10b981;
   padding: 4px 8px;
   border-radius: 6px;
   font-size: 0.8rem;
   font-weight: 600;
 }

 .product-actions {
   margin-left: auto;
   display: flex;
   gap: 12px;
 }

 .btn-action {
   padding: 10px 16px;
   border: none;
   border-radius: 8px;
   cursor: pointer;
   font-size: 0.9rem;
   font-weight: 600;
   display: flex;
   align-items: center;
   gap: 8px;
   transition: all 0.2s ease;
 }

 .btn-action.primary {
   background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
   color: white;
 }

 .btn-action.secondary {
   background: rgba(16, 185, 129, 0.1);
   color: #10b981;
   border: 1px solid rgba(16, 185, 129, 0.2);
 }

 .btn-action:hover {
   transform: translateY(-2px);
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
 }

 .product-content {
   color: #e2e8f0;
 }

 .product-description {
   margin-bottom: 20px;
   line-height: 1.6;
   font-size: 1rem;
   color: #cbd5e1;
 }

 .product-highlights {
   display: flex;
   gap: 25px;
   margin-bottom: 25px;
   padding: 20px;
   background: rgba(15, 23, 42, 0.3);
   border-radius: 12px;
 }

 .highlight-item {
   display: flex;
   align-items: center;
   gap: 8px;
   font-size: 0.9rem;
   color: #94a3b8;
 }

 .highlight-item i {
   color: #3b82f6;
   font-size: 1rem;
 }

 .product-specs {
   margin-bottom: 25px;
 }

 .specs-grid {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
   gap: 15px;
   padding: 20px;
   background: rgba(15, 23, 42, 0.2);
   border-radius: 12px;
 }

 .spec-item {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px 15px;
   background: rgba(30, 41, 59, 0.5);
   border-radius: 8px;
 }

 .spec-label {
   color: #94a3b8;
   font-size: 0.85rem;
   font-weight: 600;
 }

 .spec-value {
   color: #e2e8f0;
   font-size: 0.9rem;
   font-weight: 500;
 }

 .product-tags {
   display: flex;
   flex-wrap: wrap;
   gap: 8px;
   margin-bottom: 20px;
 }

 .tag-chip {
   background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
   color: white;
   padding: 6px 12px;
   border-radius: 20px;
   font-size: 0.8rem;
   font-weight: 500;
   transition: all 0.2s ease;
 }

 .tag-chip:hover {
   transform: scale(1.05);
   box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
 }

 .product-status {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 15px 20px;
   background: rgba(15, 23, 42, 0.4);
   border-radius: 10px;
 }

 .status-indicator {
   display: flex;
   align-items: center;
   gap: 8px;
   padding: 6px 12px;
   border-radius: 6px;
   font-size: 0.85rem;
   font-weight: 600;
 }

 .status-indicator.success {
   background-color: rgba(10, 100, 50, 0.1);
   color: #10b981;
   border: 1px solid rgba(10, 100, 50, 0.2);
 }

 .last-updated {
   color: #94a3b8;
   font-size: 0.85rem;
 }

 /* Estado Vazio */
 .empty-state {
   margin-top: 60px;
   text-align: center;
 }

 .empty-content {
   max-width: 500px;
   margin: 0 auto;
 }

 .empty-icon {
   width: 80px;
   height: 80px;
   background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   margin: 0 auto 30px;
   color: white;
   font-size: 2rem;
 }

 .empty-content h3 {
   color: #e2e8f0;
   margin: 0 0 15px 0;
   font-size: 1.5rem;
 }

 .empty-content p {
   color: #94a3b8;
   margin: 0 0 30px 0;
   font-size: 1rem;
   line-height: 1.5;
 }

 .search-suggestions {
   display: flex;
   flex-wrap: wrap;
   gap: 10px;
   justify-content: center;
 }

 .suggestion {
   background: rgba(59, 130, 246, 0.1);
   color: #3b82f6;
   padding: 8px 16px;
   border-radius: 20px;
   font-size: 0.9rem;
   cursor: pointer;
   transition: all 0.2s ease;
   border: 1px solid rgba(59, 130, 246, 0.2);
 }

 .suggestion:hover {
   background: rgba(59, 130, 246, 0.2);
   transform: translateY(-1px);
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