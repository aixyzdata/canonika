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
            <h3>Status da Conexão</h3>
            <div class="card-icon">
              <i class="fas fa-wifi"></i>
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
            <h3>Métricas do Sistema</h3>
            <div class="card-icon">
              <i class="fas fa-chart-line"></i>
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
            <h3>Tópicos Ativos</h3>
            <div class="card-icon">
              <i class="fas fa-tags"></i>
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
            <h3>Teste de Eventos</h3>
            <div class="card-icon">
              <i class="fas fa-play"></i>
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
              <button @click="publishTestEvent" class="btn-primary" :disabled="!connectionStatus.isConnected">
                <i class="fas fa-paper-plane"></i>
                Publicar Evento
              </button>
            </div>
          </div>
        </div>

        <!-- Subscrição a Tópicos -->
        <div class="service-card">
          <div class="card-header">
            <h3>Subscrição a Tópicos</h3>
            <div class="card-icon">
              <i class="fas fa-bell"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="subscription-form">
              <div class="form-group">
                <label>Novo Tópico:</label>
                <div class="input-group">
                  <input v-model="newTopic" type="text" placeholder="ex: user.notifications" />
                  <button @click="subscribeToTopic" class="btn-secondary" :disabled="!connectionStatus.isConnected">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div class="subscribed-topics" v-if="subscribedTopics.length > 0">
                <h4>Tópicos Inscritos:</h4>
                <div v-for="topic in subscribedTopics" :key="topic" class="subscribed-topic">
                  <span>{{ topic }}</span>
                  <button @click="unsubscribeFromTopic(topic)" class="btn-danger">
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
            <h3>Log de Eventos</h3>
            <div class="card-icon">
              <i class="fas fa-list"></i>
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
            <button @click="clearEventsLog" class="btn-secondary">
              <i class="fas fa-trash"></i>
              Limpar Log
            </button>
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

.service-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.card-icon {
  color: #3b82f6;
  font-size: 1.25rem;
}

.balance-display {
  text-align: center;
  margin-bottom: 1.5rem;
}

.balance-value {
  font-size: 3rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.balance-label {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.balance-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.detail-value {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  background: rgba(15, 23, 42, 0.5);
}

.transaction-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.transaction-icon.success {
  background: #10b981;
}

.transaction-icon.warning {
  background: #f59e0b;
}

.transaction-icon.error {
  background: #ef4444;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.transaction-amount {
  font-size: 0.875rem;
  font-weight: 600;
}

.transaction-amount.success {
  color: #10b981;
}

.transaction-amount.warning {
  color: #f59e0b;
}

.transaction-amount.error {
  color: #ef4444;
}

.transaction-time {
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.plan-item {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.plan-item:hover {
  background: rgba(15, 23, 42, 0.5);
  transform: translateY(-2px);
}

.plan-item.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.plan-name {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.plan-price {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.plan-credits {
  color: #3b82f6;
  font-size: 1rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.alert-item.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.alert-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.alert-item.warning .alert-icon {
  background: #f59e0b;
}

.alert-item.info .alert-icon {
  background: #3b82f6;
}

.alert-item.error .alert-icon {
  background: #ef4444;
}

.alert-content {
  flex: 1;
}

.alert-title {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.alert-message {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.alert-time {
  color: #64748b;
  font-size: 0.75rem;
}

.connection-status {
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.metric-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
}

.topic-name {
  font-weight: 500;
  color: #e2e8f0;
}

.topic-subscribers {
  font-size: 0.875rem;
  color: #94a3b8;
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
  font-weight: 500;
  color: #e2e8f0;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.5rem;
  border: 1px solid #475569;
  border-radius: 0.25rem;
  background: #1e293b;
  color: #e2e8f0;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-secondary {
  background: #64748b;
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.subscription-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group input {
  flex: 1;
}

.subscribed-topics {
  margin-top: 1rem;
}

.subscribed-topics h4 {
  margin-bottom: 0.5rem;
  color: #e2e8f0;
}

.subscribed-topic {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.events-log {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.event-item {
  border: 1px solid #475569;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #1e293b;
  border-bottom: 1px solid #475569;
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

.event-data {
  padding: 0.5rem;
  background: #0f172a;
}

.event-data pre {
  margin: 0;
  font-size: 0.75rem;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-word;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
}

@import '../../../shared/styles/canonika-view.css';
</style>
