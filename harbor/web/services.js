// Informações dos serviços
const services = [
  {
    id: 'skipper',
    name: 'Skipper',
    description: 'Orquestrador de Navegação e Extração de Dados',
    icon: 'fas fa-ship',
    color: '#007bff',
    port: 7722,
    url: 'http://localhost:7722'
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Sistema de Contabilidade e Gestão Financeira',
    icon: 'fas fa-book',
    color: '#28a745',
    port: 7723,
    url: 'http://localhost:7723'
  },
  {
    id: 'tollgate',
    name: 'Tollgate',
    description: 'Sistema de Pedágio e Controle de Acesso',
    icon: 'fas fa-coins',
    color: '#ffc107',
    port: 7724,
    url: 'http://localhost:7724'
  },
  {
    id: 'quarter',
    name: 'Quarter',
    description: 'Gestão de Usuários e Permissões',
    icon: 'fas fa-users',
    color: '#dc3545',
    port: 7725,
    url: 'http://localhost:7725'
  },
  {
    id: 'beacon',
    name: 'Beacon',
    description: 'Sistema de Sinalização e Comunicação',
    icon: 'fas fa-broadcast-tower',
    color: '#6f42c1',
    port: 7726,
    url: 'http://localhost:7726'
  },
  {
    id: 'echo',
    name: 'Echo',
    description: 'Sistema de Eco e Ressonância',
    icon: 'fas fa-echo',
    color: '#fd7e14',
    port: 7727,
    url: 'http://localhost:7727'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    description: 'Sistema de Proteção e Segurança',
    icon: 'fas fa-shield',
    color: '#20c997',
    port: 7728,
    url: 'http://localhost:7728'
  },
  {
    id: 'mapmaker',
    name: 'Mapmaker',
    description: 'Sistema de Criação e Gestão de Mapas',
    icon: 'fas fa-map',
    color: '#e83e8c',
    port: 7729,
    url: 'http://localhost:7729'
  },
  {
    id: 'seagull',
    name: 'Seagull',
    description: 'Sistema de Vigilância e Monitoramento',
    icon: 'fas fa-seagull',
    color: '#17a2b8',
    port: 7730,
    url: 'http://localhost:7730'
  },
  {
    id: 'wayfinder',
    name: 'Wayfinder',
    description: 'Sistema de Navegação e Orientação',
    icon: 'fas fa-compass',
    color: '#6c757d',
    port: 7731,
    url: 'http://localhost:7731'
  }
];

export function getAllServices() {
  return services;
}

export function getServiceInfo(serviceId) {
  return services.find(service => service.id === serviceId);
}

export function hasServiceView(serviceId) {
  const service = getServiceInfo(serviceId);
  return service !== undefined;
} 