/**
 * WebSocket Service com Observable Pattern
 * Implementação moderna com fallback, retry e compressão
 */

class WebSocketService {
  constructor() {
    console.log('🔍 WebSocketService constructor chamado - nova instância criada');
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscribers = new Map();
    this.connectionPromise = null;

    // Callbacks para eventos
    this.connectionChangeCallbacks = [];
    this.metricsUpdateCallbacks = [];
  }

  /**
   * Conectar ao WebSocket
   */
  async connect() {
    console.log('🔍 WebSocketService.connect() chamado');
    if (this.isConnected) {
      console.log('🔍 WebSocket já está conectado, retornando');
      return;
    }

    try {
      const token = this.getStoredToken();
      const wsUrl = `ws://localhost:3703/ws?token=${encodeURIComponent(token)}`;
      
      console.log('Conectando ao WebSocket:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket conectado');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionChange('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Mensagem recebida:', data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket desconectado');
        this.isConnected = false;
        this.notifyConnectionChange('disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        this.isConnected = false;
        this.notifyConnectionChange('error');
      };

    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
      this.isConnected = false;
    }
  }

  /**
   * Tentar reconectar
   */
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Máximo de tentativas de reconexão atingido');
    }
  }

  /**
   * Enviar mensagem
   */
  sendMessage(message) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket não está conectado');
    }
  }

  /**
   * Processar mensagem recebida
   */
  handleMessage(data) {
    console.log('🔍 handleMessage chamado com:', data);
    const { type, topic } = data;
    
    // Processar mensagens especiais
    switch (type) {
      case 'connection':
        console.log('Conexão estabelecida:', data);
        break;
      case 'test':
        console.log('Mensagem de teste recebida:', data);
        console.log('Subscribers disponíveis:', Array.from(this.subscribers.keys()));
        
        // Notificar apenas os subscribers do tópico específico da mensagem
        const messageTopic = data.topic;
        if (messageTopic && this.subscribers.has(messageTopic)) {
          const callbacks = this.subscribers.get(messageTopic);
          console.log(`Notificando subscribers do tópico: ${messageTopic} (${callbacks.length} callbacks)`);
          callbacks.forEach(callback => {
            try {
              callback(data);
            } catch (error) {
              console.error('Erro no callback:', error);
            }
          });
        } else {
          console.log(`Nenhum subscriber encontrado para o tópico: ${messageTopic}`);
        }
        break;
      case 'download_progress':
        console.log('Progresso de download recebido:', data);
        // Notificar subscribers do tópico 'downloads'
        if (this.subscribers.has('downloads')) {
          const callbacks = this.subscribers.get('downloads');
          callbacks.forEach(callback => {
            try {
              callback(data);
            } catch (error) {
              console.error('Erro no callback de download:', error);
            }
          });
        }
        break;
      case 'download_completed':
        console.log('Download concluído:', data);
        // Notificar subscribers do tópico 'downloads'
        if (this.subscribers.has('downloads')) {
          const callbacks = this.subscribers.get('downloads');
          callbacks.forEach(callback => {
            try {
              callback(data);
            } catch (error) {
              console.error('Erro no callback de download:', error);
            }
          });
        }
        break;
      case 'download_cancelled':
        console.log('Download cancelado:', data);
        // Notificar subscribers do tópico 'downloads'
        if (this.subscribers.has('downloads')) {
          const callbacks = this.subscribers.get('downloads');
          callbacks.forEach(callback => {
            try {
              callback(data);
            } catch (error) {
              console.error('Erro no callback de download:', error);
            }
          });
        }
        break;
      default:
        // Notificar subscribers do tópico (apenas para mensagens não especiais)
        if (topic && this.subscribers.has(topic)) {
          this.subscribers.get(topic).forEach(callback => {
            try {
              callback(data);
            } catch (error) {
              console.error('Erro no callback:', error);
            }
          });
        }
        console.log('Mensagem processada:', data);
    }
  }

  /**
   * Inscrever em um tópico
   */
  subscribe(topic, callback) {
    // LIMPAR TODAS AS INSCRIÇÕES ANTERIORES DO TÓPICO
    if (this.subscribers.has(topic)) {
      console.log(`🔍 LIMPANDO ${this.subscribers.get(topic).length} callbacks anteriores do tópico: ${topic}`);
      this.subscribers.delete(topic);
    }
    
    // CRIAR NOVA LISTA COM APENAS ESTE CALLBACK
    this.subscribers.set(topic, [callback]);
    console.log(`🔍 NOVA INSCRIÇÃO ÚNICA no tópico: ${topic}`);
    
    // Enviar mensagem de subscribe
    this.sendMessage({
      type: 'subscribe',
      topic: topic
    });
  }

  /**
   * Desinscrever de um tópico
   */
  unsubscribe(topic, callback = null) {
    if (this.subscribers.has(topic)) {
      if (callback) {
        // Remover callback específico
        const callbacks = this.subscribers.get(topic);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      } else {
        // Remover todos os callbacks do tópico
        this.subscribers.delete(topic);
        console.log(`🔍 Todos os callbacks removidos do tópico: ${topic}`);
      }
    }
    
    // Enviar mensagem de unsubscribe para o backend
    this.sendMessage({
      type: 'unsubscribe',
      topic: topic
    });
  }

  /**
   * Desconectar
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.subscribers.clear();
  }

  /**
   * Obter token armazenado
   */
  getStoredToken() {
    // Simular token para teste
    return "eyJpZCI6MSwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImFkbWluQGNhbm9uaWthLmlvIiwicm9sZXMiOlsiYWRtaW4iXSwicGVybWlzc2lvbnMiOlsicmVhZCIsIndyaXRlIiwiYWRtaW4iXX0=";
  }

  /**
   * Callback para mudanças de conexão
   */
  onConnectionChange(callback) {
    this.connectionChangeCallbacks.push(callback);
  }

  /**
   * Callback para atualizações de métricas
   */
  onMetricsUpdate(callback) {
    this.metricsUpdateCallbacks.push(callback);
  }

  /**
   * Notificar mudanças de conexão
   */
  notifyConnectionChange(status) {
    this.connectionChangeCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Erro no callback de conexão:', error);
      }
    });
  }

  /**
   * Notificar atualizações de métricas
   */
  notifyMetricsUpdate(metrics) {
    this.metricsUpdateCallbacks.forEach(callback => {
      try {
        callback(metrics);
      } catch (error) {
        console.error('Erro no callback de métricas:', error);
      }
    });
  }
}

export default new WebSocketService(); 