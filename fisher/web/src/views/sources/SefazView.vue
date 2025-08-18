<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão EXATO do template -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-building"></i>
        <div class="title-content">
          <h1>SEFAZ - Sistema de Escrituração Digital</h1>
          <p>Processamento avançado de arquivos CNPJ da Receita Federal</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-dot online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button @click="syncCnpjFiles" class="btn btn-primary btn-sm" :disabled="isProcessing">
          <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': isProcessing }"></i>
          {{ isProcessing ? 'Processando...' : 'Atualizar' }}
        </button>
        <button @click="exportData" class="btn btn-secondary btn-sm">
          <i class="fas fa-download me-2"></i>
          Exportar
        </button>
        <button @click="showUploadModal = true" class="btn btn-success btn-sm">
          <i class="fas fa-upload me-2"></i>
          Upload
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Dashboard de Métricas -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="canonika-section-title">
            <i class="fas fa-chart-line text-info me-2"></i>
            DASHBOARD DE MÉTRICAS
          </h3>
          <p class="section-description">
            Visão geral do processamento de dados CNPJ em tempo real.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-file-alt"></i>
                </div>
                <div class="card-title">
                  <h4>Arquivos Processados</h4>
                  <span class="card-subtitle">Total de arquivos CNPJ</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">ATIVO</span>
                </div>
              </div>
                             <div class="card-content">
                 <div class="metric-grid">
                   <div class="metric-item">
                     <span class="metric-value">{{ metrics.totalFiles }}</span>
                     <span class="metric-label">Arquivos no sistema</span>
                   </div>
                 </div>
               </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-database"></i>
                </div>
                <div class="card-title">
                  <h4>Registros Processados</h4>
                  <span class="card-subtitle">Total de empresas</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">ATIVO</span>
                </div>
              </div>
                             <div class="card-content">
                 <div class="metric-grid">
                   <div class="metric-item">
                     <span class="metric-value">{{ formatNumber(metrics.totalRecords) }}</span>
                     <span class="metric-label">Empresas cadastradas</span>
                   </div>
                 </div>
               </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="card-title">
                  <h4>Última Atualização</h4>
                  <span class="card-subtitle">Sincronização mais recente</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">ATIVO</span>
                </div>
              </div>
                             <div class="card-content">
                 <div class="metric-grid">
                   <div class="metric-item">
                     <span class="metric-value">{{ metrics.lastUpdate }}</span>
                     <span class="metric-label">Há {{ metrics.timeAgo }}</span>
                   </div>
                 </div>
               </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-tachometer-alt"></i>
                </div>
                <div class="card-title">
                  <h4>Performance</h4>
                  <span class="card-subtitle">Velocidade de processamento</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">ATIVO</span>
                </div>
              </div>
                             <div class="card-content">
                 <div class="metric-grid">
                   <div class="metric-item">
                     <span class="metric-value">{{ metrics.processingSpeed }}</span>
                     <span class="metric-label">registros/segundo</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Filtros Avançados -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="canonika-section-title">
            <i class="fas fa-filter text-warning me-2"></i>
            FILTROS AVANÇADOS
          </h3>
          <p class="section-description">
            Filtre os dados CNPJ por critérios específicos.
          </p>
        </div>
        
        <div class="section-content">
          <div class="row g-3 mb-3">
            <div class="col-md-3">
              <label class="form-label">Status do Arquivo:</label>
              <select v-model="filters.status" class="form-select">
                <option value="">Todos</option>
                <option value="Disponível">Disponível</option>
                <option value="Processando">Processando</option>
                <option value="Erro">Erro</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
            
            <div class="col-md-2">
              <label class="form-label">Período:</label>
              <select v-model="filters.period" class="form-select">
                <option value="">Todos</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            
            <div class="col-md-2">
              <label class="form-label">Tamanho:</label>
              <select v-model="filters.size" class="form-select">
                <option value="">Todos</option>
                <option value="small">Pequeno (< 1MB)</option>
                <option value="medium">Médio (1-2MB)</option>
                <option value="large">Grande (> 2MB)</option>
              </select>
            </div>
            
            <div class="col-md-3">
              <label class="form-label">Buscar:</label>
              <input 
                v-model="filters.search" 
                type="text" 
                class="form-control" 
                placeholder="Nome do arquivo..."
              >
            </div>
            
            <div class="col-md-2 d-flex align-items-end">
              <div class="d-flex gap-2">
                <button @click="applyFilters" class="btn btn-primary btn-sm">
                  <i class="fas fa-search me-2"></i>
                  Filtrar
                </button>
                <button @click="clearFilters" class="btn btn-secondary btn-sm">
                  <i class="fas fa-times me-2"></i>
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Arquivos da Receita Federal -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="canonika-section-title">
            <i class="fas fa-download text-primary me-2"></i>
            ARQUIVOS DA RECEITA FEDERAL
          </h3>
          <p class="section-description">
            Lista de arquivos CNPJ disponíveis na Receita Federal e status de download/processamento.
          </p>
        </div>
        
        <div class="section-content">
          <!-- Controles de Sincronização -->
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <button @click="syncReceitaFederal" class="btn btn-primary" :disabled="isSyncing">
                <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': isSyncing }"></i>
                {{ isSyncing ? 'Sincronizando...' : 'Sincronizar Receita Federal' }}
              </button>
              <button @click="downloadSelected" class="btn btn-success ms-2" :disabled="!hasSelectedFiles">
                <i class="fas fa-download me-2"></i>
                Baixar Selecionados
              </button>
            </div>
            <div class="col-md-6 text-end">
              <span class="badge bg-info me-2">
                <i class="fas fa-info-circle me-1"></i>
                {{ receitaFederalFiles.length }} arquivos disponíveis
              </span>
              <span class="badge bg-success me-2">
                <i class="fas fa-check me-1"></i>
                {{ downloadedFiles.length }} baixados
              </span>
              <span class="badge bg-warning">
                <i class="fas fa-clock me-1"></i>
                {{ pendingFiles.length }} pendentes
              </span>
            </div>
          </div>

          <!-- AG-Grid Container -->
          <div class="ag-grid-container">
            <ag-grid-vue
              class="ag-theme-canonika"
              :columnDefs="receitaFederalColumnDefs"
              :rowData="receitaFederalFiles"
              :defaultColDef="defaultColDef"
              :pagination="true"
              :paginationPageSize="15"
              :paginationPageSizeSelector="[10, 15, 25, 50]"
              :rowSelection="'multiple'"
              :animateRows="true"
              :tooltipShowDelay="500"
              :sideBar="{
                toolPanels: ['columns', 'filters'],
                defaultToolPanel: 'columns'
              }"
              :statusBar="{
                statusPanels: [
                  { statusPanel: 'agTotalRowCountComponent', align: 'left' },
                  { statusPanel: 'agSelectedRowCountComponent', align: 'center' },
                  { statusPanel: 'agAggregationComponent', align: 'right' }
                ]
              }"
              @grid-ready="onReceitaFederalGridReady"
              @row-selected="onReceitaFederalRowSelected"
            >
            </ag-grid-vue>
          </div>
        </div>
      </div>

      <!-- Seção: Nossos Arquivos Processados -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="canonika-section-title">
            <i class="fas fa-database text-success me-2"></i>
            NOSSOS ARQUIVOS PROCESSADOS
          </h3>
          <p class="section-description">
            Arquivos CNPJ já baixados e processados em nossa base de dados.
          </p>
        </div>
        
        <div class="section-content">
          <!-- AG-Grid Container -->
          <div class="ag-grid-container">
            <ag-grid-vue
              class="ag-theme-canonika"
              :columnDefs="columnDefs"
              :rowData="filteredCnpjFiles"
              :defaultColDef="defaultColDef"
              :pagination="true"
              :paginationPageSize="10"
              :paginationPageSizeSelector="[5, 10, 25, 50]"
              :rowSelection="'single'"
              :animateRows="true"
              :tooltipShowDelay="500"
              :sideBar="{
                toolPanels: ['columns', 'filters'],
                defaultToolPanel: 'columns'
              }"
              :statusBar="{
                statusPanels: [
                  { statusPanel: 'agTotalRowCountComponent', align: 'left' },
                  { statusPanel: 'agSelectedRowCountComponent', align: 'center' },
                  { statusPanel: 'agAggregationComponent', align: 'right' }
                ]
              }"
              @grid-ready="onGridReady"
              @row-selected="onRowSelected"
            >
            </ag-grid-vue>
          </div>
        </div>
      </div>

      <!-- Seção: Detalhes do Arquivo Selecionado -->
      <div class="canonika-section" v-if="selectedFile">
        <div class="section-header">
          <h3 class="canonika-section-title">
            <i class="fas fa-info-circle text-info me-2"></i>
            DETALHES DO ARQUIVO
          </h3>
          <p class="section-description">
            Informações detalhadas sobre o arquivo selecionado.
          </p>
        </div>
        
        <div class="section-content">
                     <div class="row">
             <div class="col-md-6">
               <div class="mb-3">
                 <label class="form-label fw-bold">Nome do Arquivo:</label>
                 <div class="form-control-plaintext">{{ selectedFile.name }}</div>
               </div>
               <div class="mb-3">
                 <label class="form-label fw-bold">Tamanho:</label>
                 <div class="form-control-plaintext">{{ formatFileSize(selectedFile.size) }}</div>
               </div>
               <div class="mb-3">
                 <label class="form-label fw-bold">Status:</label>
                 <div class="form-control-plaintext">
                   <span :class="getStatusClass(selectedFile.status)">
                     {{ selectedFile.status }}
                   </span>
                 </div>
               </div>
             </div>
             <div class="col-md-6">
               <div class="mb-3">
                 <label class="form-label fw-bold">Data de Upload:</label>
                 <div class="form-control-plaintext">{{ selectedFile.uploadDate }}</div>
               </div>
               <div class="mb-3">
                 <label class="form-label fw-bold">Registros Processados:</label>
                 <div class="form-control-plaintext">{{ formatNumber(selectedFile.recordsProcessed) }}</div>
               </div>
               <div class="mb-3">
                 <label class="form-label fw-bold">Tempo de Processamento:</label>
                 <div class="form-control-plaintext">{{ selectedFile.processingTime }}</div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Modal de Upload -->
    <div class="modal fade" :class="{ show: showUploadModal }" :style="{ display: showUploadModal ? 'block' : 'none' }" @click="showUploadModal = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Upload de Arquivo CNPJ</h5>
            <button type="button" class="btn-close" @click="showUploadModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="text-center p-4 border border-dashed rounded">
              <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
              <p class="mb-3">Arraste e solte o arquivo CNPJ aqui ou clique para selecionar</p>
              <input type="file" accept=".zip,.csv" @change="handleFileUpload" class="form-control">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showUploadModal = false">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="uploadFile" :disabled="!selectedUploadFile">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showUploadModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { AgGridVue } from "ag-grid-vue3"
