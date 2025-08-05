<template>
  <div class="tollgate-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-broadcast-tower"></i>
        <div class="title-content">
          <h1>Beacon WebSocket Broker</h1>
          <p>Sistema de WebSocket com Message Broker e Eventos</p>
        </div>
      </div>
      <div class="view-status">
        <div :class="['status-indicator', connectionStatus.isConnected ? 'online' : 'offline']"></div>
        <span>{{ connectionStatus.isConnected ? 'CONECTADO' : 'DESCONECTADO' }}</span>
      </div>
      <div class="view-actions">
        <button @click="connectWebSocket" class="action-btn" :disabled="connectionStatus.isConnected">
          <i class="fas fa-plug"></i>
          Conectar
        </button>
        <button @click="disconnectWebSocket" class="action-btn" :disabled="!connectionStatus.isConnected">
          <i class="fas fa-times"></i>
          Desconectar
        </button>
        <button @click="refreshMetrics" class="action-btn primary">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <!-- Status da Conexão -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-wifi"></i>
            </div>
            <div class="card-title">
              <h4>Status da Conexão</h4>
              <span class="card-subtitle">WebSocket Broker Status</span>
            </div>
            <div class="card-actions">
              <div :class="['status-indicator', connectionStatus.isConnected ? 'online' : 'offline']"></div>
            </div>
          </div>
          <div class="card-content">
            <div class="connection-status">
              <div class="status-item">
                <span class="status-label">Status:</span>
                <span :class="['status-value', connectionStatus.isConnected ? 'success' : 'error']">
                  {{ connectionStatus.isConnected ? 'Conectado' : 'Desconectado' }}
                </span>
              </div>
              <div class="status-item">
                <span class="status-label">Client ID:</span>
                <span class="status-value">{{ connectionStatus.clientId }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Tentativas de Reconexão:</span>
                <span class="status-value">{{ connectionStatus.reconnectAttempts }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Subscribers:</span>
                <span class="status-value">{{ connectionStatus.subscribersCount }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Fila de Mensagens:</span>
                <span class="status-value">{{ connectionStatus.queueSize }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas do Sistema -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="card-title">
              <h4>Métricas do Sistema</h4>
              <span class="card-subtitle">Estatísticas em Tempo Real</span>
            </div>
            <div class="card-actions">
              <button @click="refreshMetrics" class="btn btn-primary">
                <i class="fas fa-sync-alt"></i>
                Atualizar
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid" v-if="systemMetrics">
              <div class="metric-item">
                <div class="metric-value">{{ systemMetrics.total_messages || 0 }}</div>
                <div class="metric-label">Total de Mensagens</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ systemMetrics.total_events || 0 }}</div>
                <div class="metric-label">Total de Eventos</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ systemMetrics.active_clients || 0 }}</div>
                <div class="metric-label">Clientes Ativos</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ systemMetrics.active_topics || 0 }}</div>
                <div class="metric-label">Tópicos Ativos</div>
              </div>
            </div>
            <div v-else class="loading">Carregando métricas...</div>
          </div>
        </div>

        <!-- Tópicos Ativos -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-tags"></i>
            </div>
            <div class="card-title">
              <h4>Tópicos Ativos</h4>
              <span class="card-subtitle">Canais de Comunicação</span>
            </div>
            <div class="card-actions">
              <span class="topics-count">{{ topicsList.length }} tópicos</span>
            </div>
          </div>
          <div class="card-content">
            <div class="topics-list" v-if="topicsList.length > 0">
              <div v-for="topic in topicsList" :key="topic.name" class="topic-item">
                <div class="topic-name">{{ topic.name }}</div>
                <div class="topic-subscribers">{{ topic.subscribers_count }} subscribers</div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Nenhum tópico ativo</p>
            </div>
          </div>
        </div>

        <!-- Teste de Eventos -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-play"></i>
            </div>
            <div class="card-title">
              <h4>Teste de Eventos</h4>
              <span class="card-subtitle">Publicar Eventos de Teste</span>
            </div>
            <div class="card-actions">
              <button @click="publishTestEvent" class="btn btn-primary" :disabled="!connectionStatus.isConnected">
                <i class="fas fa-paper-plane"></i>
                Publicar
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="event-test-form">
              <div class="form-group">
                <label>Tópico:</label>
                <input v-model="testEvent.topic" type="text" placeholder="ex: system.alerts" />
              </div>
              <div class="form-group">
                <label>Prioridade:</label>
                <select v-model="testEvent.priority">
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
              <div class="form-group">
                <label>Dados (JSON):</label>
                <textarea v-model="testEvent.data" placeholder='{"message": "Teste de evento", "level": "info"}'></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Subscrição a Tópicos -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="card-title">
              <h4>Subscrição a Tópicos</h4>
              <span class="card-subtitle">Gerenciar Inscrições</span>
            </div>
            <div class="card-actions">
              <button @click="subscribeToTopic" class="btn btn-secondary" :disabled="!connectionStatus.isConnected">
                <i class="fas fa-plus"></i>
                Inscrição
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="subscription-form">
              <div class="form-group">
                <label>Novo Tópico:</label>
                <div class="input-group">
                  <input v-model="newTopic" type="text" placeholder="ex: user.notifications" />
                </div>
              </div>
              <div class="subscribed-topics" v-if="subscribedTopics.length > 0">
                <h4>Tópicos Inscritos:</h4>
                <div v-for="topic in subscribedTopics" :key="topic" class="subscribed-topic">
                  <span>{{ topic }}</span>
                  <button @click="unsubscribeFromTopic(topic)" class="btn btn-danger">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Log de Eventos -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-list"></i>
            </div>
            <div class="card-title">
              <h4>Log de Eventos</h4>
              <span class="card-subtitle">Histórico de Eventos</span>
            </div>
            <div class="card-actions">
              <button @click="clearEventsLog" class="btn btn-secondary">
                <i class="fas fa-trash"></i>
                Limpar
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="events-log">
              <div v-for="event in eventsLog" :key="event.id" class="event-item">
                <div class="event-header">
                  <span class="event-topic">{{ event.topic }}</span>
                  <span :class="['event-priority', event.priority]">{{ event.priority }}</span>
                  <span class="event-time">{{ formatTime(event.timestamp) }}</span>
                </div>
                <div class="event-data">
                  <pre>{{ JSON.stringify(event.data, null, 2) }}</pre>
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
import beaconWebSocket from '../services/WebSocketService.js'

