const { expect } = require('chai');
const sinon = require('sinon');

// Mock do WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1; // OPEN
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.send = sinon.stub();
    this.close = sinon.stub();
  }
  
  simulateOpen() {
    if (this.onopen) this.onopen();
  }
  
  simulateMessage(data) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }
  
  simulateClose(code = 1000, reason = 'Normal closure') {
    if (this.onclose) {
      this.onclose({ code, reason });
    }
  }
  
  simulateError(error) {
    if (this.onerror) {
      this.onerror(error);
    }
  }
}

// Mock global WebSocket
global.WebSocket = MockWebSocket;

// Importar o WebSocketService
const WebSocketService = require('../../web/src/services/WebSocketService.js').default;

describe('WebSocketService', () => {
  let wsService;
  let clock;
  
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    wsService = new WebSocketService('ws://localhost:3703', {
      clientId: 'test-client',
      reconnectInterval: 1000,
      maxReconnectAttempts: 3,
      heartbeatInterval: 5000
    });
  });
  
  afterEach(() => {
    clock.restore();
    sinon.restore();
  });
  
  describe('Construtor', () => {
    it('deve inicializar com configurações corretas', () => {
      expect(wsService.url).to.equal('ws://localhost:3703');
      expect(wsService.clientId).to.equal('test-client');
      expect(wsService.isConnected).to.be.false;
      expect(wsService.reconnectAttempts).to.equal(0);
    });
    
    it('deve gerar client ID se não fornecido', () => {
      const service = new WebSocketService('ws://localhost:3703');
      expect(service.clientId).to.be.a('string');
      expect(service.clientId.length).to.be.greaterThan(0);
    });
  });
  
  describe('Conexão', () => {
    it('deve conectar com sucesso', async () => {
      const connectPromise = wsService.connect();
      
      // Simular abertura da conexão
      wsService.ws.simulateOpen();
      
      await connectPromise;
      
      expect(wsService.isConnected).to.be.true;
      expect(wsService.reconnectAttempts).to.equal(0);
    });
    
    it('deve lidar com erro de conexão', async () => {
      const error = new Error('Connection failed');
      const connectPromise = wsService.connect();
      
      // Simular erro
      wsService.ws.simulateError(error);
      
      try {
        await connectPromise;
        expect.fail('Deve ter lançado erro');
      } catch (err) {
        expect(err).to.equal(error);
      }
      
      expect(wsService.isConnected).to.be.false;
    });
    
    it('deve tentar reconectar após desconexão', async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
      
      // Simular desconexão
      wsService.ws.simulateClose();
      
      // Avançar tempo para trigger da reconexão
      clock.tick(1000);
      
      expect(wsService.reconnectAttempts).to.be.greaterThan(0);
    });
    
    it('deve parar de tentar reconectar após máximo de tentativas', async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
      
      // Simular múltiplas desconexões
      for (let i = 0; i < 5; i++) {
        wsService.ws.simulateClose();
        clock.tick(1000);
      }
      
      expect(wsService.reconnectAttempts).to.equal(3);
    });
  });
  
  describe('Envio de Mensagens', () => {
    beforeEach(async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
    });
    
    it('deve enviar mensagem quando conectado', () => {
      const message = { type: 'test', data: 'hello' };
      wsService.send(message);
      
      expect(wsService.ws.send.calledOnce).to.be.true;
      expect(wsService.ws.send.firstCall.args[0]).to.equal(JSON.stringify(message));
    });
    
    it('deve enfileirar mensagem quando desconectado', () => {
      wsService.isConnected = false;
      const message = { type: 'test', data: 'hello' };
      
      wsService.send(message);
      
      expect(wsService.messageQueue).to.include(message);
      expect(wsService.ws.send.called).to.be.false;
    });
    
    it('deve processar fila de mensagens após reconexão', async () => {
      wsService.isConnected = false;
      const message = { type: 'test', data: 'hello' };
      wsService.messageQueue.push(message);
      
      await wsService.connect();
      wsService.ws.simulateOpen();
      
      expect(wsService.messageQueue).to.be.empty;
      expect(wsService.ws.send.calledOnce).to.be.true;
    });
  });
  
  describe('Subscrições', () => {
    beforeEach(async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
    });
    
    it('deve inscrever em tópico', () => {
      const callback = sinon.stub();
      const unsubscribe = wsService.subscribe('test.topic', callback);
      
      expect(wsService.subscribers.has('test.topic')).to.be.true;
      expect(wsService.subscribers.get('test.topic')).to.include(callback);
      expect(wsService.ws.send.calledOnce).to.be.true;
      
      // Verificar se unsubscribe funciona
      unsubscribe();
      expect(wsService.subscribers.get('test.topic')).to.not.include(callback);
    });
    
    it('deve receber eventos de tópico inscrito', () => {
      const callback = sinon.stub();
      wsService.subscribe('test.topic', callback);
      
      const eventData = { message: 'test event' };
      wsService.ws.simulateMessage({
        type: 'event',
        topic: 'test.topic',
        data: eventData
      });
      
      expect(callback.calledOnce).to.be.true;
      expect(callback.firstCall.args[0]).to.deep.equal(eventData);
    });
    
    it('deve cancelar subscrição', () => {
      const callback = sinon.stub();
      wsService.subscribe('test.topic', callback);
      
      wsService.unsubscribe('test.topic', callback);
      
      expect(wsService.subscribers.has('test.topic')).to.be.false;
      expect(wsService.ws.send.calledTwice).to.be.true;
    });
  });
  
  describe('Publicação', () => {
    beforeEach(async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
    });
    
    it('deve publicar evento', () => {
      const eventData = { message: 'test' };
      wsService.publish('test.topic', eventData);
      
      expect(wsService.ws.send.calledOnce).to.be.true;
      const sentMessage = JSON.parse(wsService.ws.send.firstCall.args[0]);
      expect(sentMessage.type).to.equal('event');
      expect(sentMessage.topic).to.equal('test.topic');
      expect(sentMessage.data).to.deep.equal(eventData);
    });
    
    it('deve publicar evento com prioridade', () => {
      const eventData = { message: 'test' };
      wsService.publish('test.topic', eventData, 'high');
      
      const sentMessage = JSON.parse(wsService.ws.send.firstCall.args[0]);
      expect(sentMessage.priority).to.equal('high');
    });
  });
  
  describe('Heartbeat', () => {
    beforeEach(async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
    });
    
    it('deve enviar heartbeat periodicamente', () => {
      // Avançar tempo para trigger do heartbeat
      clock.tick(5000);
      
      expect(wsService.ws.send.called).to.be.true;
      const sentMessage = JSON.parse(wsService.ws.send.firstCall.args[0]);
      expect(sentMessage.type).to.equal('heartbeat');
    });
    
    it('deve responder a heartbeat do servidor', () => {
      const heartbeatData = { timestamp: Date.now() };
      wsService.ws.simulateMessage({
        type: 'heartbeat',
        data: heartbeatData
      });
      
      // Verificar se o evento heartbeat foi emitido
      const eventListeners = wsService.eventListeners.get('heartbeat');
      expect(eventListeners).to.not.be.undefined;
    });
  });
  
  describe('Comandos', () => {
    beforeEach(async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
    });
    
    it('deve enviar comando e receber resposta', async () => {
      const commandPromise = wsService.sendCommand('get_metrics');
      
      // Simular resposta
      wsService.ws.simulateMessage({
        type: 'response',
        data: { metrics: { total_messages: 10 } }
      });
      
      const result = await commandPromise;
      expect(result).to.deep.equal({ metrics: { total_messages: 10 } });
    });
    
    it('deve lidar com timeout de comando', async () => {
      const commandPromise = wsService.sendCommand('get_metrics');
      
      // Avançar tempo para timeout
      clock.tick(10000);
      
      try {
        await commandPromise;
        expect.fail('Deve ter lançado erro de timeout');
      } catch (err) {
        expect(err.message).to.include('Timeout');
      }
    });
  });
  
  describe('Event Listeners', () => {
    it('deve registrar event listeners', () => {
      const callback = sinon.stub();
      wsService.on('connected', callback);
      
      expect(wsService.eventListeners.has('connected')).to.be.true;
      expect(wsService.eventListeners.get('connected')).to.include(callback);
    });
    
    it('deve emitir eventos', () => {
      const callback = sinon.stub();
      wsService.on('test_event', callback);
      
      const eventData = { test: true };
      wsService.emit('test_event', eventData);
      
      expect(callback.calledOnce).to.be.true;
      expect(callback.firstCall.args[0]).to.deep.equal(eventData);
    });
    
    it('deve remover event listeners', () => {
      const callback = sinon.stub();
      wsService.on('test_event', callback);
      wsService.off('test_event', callback);
      
      wsService.emit('test_event', {});
      expect(callback.called).to.be.false;
    });
  });
  
  describe('Métricas e Status', () => {
    beforeEach(async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
    });
    
    it('deve retornar status da conexão', () => {
      const status = wsService.getConnectionStatus();
      
      expect(status).to.have.property('isConnected');
      expect(status).to.have.property('clientId');
      expect(status).to.have.property('reconnectAttempts');
      expect(status).to.have.property('subscribersCount');
      expect(status).to.have.property('queueSize');
      expect(status).to.have.property('pendingMessagesCount');
    });
    
    it('deve retornar lista de subscritores', () => {
      wsService.subscribe('topic1', () => {});
      wsService.subscribe('topic2', () => {});
      
      const subscribers = wsService.getSubscribers();
      
      expect(subscribers).to.have.property('topic1');
      expect(subscribers).to.have.property('topic2');
      expect(subscribers.topic1).to.equal(1);
      expect(subscribers.topic2).to.equal(1);
    });
  });
  
  describe('Desconexão', () => {
    beforeEach(async () => {
      await wsService.connect();
      wsService.ws.simulateOpen();
    });
    
    it('deve desconectar corretamente', () => {
      wsService.disconnect();
      
      expect(wsService.isConnected).to.be.false;
      expect(wsService.ws.close.calledOnce).to.be.true;
      expect(wsService.reconnectAttempts).to.equal(0);
    });
    
    it('deve limpar timers na desconexão', () => {
      const clearTimeoutSpy = sinon.spy(global, 'clearTimeout');
      const clearIntervalSpy = sinon.spy(global, 'clearInterval');
      
      wsService.disconnect();
      
      expect(clearTimeoutSpy.called).to.be.true;
      expect(clearIntervalSpy.called).to.be.true;
    });
  });
}); 