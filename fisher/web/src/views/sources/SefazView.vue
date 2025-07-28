<template>
  <CanonikaViewTemplate
    title="SEFAZ"
    description="Dados da Receita Federal - SEFAZ"
    header-icon="fas fa-building"
    status-text="ONLINE"
    :primary-action="{
      text: 'Sincronizar Dados',
      icon: 'fas fa-sync',
      handler: syncData
    }"
    @refresh="refreshData"
  >
    <div class="service-cards">
      <!-- Status da Fonte -->
      <div class="service-card">
        <div class="card-header">
          <h3>Status da Fonte</h3>
          <div class="card-icon">
            <i class="fas fa-signal"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="balance-display">
            <div class="balance-value">{{ sourceStatus.status }}</div>
            <div class="balance-label">{{ sourceStatus.description }}</div>
          </div>
          <div class="balance-details">
            <div class="detail-item">
              <span class="detail-label">Última Sincronização:</span>
              <span class="detail-value">{{ sourceStatus.lastSync }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Arquivos Baixados:</span>
              <span class="detail-value">{{ sourceStatus.downloadedFiles }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Taxa de Sucesso:</span>
              <span class="detail-value">{{ sourceStatus.successRate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controle de Arquivos CNPJ -->
      <div class="service-card">
        <div class="card-header">
          <h3>Controle de Arquivos CNPJ</h3>
          <div class="card-icon">
            <i class="fas fa-download"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="cnpj-controls">
            <div class="control-buttons">
              <button @click="refreshFileList" class="btn-action">
                <i class="fas fa-refresh"></i> Atualizar Lista
              </button>
              <button @click="downloadSelected" class="btn-action" :disabled="!hasSelectedFiles">
                <i class="fas fa-download"></i> Baixar Selecionados
              </button>
              <button @click="downloadAllMissing" class="btn-action" :disabled="!hasMissingFiles">
                <i class="fas fa-download"></i> Baixar Todos os Faltantes
              </button>
            </div>
            
            <div class="file-stats">
              <div class="stat-item">
                <span class="stat-label">Total Disponível:</span>
                <span class="stat-value">{{ fileStats.totalAvailable }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Já Baixados:</span>
                <span class="stat-value success">{{ fileStats.downloaded }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Faltando:</span>
                <span class="stat-value warning">{{ fileStats.missing }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Selecionados:</span>
                <span class="stat-value info">{{ fileStats.selected }}</span>
              </div>
            </div>
          </div>

          <div class="cnpj-files-table">
            <div class="table-header">
              <div class="header-cell checkbox">
                <input 
                  type="checkbox" 
                  :checked="allSelected" 
                  @change="toggleSelectAll"
                  :indeterminate="someSelected"
                >
              </div>
              <div class="header-cell">Mês/Ano</div>
              <div class="header-cell">Arquivo</div>
              <div class="header-cell">Tamanho</div>
              <div class="header-cell">Status</div>
              <div class="header-cell">Processamento</div>
              <div class="header-cell">Última Atualização</div>
              <div class="header-cell">Ações</div>
            </div>
            
            <div class="table-body">
              <div v-for="file in cnpjFiles" :key="file.id" class="table-row" :class="file.status">
                <div class="table-cell checkbox">
                  <input 
                    type="checkbox" 
                    v-model="file.selected"
                    :disabled="file.status === 'downloaded'"
                  >
                </div>
                <div class="table-cell month">{{ file.monthYear }}</div>
                <div class="table-cell filename">{{ file.filename }}</div>
                <div class="table-cell size">{{ file.size }}</div>
                <div class="table-cell status">
                  <span class="status-badge" :class="file.status">
                    {{ getStatusText(file.status) }}
                  </span>
                </div>
                <div class="table-cell processing">
                  <span class="status-badge" :class="file.processingStatus || 'pending'">
                    {{ getProcessingStatusText(file.processingStatus) }}
                  </span>
                </div>
                <div class="table-cell updated">{{ file.lastUpdated }}</div>
                <div class="table-cell actions">
                  <button 
                    v-if="file.status === 'available'" 
                    @click="downloadFile(file)"
                    class="btn-small"
                    title="Baixar arquivo"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button 
                    v-if="file.status === 'downloaded' && file.processingStatus !== 'processed'" 
                    @click="processFile(file)"
                    class="btn-small"
                    title="Processar arquivo"
                  >
                    <i class="fas fa-cogs"></i>
                  </button>
                  <button 
                    v-if="file.status === 'downloaded'" 
                    @click="viewFile(file)"
                    class="btn-small"
                    title="Visualizar arquivo"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="file.status === 'downloaded'" 
                    @click="deleteFile(file)"
                    class="btn-small danger"
                    title="Excluir arquivo"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Processamento de Dados -->
      <div class="service-card">
        <div class="card-header">
          <h3>Processamento de Dados CNPJ</h3>
          <div class="card-icon">
            <i class="fas fa-database"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="processing-controls">
            <div class="control-buttons">
              <button @click="setupDatabase" class="btn-action">
                <i class="fas fa-database"></i> Configurar Banco
              </button>
              <button @click="processAllFiles" class="btn-action" :disabled="!hasDownloadedFiles">
                <i class="fas fa-cogs"></i> Processar Todos
              </button>
              <button @click="refreshProcessingStatus" class="btn-action">
                <i class="fas fa-sync"></i> Atualizar Status
              </button>
            </div>
            
            <div class="processing-stats">
              <div class="stat-item">
                <span class="stat-label">Arquivos Baixados:</span>
                <span class="stat-value">{{ processingStats.downloaded }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Processados:</span>
                <span class="stat-value success">{{ processingStats.processed }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Pendentes:</span>
                <span class="stat-value warning">{{ processingStats.pending }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Registros no BD:</span>
                <span class="stat-value info">{{ processingStats.totalRecords }}</span>
              </div>
            </div>
          </div>

          <div class="processing-log">
            <h4>Log de Processamento</h4>
            <div class="log-entries">
              <div v-for="log in processingLogs" :key="log.id" class="log-entry" :class="log.level">
                <div class="log-timestamp">{{ log.timestamp }}</div>
                <div class="log-message">{{ log.message }}</div>
                <div class="log-level">{{ log.level }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas de Dados -->
      <div class="service-card">
        <div class="card-header">
          <h3>Métricas de Dados</h3>
          <div class="card-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="metrics-grid">
            <div v-for="metric in dataMetrics" :key="metric.id" class="metric-item">
              <div class="metric-icon">
                <i :class="metric.icon"></i>
              </div>
              <div class="metric-details">
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-label">{{ metric.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configurações -->
      <div class="service-card">
        <div class="card-header">
          <h3>Configurações</h3>
          <div class="card-icon">
            <i class="fas fa-cog"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="config-list">
            <div v-for="config in configurations" :key="config.id" class="config-item">
              <div class="config-label">{{ config.name }}</div>
              <div class="config-value">{{ config.value }}</div>
              <div class="config-status" :class="config.status">
                {{ config.statusText }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs Recentes -->
      <div class="service-card">
        <div class="card-header">
          <h3>Logs Recentes</h3>
          <div class="card-icon">
            <i class="fas fa-list-alt"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="logs-list">
            <div v-for="log in recentLogs" :key="log.id" :class="`log-item ${log.level}`">
              <div class="log-icon">
                <i :class="log.icon"></i>
              </div>
              <div class="log-content">
                <div class="log-title">{{ log.title }}</div>
                <div class="log-message">{{ log.message }}</div>
                <div class="log-time">{{ log.timestamp }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Progresso de Download -->
      <div v-if="showDownloadModal" class="download-modal">
        <div class="modal-overlay" @click="closeDownloadModal"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>
              <i class="fas fa-download"></i>
              Download de Arquivos CNPJ
            </h3>
            <button @click="closeDownloadModal" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="download-summary">
              <div class="summary-item">
                <span class="summary-label">Total:</span>
                <span class="summary-value">{{ downloadQueue.length }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Concluídos:</span>
                <span class="summary-value success">{{ completedDownloads }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Em Progresso:</span>
                <span class="summary-value info">{{ activeDownloads }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Falhas:</span>
                <span class="summary-value error">{{ failedDownloads }}</span>
              </div>
            </div>

            <div class="download-queue">
              <div v-for="item in downloadQueue" :key="item.id" class="download-item" :class="item.status">
                <div class="download-header">
                  <div class="download-info">
                    <div class="filename">{{ item.filename }}</div>
                    <div class="filesize">{{ item.size }}</div>
                  </div>
                  <div class="download-status">
                    <span class="status-badge" :class="item.status">
                      {{ getDownloadStatusText(item.status) }}
                    </span>
                  </div>
                </div>
                
                <div class="download-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: item.progress + '%' }"
                      :class="item.status"
                    ></div>
                  </div>
                  <div class="progress-details">
                    <span class="progress-text">{{ item.progress }}%</span>
                    <span class="progress-speed" v-if="item.speed">{{ item.speed }}</span>
                    <span class="progress-time" v-if="item.eta">{{ item.eta }}</span>
                  </div>
                </div>
                
                <div class="download-message" v-if="item.message">
                  {{ item.message }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              @click="pauseDownloads" 
              class="btn-action"
              :disabled="!isDownloading"
            >
              <i class="fas fa-pause"></i> Pausar
            </button>
            <button 
              @click="resumeDownloads" 
              class="btn-action"
              :disabled="!isPaused"
            >
              <i class="fas fa-play"></i> Retomar
            </button>
            <button 
              @click="cancelDownloads" 
              class="btn-action danger"
              :disabled="!isDownloading && !isPaused"
            >
              <i class="fas fa-stop"></i> Cancelar
            </button>
            <button 
              @click="closeDownloadModal" 
              class="btn-action"
              :disabled="isDownloading"
            >
              <i class="fas fa-check"></i> Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </CanonikaViewTemplate>
</template>

<script>
export default {
  name: 'SefazView',
  data() {
    return {
      showDownloadModal: false,
      isDownloading: false,
      isPaused: false,
      downloadQueue: [],
      downloadInterval: null,
      websocket: null,
      apiBaseUrl: 'http://localhost:7724',
      processingStats: {
        downloaded: 0,
        processed: 0,
        pending: 0,
        totalRecords: 0
      },
      processingLogs: [],
      sourceStatus: {
        status: 'ONLINE',
        description: 'Conexão ativa com Receita Federal',
        lastSync: '2024-01-15 14:30:00',
        downloadedFiles: '15/25',
        successRate: '98.5%'
      },
      fileStats: {
        totalAvailable: 25,
        downloaded: 15,
        missing: 10,
        selected: 0
      },
      cnpjFiles: [],
      dataMetrics: [
        {
          id: 1,
          value: '15',
          label: 'Arquivos Baixados',
          icon: 'fas fa-download'
        },
        {
          id: 2,
          value: '31.5GB',
          label: 'Dados Armazenados',
          icon: 'fas fa-hdd'
        },
        {
          id: 3,
          value: '2.5M',
          label: 'CNPJs Processados',
          icon: 'fas fa-building'
        },
        {
          id: 4,
          value: '98.5%',
          label: 'Taxa de Disponibilidade',
          icon: 'fas fa-check-circle'
        }
      ],
      configurations: [
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
          value: '/data/cnpj/',
          status: 'online',
          statusText: 'CONFIGURADO'
        },
        {
          id: 3,
          name: 'Tamanho Máximo',
          value: '2.5GB por arquivo',
          status: 'online',
          statusText: 'OK'
        },
        {
          id: 4,
          name: 'Backup Automático',
          value: 'Diário às 03:00',
          status: 'online',
          statusText: 'ATIVO'
        }
      ],
      recentLogs: [
        {
          id: 1,
          title: 'Download CNPJ 2025-05',
          message: 'Arquivo CNPJ_2025_05.zip baixado com sucesso (2.0GB)',
          timestamp: '2 min atrás',
          level: 'success',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          title: 'Verificação de Novos Arquivos',
          message: '25 arquivos disponíveis na fonte oficial',
          timestamp: '15 min atrás',
          level: 'info',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          title: 'Processamento CNPJ 2025-04',
          message: '2.1M CNPJs processados e indexados',
          timestamp: '1 hora atrás',
          level: 'info',
          icon: 'fas fa-database'
        },
        {
          id: 4,
          title: 'Backup Automático',
          message: 'Backup dos arquivos CNPJ concluído',
          timestamp: '2 horas atrás',
          level: 'info',
          icon: 'fas fa-save'
        }
      ]
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
    }
  },
  methods: {
    async refreshData() {
      console.log('Refreshing SEFAZ data...')
      await this.refreshFileList()
      await this.refreshProcessingStatus()
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
          this.cnpjFiles = data.files.map(file => ({
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
          
          this.updateFileStats()
          
          // Adicionar log de sucesso
          this.addProcessingLog('success', `Lista atualizada: ${data.total_available} arquivos disponíveis, ${data.downloaded} baixados`)
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
    async downloadSelected() {
      const selectedFiles = this.cnpjFiles.filter(file => file.selected)
      console.log('Downloading selected files:', selectedFiles.map(f => f.filename))
      await this.startDownload(selectedFiles)
    },
    async downloadAllMissing() {
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
      
      // Conectar WebSocket se não estiver conectado
      if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
        this.connectWebSocket()
      }
      
      // Iniciar downloads sequenciais
      await this.processDownloadQueue()
    },
    connectWebSocket() {
      try {
        this.websocket = new WebSocket(`ws://localhost:7724/ws/downloads`)
        
        this.websocket.onopen = () => {
          console.log('WebSocket conectado')
        }
        
        this.websocket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.type === 'download_progress') {
            this.updateDownloadProgress(data.download_id, data.data)
          }
        }
        
        this.websocket.onerror = (error) => {
          console.error('Erro no WebSocket:', error)
        }
        
        this.websocket.onclose = () => {
          console.log('WebSocket desconectado')
        }
      } catch (error) {
        console.error('Erro ao conectar WebSocket:', error)
      }
    },
    updateDownloadProgress(downloadId, progressData) {
      const queueItem = this.downloadQueue.find(item => item.downloadId === downloadId)
      if (queueItem) {
        Object.assign(queueItem, progressData)
        
        // Se download concluído, atualizar status na lista principal
        if (progressData.status === 'completed') {
          const fileIndex = this.cnpjFiles.findIndex(f => f.filename === progressData.filename)
          if (fileIndex !== -1) {
            this.cnpjFiles[fileIndex].status = 'downloaded'
          }
        }
      }
    },
    async processDownloadQueue() {
      if (this.isPaused) return
      
      const pendingItem = this.downloadQueue.find(item => item.status === 'pending')
      if (!pendingItem) {
        this.isDownloading = false
        return
      }
      
      try {
        // Iniciar download via API
        const response = await fetch(`${this.apiBaseUrl}/cnpj/download/${pendingItem.filename}`, {
          method: 'POST'
        })
        
        const result = await response.json()
        
        if (result.status === 'success') {
          pendingItem.downloadId = result.download_id
          pendingItem.status = 'downloading'
          pendingItem.startTime = Date.now()
          pendingItem.message = 'Iniciando download...'
        } else {
          pendingItem.status = 'error'
          pendingItem.message = result.error || 'Erro no download'
        }
        
        // Processar próximo item após um delay
        setTimeout(() => this.processDownloadQueue(), 1000)
        
      } catch (error) {
        console.error('Erro no download:', error)
        pendingItem.status = 'error'
        pendingItem.message = 'Erro de conexão'
        
        // Processar próximo item
        setTimeout(() => this.processDownloadQueue(), 1000)
      }
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
      const total = this.cnpjFiles.length
      const downloaded = this.cnpjFiles.filter(f => f.status === 'downloaded').length
      const missing = this.cnpjFiles.filter(f => f.status === 'available').length
      const selected = this.cnpjFiles.filter(f => f.selected).length
      
      this.fileStats = {
        totalAvailable: total,
        downloaded,
        missing,
        selected
      }
    }
  },
  async mounted() {
    await this.refreshFileList()
    await this.refreshProcessingStatus()
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
  background: rgba(71, 85, 105, 0.5);
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
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #475569;
  background: rgba(15, 23, 42, 0.5);
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

.cnpj-files-table {
  border: 1px solid #475569;
  border-radius: 0.5rem;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 50px 100px 1fr 100px 120px 150px 100px;
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid #475569;
  font-weight: 600;
  color: #e2e8f0;
}

.header-cell {
  padding: 0.75rem;
  display: flex;
  align-items: center;
}

.header-cell.checkbox {
  justify-content: center;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 50px 100px 1fr 100px 120px 150px 100px;
  border-bottom: 1px solid #475569;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: rgba(15, 23, 42, 0.2);
}

.table-row.downloaded {
  background: rgba(34, 197, 94, 0.05);
}

.table-row.available {
  background: rgba(59, 130, 246, 0.05);
}

.table-row.downloading {
  background: rgba(245, 158, 11, 0.05);
}

.table-row.error {
  background: rgba(239, 68, 68, 0.05);
}

.table-cell {
  padding: 0.75rem;
  display: flex;
  align-items: center;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.table-cell.checkbox {
  justify-content: center;
}

.table-cell.month {
  font-weight: 600;
  color: #3b82f6;
}

.table-cell.filename {
  font-family: 'Courier New', monospace;
  color: #cbd5e1;
}

.table-cell.size {
  color: #94a3b8;
  font-size: 0.75rem;
}

.table-cell.status {
  justify-content: center;
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

.table-cell.updated {
  color: #94a3b8;
  font-size: 0.75rem;
}

.table-cell.actions {
  justify-content: center;
  gap: 0.25rem;
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

<style>
@import '../../../../../shared/styles/canonika-view.css';
</style> 