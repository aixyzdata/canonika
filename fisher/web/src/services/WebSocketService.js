/**
 * WebSocket Service para Fisher - Acompanhamento de Downloads
 * Implementação moderna com fallback, retry e compressão
 */

class WebSocketService {
  constructor() {
    console.log('🔍 Fisher WebSocketService constructor chamado - nova instância criada');
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscribers = new Map();
    this.connectionPromise = null;

    // Callbacks para eventos
    this.connectionChangeCallbacks = [];
    this.downloadProgressCallbacks = [];
  }

  /**
   * Conectar ao WebSocket
   */
  async connect() {
    console.log('🔍 Fisher WebSocketService.connect() chamado');
    if (this.isConnected) {
      console.log('🔍 WebSocket já está conectado, retornando');
      return;
    }

    try {
      const wsUrl = `ws://localhost:3706/ws`;
      
      console.log('Conectando ao WebSocket Fisher:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('Fisher WebSocket conectado');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionChange('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          // Tentar parsear como JSON primeiro
          const data = JSON.parse(event.data);
          console.log('Mensagem JSON recebida do Fisher:', data);
          this.handleMessage(data);
        } catch (error) {
          // Se não for JSON, tratar como texto simples
          console.log('Mensagem de texto recebida do Fisher:', event.data);
          this.handleTextMessage(event.data);
        }
      };

      this.ws.onclose = () => {
        console.log('Fisher WebSocket desconectado');
        this.isConnected = false;
        this.notifyConnectionChange('disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Erro no Fisher WebSocket:', error);
        this.isConnected = false;
        this.notifyConnectionChange('error');
      };

    } catch (error) {
      console.error('Erro ao conectar Fisher WebSocket:', error);
      this.isConnected = false;
    }
  }

  /**
   * Tentar reconectar
   */
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentativa de reconexão Fisher ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Máximo de tentativas de reconexão Fisher atingido');
    }
  }

  /**
   * Enviar mensagem
   */
  sendMessage(message) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('Fisher WebSocket não está conectado');
    }
  }

  /**
   * Processar mensagem recebida
   */
  handleMessage(data) {
    console.log('🔍 Fisher handleMessage chamado com:', data);
    const { type } = data;
    
    // Processar mensagens especiais
    switch (type) {
      case 'connection_status':
        console.log('Status de conexão Fisher:', data);
        if (data.status === 'connected') {
          console.log('✅ Fisher WebSocket conectado com sucesso');
        }
        break;
      case 'download_progress':
        console.log('Progresso de download recebido:', data);
        this.notifyDownloadProgress(data);
        break;
      case 'download_completed':
        console.log('Download concluído:', data);
        this.notifyDownloadProgress(data);
        break;
      case 'download_error':
        console.log('Erro de download:', data);
        this.notifyDownloadProgress(data);
        break;
      case 'pong':
        console.log('Pong recebido:', data);
        break;
      case 'echo_response':
        console.log('Echo response recebido:', data);
        break;
      case 'text_response':
        console.log('Text response recebido:', data);
        break;
      case 'message_received':
        console.log('Message received:', data);
        break;
      default:
        console.log('Tipo de mensagem desconhecido:', type);
    }
  }

  /**
   * Processar mensagem de texto simples
   */
  handleTextMessage(text) {
    console.log('🔍 Fisher handleTextMessage chamado com:', text);
    
    // Processar mensagens de texto simples
    if (text.includes('Conectado')) {
      console.log('✅ Fisher WebSocket conectado (texto simples)');
    } else {
      console.log('Mensagem de texto recebida:', text);
    }
  }

  /**
   * Notificar mudança de conexão
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
   * Notificar progresso de download
   */
  notifyDownloadProgress(data) {
    this.downloadProgressCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Erro no callback de download:', error);
      }
    });
  }

  /**
   * Registrar callback para mudanças de conexão
   */
  onConnectionChange(callback) {
    this.connectionChangeCallbacks.push(callback);
  }

  /**
   * Registrar callback para progresso de download
   */
  onDownloadProgress(callback) {
    this.downloadProgressCallbacks.push(callback);
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
  }

  /**
   * Verificar se está conectado
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Criar instância singleton
const fisherWebSocketService = new WebSocketService();

export default fisherWebSocketService; 