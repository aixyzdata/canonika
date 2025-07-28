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
        <div v-if="!productResults.length && !searchQuery.trim()" class="empty-state">
          <div class="empty-content">
            <div class="empty-icon">
              <i class="fas fa-search"></i>
            </div>
            <h3>Pesquise Produtos Canônicos</h3>
            <p>Digite o nome, EAN, SKU ou descrição do produto que deseja encontrar</p>
            <div class="search-suggestions">
              <span class="suggestion" @click="selectSuggestion('iPhone 15 Pro')">iPhone 15 Pro</span>
              <span class="suggestion" @click="selectSuggestion('Samsung Galaxy')">Samsung Galaxy</span>
              <span class="suggestion" @click="selectSuggestion('MacBook Air')">MacBook Air</span>
              <span class="suggestion" @click="selectSuggestion('190199267471')">190199267471</span>
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
            
          </div>
          
          <div class="action-buttons">
            <button @click="viewNFeDetails" class="btn btn-success">
              <i class="fas fa-eye"></i>
              Ver Detalhes
            </button>
            <button @click="clearCanonization" class="btn btn-secondary">
              <i class="fas fa-times"></i>
              Nova Canonização
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Produto -->
    <div v-if="showProductDetails" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;" @click="closeProductDetails">
      <div style="background: #1e293b; border: 1px solid #475569; border-radius: 8px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; color: white;" @click.stop>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #475569;">
          <h3 style="margin: 0; color: #e2e8f0;">
            <i class="fas fa-box"></i> {{ selectedProduct?.name }}
          </h3>
          <button @click="closeProductDetails" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div style="padding: 20px;">
          <div style="display: grid; gap: 20px;">
            <!-- Informações Básicas -->
            <div style="background: rgba(15, 23, 42, 0.3); border-radius: 8px; padding: 15px; border: 1px solid #475569;">
              <h4 style="color: #e2e8f0; margin: 0 0 15px 0;">
                <i class="fas fa-info-circle"></i> Informações Básicas
              </h4>
              <div style="display: grid; gap: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">EAN:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.ean }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">SKU:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.sku || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Marca:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.brand || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Fabricante:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.manufacturer || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Categoria:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.category || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Status:</span>
                  <span style="color: #10b981; font-weight: 600;">{{ selectedProduct?.status || 'Ativo' }}</span>
                </div>
              </div>
            </div>

            <!-- Especificações Técnicas -->
            <div style="background: rgba(15, 23, 42, 0.3); border-radius: 8px; padding: 15px; border: 1px solid #475569;">
              <h4 style="color: #e2e8f0; margin: 0 0 15px 0;">
                <i class="fas fa-cogs"></i> Especificações Técnicas
              </h4>
              <div style="display: grid; gap: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">NCM:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.ncm || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">CEST:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.cest || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Dimensões:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.length_cm }}×{{ selectedProduct?.width_cm }}×{{ selectedProduct?.height_cm }}cm</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Peso:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.weight_kg }}kg</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Material:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.material || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Cor:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.color || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Características -->
            <div style="background: rgba(15, 23, 42, 0.3); border-radius: 8px; padding: 15px; border: 1px solid #475569;">
              <h4 style="color: #e2e8f0; margin: 0 0 15px 0;">
                <i class="fas fa-tags"></i> Características
              </h4>
              <div style="display: grid; gap: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Tamanho:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.size || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Gênero:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.gender || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Faixa Etária:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.age_group || 'N/A' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Subcategorias:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ selectedProduct?.subcategories ? selectedProduct?.subcategories.join(', ') : 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="selectedProduct?.tags && selectedProduct?.tags.length > 0" style="background: rgba(15, 23, 42, 0.3); border-radius: 8px; padding: 15px; border: 1px solid #475569;">
              <h4 style="color: #e2e8f0; margin: 0 0 15px 0;">
                <i class="fas fa-tags"></i> Tags
              </h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span v-for="tag in selectedProduct?.tags" :key="tag" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; border: 1px solid rgba(59, 130, 246, 0.2);">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Descrição -->
            <div v-if="selectedProduct?.description" style="background: rgba(15, 23, 42, 0.3); border-radius: 8px; padding: 15px; border: 1px solid #475569;">
              <h4 style="color: #e2e8f0; margin: 0 0 15px 0;">
                <i class="fas fa-align-left"></i> Descrição
              </h4>
              <p style="color: #e2e8f0; line-height: 1.6; margin: 0;">{{ selectedProduct?.description }}</p>
            </div>

            <!-- Atualização -->
            <div style="background: rgba(15, 23, 42, 0.3); border-radius: 8px; padding: 15px; border: 1px solid #475569;">
              <h4 style="color: #e2e8f0; margin: 0 0 15px 0;">
                <i class="fas fa-clock"></i> Informações de Atualização
              </h4>
              <div style="display: grid; gap: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Última Atualização:</span>
                  <span style="color: #e2e8f0; font-weight: 600;">{{ formatDate(selectedProduct?.updated_at) }}</span>
                </div>
              </div>
            </div>
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
      productResults: [],
      activeJourney: 'search', // 'search' or 'canonize'
      canonizedNFe: null,
      showProductDetails: false,
      selectedProduct: null
    }
  },
  methods: {
    performProductSearch() {
      console.log('🔍 Executando pesquisa:', this.searchQuery)
      if (!this.searchQuery.trim()) return
      
      // Simular pesquisa de produtos canônicos com todos os atributos do schema
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
      console.log('📊 Resultados encontrados:', this.productResults.length)
    },

         clearProductResults() {
       this.productResults = []
       this.searchQuery = ''
     },

     

    viewProductDetails(product) {
      console.log('🔍 viewProductDetails chamada:', product)
      console.log('🔍 showProductDetails antes:', this.showProductDetails)
      this.selectedProduct = product
      this.showProductDetails = true
      console.log('🔍 showProductDetails depois:', this.showProductDetails)
      console.log('🔍 selectedProduct:', this.selectedProduct)
      
      // Debug adicional
      setTimeout(() => {
        console.log('🔍 showProductDetails após timeout:', this.showProductDetails)
        console.log('🔍 Modal deveria estar visível:', this.showProductDetails)
      }, 100)
    },

    selectSuggestion(suggestion) {
      console.log('🔍 Sugestão selecionada:', suggestion)
      this.searchQuery = suggestion
      this.performProductSearch()
    },

    closeProductDetails() {
      console.log('🔍 closeProductDetails chamada')
      this.showProductDetails = false
      this.selectedProduct = null
    },



    viewNFeDetails() {
      // Implementar visualização de detalhes da NFe
      console.log('Visualizando detalhes da NFe:', this.canonizedNFe)
      // Por enquanto, apenas mostra no console
      alert('Funcionalidade de detalhes da NFe será implementada em breve!')
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
    },

    clearCanonization() {
      this.canonizedNFe = null
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
   padding: 12px 20px;
   border: none;
   border-radius: 10px;
   cursor: pointer;
   font-size: 0.9rem;
   font-weight: 600;
   display: flex;
   align-items: center;
   gap: 8px;
   transition: all 0.3s ease;
   text-decoration: none;
   white-space: nowrap;
 }

 .btn-action.primary {
   background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
   color: white;
   box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
 }

 .btn-action.primary:hover {
   background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
   transform: translateY(-2px);
   box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
 }

 .btn-action.secondary {
   background: rgba(16, 185, 129, 0.1);
   color: #10b981;
   border: 1px solid rgba(16, 185, 129, 0.2);
 }

 .btn-action.secondary:hover {
   background: rgba(16, 185, 129, 0.2);
   transform: translateY(-2px);
   box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
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
  
    
}
</style> 