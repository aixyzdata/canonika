/**
 * WebSocket Service com Observable Pattern
 * Implementação moderna com fallback, retry e compressão
 */

class WebSocketService {
  constructor() {
    this.ws = null;
    this.connectionId = null;
    this.userId = null;
    this.topics = new Set();
    this.observers = new Map(); // topic -> Set of callbacks
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.isConnected = false;
    this.pendingMessages = [];
    this.fallbackMode = false;
    this.fallbackEndpoint = '/api/events';
    
    // Configurações
    this.config = {
      url: 'ws://localhost:3703/ws',
      heartbeatInterval: 30000,
      compressionThreshold: 1024,
      rateLimit: 100,
      maxRetries: 5
    };
  }

  /**
   * Conectar ao WebSocket
   */
  async connect(token) {
    try {
      // Decodificar token para obter user_id
      const payload = this.decodeToken(token);
      this.userId = payload.id;
      
      // Construir URL com token
      const wsUrl = `${this.config.url}?token=${encodeURIComponent(token)}`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.processPendingMessages();
      };
      
      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.stopHeartbeat();
        
        // Tentar reconectar se não foi fechamento intencional
        if (event.code !== 1000) {
          this.scheduleReconnect();
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.fallbackMode = true;
      };
      
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  /**
   * Desconectar do WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnect');
    }
    this.stopHeartbeat();
    this.isConnected = false;
    this.topics.clear();
    this.observers.clear();
  }

  /**
   * Inscrever em um tópico (Observable Pattern)
   */
  subscribe(topic, callback) {
    if (!this.observers.has(topic)) {
      this.observers.set(topic, new Set());
    }
    this.observers.get(topic).add(callback);
    
    // Enviar subscribe para o servidor
    this.sendMessage({
      type: 'subscribe',
      topic: topic,
      id: this.generateId()
    });
    
    this.topics.add(topic);
    
    return () => this.unsubscribe(topic, callback);
  }

  /**
   * Cancelar inscrição em um tópico
   */
  unsubscribe(topic, callback) {
    const topicObservers = this.observers.get(topic);
    if (topicObservers) {
      topicObservers.delete(callback);
      if (topicObservers.size === 0) {
        this.observers.delete(topic);
        this.topics.delete(topic);
        
        // Enviar unsubscribe para o servidor
        this.sendMessage({
          type: 'unsubscribe',
          topic: topic,
          id: this.generateId()
        });
      }
    }
  }

  /**
   * Publicar evento em um tópico
   */
  publish(topic, data) {
    const message = {
      type: 'event',
      topic: topic,
      data: data,
      id: this.generateId(),
      timestamp: Date.now()
    };
    
    this.sendMessage(message);
    
    // Notificar observadores locais
    this.notifyObservers(topic, message);
  }

  /**
   * Enviar mensagem para o servidor
   */
  sendMessage(message) {
    if (this.isConnected && this.ws) {
      try {
        const messageStr = JSON.stringify(message);
        
        // Comprimir se necessário
        if (messageStr.length > this.config.compressionThreshold) {
          message.compression = true;
          message.data = this.compressData(messageStr);
        }
        
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
        this.pendingMessages.push(message);
      }
    } else {
      // Fallback para HTTP
      this.sendFallbackMessage(message);
    }
  }

  /**
   * Processar mensagens recebidas
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'connection':
          this.connectionId = message.id;
          console.log('Connection established:', message.data);
          break;
          
        case 'event':
          this.notifyObservers(message.topic, message);
          break;
          
        case 'heartbeat':
          this.handleHeartbeat(message);
          break;
          
        case 'error':
          console.error('Server error:', message.data);
          break;
          
        case 'response':
          this.handleResponse(message);
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  /**
   * Notificar observadores de um tópico
   */
  notifyObservers(topic, message) {
    const observers = this.observers.get(topic);
    if (observers) {
      observers.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Observer error:', error);
        }
      });
    }
  }

  /**
   * Iniciar heartbeat
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.sendMessage({
        type: 'heartbeat',
        id: this.generateId(),
        timestamp: Date.now()
      });
    }, this.config.heartbeatInterval);
  }

  /**
   * Parar heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Processar heartbeat do servidor
   */
  handleHeartbeat(message) {
    // Atualizar timestamp do último heartbeat
    this.lastHeartbeat = message.timestamp;
  }

  /**
   * Processar resposta do servidor
   */
  handleResponse(message) {
    console.log('Server response:', message);
  }

  /**
   * Agendar reconexão
   */
  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect(this.getStoredToken());
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.fallbackMode = true;
    }
  }

  /**
   * Processar mensagens pendentes
   */
  processPendingMessages() {
    while (this.pendingMessages.length > 0) {
      const message = this.pendingMessages.shift();
      this.sendMessage(message);
    }
  }

  /**
   * Fallback para HTTP
   */
  async sendFallbackMessage(message) {
    try {
      const response = await fetch(this.fallbackEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getStoredToken()}`
        },
        body: JSON.stringify(message)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Fallback message sent:', result);
    } catch (error) {
      console.error('Fallback error:', error);
    }
  }

  /**
   * Comprimir dados
   */
  compressData(data) {
    // Implementação básica de compressão
    // Em produção, usar uma biblioteca como pako
    return btoa(data);
  }

  /**
   * Descomprimir dados
   */
  decompressData(data) {
    try {
      return atob(data);
    } catch {
      return data;
    }
  }

  /**
   * Gerar ID único
   */
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Decodificar token JWT
   */
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Obter token armazenado
   */
  getStoredToken() {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Obter status da conexão
   */
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      connectionId: this.connectionId,
      userId: this.userId,
      topics: Array.from(this.topics),
      observers: this.observers.size,
      fallbackMode: this.fallbackMode,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  /**
   * Obter métricas
   */
  getMetrics() {
    return {
      totalTopics: this.topics.size,
      totalObservers: Array.from(this.observers.values()).reduce((sum, set) => sum + set.size, 0),
      pendingMessages: this.pendingMessages.length,
      lastHeartbeat: this.lastHeartbeat
    };
  }
}

// Instância singleton
const webSocketService = new WebSocketService();

export default webSocketService; 