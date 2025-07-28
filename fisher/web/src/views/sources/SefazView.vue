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
                <i class="fas fa-sync-alt"></i>
                Atualizar Lista
              </button>
              <button @click="downloadSelectedFiles" class="btn-action" :disabled="!hasSelectedFiles">
                <i class="fas fa-download"></i>
                Baixar Selecionados
              </button>
              <button @click="downloadMissingFiles" class="btn-action" :disabled="!hasMissingFiles">
                <i class="fas fa-download"></i>
                Baixar Todos os Faltantes
              </button>
              <button @click="testModal" class="btn-action">
                <i class="fas fa-test"></i>
                Teste Modal
              </button>
            </div>
            
            <!-- Filtro de Mês/Ano -->
            <div class="filter-controls">
              <div class="filter-group">
                <label for="monthYearFilter" class="filter-label">
                  <i class="fas fa-filter"></i> Filtrar por Mês/Ano:
                </label>
                <select 
                  id="monthYearFilter" 
                  v-model="selectedMonthYear" 
                  @change="applyMonthYearFilter"
                  class="filter-select"
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
                <button 
                  @click="clearMonthYearFilter" 
                  class="btn-small"
                  :disabled="!selectedMonthYear"
                  title="Limpar filtro"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div class="filter-stats" v-if="selectedMonthYear">
                <span class="filter-stat">
                  <i class="fas fa-file"></i>
                  {{ filteredFilesCount }} arquivos no mês {{ formatMonthYear(selectedMonthYear) }}
                </span>
              </div>
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

          <!-- Tabela de Arquivos CNPJ -->
          <div class="cnpj-files-table-container">
            <table class="cnpj-files-table">
              <thead>
                <tr>
                  <th class="checkbox-col">
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
                <tr v-for="file in cnpjFiles" :key="file.id" :class="file.status">
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      v-model="file.selected"
                      :disabled="file.status === 'downloaded'"
                    >
                  </td>
                  <td class="month-col">{{ file.monthYear }}</td>
                  <td class="filename-col">{{ file.filename }}</td>
                  <td class="size-col">{{ file.size }}</td>
                  <td class="status-col">
                    <span class="status-badge" :class="file.status">
                      {{ getStatusText(file.status) }}
                    </span>
                  </td>
                  <td class="processing-col">
                    <span class="status-badge" :class="file.processingStatus || 'pending'">
                      {{ getProcessingStatusText(file.processingStatus) }}
                    </span>
                  </td>
                  <td class="updated-col">{{ file.lastUpdated }}</td>
                  <td class="actions-col">
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
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-if="cnpjFiles.length === 0" class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-folder-open"></i>
              </div>
              <div class="empty-text">
                <h4>Nenhum arquivo encontrado</h4>
                <p>Clique em "Atualizar Lista" para buscar arquivos CNPJ disponíveis</p>
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
            <div class="download-options">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="forceReplace"
                  class="checkbox-input"
                >
                <span class="checkbox-text">Forçar substituição de arquivos existentes</span>
              </label>
            </div>
            
            <div class="modal-actions">
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
    </div>
  </CanonikaViewTemplate>
</template>

<script>
export default {
  name: 'SefazView',
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
/* v1.1 - Force cache reload */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  border-bottom: 1px solid #475569;
  padding-bottom: 10px;
  margin-bottom: 20px;
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

.btn-action.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn-action.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
}
</style> 