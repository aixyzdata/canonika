<template>
  <CanonikaMasterPage
    :header-config="headerConfig"
    :sidebar-config="sidebarConfig"
    @logout="handleLogout"
    @nav-click="handleNavClick"
    @sidebar-toggle="handleSidebarToggle"
  >
    <!-- Router View - Dynamic content based on route -->
    <router-view />
  </CanonikaMasterPage>
</template>

<script>
import CanonikaMasterPage from '../../../shared/components/MasterPage.vue'
import AuthService from '../../../shared/services/AuthService.js'

export default {
  name: 'TemplateApp',
  components: {
    CanonikaMasterPage
  },
  data() {
    return {
      user: null,
      headerConfig: {
        logoText: 'CANONIKA',
        logoSubtitle: 'TEMPLATE',
        user: {
          name: 'Administrador',
          initial: 'A'
        },
        systemStatus: 'TEMPLATE ONLINE',
        isOnline: true
      },
      sidebarConfig: {
        brandText: 'Template Service',
        brandIcon: 'fas fa-rocket',
        user: {
          name: 'Administrador',
          role: 'Admin',
          initial: 'A'
        },
        navigationSections: [
          {
            title: 'Navegação Principal',
            items: [
              {
                id: 'dashboard',
                title: 'Dashboard',
                subtitle: 'Visão Geral',
                icon: 'fas fa-tachometer-alt',
                href: '/',
                active: true
              }
            ]
          },
          {
            title: 'AG-Grid Template',
            items: [
              {
                id: 'aggrid-reference',
                title: 'AG-Grid Reference',
                subtitle: 'Implementação Oficial Vue',
                icon: 'fas fa-table',
                href: '/aggrid-reference',
                active: false
              }
            ]
          },
          {
            title: 'Componentes',
            items: [
              {
                id: 'components',
                title: 'Componentes',
                subtitle: 'Validação',
                icon: 'fas fa-cube',
                href: '#',
                subItems: [
                  {
                    id: 'header',
                    title: 'Header',
                    subtitle: 'Cabeçalho',
                    icon: 'fas fa-heading',
                    href: '#header'
                  },
                  {
                    id: 'sidebar',
                    title: 'Sidebar',
                    subtitle: 'Menu Lateral',
                    icon: 'fas fa-bars',
                    href: '#sidebar'
                  },
                  {
                    id: 'masterpage',
                    title: 'MasterPage',
                    subtitle: 'Layout Principal',
                    icon: 'fas fa-layer-group',
                    href: '#masterpage'
                  },
                  {
                    id: 'viewcontent',
                    title: 'ViewContent',
                    subtitle: 'Conteúdo',
                    icon: 'fas fa-file-alt',
                    href: '#viewcontent'
                  },
                  {
                    id: 'viewheader',
                    title: 'ViewHeader',
                    subtitle: 'Cabeçalho da View',
                    icon: 'fas fa-window-maximize',
                    href: '#viewheader'
                  }
                ]
              },
              {
                id: 'services',
                title: 'Serviços',
                subtitle: 'Integração',
                icon: 'fas fa-server',
                href: '#',
                subItems: [
                  {
                    id: 'auth',
                    title: 'Autenticação',
                    subtitle: 'Login/Logout',
                    icon: 'fas fa-key',
                    href: '#auth'
                  },
                  {
                    id: 'quarter',
                    title: 'Quarter',
                    subtitle: 'Identity Provider',
                    icon: 'fas fa-shield-alt',
                    href: '#quarter'
                  },
                  {
                    id: 'harbor',
                    title: 'Harbor',
                    subtitle: 'Portal Principal',
                    icon: 'fas fa-anchor',
                    href: '#harbor'
                  },
                  {
                    id: 'beacon',
                    title: 'Beacon',
                    subtitle: 'Monitoramento',
                    icon: 'fas fa-broadcast-tower',
                    href: '#beacon'
                  }
                ]
              },
              {
                id: 'tests',
                title: 'Testes',
                subtitle: 'Funcionalidades',
                icon: 'fas fa-vial',
                href: '#',
                subItems: [
                  {
                    id: 'unit',
                    title: 'Unitários',
                    subtitle: 'Testes Unitários',
                    icon: 'fas fa-microchip',
                    href: '#unit'
                  },
                  {
                    id: 'integration',
                    title: 'Integração',
                    subtitle: 'Testes de Integração',
                    icon: 'fas fa-plug',
                    href: '#integration'
                  },
                  {
                    id: 'e2e',
                    title: 'End-to-End',
                    subtitle: 'Testes E2E',
                    icon: 'fas fa-route',
                    href: '#e2e'
                  },
                  {
                    id: 'performance',
                    title: 'Performance',
                    subtitle: 'Testes de Performance',
                    icon: 'fas fa-tachometer-alt',
                    href: '#performance'
                  }
                ]
              },
              {
                id: 'info',
                title: 'Informações',
                subtitle: 'Detalhes',
                icon: 'fas fa-info-circle',
                href: '#',
                subItems: [
                  {
                    id: 'docs',
                    title: 'Documentação',
                    subtitle: 'Guias e Tutoriais',
                    icon: 'fas fa-book',
                    href: '#docs'
                  },
                  {
                    id: 'api',
                    title: 'API',
                    subtitle: 'Endpoints',
                    icon: 'fas fa-code',
                    href: '#api'
                  },
                  {
                    id: 'config',
                    title: 'Configuração',
                    subtitle: 'Settings',
                    icon: 'fas fa-cog',
                    href: '#config'
                  },
                  {
                    id: 'about',
                    title: 'Sobre',
                    subtitle: 'Informações do Sistema',
                    icon: 'fas fa-info',
                    href: '#about'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    console.log('🚀 Template App iniciado')
    
    // Verificar autenticação
    this.checkAuthentication()
    
    // Processar token se presente na URL
    this.processAuthToken()
    
    // Atualizar item ativo baseado na rota atual
    this.updateActiveNavBasedOnRoute()
  },
  
  watch: {
    '$route'(to, from) {
      // Atualizar item ativo quando a rota mudar
      this.updateActiveNavBasedOnRoute()
    }
  },
  methods: {
    async checkAuthentication() {
      console.log('🔍 Verificando autenticação...')
      
      // Verificar se precisa renovar o token
      const tokenValid = await AuthService.checkAndRefreshToken()
      
      if (tokenValid) {
        this.user = AuthService.getCurrentUser()
        console.log('✅ Usuário autenticado:', this.user)
      } else {
        // Verificar se há token no localStorage (fallback)
        const storedToken = localStorage.getItem('canonika_access_token')
        const storedUser = localStorage.getItem('canonika_user')
        
        if (storedToken && storedUser) {
          try {
            this.user = JSON.parse(storedUser)
            console.log('✅ Usuário recuperado do localStorage:', this.user)
          } catch (error) {
            console.log('❌ Erro ao parsear usuário do localStorage')
            this.redirectToQuarter()
          }
        } else {
          // Se não há autenticação válida, redirecionar para Quarter
          console.log('❌ Usuário não autenticado, redirecionando para Quarter')
          this.redirectToQuarter()
        }
      }
    },
    
    processAuthToken() {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('auth_token')
      
      if (token) {
        console.log('🔑 Token recebido do Quarter')
        
        try {
          // Decodificar token JWT
          const payload = this.decodeToken(token)
          
          // Criar objeto usuário
          this.user = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            roles: payload.roles || [],
            permissions: payload.permissions || []
          }
          
          // Salvar token no localStorage
          localStorage.setItem('canonika_access_token', token)
          localStorage.setItem('canonika_user', JSON.stringify(this.user))
          
          // Limpar URL
          const newUrl = window.location.pathname
          window.history.replaceState({}, document.title, newUrl)
          
          console.log('✅ Usuário autenticado:', this.user.name)
          
        } catch (error) {
          console.error('❌ Erro ao processar token:', error)
          // Se token inválido, redirecionar para Quarter
          this.redirectToQuarter()
        }
      }
    },
    
    decodeToken(token) {
      try {
        // Verificar se é um JWT real (3 partes) ou token simulado (base64 simples)
        const parts = token.split('.')
        
        if (parts.length === 3) {
          // JWT real - decodificar payload (parte 1)
          const payload = JSON.parse(atob(parts[1]))
          return payload
        } else {
          // Token simulado do Quarter - decodificar diretamente
          const payload = JSON.parse(atob(token))
          return payload
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error)
        throw new Error('Token inválido')
      }
    },
    
    handleLogout() {
      console.log('🚪 Logout solicitado')
      AuthService.logout()
      this.user = null
    },
    
    handleNavClick(item) {
      console.log('Navegação clicada:', item)
      
      // Navegação via Vue Router
      if (item.href && item.href.startsWith('/')) {
        this.$router.push(item.href)
        
        // Atualizar item ativo no sidebar
        this.updateActiveNavItem(item.id)
      } else if (item.href && item.href.startsWith('#')) {
        // Navegação por âncora (scroll)
        const element = document.querySelector(item.href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    
    updateActiveNavItem(activeId) {
      // Atualizar item ativo na navegação
      this.sidebarConfig.navigationSections.forEach(section => {
        section.items.forEach(item => {
          item.active = item.id === activeId
          
          // Também atualizar subitems se existir
          if (item.subItems) {
            item.subItems.forEach(subItem => {
              subItem.active = subItem.id === activeId
            })
          }
        })
      })
    },
    
    updateActiveNavBasedOnRoute() {
      const currentPath = this.$route.path
      
      // Mapear rotas para IDs dos items do sidebar
      const routeToItemMap = {
        '/': 'dashboard',
        '/aggrid-reference': 'aggrid-reference'
      }
      
      const activeItemId = routeToItemMap[currentPath] || 'dashboard'
      this.updateActiveNavItem(activeItemId)
      
      console.log('🔄 Rota atual:', currentPath, '- Item ativo:', activeItemId)
    },
    
    handleSidebarToggle(collapsed) {
      console.log('Sidebar toggle:', collapsed)
    },
    
    redirectToQuarter() {
      const quarterUrl = 'http://localhost:3700'
      // Usar a URL completa do Template Service com porta explícita
      const currentUrl = `http://localhost:3790${window.location.pathname}${window.location.search}`
      const redirectTo = encodeURIComponent(currentUrl)
      
      // Usar o padrão redirect_to (padrão do Quarter)
      const quarterRedirectUrl = `${quarterUrl}?redirect_to=${redirectTo}`
      
      console.log('🔄 Redirecionando para Quarter com URL:', currentUrl)
      console.log('🔄 URL completa do Quarter:', quarterRedirectUrl)
      
      // Usar replace para evitar problemas de navegação
      window.location.replace(quarterRedirectUrl)
    }
  }
}
</script>

<!-- Estilos agora são gerenciados pelo SCSS -->
