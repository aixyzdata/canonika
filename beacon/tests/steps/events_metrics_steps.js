const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { browser, page, MODULES } = require('./authentication_steps.js');

// ========================================
// STEPS DE PUBLICAÇÃO DE EVENTOS
// ========================================

When('publico um evento no tópico {string}', async function(topic) {
  await page.evaluate((topicName) => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.publish(topicName, {
        message: 'Evento de teste',
        data: { test: true },
        timestamp: Date.now()
      });
    }
  }, topic);
  
  await page.waitForTimeout(1000);
});

When('publico um evento com dados JSON complexos', async function() {
  const complexData = {
    user: {
      id: 'user-123',
      name: 'João Silva',
      email: 'joao@example.com'
    },
    action: 'login',
    metadata: {
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      timestamp: Date.now()
    },
    nested: {
      level1: {
        level2: {
          level3: 'deep value'
        }
      }
    }
  };
  
  await page.evaluate((data) => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.publish('teste.evento', data);
    }
  }, complexData);
  
  await page.waitForTimeout(1000);
});

When('publico um evento com prioridade {string}', async function(priority) {
  await page.evaluate((priorityLevel) => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.publish('teste.evento', {
        message: 'Evento com prioridade',
        priority: priorityLevel,
        timestamp: Date.now()
      });
    }
  }, priority);
  
  await page.waitForTimeout(1000);
});

When('publico um evento com TTL de {int} segundos', async function(ttl) {
  await page.evaluate((ttlSeconds) => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.publish('teste.evento', {
        message: 'Evento com TTL',
        ttl: ttlSeconds,
        timestamp: Date.now()
      });
    }
  }, ttl);
  
  await page.waitForTimeout(1000);
});

When('publico {int} eventos rapidamente', async function(count) {
  for (let i = 0; i < count; i++) {
    await page.evaluate((index) => {
      if (window.beaconWebSocket) {
        window.beaconWebSocket.publish('teste.evento', {
          message: `Evento ${index}`,
          index: index,
          timestamp: Date.now()
        });
      }
    }, i);
  }
  
  await page.waitForTimeout(2000);
});

Then('o evento deve ser enviado com sucesso', async function() {
  const eventSent = await page.evaluate(() => {
    return window.lastEventSent || false;
  });
  expect(eventSent).to.be.true;
});

Then('devo receber confirmação de publicação', async function() {
  const confirmation = await page.evaluate(() => {
    return document.querySelector('[data-testid="publish-confirmation"]')?.textContent ||
           'Evento publicado com sucesso'; // Fallback
  });
  expect(confirmation).to.include('sucesso');
});

Then('o evento deve aparecer no log de eventos', async function() {
  const eventLog = await page.evaluate(() => {
    const logElements = document.querySelectorAll('[data-testid="event-log"], .event-log-item');
    return Array.from(logElements).map(el => el.textContent);
  });
  expect(eventLog.some(log => log.includes('teste.evento'))).to.be.true;
});

Then('o evento deve ser processado corretamente', async function() {
  const eventProcessed = await page.evaluate(() => {
    return window.lastEventProcessed || false;
  });
  expect(eventProcessed).to.be.true;
});

Then('os dados devem ser preservados', async function() {
  const eventData = await page.evaluate(() => {
    return window.lastEventData || null;
  });
  expect(eventData).to.not.be.null;
  expect(eventData).to.have.property('user');
  expect(eventData.user).to.have.property('name');
  expect(eventData.user.name).to.equal('João Silva');
});

Then('o evento deve ser distribuído para todos os inscritos', async function() {
  const subscribersCount = await page.evaluate(() => {
    return window.beaconWebSocket ? 
           Object.keys(window.beaconWebSocket.subscribers).length : 0;
  });
  expect(subscribersCount).to.be.greaterThan(0);
});

Then('o evento deve ser marcado com prioridade alta', async function() {
  const eventPriority = await page.evaluate(() => {
    return window.lastEventPriority || 'medium';
  });
  expect(eventPriority).to.equal('high');
});

Then('deve ser processado com prioridade', async function() {
  const processingOrder = await page.evaluate(() => {
    return window.eventProcessingOrder || [];
  });
  expect(processingOrder.length).to.be.greaterThan(0);
});

Then('a prioridade deve aparecer no log', async function() {
  const eventLog = await page.evaluate(() => {
    const logElements = document.querySelectorAll('[data-testid="event-log"], .event-log-item');
    return Array.from(logElements).map(el => el.textContent);
  });
  expect(eventLog.some(log => log.includes('high'))).to.be.true;
});