export default {
  name: 'BeaconView',
  data() {
    return {
      connectionStatus: {
        isConnected: false,
        clientId: '',
        reconnectAttempts: 0,
        subscribersCount: 0,
        queueSize: 0
      },
      systemMetrics: null,
      topicsList: [],
      subscribedTopics: [],
      eventsLog: [],
      testEvent: {
        topic: 'test.events',
        priority: 'medium',
        data: '{"message": "Teste de evento", "level": "info"}'
      },
      newTopic: ''
    }
  },
  mounted() {
    this.setupWebSocketListeners()
    this.connectWebSocket()
  },
  beforeDestroy() {
    this.cleanupWebSocketListeners()
  },
  methods: {
    setupWebSocketListeners() {
      beaconWebSocket.on('connected', this.handleConnected)
      beaconWebSocket.on('disconnected', this.handleDisconnected)
      beaconWebSocket.on('event', this.handleEvent)
      beaconWebSocket.on('heartbeat', this.handleHeartbeat)
      beaconWebSocket.on('error', this.handleError)
    },
    
    cleanupWebSocketListeners() {
      beaconWebSocket.off('connected', this.handleConnected)
      beaconWebSocket.off('disconnected', this.handleDisconnected)
      beaconWebSocket.off('event', this.handleEvent)
      beaconWebSocket.off('heartbeat', this.handleHeartbeat)
      beaconWebSocket.off('error', this.handleError)
    },
    
    async connectWebSocket() {
      try {
        await beaconWebSocket.connect()
      } catch (error) {
        console.error('Erro ao conectar WebSocket:', error)
      }
    },
    
    disconnectWebSocket() {
      beaconWebSocket.disconnect()
    },
    
    handleConnected(data) {
      this.updateConnectionStatus()
      this.refreshMetrics()
      this.refreshTopics()
    },
    
    handleDisconnected(data) {
      this.updateConnectionStatus()
    },
    
    handleEvent(data) {
      const event = {
        id: Date.now(),
        topic: data.topic,
        data: data.data,
        priority: data.data?.priority || 'medium',
        timestamp: Date.now()
      }
      
      this.eventsLog.unshift(event)
      
      // Manter apenas os últimos 50 eventos
      if (this.eventsLog.length > 50) {
        this.eventsLog = this.eventsLog.slice(0, 50)
      }
    },
    
    handleHeartbeat(data) {
      console.log('Heartbeat recebido:', data)
    },
    
    handleError(error) {
      console.error('Erro no WebSocket:', error)
    },
    
    updateConnectionStatus() {
      this.connectionStatus = beaconWebSocket.getConnectionStatus()
    },
    
    async refreshMetrics() {
      try {
        const metrics = await beaconWebSocket.getMetrics()
        this.systemMetrics = metrics.metrics
      } catch (error) {
        console.error('Erro ao buscar métricas:', error)
      }
    },
    
    async refreshTopics() {
      try {
        const topics = await beaconWebSocket.getTopics()
        this.topicsList = Object.entries(topics.topics || {}).map(([name, info]) => ({
          name,
          subscribers_count: info.subscribers_count
        }))
      } catch (error) {
        console.error('Erro ao buscar tópicos:', error)
      }
    },
    
    publishTestEvent() {
      try {
        const data = JSON.parse(this.testEvent.data)
        beaconWebSocket.publish(this.testEvent.topic, data, this.testEvent.priority)
      } catch (error) {
        console.error('Erro ao publicar evento:', error)
        alert('Erro ao publicar evento. Verifique o formato JSON.')
      }
    },
    
    subscribeToTopic() {
      if (!this.newTopic.trim()) return
      
      const topic = this.newTopic.trim()
      if (!this.subscribedTopics.includes(topic)) {
        this.subscribedTopics.push(topic)
        beaconWebSocket.subscribe(topic, (data) => {
          console.log(`Evento recebido no tópico ${topic}:`, data)
        })
        this.newTopic = ''
      }
    },
    
    unsubscribeFromTopic(topic) {
      const index = this.subscribedTopics.indexOf(topic)
      if (index > -1) {
        this.subscribedTopics.splice(index, 1)
        beaconWebSocket.unsubscribe(topic)
      }
    },
    
    clearEventsLog() {
      this.eventsLog = []
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString()
    }
  }
}
</script>

