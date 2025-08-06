<template>
  <div class="tollgate-view">
    <!-- Header -->
    <div class="view-header">
      <div class="view-title">
        <h1>WebSocket Service</h1>
        <p>Comunicação em tempo real</p>
      </div>
      <div class="view-status">
        <div class="status-badge" :class="connectionStatus.connected ? 'online' : 'offline'">
          <span>{{ connectionStatus.connected ? 'ONLINE' : 'OFFLINE' }}</span>
        </div>
      </div>
      <div class="view-actions">
        <button @click="connectWebSocket" class="btn btn-primary" :disabled="connectionStatus.connected">
          <i class="fas fa-plug"></i>
          Conectar
        </button>
        <button @click="disconnectWebSocket" class="btn btn-secondary" :disabled="!connectionStatus.connected">
          <i class="fas fa-times"></i>
          Desconectar
        </button>
        <button @click="publishTestEvent" class="btn btn-success" :disabled="!connectionStatus.connected">
          <i class="fas fa-paper-plane"></i>
          Testar Evento
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="view-content">
      <!-- Status da Conexão -->
      <div class="service-card">
        <div class="card-header">
          <h3><i class="fas fa-broadcast-tower"></i> Status da Conexão</h3>
        </div>
        <div class="card-content">
          <div class="status-grid">
            <div class="status-item">
              <span class="label">Status:</span>
              <span class="value" :class="connectionStatus.connected ? 'online' : 'offline'">
                {{ connectionStatus.connected ? 'Conectado' : 'Desconectado' }}
              </span>
            </div>
            <div class="status-item">
              <span class="label">Connection ID:</span>
              <span class="value">{{ connectionStatus.connectionId || 'N/A' }}</span>
            </div>
            <div class="status-item">
              <span class="label">User ID:</span>
              <span class="value">{{ connectionStatus.userId || 'N/A' }}</span>
            </div>
            <div class="status-item">
              <span class="label">Tópicos Ativos:</span>
              <span class="value">{{ connectionStatus.topics.length }}</span>
            </div>
            <div class="status-item">
              <span class="label">Observers:</span>
              <span class="value">{{ connectionStatus.observers }}</span>
            </div>
            <div class="status-item">
              <span class="label">Fallback Mode:</span>
              <span class="value" :class="connectionStatus.fallbackMode ? 'warning' : 'normal'">
                {{ connectionStatus.fallbackMode ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Gerenciamento de Tópicos -->
      <div class="service-card">
        <div class="card-header">
          <h3><i class="fas fa-list"></i> Gerenciamento de Tópicos</h3>
        </div>
        <div class="card-content">
          <div class="topic-controls">
            <div class="input-group">
              <input 
                v-model="newTopic" 
                type="text" 
                placeholder="Nome do tópico"
                class="form-input"
                @keyup.enter="subscribeToTopic"
              />
              <button @click="subscribeToTopic" class="btn btn-primary" :disabled="!newTopic || !connectionStatus.connected">
                <i class="fas fa-plus"></i>
                Inscrever
              </button>
            </div>
          </div>
          
          <div class="topics-list">
            <h4>Tópicos Ativos:</h4>
            <div v-if="connectionStatus.topics.length === 0" class="empty-state">
              <i class="fas fa-info-circle"></i>
              <p>Nenhum tópico inscrito</p>
            </div>
            <div v-else class="topics-grid">
              <div 
                v-for="topic in connectionStatus.topics" 
                :key="topic"
                class="topic-item"
              >
                <span class="topic-name">{{ topic }}</span>
                <button @click="unsubscribeFromTopic(topic)" class="btn btn-sm btn-danger">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Eventos em Tempo Real -->
      <div class="service-card">
        <div class="card-header">
          <h3><i class="fas fa-bell"></i> Eventos em Tempo Real</h3>
        </div>
        <div class="card-content">
          <div class="events-controls">
            <button @click="clearEvents" class="btn btn-secondary">
              <i class="fas fa-trash"></i>
              Limpar Eventos
            </button>
            <span class="events-count">{{ events.length }} eventos</span>
          </div>
          
          <div class="events-list">
            <div v-if="events.length === 0" class="empty-state">
              <i class="fas fa-info-circle"></i>
              <p>Nenhum evento recebido</p>
            </div>
            <div v-else class="event-items">
              <div 
                v-for="event in events.slice().reverse()" 
                :key="event.id"
                class="event-item"
              >
                <div class="event-header">
                  <span class="event-topic">{{ event.topic }}</span>
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

      <!-- Métricas de Performance -->
      <div class="service-card">
        <div class="card-header">
          <h3><i class="fas fa-chart-line"></i> Métricas de Performance</h3>
        </div>
        <div class="card-content">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-value">{{ metrics.totalTopics }}</div>
              <div class="metric-label">Tópicos Ativos</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ metrics.totalObservers }}</div>
              <div class="metric-label">Observers</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ metrics.pendingMessages }}</div>
              <div class="metric-label">Mensagens Pendentes</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ formatUptime(metrics.lastHeartbeat) }}</div>
              <div class="metric-label">Último Heartbeat</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configurações -->
      <div class="service-card">
        <div class="card-header">
          <h3><i class="fas fa-cog"></i> Configurações</h3>
        </div>
        <div class="card-content">
          <div class="config-grid">
            <div class="config-item">
              <label>Porta WebSocket:</label>
              <input v-model="config.port" type="number" class="form-input" />
            </div>
            <div class="config-item">
              <label>Heartbeat (segundos):</label>
              <input v-model="config.heartbeatInterval" type="number" class="form-input" />
            </div>
            <div class="config-item">
              <label>Rate Limit (por minuto):</label>
              <input v-model="config.rateLimit" type="number" class="form-input" />
            </div>
            <div class="config-item">
              <label>Compressão (bytes):</label>
              <input v-model="config.compressionThreshold" type="number" class="form-input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import webSocketService from '../services/WebSocketService.js';

