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

      <!-- Seção: Testes WebSocket -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-vial text-warning me-2"></i>
            Testes WebSocket
          </h3>
          <p class="section-description">
            Execute testes automatizados para validar a conectividade e funcionalidade do WebSocket.
          </p>
        </div>
        
        <div class="section-content">
          <!-- Configurações do Teste -->
          <div class="test-config">
            <div class="config-row">
              <div class="config-item">
                <label for="messageCount">Quantidade de Mensagens:</label>
                <input 
                  id="messageCount"
                  v-model.number="testConfig.messageCount" 
                  type="number" 
                  min="1" 
                  max="1000"
                  class="form-control"
                  :disabled="isTestRunning"
                >
              </div>
              
              <div class="config-item">
                <label for="testType">Tipo de Teste:</label>
                <select 
                  id="testType"
                  v-model="testConfig.testType" 
                  class="form-control"
                  :disabled="isTestRunning"
                >
                  <option value="random">Mensagens Aleatórias</option>
                  <option value="sequential">Mensagens Sequenciais</option>
                  <option value="json">JSON Complexo</option>
                  <option value="error_simulation">Simulação de Erros</option>
                </select>
              </div>
              
              <div class="config-item">
                <label for="topic">Tópico:</label>
                <input 
                  id="topic"
                  v-model="testConfig.topic" 
                  type="text" 
                  class="form-control"
                  placeholder="test"
                  :disabled="isTestRunning"
                >
              </div>
              
              <div class="config-item">
                <label for="delayMs">Delay (ms):</label>
                <input 
                  id="delayMs"
                  v-model.number="testConfig.delayMs" 
                  type="number" 
                  min="100" 
                  max="10000"
                  class="form-control"
                  :disabled="isTestRunning"
                >
              </div>
            </div>
            
            <div class="test-actions">
              <button 
                @click="startTest"
                :disabled="!canStartTest || isTestRunning"
                class="btn btn-primary"
              >
                <i class="fas fa-play me-2"></i>
                {{ isTestRunning ? 'Teste em Execução...' : 'Iniciar Teste' }}
              </button>
              
              <button 
                @click="stopTest"
                :disabled="!isTestRunning"
                class="btn btn-danger"
              >
                <i class="fas fa-stop me-2"></i>
                Parar Teste
              </button>
              
              <button 
                @click="clearTestLog"
                :disabled="testLog.length === 0"
                class="btn btn-secondary"
              >
                <i class="fas fa-trash me-2"></i>
                Limpar Log
              </button>
            </div>
          </div>

          <!-- Status do Teste -->
          <div v-if="currentTest" class="test-status">
            <div class="status-info">
              <div class="status-item">
                <span class="status-label">Status:</span>
                <span class="status-value" :class="currentTest.status">{{ getStatusText(currentTest.status) }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Progresso:</span>
                <span class="status-value">{{ Math.round(currentTest.progress || 0) }}%</span>
              </div>
              <div class="status-item">
                <span class="status-label">Enviadas:</span>
                <span class="status-value">{{ currentTest.sent_count || 0 }} / {{ currentTest.total_count || 0 }}</span>
              </div>
            </div>
            
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: (currentTest.progress || 0) + '%' }"
                :class="currentTest.status"
              ></div>
            </div>
          </div>

          <!-- Terminal de Teste -->
          <div class="test-terminal">
            <div class="terminal-header">
              <span class="terminal-title">
                <i class="fas fa-terminal me-2"></i>
                Terminal de Teste
              </span>
              <span class="terminal-status">
                {{ testLog.length }} mensagens recebidas
              </span>
            </div>
            
            <div class="terminal-content" ref="terminalContent">
              <div 
                v-for="(log, index) in testLog" 
                :key="index"
                class="log-entry"
                :class="getLogEntryClass(log)"
              >
                <div class="log-timestamp">
                  {{ new Date(log.timestamp).toLocaleTimeString() }}
                </div>
                <div class="log-type">
                  [{{ log.type }}]
                </div>
                <div class="log-message">
                  {{ formatLogMessage(log) }}
                </div>
              </div>
              
              <div v-if="testLog.length === 0" class="no-logs">
                <i class="fas fa-info-circle"></i>
                Nenhuma mensagem de teste recebida ainda.
              </div>
            </div>
          </div>

          <!-- Estatísticas do Teste -->
          <div v-if="testStats.totalMessages > 0" class="test-stats">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ testStats.totalMessages }}</div>
                <div class="stat-label">Total de Mensagens</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ testStats.successRate }}%</div>
                <div class="stat-label">Taxa de Sucesso</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ testStats.avgLatency }}ms</div>
                <div class="stat-label">Latência Média</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ testStats.errors }}</div>
                <div class="stat-label">Erros</div>
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
      isDisconnecting: false,
      
      // Teste WebSocket
      testConfig: {
        messageCount: 10,
        testType: 'random',
        topic: 'test',
        delayMs: 1000
      },
      currentTest: null,
      isTestRunning: false,
      testLog: [],
      testStats: {
        totalMessages: 0,
        successRate: 0,
        avgLatency: 0,
        errors: 0
      },
      statusPollingInterval: null
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
      this.stopStatusPolling()
    },

    // Métodos de Teste WebSocket
    async startTest() {
      if (!this.wsService.isConnected) {
        this.addTestLog('error', 'WebSocket não está conectado. Conecte primeiro.')
        return
      }

      try {
        this.isTestRunning = true
        this.clearTestLog()
        
        // Iniciar teste no backend
        const response = await fetch('/api/test/websocket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('canonika_access_token')}`
          },
          body: JSON.stringify(this.testConfig)
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        this.currentTest = {
          id: result.test_id,
          status: 'running',
          progress: 0,
          sent_count: 0,
          total_count: this.testConfig.messageCount
        }

        this.addTestLog('info', `Teste iniciado: ${result.test_id}`)
        this.addTestLog('info', `Configuração: ${this.testConfig.messageCount} mensagens, tipo: ${this.testConfig.testType}, tópico: ${this.testConfig.topic}`)
        
        // Iniciar polling de status
        this.startStatusPolling()
        
        // Inscrever no tópico de teste se especificado
        if (this.testConfig.topic) {
          await this.wsService.subscribe(this.testConfig.topic, (message) => {
            this.handleTestMessage(message)
          })
          this.addTestLog('info', `Inscrito no tópico: ${this.testConfig.topic}`)
        }

      } catch (error) {
        console.error('Erro ao iniciar teste:', error)
        this.addTestLog('error', `Erro ao iniciar teste: ${error.message}`)
        this.isTestRunning = false
      }
    },

    async stopTest() {
      if (!this.currentTest) return

      try {
        const response = await fetch(`/api/test/stop/${this.currentTest.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('canonika_access_token')}`
          }
        })

        if (response.ok) {
          this.addTestLog('warning', 'Teste parado pelo usuário')
          this.currentTest.status = 'stopped'
        }
      } catch (error) {
        console.error('Erro ao parar teste:', error)
        this.addTestLog('error', `Erro ao parar teste: ${error.message}`)
      }
    },

    async startStatusPolling() {
      this.statusPollingInterval = setInterval(async () => {
        if (!this.currentTest || !this.isTestRunning) {
          this.stopStatusPolling()
          return
        }

        try {
          const response = await fetch(`/api/test/status/${this.currentTest.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('canonika_access_token')}`
            }
          })

          if (response.ok) {
            const status = await response.json()
            this.currentTest = { ...this.currentTest, ...status }

            // Verificar se teste foi concluído
            if (status.status === 'completed' || status.status === 'error' || status.status === 'stopped') {
              this.isTestRunning = false
              this.stopStatusPolling()
              this.updateTestStats()
              
              if (status.status === 'completed') {
                this.addTestLog('success', 'Teste concluído com sucesso!')
              } else if (status.status === 'error') {
                this.addTestLog('error', 'Teste falhou com erros')
              }
            }
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error)
        }
      }, 1000)
    },

    stopStatusPolling() {
      if (this.statusPollingInterval) {
        clearInterval(this.statusPollingInterval)
        this.statusPollingInterval = null
      }
    },

    handleTestMessage(message) {
      const now = Date.now()
      const latency = now - (message.timestamp * 1000)
      
      this.addTestLog('message', message, latency)
      this.updateTestStats()
    },

    addTestLog(type, message, latency = 0) {
      const logEntry = {
        type,
        message: typeof message === 'string' ? message : JSON.stringify(message, null, 2),
        timestamp: Date.now(),
        latency,
        raw: message
      }

      this.testLog.unshift(logEntry)
      
      // Limitar log a 1000 entradas
      if (this.testLog.length > 1000) {
        this.testLog = this.testLog.slice(0, 1000)
      }

      // Auto-scroll para o topo
      this.$nextTick(() => {
        if (this.$refs.terminalContent) {
          this.$refs.terminalContent.scrollTop = 0
        }
      })
    },

    clearTestLog() {
      this.testLog = []
      this.testStats = {
        totalMessages: 0,
        successRate: 0,
        avgLatency: 0,
        errors: 0
      }
    },

    updateTestStats() {
      const messages = this.testLog.filter(log => log.type === 'message')
      const errors = this.testLog.filter(log => log.type === 'error')
      const latencies = messages.map(log => log.latency).filter(lat => lat > 0)

      this.testStats = {
        totalMessages: messages.length,
        successRate: messages.length > 0 ? Math.round(((messages.length - errors.length) / messages.length) * 100) : 0,
        avgLatency: latencies.length > 0 ? Math.round(latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length) : 0,
        errors: errors.length
      }
    },

    getLogEntryClass(log) {
      return {
        'log-message': log.type === 'message',
        'log-error': log.type === 'error',
        'log-warning': log.type === 'warning',
        'log-success': log.type === 'success',
        'log-info': log.type === 'info'
      }
    },

    formatLogMessage(log) {
      if (log.type === 'message' && log.raw && log.raw.data) {
        const data = log.raw.data
        if (typeof data === 'object') {
          if (data.text) return data.text
          if (data.error) return `ERRO: ${data.error}`
          return JSON.stringify(data, null, 2)
        }
      }
      return log.message
    },

    getStatusText(status) {
      const statusMap = {
        'running': 'Executando',
        'completed': 'Concluído',
        'error': 'Erro',
        'stopped': 'Parado'
      }
      return statusMap[status] || status
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
    },

    canStartTest() {
      return this.connectionStatus === 'connected' && !this.isTestRunning
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

/* Teste WebSocket Styles */
.test-config {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.config-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.config-item {
  display: flex;
  flex-direction: column;
}

.config-item label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.config-item input,
.config-item select {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #475569;
  border-radius: 0.25rem;
  padding: 0.5rem;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.config-item input:focus,
.config-item select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.test-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.test-status {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.status-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-label {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.status-value {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
}

.status-value.running {
  color: #3b82f6;
}

.status-value.completed {
  color: #10b981;
}

.status-value.error {
  color: #ef4444;
}

.status-value.stopped {
  color: #f59e0b;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.progress-fill.completed {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-fill.error {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.progress-fill.stopped {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.test-terminal {
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.terminal-header {
  background: #334155;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #475569;
}

.terminal-title {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.terminal-status {
  font-size: 0.75rem;
  color: #94a3b8;
}

.terminal-content {
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  line-height: 1.4;
}

.log-entry {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.log-entry:hover {
  background: rgba(59, 130, 246, 0.1);
}

.log-timestamp {
  color: #94a3b8;
  min-width: 80px;
  font-size: 0.7rem;
}

.log-type {
  color: #3b82f6;
  min-width: 60px;
  font-weight: 600;
}

.log-message {
  color: #e2e8f0;
  flex: 1;
  word-break: break-word;
}

.log-entry.log-error .log-type {
  color: #ef4444;
}

.log-entry.log-warning .log-type {
  color: #f59e0b;
}

.log-entry.log-success .log-type {
  color: #10b981;
}

.log-entry.log-info .log-type {
  color: #06b6d4;
}

.no-logs {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-style: italic;
}

.no-logs i {
  margin-right: 0.5rem;
}

.test-stats {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>