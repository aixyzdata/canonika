<template>
  <div class="canonika-app">
    <!-- Header -->
    <header class="canonika-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <div class="logo-hexagon"></div>
            <div class="logo-pulse"></div>
          </div>
          <div class="logo-text-container">
            <h1 class="logo-text">CANONIKA</h1>
            <span class="logo-subtitle">BEACON</span>
          </div>
        </div>
        
        <div class="header-actions">
          <div class="user-info">
            <div class="user-avatar">
              <span>{{ user ? user.name.charAt(0).toUpperCase() : 'A' }}</span>
            </div>
            <span class="user-name">{{ user ? user.name : 'Administrador' }}</span>
          </div>
          <button @click="logout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            Sair
          </button>
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span>ONLINE</span>
          </div>
        </div>
      </div>
      <div class="header-glow"></div>
    </header>

    <!-- Layout -->
    <div class="canonika-layout">
      <!-- Sidebar -->
      <nav :class="['sidebar', { collapsed: sidebarCollapsed }]">
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <i class="fas fa-broadcast-tower"></i>
            <span class="brand-text">Beacon</span>
          </div>
          <button @click="toggleSidebar" class="sidebar-toggle">
            <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
          </button>
        </div>
        
        <div class="sidebar-nav">
          <!-- Seção Soluções -->
          <div class="nav-section">
            <div class="section-header">
              <span class="section-title">SOLUÇÕES</span>
            </div>
            <ul class="nav">
              <!-- Home -->
              <li class="nav-item">
                <router-link class="nav-link" to="/" @click="handleNavClick">
                  <div class="nav-icon">
                    <i class="fas fa-home"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Home</div>
                    <div class="service-subtitle">Página Inicial</div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Seção Serviços -->
          <div class="nav-section">
            <div class="section-header">
              <span class="section-title">SERVIÇOS</span>
            </div>
            <ul class="nav">
              <!-- WebSocket -->
              <li class="nav-item">
                <router-link class="nav-link" to="/websocket" @click="handleNavClick">
                  <div class="nav-icon">
                    <i class="fas fa-broadcast-tower"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">WebSocket</div>
                    <div class="service-subtitle">Tempo Real</div>
                  </div>
                </router-link>
              </li>
              
              <!-- REST API -->
              <li class="nav-item">
                <router-link class="nav-link" to="/api" @click="handleNavClick">
                  <div class="nav-icon">
                    <i class="fas fa-code"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">REST API</div>
                    <div class="service-subtitle">HTTP Endpoints</div>
                  </div>
                </router-link>
              </li>
              
              <!-- Push Notifications -->
              <li class="nav-item">
                <router-link class="nav-link" to="/push" @click="handleNavClick">
                  <div class="nav-icon">
                    <i class="fas fa-bell"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Push Notifications</div>
                    <div class="service-subtitle">Alertas</div>
                  </div>
                </router-link>
              </li>
              
              <!-- Email Service -->
              <li class="nav-item">
                <router-link class="nav-link" to="/email" @click="handleNavClick">
                  <div class="nav-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Email Service</div>
                    <div class="service-subtitle">Comunicação</div>
                  </div>
                </router-link>
              </li>
              
              <!-- SMS Gateway -->
              <li class="nav-item">
                <router-link class="nav-link" to="/sms" @click="handleNavClick">
                  <div class="nav-icon">
                    <i class="fas fa-sms"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">SMS Gateway</div>
                    <div class="service-subtitle">Mensagens</div>
                  </div>
                </router-link>
              </li>
              
              <!-- Voice Service -->
              <li class="nav-item">
                <router-link class="nav-link" to="/voice" @click="handleNavClick">
                  <div class="nav-icon">
                    <i class="fas fa-phone"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Voice Service</div>
                    <div class="service-subtitle">Chamadas</div>
                  </div>
                </router-link>
              </li>
              
              <!-- Configurações -->
              <li class="nav-item">
                <router-link class="nav-link" to="/configuracoes" @click="handleNavClick">
                  <div class="nav-icon">
                    <i class="fas fa-cog"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Configurações</div>
                    <div class="service-subtitle">Parâmetros</div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              <span>{{ user ? user.name.charAt(0).toUpperCase() : 'A' }}</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ user ? user.name : 'Administrador' }}</span>
              <span class="user-role">Administrador</span>
            </div>
          </div>
        </div>
      </nav>
      
      <main :class="['main-content', { 'sidebar-collapsed': sidebarCollapsed && user }]">
        <!-- Login Screen -->
        <div v-if="!user" class="login-container">
          <div class="login-card">
            <div class="login-header">
              <div class="login-logo">
                <div class="logo-hexagon-large"></div>
                <div class="logo-pulse-large"></div>
              </div>
              <h2 class="login-title">Portal Canonika</h2>
              <p class="login-subtitle">Acesso unificado à plataforma</p>
            </div>
            
            <form @submit.prevent="login" class="login-form">
              <div class="form-group">
                <div class="input-container">
                  <div class="input-icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <input 
                    v-model="loginForm.email" 
                    type="email"
                    class="form-input" 
                    placeholder="Email"
                    required 
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="input-container">
                  <div class="input-icon">
                    <i class="fas fa-lock"></i>
                  </div>
                  <input 
                    v-model="loginForm.password" 
                    type="password"
                    class="form-input" 
                    placeholder="Senha"
                    required 
                  />
                </div>
              </div>
              <div v-if="error" class="error-message">
                {{ error }}
              </div>
              <button type="submit" class="login-btn">
                <span>ENTRAR</span>
                <div class="btn-glow"></div>
              </button>
            </form>
          </div>
        </div>
        
        <!-- Router View -->
        <div v-if="isAuthenticated" class="router-container">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import BeaconAuthService from './auth/AuthService.js'

