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
              <div class="module-icon icon-dock"></div>
              <span class="logo-subtitle">DOCK</span>
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

      <!-- Sidebar futurista -->
      <nav class="canonika-sidebar" v-if="user" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <div class="sidebar-header">
          <div class="nav-icon active">
            <i class="nav-dot"></i>
            <span v-if="!sidebarCollapsed">NAVEGAÇÃO</span>
          </div>
        </div>
        <ul class="nav-menu">
          <li class="nav-item" :class="{ active: currentView === 'dashboard' }">
            <div class="nav-link" @click="setView('dashboard')">
              <div class="nav-icon">
                <i class="fas fa-tachometer-alt"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Dashboard</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'navios' }">
            <div class="nav-link" @click="setView('navios')">
              <div class="nav-icon">
                <i class="fas fa-ship"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Navios</span>
                <span class="service-subtitle">Embarcações</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'bercos' }">
            <div class="nav-link" @click="setView('bercos')">
              <div class="nav-icon">
                <i class="fas fa-anchor"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Berços</span>
                <span class="service-subtitle">Atracação</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'operacoes' }">
            <div class="nav-link" @click="setView('operacoes')">
              <div class="nav-icon">
                <i class="fas fa-cogs"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Operações</span>
                <span class="service-subtitle">Portuárias</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'logistica' }">
            <div class="nav-link" @click="setView('logistica')">
              <div class="nav-icon">
                <i class="fas fa-truck"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Logística</span>
                <span class="service-subtitle">Transporte</span>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Main content -->
      <main class="canonika-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">

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

        <!-- Dashboard -->
        <div v-else-if="currentView === 'dashboard'" class="dashboard-container">
          <div class="dashboard-header">
            <h1>Dock Dashboard</h1>
            <p>Sistema de gestão portuária e logística</p>
          </div>
          
          <div class="dashboard-grid">
            <!-- Status do Sistema -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Status do Sistema</h3>
                <div class="card-icon">
                  <i class="fas fa-anchor"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="service-status-list">
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Controle de Navios</span>
                    <span class="service-port">Ativo</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Gestão de Berços</span>
                    <span class="service-port">Conectado</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Sistema Logístico</span>
                    <span class="service-port">Executando</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estatísticas Portuárias -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Estatísticas Portuárias</h3>
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value">32</div>
                    <div class="stat-label">Navios no Porto</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">18</div>
                    <div class="stat-label">Berços Ocupados</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">94.5%</div>
                    <div class="stat-label">Eficiência</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">2.3h</div>
                    <div class="stat-label">Tempo Médio</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações Rápidas -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Ações Rápidas</h3>
                <div class="card-icon">
                  <i class="fas fa-bolt"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="quick-actions">
                  <button @click="setView('navios')" class="quick-action-btn">
                    <i class="fas fa-ship"></i>
                    Controlar Navios
                  </button>
                  <button @click="setView('bercos')" class="quick-action-btn">
                    <i class="fas fa-anchor"></i>
                    Gerenciar Berços
                  </button>
                  <button @click="setView('operacoes')" class="quick-action-btn">
                    <i class="fas fa-cogs"></i>
                    Operações Porto
                  </button>
                  <button @click="setView('logistica')" class="quick-action-btn">
                    <i class="fas fa-truck"></i>
                    Logística
                  </button>
                </div>
              </div>
            </div>

            <!-- Atividade Recente -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Atividade Recente</h3>
                <div class="card-icon">
                  <i class="fas fa-clock"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="activity-list">
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-ship"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Navio MSC atracou no berço 7</div>
                      <div class="activity-time">10 minutos atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-truck"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Carregamento finalizado</div>
                      <div class="activity-time">17 minutos atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-anchor"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Berço 3 liberado</div>
                      <div class="activity-time">35 minutos atrás</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Views -->
        <div v-else class="dashboard-container">
          <div class="dashboard-header">
            <h1>{{ getServiceTitle() }}</h1>
            <p>{{ getServiceDescription() }}</p>
          </div>
          
          <div class="dashboard-grid">
            <div class="dashboard-card">
              <div class="card-header">
                <h3>{{ getServiceTitle() }}</h3>
                <div class="card-icon">
                  <i class="fas fa-cog"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="view-header">
                  <div class="view-status">
                    <div class="status-indicator online"></div>
                    <span>ONLINE</span>
                  </div>
                  <div class="view-actions">
                    <button @click="refreshServiceData()" class="action-btn">
                      <i class="fas fa-sync-alt"></i>
                      Atualizar
                    </button>
                  </div>
                </div>
                <div class="service-info">
                  <p>{{ getServiceDescription() }}</p>
                  <div class="service-status">
                    <div class="status-dot online"></div>
                    <span>Serviço Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
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
      sidebarCollapsed: false
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
        };
        this.currentView = 'dashboard';
        this.loginForm = { email: '', password: '' };
      } catch (e) {
        this.error = e.message;
      }
    },
    
    logout() {
      this.user = null;
      this.currentView = 'dashboard';
    },
    
    setView(view) {
      this.currentView = view;
    },
    
    getServiceTitle() {
      const titles = {
        'navios': 'Controle de Navios',
        'bercos': 'Gerenciamento de Berços',
        'operacoes': 'Operações Portuárias',
        'logistica': 'Sistema Logístico'
      };
      return titles[this.currentView] || 'Dock';
    },
    
    getServiceDescription() {
      const descriptions = {
        'navios': 'Monitoramento e controle de navios no porto',
        'bercos': 'Gestão de berços e atracação de embarcações',
        'operacoes': 'Coordenação de operações portuárias',
        'logistica': 'Gerenciamento logístico e transporte de cargas'
      };
      return descriptions[this.currentView] || 'Sistema de gestão portuária e logística';
    },
    
    refreshServiceData() {
      console.log(`Atualizando dados do serviço: ${this.currentView}`);
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  },
  
  mounted() {
    // Verificar se há usuário logado
    const savedUser = localStorage.getItem('canonika_user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  },
  
  watch: {
    user(newUser) {
      if (newUser) {
        localStorage.setItem('canonika_user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('canonika_user');
      }
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
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
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-right: 1px solid #334155;
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
  min-height: 3.5rem;
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
  min-height: 2.5rem;
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
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
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
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
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
  background: rgba(15, 23, 42, 0.3);
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
  background: rgba(15, 23, 42, 0.3);
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
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 1rem;
  border: 1px solid #475569;
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
</style> 