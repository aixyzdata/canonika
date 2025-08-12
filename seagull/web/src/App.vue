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
              <div class="module-icon icon-seagull"></div>
              <span class="logo-subtitle">SEAGULL</span>
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
          <li class="nav-item" :class="{ active: currentView === 'monitoramento' }">
            <div class="nav-link" @click="setView('monitoramento')">
              <div class="nav-icon">
                <i class="fas fa-desktop"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Monitoramento</span>
                <span class="service-subtitle">Sistemas</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'vigilancia' }">
            <div class="nav-link" @click="setView('vigilancia')">
              <div class="nav-icon">
                <i class="fas fa-eye"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Vigilância</span>
                <span class="service-subtitle">Observação</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'alertas' }">
            <div class="nav-link" @click="setView('alertas')">
              <div class="nav-icon">
                <i class="fas fa-bell"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Alertas</span>
                <span class="service-subtitle">Notificações</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'logs' }">
            <div class="nav-link" @click="setView('logs')">
              <div class="nav-icon">
                <i class="fas fa-list-alt"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Logs</span>
                <span class="service-subtitle">Registros</span>
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
            <h1>Seagull Dashboard</h1>
            <p>Sistema de monitoramento e vigilância</p>
          </div>
          
          <div class="dashboard-grid">
            <!-- Status do Sistema -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Status do Sistema</h3>
                <div class="card-icon">
                  <i class="fas fa-eye"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="service-status-list">
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Monitor Principal</span>
                    <span class="service-port">Ativo</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Sistema de Vigilância</span>
                    <span class="service-port">Conectado</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Processador de Alertas</span>
                    <span class="service-port">Executando</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estatísticas de Monitoramento -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Estatísticas de Monitoramento</h3>
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value">342</div>
                    <div class="stat-label">Eventos Hoje</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">18</div>
                    <div class="stat-label">Alertas Ativos</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">97.8%</div>
                    <div class="stat-label">Uptime</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">2.1s</div>
                    <div class="stat-label">Tempo Resposta</div>
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
                  <button @click="setView('monitoramento')" class="quick-action-btn">
                    <i class="fas fa-desktop"></i>
                    Monitor Sistemas
                  </button>
                  <button @click="setView('vigilancia')" class="quick-action-btn">
                    <i class="fas fa-eye"></i>
                    Vigilância Ativa
                  </button>
                  <button @click="setView('alertas')" class="quick-action-btn">
                    <i class="fas fa-bell"></i>
                    Ver Alertas
                  </button>
                  <button @click="setView('logs')" class="quick-action-btn">
                    <i class="fas fa-list-alt"></i>
                    Consultar Logs
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
                      <i class="fas fa-bell"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Novo alerta gerado</div>
                      <div class="activity-time">1 minuto atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-eye"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Evento de vigilância detectado</div>
                      <div class="activity-time">4 minutos atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-desktop"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Sistema monitorado atualizado</div>
                      <div class="activity-time">9 minutos atrás</div>
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
        'monitoramento': 'Sistema de Monitoramento',
        'vigilancia': 'Vigilância Ativa',
        'alertas': 'Central de Alertas',
        'logs': 'Sistema de Logs'
      };
      return titles[this.currentView] || 'Seagull';
    },
    
    getServiceDescription() {
      const descriptions = {
        'monitoramento': 'Monitoramento em tempo real de sistemas e recursos',
        'vigilancia': 'Vigilância ativa e detecção de anomalias',
        'alertas': 'Gerenciamento e configuração de alertas',
        'logs': 'Visualização e análise de logs do sistema'
      };
      return descriptions[this.currentView] || 'Sistema de monitoramento e vigilância';
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

