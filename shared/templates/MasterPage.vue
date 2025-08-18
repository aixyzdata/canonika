<template>
  <div id="app" class="canonika-app">
    <!-- Sistema de Alertas Bootstrap no topo -->
    <div class="alerts-container" v-if="alerts.length > 0">
      <div 
        v-for="alert in alerts" 
        :key="alert.id"
        :class="['alert', `alert-${alert.type}`, 'alert-dismissible', 'fade', 'show']"
        role="alert"
      >
        <div class="alert-content">
          <i :class="getAlertIcon(alert.type)" class="alert-icon me-2"></i>
          <span class="alert-message">{{ alert.message }}</span>
        </div>
        <button 
          @click="removeAlert(alert.id)" 
          type="button" 
          class="btn-close" 
          data-bs-dismiss="alert"
          aria-label="Close"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

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
      },
      alerts: [],
      alertCounter: 0
    }
  },
  methods: {
    // Sistema de Alertas
    addAlert(type, message, duration = 5000) {
      const alert = {
        id: ++this.alertCounter,
        type: type, // 'success', 'danger', 'warning', 'info'
        message: message,
        timestamp: Date.now()
      }
      
      this.alerts.push(alert)
      
      // Auto-remover após duração especificada
      if (duration > 0) {
        setTimeout(() => {
          this.removeAlert(alert.id)
        }, duration)
      }
      
      return alert.id
    },
    
    removeAlert(alertId) {
      const index = this.alerts.findIndex(alert => alert.id === alertId)
      if (index > -1) {
        this.alerts.splice(index, 1)
      }
    },
    
    clearAlerts() {
      this.alerts = []
    },
    
    getAlertIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        danger: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icons[type] || 'fas fa-info-circle'
    },
    
    // Métodos existentes
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
      
      // Expor métodos de alerta globalmente
      window.showAlert = this.addAlert
      window.showSuccess = (message, duration) => this.addAlert('success', message, duration)
      window.showError = (message, duration) => this.addAlert('danger', message, duration)
      window.showWarning = (message, duration) => this.addAlert('warning', message, duration)
      window.showInfo = (message, duration) => this.addAlert('info', message, duration)
      window.clearAlerts = this.clearAlerts
    }
}
</script>

<style scoped>
/* Sistema de Alertas Bootstrap */
.alerts-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 1rem;
  pointer-events: none;
}

.alerts-container .alert {
  pointer-events: auto;
  margin-bottom: 0.5rem;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideInDown 0.3s ease-out;
}

.alerts-container .alert:last-child {
  margin-bottom: 0;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-icon {
  font-size: 1.1rem;
}

.alert-message {
  flex: 1;
  font-weight: 500;
}

.btn-close {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0.25rem;
  margin-left: 0.5rem;
}

.btn-close:hover {
  opacity: 1;
}

/* Animações */
@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .alerts-container {
    padding: 0.5rem;
  }
  
  .alerts-container .alert {
    font-size: 0.9rem;
  }
}
</style>

