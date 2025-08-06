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
    checkAuthentication() {
      console.log('🔍 Verificando autenticação...')
      
      // Verificar se está autenticado
      if (BeaconAuthService.isAuthenticated()) {
        console.log('✅ Usuário autenticado')
        this.user = BeaconAuthService.getUserInfo()
        this.isAuthenticated = true
        return true
      } else {
        console.log('❌ Usuário não autenticado')
        this.user = null
        this.isAuthenticated = false
        return false
      }
    },
    
    // Redirecionar para Quarter
    redirectToQuarter() {
      console.log('🔄 Redirecionando para Quarter...')
      BeaconAuthService.redirectToQuarter()
    },
    
    // Fazer logout
    logout() {
      console.log('🔘 ===== BOTÃO LOGOUT CLICADO =====');
      console.log('🔘 Método logout() chamado');
      console.log('🔘 window.location:', window.location.href);
      console.log('🚪 ===== INICIANDO LOGOUT =====');
      
      // 1. Limpar tokens do localStorage
      console.log('🧹 Limpando localStorage...');
      localStorage.removeItem('beacon_access_token');
      localStorage.removeItem('beacon_refresh_token');
      
      // 2. Limpar cookies
      console.log('🧹 Limpando cookies...');
      document.cookie = 'beacon_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'beacon_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // 3. Executar redirecionamento
      console.log('🚀 EXECUTANDO REDIRECIONAMENTO...');
      try {
        // Redirecionar para Quarter com logout e return_url (URL limpa)
        const baseUrl = window.location.origin + window.location.pathname;
        const returnUrl = encodeURIComponent(baseUrl);
        const quarterUrl = `http://localhost:3700?logout=1&return_url=${returnUrl}&service=beacon`;
        
        console.log('🔄 Redirecionando para Quarter (URL limpa):', quarterUrl);
        
        // Forçar redirecionamento
        window.location.replace(quarterUrl);
        
        console.log('✅ Redirecionamento executado com sucesso');
      } catch (error) {
        console.error('❌ Erro no redirecionamento:', error);
        // Fallback simples
        window.location.href = 'http://localhost:3700?logout=1&service=beacon';
      }
      
      console.log('🚪 ===== FIM DO LOGOUT =====');
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
    
    // Processar token de autenticação se presente na URL
    BeaconAuthService.processAuthToken();
    
    // Verificar autenticação
    if (!this.checkAuthentication()) {
      console.log('❌ Usuário não autenticado, redirecionando para Quarter...')
      this.redirectToQuarter();
      return;
    }
    
    console.log('✅ Usuário autenticado, carregando aplicação...')
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

.external-link-icon {
  font-size: 0.75rem;
  opacity: 0.6;
  margin-left: 0.5rem;
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