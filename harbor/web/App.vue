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
      <!-- Sidebar inspirado no Bootstrap -->
      <nav class="canonika-sidebar" v-if="user">
        <div class="sidebar-header">
          <span class="sidebar-title">NAVEGAÇÃO</span>
        </div>
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <div class="nav-icon">
                <i class="fas fa-tachometer-alt"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Dashboard</div>
                <div class="service-subtitle">Visão geral do sistema</div>
              </div>
            </router-link>
          </li>
          <!-- Skipper -->
          <li class="nav-item">
            <a class="nav-link d-flex justify-content-between align-items-center" href="#" @click.prevent="toggleSubmenu('skipper')">
              <div class="nav-icon">
                <i class="fas fa-ship"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Skipper</div>
                <div class="service-subtitle">Navegação e extração de dados</div>
              </div>
              <i :class="openSubmenus.skipper ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
            </a>
            <ul class="nav flex-column collapse submenu-bootstrap" :class="{ show: openSubmenus.skipper }">
              <li class="nav-item">
                <router-link class="nav-link" to="/skipper/simulacao">
                  <div class="nav-icon">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Simulação</div>
                    <div class="service-subtitle">Testes e simulações</div>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/skipper/fontes">
                  <div class="nav-icon">
                    <i class="fas fa-database"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Fontes</div>
                    <div class="service-subtitle">Gerenciamento de dados</div>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/skipper/analises">
                  <div class="nav-icon">
                    <i class="fas fa-chart-bar"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Análises</div>
                    <div class="service-subtitle">Relatórios e métricas</div>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/skipper/extracao">
                  <div class="nav-icon">
                    <i class="fas fa-download"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Extração</div>
                    <div class="service-subtitle">Coleta de informações</div>
                  </div>
                </router-link>
              </li>
            </ul>
          </li>
          <!-- Ledger -->
          <li class="nav-item">
            <a class="nav-link d-flex justify-content-between align-items-center" href="#" @click.prevent="toggleSubmenu('ledger')">
              <div class="nav-icon">
                <i class="fas fa-book"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Ledger</div>
                <div class="service-subtitle">Contabilidade e gestão financeira</div>
              </div>
              <i :class="openSubmenus.ledger ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
            </a>
            <ul class="nav flex-column collapse submenu-bootstrap" :class="{ show: openSubmenus.ledger }">
              <li class="nav-item">
                <router-link class="nav-link" to="/ledger/lancamentos">
                  <div class="nav-icon">
                    <i class="fas fa-plus-circle"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Lançamentos</div>
                    <div class="service-subtitle">Registro de transações</div>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/ledger/relatorios">
                  <div class="nav-icon">
                    <i class="fas fa-file-alt"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Relatórios</div>
                    <div class="service-subtitle">Análises financeiras</div>
                  </div>
                </router-link>
              </li>
            </ul>
          </li>
          <!-- Tollgate -->
          <li class="nav-item">
            <a class="nav-link d-flex justify-content-between align-items-center" href="#" @click.prevent="toggleSubmenu('tollgate')">
              <div class="nav-icon">
                <i class="fas fa-coins"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Tollgate</div>
                <div class="service-subtitle">Pedágio e controle de acesso</div>
              </div>
              <i :class="openSubmenus.tollgate ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
            </a>
            <ul class="nav flex-column collapse submenu-bootstrap" :class="{ show: openSubmenus.tollgate }">
              <li class="nav-item">
                <router-link class="nav-link" to="/tollgate/pedagios">
                  <div class="nav-icon">
                    <i class="fas fa-road"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Pedágios</div>
                    <div class="service-subtitle">Gestão de cobranças</div>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/tollgate/auditoria">
                  <div class="nav-icon">
                    <i class="fas fa-search"></i>
                  </div>
                  <div class="nav-text">
                    <div class="nav-title">Auditoria</div>
                    <div class="service-subtitle">Controle e monitoramento</div>
                  </div>
                </router-link>
              </li>
            </ul>
          </li>
          <!-- Quarter -->
          <li class="nav-item">
            <router-link class="nav-link" to="/quarter">
              <div class="nav-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Quarter</div>
                <div class="service-subtitle">Gestão de usuários e permissões</div>
              </div>
            </router-link>
          </li>
          <!-- Beacon -->
          <li class="nav-item">
            <router-link class="nav-link" to="/beacon">
              <div class="nav-icon">
                <i class="fas fa-broadcast-tower"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Beacon</div>
                <div class="service-subtitle">Sinalização e comunicação</div>
              </div>
            </router-link>
          </li>
          <!-- Echo -->
          <li class="nav-item">
            <router-link class="nav-link" to="/echo">
              <div class="nav-icon">
                <i class="fas fa-echo"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Echo</div>
                <div class="service-subtitle">Sistema de eco e ressonância</div>
              </div>
            </router-link>
          </li>
          <!-- Guardian -->
          <li class="nav-item">
            <router-link class="nav-link" to="/guardian">
              <div class="nav-icon">
                <i class="fas fa-shield"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Guardian</div>
                <div class="service-subtitle">Proteção e segurança</div>
              </div>
            </router-link>
          </li>
          <!-- Mapmaker -->
          <li class="nav-item">
            <router-link class="nav-link" to="/mapmaker">
              <div class="nav-icon">
                <i class="fas fa-map"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Mapmaker</div>
                <div class="service-subtitle">Criação e gestão de mapas</div>
              </div>
            </router-link>
          </li>
          <!-- Seagull -->
          <li class="nav-item">
            <router-link class="nav-link" to="/seagull">
              <div class="nav-icon">
                <i class="fas fa-seagull"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Seagull</div>
                <div class="service-subtitle">Vigilância e monitoramento</div>
              </div>
            </router-link>
          </li>
          <!-- Wayfinder -->
          <li class="nav-item">
            <router-link class="nav-link" to="/wayfinder">
              <div class="nav-icon">
                <i class="fas fa-compass"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">Wayfinder</div>
                <div class="service-subtitle">Navegação e orientação</div>
              </div>
            </router-link>
          </li>
        </ul>
      </nav>
      <main class="canonika-main">
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
          <div>✅ Padding Y Reduzido</div>
          <div>📏 4px em vez de 0.75rem</div>
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
      // Novo: controle de submenus
      openSubmenus: {
        skipper: false,
        ledger: false,
        tollgate: false
      }
    }
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
      } catch (e) {
        this.error = 'Erro ao fazer login.';
      }
    },
    logout() {
      this.user = null;
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    // Novo: alternar submenus
    toggleSubmenu(menu) {
      this.openSubmenus[menu] = !this.openSubmenus[menu];
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

/* Estilos existentes mantidos e expandidos */
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
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* Main Container */
.main-container {
  display: flex;
  min-height: calc(100vh - 80px);
}

/* Sidebar Toggle Button */
.sidebar-toggle {
  position: fixed;
  top: 90px;
  left: 20px;
  z-index: 1001;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.sidebar-toggle.sidebar-collapsed {
  left: 20px;
}

/* Sidebar */
.canonika-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  border-right: 1px solid #475569;
  padding: 2rem 0;
  overflow-y: auto;
  transition: all 0.3s ease;
  position: fixed;
  top: 80px;
  left: 0;
  z-index: 1000;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.canonika-sidebar.sidebar-collapsed {
  transform: translateX(-100%);
}

/* Main Content */
.canonika-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 80px);
}

.canonika-main.sidebar-collapsed {
  margin-left: 0;
}

/* Navigation Menu */
.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 0.5rem;
  margin: 0 1rem;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #e2e8f0;
  transform: translateX(5px);
}

