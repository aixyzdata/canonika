<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão das outras views -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-broadcast-tower"></i>
        <div class="title-content">
          <h1>WebSocket</h1>
          <p>Conexão Real-time</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator" :class="statusIndicatorClass"></div>
        <span>{{ statusText }}</span>
      </div>
      <div class="view-actions">
        <button 
          class="btn btn-primary btn-sm" 
          @click="connect"
          :disabled="!canConnect || isConnecting"
        >
          <i class="fas fa-plug me-2"></i>
          {{ isConnecting ? 'Conectando...' : 'Conectar' }}
        </button>
        <button 
          class="btn btn-secondary btn-sm" 
          @click="disconnect"
          :disabled="!canDisconnect || isDisconnecting"
        >
          <i class="fas fa-times me-2"></i>
          {{ isDisconnecting ? 'Desconectando...' : 'Desconectar' }}
        </button>
        <button 
          class="btn btn-success btn-sm" 
          @click="sendTestMessage"
          :disabled="connectionStatus !== 'connected'"
        >
          <i class="fas fa-paper-plane me-2"></i>
          Teste
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status da Conexão -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-signal text-success me-2"></i>
            Status da Conexão
          </h3>
          <p class="section-description">
            Monitoramento em tempo real da conexão WebSocket.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-broadcast-tower"></i>
                </div>
                <div class="card-title">
                  <h4>Conexão WebSocket</h4>
                  <span class="card-subtitle">ws://localhost:3703/ws</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge" :class="statusIndicatorClass">{{ statusText }}</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.toUpperCase() }}</span>
                    <span class="metric-label">Estado</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ metrics.latency }}ms</span>
                    <span class="metric-label">Latência</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ metrics.uptime }}</span>
                    <span class="metric-label">Uptime</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="card-title">
                  <h4>Métricas</h4>
                  <span class="card-subtitle">Performance</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge" :class="connectionStatus === 'connected' ? 'online' : 'offline'">
                    {{ connectionStatus === 'connected' ? 'Ótima' : 'Indisponível' }}
                  </span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ metrics.messagesPerMinute }}</span>
                    <span class="metric-label">Mensagens/min</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ metrics.deliveryRate }}%</span>
                    <span class="metric-label">Delivery Rate</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ metrics.avgResponse }}ms</span>
                    <span class="metric-label">Avg Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Eventos em Tempo Real -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-bell text-warning me-2"></i>
            Eventos em Tempo Real
          </h3>
          <p class="section-description">
            Últimos eventos recebidos via WebSocket.
          </p>
        </div>
        
        <div class="section-content">
          <div class="info-cards">
            <div class="info-card">
              <div class="info-label">Último Evento</div>
              <div class="info-value">{{ events.length > 0 ? events[0].type : 'Nenhum' }}</div>
              <div class="info-description">{{ events.length > 0 ? 'Há alguns segundos' : 'Aguardando eventos' }}</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Total Eventos</div>
              <div class="info-value">{{ events.length }}</div>
              <div class="info-description">Recebidos</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Tópicos Ativos</div>
              <div class="info-value">{{ topics.length }}</div>
              <div class="info-description">Inscritos</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Connection ID</div>
              <div class="info-value">{{ connectionId || 'N/A' }}</div>
              <div class="info-description">ID da conexão</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Log de Eventos -->
      <div class="canonika-section" v-if="events.length > 0">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-list text-info me-2"></i>
            Log de Eventos
          </h3>
          <p class="section-description">
            Histórico dos últimos eventos recebidos.
          </p>
        </div>
        
        <div class="section-content">
          <div class="event-log">
            <div 
              v-for="(event, index) in events.slice(0, 10)" 
              :key="index"
              class="event-item"
            >
              <div class="event-header">
                <span class="event-type">{{ event.type }}</span>
                <span class="event-time">{{ new Date(event.timestamp).toLocaleTimeString() }}</span>
              </div>
              <div class="event-data">
                {{ JSON.stringify(event.data, null, 2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WebSocketService from '../services/WebSocketService.js'
import AuthService from '/app/shared/services/AuthService.js'

export default {
  name: 'WebSocketView',
  data() {
    return {
      wsService: new WebSocketService(),
      connectionStatus: 'disconnected',
      connectionId: null,
      metrics: {
        messagesPerMinute: 0,
        deliveryRate: 0,
        avgResponse: 0,
        latency: 0,
        uptime: '0s'
      },
      events: [],
      topics: [],
      isConnecting: false,
      isDisconnecting: false
    }
  },
  async mounted() {
    console.log('📡 WebSocketView carregada')
    await this.initializeWebSocket()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    async initializeWebSocket() {
      try {
        // Obter token de autenticação
        const token = localStorage.getItem('canonika_access_token')
        if (!token) {
          console.error('Token não encontrado')
          return
        }

        // Configurar listeners
        this.setupWebSocketListeners()
        
        // Conectar automaticamente
        await this.connect()
        
      } catch (error) {
        console.error('Erro ao inicializar WebSocket:', error)
      }
    },

    setupWebSocketListeners() {
      // Listener para status de conexão
      this.wsService.onConnectionChange((status) => {
        this.connectionStatus = status
        console.log('Status da conexão:', status)
      })

      // Listener para métricas
      this.wsService.onMetricsUpdate((metrics) => {
        this.metrics = { ...this.metrics, ...metrics }
      })

      // Listener para eventos
      this.wsService.subscribe('events', (event) => {
        this.events.unshift(event)
        if (this.events.length > 50) {
          this.events.pop()
        }
      })

      // Listener para tópicos
      this.wsService.subscribe('topics', (topic) => {
        if (!this.topics.includes(topic)) {
          this.topics.push(topic)
        }
      })
    },

    async connect() {
      if (this.isConnecting) return
      
      this.isConnecting = true
      try {
        const token = localStorage.getItem('canonika_access_token')
        await this.wsService.connect(token)
        
        // Aguardar confirmação de conexão
        await this.waitForConnection()
        
        // Inscrever em tópicos padrão
        await this.subscribeToDefaultTopics()
        
      } catch (error) {
        console.error('Erro ao conectar:', error)
        this.connectionStatus = 'error'
      } finally {
        this.isConnecting = false
      }
    },

    async disconnect() {
      if (this.isDisconnecting) return
      
      this.isDisconnecting = true
      try {
        this.wsService.disconnect()
        this.connectionStatus = 'disconnected'
        this.connectionId = null
      } catch (error) {
        console.error('Erro ao desconectar:', error)
      } finally {
        this.isDisconnecting = false
      }
    },

    async waitForConnection() {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout ao aguardar conexão'))
        }, 5000)

        const checkConnection = () => {
          if (this.wsService.isConnected) {
            clearTimeout(timeout)
            resolve()
          } else {
            setTimeout(checkConnection, 100)
          }
        }
        checkConnection()
      })
    },

    async subscribeToDefaultTopics() {
      const defaultTopics = ['system', 'notifications', 'metrics']
      
      for (const topic of defaultTopics) {
        try {
          await this.wsService.subscribe(topic, (data) => {
            console.log(`Mensagem do tópico ${topic}:`, data)
          })
        } catch (error) {
          console.error(`Erro ao inscrever no tópico ${topic}:`, error)
        }
      }
    },

    async sendTestMessage() {
      try {
        const testMessage = {
          type: 'test',
          data: {
            message: 'Teste de WebSocket',
            timestamp: new Date().toISOString()
          }
        }
        
        await this.wsService.send(testMessage)
        console.log('Mensagem de teste enviada')
      } catch (error) {
        console.error('Erro ao enviar mensagem de teste:', error)
      }
    },

    cleanup() {
      if (this.wsService) {
        this.wsService.disconnect()
      }
    }
  },

  computed: {
    statusIndicatorClass() {
      return {
        'online': this.connectionStatus === 'connected',
        'offline': this.connectionStatus === 'disconnected',
        'warning': this.connectionStatus === 'connecting' || this.connectionStatus === 'error'
      }
    },

    statusText() {
      const statusMap = {
        'connected': 'Conectado',
        'disconnected': 'Desconectado',
        'connecting': 'Conectando...',
        'error': 'Erro de Conexão'
      }
      return statusMap[this.connectionStatus] || 'Desconhecido'
    },

    canConnect() {
      return this.connectionStatus === 'disconnected' && !this.isConnecting
    },

    canDisconnect() {
      return this.connectionStatus === 'connected' && !this.isDisconnecting
    }
  }
}
</script>

<style scoped>
.event-log {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  background: rgba(30, 41, 59, 0.5);
}

.event-item {
  padding: 1rem;
  border-bottom: 1px solid #475569;
  transition: background-color 0.2s ease;
}

.event-item:last-child {
  border-bottom: none;
}

.event-item:hover {
  background: rgba(59, 130, 246, 0.1);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.event-type {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.875rem;
}

.event-time {
  color: #94a3b8;
  font-size: 0.75rem;
}

.event-data {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>