<style scoped>
.tollgate-view {
  height: 100%;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 1rem;
  border: 1px solid #475569;
}

.view-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-title i {
  color: #3b82f6;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.title-content {
  flex: 1;
}

.title-content h1 {
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.title-content p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.3;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.view-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.view-content {
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

/* Service Card Styles (consistent with Harbor) */
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

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn:hover {
  transform: translateY(-1px);
}

.card-content {
  color: #e2e8f0;
}

/* Status Indicators */
.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

.status-indicator.offline {
  background: #ef4444;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Connection Status */
.connection-status {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.status-value {
  font-weight: 600;
  font-size: 0.875rem;
}

.status-value.success {
  color: #10b981;
}

.status-value.error {
  color: #ef4444;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.metric-label {
  color: #94a3b8;
  font-size: 0.75rem;
}

/* Topics */
.topics-count {
  color: #94a3b8;
  font-size: 0.875rem;
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.topic-name {
  color: #e2e8f0;
  font-weight: 500;
}

.topic-subscribers {
  color: #94a3b8;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Event Test Form */
.event-test-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #475569;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.3);
  color: #e2e8f0;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

/* Subscription */
.subscription-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.subscribed-topics {
  margin-top: 1rem;
}

.subscribed-topics h4 {
  color: #e2e8f0;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.subscribed-topic {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.subscribed-topic span {
  color: #e2e8f0;
  font-size: 0.875rem;
}

/* Events Log */
.events-log {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.event-topic {
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.875rem;
}

.event-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.event-priority.low {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.event-priority.medium {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.event-priority.high {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.event-priority.critical {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.event-time {
  color: #94a3b8;
  font-size: 0.75rem;
}

.event-data {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 6px;
  padding: 0.75rem;
}

.event-data pre {
  color: #e2e8f0;
  font-size: 0.875rem;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Loading */
.loading {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .event-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