.nav-item.active .nav-link {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-right: 3px solid #10b981;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transform: translateX(5px);
}

.nav-item.active .nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 1rem;
  flex-shrink: 0;
  flex: 0 0 1.5rem;
}

.nav-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  gap: 0.125rem;
}

.nav-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
  margin: 0;
  color: inherit;
}

.service-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  margin: 0;
  white-space: nowrap;
  color: inherit;
}

/* Login */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
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

/* Dashboard */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.dashboard-header p {
  color: #94a3b8;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  border: 1px solid #64748b;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.card-icon {
  color: #3b82f6;
  font-size: 1.25rem;
}

.service-status-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(30, 41, 59, 0.3);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

.service-name {
  flex: 1;
  color: #e2e8f0;
  font-weight: 500;
}

.service-port {
  color: #64748b;
  font-size: 0.875rem;
  font-family: monospace;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.quick-action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.quick-action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.activity-icon {
  width: 2rem;
  height: 2rem;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.activity-content {
  flex: 1;
}

.activity-title {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.875rem;
}

.activity-time {
  color: #64748b;
  font-size: 0.75rem;
}

/* Service Views */
.service-view {
  height: 100%;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  border-radius: 1rem;
  border: 1px solid #64748b;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.view-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.view-content {
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

/* Tollgate Styles */
.balance-display {
  text-align: center;
  margin-bottom: 1.5rem;
}

.balance-value {
  font-size: 3rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.balance-label {
  color: #94a3b8;
  font-size: 1rem;
}

.balance-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #475569;
}

.detail-label {
  color: #64748b;
  font-size: 0.875rem;
}

.detail-value {
  color: #e2e8f0;
  font-weight: 600;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.transaction-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.transaction-icon.credit {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.transaction-icon.debit {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.875rem;
}

.transaction-amount {
  color: #3b82f6;
  font-weight: 600;
  font-size: 1rem;
}

.transaction-time {
  color: #64748b;
  font-size: 0.75rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.plan-item {
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  text-align: center;
  border: 1px solid #475569;
  transition: all 0.2s ease;
}

.plan-item.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.plan-name {
  color: #e2e8f0;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.plan-price {
  color: #3b82f6;
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.plan-credits {
  color: #64748b;
  font-size: 0.875rem;
}

/* Quarter Styles */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
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
  font-size: 0.875rem;
}

.user-details {
  flex: 1;
}

.user-name {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-email {
  color: #64748b;
  font-size: 0.75rem;
}

.user-status {
  font-size: 0.75rem;
  font-weight: 500;
}

.user-status.online {
  color: #10b981;
}

.user-status.offline {
  color: #64748b;
}

.user-action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.1);
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.permission-item {
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  text-align: center;
}

.permission-name {
  color: #e2e8f0;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.permission-count {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.permission-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.permission-badge.admin {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.permission-badge.manager {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.permission-badge.user {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

/* Skipper Styles */
.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.analysis-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.analysis-details {
  flex: 1;
}

.analysis-title {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.analysis-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.progress-bar {
  flex: 1;
  height: 0.5rem;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 0.25rem;
  transition: width 0.3s ease;
}

.progress-text {
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.875rem;
  min-width: 3rem;
}

.analysis-time {
  color: #64748b;
  font-size: 0.75rem;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.insight-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.insight-icon.positive {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.insight-icon.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.insight-content {
  flex: 1;
}

.insight-title {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.insight-description {
  color: #64748b;
  font-size: 0.75rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* Service Info */
.service-info {
  text-align: center;
  padding: 2rem;
}

.service-info p {
  color: #94a3b8;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.service-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 600;
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
  .canonika-sidebar {
    width: 100%;
    transform: translateX(-100%);
  }
  
  .canonika-sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
  
  .canonika-main {
    margin-left: 0;
  }
  
  .sidebar-toggle {
    display: flex;
  }
}

.nav-submenu {
  padding-left: 24px;
  background: rgba(255,255,255,0.03);
  border-left: 2px solid #222;
  margin-bottom: 4px;
}
.submenu-link {
  font-size: 0.95em;
  color: #b0b0b0;
}
.nav-item.active > .nav-link,
.nav-item .nav-link.router-link-exact-active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  border-radius: 6px;
  border-left: 3px solid #10b981;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.nav-item .nav-link.router-link-exact-active .nav-title {
  font-weight: bold;
}
.nav-item .submenu-toggle {
  cursor: pointer;
  margin-left: 8px;
  font-size: 0.9em;
  color: #888;
}

.sidebar-bootstrap {
  background: #212529;
  color: #fff;
  min-width: 280px;
  max-width: 280px;
  height: 100vh;
  padding: 1rem 0;
  border-right: 1px solid #343a40;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}
.sidebar-title {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #6c757d;
  margin: 0 1rem 0.5rem 1rem;
  text-transform: uppercase;
  padding: 0.5rem 0;
}
.nav.flex-column {
  width: 100%;
}
.nav-link {
  color: #adb5bd;
  border-radius: 0;
  padding: 4px 1rem;
  margin: 0;
  transition: background 0.15s ease-in-out, color 0.15s ease-in-out;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  text-decoration: none;
  border: none;
  gap: 0.75rem;
}
.nav-link.active, .nav-link.router-link-exact-active, .nav-link:hover, .nav-link:focus {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-left: 3px solid #3b82f6;
}
.nav-icon {
  min-width: 1.5rem;
  text-align: center;
  font-size: 1.1rem;
  color: #6c757d;
  flex-shrink: 0;
}

.nav-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.125rem;
}

.nav-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
  margin: 0;
  color: inherit;
}

.service-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  margin: 0;
  white-space: nowrap;
  color: inherit;
  font-weight: 400;
}
.submenu-bootstrap {
  background: none;
  border: none;
  margin: 0;
  padding-left: 1rem;
  transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}

.submenu-bootstrap .nav-link {
  padding: 2px 1rem;
  font-size: 0.875rem;
}

.submenu-bootstrap .nav-icon {
  min-width: 1.25rem;
  font-size: 0.9rem;
}

.submenu-bootstrap .nav-title {
  font-size: 0.8rem;
}

.submenu-bootstrap .service-subtitle {
  font-size: 0.7rem;
}
.submenu-bootstrap:not(.show) {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}
.submenu-bootstrap.show {
  max-height: 500px;
  opacity: 1;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
</style>

