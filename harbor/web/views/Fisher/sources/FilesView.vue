<template>
  <CanonikaViewTemplate
    title="Arquivos Locais"
    description="CSV, Excel, XML e outros arquivos"
    header-icon="fas fa-file-alt"
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
              <span class="detail-label">Arquivos Processados:</span>
              <span class="detail-value">{{ sourceStatus.processedFiles }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Taxa de Sucesso:</span>
              <span class="detail-value">{{ sourceStatus.successRate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tipos de Arquivo -->
      <div class="service-card">
        <div class="card-header">
          <h3>Tipos de Arquivo</h3>
          <div class="card-icon">
            <i class="fas fa-folder"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="files-grid">
            <div v-for="fileType in fileTypes" :key="fileType.id" class="file-type-item">
              <div class="file-type-icon">
                <i :class="fileType.icon"></i>
              </div>
              <div class="file-type-details">
                <div class="file-type-name">{{ fileType.name }}</div>
                <div class="file-type-status" :class="fileType.status">
                  {{ fileType.statusText }}
                </div>
                <div class="file-type-metrics">
                  <span>{{ fileType.count }} arquivos</span>
                  <span>{{ fileType.size }}</span>
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
import CanonikaViewTemplate from 'shared/templates/CanonikaViewTemplate.vue'

export default {
  name: 'FilesView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      sourceStatus: {
        status: 'ONLINE',
        description: 'Conexão ativa com arquivos locais',
        lastSync: '2024-01-15 14:30:00',
        processedFiles: '2.8K',
        successRate: '98.5%'
      },
      fileTypes: [
        {
          id: 1,
          name: 'CSV Files',
          status: 'online',
          statusText: 'ATIVO',
          count: '1.2K',
          size: '850MB',
          icon: 'fas fa-file-csv'
        },
        {
          id: 2,
          name: 'Excel Files',
          status: 'online',
          statusText: 'ATIVO',
          count: '850',
          size: '1.2GB',
          icon: 'fas fa-file-excel'
        },
        {
          id: 3,
          name: 'XML Files',
          status: 'online',
          statusText: 'ATIVO',
          count: '450',
          size: '650MB',
          icon: 'fas fa-file-code'
        },
        {
          id: 4,
          name: 'JSON Files',
          status: 'online',
          statusText: 'ATIVO',
          count: '320',
          size: '280MB',
          icon: 'fas fa-file-alt'
        },
        {
          id: 5,
          name: 'PDF Files',
          status: 'offline',
          statusText: 'INATIVO',
          count: '0',
          size: '0MB',
          icon: 'fas fa-file-pdf'
        },
        {
          id: 6,
          name: 'Text Files',
          status: 'online',
          statusText: 'ATIVO',
          count: '180',
          size: '120MB',
          icon: 'fas fa-file-text'
        }
      ],
      dataMetrics: [
        {
          id: 1,
          value: '2.8K',
          label: 'Arquivos Processados',
          icon: 'fas fa-file'
        },
        {
          id: 2,
          value: '3.1GB',
          label: 'Dados Armazenados',
          icon: 'fas fa-hdd'
        },
        {
          id: 3,
          value: '850K',
          label: 'Registros Extraídos',
          icon: 'fas fa-list'
        },
        {
          id: 4,
          value: '98.5%',
          label: 'Taxa de Sucesso',
          icon: 'fas fa-check-circle'
        }
      ],
      configurations: [
        {
          id: 1,
          name: 'Auto-Import',
          value: 'Ativo',
          status: 'online',
          statusText: 'ATIVO'
        },
        {
          id: 2,
          name: 'File Watcher',
          value: 'Monitorando',
          status: 'online',
          statusText: 'CONFIGURADO'
        },
        {
          id: 3,
          name: 'Max File Size',
          value: '100MB',
          status: 'online',
          statusText: 'OK'
        },
        {
          id: 4,
          name: 'Backup Automático',
          value: 'Diário',
          status: 'online',
          statusText: 'ATIVO'
        }
      ],
      recentLogs: [
        {
          id: 1,
          title: 'CSV Import',
          message: '150 arquivos CSV processados com sucesso',
          timestamp: '2 min atrás',
          level: 'success',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          title: 'Excel Processing',
          message: '85 arquivos Excel convertidos',
          timestamp: '15 min atrás',
          level: 'info',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          title: 'XML Validation',
          message: '45 arquivos XML validados',
          timestamp: '1 hora atrás',
          level: 'info',
          icon: 'fas fa-file-code'
        },
        {
          id: 4,
          title: 'PDF Processing Error',
          message: 'Formato não suportado',
          timestamp: '2 horas atrás',
          level: 'error',
          icon: 'fas fa-exclamation-circle'
        }
      ]
    }
  },
  methods: {
    refreshData() {
      console.log('Refreshing Files data...')
      // Implementar refresh dos dados
    },
    syncData() {
      console.log('Synchronizing Files data...')
      // Implementar sincronização
    }
  }
}
</script>

<style scoped>
.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.file-type-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.file-type-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.file-type-details {
  flex: 1;
}

.file-type-name {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.file-type-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
  display: inline-block;
}

.file-type-status.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.file-type-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.file-type-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
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
@import '../../../../shared/styles/canonika-view.css';
</style> 