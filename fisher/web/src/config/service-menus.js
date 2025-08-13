/**
 * Configuração de Menus para Fisher Service
 * Define os menus e navegação específicos do Fisher
 */

export function getServiceMenu(serviceName) {
  const menus = {
    fisher: {
      name: 'Fisher',
      description: 'Tripulante de Pesca de Dados',
      icon: 'fas fa-fish',
      color: '#10b981',
      menuItems: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          subtitle: 'Visão Geral',
          icon: 'fas fa-tachometer-alt',
          route: '/'
        },
        {
          id: 'status',
          title: 'Status',
          subtitle: 'Monitoramento',
          icon: 'fas fa-chart-line',
          route: '/status'
        }
      ]
    }
  }
  
  return menus[serviceName] || menus.fisher
}

export default {
  getServiceMenu
} 