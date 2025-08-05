module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['steps/*.js'],
    format: ['progress-bar', 'html:cucumber-report.html', 'json:cucumber-report.json'],
    formatOptions: { 
      snippetInterface: 'async-await',
      theme: {
        'feature keyword': ['blue', 'bold'],
        'scenario keyword': ['blue'],
        'step keyword': ['green'],
        'step text': ['white']
      }
    },
    publishQuiet: true,
    parallel: 2,
    retry: 1,
    timeout: 30000
  },
  
  // Configuração para testes específicos
  authentication: {
    require: ['steps/authentication_steps.js'],
    format: ['progress-bar'],
    publishQuiet: true
  },
  
  websocket: {
    require: ['steps/websocket_steps.js'],
    format: ['progress-bar'],
    publishQuiet: true
  },
  
  events: {
    require: ['steps/events_metrics_steps.js'],
    format: ['progress-bar'],
    publishQuiet: true
  },
  
  // Configuração para testes de performance
  performance: {
    require: ['steps/*.js'],
    format: ['progress-bar', 'html:performance-report.html'],
    publishQuiet: true,
    timeout: 60000
  },
  
  // Configuração para testes de integração
  integration: {
    require: ['steps/*.js'],
    format: ['progress-bar', 'html:integration-report.html'],
    publishQuiet: true,
    timeout: 45000
  }
}; 