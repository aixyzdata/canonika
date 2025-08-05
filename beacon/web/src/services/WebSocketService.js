class WebSocketService {
  constructor(url, options = {}) {
    this.url = url;
    this.clientId = options.clientId || this.generateClientId();
    this.options = {
      reconnectInterval: options.reconnectInterval || 5000,
      maxReconnectAttempts: options.maxReconnectAttempts || 10,
      heartbeatInterval: options.heartbeatInterval || 30000,
      ...options
    };
    
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.subscribers = new Map();
    this.eventListeners = new Map();
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.messageQueue = [];
    this.pendingMessages = new Map();
    
    // Bind methods
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.send = this.send.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.publish = this.publish.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  generateClientId() {
    return 'client_' + Math.random().toString(36).substr(2, 9);
  }

  async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.url}/ws/${this.clientId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('🔗 WebSocket conectado:', this.clientId);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.processMessageQueue();
          this.emit('connected', { clientId: this.clientId });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket desconectado:', event.code, event.reason);
          this.isConnected = false;
          this.stopHeartbeat();
          this.emit('disconnected', { code: event.code, reason: event.reason });
          
          if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
            this.scheduleReconnect();
          } else {
            this.emit('reconnect_failed');
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Erro no WebSocket:', error);
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        console.error('❌ Erro ao conectar WebSocket:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.options.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Tentativa de reconexão ${this.reconnectAttempts}/${this.options.maxReconnectAttempts} em ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('❌ Falha na reconexão:', error);
      });
    }, delay);
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({
          type: 'heartbeat',
          timestamp: Date.now()
        });
      }
    }, this.options.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  send(message) {
    if (!this.isConnected) {
      this.messageQueue.push(message);
      return;
    }

    try {
      const messageStr = JSON.stringify(message);
      this.ws.send(messageStr);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      this.messageQueue.push(message);
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  handleMessage(message) {
    console.log('📨 Mensagem recebida:', message);
    
    switch (message.type) {
      case 'event':
        this.handleEvent(message);
        break;
      case 'response':
        this.handleResponse(message);
        break;
      case 'heartbeat':
        this.handleHeartbeat(message);
        break;
      default:
        console.log('❓ Tipo de mensagem desconhecido:', message.type);
    }
  }

  handleEvent(message) {
    const topic = message.topic;
    const eventData = message.data;
    
    // Notificar subscribers do tópico
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic).forEach(callback => {
        try {
          callback(eventData);
        } catch (error) {
          console.error('❌ Erro no callback do subscriber:', error);
        }
      });
    }
    
    // Emitir evento global
    this.emit('event', { topic, data: eventData });
  }

  handleResponse(message) {
    const requestId = message.id;
    if (this.pendingMessages.has(requestId)) {
      const { resolve, reject } = this.pendingMessages.get(requestId);
      this.pendingMessages.delete(requestId);
      
      if (message.data && message.data.error) {
        reject(new Error(message.data.error));
      } else {
        resolve(message.data);
      }
    }
  }

  handleHeartbeat(message) {
    this.emit('heartbeat', message.data);
  }

  subscribe(topic, callback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    
    this.subscribers.get(topic).add(callback);
    
    // Enviar comando de subscribe
    this.send({
      type: 'subscribe',
      topic: topic
    });
    
    return () => this.unsubscribe(topic, callback);
  }

  unsubscribe(topic, callback) {
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic).delete(callback);
      
      if (this.subscribers.get(topic).size === 0) {
        this.subscribers.delete(topic);
      }
    }
    
    // Enviar comando de unsubscribe
    this.send({
      type: 'unsubscribe',
      topic: topic
    });
  }

  publish(topic, data, priority = 'medium') {
    this.send({
      type: 'event',
      topic: topic,
      data: data,
      priority: priority,
      source: this.clientId
    });
  }

  async getMetrics() {
    return this.sendCommand('get_metrics');
  }

  async getTopics() {
    return this.sendCommand('get_topics');
  }

  async getClients() {
    return this.sendCommand('get_clients');
  }

  sendCommand(command) {
    return new Promise((resolve, reject) => {
      const messageId = this.generateMessageId();
      
      this.pendingMessages.set(messageId, { resolve, reject });
      
      this.send({
        type: 'command',
        command: command,
        id: messageId
      });
      
      // Timeout para evitar promises pendentes
      setTimeout(() => {
        if (this.pendingMessages.has(messageId)) {
          this.pendingMessages.delete(messageId);
          reject(new Error('Timeout na resposta do comando'));
        }
      }, 10000);
    });
  }

  generateMessageId() {
    return 'msg_' + Math.random().toString(36).substr(2, 9);
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('❌ Erro no event listener:', error);
        }
      });
    }
  }

  // Métodos de conveniência para monitoramento
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      clientId: this.clientId,
      reconnectAttempts: this.reconnectAttempts,
      subscribersCount: this.subscribers.size,
      queueSize: this.messageQueue.length,
      pendingMessagesCount: this.pendingMessages.size
    };
  }

  getSubscribers() {
    const result = {};
    for (const [topic, callbacks] of this.subscribers) {
      result[topic] = callbacks.size;
    }
    return result;
  }
}

// Instância singleton
const beaconWebSocket = new WebSocketService('ws://localhost:3703', {
  clientId: 'beacon_frontend_' + Math.random().toString(36).substr(2, 9),
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000
});

export default beaconWebSocket; 