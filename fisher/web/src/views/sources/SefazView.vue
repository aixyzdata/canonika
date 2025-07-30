<template>
  <div class="view-container">
    <!-- Page Header com Design System -->
    <div class="canonika-page-header">
      <div class="canonika-page-header-content">
        <div class="canonika-page-header-text">
          <div class="canonika-section-title">
            <i class="fas fa-building canonika-section-icon"></i>
            <h1 class="canonika-h1">SEFAZ - Receita Federal</h1>
          </div>
          <p class="canonika-subtitle">
            Sistema de download e processamento de dados CNPJ da Receita Federal
          </p>
        </div>
        <div class="canonika-page-header-actions">
          <button 
            @click="syncData" 
            class="canonika-btn canonika-btn-primary"
            :disabled="isDownloading"
          >
            <i class="fas fa-sync-alt"></i>
            Sincronizar Dados
          </button>
          <button 
            @click="refreshData" 
            class="canonika-btn canonika-btn-outline"
          >
            <i class="fas fa-refresh"></i>
            Atualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Grid Principal -->
    <div class="canonika-container">
      <div class="canonika-grid canonika-grid-3">
        
        <!-- Status da Fonte -->
        <div class="canonika-card">
          <div class="canonika-card-header">
            <div class="canonika-section-title">
              <i class="fas fa-signal canonika-section-icon"></i>
              <h3 class="canonika-h3">Status da Fonte</h3>
            </div>
          </div>
          <div class="canonika-card-body">
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-md">
              <div class="canonika-flex canonika-flex-between">
                <span class="canonika-text-base">Status:</span>
                <span class="canonika-badge" :class="getStatusBadgeClass(sourceStatus.status)">
                  {{ sourceStatus.status }}
                </span>
              </div>
              <div class="canonika-text-sm">{{ sourceStatus.description }}</div>
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
                <div class="canonika-flex canonika-flex-between">
                  <span class="canonika-text-xs">Última Sincronização:</span>
                  <span class="canonika-text-xs">{{ sourceStatus.lastSync }}</span>
                </div>
                <div class="canonika-flex canonika-flex-between">
                  <span class="canonika-text-xs">Arquivos Baixados:</span>
                  <span class="canonika-text-xs">{{ sourceStatus.downloadedFiles }}</span>
                </div>
                <div class="canonika-flex canonika-flex-between">
                  <span class="canonika-text-xs">Taxa de Sucesso:</span>
                  <span class="canonika-text-xs">{{ sourceStatus.successRate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de Dados -->
        <div class="canonika-card">
          <div class="canonika-card-header">
            <div class="canonika-section-title">
              <i class="fas fa-chart-bar canonika-section-icon"></i>
              <h3 class="canonika-h3">Métricas de Dados</h3>
            </div>
          </div>
          <div class="canonika-card-body">
            <div class="canonika-grid canonika-grid-2">
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
                <span class="canonika-text-xs">Arquivos Baixados:</span>
                <span class="canonika-h4">{{ fileStats.downloaded }}</span>
              </div>
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
                <span class="canonika-text-xs">Dados Armazenados:</span>
                <span class="canonika-h4">{{ dataMetrics[1]?.value || '0GB' }}</span>
              </div>
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
                <span class="canonika-text-xs">CNPJs Processados:</span>
                <span class="canonika-h4">{{ dataMetrics[2]?.value || '0' }}</span>
              </div>
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
                <span class="canonika-text-xs">Taxa de Disponibilidade:</span>
                <span class="canonika-h4">{{ dataMetrics[3]?.value || '0%' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações -->
        <div class="canonika-card">
          <div class="canonika-card-header">
            <div class="canonika-section-title">
              <i class="fas fa-cog canonika-section-icon"></i>
              <h3 class="canonika-h3">Configurações</h3>
            </div>
          </div>
          <div class="canonika-card-body">
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
              <div class="canonika-flex canonika-flex-between">
                <span class="canonika-text-xs">URL Base CNPJ:</span>
                <span class="canonika-badge canonika-badge-success">ATIVO</span>
              </div>
              <div class="canonika-flex canonika-flex-between">
                <span class="canonika-text-xs">Diretório Local:</span>
                <span class="canonika-badge canonika-badge-success">CONFIGURADO</span>
              </div>
              <div class="canonika-flex canonika-flex-between">
                <span class="canonika-text-xs">Tamanho Máximo:</span>
                <span class="canonika-badge canonika-badge-success">OK</span>
              </div>
              <div class="canonika-flex canonika-flex-between">
                <span class="canonika-text-xs">Backup Automático:</span>
                <span class="canonika-badge canonika-badge-error">INATIVO</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Controle de Arquivos CNPJ -->
      <div class="canonika-card canonika-mt-lg">
        <div class="canonika-card-header">
          <div class="canonika-section-title">
            <i class="fas fa-download canonika-section-icon"></i>
            <h3 class="canonika-h3">Controle de Arquivos CNPJ</h3>
          </div>
        </div>
        <div class="canonika-card-body">
          
          <!-- Controles Principais -->
          <div class="canonika-flex canonika-flex-gap-md canonika-mb-lg">
            <button @click="refreshFileList" class="canonika-btn canonika-btn-primary">
              <i class="fas fa-sync-alt"></i>
              Atualizar Lista
            </button>
            <button @click="downloadSelectedFiles" class="canonika-btn canonika-btn-secondary" :disabled="!hasSelectedFiles">
              <i class="fas fa-download"></i>
              Baixar Selecionados
            </button>
            <button @click="downloadMissingFiles" class="canonika-btn canonika-btn-outline" :disabled="!hasMissingFiles">
              <i class="fas fa-download"></i>
              Baixar Todos os Faltantes
            </button>
            <button @click="testModal" class="canonika-btn canonika-btn-outline">
              <i class="fas fa-vial"></i>
              Teste Modal
            </button>
          </div>

          <!-- Filtros e Estatísticas -->
          <div class="canonika-flex canonika-flex-between canonika-mb-md">
            <div class="canonika-flex canonika-flex-gap-md">
              <div class="canonika-form-group">
                <label for="monthYearFilter" class="canonika-form-label">
                  <i class="fas fa-filter"></i>
                  Filtrar por Mês/Ano:
                </label>
                <select 
                  id="monthYearFilter" 
                  v-model="selectedMonthYear" 
                  @change="applyMonthYearFilter"
                  class="canonika-form-input"
                >
                  <option value="">Todos os meses</option>
                  <option 
                    v-for="monthYear in availableMonths" 
                    :key="monthYear" 
                    :value="monthYear"
                  >
                    {{ formatMonthYear(monthYear) }}
                  </option>
                </select>
              </div>
              <button 
                @click="clearMonthYearFilter" 
                class="canonika-btn canonika-btn-sm"
                :disabled="!selectedMonthYear"
                title="Limpar filtro"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <!-- Estatísticas -->
            <div class="canonika-flex canonika-flex-gap-lg">
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
                <span class="canonika-text-xs">Total:</span>
                <span class="canonika-h5">{{ fileStats.totalAvailable }}</span>
              </div>
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
                <span class="canonika-text-xs">Baixados:</span>
                <span class="canonika-h5 canonika-text-success">{{ fileStats.downloaded }}</span>
              </div>
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
                <span class="canonika-text-xs">Faltantes:</span>
                <span class="canonika-h5 canonika-text-warning">{{ fileStats.missing }}</span>
              </div>
              <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
                <span class="canonika-text-xs">Selecionados:</span>
                <span class="canonika-h5 canonika-text-info">{{ fileStats.selected }}</span>
              </div>
            </div>
          </div>

          <!-- Tabela de Arquivos -->
          <div class="canonika-table-container">
            <table class="canonika-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      :checked="allSelected" 
                      @change="toggleSelectAll"
                      :indeterminate="someSelected"
                    >
                  </th>
                  <th>Mês/Ano</th>
                  <th>Arquivo</th>
                  <th>Tamanho</th>
                  <th>Status</th>
                  <th>Processamento</th>
                  <th>Última Atualização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="file in cnpjFiles" :key="file.id" :class="getRowClass(file)">
                  <td>
                    <input 
                      type="checkbox" 
                      v-model="file.selected"
                      :disabled="file.status === 'downloaded'"
                    >
                  </td>
                  <td>{{ file.monthYear }}</td>
                  <td>{{ file.filename }}</td>
                  <td>{{ formatFileSize(file.size) }}</td>
                  <td>
                    <span class="canonika-badge" :class="getStatusBadgeClass(file.status)">
                      {{ getStatusText(file.status) }}
                    </span>
                  </td>
                  <td>
                    <span class="canonika-badge" :class="getProcessingBadgeClass(file.processingStatus)">
                      {{ getProcessingStatusText(file.processingStatus) }}
                    </span>
                  </td>
                  <td>{{ formatDate(file.lastUpdated) }}</td>
                  <td>
                    <div class="canonika-flex canonika-flex-gap-sm">
                      <button 
                        v-if="file.status === 'available'"
                        @click="downloadFile(file)" 
                        class="canonika-btn canonika-btn-sm"
                        :disabled="isDownloading"
                        title="Baixar arquivo"
                      >
                        <i class="fas fa-download"></i>
                      </button>
                      <button 
                        v-if="file.status === 'downloaded' && file.processingStatus !== 'processed'"
                        @click="processFile(file)" 
                        class="canonika-btn canonika-btn-sm"
                        title="Processar arquivo"
                      >
                        <i class="fas fa-cogs"></i>
                      </button>
                      <button 
                        v-if="file.status === 'downloaded'"
                        @click="viewFile(file)" 
                        class="canonika-btn canonika-btn-sm"
                        title="Visualizar arquivo"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        v-if="file.status === 'downloaded'"
                        @click="deleteFile(file)" 
                        class="canonika-btn canonika-btn-sm canonika-btn-danger"
                        title="Excluir arquivo"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Estado Vazio -->
            <div v-if="cnpjFiles.length === 0" class="canonika-empty-state">
              <div class="canonika-empty-icon">
                <i class="fas fa-folder-open"></i>
              </div>
              <div class="canonika-empty-text">
                <h4 class="canonika-h4">Nenhum arquivo encontrado</h4>
                <p class="canonika-text-base">Clique em "Atualizar Lista" para buscar arquivos CNPJ disponíveis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Processamento de Dados -->
      <div class="canonika-card canonika-mt-lg">
        <div class="canonika-card-header">
          <div class="canonika-section-title">
            <i class="fas fa-database canonika-section-icon"></i>
            <h3 class="canonika-h3">Processamento de Dados CNPJ</h3>
          </div>
        </div>
        <div class="canonika-card-body">
          
          <!-- Controles de Processamento -->
          <div class="canonika-flex canonika-flex-gap-md canonika-mb-lg">
            <button @click="setupDatabase" class="canonika-btn canonika-btn-primary">
              <i class="fas fa-database"></i>
              Configurar Banco
            </button>
            <button @click="processAllFiles" class="canonika-btn canonika-btn-secondary" :disabled="!hasDownloadedFiles">
              <i class="fas fa-cogs"></i>
              Processar Todos
            </button>
            <button @click="refreshProcessingStatus" class="canonika-btn canonika-btn-outline">
              <i class="fas fa-sync"></i>
              Atualizar Status
            </button>
          </div>

          <!-- Estatísticas de Processamento -->
          <div class="canonika-grid canonika-grid-4 canonika-mb-lg">
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
              <span class="canonika-text-xs">Arquivos Baixados:</span>
              <span class="canonika-h4">{{ processingStats.downloaded }}</span>
            </div>
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
              <span class="canonika-text-xs">Processados:</span>
              <span class="canonika-h4 canonika-text-success">{{ processingStats.processed }}</span>
            </div>
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
              <span class="canonika-text-xs">Pendentes:</span>
              <span class="canonika-h4 canonika-text-warning">{{ processingStats.pending }}</span>
            </div>
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
              <span class="canonika-text-xs">Registros no BD:</span>
              <span class="canonika-h4 canonika-text-info">{{ processingStats.totalRecords }}</span>
            </div>
          </div>

          <!-- Log de Processamento -->
          <div class="canonika-section-subheader">
            <h4 class="canonika-h4">Log de Processamento</h4>
          </div>
          <div class="canonika-log-container">
            <div 
              v-for="log in processingLogs" 
              :key="log.id" 
              class="canonika-log-entry"
              :class="`log-${log.level}`"
            >
              <div class="canonika-log-timestamp">{{ log.timestamp }}</div>
              <div class="canonika-log-message">{{ log.message }}</div>
              <div class="canonika-log-status">{{ log.level }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs Recentes -->
      <div class="canonika-card canonika-mt-lg">
        <div class="canonika-card-header">
          <div class="canonika-section-title">
            <i class="fas fa-list-alt canonika-section-icon"></i>
            <h3 class="canonika-h3">Logs Recentes</h3>
          </div>
        </div>
        <div class="canonika-card-body">
          <div class="canonika-flex canonika-flex-col canonika-flex-gap-sm">
            <div 
              v-for="log in recentLogs" 
              :key="log.id" 
              class="canonika-log-entry"
              :class="`log-${log.level}`"
            >
              <div class="canonika-flex canonika-flex-gap-sm">
                <i :class="log.icon" class="canonika-text-sm"></i>
                <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
                  <div class="canonika-text-base">{{ log.title }}</div>
                  <div class="canonika-text-xs">{{ log.message }}</div>
                  <div class="canonika-text-xs">{{ log.timestamp }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal de Download -->
    <div v-if="showDownloadModal" class="canonika-modal-overlay" @click="closeDownloadModal">
      <div class="canonika-modal-content" @click.stop>
        <div class="canonika-modal-header">
          <h3 class="canonika-h3">
            <i class="fas fa-download"></i>
            Download de Arquivos CNPJ
          </h3>
          <button @click="closeDownloadModal" class="canonika-btn canonika-btn-sm">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="canonika-modal-body">
          <!-- Resumo do Download -->
          <div class="canonika-grid canonika-grid-4 canonika-mb-lg">
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
              <span class="canonika-text-xs">Total:</span>
              <span class="canonika-h5">{{ downloadQueue.length }}</span>
            </div>
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
              <span class="canonika-text-xs">Concluídos:</span>
              <span class="canonika-h5 canonika-text-success">{{ completedDownloads }}</span>
            </div>
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
              <span class="canonika-text-xs">Em Progresso:</span>
              <span class="canonika-h5 canonika-text-info">{{ activeDownloads }}</span>
            </div>
            <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
              <span class="canonika-text-xs">Falhas:</span>
              <span class="canonika-h5 canonika-text-error">{{ failedDownloads }}</span>
            </div>
          </div>

          <!-- Fila de Downloads -->
          <div class="canonika-flex canonika-flex-col canonika-flex-gap-md">
            <div 
              v-for="item in downloadQueue" 
              :key="item.id" 
              class="canonika-download-item"
              :class="`download-${item.status}`"
            >
              <div class="canonika-flex canonika-flex-between canonika-mb-sm">
                <div class="canonika-flex canonika-flex-col canonika-flex-gap-xs">
                  <div class="canonika-text-base">{{ item.filename }}</div>
                  <div class="canonika-text-xs">{{ item.size }}</div>
                </div>
                <span class="canonika-badge" :class="getDownloadStatusBadgeClass(item.status)">
                  {{ getDownloadStatusText(item.status) }}
                </span>
              </div>
              
              <!-- Progress Bar -->
              <div class="canonika-progress-bar">
                <div 
                  class="canonika-progress-fill" 
                  :class="`progress-${item.status}`"
                  :style="{ width: item.progress + '%' }"
                ></div>
              </div>
              
              <!-- Detalhes do Progresso -->
              <div class="canonika-flex canonika-flex-between canonika-mt-sm">
                <span class="canonika-text-xs">{{ item.progress }}%</span>
                <span v-if="item.speed" class="canonika-text-xs">{{ item.speed }}</span>
                <span v-if="item.eta" class="canonika-text-xs">{{ item.eta }}</span>
              </div>
              
              <div v-if="item.message" class="canonika-text-xs canonika-mt-sm">{{ item.message }}</div>
            </div>
          </div>

          <!-- Opções de Download -->
          <div class="canonika-form-check canonika-mt-lg">
            <input 
              v-model="forceReplace" 
              type="checkbox" 
              class="canonika-form-check-input" 
              id="forceReplace"
            >
            <label class="canonika-form-check-label" for="forceReplace">
              Forçar substituição de arquivos existentes
            </label>
          </div>
        </div>
        
        <div class="canonika-modal-footer">
          <button @click="pauseDownloads" class="canonika-btn canonika-btn-outline" :disabled="!isDownloading">
            <i class="fas fa-pause"></i>
            Pausar
          </button>
          <button @click="resumeDownloads" class="canonika-btn canonika-btn-outline" :disabled="!isPaused">
            <i class="fas fa-play"></i>
            Retomar
          </button>
          <button @click="cancelDownloads" class="canonika-btn canonika-btn-danger" :disabled="!isDownloading && !isPaused">
            <i class="fas fa-stop"></i>
            Cancelar
          </button>
          <button @click="closeDownloadModal" class="canonika-btn canonika-btn-primary" :disabled="isDownloading">
            <i class="fas fa-check"></i>
            Fechar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import CanonikaViewTemplate from 'shared/templates/CanonikaViewTemplate.vue'

export default {
  name: 'SefazView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      sourceStatus: {
        status: 'connecting',
        message: 'Conectando...',
        lastUpdate: null
      },
      fileStats: {
        total: 0,
        downloaded: 0,
        available: 0,
        processing: 0
      },
      processingStats: {
        total: 0,
        processed: 0,
        failed: 0,
        pending: 0
      },
      recentLogs: [],
      cnpjFiles: [],
      showDownloadModal: false,
      isDownloading: false,
      isPaused: false,
      downloadQueue: [],
      websocket: null,
      apiBaseUrl: 'http://localhost:7724',
      selectedMonthYear: null,
      availableMonths: [],
      forceReplace: false
    }
  },
  computed: {
    hasSelectedFiles() {
      return this.cnpjFiles.some(file => file.selected)
    },
    hasMissingFiles() {
      return this.cnpjFiles.some(file => file.status === 'available')
    },
    hasDownloadedFiles() {
      return this.cnpjFiles.some(file => file.status === 'downloaded')
    },
    allSelected() {
      const availableFiles = this.cnpjFiles.filter(file => file.status === 'available')
      return availableFiles.length > 0 && availableFiles.every(file => file.selected)
    },
    someSelected() {
      const availableFiles = this.cnpjFiles.filter(file => file.status === 'available')
      const selectedCount = availableFiles.filter(file => file.selected).length
      return selectedCount > 0 && selectedCount < availableFiles.length
    },
    completedDownloads() {
      return this.downloadQueue.filter(item => item.status === 'completed').length
    },
    activeDownloads() {
      return this.downloadQueue.filter(item => item.status === 'downloading').length
    },
    failedDownloads() {
      return this.downloadQueue.filter(item => item.status === 'error').length
    },
    filteredFilesCount() {
      if (!this.selectedMonthYear) {
        return this.cnpjFiles.filter(file => file.status === 'available').length;
      }
      return this.cnpjFiles.filter(file => file.monthYear === this.selectedMonthYear && file.status === 'available').length;
    }
  },
  methods: {
    // Métodos do Design System
    getStatusBadgeClass(status) {
      const statusMap = {
        'ONLINE': 'canonika-badge-success',
        'OFFLINE': 'canonika-badge-error',
        'CONNECTING': 'canonika-badge-warning',
        'ERROR': 'canonika-badge-error',
        'available': 'canonika-badge-info',
        'downloaded': 'canonika-badge-success',
        'downloading': 'canonika-badge-warning',
        'error': 'canonika-badge-error'
      };
      return statusMap[status] || 'canonika-badge-info';
    },

    getProcessingBadgeClass(status) {
      const statusMap = {
        'pending': 'canonika-badge-warning',
        'processing': 'canonika-badge-info',
        'processed': 'canonika-badge-success',
        'error': 'canonika-badge-error'
      };
      return statusMap[status] || 'canonika-badge-warning';
    },

    getDownloadStatusBadgeClass(status) {
      const statusMap = {
        'pending': 'canonika-badge-warning',
        'downloading': 'canonika-badge-info',
        'completed': 'canonika-badge-success',
        'error': 'canonika-badge-error',
        'cancelled': 'canonika-badge-error'
      };
      return statusMap[status] || 'canonika-badge-warning';
    },

    getRowClass(file) {
      const classes = ['canonika-table-row'];
      if (file.status === 'downloaded') classes.push('canonika-row-success');
      if (file.status === 'available') classes.push('canonika-row-info');
      if (file.processingStatus === 'processed') classes.push('canonika-row-processed');
      return classes.join(' ');
    },

    formatFileSize(size) {
      if (!size) return 'N/A';
      if (typeof size === 'number') {
        const units = ['B', 'KB', 'MB', 'GB'];
        let value = size;
        let unitIndex = 0;
        while (value >= 1024 && unitIndex < units.length - 1) {
          value /= 1024;
          unitIndex++;
        }
        return `${value.toFixed(1)} ${units[unitIndex]}`;
      }
      return size;
    },

    formatDate(date) {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleString('pt-BR');
      } catch {
        return date;
      }
    },

    // Métodos existentes
    async refreshAllData() {
      console.log('Refreshing all data from API...')
      
      // Buscar dados em paralelo
      await Promise.all([
        this.refreshSourceStatus(),
        this.refreshFileList(),
        this.refreshProcessingStatus(),
        this.refreshDataMetrics(),
        this.refreshRecentLogs()
      ])
    },
    
    async refreshSourceStatus() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/health`)
        const data = await response.json()
        
        if (data.status === 'healthy') {
          this.sourceStatus = {
            status: 'ONLINE',
            description: 'Conexão ativa com Receita Federal',
            lastSync: new Date().toLocaleString(),
            downloadedFiles: `${this.fileStats.downloaded}/${this.fileStats.totalAvailable}`,
            successRate: this.fileStats.totalAvailable > 0 ? 
              `${Math.round((this.fileStats.downloaded / this.fileStats.totalAvailable) * 100)}%` : '0%'
          }
        } else {
          this.sourceStatus = {
            status: 'OFFLINE',
            description: 'Erro na conexão com Receita Federal',
            lastSync: 'Nunca',
            downloadedFiles: '0/0',
            successRate: '0%'
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status da fonte:', error)
        this.sourceStatus = {
          status: 'ERRO',
          description: 'Falha na conexão com API',
          lastSync: 'Nunca',
          downloadedFiles: '0/0',
          successRate: '0%'
        }
      }
    },
    
    async refreshDataMetrics() {
      try {
        // Calcular métricas baseadas nos dados reais
        const totalSize = this.cnpjFiles
          .filter(f => f.status === 'downloaded')
          .reduce((sum, file) => {
            const size = file.size ? parseFloat(file.size.replace(/[^\d.]/g, '')) : 0
            return sum + size
          }, 0)
        
        const processedRecords = this.processingStats.totalRecords
        
        this.dataMetrics = [
          {
            id: 1,
            value: this.fileStats.downloaded.toString(),
            label: 'Arquivos Baixados',
            icon: 'fas fa-download'
          },
          {
            id: 2,
            value: `${(totalSize / 1024).toFixed(1)}GB`,
            label: 'Dados Armazenados',
            icon: 'fas fa-hdd'
          },
          {
            id: 3,
            value: processedRecords.toLocaleString(),
            label: 'CNPJs Processados',
            icon: 'fas fa-building'
          },
          {
            id: 4,
            value: this.fileStats.totalAvailable > 0 ? 
              `${Math.round((this.fileStats.downloaded / this.fileStats.totalAvailable) * 100)}%` : '0%',
            label: 'Taxa de Disponibilidade',
            icon: 'fas fa-check-circle'
          }
        ]
      } catch (error) {
        console.error('Erro ao atualizar métricas:', error)
      }
    },
    
    async refreshRecentLogs() {
      try {
        // Criar logs baseados nas ações reais
        const logs = []
        
        // Log de status da API
        if (this.sourceStatus.status === 'ONLINE') {
          logs.push({
            id: Date.now(),
            title: 'API Conectada',
            message: 'Conexão estabelecida com sucesso',
            timestamp: new Date().toLocaleTimeString(),
            level: 'success',
            icon: 'fas fa-check-circle'
          })
        }
        
        // Log de arquivos encontrados
        if (this.fileStats.totalAvailable > 0) {
          logs.push({
            id: Date.now() + 1,
            title: 'Arquivos Encontrados',
            message: `${this.fileStats.totalAvailable} arquivos disponíveis na fonte oficial`,
            timestamp: new Date().toLocaleTimeString(),
            level: 'info',
            icon: 'fas fa-info-circle'
          })
        }
        
        // Log de processamento
        if (this.processingStats.processed > 0) {
          logs.push({
            id: Date.now() + 2,
            title: 'Processamento Concluído',
            message: `${this.processingStats.processed} arquivos processados com sucesso`,
            timestamp: new Date().toLocaleTimeString(),
            level: 'info',
            icon: 'fas fa-database'
          })
        }
        
        // Log de erro se houver
        if (this.sourceStatus.status === 'ERRO') {
          logs.push({
            id: Date.now() + 3,
            title: 'Erro de Conexão',
            message: 'Falha ao conectar com a API do Fisher',
            timestamp: new Date().toLocaleTimeString(),
            level: 'error',
            icon: 'fas fa-exclamation-triangle'
          })
        }
        
        this.recentLogs = logs.slice(0, 10) // Manter apenas os 10 mais recentes
      } catch (error) {
        console.error('Erro ao atualizar logs:', error)
      }
    },
    async refreshData() {
      console.log('Refreshing SEFAZ data...')
      await this.refreshAllData()
    },
    async syncData() {
      console.log('Synchronizing SEFAZ data...')
      await this.downloadAllMissing()
    },
    async refreshFileList() {
      console.log('Refreshing CNPJ file list...')
      try {
        // Usar endpoint real que busca da fonte oficial
        const response = await fetch(`${this.apiBaseUrl}/cnpj/files/refresh`)
        const data = await response.json()
        
        if (data.status === 'success') {
          let files = data.files.map(file => ({
            id: file.filename,
            monthYear: file.month_year || this.extractMonthYear(file.filename),
            filename: file.filename,
            size: file.size,
            status: file.status,
            lastUpdated: file.last_updated || 'N/A',
            selected: false,
            localPath: file.local_path,
            processingStatus: file.processing_status || 'pending',
            url: file.url
          }))
          
          // Aplicar filtro de mês/ano se selecionado
          if (this.selectedMonthYear) {
            files = files.filter(file => file.monthYear === this.selectedMonthYear)
            console.log(`Filtrado para mês ${this.selectedMonthYear}: ${files.length} arquivos`)
          }
          
          this.cnpjFiles = files
          this.updateFileStats()
          
          // Atualizar métricas e logs com dados reais
          await this.refreshDataMetrics()
          await this.refreshRecentLogs()
          
          // Adicionar log de sucesso
          const filterText = this.selectedMonthYear ? ` (filtrado: ${this.formatMonthYear(this.selectedMonthYear)})` : ''
          this.addProcessingLog('success', `Lista atualizada: ${files.length} arquivos${filterText}`)
        } else {
          console.error('Erro ao obter status dos arquivos:', data.error)
          this.addProcessingLog('error', `Erro ao atualizar lista: ${data.error}`)
        }
      } catch (error) {
        console.error('Erro na comunicação com API:', error)
        this.addProcessingLog('error', `Erro de conexão: ${error.message}`)
        // Fallback para dados mockados
        this.loadMockData()
      }
    },
    async refreshProcessingStatus() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/cnpj/processing-status`)
        const data = await response.json()
        
        if (data.status === 'success') {
          this.processingStats = {
            downloaded: data.total_downloaded,
            processed: data.total_processed,
            pending: data.total_pending,
            totalRecords: 0 // Será calculado separadamente
          }
          
          // Atualizar status de processamento nos arquivos
          this.cnpjFiles.forEach(file => {
            if (data.processed_files.includes(file.filename)) {
              file.processingStatus = 'processed'
            } else if (data.pending_files.includes(file.filename)) {
              file.processingStatus = 'pending'
            }
          })
        }
      } catch (error) {
        console.error('Erro ao obter status de processamento:', error)
      }
    },
    async setupDatabase() {
      try {
        this.addProcessingLog('info', 'Configurando banco de dados...')
        
        const response = await fetch(`${this.apiBaseUrl}/cnpj/setup-database`, {
          method: 'POST'
        })
        
        const result = await response.json()
        
        if (result.status === 'success') {
          this.addProcessingLog('success', 'Banco de dados configurado com sucesso!')
        } else {
          this.addProcessingLog('error', `Erro ao configurar banco: ${result.error}`)
        }
      } catch (error) {
        console.error('Erro ao configurar banco:', error)
        this.addProcessingLog('error', `Erro de conexão: ${error.message}`)
      }
    },
    async processFile(file) {
      try {
        this.addProcessingLog('info', `Processando arquivo: ${file.filename}`)
        
        const response = await fetch(`${this.apiBaseUrl}/cnpj/process/${file.filename}`, {
          method: 'POST'
        })
        
        const result = await response.json()
        
        if (result.status === 'success') {
          file.processingStatus = 'processed'
          this.addProcessingLog('success', `Arquivo ${file.filename} processado com sucesso!`)
          
          // Atualizar estatísticas
          if (result.results) {
            this.updateProcessingStats(result.results)
          }
        } else {
          file.processingStatus = 'error'
          this.addProcessingLog('error', `Erro ao processar ${file.filename}: ${result.error}`)
        }
      } catch (error) {
        console.error('Erro ao processar arquivo:', error)
        file.processingStatus = 'error'
        this.addProcessingLog('error', `Erro de conexão: ${error.message}`)
      }
    },
    async processAllFiles() {
      try {
        this.addProcessingLog('info', 'Iniciando processamento de todos os arquivos...')
        
        const response = await fetch(`${this.apiBaseUrl}/cnpj/process-all`, {
          method: 'POST'
        })
        
        const result = await response.json()
        
        if (result.status === 'completed') {
          this.addProcessingLog('success', `Processamento concluído! ${result.successful} arquivos processados com sucesso.`)
          
          // Atualizar status dos arquivos
          result.results.forEach(fileResult => {
            const file = this.cnpjFiles.find(f => f.filename === fileResult.filename)
            if (file) {
              file.processingStatus = fileResult.status === 'success' ? 'processed' : 'error'
            }
          })
          
          // Atualizar estatísticas
          this.updateProcessingStats(result)
        } else {
          this.addProcessingLog('error', `Erro no processamento: ${result.error}`)
        }
      } catch (error) {
        console.error('Erro ao processar arquivos:', error)
        this.addProcessingLog('error', `Erro de conexão: ${error.message}`)
      }
    },
    updateProcessingStats(results) {
      // Calcular total de registros processados
      let totalRecords = 0
      
      if (results.empresas) {
        totalRecords += results.empresas.processed || 0
      }
      if (results.estabelecimentos) {
        totalRecords += results.estabelecimentos.processed || 0
      }
      if (results.socios) {
        totalRecords += results.socios.processed || 0
      }
      if (results.simples) {
        totalRecords += results.simples.processed || 0
      }
      
      this.processingStats.totalRecords += totalRecords
    },
    addProcessingLog(level, message) {
      const log = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        message,
        level
      }
      
      this.processingLogs.unshift(log)
      
      // Manter apenas os últimos 50 logs
      if (this.processingLogs.length > 50) {
        this.processingLogs = this.processingLogs.slice(0, 50)
      }
    },
    getProcessingStatusText(status) {
      const statusMap = {
        'pending': 'PENDENTE',
        'processing': 'PROCESSANDO',
        'processed': 'PROCESSADO',
        'error': 'ERRO'
      }
      return statusMap[status] || 'PENDENTE'
    },
    extractMonthYear(filename) {
      const match = filename.match(/CNPJ_(\d{4})_(\d{2})/)
      if (match) {
        return `${match[1]}-${match[2]}`
      }
      return filename
    },
    loadMockData() {
      // Dados mockados como fallback
      this.cnpjFiles = [
        {
          id: 1,
          monthYear: '2025-06',
          filename: 'CNPJ_2025_06.zip',
          size: '2.1GB',
          status: 'available',
          lastUpdated: '2025-06-15 14:58',
          selected: false,
          processingStatus: 'pending'
        },
        // ... outros arquivos mockados
      ]
      this.updateFileStats()
    },
    async downloadSelectedFiles() {
      const selectedFiles = this.cnpjFiles.filter(file => file.selected)
      console.log('Downloading selected files:', selectedFiles.map(f => f.filename))
      await this.startDownload(selectedFiles)
    },
    async downloadMissingFiles() {
      const missingFiles = this.cnpjFiles.filter(file => file.status === 'available')
      console.log('Downloading all missing files:', missingFiles.map(f => f.filename))
      await this.startDownload(missingFiles)
    },
    async startDownload(files) {
      // Preparar fila de download
      this.downloadQueue = files.map((file, index) => ({
        id: file.id,
        filename: file.filename,
        size: file.size,
        status: 'pending',
        progress: 0,
        speed: null,
        eta: null,
        message: null,
        startTime: null,
        downloadId: null
      }))
      
      this.showDownloadModal = true
      this.isDownloading = true
      this.isPaused = false
      
      console.log('🚀 Iniciando downloads com polling...')
      console.log('📊 Fila inicial:', this.downloadQueue.map(item => ({ id: item.id, filename: item.filename, status: item.status })))
      console.log('🔧 Force replace inicial:', this.forceReplace)
      
      // Iniciar downloads sequenciais
      await this.processDownloadQueue()
    },
    updateDownloadProgress(downloadId, progressData) {
      console.log('📊 Atualizando progresso:', downloadId, progressData)
      console.log('📊 Fila atual antes da atualização:', this.downloadQueue.map(item => ({ id: item.id, downloadId: item.downloadId, filename: item.filename, progress: item.progress })))
      
      const queueItem = this.downloadQueue.find(item => item.downloadId === downloadId)
      if (queueItem) {
        console.log('✅ Item encontrado na fila, atualizando...')
        console.log('📊 Progresso anterior:', queueItem.progress, '%')
        console.log('📊 Progresso novo:', progressData.progress, '%')
        console.log('📊 Status anterior:', queueItem.status)
        console.log('📊 Status novo:', progressData.status)
        
        // Forçar reatividade do Vue
        this.$set(queueItem, 'progress', progressData.progress)
        this.$set(queueItem, 'status', progressData.status)
        this.$set(queueItem, 'message', progressData.message)
        this.$set(queueItem, 'speed', progressData.speed)
        this.$set(queueItem, 'eta', progressData.eta)
        
        console.log('✅ Progresso atualizado na fila com $set')
        console.log('📊 Fila atual após atualização:', this.downloadQueue.map(item => ({ id: item.id, downloadId: item.downloadId, filename: item.filename, progress: item.progress, status: item.status })))
        
        // Se download concluído, atualizar status na lista principal
        if (progressData.status === 'completed') {
          console.log('✅ Download concluído, atualizando lista principal...')
          const fileIndex = this.cnpjFiles.findIndex(f => f.filename === progressData.filename)
          if (fileIndex !== -1) {
            this.cnpjFiles[fileIndex].status = 'downloaded'
            console.log('✅ Status atualizado na lista principal')
          } else {
            console.log('❌ Arquivo não encontrado na lista principal:', progressData.filename)
          }
        }
      } else {
        console.log('❌ Item não encontrado na fila:', downloadId)
        console.log('Fila atual:', this.downloadQueue.map(item => ({ id: item.id, downloadId: item.downloadId, filename: item.filename })))
      }
    },
    async processDownloadQueue() {
      if (this.isPaused) return
      
      const pendingItem = this.downloadQueue.find(item => item.status === 'pending')
      if (!pendingItem) {
        console.log('✅ Nenhum item pendente na fila')
        this.isDownloading = false
        return
      }
      
      console.log('🚀 Processando item:', pendingItem.filename)
      console.log('📊 Status atual do item:', pendingItem.status)
      
      try {
        // Iniciar download via API
        const downloadUrl = `${this.apiBaseUrl}/cnpj/download/${pendingItem.filename}`
        console.log('📡 Iniciando download via:', downloadUrl)
        console.log('🔧 Force replace:', this.forceReplace)
        
        const response = await fetch(downloadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            force_replace: this.forceReplace
          })
        })
        
        console.log('📡 Resposta do download:', response.status, response.statusText)
        
        const result = await response.json()
        console.log('📊 Resultado do download:', result)
        
        if (result.status === 'success') {
          pendingItem.downloadId = result.download_id
          pendingItem.status = 'downloading'
          pendingItem.startTime = Date.now()
          pendingItem.message = 'Iniciando download...'
          
          console.log('✅ Download iniciado com ID:', result.download_id)
          console.log('📊 Item atualizado na fila:', pendingItem)
          console.log('📊 Fila completa após iniciar download:', this.downloadQueue.map(item => ({ id: item.id, downloadId: item.downloadId, filename: item.filename, status: item.status, progress: item.progress })))
          
          // Iniciar polling se WebSocket não estiver funcionando
          console.log('🔄 Iniciando polling para download ID:', result.download_id)
          this.startProgressPolling(pendingItem.downloadId)
        } else {
          pendingItem.status = 'error'
          pendingItem.message = result.error || 'Erro no download'
          console.error('❌ Erro no download:', result.error)
        }
        
        // Processar próximo item após um delay
        setTimeout(() => this.processDownloadQueue(), 1000)
        
      } catch (error) {
        console.error('❌ Erro no download:', error)
        pendingItem.status = 'error'
        pendingItem.message = `Erro: ${error.message}`
        
        // Processar próximo item após um delay
        setTimeout(() => this.processDownloadQueue(), 1000)
      }
    },
    startProgressPolling(downloadId) {
      console.log('🔄 Iniciando polling para:', downloadId)
      
      const pollInterval = setInterval(async () => {
        try {
          console.log('📡 Fazendo request para:', `${this.apiBaseUrl}/cnpj/downloads/${downloadId}/progress`)
          const response = await fetch(`${this.apiBaseUrl}/cnpj/downloads/${downloadId}/progress`)
          
          if (!response.ok) {
            console.error('❌ Erro na resposta:', response.status, response.statusText)
            return
          }
          
          const progressData = await response.json()
          console.log('📊 Polling progresso:', progressData)
          
          if (progressData && progressData.status) {
            console.log('✅ Dados de progresso válidos, atualizando...')
            console.log('📊 Progresso anterior na fila:', this.downloadQueue.find(item => item.downloadId === downloadId)?.progress || 'N/A')
            this.updateDownloadProgress(downloadId, progressData)
            console.log('📊 Progresso atualizado na fila:', this.downloadQueue.find(item => item.downloadId === downloadId)?.progress || 'N/A')
            
            // Se download concluído ou com erro, parar polling
            if (progressData.status === 'completed' || progressData.status === 'error') {
              clearInterval(pollInterval)
              console.log('✅ Polling finalizado para:', downloadId)
            }
          } else {
            console.log('⚠️ Dados de progresso inválidos:', progressData)
          }
        } catch (error) {
          console.error('❌ Erro no polling:', error)
          clearInterval(pollInterval)
        }
      }, 1000) // Poll a cada 1 segundo
      
      console.log('✅ Polling iniciado com intervalo:', pollInterval)
      
      // Teste direto após 2 segundos
      setTimeout(async () => {
        console.log('🧪 TESTE DIRETO - Verificando se polling está funcionando...')
        try {
          const testResponse = await fetch(`${this.apiBaseUrl}/cnpj/downloads/${downloadId}/progress`)
          const testData = await testResponse.json()
          console.log('🧪 TESTE DIRETO - Dados recebidos:', testData)
        } catch (error) {
          console.error('🧪 TESTE DIRETO - Erro:', error)
        }
      }, 2000)
    },
    pauseDownloads() {
      this.isPaused = true
      this.isDownloading = false
    },
    resumeDownloads() {
      this.isPaused = false
      this.isDownloading = true
      this.processDownloadQueue()
    },
    cancelDownloads() {
      this.isDownloading = false
      this.isPaused = false
      
      // Marcar todos os downloads como cancelados
      this.downloadQueue.forEach(item => {
        if (item.status === 'downloading' || item.status === 'pending') {
          item.status = 'cancelled'
          item.message = 'Download cancelado'
        }
      })
    },
    closeDownloadModal() {
      if (!this.isDownloading) {
        this.showDownloadModal = false
        this.downloadQueue = []
        this.updateFileStats()
      }
    },
    toggleSelectAll() {
      const availableFiles = this.cnpjFiles.filter(file => file.status === 'available')
      const newState = !this.allSelected
      availableFiles.forEach(file => {
        file.selected = newState
      })
      this.updateFileStats()
    },
    async downloadFile(file) {
      console.log('Downloading file:', file.filename)
      await this.startDownload([file])
    },
    async viewFile(file) {
      console.log('Viewing file:', file.filename)
      // Implementar visualização do arquivo
    },
    async deleteFile(file) {
      console.log('Deleting file:', file.filename)
      try {
        const response = await fetch(`${this.apiBaseUrl}/cnpj/files/${file.filename}`, {
          method: 'DELETE'
        })
        
        const result = await response.json()
        
        if (result.status === 'success') {
          // Atualizar status na lista
          const fileIndex = this.cnpjFiles.findIndex(f => f.filename === file.filename)
          if (fileIndex !== -1) {
            this.cnpjFiles[fileIndex].status = 'available'
          }
          this.updateFileStats()
        } else {
          console.error('Erro ao deletar arquivo:', result.message)
        }
      } catch (error) {
        console.error('Erro na comunicação com API:', error)
      }
    },
    getStatusText(status) {
      const statusMap = {
        'available': 'DISPONÍVEL',
        'downloaded': 'BAIXADO',
        'downloading': 'BAIXANDO',
        'error': 'ERRO'
      }
      return statusMap[status] || status
    },
    getDownloadStatusText(status) {
      const statusMap = {
        'pending': 'AGUARDANDO',
        'downloading': 'BAIXANDO',
        'completed': 'CONCLUÍDO',
        'error': 'ERRO',
        'cancelled': 'CANCELADO'
      }
      return statusMap[status] || status
    },
    updateFileStats() {
      this.fileStats = {
        totalAvailable: this.cnpjFiles.length,
        downloaded: this.cnpjFiles.filter(f => f.status === 'downloaded').length,
        missing: this.cnpjFiles.filter(f => f.status === 'available').length,
        selected: this.cnpjFiles.filter(f => f.selected).length
      }
      
      // Atualizar configurações com dados reais
      this.updateConfigurations()
    },
    
    updateConfigurations() {
      const downloadedCount = this.fileStats.downloaded
      const totalCount = this.fileStats.totalAvailable
      const successRate = totalCount > 0 ? Math.round((downloadedCount / totalCount) * 100) : 0
      
      this.configurations = [
        {
          id: 1,
          name: 'URL Base CNPJ',
          value: 'https://arquivos.receitafederal.gov.br/dados/cnpj/',
          status: 'online',
          statusText: 'ATIVO'
        },
        {
          id: 2,
          name: 'Diretório Local',
          value: '/app/data/cnpj/',
          status: 'online',
          statusText: 'CONFIGURADO'
        },
        {
          id: 3,
          name: 'Arquivos Baixados',
          value: `${downloadedCount}/${totalCount}`,
          status: downloadedCount > 0 ? 'online' : 'offline',
          statusText: downloadedCount > 0 ? 'ATIVO' : 'VAZIO'
        },
        {
          id: 4,
          name: 'Taxa de Sucesso',
          value: `${successRate}%`,
          status: successRate > 50 ? 'online' : 'offline',
          statusText: successRate > 50 ? 'BOM' : 'BAIXO'
        }
      ]
    },
    async applyMonthYearFilter() {
      console.log('Applying month/year filter:', this.selectedMonthYear)
      await this.refreshFileList() // Recarrega a lista com o filtro aplicado
    },
    clearMonthYearFilter() {
      this.selectedMonthYear = ''
      console.log('Clearing month/year filter')
      this.refreshFileList() // Recarrega a lista sem filtro
    },
    formatMonthYear(monthYear) {
      if (!monthYear) return 'Todos os meses'
      const [year, month] = monthYear.split('-')
      return `${month}/${year}`
    },
    testModal() {
      console.log('🧪 Testando modal...')
      console.log('🔧 Force replace atual:', this.forceReplace)
      
      // Simular alguns arquivos para teste
      const testFiles = [
        {
          id: 1,
          filename: 'test1.zip',
          size: '1.2 MB',
          status: 'available'
        },
        {
          id: 2,
          filename: 'test2.zip',
          size: '2.5 MB',
          status: 'available'
        }
      ]
      
      this.startDownload(testFiles)
    },
  },
  async mounted() {
    console.log('🔧 SefazView mounted - iniciando carregamento...')
    await this.refreshAllData()
    
    // Preencher a lista de meses/anos disponíveis
    try {
      console.log('🔧 Carregando meses disponíveis de:', `${this.apiBaseUrl}/cnpj/files/months`)
      const response = await fetch(`${this.apiBaseUrl}/cnpj/files/months`)
      console.log('🔧 Response status:', response.status)
      
      const data = await response.json()
      console.log('🔧 Response data:', data)
      
      if (data.status === 'success') {
        this.availableMonths = data.months
        console.log('✅ Meses disponíveis carregados:', this.availableMonths)
        console.log('✅ 2025-04 está na lista?', this.availableMonths.includes('2025-04'))
      } else {
        console.error('❌ Erro ao carregar meses:', data.error)
        this.availableMonths = []
      }
    } catch (error) {
      console.error('❌ Erro ao carregar meses disponíveis:', error)
      this.availableMonths = []
    }
  },
  beforeUnmount() {
    if (this.websocket) {
      this.websocket.close()
    }
  },
  watch: {
    'cnpjFiles': {
      handler() {
        this.updateFileStats()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.download-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}

.modal-content {
  position: relative;
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  color: white;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #475569;
  background: rgba(15, 23, 42, 0.5);
}

.modal-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e2e8f0;
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
  max-height: 60vh;
  overflow-y: auto;
}

.download-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.summary-value {
  font-weight: 600;
  font-size: 1rem;
}

.summary-value.success {
  color: #22c55e;
}

.summary-value.info {
  color: #3b82f6;
}

.summary-value.error {
  color: #ef4444;
}

.download-queue {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.download-item {
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.download-item.downloading {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.download-item.completed {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.download-item.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.download-item.cancelled {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.download-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.download-info {
  flex: 1;
}

.filename {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
  font-family: 'Courier New', monospace;
}

.filesize {
  color: #94a3b8;
  font-size: 0.875rem;
}

.download-status {
  margin-left: 1rem;
}

.download-progress {
  margin-bottom: 0.75rem;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: rgba(71, 85, 69, 0.5);
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.progress-fill.completed {
  background: #22c55e;
}

.progress-fill.error {
  background: #ef4444;
}

.progress-fill.cancelled {
  background: #f59e0b;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.progress-text {
  color: #e2e8f0;
  font-weight: 600;
}

.progress-speed {
  color: #3b82f6;
}

.progress-time {
  color: #94a3b8;
}

.download-message {
  color: #94a3b8;
  font-size: 0.875rem;
  font-style: italic;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #475569;
  background: rgba(15, 23, 42, 0.5);
  gap: 1rem;
  flex-wrap: wrap;
}

.modal-footer .btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-footer .btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-footer .btn-action.danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.modal-footer .btn-action.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
}

.download-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  color: #94a3b8;
  font-size: 0.875rem;
  flex: 1;
  min-width: 300px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
  cursor: pointer;
}

.checkbox-text {
  color: #94a3b8;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.cnpj-controls {
  margin-bottom: 1.5rem;
}

.control-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #94a3b8;
}

.filter-select {
  background: none;
  border: none;
  color: #e2e8f0;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  -webkit-appearance: none; /* Remove estilos padrão do select */
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'%3E%3Cpath d='M3 5l3 3 3-3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2rem; /* Espaço para o ícone */
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.filter-select option {
  background-color: #1e293b;
  color: #e2e8f0;
}

.filter-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.filter-stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.file-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.stat-value {
  font-weight: 600;
  font-size: 1rem;
}

.stat-value.success {
  color: #22c55e;
}

.stat-value.warning {
  color: #f59e0b;
}

.stat-value.info {
  color: #3b82f6;
}

.cnpj-files-table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 400px;
  border-radius: 0.5rem;
  border: 1px solid #475569;
  margin-top: 1rem;
  background: rgba(15, 23, 42, 0.3);
}

.cnpj-files-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
}

.cnpj-files-table thead {
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.8);
  z-index: 10;
}

.cnpj-files-table th,
.cnpj-files-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #475569;
  color: #e2e8f0;
}

.cnpj-files-table th {
  background: rgba(15, 23, 42, 0.8);
  font-weight: 600;
  color: #94a3b8;
  font-size: 0.875rem;
  white-space: nowrap;
}

.cnpj-files-table tbody tr:hover {
  background: rgba(15, 23, 42, 0.2);
}

.cnpj-files-table tbody tr:last-child td {
  border-bottom: none;
}

/* Scroll personalizado */
.cnpj-files-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.cnpj-files-table-container::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 4px;
}