export default {
  name: 'App',
  data() {
    return {
      user: null,
      sidebarCollapsed: false,
      loginForm: {
        email: '',
        password: ''
      },
      error: null,
      isAuthenticated: false
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
    checkAuth() {
      console.log('🔍 Verificando autenticação...')
      
      // Verificar token na URL
      const urlParams = new URLSearchParams(window.location.search)
      const authToken = urlParams.get('auth_token')
      
      if (authToken) {
        console.log('🔑 Token encontrado na URL, processando...')
        this.processAuthToken(authToken)
        return
      }
      
      // Verificar token no localStorage
      const storedToken = localStorage.getItem('auth_token') || 
                         localStorage.getItem('canonika_auth_token')
      
      if (storedToken) {
        console.log('🔑 Token encontrado no localStorage, validando...')
        if (this.validateToken(storedToken)) {
          console.log('✅ Token válido, usuário autenticado')
          this.user = this.getUserFromToken(storedToken)
          this.isAuthenticated = true
          return
        } else {
          console.log('❌ Token inválido, limpando...')
          this.clearTokens()
        }
      }
      
      console.log('❌ Usuário não autenticado, redirecionando para Quarter...')
      this.redirectToQuarter()
    },
    
    // Processar token de autenticação
    processAuthToken(token) {
      console.log('🔑 Processando token de autenticação...')
      
      if (this.validateToken(token)) {
        console.log('✅ Token válido, salvando...')
        localStorage.setItem('auth_token', token)
        localStorage.setItem('canonika_auth_token', token)
        
        this.user = this.getUserFromToken(token)
        this.isAuthenticated = true
        
        // Limpar token da URL
        const url = new URL(window.location)
        url.searchParams.delete('auth_token')
        window.history.replaceState({}, '', url.toString())
        
        console.log('✅ Usuário autenticado com sucesso')
      } else {
        console.log('❌ Token inválido, redirecionando para Quarter...')
        this.redirectToQuarter()
      }
    },
    
    // Validar token
    validateToken(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const now = Math.floor(Date.now() / 1000)
        
        if (payload.exp && payload.exp < now) {
          console.log('❌ Token expirado')
          return false
        }
        
        console.log('✅ Token válido')
        return true
      } catch (error) {
        console.log('❌ Token inválido:', error)
        return false
      }
    },
    
    // Obter usuário do token
    getUserFromToken(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          roles: payload.roles || []
        }
      } catch (error) {
        console.log('❌ Erro ao extrair usuário do token:', error)
        return null
      }
    },
    
    // Limpar tokens
    clearTokens() {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('canonika_auth_token')
      localStorage.removeItem('canonika_refresh_token')
      localStorage.removeItem('canonika_authenticated')
      localStorage.removeItem('canonika_user')
      
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'canonika_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'canonika_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'canonika_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    },
    
    // Redirecionar para Quarter
    redirectToQuarter() {
      const currentUrl = window.location.href
      const redirectUrl = encodeURIComponent(currentUrl)
      console.log('🔄 Redirecionando para Quarter:', `http://localhost:3700?redirect_to=${redirectUrl}`)
      window.location.href = `http://localhost:3700?redirect_to=${redirectUrl}`
    },
    
    // Fazer logout
    logout() {
      console.log('🚪 ===== INICIANDO LOGOUT NO BEACON =====');
      console.log('🔍 URL atual:', window.location.href);
      console.log('🔍 Timestamp:', new Date().toISOString());
      
      // 1. Verificar tokens antes de limpar
      console.log('📋 Tokens antes da limpeza:');
      console.log('  - localStorage auth_token:', localStorage.getItem('auth_token'));
      console.log('  - localStorage canonika_auth_token:', localStorage.getItem('canonika_auth_token'));
      console.log('  - Cookie auth_token:', document.cookie.includes('auth_token'));
      console.log('  - Cookie canonika_auth_token:', document.cookie.includes('canonika_auth_token'));
      
      // 2. Limpar tokens do localStorage
      console.log('🧹 Limpando localStorage...');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('canonika_auth_token');
      localStorage.removeItem('canonika_refresh_token');
      localStorage.removeItem('canonika_authenticated');
      localStorage.removeItem('canonika_user');
      
      // 3. Limpar cookies
      console.log('🧹 Limpando cookies...');
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'canonika_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'canonika_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'canonika_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // 4. Verificar tokens após limpeza
      console.log('📋 Tokens após limpeza:');
      console.log('  - localStorage auth_token:', localStorage.getItem('auth_token'));
      console.log('  - localStorage canonika_auth_token:', localStorage.getItem('canonika_auth_token'));
      console.log('  - Cookie auth_token:', document.cookie.includes('auth_token'));
      console.log('  - Cookie canonika_auth_token:', document.cookie.includes('canonika_auth_token'));
      
      // 5. Preparar redirecionamento
      const cleanUrl = window.location.origin + window.location.pathname;
      console.log('🧹 URL limpa calculada:', cleanUrl);
      console.log('🔄 Preparando redirecionamento para Quarter...');
      console.log('🎯 URL de destino: http://localhost:3700?logout=1');
      
      // 6. Executar redirecionamento
      console.log('🚀 EXECUTANDO REDIRECIONAMENTO...');
      try {
        // Redirecionar para Quarter com parâmetro de logout
        console.log('🔄 Redirecionando para Quarter com logout...');
        window.location.href = 'http://localhost:3700?logout=1';
        console.log('✅ Redirecionamento executado com sucesso');
      } catch (error) {
        console.error('❌ Erro no redirecionamento:', error);
        // Fallback
        try {
          console.log('🔄 Tentando fallback...');
          window.location.assign('http://localhost:3700?logout=1');
        } catch (error2) {
          console.error('❌ Erro no fallback:', error2);
        }
      }
      
      console.log('🚪 ===== FIM DO LOGOUT =====');
    },
    
    // Login local (fallback)
    login() {
      console.log('🔐 Login local:', this.loginForm)
      
      // Em produção, isso seria feito pelo Quarter
      // Por enquanto, vamos simular um login local
      if (this.loginForm.email === 'admin@canonika.io' && this.loginForm.password === 'admin123') {
        this.user = {
          id: 'admin-001',
          name: 'Administrador Canonika',
          email: this.loginForm.email,
          roles: ['canonika_admin']
        }
        this.isAuthenticated = true
        this.error = null
      } else {
        this.error = 'Credenciais inválidas'
      }
    }
  },
  
  mounted() {
    console.log('🚀 BEACON APP CARREGADO - Sistema de Autenticação Centralizado')
    
    // Verificar se é logout
    if (window.location.search.includes('logout=1')) {
      console.log('🚪 Logout detectado, redirecionando para Quarter...')
      window.location.href = 'http://localhost:3700';
      return;
    }
    
    // Verificar autenticação
    this.checkAuth()
  }
}
</script>

