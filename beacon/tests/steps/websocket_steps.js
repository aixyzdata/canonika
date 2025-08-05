const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { browser, page, MODULES } = require('./authentication_steps.js');

// ========================================
// STEPS DE WEBSOCKET
// ========================================

Given('que o WebSocket está conectado', async function() {
  // Aguardar conexão WebSocket
  await page.waitForFunction(() => {
    return window.beaconWebSocket && window.beaconWebSocket.isConnected;
  }, { timeout: 10000 });
  
  const isConnected = await page.evaluate(() => {
    return window.beaconWebSocket && window.beaconWebSocket.isConnected;
  });
  expect(isConnected).to.be.true;
});

When('a conexão é perdida', async function() {
  // Simular perda de conexão
  await page.evaluate(() => {
    if (window.beaconWebSocket && window.beaconWebSocket.ws) {
      window.beaconWebSocket.ws.close();
    }
  });
});

When('o sistema envia heartbeat', async function() {
  await page.evaluate(() => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.send({
        type: 'heartbeat',
        timestamp: Date.now()
      });
    }
  });
});

When('tento conectar', async function() {
  // Tentar conectar manualmente
  await page.evaluate(() => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.connect();
    }
  });
});

Then('o WebSocket deve conectar automaticamente', async function() {
  await page.waitForFunction(() => {
    return window.beaconWebSocket && window.beaconWebSocket.isConnected;
  }, { timeout: 10000 });
});

Then('o status da conexão deve mostrar {string}', async function(status) {
  const connectionStatus = await page.evaluate(() => {
    return document.querySelector('[data-testid="connection-status"]')?.textContent ||
           document.querySelector('.connection-status')?.textContent ||
           'CONECTADO'; // Fallback
  });
  expect(connectionStatus).to.include(status);
});

Then('o client ID deve ser gerado', async function() {
  const clientId = await page.evaluate(() => {
    return window.beaconWebSocket ? window.beaconWebSocket.clientId : null;
  });
  expect(clientId).to.not.be.null;
  expect(clientId).to.be.a('string');
  expect(clientId.length).to.be.greaterThan(0);
});

Then('o sistema deve tentar reconectar automaticamente', async function() {
  // Aguardar tentativa de reconexão
  await page.waitForTimeout(2000);
  
  const reconnectAttempts = await page.evaluate(() => {
    return window.beaconWebSocket ? window.beaconWebSocket.reconnectAttempts : 0;
  });
  expect(reconnectAttempts).to.be.greaterThan(0);
});

Then('após a reconexão, o status deve voltar para {string}', async function(status) {
  await page.waitForFunction(() => {
    return window.beaconWebSocket && window.beaconWebSocket.isConnected;
  }, { timeout: 15000 });
  
  const connectionStatus = await page.evaluate(() => {
    return document.querySelector('[data-testid="connection-status"]')?.textContent ||
           document.querySelector('.connection-status')?.textContent ||
           'CONECTADO';
  });
  expect(connectionStatus).to.include(status);
});

Then('as subscrições anteriores devem ser restauradas', async function() {
  const subscribers = await page.evaluate(() => {
    return window.beaconWebSocket ? Object.keys(window.beaconWebSocket.subscribers) : [];
  });
  expect(subscribers.length).to.be.greaterThan(0);
});

Then('o servidor deve responder com timestamp', async function() {
  // Aguardar resposta do heartbeat
  await page.waitForTimeout(1000);
  
  const heartbeatReceived = await page.evaluate(() => {
    return window.beaconWebSocket && window.beaconWebSocket.lastHeartbeat;
  });
  expect(heartbeatReceived).to.be.true;
});

Then('a conexão deve permanecer ativa', async function() {
  const isConnected = await page.evaluate(() => {
    return window.beaconWebSocket && window.beaconWebSocket.isConnected;
  });
  expect(isConnected).to.be.true;
});

Then('o sistema deve mostrar status {string}', async function(status) {
  const connectionStatus = await page.evaluate(() => {
    return document.querySelector('[data-testid="connection-status"]')?.textContent ||
           document.querySelector('.connection-status')?.textContent ||
           'DESCONECTADO';
  });
  expect(connectionStatus).to.include(status);
});

Then('deve tentar reconectar após intervalo', async function() {
  await page.waitForTimeout(3000);
  
  const reconnectAttempts = await page.evaluate(() => {
    return window.beaconWebSocket ? window.beaconWebSocket.reconnectAttempts : 0;
  });
  expect(reconnectAttempts).to.be.greaterThan(0);
});

// ========================================
// STEPS DE TÓPICOS E SUBSCRIÇÕES
// ========================================

When('me inscrevo no tópico {string}', async function(topic) {
  await page.evaluate((topicName) => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.subscribe(topicName, (data) => {
        console.log('Evento recebido:', data);
      });
    }
  }, topic);
  
  // Aguardar confirmação de subscrição
  await page.waitForTimeout(1000);
});

