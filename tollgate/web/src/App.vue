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
              <div class="module-icon icon-tollgate"></div>
              <span class="logo-subtitle">TOLLGATE</span>
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
          <li class="nav-item" :class="{ active: currentView === 'pedagio' }">
            <div class="nav-link" @click="setView('pedagio')">
              <div class="nav-icon">
                <i class="fas fa-coins"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Pedágio</span>
                <span class="service-subtitle">Cobrança</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'cobranca' }">
            <div class="nav-link" @click="setView('cobranca')">
              <div class="nav-icon">
                <i class="fas fa-cash-register"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Cobrança</span>
                <span class="service-subtitle">Tarifas</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'controle' }">
            <div class="nav-link" @click="setView('controle')">
              <div class="nav-icon">
                <i class="fas fa-traffic-light"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Controle</span>
                <span class="service-subtitle">Acesso</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'relatorios' }">
            <div class="nav-link" @click="setView('relatorios')">
              <div class="nav-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Relatórios</span>
                <span class="service-subtitle">Análises</span>
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
            <h1>Dashboard Tollgate</h1>
            <p>Sistema de pedágio e controle de acesso</p>
          </div>
          
          <div class="dashboard-grid">
            <!-- Status dos Serviços -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Status do Sistema</h3>
                <div class="card-icon">
                  <i class="fas fa-traffic-light"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="service-status-list">
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Cobrança</span>
                    <span class="service-port">ATIVO</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Controle de Acesso</span>
                    <span class="service-port">ATIVO</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Processamento</span>
                    <span class="service-port">ATIVO</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estatísticas -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Estatísticas de Hoje</h3>
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value">2,847</div>
                    <div class="stat-label">Passagens</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">R$ 18,451</div>
                    <div class="stat-label">Arrecadação</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">98.7%</div>
                    <div class="stat-label">Taxa de Sucesso</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">156ms</div>
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
                  <button @click="setView('pedagio')" class="quick-action-btn">
                    <i class="fas fa-coins"></i>
                    Ver Pedágio
                  </button>
                  <button @click="setView('cobranca')" class="quick-action-btn">
                    <i class="fas fa-cash-register"></i>
                    Configurar Tarifas
                  </button>
                  <button @click="setView('controle')" class="quick-action-btn">
                    <i class="fas fa-traffic-light"></i>
                    Controle de Acesso
                  </button>
                  <button @click="setView('relatorios')" class="quick-action-btn">
                    <i class="fas fa-chart-line"></i>
                    Relatórios
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
                      <i class="fas fa-car"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Passagem registrada - R$ 8,50</div>
                      <div class="activity-time">30 segundos atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-truck"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Caminhão processado - R$ 15,00</div>
                      <div class="activity-time">2 minutos atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Falha no pagamento detectada</div>
                      <div class="activity-time">5 minutos atrás</div>
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
          
          <!-- Default Service View -->
          <div class="service-view">
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
            
            <div class="view-content">
              <div class="service-cards">
                <div class="service-card">
                  <div class="card-header">
                    <h3>{{ getServiceTitle() }}</h3>
                    <div class="card-icon">
                      <i class="fas fa-coins"></i>
                    </div>
                  </div>
                  <div class="card-content">
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
        'pedagio': 'Pedágio',
        'cobranca': 'Cobrança',
        'controle': 'Controle de Acesso',
        'relatorios': 'Relatórios'
      };
      return titles[this.currentView] || 'Tollgate';
    },
    
    getServiceDescription() {
      const descriptions = {
        'pedagio': 'Gestão de pedágio e passagens',
        'cobranca': 'Configuração de tarifas e cobrança',
        'controle': 'Controle de acesso e segurança',
        'relatorios': 'Relatórios e análises de tráfego'
      };
      return descriptions[this.currentView] || 'Sistema de pedágio e controle de acesso';
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

