<template>
  <div id="app" class="canonika-app">
    <!-- Header futurista -->
    <header class="canonika-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <div class="logo-hexagon"></div>
            <div class="logo-pulse"></div>
          </div>
          <div class="logo-text-container">
            <h1 class="logo-text">CANONIKA</h1>
            <div class="module-title-with-icon">
              <div :class="['module-icon', serviceConfig.iconClass]"></div>
              <span class="logo-subtitle">{{ serviceConfig.name }}</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <div v-if="user" class="user-info">
            <div class="user-avatar">
              <span>{{ user.name.charAt(0).toUpperCase() }}</span>
            </div>
            <span class="user-name">{{ user.name }}</span>
            <div class="user-menu">
              <button @click="logout" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                Sair
              </button>
            </div>
          </div>
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span>ONLINE</span>
          </div>
        </div>
      </div>
      <div class="header-glow"></div>
    </header>

    <div class="canonika-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Toggle button para menu retrátil -->
      <button 
        v-if="user" 
        @click="toggleSidebar" 
        class="sidebar-toggle"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
      >
        <i class="fas fa-bars"></i>
      </button>

      <!-- Sidebar componentizado -->
      <Sidebar 
        :serviceConfig="serviceConfig"
        :user="user"
        :sidebarCollapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        @nav-click="handleNavClick"
      />

      <!-- Conteúdo principal -->
      <main :class="['main-content', { 'sidebar-collapsed': sidebarCollapsed && user }]">
        <!-- Tela de login -->
        <div v-if="!user && hasLogin" class="login-container">
          <div class="login-card">
            <div class="login-header">
              <div class="login-logo">
                <div class="logo-hexagon-large"></div>
                <div class="logo-pulse-large"></div>
              </div>
              <h2 class="login-title">Acesso ao {{ serviceConfig.name }}</h2>
              <p class="login-subtitle">{{ serviceConfig.description }}</p>
            </div>
            <form @submit.prevent="login" class="login-form">
              <div class="form-group">
                <div class="input-container">
                  <span class="input-icon">👤</span>
                  <input 
                    v-model="loginForm.username" 
                    type="text" 
                    placeholder="Usuário" 
                    class="form-input"
                    required
                  >
                </div>
              </div>
              <div class="form-group">
                <div class="input-container">
                  <span class="input-icon">🔒</span>
                  <input 
                    v-model="loginForm.password" 
                    type="password" 
                    placeholder="Senha" 
                    class="form-input"
                    required
                  >
                </div>
              </div>
              <button type="submit" class="login-btn">
                <span>🚀</span> Entrar
              </button>
            </form>
          </div>
        </div>

        <!-- Redirecionamento para Quarter -->
        <div v-if="!user && !hasLogin" class="quarter-redirect">
          <div class="redirect-card">
            <div class="redirect-header">
              <div class="redirect-logo">
                <div class="logo-hexagon-large"></div>
                <div class="logo-pulse-large"></div>
              </div>
              <h2 class="redirect-title">Acesso Centralizado</h2>
              <p class="redirect-subtitle">Este módulo utiliza o Quarter para autenticação</p>
            </div>
            <div class="redirect-content">
              <p>Para acessar o {{ serviceConfig.name }}, você precisa fazer login através do Quarter.</p>
              <button @click="redirectToQuarter" class="redirect-btn">
                <span>🚀</span> Ir para Quarter
              </button>
            </div>
          </div>
        </div>

        <!-- Conteúdo do serviço -->
        <div v-else class="service-content">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import config from '../config/env.js'

export default {
  name: 'MasterPage',
  components: {
    Sidebar
  },
  props: {
    serviceConfig: {
      type: Object,
      required: true,
      default: () => ({
        name: 'Serviço',
        description: 'Descrição do serviço',
        iconClass: 'icon-default',
        icon: 'fas fa-broadcast-tower',
        menuItems: []
      })
    },
    hasLogin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      user: null,
      sidebarCollapsed: false,
      currentView: 'dashboard',
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    handleNavClick() {
      console.log('Navegação clicada')
    },
    
    // Verificar autenticação
    checkAuthentication() {
      console.log('🔍 Verificando autenticação...')
      
      // Verificar se está autenticado
      const token = localStorage.getItem('canonika_access_token')
      const userData = localStorage.getItem('canonika_user')
      
      if (token && userData) {
        try {
          this.user = JSON.parse(userData)
          console.log('✅ Usuário autenticado:', this.user.name)
          return true
        } catch (error) {
          console.error('❌ Erro ao parsear dados do usuário:', error)
          this.clearAuth()
          return false
        }
      } else {
        console.log('❌ Usuário não autenticado')
        return false
      }
    },
    
    // Processar token da URL
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
        const parts = token.split('.')
        if (parts.length !== 3) throw new Error('Token inválido')
        
        const payload = JSON.parse(atob(parts[1]))
        return payload
      } catch (error) {
        throw new Error('Token inválido')
      }
    },
    
    login() {
      // Simular login
      this.user = {
        name: this.loginForm.username,
        role: 'admin'
      }
      this.$emit('login', this.user)
    },
    
    logout() {
      this.clearAuth()
      this.user = null
      this.$emit('logout')
    },
    
    clearAuth() {
      localStorage.removeItem('canonika_access_token')
      localStorage.removeItem('canonika_user')
    },
    
    redirectToQuarter() {
      // Usar configuração centralizada
      const quarterUrl = config.getServiceUrl('quarter')
      const currentUrl = window.location.href
      const redirectUrl = encodeURIComponent(currentUrl)
      window.location.href = `${quarterUrl}?redirect_to=${redirectUrl}`
    }
  },
      async mounted() {
      // Processar token da URL se existir
      this.processAuthToken()
      
      // Verificar autenticação
      this.checkAuthentication()
      
      // Simular usuário logado para teste
      if (!this.user) {
        this.user = {
          id: 1,
          name: 'Administrador',
          email: 'admin@canonika.com',
          roles: ['admin'],
          permissions: ['read', 'write']
        }
        console.log('✅ Usuário simulado para teste:', this.user.name)
      }
      
      // Redirecionar automaticamente para Quarter se não tem login próprio e não está autenticado
      console.log('MasterPage mounted - hasLogin:', this.hasLogin, 'user:', this.user)
      if (!this.hasLogin && !this.user) {
        console.log('Redirecionando para Quarter...')
        this.redirectToQuarter()
      }
    }
}
</script>