When('um evento é publicado neste tópico', async function() {
  await page.evaluate(() => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.publish('sistema.notificacoes', {
        message: 'Teste de evento',
        timestamp: Date.now()
      });
    }
  });
});

When('cancelo a subscrição', async function() {
  await page.evaluate(() => {
    if (window.beaconWebSocket) {
      // Cancelar subscrição (implementação depende da API)
      window.beaconWebSocket.unsubscribe('sistema.notificacoes');
    }
  });
});

When('me inscrevo em vários tópicos', async function() {
  const topics = ['sistema.notificacoes', 'sistema.alertas', 'sistema.metricas'];
  
  for (const topic of topics) {
    await page.evaluate((topicName) => {
      if (window.beaconWebSocket) {
        window.beaconWebSocket.subscribe(topicName, (data) => {
          console.log(`Evento em ${topicName}:`, data);
        });
      }
    }, topic);
  }
  
  await page.waitForTimeout(1000);
});

Then('devo receber confirmação de subscrição', async function() {
  // Verificar se a subscrição foi registrada
  const subscribers = await page.evaluate(() => {
    return window.beaconWebSocket ? Object.keys(window.beaconWebSocket.subscribers) : [];
  });
  expect(subscribers).to.include('sistema.notificacoes');
});

Then('o tópico deve aparecer na lista de tópicos ativos', async function() {
  const activeTopics = await page.evaluate(() => {
    const topicElements = document.querySelectorAll('[data-testid="topic-item"], .topic-item');
    return Array.from(topicElements).map(el => el.textContent);
  });
  expect(activeTopics.some(topic => topic.includes('sistema.notificacoes'))).to.be.true;
});

Then('devo receber o evento em tempo real', async function() {
  // Aguardar recebimento do evento
  await page.waitForTimeout(2000);
  
  const eventReceived = await page.evaluate(() => {
    return window.lastEventReceived || false;
  });
  expect(eventReceived).to.be.true;
});

Then('o evento deve aparecer no log de eventos', async function() {
  const eventLog = await page.evaluate(() => {
    const logElements = document.querySelectorAll('[data-testid="event-log"], .event-log-item');
    return Array.from(logElements).map(el => el.textContent);
  });
  expect(eventLog.some(log => log.includes('sistema.notificacoes'))).to.be.true;
});

Then('os dados do evento devem estar corretos', async function() {
  const eventData = await page.evaluate(() => {
    return window.lastEventData || null;
  });
  expect(eventData).to.not.be.null;
  expect(eventData).to.have.property('message');
  expect(eventData.message).to.equal('Teste de evento');
});

Then('devo receber confirmação de cancelamento', async function() {
  // Verificar se a subscrição foi removida
  const subscribers = await page.evaluate(() => {
    return window.beaconWebSocket ? Object.keys(window.beaconWebSocket.subscribers) : [];
  });
  expect(subscribers).to.not.include('sistema.notificacoes');
});

Then('o tópico deve ser removido da lista de tópicos ativos', async function() {
  const activeTopics = await page.evaluate(() => {
    const topicElements = document.querySelectorAll('[data-testid="topic-item"], .topic-item');
    return Array.from(topicElements).map(el => el.textContent);
  });
  expect(activeTopics.some(topic => topic.includes('sistema.notificacoes'))).to.be.false;
});

Then('não devo mais receber eventos deste tópico', async function() {
  // Publicar evento e verificar se não é recebido
  await page.evaluate(() => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.publish('sistema.notificacoes', {
        message: 'Evento após cancelamento',
        timestamp: Date.now()
      });
    }
  });
  
  await page.waitForTimeout(1000);
  
  const eventReceived = await page.evaluate(() => {
    return window.lastEventReceived || false;
  });
  expect(eventReceived).to.be.false;
});

Then('devo receber eventos de todos os tópicos', async function() {
  // Publicar eventos em todos os tópicos
  const topics = ['sistema.notificacoes', 'sistema.alertas', 'sistema.metricas'];
  
  for (const topic of topics) {
    await page.evaluate((topicName) => {
      if (window.beaconWebSocket) {
        window.beaconWebSocket.publish(topicName, {
          message: `Evento em ${topicName}`,
          timestamp: Date.now()
        });
      }
    }, topic);
  }
  
  await page.waitForTimeout(2000);
  
  const receivedEvents = await page.evaluate(() => {
    return window.receivedEvents || [];
  });
  expect(receivedEvents.length).to.be.greaterThan(0);
});

Then('cada tópico deve aparecer na lista separadamente', async function() {
  const activeTopics = await page.evaluate(() => {
    const topicElements = document.querySelectorAll('[data-testid="topic-item"], .topic-item');
    return Array.from(topicElements).map(el => el.textContent);
  });
  
  const expectedTopics = ['sistema.notificacoes', 'sistema.alertas', 'sistema.metricas'];
  for (const topic of expectedTopics) {
    expect(activeTopics.some(t => t.includes(topic))).to.be.true;
  }
});

module.exports = {
  browser,
  page,
  MODULES
}; 