<style scoped>
/* Reset e base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.canonika-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.canonika-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid #475569;
  position: relative;
  overflow: hidden;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 100%;
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
  width: 2.5rem;
  height: 2.5rem;
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
  width: 1rem;
  height: 1rem;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.1em;
  margin: 0;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.user-name {
  font-size: 0.8rem;
  color: #e2e8f0;
  font-weight: 500;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

.header-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  pointer-events: none;
}

/* Layout */
.canonika-layout {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

/* Sidebar Bootstrap Style */
.sidebar {
  width: 280px;
  background: #212529;
  border-right: 1px solid #343a40;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  height: calc(100vh - 60px);
  z-index: 1000;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #343a40;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
  font-weight: 600;
  font-size: 1.125rem;
}

.sidebar-brand i {
  font-size: 1.25rem;
  color: #3b82f6;
}

.collapsed .brand-text {
  display: none;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease;
}

.sidebar-toggle:hover {
  color: #adb5bd;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.section-header {
  padding: 0 1rem 0.5rem;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #6c757d;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.8;
}

.nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #adb5bd;
  text-decoration: none;
  transition: all 0.15s ease-in-out;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  margin: 0 0.5rem;
}

.nav-link:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.nav-link.router-link-exact-active {
  color: #ffffff !important;
  background-color: #3b82f6;
  border-radius: 0.375rem;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.nav-link.router-link-exact-active .nav-title,
.nav-link.router-link-exact-active .service-subtitle {
  color: #ffffff !important;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nav-title {
  font-weight: 600;
  color: inherit;
  margin: 0;
  white-space: nowrap;
}

.service-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  margin: 0;
  white-space: nowrap;
  color: inherit;
}

.collapsed .nav-text {
  display: none;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #343a40;
}

.sidebar-footer .user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sidebar-footer .user-avatar {
  width: 2.5rem;
  height: 2.5rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-role {
  font-size: 0.7rem;
  color: #6c757d;
  margin-top: 0.1rem;
}

.collapsed .user-details {
  display: none;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  transition: all 0.3s ease;
  background: #f8f9fa;
  color: #212529;
}

/* When no user (login screen) */
.main-content:not(.sidebar-collapsed) {
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  color: #e2e8f0;
}

/* Router Container */
.router-container {
  width: 100%;
  height: 100%;
}

/* Login */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
}

.login-card {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  border: 1px solid #64748b;
  border-radius: 1rem;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-pulse-large {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background: #ffffff;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.login-subtitle {
  color: #94a3b8;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  color: #64748b;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  background: rgba(30, 41, 59, 0.5);
  color: #e2e8f0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #64748b;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.login-btn {
  position: relative;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover .btn-glow {
  left: 100%;
}

/* Animações */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
}

/* Responsive */
@media (max-width: 768px) {
  .canonika-sidebar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    border-right: none;
    border-top: 1px solid #475569;
  }
  
  .canonika-main {
    margin-bottom: 80px;
  }
}
</style> 