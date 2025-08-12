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

<style scoped>
/* Estilos específicos do MasterPage */
.canonika-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
}

.canonika-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid #475569;
  position: relative;
  overflow: hidden;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: relative;
  z-index: 2;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  position: relative;
  width: 3rem;
  height: 3rem;
}

.logo-hexagon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: rotate 10s linear infinite;
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
}

.logo-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

.module-title-with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.module-icon {
  width: 1rem;
  height: 1rem;
  background: #3b82f6;
  border-radius: 50%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
  color: #e2e8f0;
}

.user-menu {
  position: relative;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
}

.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.header-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.canonika-layout {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.sidebar-toggle {
  position: fixed;
  top: 80px;
  left: 1rem;
  z-index: 1001;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #475569;
  color: #e2e8f0;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  background: rgba(15, 23, 42, 0.9);
  border-color: #3b82f6;
}

.sidebar-toggle.sidebar-collapsed {
  left: 1rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
}

.main-content.sidebar-collapsed {
  margin-left: 60px;
}

/* Login Screen */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
}

.login-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo {
  position: relative;
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
}

.logo-hexagon-large {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: rotate 10s linear infinite;
}

.logo-pulse-large {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
}

.login-subtitle {
  color: #94a3b8;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #6c757d;
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder {
  color: #6c757d;
}

.login-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

/* Quarter Redirect */
.quarter-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
}

.redirect-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  backdrop-filter: blur(10px);
  text-align: center;
}

.redirect-header {
  margin-bottom: 2rem;
}

.redirect-logo {
  position: relative;
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
}

.redirect-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
}

.redirect-subtitle {
  color: #94a3b8;
  margin: 0;
}

.redirect-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.redirect-content p {
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

.redirect-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.redirect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.service-content {
  width: 100%;
  height: 100%;
}

/* Animations */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
}

/* Responsive */
@media (max-width: 768px) {
  .canonika-layout {
    flex-direction: column;
  }
  
  .main-content {
    margin-left: 0 !important;
    padding: 1rem;
  }
  
  .sidebar-toggle {
    position: fixed;
    top: 70px;
    left: 0.5rem;
  }
}
</style> 