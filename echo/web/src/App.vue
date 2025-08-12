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
              <div class="module-icon icon-echo"></div>
              <span class="logo-subtitle">ECHO</span>
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
          <li class="nav-item" :class="{ active: currentView === 'comunicacao' }">
            <div class="nav-link" @click="setView('comunicacao')">
              <div class="nav-icon">
                <i class="fas fa-comments"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Comunicação</span>
                <span class="service-subtitle">Mensagens</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'eco' }">
            <div class="nav-link" @click="setView('eco')">
              <div class="nav-icon">
                <i class="fas fa-volume-up"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Eco</span>
                <span class="service-subtitle">Respostas</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'transmissao' }">
            <div class="nav-link" @click="setView('transmissao')">
              <div class="nav-icon">
                <i class="fas fa-broadcast-tower"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Transmissão</span>
                <span class="service-subtitle">Difusão</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'audio' }">
            <div class="nav-link" @click="setView('audio')">
              <div class="nav-icon">
                <i class="fas fa-headphones"></i>
              </div>
              <div v-if="!sidebarCollapsed" class="nav-text">
                <span class="nav-title">Áudio</span>
                <span class="service-subtitle">Processamento</span>
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
            <h1>Dashboard Echo</h1>
            <p>Sistema de comunicação e eco inteligente</p>
          </div>
          
          <div class="dashboard-grid">
            <!-- Status dos Serviços -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Status do Sistema</h3>
                <div class="card-icon">
                  <i class="fas fa-satellite"></i>
                </div>
              </div>
              <div class="card-content">
                <div class="service-status-list">
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Comunicação</span>
                    <span class="service-port">ATIVO</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Processamento de Áudio</span>
                    <span class="service-port">ATIVO</span>
                  </div>
                  <div class="service-status online">
                    <span class="status-dot"></span>
                    <span class="service-name">Sistema de Eco</span>
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
                    <div class="stat-value">1,456</div>
                    <div class="stat-label">Mensagens</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">847</div>
                    <div class="stat-label">Ecos Processados</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">99.2%</div>
                    <div class="stat-label">Taxa de Sucesso</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">89ms</div>
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
                  <button @click="setView('comunicacao')" class="quick-action-btn">
                    <i class="fas fa-comments"></i>
                    Comunicação
                  </button>
                  <button @click="setView('eco')" class="quick-action-btn">
                    <i class="fas fa-volume-up"></i>
                    Sistema de Eco
                  </button>
                  <button @click="setView('transmissao')" class="quick-action-btn">
                    <i class="fas fa-broadcast-tower"></i>
                    Transmissão
                  </button>
                  <button @click="setView('audio')" class="quick-action-btn">
                    <i class="fas fa-headphones"></i>
                    Processamento
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
                      <i class="fas fa-message"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Nova mensagem processada</div>
                      <div class="activity-time">15 segundos atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-volume-up"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Eco gerado com sucesso</div>
                      <div class="activity-time">1 minuto atrás</div>
                    </div>
                  </div>
                  <div class="activity-item">
                    <div class="activity-icon">
                      <i class="fas fa-broadcast-tower"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">Transmissão iniciada</div>
                      <div class="activity-time">3 minutos atrás</div>
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
                      <i class="fas fa-comments"></i>
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
        'comunicacao': 'Comunicação',
        'eco': 'Sistema de Eco',
        'transmissao': 'Transmissão',
        'audio': 'Processamento de Áudio'
      };
      return titles[this.currentView] || 'Echo';
    },
    
    getServiceDescription() {
      const descriptions = {
        'comunicacao': 'Gestão de comunicação e mensagens',
        'eco': 'Sistema inteligente de eco e respostas',
        'transmissao': 'Controle de transmissão e difusão',
        'audio': 'Processamento avançado de áudio'
      };
      return descriptions[this.currentView] || 'Sistema de comunicação e eco inteligente';
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

