<template>
  <div id="app">
    <MasterPage 
      :hasLogin="false"
      :serviceConfig="beaconConfig"
      @view-changed="handleViewChange"
      @login="handleLogin"
      @logout="handleLogout"
    >
      <router-view />
    </MasterPage>
  </div>
</template>

<script>
import MasterPage from '../../shared/templates/MasterPage.vue'

export default {
  name: 'App',
  components: {
    MasterPage
  },
  data() {
    return {
      beaconConfig: {
        name: 'BEACON',
        iconClass: 'fas fa-broadcast-tower',
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
            icon: 'fas fa-code'
          },
          {
            id: 'push',
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
          }
        ]
      }
    }
  },
  methods: {
    handleViewChange(viewId) {
      // Navegar para a rota correspondente
      if (viewId === 'home') {
        this.$router.push('/')
      } else {
        this.$router.push(`/${viewId}`)
      }
    },
    handleLogin(user) {
      // Implementar lógica de login se necessário
      console.log('Login:', user)
    },
    handleLogout() {
      // Implementar lógica de logout
      this.redirectToQuarter()
    },
    redirectToQuarter() {
      const quarterUrl = 'http://localhost:3700'
      const currentUrl = window.location.href
      const redirectUrl = encodeURIComponent(currentUrl)
      window.location.href = `${quarterUrl}?redirect_to=${redirectUrl}&service=beacon`
    }
  },
  mounted() {
    // Verificar autenticação
    const urlParams = new URLSearchParams(window.location.search)
    const authToken = urlParams.get('auth_token')
    
    if (authToken) {
      // Processar token de autenticação
      console.log('Token recebido:', authToken)
      
      try {
        // Decodificar o JWT (sem verificar assinatura por simplicidade)
        const tokenParts = authToken.split('.')
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]))
          console.log('Token decodificado:', payload)
          
          // Verificar se o token não expirou
          const now = Math.floor(Date.now() / 1000)
          if (payload.exp && payload.exp > now) {
            console.log('Token válido, usuário autenticado')
            // Armazenar informações do usuário se necessário
            localStorage.setItem('auth_token', authToken)
            localStorage.setItem('user_info', JSON.stringify(payload))
            
            // Limpar a URL removendo o token
            const cleanUrl = window.location.origin + window.location.pathname
            window.history.replaceState({}, document.title, cleanUrl)
          } else {
            console.log('Token expirado')
            this.redirectToQuarter()
          }
        } else {
          console.log('Token inválido')
          this.redirectToQuarter()
        }
      } catch (error) {
        console.error('Erro ao processar token:', error)
        this.redirectToQuarter()
      }
    } else {
      // Verificar se já temos um token armazenado
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        console.log('Token encontrado no localStorage')
        // Token já processado, continuar normalmente
      } else {
        // Redirecionar para Quarter se não há token
        console.log('Nenhum token encontrado, redirecionando para Quarter')
        this.redirectToQuarter()
      }
    }
  }
}
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
}
</style> 