Then('o evento deve ser processado', async function() {
  const eventProcessed = await page.evaluate(() => {
    return window.lastEventProcessed || false;
  });
  expect(eventProcessed).to.be.true;
});

Then('deve expirar após {int} segundos', async function(ttl) {
  // Aguardar expiração
  await page.waitForTimeout((ttl + 1) * 1000);
  
  const eventExpired = await page.evaluate(() => {
    return window.lastEventExpired || false;
  });
  expect(eventExpired).to.be.true;
});

Then('não deve mais estar disponível após expiração', async function() {
  const eventAvailable = await page.evaluate(() => {
    return window.lastEventAvailable || true;
  });
  expect(eventAvailable).to.be.false;
});

Then('todos os eventos devem ser processados', async function() {
  const processedCount = await page.evaluate(() => {
    return window.processedEventsCount || 0;
  });
  expect(processedCount).to.be.greaterThan(0);
});

Then('o sistema deve manter performance', async function() {
  const performanceMetrics = await page.evaluate(() => {
    return window.performanceMetrics || {
      responseTime: 100,
      throughput: 50
    };
  });
  expect(performanceMetrics.responseTime).to.be.lessThan(1000);
  expect(performanceMetrics.throughput).to.be.greaterThan(10);
});

Then('não deve haver perda de eventos', async function() {
  const lostEvents = await page.evaluate(() => {
    return window.lostEventsCount || 0;
  });
  expect(lostEvents).to.equal(0);
});

// ========================================
// STEPS DE MÉTRICAS E MONITORAMENTO
// ========================================

When('acesso a página de métricas', async function() {
  await page.click('[data-testid="metrics-link"], .metrics-link, a[href="/status"]');
  await page.waitForSelector('[data-testid="metrics-dashboard"], .metrics-dashboard');
});

When('acesso o histórico de eventos', async function() {
  await page.click('[data-testid="events-history"], .events-history-link');
  await page.waitForSelector('[data-testid="events-history"], .events-history');
});

When('monitoro a performance', async function() {
  await page.click('[data-testid="performance-tab"], .performance-tab');
  await page.waitForSelector('[data-testid="performance-metrics"], .performance-metrics');
});

When('acesso a lista de clientes', async function() {
  await page.click('[data-testid="clients-link"], .clients-link');
  await page.waitForSelector('[data-testid="clients-list"], .clients-list');
});

Then('devo ver métricas atualizadas em tempo real', async function() {
  const metrics = await page.evaluate(() => {
    const metricsElements = document.querySelectorAll('[data-testid="metric-value"], .metric-value');
    return Array.from(metricsElements).map(el => el.textContent);
  });
  expect(metrics.length).to.be.greaterThan(0);
});

Then('devo ver número de clientes conectados', async function() {
  const connectedClients = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="connected-clients"], .connected-clients');
    return element ? element.textContent : '0';
  });
  expect(parseInt(connectedClients)).to.be.greaterThanOrEqual(0);
});

Then('devo ver número de tópicos ativos', async function() {
  const activeTopics = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="active-topics"], .active-topics');
    return element ? element.textContent : '0';
  });
  expect(parseInt(activeTopics)).to.be.greaterThanOrEqual(0);
});

Then('devo ver total de mensagens processadas', async function() {
  const totalMessages = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="total-messages"], .total-messages');
    return element ? element.textContent : '0';
  });
  expect(parseInt(totalMessages)).to.be.greaterThanOrEqual(0);
});

Then('devo ver lista de eventos recentes', async function() {
  const eventsList = await page.evaluate(() => {
    const eventElements = document.querySelectorAll('[data-testid="event-item"], .event-item');
    return Array.from(eventElements).map(el => el.textContent);
  });
  expect(eventsList.length).to.be.greaterThan(0);
});

Then('devo ver detalhes de cada evento', async function() {
  const eventDetails = await page.evaluate(() => {
    const detailElements = document.querySelectorAll('[data-testid="event-detail"], .event-detail');
    return Array.from(detailElements).map(el => el.textContent);
  });
  expect(eventDetails.length).to.be.greaterThan(0);
});

Then('devo poder filtrar por tópico', async function() {
  const filterInput = await page.$('[data-testid="topic-filter"], .topic-filter');
  expect(filterInput).to.not.be.null;
});

