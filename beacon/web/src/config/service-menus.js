// Configuração de menus para todos os serviços
export function getServiceMenu(serviceName) {
  const menus = {
    harbor: {
      name: 'HARBOR',
      description: 'Dashboard Principal',
      iconClass: 'icon-harbor',
      menuItems: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          subtitle: 'Visão Geral',
          icon: 'fas fa-tachometer-alt'
        },
        {
          id: 'explorer',
          title: 'Explorer',
          subtitle: 'Navegação',
          icon: 'fas fa-compass'
        },
        {
          id: 'test',
          title: 'Test',
          subtitle: 'Testes',
          icon: 'fas fa-vial'
        },
        {
          id: 'diver',
          title: 'Diver',
          subtitle: 'Serviço Diver',
          icon: 'fas fa-fish'
        },
        {
          id: 'fisher',
          title: 'Fisher',
          subtitle: 'Serviço Fisher',
          icon: 'fas fa-hook'
        },
        {
          id: 'skipper',
          title: 'Skipper',
          subtitle: 'Serviço Skipper',
          icon: 'fas fa-ship'
        },
        {
          id: 'beacon',
          title: 'Beacon',
          subtitle: 'Serviço Beacon',
          icon: 'fas fa-broadcast-tower'
        },
        {
          id: 'quarter',
          title: 'Quarter',
          subtitle: 'Serviço Quarter',
          icon: 'fas fa-home'
        },
        {
          id: 'guardian',
          title: 'Guardian',
          subtitle: 'Serviço Guardian',
          icon: 'fas fa-shield-alt'
        }
      ]
    },
    beacon: {
      name: 'BEACON',
      description: 'Sistema de Monitoramento',
      iconClass: 'icon-beacon',
      menuItems: [
        {
          id: 'home',
          title: 'Home',
          subtitle: 'Página Inicial',
          icon: 'fas fa-home'
        },
        {
          id: 'websocket',
          title: 'WebSocket',
          subtitle: 'Tempo Real',
          icon: 'fas fa-broadcast-tower'
        },
        {
          id: 'api',
          title: 'REST API',
          subtitle: 'HTTP Endpoints',
          icon: 'fas fa-satellite'
        },
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Alertas',
          icon: 'fas fa-bell'
        },
        {
          id: 'email',
          title: 'Email Service',
          subtitle: 'Comunicação',
          icon: 'fas fa-envelope'
        },
        {
          id: 'sms',
          title: 'SMS Gateway',
          subtitle: 'Mensagens',
          icon: 'fas fa-sms'
        },
        {
          id: 'voice',
          title: 'Voice Service',
          subtitle: 'Chamadas',
          icon: 'fas fa-phone'
        },
        {
          id: 'config',
          title: 'Configurações',
          subtitle: 'Parâmetros',
          icon: 'fas fa-cog'
        }
      ]
    },
    quarter: {
      name: 'QUARTER',
      description: 'Sistema de Autenticação',
      iconClass: 'icon-quarter',
      menuItems: [
        {
          id: 'login',
          title: 'Login',
          subtitle: 'Autenticação',
          icon: 'fas fa-sign-in-alt'
        },
        {
          id: 'register',
          title: 'Registro',
          subtitle: 'Novo Usuário',
          icon: 'fas fa-user-plus'
        },
        {
          id: 'profile',
          title: 'Perfil',
          subtitle: 'Dados Pessoais',
          icon: 'fas fa-user'
        }
      ]
    },
    skipper: {
      name: 'SKIPPER',
      description: 'Sistema de Navegação',
      iconClass: 'icon-skipper',
      menuItems: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          subtitle: 'Visão Geral',
          icon: 'fas fa-tachometer-alt'
        },
        {
          id: 'navigation',
          title: 'Navegação',
          subtitle: 'Rotas',
          icon: 'fas fa-route'
        },
        {
          id: 'analytics',
          title: 'Analytics',
          subtitle: 'Relatórios',
          icon: 'fas fa-chart-line'
        }
      ]
    },
    fisher: {
      name: 'FISHER',
      description: 'Sistema de Pesquisa',
      iconClass: 'icon-fisher',
      menuItems: [
        {
          id: 'search',
          title: 'Pesquisa',
          subtitle: 'Buscar Dados',
          icon: 'fas fa-search'
        },
        {
          id: 'results',
          title: 'Resultados',
          subtitle: 'Dados Encontrados',
          icon: 'fas fa-list'
        },
        {
          id: 'filters',
          title: 'Filtros',
          subtitle: 'Refinamentos',
          icon: 'fas fa-filter'
        }
      ]
    },
    diver: {
      name: 'DIVER',
      description: 'Sistema de Mergulho',
      iconClass: 'icon-diver',
      menuItems: [
        {
          id: 'exploration',
          title: 'Exploração',
          subtitle: 'Mergulhar',
          icon: 'fas fa-water'
        },
        {
          id: 'discovery',
          title: 'Descobertas',
          subtitle: 'Novos Dados',
          icon: 'fas fa-gem'
        }
      ]
    },
    guardian: {
      name: 'GUARDIAN',
      description: 'Sistema de Segurança',
      iconClass: 'icon-guardian',
      menuItems: [
        {
          id: 'security',
          title: 'Segurança',
          subtitle: 'Proteção',
          icon: 'fas fa-shield-alt'
        },
        {
          id: 'monitoring',
          title: 'Monitoramento',
          subtitle: 'Vigilância',
          icon: 'fas fa-eye'
        },
        {
          id: 'alerts',
          title: 'Alertas',
          subtitle: 'Notificações',
          icon: 'fas fa-exclamation-triangle'
        }
      ]
    }
  }

  return menus[serviceName] || menus.harbor
}

// Função para obter todos os serviços disponíveis
export function getAllServices() {
  // Adicionar verificação de segurança
  if (!serviceMenus || typeof serviceMenus !== 'object') {
    console.error('❌ serviceMenus não está definido corretamente');
    return [];
  }
  
  return Object.keys(serviceMenus);
}

// Função para obter lista de serviços para o Harbor
export function getHarborServices() {
  const services = [];
  
  // Adicionar verificação de segurança
  if (!serviceMenus || typeof serviceMenus !== 'object') {
    console.error('❌ serviceMenus não está definido corretamente');
    return services;
  }
  
  try {
    Object.keys(serviceMenus).forEach(serviceName => {
      if (serviceName !== 'harbor') {
        services.push({
          name: serviceMenus[serviceName].name,
          description: serviceMenus[serviceName].description,
          iconClass: serviceMenus[serviceName].iconClass,
          path: `/${serviceName}`
        });
      }
    });
  } catch (error) {
    console.error('❌ Erro ao processar serviços:', error.message);
  }
  
  return services;
} 