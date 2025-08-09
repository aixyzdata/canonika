// Configuração para adicionar ao harbor/web/services.js
export const serviceConfig = {
  'template': {
    name: 'Utemplate',
    title: 'template - Descrição',
    description: 'Descrição do serviço template',
    icon: 'fas fa-icon',
    color: '#3b82f6',
    view: 'UtemplateView',
    path: '../../template/views/UtemplateView.vue',
    port: 3715,
    apiPort: 8015
  }
}

// Configuração para adicionar ao harbor/web/main.js
// const UtemplateView = await import('../../template/views/UtemplateView.vue')
// app.component('UtemplateView', UtemplateView.default)
