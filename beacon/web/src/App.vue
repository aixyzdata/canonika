<template>
  <CanonikaMasterPage
    :header-config="headerConfig"
    :sidebar-config="sidebarConfig"
    @logout="handleLogout"
    @nav-click="handleNavClick"
    @sidebar-toggle="handleSidebarToggle"
  >
    <router-view />
  </CanonikaMasterPage>
</template>

<script>
import CanonikaMasterPage from '/app/shared/components/MasterPage.vue'
import AuthService from '/app/shared/services/AuthService.js'
import { checkServiceStatus } from '/app/shared/config/status-standardization.js'

export default {
  name: 'BeaconApp',
  components: {
    CanonikaMasterPage
  },
  data() {
    return {
      user: null,
      headerConfig: {
        logoText: 'CANONIKA',
        logoSubtitle: 'BEACON',
        user: {
          name: 'Administrador',
          initial: 'A'
        },
        systemStatus: 'BEACON ONLINE',
        isOnline: true
      },
      sidebarConfig: {
        brandText: 'Beacon Service',
        brandIcon: 'fas fa-broadcast-tower',
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
                id: 'home',
                title: 'Dashboard',
                subtitle: 'Visão Geral',
                icon: 'fas fa-tachometer-alt',
                href: '/',
                active: this.$route.name === 'home'
              },
              {
                id: 'websocket',
                title: 'WebSocket',
                subtitle: 'Conexão Real-time',
                icon: 'fas fa-broadcast-tower',
                href: '/websocket',
                active: this.$route.name === 'websocket'
              },
              {
                id: 'api',
                title: 'REST API',
                subtitle: 'HTTP Endpoints',
                icon: 'fas fa-satellite',
                href: '/api',
                active: this.$route.name === 'api'
              },
              {
                id: 'configuracoes',
                title: 'Configurações',
                subtitle: 'Parâmetros',
                icon: 'fas fa-cog',
                href: '/configuracoes',
                active: this.$route.name === 'configuracoes'
              }
            ]
          }
        ]
      }
    }
  },
  async mounted() {
    console.log('🚀 BEACON APP MOUNTED')
    
    // Processar token da URL se existir (padrão Harbor)
    this.processAuthToken()
    
    // Verificar autenticação
    await this.checkAuthentication()
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
        // O Quarter envia um token base64 simples, não JWT
        const payload = JSON.parse(atob(token))
        return payload
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error)
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
      if (item.href && item.href !== '#') {
        this.$router.push(item.href)
      }
    },
    
    handleSidebarToggle(collapsed) {
      console.log('Sidebar toggle:', collapsed)
    },
    
    redirectToQuarter() {
      const quarterUrl = 'http://localhost:3700'
      // Usar a URL completa do Beacon
      const currentUrl = window.location.href
      const returnUrl = encodeURIComponent(currentUrl)
      
      // Usar o padrão return_url e service como Harbor
      const quarterRedirectUrl = `${quarterUrl}?return_url=${returnUrl}&service=beacon`
      
      console.log('🔄 Redirecionando para Quarter com URL:', currentUrl)
      console.log('🔄 URL completa do Quarter:', quarterRedirectUrl)
      
      // Usar replace para evitar problemas de navegação
      window.location.replace(quarterRedirectUrl)
    }
  }
}
</script>

 