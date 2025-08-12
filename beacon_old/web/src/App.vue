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
                    <i class="fas fa-satellite"></i>
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
        <!-- AUTENTICAÇÃO AUTOMÁTICA - LOGIN REMOVIDO -->
        <!-- Router View -->
        <div class="router-container">
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
    checkAuthentication() {
      console.log('🔍 Verificando autenticação no Beacon...')
      
      // Verificar se está autenticado
      if (BeaconAuthService.isAuthenticated()) {
        console.log('✅ Usuário autenticado no Beacon')
        this.user = BeaconAuthService.getUserInfo()
        this.isAuthenticated = true
        return true
      } else {
        console.log('❌ Usuário não autenticado no Beacon')
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
      console.log('🚪 Logout solicitado no Beacon')
      BeaconAuthService.logout()
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
    
    // Processar token de autenticação se presente na URL
    BeaconAuthService.processAuthToken();
    
    // AUTENTICAÇÃO AUTOMÁTICA - REMOVIDA OBRIGATORIEDADE DE LOGIN
    console.log('✅ Autenticação automática ativada para demonstração...')
    this.user = {
      id: 'admin-001',
      name: 'Administrador Beacon',
      email: 'admin@canonika.io',
      roles: ['canonika_admin']
    }
    this.isAuthenticated = true
    
    console.log('✅ Usuário autenticado automaticamente, carregando aplicação...')
  }
}
</script>