import { canonikaAgGridCellRenderers } from '../../../../template/web/src/config/ag-grid-canonika-theme.js'

export default {
  name: 'SefazView',
  components: {
    AgGridVue
  },
  setup() {
    // Estado da aplicação
    const isProcessing = ref(false)
    const isSyncing = ref(false)
    const showUploadModal = ref(false)
    const selectedUploadFile = ref(null)
    const selectedFile = ref(null)
    const gridApi = ref(null)
    const receitaFederalGridApi = ref(null)

    // Métricas do dashboard
    const metrics = ref({
      totalFiles: 15,
      totalRecords: 2847563,
      lastUpdate: '2024-01-15 14:30:00',
      timeAgo: '2 horas atrás',
      processingSpeed: '1,250'
    })

    // Filtros
    const filters = ref({
      status: '',
      period: '',
      size: '',
      search: ''
    })

    // Dados dos arquivos CNPJ processados (nossa base)
    const cnpjFiles = ref([
      { 
        id: 1, 
        name: 'CNPJ_2024_01.csv', 
        size: 1024000, 
        status: 'Disponível',
        uploadDate: '2024-01-15 10:00:00',
        recordsProcessed: 125000,
        processingTime: '45s'
      },
      { 
        id: 2, 
        name: 'CNPJ_2024_02.csv', 
        size: 1950000, 
        status: 'Processando',
        uploadDate: '2024-01-15 12:00:00',
        recordsProcessed: 0,
        processingTime: '--'
      },
      { 
        id: 3, 
        name: 'CNPJ_2023_12.csv', 
        size: 1460000, 
        status: 'Disponível',
        uploadDate: '2023-12-31 23:59:00',
        recordsProcessed: 98000,
        processingTime: '32s'
      },
      { 
        id: 4, 
        name: 'CNPJ_2023_11.csv', 
        size: 1710000, 
        status: 'Erro',
        uploadDate: '2023-11-30 15:30:00',
        recordsProcessed: 0,
        processingTime: '--'
      },
      { 
        id: 5, 
        name: 'CNPJ_2023_10.csv', 
        size: 1220000, 
        status: 'Disponível',
        uploadDate: '2023-10-31 09:15:00',
        recordsProcessed: 75000,
        processingTime: '28s'
      }
    ])

    // Dados dos arquivos da Receita Federal
    const receitaFederalFiles = ref([
      {
        id: '2024-01',
        name: 'CNPJ_2024_01.zip',
        period: '2024-01',
        size: 2847563,
        lastModified: '2024-01-15 10:00:00',
        status: 'Baixado',
        downloadDate: '2024-01-15 10:00:00',
        processingStatus: 'Processado',
        recordsCount: 125000
      },
      {
        id: '2024-02',
        name: 'CNPJ_2024_02.zip',
        period: '2024-02',
        size: 2958471,
        lastModified: '2024-02-15 10:00:00',
        status: 'Baixado',
        downloadDate: '2024-02-15 10:00:00',
        processingStatus: 'Processando',
        recordsCount: 0
      },
      {
        id: '2024-03',
        name: 'CNPJ_2024_03.zip',
        period: '2024-03',
        size: 3124567,
        lastModified: '2024-03-15 10:00:00',
        status: 'Pendente',
        downloadDate: null,
        processingStatus: 'Não baixado',
        recordsCount: 0
      },
      {
        id: '2024-04',
        name: 'CNPJ_2024_04.zip',
        period: '2024-04',
        size: 2987654,
        lastModified: '2024-04-15 10:00:00',
        status: 'Pendente',
        downloadDate: null,
        processingStatus: 'Não baixado',
        recordsCount: 0
      },
      {
        id: '2024-05',
        name: 'CNPJ_2024_05.zip',
        period: '2024-05',
        size: 3054321,
        lastModified: '2024-05-15 10:00:00',
        status: 'Pendente',
        downloadDate: null,
        processingStatus: 'Não baixado',
        recordsCount: 0
      },
      {
        id: '2024-06',
        name: 'CNPJ_2024_06.zip',
        period: '2024-06',
        size: 3187654,
        lastModified: '2024-06-15 10:00:00',
        status: 'Pendente',
        downloadDate: null,
        processingStatus: 'Não baixado',
        recordsCount: 0
      },
      {
        id: '2024-07',
        name: 'CNPJ_2024_07.zip',
        period: '2024-07',
        size: 3256789,
        lastModified: '2024-07-15 10:00:00',
        status: 'Pendente',
        downloadDate: null,
        processingStatus: 'Não baixado',
        recordsCount: 0
      },
      {
        id: '2024-08',
        name: 'CNPJ_2024_08.zip',
        period: '2024-08',
        size: 3324567,
        lastModified: '2024-08-15 10:00:00',
        status: 'Pendente',
        downloadDate: null,
        processingStatus: 'Não baixado',
        recordsCount: 0
      },
      {
        id: '2024-09',
        name: 'CNPJ_2024_09.zip',
        period: '2024-09',
        size: 3398765,
        lastModified: '2024-09-15 10:00:00',
        status: 'Pendente',
        downloadDate: null,
        processingStatus: 'Não baixado',
        recordsCount: 0
      },
      {
        id: '2024-10',
        name: 'CNPJ_2024_10.zip',
        period: '2024-10',
        size: 3467890,
        lastModified: '2024-10-15 10:00:00',
        status: 'Pendente',
        downloadDate: null,
        processingStatus: 'Não baixado',
        recordsCount: 0
      }
    ])

    // Configuração do AG-Grid para nossos arquivos
    const columnDefs = ref([
      { 
        field: "name", 
        headerName: "Nome do Arquivo", 
        sortable: true, 
        filter: true,
        flex: 2
      },
      { 
        field: "size", 
        headerName: "Tamanho", 
        sortable: true, 
        filter: 'agNumberColumnFilter',
        valueFormatter: (params) => formatFileSize(params.value),
        flex: 1
      },
      { 
        field: "status", 
        headerName: "Status", 
        sortable: true, 
        filter: true,
        cellRenderer: canonikaAgGridCellRenderers.status,
        flex: 1
      },
      { 
        field: "uploadDate", 
        headerName: "Data de Upload", 
        sortable: true, 
        filter: true,
        flex: 1.5
      },
      { 
        field: "recordsProcessed", 
        headerName: "Registros", 
        sortable: true, 
        filter: 'agNumberColumnFilter',
        valueFormatter: (params) => formatNumber(params.value),
        flex: 1
      },
      { 
        field: "processingTime", 
        headerName: "Tempo", 
        sortable: true, 
        filter: true,
        flex: 1
      }
    ])

    // Configuração do AG-Grid para Receita Federal
    const receitaFederalColumnDefs = ref([
      { 
        field: "name", 
        headerName: "Nome do Arquivo", 
        sortable: true, 
        filter: true,
        flex: 2,
        checkboxSelection: true,
        headerCheckboxSelection: true
      },
      { 
        field: "period", 
        headerName: "Período", 
        sortable: true, 
        filter: true,
        flex: 1
      },
      { 
        field: "size", 
        headerName: "Tamanho", 
        sortable: true, 
        filter: 'agNumberColumnFilter',
        valueFormatter: (params) => formatFileSize(params.value),
        flex: 1
      },
      { 
        field: "lastModified", 
        headerName: "Última Modificação", 
        sortable: true, 
        filter: true,
        flex: 1.5
      },
      { 
        field: "status", 
        headerName: "Status Download", 
        sortable: true, 
        filter: true,
        cellRenderer: (params) => {
          const status = params.value
          switch (status) {
            case 'Baixado': return '<span class="canonika-ag-badge canonika-ag-badge-success">✅ Baixado</span>'
            case 'Pendente': return '<span class="canonika-ag-badge canonika-ag-badge-warning">⏳ Pendente</span>'
            case 'Erro': return '<span class="canonika-ag-badge canonika-ag-badge-error">❌ Erro</span>'
            default: return '<span class="canonika-ag-badge canonika-ag-badge-secondary">⚪ Desconhecido</span>'
          }
        },
        flex: 1
      },
      { 
        field: "processingStatus", 
        headerName: "Status Processamento", 
        sortable: true, 
        filter: true,
        cellRenderer: (params) => {
          const status = params.value
          switch (status) {
            case 'Processado': return '<span class="canonika-ag-badge canonika-ag-badge-success">✅ Processado</span>'
            case 'Processando': return '<span class="canonika-ag-badge canonika-ag-badge-warning">🔄 Processando</span>'
            case 'Não baixado': return '<span class="canonika-ag-badge canonika-ag-badge-secondary">⏸️ Não baixado</span>'
            case 'Erro': return '<span class="canonika-ag-badge canonika-ag-badge-error">❌ Erro</span>'
            default: return '<span class="canonika-ag-badge canonika-ag-badge-secondary">⚪ Desconhecido</span>'
          }
        },
        flex: 1.5
      },
      { 
        field: "recordsCount", 
        headerName: "Registros", 
        sortable: true, 
        filter: 'agNumberColumnFilter',
        valueFormatter: (params) => formatNumber(params.value),
        flex: 1
      }
    ])

    const defaultColDef = ref({
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    })

    // Computed
    const filteredCnpjFiles = computed(() => {
      let filtered = [...cnpjFiles.value]

      if (filters.value.status) {
        filtered = filtered.filter(file => file.status === filters.value.status)
      }

      if (filters.value.period) {
        filtered = filtered.filter(file => file.name.includes(filters.value.period))
      }

      if (filters.value.size) {
        filtered = filtered.filter(file => {
          const size = file.size
          switch (filters.value.size) {
            case 'small': return size < 1024 * 1024
            case 'medium': return size >= 1024 * 1024 && size < 2 * 1024 * 1024
            case 'large': return size >= 2 * 1024 * 1024
            default: return true
          }
        })
      }

      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(file => 
          file.name.toLowerCase().includes(search)
        )
      }

      return filtered
    })

    // Computed para Receita Federal
    const downloadedFiles = computed(() => {
      return receitaFederalFiles.value.filter(file => file.status === 'Baixado')
    })

    const pendingFiles = computed(() => {
      return receitaFederalFiles.value.filter(file => file.status === 'Pendente')
    })

    const hasSelectedFiles = computed(() => {
      if (!receitaFederalGridApi.value) return false
      const selectedRows = receitaFederalGridApi.value.getSelectedRows()
      return selectedRows.length > 0
    })

    // Methods
    const syncCnpjFiles = async () => {
      isProcessing.value = true
      console.log('🔄 Sincronizando arquivos CNPJ...')
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Atualizar métricas
      metrics.value.lastUpdate = new Date().toLocaleString('pt-BR')
      metrics.value.timeAgo = 'agora mesmo'
      metrics.value.totalFiles = cnpjFiles.value.length
      
      isProcessing.value = false
      console.log('✅ Sincronização concluída')
    }

    const exportData = () => {
      if (gridApi.value) {
        gridApi.value.exportDataAsCsv({
          fileName: 'cnpj-files-export.csv'
        })
      }
    }

    const applyFilters = () => {
      console.log('🔍 Aplicando filtros:', filters.value)
    }

    const clearFilters = () => {
      filters.value = {
        status: '',
        period: '',
        size: '',
        search: ''
      }
      console.log('🧹 Filtros limpos')
    }

    const onGridReady = (params) => {
      gridApi.value = params.api
      console.log('📊 AG-Grid Canonika inicializado')
    }

    const onReceitaFederalGridReady = (params) => {
      receitaFederalGridApi.value = params.api
      console.log('📊 AG-Grid Receita Federal inicializado')
    }

    const onRowSelected = (event) => {
      if (event.node.isSelected()) {
        selectedFile.value = event.data
        console.log('📁 Arquivo selecionado:', selectedFile.value.name)
      }
    }

    const onReceitaFederalRowSelected = (event) => {
      console.log('📁 Arquivo Receita Federal selecionado:', event.data?.name)
    }

    const syncReceitaFederal = async () => {
      isSyncing.value = true
      console.log('🔄 Sincronizando com Receita Federal...')
      
      try {
        // Simular chamada para API da Receita Federal
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Atualizar dados (simulação)
        const newFiles = [
          {
            id: '2024-11',
            name: 'CNPJ_2024_11.zip',
            period: '2024-11',
            size: 3523456,
            lastModified: '2024-11-15 10:00:00',
            status: 'Pendente',
            downloadDate: null,
            processingStatus: 'Não baixado',
            recordsCount: 0
          },
          {
            id: '2024-12',
            name: 'CNPJ_2024_12.zip',
            period: '2024-12',
            size: 3587654,
            lastModified: '2024-12-15 10:00:00',
            status: 'Pendente',
            downloadDate: null,
            processingStatus: 'Não baixado',
            recordsCount: 0
          }
        ]
        
        receitaFederalFiles.value.push(...newFiles)
        
        // Atualizar métricas
        metrics.value.lastUpdate = new Date().toLocaleString('pt-BR')
        metrics.value.timeAgo = 'agora mesmo'
        metrics.value.totalFiles = receitaFederalFiles.value.length
        
        console.log('✅ Sincronização com Receita Federal concluída')
      } catch (error) {
        console.error('❌ Erro na sincronização:', error)
      } finally {
        isSyncing.value = false
      }
    }

    const downloadSelected = async () => {
      if (!receitaFederalGridApi.value) return
      
      const selectedRows = receitaFederalGridApi.value.getSelectedRows()
      if (selectedRows.length === 0) return
      
      console.log('📥 Iniciando download de arquivos selecionados...')
      
      for (const file of selectedRows) {
        if (file.status === 'Pendente') {
          console.log(`📥 Baixando: ${file.name}`)
          
          // Simular download
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Atualizar status
          file.status = 'Baixado'
          file.downloadDate = new Date().toLocaleString('pt-BR')
          file.processingStatus = 'Processando'
          
          console.log(`✅ Download concluído: ${file.name}`)
        }
      }
      
      // Atualizar grid
      receitaFederalGridApi.value.refreshCells()
      
      console.log('✅ Downloads concluídos')
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedUploadFile.value = file
        console.log('📤 Arquivo selecionado para upload:', file.name)
      }
    }

    const uploadFile = () => {
      if (selectedUploadFile.value) {
        console.log('📤 Fazendo upload do arquivo:', selectedUploadFile.value.name)
        showUploadModal.value = false
        selectedUploadFile.value = null
      }
    }

    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
      return (bytes / 1048576).toFixed(2) + ' MB'
    }

    const formatNumber = (num) => {
      return new Intl.NumberFormat('pt-BR').format(num)
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'Disponível': return 'status-badge online'
        case 'Processando': return 'status-badge warning'
        case 'Erro': return 'status-badge error'
        case 'Concluído': return 'status-badge success'
        default: return 'status-badge secondary'
      }
    }

    onMounted(() => {
      console.log('🚀 SefazView evoluída - AG-Grid Canonika + Funcionalidades Avançadas')
    })

    return {
      // Estado
      isProcessing,
      isSyncing,
      showUploadModal,
      selectedUploadFile,
      selectedFile,
      
      // Dados
      metrics,
      filters,
      cnpjFiles,
      receitaFederalFiles,
      
      // Computed
      downloadedFiles,
      pendingFiles,
      hasSelectedFiles,
      
      // AG-Grid
      columnDefs,
      receitaFederalColumnDefs,
      defaultColDef,
      filteredCnpjFiles,
      
      // Methods
      syncCnpjFiles,
      syncReceitaFederal,
      downloadSelected,
      exportData,
      applyFilters,
      clearFilters,
      onGridReady,
      onReceitaFederalGridReady,
      onRowSelected,
      onReceitaFederalRowSelected,
      handleFileUpload,
      uploadFile,
      formatFileSize,
      formatNumber,
      getStatusClass
    }
  }
}
</script>

<style scoped>
/* Apenas estilo mínimo para AG-Grid - usando classes compartilhadas */
.ag-grid-container {
  width: 100%;
  height: 500px;
  margin: 1rem 0;
}
</style>