export default {
  name: 'WebSocketView',
  data() {
    return {
      connectionStatus: {
        connected: false,
        connectionId: null,
        userId: null,
        topics: [],
        observers: 0,
        fallbackMode: false,
        reconnectAttempts: 0
      },
      metrics: {
        totalTopics: 0,
        totalObservers: 0,
        pendingMessages: 0,
        lastHeartbeat: null
      },
      events: [],
      newTopic: '',
      config: {
        port: 3703,
        heartbeatInterval: 30,
        rateLimit: 100,
        compressionThreshold: 1024
      }
    };
  },
  
  mounted() {
    this.updateStatus();
    this.updateMetrics();
    
    // Atualizar status a cada segundo
    this.statusInterval = setInterval(() => {
      this.updateStatus();
      this.updateMetrics();
    }, 1000);
  },
  
  beforeUnmount() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  },
  
  methods: {
    async connectWebSocket() {
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (!token) {
          alert('Token de autenticação não encontrado');
          return;
        }
        
        await webSocketService.connect(token);
        this.updateStatus();
        
        // Inscrever em alguns tópicos de exemplo
        this.subscribeToExampleTopics();
        
      } catch (error) {
        console.error('Erro ao conectar:', error);
        alert('Erro ao conectar ao WebSocket');
      }
    },
    
    disconnectWebSocket() {
      webSocketService.disconnect();
      this.updateStatus();
    },
    
    subscribeToExampleTopics() {
      // Inscrever em tópicos de exemplo
      const exampleTopics = ['system.notifications', 'user.events', 'data.updates'];
      
      exampleTopics.forEach(topic => {
        webSocketService.subscribe(topic, (message) => {
          this.events.push({
            id: message.id,
            topic: message.topic,
            data: message.data,
            timestamp: message.timestamp || Date.now()
          });
        });
      });
    },
    
    subscribeToTopic() {
      if (!this.newTopic.trim()) return;
      
      webSocketService.subscribe(this.newTopic, (message) => {
        this.events.push({
          id: message.id,
          topic: message.topic,
          data: message.data,
          timestamp: message.timestamp || Date.now()
        });
      });
      
      this.newTopic = '';
      this.updateStatus();
    },
    
    unsubscribeFromTopic(topic) {
      // Encontrar e remover todos os observers do tópico
      const observers = webSocketService.observers.get(topic);
      if (observers) {
        observers.forEach(callback => {
          webSocketService.unsubscribe(topic, callback);
        });
      }
      
      this.updateStatus();
    },
    
    publishTestEvent() {
      const testEvent = {
        message: 'Teste de evento',
        timestamp: Date.now(),
        source: 'frontend'
      };
      
      webSocketService.publish('test.events', testEvent);
    },
    
    clearEvents() {
      this.events = [];
    },
    
    updateStatus() {
      this.connectionStatus = webSocketService.getConnectionStatus();
    },
    
    updateMetrics() {
      this.metrics = webSocketService.getMetrics();
    },
    
    formatTime(timestamp) {
      if (!timestamp) return 'N/A';
      return new Date(timestamp).toLocaleTimeString();
    },
    
    formatUptime(timestamp) {
      if (!timestamp) return 'N/A';
      const now = Date.now();
      const diff = Math.floor((now - timestamp) / 1000);
      return `${diff}s atrás`;
    }
  }
};
</script>

<style scoped>
.tollgate-view {
  padding: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #475569;
}

.view-title h1 {
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.view-title p {
  color: #94a3b8;
  font-size: 0.875rem;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.online {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.offline {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.view-actions {
  display: flex;
  gap: 1rem;
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
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
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-header h3 {
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-content {
  color: #e2e8f0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.status-item .label {
  font-weight: 500;
  color: #94a3b8;
}

.status-item .value {
  font-weight: 600;
}

.status-item .value.online {
  color: #10b981;
}

.status-item .value.offline {
  color: #ef4444;
}

.status-item .value.warning {
  color: #f59e0b;
}

.topic-controls {
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.form-input {
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.topics-list {
  margin-top: 1rem;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.topic-name {
  font-weight: 500;
  color: #e2e8f0;
}

.events-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.events-count {
  font-weight: 500;
  color: #94a3b8;
}

.events-list {
  max-height: 400px;
  overflow-y: auto;
}

.event-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #3b82f6;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.event-topic {
  font-weight: 600;
  color: #3b82f6;
}

.event-time {
  font-size: 0.875rem;
  color: #94a3b8;
}

.event-data {
  background: rgba(15, 23, 42, 0.5);
  padding: 0.5rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.875rem;
  overflow-x: auto;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
}

.metric-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-item label {
  font-weight: 500;
  color: #94a3b8;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 