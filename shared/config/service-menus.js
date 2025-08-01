// Configuração centralizada de menus para todos os serviços
export const serviceMenus = {
  // Beacon - Sistema de Sinalizadores e Alertas
  beacon: {
    name: 'BEACON',
    description: 'Sistema de Sinalizadores e Alertas',
    iconClass: 'icon-beacon',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'sinalizacao',
        title: 'Sinalização',
        subtitle: 'Transmissão',
        icon: 'fas fa-broadcast-tower'
      },
      {
        id: 'transmissao',
        title: 'Transmissão',
        subtitle: 'Comunicação',
        icon: 'fas fa-wifi'
      },
      {
        id: 'configuracoes',
        title: 'Configurações',
        subtitle: 'Sistema',
        icon: 'fas fa-cogs'
      }
    ]
  },

  // Fisher - Pesca de Dados
  fisher: {
    name: 'FISHER',
    description: 'Sistema de Pesca de Dados',
    iconClass: 'icon-fisher',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-chart-pie'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      },
      {
        id: 'sources',
        title: 'Fontes de Dados',
        subtitle: 'Gerenciamento',
        icon: 'fas fa-database',
        submenu: [
          {
            id: 'sefaz',
            title: 'SEFAZ',
            subtitle: 'Receita Federal',
            icon: 'fas fa-building'
          },
          {
            id: 'marketplaces',
            title: 'Marketplaces',
            subtitle: 'E-commerce',
            icon: 'fas fa-shopping-cart'
          },
          {
            id: 'apis',
            title: 'APIs Externas',
            subtitle: 'Terceiros',
            icon: 'fas fa-plug'
          },
          {
            id: 'databases',
            title: 'Bancos de Dados',
            subtitle: 'Internos',
            icon: 'fas fa-database'
          },
          {
            id: 'scraping',
            title: 'Web Scraping',
            subtitle: 'Coleta Web',
            icon: 'fas fa-spider'
          },
          {
            id: 'files',
            title: 'Arquivos Locais',
            subtitle: 'CSV, Excel, XML',
            icon: 'fas fa-file-alt'
          }
        ]
      }
    ]
  },

  // Harbor - Portal Principal
  harbor: {
    name: 'HARBOR',
    description: 'Portal Principal da Plataforma',
    iconClass: 'icon-harbor',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'test',
        title: 'Teste',
        subtitle: 'Teste de Navegação',
        icon: 'fas fa-vial'
      },
      {
        id: 'explorer',
        title: 'Explorer',
        subtitle: 'Pesquisa e Exploração',
        icon: 'fas fa-compass'
      },
      {
        id: 'services',
        title: 'Serviços',
        subtitle: 'Gerenciamento',
        icon: 'fas fa-server',
        submenu: [
          {
            id: 'diver',
            title: 'Diver',
            subtitle: 'Consulta Canônica',
            icon: 'fas fa-search'
          },
          {
            id: 'fisher',
            title: 'Fisher',
            subtitle: 'Pesca de Dados',
            icon: 'fas fa-fish'
          },
          {
            id: 'skipper',
            title: 'Skipper',
            subtitle: 'Navegação Inteligente',
            icon: 'fas fa-ship'
          },
          {
            id: 'tollgate',
            title: 'Tollgate',
            subtitle: 'Controle de Acesso',
            icon: 'fas fa-coins'
          },
          {
            id: 'quarter',
            title: 'Quarter',
            subtitle: 'Gestão de Recursos',
            icon: 'fas fa-home'
          },
          {
            id: 'beacon',
            title: 'Beacon',
            subtitle: 'Sinalizadores',
            icon: 'fas fa-broadcast-tower'
          },
          {
            id: 'dock',
            title: 'Dock',
            subtitle: 'Gestão de Docas',
            icon: 'fas fa-anchor'
          },
          {
            id: 'echo',
            title: 'Echo',
            subtitle: 'Comunicação',
            icon: 'fas fa-comments'
          },
          {
            id: 'guardian',
            title: 'Guardian',
            subtitle: 'Segurança',
            icon: 'fas fa-shield-alt'
          },
          {
            id: 'mapmaker',
            title: 'Mapmaker',
            subtitle: 'Criação de Mapas',
            icon: 'fas fa-map'
          },
          {
            id: 'seagull',
            title: 'Seagull',
            subtitle: 'Vigilância',
            icon: 'fas fa-eye'
          },
          {
            id: 'wayfinder',
            title: 'Wayfinder',
            subtitle: 'Navegação',
            icon: 'fas fa-compass'
          }
        ]
      }
    ]
  },

  // Skipper - Navegação Inteligente
  skipper: {
    name: 'SKIPPER',
    description: 'Sistema de Navegação Inteligente',
    iconClass: 'icon-skipper',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'simulacao',
        title: 'Simulação',
        subtitle: 'Testes de Rotas',
        icon: 'fas fa-route'
      },
      {
        id: 'fontes',
        title: 'Fontes',
        subtitle: 'Gerenciamento',
        icon: 'fas fa-database'
      },
      {
        id: 'analises',
        title: 'Análises',
        subtitle: 'Relatórios',
        icon: 'fas fa-chart-bar'
      },
      {
        id: 'extracao',
        title: 'Extração',
        subtitle: 'Coleta de Dados',
        icon: 'fas fa-download'
      }
    ]
  },

  // Tollgate - Controle de Acesso
  tollgate: {
    name: 'TOLLGATE',
    description: 'Sistema de Controle de Acesso',
    iconClass: 'icon-tollgate',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'pedagios',
        title: 'Pedágios',
        subtitle: 'Controle',
        icon: 'fas fa-road'
      },
      {
        id: 'auditoria',
        title: 'Auditoria',
        subtitle: 'Logs e Relatórios',
        icon: 'fas fa-clipboard-list'
      },
      {
        id: 'cobranca',
        title: 'Cobrança',
        subtitle: 'Faturamento',
        icon: 'fas fa-credit-card'
      },
      {
        id: 'controle',
        title: 'Controle',
        subtitle: 'Configurações',
        icon: 'fas fa-cogs'
      },
      {
        id: 'relatorios',
        title: 'Relatórios',
        subtitle: 'Análises',
        icon: 'fas fa-chart-line'
      }
    ]
  },

  // Quarter - Gestão de Recursos
  quarter: {
    name: 'QUARTER',
    description: 'Sistema de Gestão de Recursos',
    iconClass: 'icon-quarter',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      }
    ]
  },

  // Diver - Consulta Canônica
  diver: {
    name: 'DIVER',
    description: 'Sistema de Consulta Canônica',
    iconClass: 'icon-diver',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      }
    ]
  },

  // Dock - Gestão de Docas
  dock: {
    name: 'DOCK',
    description: 'Sistema de Gestão de Docas',
    iconClass: 'icon-dock',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      }
    ]
  },

  // Echo - Comunicação
  echo: {
    name: 'ECHO',
    description: 'Sistema de Comunicação',
    iconClass: 'icon-echo',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      }
    ]
  },

  // Guardian - Segurança
  guardian: {
    name: 'GUARDIAN',
    description: 'Sistema de Segurança',
    iconClass: 'icon-guardian',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      }
    ]
  },

  // Mapmaker - Criação de Mapas
  mapmaker: {
    name: 'MAPMAKER',
    description: 'Sistema de Criação de Mapas',
    iconClass: 'icon-mapmaker',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      }
    ]
  },

  // Seagull - Vigilância
  seagull: {
    name: 'SEAGULL',
    description: 'Sistema de Vigilância',
    iconClass: 'icon-seagull',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      }
    ]
  },

  // Wayfinder - Navegação
  wayfinder: {
    name: 'WAYFINDER',
    description: 'Sistema de Navegação',
    iconClass: 'icon-wayfinder',
    menuItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Visão Geral',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'status',
        title: 'Status',
        subtitle: 'Monitoramento',
        icon: 'fas fa-chart-line'
      }
    ]
  }
}

// Função para obter configuração de um serviço
export function getServiceMenu(serviceName) {
  return serviceMenus[serviceName] || serviceMenus.harbor
}

// Função para obter todos os serviços disponíveis
export function getAllServices() {
  return Object.keys(serviceMenus)
}

// Função para obter lista de serviços para o Harbor
export function getHarborServices() {
  const services = []
  Object.keys(serviceMenus).forEach(serviceName => {
    if (serviceName !== 'harbor') {
      services.push({
        name: serviceMenus[serviceName].name,
        description: serviceMenus[serviceName].description,
        iconClass: serviceMenus[serviceName].iconClass,
        path: `/${serviceName}`
      })
    }
  })
  return services
} 