.cnpj-files-table-container::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.cnpj-files-table-container::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.checkbox-col {
  width: 40px; /* Fixed width for checkbox column */
  text-align: center;
}

.month-col {
  width: 100px; /* Fixed width for month/year column */
}

.filename-col {
  width: 200px; /* Fixed width for filename column */
}

.size-col {
  width: 100px; /* Fixed width for size column */
}

.status-col {
  width: 120px; /* Fixed width for status column */
}

.processing-col {
  width: 150px; /* Fixed width for processing column */
}

.updated-col {
  width: 150px; /* Fixed width for last updated column */
}

.actions-col {
  width: 150px; /* Fixed width for actions column */
  text-align: right;
}

.file-card {
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.file-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.file-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid #475569;
}

.file-checkbox {
  flex: 0 0 30px; /* Fixed width for checkbox */
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-status {
  flex: 1;
  text-align: right;
}

.file-card-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  flex-grow: 1; /* Allow content to grow and take available space */
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.file-name {
  font-weight: 600;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Courier New', monospace;
}

.file-name i {
  color: #3b82f6;
}

.file-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.detail-label {
  font-weight: 600;
}

.file-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.empty-state {
  grid-column: 1 / -1; /* Span across all columns */
  text-align: center;
  padding: 2rem 0;
  color: #94a3b8;
  font-style: italic;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text h4 {
  margin-bottom: 0.5rem;
  color: #e2e8f0;
}

.empty-text p {
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.available {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge.downloaded {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.downloading {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-badge.completed {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.pending {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
}

.status-badge.cancelled {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge.processed {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.processing {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

/* Card status colors */
.file-card.downloaded {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.02);
}

.file-card.available {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.02);
}

.file-card.downloading {
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.02);
}

.file-card.error {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.02);
}

.btn-small {
  padding: 0.25rem 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-small:hover {
  background: rgba(59, 130, 246, 0.2);
}

.btn-small.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn-small.danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.metric-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
}

.metric-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.config-label {
  color: #e2e8f0;
  font-weight: 600;
  flex: 0 0 200px;
  min-width: 200px;
}

.config-value {
  color: #94a3b8;
  font-size: 0.875rem;
  flex: 1;
  text-align: left;
  font-family: 'Courier New', monospace;
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: break-word;
  max-width: 300px;
  line-height: 1.4;
}

.config-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  flex: 0 0 auto;
  text-align: center;
  white-space: nowrap;
}

.config-status.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.config-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.log-item.success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.log-item.info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.log-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.log-item.error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.log-icon {
  font-size: 1rem;
  margin-top: 0.125rem;
}

.log-item.success .log-icon {
  color: #22c55e;
}

.log-item.info .log-icon {
  color: #3b82f6;
}

.log-item.warning .log-icon {
  color: #f59e0b;
}

.log-item.error .log-icon {
  color: #ef4444;
}

.log-content {
  flex: 1;
}

.log-title {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.log-message {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.log-time {
  color: #64748b;
  font-size: 0.75rem;
}
</style>

<style scoped>
/* Estilos específicos do SefazView com Design System */

/* Tabela personalizada */
.canonika-table-container {
  overflow-x: auto;
  border-radius: var(--canonika-border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.canonika-table {
  width: 100%;
  border-collapse: collapse;
}

.canonika-table th {
  background: rgba(15, 23, 42, 0.8);
  color: var(--canonika-white);
  padding: 12px;
  text-align: left;
  font-weight: var(--canonika-font-weight-semibold);
  font-size: var(--canonika-font-size-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.canonika-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--canonika-gray);
  font-size: var(--canonika-font-size-sm);
}

.canonika-table-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.canonika-row-success {
  background: rgba(16, 185, 129, 0.05);
}

.canonika-row-info {
  background: rgba(59, 130, 246, 0.05);
}

.canonika-row-processed {
  border-left: 3px solid var(--canonika-success);
}

/* Estado vazio */
.canonika-empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--canonika-gray);
}

.canonika-empty-icon {
  font-size: 3rem;
  color: #475569;
  margin-bottom: 15px;
}

.canonika-empty-text h4 {
  margin: 0 0 10px 0;
  color: var(--canonika-gray);
  font-size: var(--canonika-font-size-lg);
}

.canonika-empty-text p {
  margin: 0;
  color: var(--canonika-gray);
  font-size: var(--canonika-font-size-sm);
}

/* Modal personalizado */
.canonika-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.canonika-modal-content {
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: var(--canonika-border-radius-lg);
  padding: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.canonika-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #475569;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.canonika-modal-body {
  margin-bottom: 20px;
}

.canonika-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #475569;
  background: rgba(15, 23, 42, 0.5);
  gap: 1rem;
  flex-wrap: wrap;
}

/* Download items */
.canonika-download-item {
  padding: 15px;
  border-radius: var(--canonika-border-radius);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 10px;
}

.canonika-download-item.download-pending {
  border-left: 3px solid var(--canonika-warning);
}

.canonika-download-item.download-downloading {
  border-left: 3px solid var(--canonika-info);
}

.canonika-download-item.download-completed {
  border-left: 3px solid var(--canonika-success);
}

.canonika-download-item.download-error {
  border-left: 3px solid var(--canonika-error);
}

.canonika-download-item.download-cancelled {
  border-left: 3px solid var(--canonika-error);
}

/* Progress bar */
.canonika-progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}

.canonika-progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.canonika-progress-fill.progress-pending {
  background: var(--canonika-warning);
}

.canonika-progress-fill.progress-downloading {
  background: var(--canonika-info);
}

.canonika-progress-fill.progress-completed {
  background: var(--canonika-success);
}

.canonika-progress-fill.progress-error {
  background: var(--canonika-error);
}

.canonika-progress-fill.progress-cancelled {
  background: var(--canonika-error);
}

/* Log container */
.canonika-log-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--canonika-border-radius);
  background: rgba(255, 255, 255, 0.02);
}

.canonika-log-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: var(--canonika-font-size-sm);
}

.canonika-log-entry:last-child {
  border-bottom: none;
}

.canonika-log-entry.log-success {
  background: rgba(16, 185, 129, 0.05);
  border-left: 3px solid var(--canonika-success);
}

.canonika-log-entry.log-error {
  background: rgba(239, 68, 68, 0.05);
  border-left: 3px solid var(--canonika-error);
}

.canonika-log-entry.log-info {
  background: rgba(59, 130, 246, 0.05);
  border-left: 3px solid var(--canonika-info);
}

.canonika-log-timestamp {
  color: var(--canonika-gray);
  font-size: var(--canonika-font-size-xs);
  min-width: 80px;
}

.canonika-log-message {
  flex: 1;
  color: var(--canonika-gray);
}

.canonika-log-status {
  color: var(--canonika-gray);
  font-size: var(--canonika-font-size-xs);
  text-transform: uppercase;
  font-weight: var(--canonika-font-weight-medium);
}

/* Responsividade */
@media (max-width: 768px) {
  .canonika-table-container {
    font-size: var(--canonika-font-size-xs);
  }
  
  .canonika-table th,
  .canonika-table td {
    padding: 8px;
  }
  
  .canonika-modal-content {
    width: 95%;
    padding: 15px;
  }
  
  .canonika-modal-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 