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
              <div class="module-icon icon-harbor"></div>
              <span class="logo-subtitle">HARBOR</span>
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

    <div class="canonika-layout">
      <!-- Sidebar Bootstrap-style -->
      <nav :class="['sidebar', { collapsed: sidebarCollapsed }]" v-if="user">
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <i class="fas fa-anchor"></i>
            <span class="brand-text">Harbor</span>
          </div>
          <button @click="toggleSidebar" class="sidebar-toggle">
            <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
          </button>
        </div>
        
        <div class="sidebar-nav">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link class="nav-link" to="/" @click="handleNavClick">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </router-link>
            </li>
            
            <!-- Skipper -->
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleSubmenuClick('skipper')">
                <i class="fas fa-ship"></i>
                <span>Skipper</span>
                <i :class="openSubmenus.skipper ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="submenu-icon"></i>
              </a>
              <ul class="nav flex-column submenu" :class="{ show: openSubmenus.skipper }">
                <li class="nav-item">
                  <router-link class="nav-link" to="/skipper/simulacao" @click="handleNavClick">
                    <i class="fas fa-chart-line"></i>
                    <span>Simulação</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/skipper/fontes" @click="handleNavClick">
                    <i class="fas fa-database"></i>
                    <span>Fontes</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/skipper/analises" @click="handleNavClick">
                    <i class="fas fa-chart-bar"></i>
                    <span>Análises</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/skipper/extracao" @click="handleNavClick">
                    <i class="fas fa-download"></i>
                    <span>Extração</span>
                  </router-link>
                </li>
              </ul>
            </li>
            
            <!-- Ledger -->
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleSubmenuClick('ledger')">
                <i class="fas fa-book"></i>
                <span>Ledger</span>
                <i :class="openSubmenus.ledger ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="submenu-icon"></i>
              </a>
              <ul class="nav flex-column submenu" :class="{ show: openSubmenus.ledger }">
                <li class="nav-item">
                  <router-link class="nav-link" to="/ledger/lancamentos" @click="handleNavClick">
                    <i class="fas fa-plus-circle"></i>
                    <span>Lançamentos</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/ledger/relatorios" @click="handleNavClick">
                    <i class="fas fa-file-alt"></i>
                    <span>Relatórios</span>
                  </router-link>
                </li>
              </ul>
            </li>
            
            <!-- Tollgate -->
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleSubmenuClick('tollgate')">
                <i class="fas fa-coins"></i>
                <span>Tollgate</span>
                <i :class="openSubmenus.tollgate ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="submenu-icon"></i>
              </a>
              <ul class="nav flex-column submenu" :class="{ show: openSubmenus.tollgate }">
                <li class="nav-item">
                  <router-link class="nav-link" to="/tollgate/pedagios" @click="handleNavClick">
                    <i class="fas fa-road"></i>
                    <span>Pedágios</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/tollgate/auditoria" @click="handleNavClick">
                    <i class="fas fa-search"></i>
                    <span>Auditoria</span>
                  </router-link>
                </li>
              </ul>
            </li>
            
            <li class="nav-item">
              <router-link class="nav-link" to="/quarter" @click="handleNavClick">
                <i class="fas fa-users-cog"></i>
                <span>Quarter</span>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link class="nav-link" to="/beacon" @click="handleNavClick">
                <i class="fas fa-broadcast-tower"></i>
                <span>Beacon</span>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link class="nav-link" to="/echo" @click="handleNavClick">
                <i class="fas fa-wave-square"></i>
                <span>Echo</span>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link class="nav-link" to="/guardian" @click="handleNavClick">
                <i class="fas fa-shield-alt"></i>
                <span>Guardian</span>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link class="nav-link" to="/mapmaker" @click="handleNavClick">
                <i class="fas fa-map-marked-alt"></i>
                <span>Mapmaker</span>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link class="nav-link" to="/seagull" @click="handleNavClick">
                <i class="fas fa-eye"></i>
                <span>Seagull</span>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link class="nav-link" to="/wayfinder" @click="handleNavClick">
                <i class="fas fa-route"></i>
                <span>Wayfinder</span>
              </router-link>
            </li>
          </ul>
        </div>
        
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              <span>{{ user.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">Administrador</span>
            </div>
          </div>
        </div>
      </nav>
      
      <main :class="['main-content', { 'sidebar-collapsed': sidebarCollapsed && user }]">
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
        <router-view v-else />
        
        <!-- Teste de Hot Reload -->
        <div class="hot-reload-test" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.5rem; color: white; font-size: 0.8rem; border: 1px solid #475569;">
          <div>🔄 Hot Reload: {{ new Date().toLocaleTimeString() }}</div>
          <div>✅ Login Persistente</div>
          <div>🎯 localStorage Implementado</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { getServiceInfo, getAllServices, hasServiceView } from './services.js'

export default {
  name: 'App',
  data() {
    return {
      user: null,
      loginForm: {
        email: 'admin@canonika.io',
        password: 'Admin@123'
      },
      error: null,
      currentView: 'dashboard',
      services: getAllServices(),
      sidebarCollapsed: false,
      openSubmenus: {
        skipper: false,
        ledger: false,
        tollgate: false
      }
    }
  },
  mounted() {
    // Carregar estado de autenticação ao iniciar
    this.loadAuthState();
  },
  methods: {
    async login() {
      this.error = null;
      try {
        // Simular login bem-sucedido
        this.user = {
          id: 'admin-001',
          name: 'Administrador',
          email: this.loginForm.email,
          roles: ['admin']
        }
        
        // Salvar estado de autenticação
        this.saveAuthState();
      } catch (e) {
        this.error = 'Erro ao fazer login.';
      }
    },
    logout() {
      this.user = null;
      // Limpar estado de autenticação
      this.clearAuthState();
    },
    saveAuthState() {
      if (this.user) {
        localStorage.setItem('canonika_user', JSON.stringify(this.user));
        localStorage.setItem('canonika_authenticated', 'true');
      }
    },
    loadAuthState() {
      const authenticated = localStorage.getItem('canonika_authenticated');
      const userData = localStorage.getItem('canonika_user');
      
      if (authenticated === 'true' && userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (e) {
          // Se houver erro ao parsear, limpar dados corrompidos
          this.clearAuthState();
        }
      }
    },
    clearAuthState() {
      localStorage.removeItem('canonika_user');
      localStorage.removeItem('canonika_authenticated');
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      
      if (this.sidebarCollapsed) {
        this.openSubmenus.skipper = false;
        this.openSubmenus.ledger = false;
        this.openSubmenus.tollgate = false;
      }
    },
    handleNavClick() {
      if (this.sidebarCollapsed) {
        this.sidebarCollapsed = false;
      }
    },
    handleSubmenuClick(menu) {
      if (this.sidebarCollapsed) {
        this.sidebarCollapsed = false;
        setTimeout(() => {
          this.openSubmenus[menu] = !this.openSubmenus[menu];
        }, 300);
      } else {
        this.openSubmenus[menu] = !this.openSubmenus[menu];
      }
    },
    isActiveRoute(route) {
      return this.$route.path.startsWith(route);
    }
  }
}
</script>

<style>
/* Reset CSS Universal */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

/* App Container */
.canonika-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.canonika-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
  padding: 1rem 2rem;
  position: relative;
  overflow: hidden;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  height: 100%;
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.25rem;
  height: 0.25rem;
  background: #ffffff;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.1em;
  line-height: 1;
  margin: 0;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #cbd5e1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-name {
  font-weight: 600;
  color: #e2e8f0;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
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
  font-weight: 500;
  position: relative;
  gap: 0.75rem;
}

.nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-exact-active {
  color: #fff;
  background-color: #3b82f6;
}

.nav-link i {
  width: 1.25rem;
  text-align: center;
  font-size: 1rem;
}

.submenu-icon {
  margin-left: auto;
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.submenu.show .submenu-icon {
  transform: rotate(90deg);
}

.submenu {
  padding-left: 2.5rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.submenu.show {
  max-height: 500px;
}

.submenu .nav-link {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.collapsed .nav-link span,
.collapsed .submenu-icon {
  display: none;
}

.collapsed .submenu {
  display: none;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #343a40;
}

.collapsed .sidebar-footer {
  display: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
}

.user-role {
  font-size: 0.75rem;
  color: #6c757d;
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
  position: relative;
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
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s ease;
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
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.login-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
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

/* Animations */
@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.8; 
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  }
  50% { 
    opacity: 1; 
    box-shadow: 0 0 8px rgba(255, 255, 255, 1), 0 0 12px rgba(255, 255, 255, 0.6);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .canonika-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  
  .sidebar.collapsed {
    width: 100%;
  }
  
  .main-content {
    flex: 1;
  }
}
</style>

