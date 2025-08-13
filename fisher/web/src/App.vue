<template>
  <CanonikaMasterPage
    :header-config="headerConfig"
    :sidebar-config="sidebarConfig"
    @logout="handleLogout"
    @nav-click="handleNavClick"
    @sidebar-toggle="handleSidebarToggle"
  >
    <!-- Router view para o conteúdo -->
    <router-view />
  </CanonikaMasterPage>
</template>

<script>
import CanonikaMasterPage from '@shared/components/MasterPage.vue'
import { getServiceMenu } from './config/service-menus.js'
import config from './config/env.js'
import AuthService from './services/AuthService.js'

export default {
  name: 'FisherApp',
  components: {
    CanonikaMasterPage
  },
  data() {
    return {
      currentView: 'dashboard',
      serviceConfig: getServiceMenu('fisher'),
      
      // Configuração do header para o MasterPage compartilhado
      headerConfig: {
        logoText: 'CANONIKA',
        logoSubtitle: 'FISHER',
        user: {
          name: 'Administrador',
          initial: 'A'
        },
        systemStatus: 'FISHER ONLINE',
        isOnline: true,
        isAuthenticated: true
      },
      
      // Configuração do sidebar para o MasterPage compartilhado
      sidebarConfig: {
        brandText: 'Fisher Service',
        brandIcon: 'fas fa-fish',
        user: {
          name: 'Administrador',
          role: 'Admin',
          initial: 'A'
        },
        navigationSections: [
          {
            title: 'Navegação',
            items: [
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
          {
            title: 'Serviços',
            items: [
              {
                id: 'harbor',
                title: 'Harbor',
                subtitle: 'Portal Central',
                icon: 'fas fa-anchor'
              },
              {
                id: 'diver',
                title: 'Diver',
                subtitle: 'Extração de Dados',
                icon: 'fas fa-database'
              },
              {
                id: 'skipper',
                title: 'Skipper',
                subtitle: 'Orquestração',
                icon: 'fas fa-ship'
              },
              {
                id: 'beacon',
                title: 'Beacon',
                subtitle: 'Monitoramento',
                icon: 'fas fa-broadcast-tower'
              },
              {
                id: 'quarter',
                title: 'Quarter',
                subtitle: 'Autenticação',
                icon: 'fas fa-user-shield'
              },
              {
                id: 'guardian',
                title: 'Guardian',
                subtitle: 'Segurança',
                icon: 'fas fa-shield-alt'
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    console.log('🚀 FISHER APP MOUNTED - HOT RELOAD TEST')
    this.checkAuthStatus()
  },
  methods: {
    handleViewChange(viewId) {
      this.currentView = viewId
      console.log('View changed to:', viewId)
      
      // Navegar usando o router
      if (viewId === 'dashboard') {
        this.$router.push('/')
      } else if (viewId === 'status') {
        this.$router.push('/status')
      } else {
        // Para serviços externos, abrir em nova aba
        this.openExternalService(viewId)
      }
    },
    openExternalService(serviceId) {
      const serviceUrls = {
        'harbor': 'http://localhost:3701',
        'diver': 'http://localhost:3704',
        'skipper': 'http://localhost:3702',
        'beacon': 'http://localhost:3703',
        'quarter': 'http://localhost:3700',
        'guardian': 'http://localhost:3705'
      }
      
      const url = serviceUrls[serviceId]
      if (url) {
        window.open(url, '_blank')
      }
    },
    handleNavClick(item) {
      this.handleViewChange(item.id)
    },
    
    handleSidebarToggle(collapsed) {
      console.log('Sidebar toggle:', collapsed)
    },
    
    handleLogin(user) {
      console.log('User logged in:', user)
    },
    
    handleLogout() {
      console.log('🚪 Fisher: Iniciando logout...')
      AuthService.logout()
    },
    
    checkAuthStatus() {
      const isAuthenticated = AuthService.isAuthenticated()
      const currentUser = AuthService.getCurrentUser()
      
      // Atualizar headerConfig com informações reais de autenticação
      this.headerConfig.isAuthenticated = isAuthenticated
      if (currentUser) {
        this.headerConfig.user = {
          name: currentUser.name || 'Administrador',
          initial: currentUser.initial || 'A'
        }
      }
      
      console.log('🔍 Fisher: Status de autenticação:', isAuthenticated)
      console.log('🔍 Fisher: Usuário atual:', currentUser)
    }
  }
}
</script> 