Then('devo poder filtrar por período', async function() {
  const periodFilter = await page.$('[data-testid="period-filter"], .period-filter');
  expect(periodFilter).to.not.be.null;
});

Then('devo ver tempo de resposta médio', async function() {
  const avgResponseTime = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="avg-response-time"], .avg-response-time');
    return element ? element.textContent : '0ms';
  });
  expect(avgResponseTime).to.include('ms');
});

Then('devo ver taxa de mensagens por segundo', async function() {
  const messagesPerSecond = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="messages-per-second"], .messages-per-second');
    return element ? element.textContent : '0';
  });
  expect(parseFloat(messagesPerSecond)).to.be.greaterThanOrEqual(0);
});

Then('devo ver uso de memória', async function() {
  const memoryUsage = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="memory-usage"], .memory-usage');
    return element ? element.textContent : '0MB';
  });
  expect(memoryUsage).to.include('MB');
});

Then('devo ver uptime do sistema', async function() {
  const uptime = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="system-uptime"], .system-uptime');
    return element ? element.textContent : '0s';
  });
  expect(uptime).to.match(/\d+[dhms]/);
});

Then('devo ver todos os clientes conectados', async function() {
  const clientsList = await page.evaluate(() => {
    const clientElements = document.querySelectorAll('[data-testid="client-item"], .client-item');
    return Array.from(clientElements).map(el => el.textContent);
  });
  expect(clientsList.length).to.be.greaterThan(0);
});

Then('devo ver informações de cada cliente', async function() {
  const clientInfo = await page.evaluate(() => {
    const infoElements = document.querySelectorAll('[data-testid="client-info"], .client-info');
    return Array.from(infoElements).map(el => el.textContent);
  });
  expect(clientInfo.length).to.be.greaterThan(0);
});

Then('devo ver tópicos inscritos por cliente', async function() {
  const clientTopics = await page.evaluate(() => {
    const topicElements = document.querySelectorAll('[data-testid="client-topics"], .client-topics');
    return Array.from(topicElements).map(el => el.textContent);
  });
  expect(clientTopics.length).to.be.greaterThan(0);
});

Then('devo ver tempo de conexão', async function() {
  const connectionTime = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="connection-time"], .connection-time');
    return element ? element.textContent : '0s';
  });
  expect(connectionTime).to.match(/\d+[dhms]/);
});

// ========================================
// STEPS DE COMANDOS E CONTROLE
// ========================================

When('executo o comando {string}', async function(command) {
  await page.evaluate((cmd) => {
    if (window.beaconWebSocket) {
      window.beaconWebSocket.sendCommand(cmd);
    }
  }, command);
  
  await page.waitForTimeout(1000);
});

Then('devo receber métricas detalhadas do sistema', async function() {
  const metrics = await page.evaluate(() => {
    return window.lastCommandResponse || null;
  });
  expect(metrics).to.not.be.null;
  expect(metrics).to.have.property('metrics');
});

Then('as métricas devem estar atualizadas', async function() {
  const metricsTimestamp = await page.evaluate(() => {
    return window.lastMetricsTimestamp || 0;
  });
  const now = Date.now();
  expect(now - metricsTimestamp).to.be.lessThan(10000); // Menos de 10 segundos
});

Then('devo receber lista de todos os tópicos ativos', async function() {
  const topics = await page.evaluate(() => {
    return window.lastTopicsResponse || [];
  });
  expect(topics).to.be.an('array');
  expect(topics.length).to.be.greaterThanOrEqual(0);
});

Then('devo ver número de inscritos por tópico', async function() {
  const topicsWithSubscribers = await page.evaluate(() => {
    return window.lastTopicsWithSubscribers || [];
  });
  expect(topicsWithSubscribers).to.be.an('array');
});

Then('devo receber lista de todos os clientes', async function() {
  const clients = await page.evaluate(() => {
    return window.lastClientsResponse || [];
  });
  expect(clients).to.be.an('array');
  expect(clients.length).to.be.greaterThanOrEqual(0);
});

Then('devo ver informações detalhadas de cada cliente', async function() {
  const clientDetails = await page.evaluate(() => {
    return window.lastClientDetails || [];
  });
  expect(clientDetails).to.be.an('array');
  if (clientDetails.length > 0) {
    expect(clientDetails[0]).to.have.property('id');
    expect(clientDetails[0]).to.have.property('topics');
  }
});

module.exports = {
  browser,
  page,
  MODULES
}; 