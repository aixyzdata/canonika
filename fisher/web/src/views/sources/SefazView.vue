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
    </div>
  </CanonikaViewTemplate>
</template>

<script>
export default {
  name: 'SefazView',
  data() {
    return {
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
      cnpjFiles: [
        {
          id: 1,
          monthYear: '2025-06',
          filename: 'CNPJ_2025_06.zip',
          size: '2.1GB',
          status: 'available',
          lastUpdated: '2025-06-15 14:58',
          selected: false
        },
        {
          id: 2,
          monthYear: '2025-05',
          filename: 'CNPJ_2025_05.zip',
          size: '2.0GB',
          status: 'downloaded',
          lastUpdated: '2025-05-12 01:22',
          selected: false
        },
        {
          id: 3,
          monthYear: '2025-04',
          filename: 'CNPJ_2025_04.zip',
          size: '2.1GB',
          status: 'downloaded',
          lastUpdated: '2025-04-19 22:36',
          selected: false
        },
        {
          id: 4,
          monthYear: '2025-03',
          filename: 'CNPJ_2025_03.zip',
          size: '2.0GB',
          status: 'downloaded',
          lastUpdated: '2025-03-23 01:46',
          selected: false
        },
        {
          id: 5,
          monthYear: '2025-02',
          filename: 'CNPJ_2025_02.zip',
          size: '2.1GB',
          status: 'downloaded',
          lastUpdated: '2025-02-08 22:41',
          selected: false
        },
        {
          id: 6,
          monthYear: '2025-01',
          filename: 'CNPJ_2025_01.zip',
          size: '2.0GB',
          status: 'downloaded',
          lastUpdated: '2025-01-11 22:57',
          selected: false
        },
        {
          id: 7,
          monthYear: '2024-12',
          filename: 'CNPJ_2024_12.zip',
          size: '2.1GB',
          status: 'downloaded',
          lastUpdated: '2024-12-30 09:52',
          selected: false
        },
        {
          id: 8,
          monthYear: '2024-11',
          filename: 'CNPJ_2024_11.zip',
          size: '2.0GB',
          status: 'downloaded',
          lastUpdated: '2024-11-13 18:21',
          selected: false
        },
        {
          id: 9,
          monthYear: '2024-10',
          filename: 'CNPJ_2024_10.zip',
          size: '2.1GB',
          status: 'downloaded',
          lastUpdated: '2024-12-30 09:13',
          selected: false
        },
        {
          id: 10,
          monthYear: '2024-09',
          filename: 'CNPJ_2024_09.zip',
          size: '2.0GB',
          status: 'downloaded',
          lastUpdated: '2024-10-03 21:12',
          selected: false
        },
        {
          id: 11,
          monthYear: '2024-08',
          filename: 'CNPJ_2024_08.zip',
          size: '2.1GB',
          status: 'downloaded',
          lastUpdated: '2024-10-07 12:57',
          selected: false
        },
        {
          id: 12,
          monthYear: '2024-07',
          filename: 'CNPJ_2024_07.zip',
          size: '2.0GB',
          status: 'downloaded',
          lastUpdated: '2024-10-19 03:58',
          selected: false
        },
        {
          id: 13,
          monthYear: '2024-06',
          filename: 'CNPJ_2024_06.zip',
          size: '2.1GB',
          status: 'downloaded',
          lastUpdated: '2024-10-18 22:33',
          selected: false
        },
        {
          id: 14,
          monthYear: '2024-05',
          filename: 'CNPJ_2024_05.zip',
          size: '2.0GB',
          status: 'downloaded',
          lastUpdated: '2024-10-18 20:53',
          selected: false
        },
        {
          id: 15,
          monthYear: '2024-04',
          filename: 'CNPJ_2024_04.zip',
          size: '2.1GB',
          status: 'downloaded',
          lastUpdated: '2024-11-04 12:22',
          selected: false
        },
        {
          id: 16,
          monthYear: '2024-03',
          filename: 'CNPJ_2024_03.zip',
          size: '2.0GB',
          status: 'available',
          lastUpdated: '2024-11-04 13:45',
          selected: false
        },
        {
          id: 17,
          monthYear: '2024-02',
          filename: 'CNPJ_2024_02.zip',
          size: '2.1GB',
          status: 'available',
          lastUpdated: '2024-11-04 15:17',
          selected: false
        },
        {
          id: 18,
          monthYear: '2024-01',
          filename: 'CNPJ_2024_01.zip',
          size: '2.0GB',
          status: 'available',
          lastUpdated: '2024-11-04 17:43',
          selected: false
        },
        {
          id: 19,
          monthYear: '2023-12',
          filename: 'CNPJ_2023_12.zip',
          size: '2.1GB',
          status: 'available',
          lastUpdated: '2024-11-04 18:31',
          selected: false
        },
        {
          id: 20,
          monthYear: '2023-11',
          filename: 'CNPJ_2023_11.zip',
          size: '2.0GB',
          status: 'available',
          lastUpdated: '2024-11-04 19:51',
          selected: false
        },
        {
          id: 21,
          monthYear: '2023-10',
          filename: 'CNPJ_2023_10.zip',
          size: '2.1GB',
          status: 'available',
          lastUpdated: '2024-11-04 22:04',
          selected: false
        },
        {
          id: 22,
          monthYear: '2023-09',
          filename: 'CNPJ_2023_09.zip',
          size: '2.0GB',
          status: 'available',
          lastUpdated: '2024-11-04 22:40',
          selected: false
        },
        {
          id: 23,
          monthYear: '2023-08',
          filename: 'CNPJ_2023_08.zip',
          size: '2.1GB',
          status: 'available',
          lastUpdated: '2024-11-05 07:01',
          selected: false
        },
        {
          id: 24,
          monthYear: '2023-07',
          filename: 'CNPJ_2023_07.zip',
          size: '2.0GB',
          status: 'available',
          lastUpdated: '2024-11-05 10:05',
          selected: false
        },
        {
          id: 25,
          monthYear: '2023-06',
          filename: 'CNPJ_2023_06.zip',
          size: '2.1GB',
          status: 'available',
          lastUpdated: '2025-11-05 13:57',
          selected: false
        }
      ],
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
    allSelected() {
      const availableFiles = this.cnpjFiles.filter(file => file.status === 'available')
      return availableFiles.length > 0 && availableFiles.every(file => file.selected)
    },
    someSelected() {
      const availableFiles = this.cnpjFiles.filter(file => file.status === 'available')
      const selectedCount = availableFiles.filter(file => file.selected).length
      return selectedCount > 0 && selectedCount < availableFiles.length
    }
  },
  methods: {
    refreshData() {
      console.log('Refreshing SEFAZ data...')
      this.refreshFileList()
    },
    syncData() {
      console.log('Synchronizing SEFAZ data...')
      this.downloadAllMissing()
    },
    refreshFileList() {
      console.log('Refreshing CNPJ file list...')
      // Implementar busca na fonte oficial
      this.updateFileStats()
    },
    downloadSelected() {
      const selectedFiles = this.cnpjFiles.filter(file => file.selected)
      console.log('Downloading selected files:', selectedFiles.map(f => f.filename))
      // Implementar download dos arquivos selecionados
    },
    downloadAllMissing() {
      const missingFiles = this.cnpjFiles.filter(file => file.status === 'available')
      console.log('Downloading all missing files:', missingFiles.map(f => f.filename))
      // Implementar download de todos os arquivos faltantes
    },
    toggleSelectAll() {
      const availableFiles = this.cnpjFiles.filter(file => file.status === 'available')
      const newState = !this.allSelected
      availableFiles.forEach(file => {
        file.selected = newState
      })
      this.updateFileStats()
    },
    downloadFile(file) {
      console.log('Downloading file:', file.filename)
      // Implementar download individual
    },
    viewFile(file) {
      console.log('Viewing file:', file.filename)
      // Implementar visualização do arquivo
    },
    deleteFile(file) {
      console.log('Deleting file:', file.filename)
      // Implementar exclusão do arquivo
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
  mounted() {
    this.updateFileStats()
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
  align-items: center;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.config-label {
  color: #e2e8f0;
  font-weight: 600;
  flex: 1;
}

.config-value {
  color: #94a3b8;
  font-size: 0.875rem;
  flex: 2;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.config-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  flex: 1;
  text-align: center;
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