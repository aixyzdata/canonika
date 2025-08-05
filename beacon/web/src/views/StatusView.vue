<template>
  <div class="tollgate-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-chart-line"></i>
        <div class="title-content">
          <h1>Monitoramento do Beacon</h1>
          <p>Status e Métricas do Sistema WebSocket</p>
        </div>
      </div>
      <div class="view-status">
        <div :class="['status-indicator', systemStatus.status === 'healthy' ? 'online' : 'offline']"></div>
        <span>{{ systemStatus.status === 'healthy' ? 'SAUDÁVEL' : 'PROBLEMAS' }}</span>
      </div>
      <div class="view-actions">
        <button @click="refreshAllData" class="action-btn primary">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="exportMetrics" class="action-btn">
          <i class="fas fa-download"></i>
          Exportar
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <!-- Status do Sistema -->
        <div class="service-card">
          <div class="card-header">
            <h3>Status do Sistema</h3>
            <div class="card-icon">
              <i class="fas fa-server"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="system-status">
              <div class="status-item">
                <span class="status-label">Status:</span>
                <span :class="['status-value', systemStatus.status === 'healthy' ? 'success' : 'error']">
                  {{ systemStatus.status === 'healthy' ? 'Saudável' : 'Problemas' }}
                </span>
              </div>
              <div class="status-item">
                <span class="status-label">Uptime:</span>
                <span class="status-value">{{ formatUptime(systemStatus.uptime) }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Clientes Ativos:</span>
                <span class="status-value">{{ systemStatus.active_clients }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Tópicos Ativos:</span>
                <span class="status-value">{{ systemStatus.active_topics }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de Performance -->
        <div class="service-card">
          <div class="card-header">
            <h3>Métricas de Performance</h3>
            <div class="card-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="performance-metrics" v-if="performanceMetrics.length > 0">
              <div v-for="metric in performanceMetrics" :key="metric.name" class="metric-item">
                <div class="metric-icon">
                  <i :class="metric.icon"></i>
                </div>
                <div class="metric-details">
                  <div class="metric-name">{{ metric.name }}</div>
                  <div class="metric-value">{{ metric.value }}</div>
                  <div class="metric-description">{{ metric.description }}</div>
                </div>
              </div>
            </div>
            <div v-else class="loading">Carregando métricas...</div>
          </div>
        </div>

        <!-- Clientes Conectados -->
        <div class="service-card">
          <div class="card-header">
            <h3>Clientes Conectados</h3>
            <div class="card-icon">
              <i class="fas fa-users"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="clients-list" v-if="connectedClients.length > 0">
              <div v-for="client in connectedClients" :key="client.id" class="client-item">
                <div class="client-header">
                  <div class="client-id">{{ client.id }}</div>
                  <div class="client-uptime">{{ formatUptime(client.uptime) }}</div>
                </div>
                <div class="client-details">
                  <div class="client-topics">
                    <span class="label">Tópicos:</span>
                    <span class="value">{{ client.topics.length }}</span>
                  </div>
                  <div class="client-heartbeat">
                    <span class="label">Último Heartbeat:</span>
                    <span class="value">{{ formatTime(client.last_heartbeat) }}</span>
                  </div>
                </div>
                <div class="client-topics-list" v-if="client.topics.length > 0">
                  <div v-for="topic in client.topics" :key="topic" class="topic-tag">
                    {{ topic }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-users"></i>
              <p>Nenhum cliente conectado</p>
            </div>
          </div>
        </div>

        <!-- Histórico de Eventos -->
        <div class="service-card">
          <div class="card-header">
            <h3>Histórico de Eventos</h3>
            <div class="card-icon">
              <i class="fas fa-history"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="events-history" v-if="eventsHistory.length > 0">
              <div v-for="event in eventsHistory" :key="event.id" class="history-item">
                <div class="event-header">
                  <span class="event-topic">{{ event.topic }}</span>
                  <span :class="['event-priority', event.priority]">{{ event.priority }}</span>
                  <span class="event-time">{{ formatTime(event.timestamp) }}</span>
                </div>
                <div class="event-source">
                  <span class="label">Fonte:</span>
                  <span class="value">{{ event.source }}</span>
                </div>
                <div class="event-data-preview">
                  <span class="label">Dados:</span>
                  <span class="value">{{ JSON.stringify(event.data).substring(0, 100) }}{{ JSON.stringify(event.data).length > 100 ? '...' : '' }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-history"></i>
              <p>Nenhum evento registrado</p>
            </div>
          </div>
        </div>

        <!-- Configurações do Sistema -->
        <div class="service-card">
          <div class="card-header">
            <h3>Configurações</h3>
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="system-config">
              <div class="config-item">
                <span class="config-label">Versão da API:</span>
                <span class="config-value">{{ systemConfig.version }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">Descrição:</span>
                <span class="config-value">{{ systemConfig.description }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">Status:</span>
                <span class="config-value">{{ systemConfig.status }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">Contato:</span>
                <span class="config-value">{{ systemConfig.contact }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Alertas e Notificações -->
        <div class="service-card">
          <div class="card-header">
            <h3>Alertas e Notificações</h3>
            <div class="card-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="alerts-list" v-if="alerts.length > 0">
              <div v-for="alert in alerts" :key="alert.id" :class="['alert-item', alert.level]">
                <div class="alert-icon">
                  <i :class="alert.icon"></i>
                </div>
                <div class="alert-content">
                  <div class="alert-title">{{ alert.title }}</div>
                  <div class="alert-message">{{ alert.message }}</div>
                  <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-check-circle"></i>
              <p>Nenhum alerta ativo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import beaconWebSocket from '../services/WebSocketService.js'

export default {
  name: 'StatusView',
  data() {
    return {
      systemStatus: {
        status: 'unknown',
        uptime: 0,
        active_clients: 0,
        active_topics: 0
      },
      performanceMetrics: [],
      connectedClients: [],
      eventsHistory: [],
      systemConfig: {
        version: '',
        description: '',
        status: '',
        contact: ''
      },
      alerts: []
    }
  },
  mounted() {
    this.refreshAllData()
    this.setupPeriodicRefresh()
  },
  beforeDestroy() {
    this.clearPeriodicRefresh()
  },
  methods: {
    async refreshAllData() {
      await Promise.all([
        this.refreshSystemStatus(),
        this.refreshPerformanceMetrics(),
        this.refreshConnectedClients(),
        this.refreshEventsHistory(),
        this.refreshSystemConfig()
      ])
    },
    
    async refreshSystemStatus() {
      try {
        const response = await fetch('http://localhost:3703/health')
        const data = await response.json()
        this.systemStatus = data
      } catch (error) {
        console.error('Erro ao buscar status do sistema:', error)
        this.systemStatus = {
          status: 'error',
          uptime: 0,
          active_clients: 0,
          active_topics: 0
        }
      }
    },
    
    async refreshPerformanceMetrics() {
      try {
        const response = await fetch('http://localhost:3703/metrics')
        const data = await response.json()
        
        this.performanceMetrics = [
          {
            name: 'Total de Mensagens',
            value: data.metrics.total_messages || 0,
            description: 'Mensagens processadas pelo sistema',
            icon: 'fas fa-envelope'
          },
          {
            name: 'Total de Eventos',
            value: data.metrics.total_events || 0,
            description: 'Eventos publicados no sistema',
            icon: 'fas fa-broadcast-tower'
          },
          {
            name: 'Clientes Ativos',
            value: data.metrics.active_clients || 0,
            description: 'Clientes WebSocket conectados',
            icon: 'fas fa-users'
          },
          {
            name: 'Tópicos Ativos',
            value: data.metrics.active_topics || 0,
            description: 'Tópicos com subscribers',
            icon: 'fas fa-tags'
          },
          {
            name: 'Tamanho da Fila',
            value: data.system_info.queue_size || 0,
            description: 'Mensagens na fila de processamento',
            icon: 'fas fa-list'
          },
          {
            name: 'Histórico de Eventos',
            value: data.system_info.event_history_size || 0,
            description: 'Eventos armazenados no histórico',
            icon: 'fas fa-history'
          }
        ]
      } catch (error) {
        console.error('Erro ao buscar métricas de performance:', error)
        this.performanceMetrics = []
      }
    },
    
    async refreshConnectedClients() {
      try {
        const response = await fetch('http://localhost:3703/clients')
        const data = await response.json()
        this.connectedClients = data.clients || []
      } catch (error) {
        console.error('Erro ao buscar clientes conectados:', error)
        this.connectedClients = []
      }
    },
    
    async refreshEventsHistory() {
      try {
        const response = await fetch('http://localhost:3703/events?limit=20')
        const data = await response.json()
        this.eventsHistory = data.events || []
      } catch (error) {
        console.error('Erro ao buscar histórico de eventos:', error)
        this.eventsHistory = []
      }
    },
    
    async refreshSystemConfig() {
      try {
        const response = await fetch('http://localhost:3703/')
        const data = await response.json()
        this.systemConfig = {
          version: data.version,
          description: data.description,
          status: data.status,
          contact: data.contact || 'dev@canonika.com'
        }
      } catch (error) {
        console.error('Erro ao buscar configurações do sistema:', error)
      }
    },
    
    setupPeriodicRefresh() {
      this.refreshInterval = setInterval(() => {
        this.refreshAllData()
      }, 10000) // Atualizar a cada 10 segundos
    },
    
    clearPeriodicRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
      }
    },
    
    formatUptime(seconds) {
      if (!seconds) return '0s'
      
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = Math.floor(seconds % 60)
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`
      } else if (minutes > 0) {
        return `${minutes}m ${secs}s`
      } else {
        return `${secs}s`
      }
    },
    
    formatTime(timestamp) {
      return new Date(timestamp * 1000).toLocaleString()
    },
    
    exportMetrics() {
      const data = {
        timestamp: new Date().toISOString(),
        systemStatus: this.systemStatus,
        performanceMetrics: this.performanceMetrics,
        connectedClients: this.connectedClients,
        eventsHistory: this.eventsHistory,
        systemConfig: this.systemConfig
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `beacon-metrics-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.system-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
}

.status-label {
  font-weight: 500;
  color: #94a3b8;
}

.status-value {
  font-weight: 600;
}

.status-value.success {
  color: #10b981;
}

.status-value.error {
  color: #ef4444;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.metric-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
}

.metric-details {
  flex: 1;
}

.metric-name {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.metric-description {
  font-size: 0.875rem;
  color: #94a3b8;
}

.clients-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.client-item {
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.client-id {
  font-weight: 600;
  color: #3b82f6;
  font-family: monospace;
}

.client-uptime {
  font-size: 0.875rem;
  color: #94a3b8;
}

.client-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.client-topics,
.client-heartbeat {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.label {
  font-size: 0.875rem;
  color: #94a3b8;
}

.value {
  font-size: 0.875rem;
  color: #e2e8f0;
  font-weight: 500;
}

.client-topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.topic-tag {
  padding: 0.25rem 0.5rem;
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.events-history {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  border: 1px solid #475569;
  border-radius: 0.25rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.event-topic {
  font-weight: 500;
  color: #3b82f6;
}

.event-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.event-priority.low {
  background: #10b981;
  color: white;
}

.event-priority.medium {
  background: #f59e0b;
  color: white;
}

.event-priority.high {
  background: #ef4444;
  color: white;
}

.event-priority.critical {
  background: #7c3aed;
  color: white;
}

.event-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.event-source,
.event-data-preview {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.system-config {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
}

.config-label {
  font-weight: 500;
  color: #94a3b8;
}

.config-value {
  font-weight: 500;
  color: #e2e8f0;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border-left-color: #f59e0b;
}

.alert-item.error {
  background: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
}

.alert-item.success {
  background: rgba(16, 185, 129, 0.1);
  border-left-color: #10b981;
}

.alert-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
}

.alert-item.info .alert-icon {
  background: #3b82f6;
  color: white;
}

.alert-item.warning .alert-icon {
  background: #f59e0b;
  color: white;
}

.alert-item.error .alert-icon {
  background: #ef4444;
  color: white;
}

.alert-item.success .alert-icon {
  background: #10b981;
  color: white;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.alert-message {
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.alert-time {
  font-size: 0.75rem;
  color: #64748b;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}
</style> 