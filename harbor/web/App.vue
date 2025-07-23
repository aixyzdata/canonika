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
            <span class="logo-subtitle">HARBOR</span>
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

    <div class="main-container">
      <!-- Sidebar futurista -->
      <nav class="canonika-sidebar" v-if="user">
        <div class="sidebar-header">
          <div class="nav-icon active">
            <i class="nav-dot"></i>
            <span>NAVEGAÇÃO</span>
          </div>
        </div>
        <ul class="nav-menu">
          <li class="nav-item" :class="{ active: currentView === 'dashboard' }">
            <div class="nav-link" @click="setView('dashboard')">
              <div class="nav-icon">
                <i class="fas fa-tachometer-alt"></i>
              </div>
              <span>Dashboard</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'tollgate' }">
            <div class="nav-link" @click="setView('tollgate')">
              <div class="nav-icon">
                <i class="fas fa-coins"></i>
              </div>
              <span>Tollgate</span>
              <span class="service-subtitle">Créditos</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'quartermaster' }">
            <div class="nav-link" @click="setView('quartermaster')">
              <div class="nav-icon">
                <i class="fas fa-users"></i>
              </div>
              <span>Quartermaster</span>
              <span class="service-subtitle">Usuários</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'skipper' }">
            <div class="nav-link" @click="setView('skipper')">
              <div class="nav-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <span>Skipper</span>
              <span class="service-subtitle">Análise</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'wayfinder' }">
            <div class="nav-link" @click="setView('wayfinder')">
              <div class="nav-icon">
                <i class="fas fa-route"></i>
              </div>
              <span>Wayfinder</span>
              <span class="service-subtitle">Navegação</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'mapmaker' }">
            <div class="nav-link" @click="setView('mapmaker')">
              <div class="nav-icon">
                <i class="fas fa-map"></i>
              </div>
              <span>Mapmaker</span>
              <span class="service-subtitle">Mapeamento</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'ledger' }">
            <div class="nav-link" @click="setView('ledger')">
              <div class="nav-icon">
                <i class="fas fa-book"></i>
              </div>
              <span>Ledger</span>
              <span class="service-subtitle">Registros</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'seagull' }">
            <div class="nav-link" @click="setView('seagull')">
              <div class="nav-icon">
                <i class="fas fa-eye"></i>
              </div>
              <span>Seagull</span>
              <span class="service-subtitle">Monitoramento</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'beacon' }">
            <div class="nav-link" @click="setView('beacon')">
              <div class="nav-icon">
                <i class="fas fa-broadcast-tower"></i>
              </div>
              <span>Beacon</span>
              <span class="service-subtitle">Sinalização</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'dock' }">
            <div class="nav-link" @click="setView('dock')">
              <div class="nav-icon">
                <i class="fas fa-anchor"></i>
              </div>
              <span>Dock</span>
              <span class="service-subtitle">Conectividade</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'guardian' }">
            <div class="nav-link" @click="setView('guardian')">
              <div class="nav-icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <span>Guardian</span>
              <span class="service-subtitle">Segurança</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'echo' }">
            <div class="nav-link" @click="setView('echo')">
              <div class="nav-icon">
                <i class="fas fa-comments"></i>
              </div>
              <span>Echo</span>
              <span class="service-subtitle">Comunicação</span>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Main content -->
      <main class="canonika-main">
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
            <h1>Dashboard Canonika</h1>
            <p>Visão geral da plataforma</p>
          </div>
          
          <div class="dashboard-grid">
            <!-- Status dos Serviços -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Status dos Serviços</h3>
                <div class="card-icon">
                  <i class="fas fa-server"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="service-status-list">
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Tollgate</span>
                    <span class="service-port">7732</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Quartermaster</span>
                    <span class="service-port">7725</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Skipper</span>
                    <span class="service-port">7722</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Wayfinder</span>
                    <span class="service-port">7723</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Mapmaker</span>
                    <span class="service-port">7724</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estatísticas -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Estatísticas</h3>
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value">12</div>
                    <div class="stat-label">Serviços Ativos</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">1,247</div>
                    <div class="stat-label">Requisições Hoje</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">99.8%</div>
                    <div class="stat-label">Uptime</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">45ms</div>
                    <div class="stat-label">Latência Média</div>
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
                  <button @click="setView('tollgate')" class="quick-action-btn">
                    <i class="fas fa-coins"></i>
                    Ver Créditos
                  </button>
                  <button @click="setView('quartermaster')" class="quick-action-btn">
                    <i class="fas fa-users"></i>
                    Gerenciar Usuários
                  </button>
                  <button @click="setView('skipper')" class="quick-action-btn">
                    <i class="fas fa-chart-line"></i>
                    Análise de Dados
                  </button>
                  <button @click="setView('wayfinder')" class="quick-action-btn">
                    <i class="fas fa-route"></i>
                    Navegação
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
                      <i class="fas fa-coins"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Créditos adicionados</div>
                      <div class="activity-time">2 minutos atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-users"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Novo usuário registrado</div>
                      <div class="activity-time">15 minutos atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Análise concluída</div>
                      <div class="activity-time">1 hora atrás</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Views -->
        <div v-else class="service-container">
          <div class="service-header">
            <h1>{{ getServiceTitle() }}</h1>
            <p>{{ getServiceDescription() }}</p>
          </div>
          
          <div class="service-content">
            <div class="service-iframe-container">
              <iframe 
                :src="getServiceUrl()" 
                class="service-iframe"
                frameborder="0"
                allowfullscreen
              ></iframe>
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
        email: '',
        password: ''
      },
      error: null,
      currentView: 'dashboard'
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
        'tollgate': 'Tollgate - Sistema de Créditos',
        'quartermaster': 'Quartermaster - Gestão de Usuários',
        'skipper': 'Skipper - Análise de Dados',
        'wayfinder': 'Wayfinder - Navegação Inteligente',
        'mapmaker': 'Mapmaker - Mapeamento de Dados',
        'ledger': 'Ledger - Registros e Contabilidade',
        'seagull': 'Seagull - Monitoramento',
        'beacon': 'Beacon - Sinalização',
        'dock': 'Dock - Conectividade',
        'guardian': 'Guardian - Segurança',
        'echo': 'Echo - Comunicação'
      };
      return titles[this.currentView] || 'Serviço';
    },
    
    getServiceDescription() {
      const descriptions = {
        'tollgate': 'Controle de créditos e consumo da plataforma',
        'quartermaster': 'Gestão de usuários e permissões',
        'skipper': 'Análise avançada de dados e insights',
        'wayfinder': 'Navegação inteligente e roteamento',
        'mapmaker': 'Mapeamento e visualização de dados',
        'ledger': 'Registros e contabilidade da plataforma',
        'seagull': 'Monitoramento e observabilidade',
        'beacon': 'Sinalização e comunicação',
        'dock': 'Conectividade e integração',
        'guardian': 'Segurança e proteção',
        'echo': 'Comunicação e mensageria'
      };
      return descriptions[this.currentView] || 'Descrição do serviço';
    },
    
    getServiceUrl() {
      const ports = {
        'tollgate': '7732',
        'quartermaster': '7725',
        'skipper': '7722',
        'wayfinder': '7723',
        'mapmaker': '7724',
        'ledger': '7726',
        'seagull': '7727',
        'beacon': '7728',
        'dock': '7729',
        'guardian': '7730',
        'echo': '7731'
      };
      
      const port = ports[this.currentView];
      if (port) {
        return `http://localhost:${port}/web/`;
      }
      return '';
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

/* Main Container */
.main-container {
  display: flex;
  min-height: calc(100vh - 80px);
}

/* Sidebar */
.canonika-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  border-right: 1px solid #475569;
  padding: 2rem 0;
  overflow-y: auto;
}

.sidebar-header {
  padding: 0 2rem 1rem;
  border-bottom: 1px solid #475569;
  margin-bottom: 1rem;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0.25rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #e2e8f0;
}

.nav-item.active .nav-link {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-right: 3px solid #10b981;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.service-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-left: auto;
}

/* Main Content */
.canonika-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
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

/* Service Container */
.service-container {
  height: 100%;
}

.service-header {
  margin-bottom: 2rem;
}

.service-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.service-header p {
  color: #94a3b8;
  margin: 0;
}

.service-content {
  height: calc(100vh - 200px);
}

.service-iframe-container {
  height: 100%;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #475569;
}

.service-iframe {
  width: 100%;
  height: 100%;
  border: none;
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

/* Responsive */
@media (max-width: 768px) {
  .canonika-sidebar {
    width: 100%;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .canonika-sidebar.open {
    transform: translateX(0);
  }
  
  .canonika-main {
    padding: 1rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
