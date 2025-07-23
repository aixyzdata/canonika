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
            <span class="logo-subtitle">QUARTERMASTER</span>
          </div>
        </div>
        <div class="header-actions">
          <div v-if="user" class="user-menu">
            <div class="user-info" @click="toggleUserMenu" style="cursor: pointer;">
              <div class="user-avatar">
                <div class="avatar-ring"></div>
                <span>{{ user.name.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="user-name">{{ user.name }}</span>
              <div class="user-dropdown-icon">▼</div>
            </div>
            
            <div v-if="showUserMenu" class="user-dropdown">
                          <div class="dropdown-item" @click="setView('profile')">
              <span>👤 Perfil</span>
            </div>
            <div class="dropdown-item" @click="setView('settings')">
              <span>⚙️ Configurações</span>
            </div>
            <div class="dropdown-item" @click="testNavigation()">
              <span>🧪 Teste Navegação</span>
            </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item" @click="logout">
                <span>🚪 Sair</span>
              </div>
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
            <span>GESTÃO</span>
          </div>
        </div>
        <ul class="nav-menu">
          <li class="nav-item" :class="{ active: currentView === 'dashboard' }">
            <div class="nav-link" @click="setView('dashboard')">
              <div class="nav-icon">
                <div class="icon-hex"></div>
              </div>
              <span>Dashboard</span>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'users' }">
            <div class="nav-link" @click="setView('users')">
              <div class="nav-icon">
                <div class="icon-hex"></div>
              </div>
              <span>Usuários</span>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Main content -->
      <main class="canonika-main">
        <div v-if="!user" class="login-container">
          <div class="login-card">
            <div class="login-header">
              <div class="login-logo">
                <div class="logo-hexagon-large"></div>
                <div class="logo-pulse-large"></div>
              </div>
              <h2 class="login-title">Acesso ao Sistema</h2>
              <p class="login-subtitle">Entre com suas credenciais para acessar o Quartermaster</p>
            </div>
            
            <form @submit.prevent="login" class="login-form">
              <div class="form-group">
                <div class="input-container">
                  <div class="input-icon">
                    <div class="icon-hex-small"></div>
                  </div>
                  <input 
                    v-model="loginForm.email" 
                    class="form-input" 
                    placeholder="E-mail"
                    type="email"
                    required 
                    autocomplete="email"
                    spellcheck="false"
                    data-testid="email-input"
                  />
                  <div class="input-glow"></div>
                </div>
              </div>
              
              <div class="form-group">
                <div class="input-container">
                  <div class="input-icon">
                    <div class="icon-hex-small"></div>
                  </div>
                  <input 
                    v-model="loginForm.password" 
                    type="password" 
                    class="form-input" 
                    placeholder="Senha"
                    required 
                    autocomplete="current-password"
                    spellcheck="false"
                    data-testid="password-input"
                  />
                  <div class="input-glow"></div>
                </div>
              </div>
              
              <button class="login-button" type="submit">
                <span class="button-text">ENTRAR</span>
                <div class="button-glow"></div>
              </button>
              
              <div v-if="error" class="error-message">
                <div class="error-icon">⚠</div>
                <span>{{ error }}</span>
              </div>
            </form>
          </div>
        </div>

        <div v-else class="dashboard-container">
          <!-- Dashboard View -->
          <div v-if="currentView === 'dashboard'" class="dashboard-view">
            <div class="dashboard-header">
              <h2 class="dashboard-title">Dashboard</h2>
              <div class="dashboard-stats">
                <div class="stat-card">
                  <div class="stat-icon">
                    <div class="icon-hex"></div>
                  </div>
                  <div class="stat-content">
                    <span class="stat-value">{{ stats.users }}</span>
                    <span class="stat-label">Usuários</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">
                    <div class="icon-hex"></div>
                  </div>
                  <div class="stat-content">
                    <span class="stat-value">{{ stats.roles }}</span>
                    <span class="stat-label">Roles</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">
                    <div class="icon-hex"></div>
                  </div>
                  <div class="stat-content">
                    <span class="stat-value">{{ stats.tokens }}</span>
                    <span class="stat-label">Tokens API</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="dashboard-content">
              <div class="welcome-message">
                <h3>Bem-vindo ao Quartermaster!</h3>
                <p>Sistema de gestão de usuários e controle de acesso da plataforma Canonika.</p>
              </div>
            </div>
          </div>

          <!-- Users View -->
          <div v-if="currentView === 'users'" class="users-view">
            <div class="view-header">
              <h2 class="view-title">Gestão de Usuários</h2>
              <div class="view-tabs">
                <button 
                  class="tab-button" 
                  :class="{ active: userSubView === 'list' }"
                  @click="setUserSubView('list')"
                >
                  👥 Usuários
                </button>
                <button 
                  class="tab-button" 
                  :class="{ active: userSubView === 'roles' }"
                  @click="setUserSubView('roles')"
                >
                  🛡️ Roles
                </button>
                <button 
                  class="tab-button" 
                  :class="{ active: userSubView === 'tokens' }"
                  @click="setUserSubView('tokens')"
                >
                  🔑 Tokens API
                </button>
                <button 
                  class="tab-button" 
                  :class="{ active: userSubView === 'audit' }"
                  @click="setUserSubView('audit')"
                >
                  📊 Auditoria
                </button>
                <button 
                  class="tab-button" 
                  :class="{ active: userSubView === 'credits' }"
                  @click="setUserSubView('credits')"
                >
                  💰 Créditos
                </button>
              </div>
            </div>
            
            <!-- Users List -->
            <div v-if="userSubView === 'list'" class="content-card">
              <div class="card-header">
                <h3>Lista de Usuários</h3>
                <button class="action-button" @click="showCreateUser = true">
                  <span>+ Novo Usuário</span>
                </button>
              </div>
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Status</th>
                      <th>Roles</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span :class="['status-badge', user.is_active ? 'active' : 'inactive']">
                          {{ user.is_active ? 'Ativo' : 'Inativo' }}
                        </span>
                      </td>
                      <td>{{ user.roles ? user.roles.join(', ') : 'N/A' }}</td>
                      <td>
                        <button class="table-action">Editar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Roles -->
            <div v-if="userSubView === 'roles'" class="content-card">
              <div class="card-header">
                <h3>Gestão de Roles</h3>
                <button class="action-button" @click="showCreateRole = true">
                  <span>+ Nova Role</span>
                </button>
              </div>
              <div class="roles-grid">
                <div v-for="role in roles" :key="role.id" class="role-card">
                  <div class="role-header">
                    <h3>{{ role.name }}</h3>
                    <span :class="['status-badge', role.is_active ? 'active' : 'inactive']">
                      {{ role.is_active ? 'Ativo' : 'Inativo' }}
                    </span>
                  </div>
                  <p class="role-description">{{ role.description }}</p>
                  <div class="role-permissions">
                    <h4>Permissões:</h4>
                    <div class="permissions-list">
                      <span v-for="perm in (role.permissions || [])" :key="perm" class="permission-tag">
                        {{ perm }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tokens -->
            <div v-if="userSubView === 'tokens'" class="content-card">
              <div class="card-header">
                <h3>Tokens de API</h3>
                <button class="action-button" @click="showCreateToken = true">
                  <span>+ Novo Token</span>
                </button>
              </div>
              <div class="tokens-grid">
                <div v-for="token in apiTokens" :key="token.id" class="token-card">
                  <div class="token-header">
                    <h3>{{ token.name }}</h3>
                    <span :class="['status-badge', token.is_active ? 'active' : 'inactive']">
                      {{ token.is_active ? 'Ativo' : 'Inativo' }}
                    </span>
                  </div>
                  <p class="token-description">{{ token.description }}</p>
                  <div class="token-details">
                    <div class="token-scopes">
                      <strong>Escopos:</strong>
                      <div class="scopes-list">
                        <span v-for="scope in (token.scopes || [])" :key="scope" class="scope-tag">
                          {{ scope }}
                        </span>
                      </div>
                    </div>
                    <div class="token-limits">
                      <span>Limite: {{ token.rate_limit_per_day }}/dia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Audit -->
            <div v-if="userSubView === 'audit'" class="content-card">
              <div class="card-header">
                <h3>Logs de Auditoria</h3>
              </div>
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Usuário</th>
                      <th>Ação</th>
                      <th>Módulo</th>
                      <th>IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in auditLogs" :key="log.timestamp">
                      <td>{{ formatDate(log.timestamp) }}</td>
                      <td>{{ log.user_id }}</td>
                      <td>{{ log.action }}</td>
                      <td>{{ log.module }}</td>
                      <td>{{ log.ip_address }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Credits -->
            <div v-if="userSubView === 'credits'" class="content-card">
              <div class="card-header">
                <h3>Uso de Créditos</h3>
              </div>
              <div class="credits-summary">
                <div class="credit-stat">
                  <h3>Total Consumido</h3>
                  <span class="credit-value">{{ creditUsage.total_consumed }}</span>
                </div>
                <div class="credit-chart">
                  <h3>Uso por Módulo</h3>
                  <div class="module-usage">
                    <div v-for="usage in (creditUsage.usage || [])" :key="usage.module" class="usage-item">
                      <span>{{ usage.module }}</span>
                      <span>{{ usage.credits_consumed }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Profile View -->
          <div v-if="currentView === 'profile'" class="profile-view">
            <div class="view-header">
              <h2 class="view-title">Perfil do Usuário</h2>
            </div>
            
            <div class="content-card">
              <div class="profile-info">
                <div class="profile-avatar">
                  <div class="avatar-ring-large"></div>
                  <span>{{ user.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="profile-details">
                  <h3>{{ user.name }}</h3>
                  <p>{{ user.email }}</p>
                  <div class="profile-stats">
                    <div class="stat-item">
                      <span class="stat-label">Status</span>
                      <span :class="['status-badge', user.is_active ? 'active' : 'inactive']">
                        {{ user.is_active ? 'Ativo' : 'Inativo' }}
                      </span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Roles</span>
                      <span>{{ user.roles ? user.roles.join(', ') : 'N/A' }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Último Login</span>
                      <span>{{ formatDate(new Date()) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Settings View -->
          <div v-if="currentView === 'settings'" class="settings-view">
            <div class="view-header">
              <h2 class="view-title">Configurações</h2>
            </div>
            
            <div class="content-card">
              <div class="settings-section">
                <h3>Configurações de Conta</h3>
                <div class="settings-form">
                  <div class="form-group">
                    <label>Nome</label>
                    <input type="text" v-model="user.name" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>E-mail</label>
                    <input type="text" v-model="user.email" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Nova Senha</label>
                    <input type="password" placeholder="Deixe em branco para não alterar" class="form-input" />
                  </div>
                  <button class="action-button">Salvar Alterações</button>
                </div>
              </div>
              
              <div class="settings-section">
                <h3>Preferências</h3>
                <div class="settings-options">
                  <div class="option-item">
                    <label>
                      <input type="checkbox" checked />
                      <span>Notificações por e-mail</span>
                    </label>
                  </div>
                  <div class="option-item">
                    <label>
                      <input type="checkbox" />
                      <span>Modo escuro</span>
                    </label>
                  </div>
                  <div class="option-item">
                    <label>
                      <input type="checkbox" checked />
                      <span>Relatórios automáticos</span>
                    </label>
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
  data() {
    return {
      user: null,
      error: null,
      currentView: 'dashboard',
      loginForm: {
        // TODO: Remover credenciais pré-preenchidas em produção
        email: 'admin@canonika.io',
        password: 'Admin@123'
      },
      users: [],
      roles: [],
      apiTokens: [],
      auditLogs: [],
      creditUsage: { total_consumed: 0, usage: [] },
      stats: { users: 0, roles: 0, tokens: 0 },
      showCreateUser: false,
      showCreateRole: false,
      showCreateToken: false,
      showUserMenu: false,
      userSubView: 'list'
    }
  },
  async mounted() {
    if (localStorage.getItem('token')) {
      await this.loadUserData();
    }
    
    // Garantir que os inputs sejam editáveis
    this.$nextTick(() => {
      const inputs = document.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          input.style.zIndex = '100';
        });
        input.addEventListener('blur', () => {
          input.style.zIndex = '10';
        });
      });
    });
  },
  methods: {
    async login() {
      this.error = null;
      try {
        console.log('Tentando login com:', this.loginForm);
        
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginForm)
        });
        
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log('Error response text:', errorText);
          
          try {
            const error = JSON.parse(errorText);
            throw new Error(error.detail || 'Erro no login');
          } catch (parseError) {
            throw new Error(`Erro no servidor: ${errorText}`);
          }
        }
        
        const responseText = await res.text();
        console.log('Response text:', responseText);
        
        const data = JSON.parse(responseText);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        await this.loadUserData();
      } catch (e) {
        console.error('Login error:', e);
        this.error = e.message;
      }
    },
    
    async loadUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Carregar dados do usuário logado
        const userRes = await fetch('/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (userRes.ok) {
          this.user = await userRes.json();
        }
        
        // Carregar lista de usuários
        const usersRes = await fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (usersRes.ok) {
          const users = await usersRes.json();
          this.users = users;
          this.stats.users = users.length;
        }
        
        // Carregar roles
        const rolesRes = await fetch('/api/roles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (rolesRes.ok) {
          this.roles = await rolesRes.json();
          this.stats.roles = this.roles.length;
        } else {
          // Dados mockados para desenvolvimento
          this.roles = [
            {
              id: 'role-admin',
              name: 'Administrador',
              description: 'Acesso total ao sistema',
              is_active: true,
              permissions: ['*']
            },
            {
              id: 'role-analyst',
              name: 'Analista',
              description: 'Acesso de leitura e análise',
              is_active: true,
              permissions: ['skipper:view', 'wayfinder:view', 'mapmaker:view']
            },
            {
              id: 'role-operator',
              name: 'Operador',
              description: 'Acesso operacional limitado',
              is_active: true,
              permissions: ['skipper:view', 'skipper:create']
            }
          ];
          this.stats.roles = this.roles.length;
        }
        
        // Carregar tokens
        const tokensRes = await fetch('/api/tokens', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (tokensRes.ok) {
          this.apiTokens = await tokensRes.json();
          this.stats.tokens = this.apiTokens.length;
        } else {
          // Dados mockados para desenvolvimento
          this.apiTokens = [
            {
              id: 'token-001',
              name: 'API Token Principal',
              description: 'Token para integração com sistemas externos',
              scopes: ['skipper:read', 'wayfinder:read'],
              is_active: true,
              rate_limit_per_day: 1000
            },
            {
              id: 'token-002',
              name: 'Token de Desenvolvimento',
              description: 'Token para testes e desenvolvimento',
              scopes: ['*'],
              is_active: true,
              rate_limit_per_day: 5000
            }
          ];
          this.stats.tokens = this.apiTokens.length;
        }
        
        // Carregar logs de auditoria
        const logsRes = await fetch('/api/audit-logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (logsRes.ok) {
          this.auditLogs = await logsRes.json();
        } else {
          // Dados mockados para desenvolvimento
          this.auditLogs = [
            {
              timestamp: new Date().toISOString(),
              user_id: 'admin-001',
              action: 'POST /api/auth/login',
              module: 'quartermaster',
              ip_address: '192.168.1.1'
            },
            {
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              user_id: 'admin-001',
              action: 'GET /api/users',
              module: 'quartermaster',
              ip_address: '192.168.1.1'
            }
          ];
        }
        
        // Carregar uso de créditos
        const creditsRes = await fetch('/api/credits/usage', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (creditsRes.ok) {
          this.creditUsage = await creditsRes.json();
        } else {
          // Dados mockados para desenvolvimento
          this.creditUsage = {
            user_id: 'admin-001',
            usage: [
              { module: 'skipper', credits_consumed: 150 },
              { module: 'wayfinder', credits_consumed: 89 },
              { module: 'mapmaker', credits_consumed: 234 }
            ],
            total_consumed: 473
          };
        }
        
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    },
    
    setView(view) {
      console.log('setView chamado com:', view);
      this.currentView = view;
      this.showUserMenu = false; // Fecha o dropdown após clicar
      
      // Inicializar userSubView quando entrar na view de usuários
      if (view === 'users' && !this.userSubView) {
        this.userSubView = 'list';
      }
      
      console.log('currentView agora é:', this.currentView);
      console.log('userSubView agora é:', this.userSubView);
      
      // Forçar re-render
      this.$forceUpdate();
    },
    
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      this.user = null;
      this.users = [];
      this.roles = [];
      this.apiTokens = [];
      this.auditLogs = [];
      this.creditUsage = { total_consumed: 0, usage: [] };
      this.stats = { users: 0, roles: 0, tokens: 0 };
      this.currentView = 'dashboard';
      this.showUserMenu = false;
      this.userSubView = 'list';
    },
    
    toggleUserMenu() {
      console.log('toggleUserMenu chamado, showUserMenu era:', this.showUserMenu);
      this.showUserMenu = !this.showUserMenu;
      console.log('showUserMenu agora é:', this.showUserMenu);
      
      // Forçar re-render
      this.$forceUpdate();
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('pt-BR');
    },
    
    setUserSubView(subView) {
      console.log('setUserSubView chamado com:', subView);
      this.userSubView = subView;
      console.log('userSubView agora é:', this.userSubView);
      
      // Forçar re-render
      this.$forceUpdate();
    },
    
    testNavigation() {
      console.log('=== TESTE DE NAVEGAÇÃO ===');
      console.log('currentView:', this.currentView);
      console.log('userSubView:', this.userSubView);
      console.log('showUserMenu:', this.showUserMenu);
      
      // Testar mudança de view
      this.setView('dashboard');
      setTimeout(() => {
        this.setView('users');
        setTimeout(() => {
          this.setUserSubView('roles');
          console.log('=== TESTE CONCLUÍDO ===');
        }, 1000);
      }, 1000);
    }
  }
}
</script>

<style>
/* Reset e configurações base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: #e2e8f0;
  overflow-x: hidden;
  line-height: 1.5;
}

.canonika-app {
  min-height: 100vh;
  position: relative;
}

/* Header futurista */
.canonika-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  position: relative;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.logo-icon {
  position: relative;
  width: 1.75rem;
  height: 1.75rem;
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

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.05em;
  line-height: 1;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}

.logo-subtitle {
  font-size: 0.625rem;
  color: #3b82f6;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 1;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-info:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.user-avatar {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #ffffff;
  font-size: 0.75rem;
}

.avatar-ring {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  animation: pulse-ring 2s ease-in-out infinite;
}

.user-name {
  font-weight: 500;
  color: #e2e8f0;
  font-size: 0.75rem;
}

.user-dropdown-icon {
  color: #94a3b8;
  font-size: 0.5rem;
  transition: transform 0.2s ease;
}

.user-info:hover .user-dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 180px;
  z-index: 1000;
  margin-top: 0.25rem;
}

.dropdown-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
  user-select: none;
  pointer-events: auto;
  z-index: 1001;
  color: #374151;
  font-size: 0.875rem;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.dropdown-divider {
  height: 1px;
  background: rgba(59, 130, 246, 0.2);
  margin: 0.5rem 0;
}

/* Profile View Styles */
.profile-info {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.avatar-ring-large {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 600;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.profile-details h3 {
  color: #e2e8f0;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.profile-details p {
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.stat-label {
  color: #94a3b8;
  font-weight: 500;
}

/* Settings View Styles */
.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.settings-section h3 {
  color: #e2e8f0;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-form label {
  color: #94a3b8;
  font-weight: 500;
}

.settings-form .form-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #e2e8f0;
  padding: 0.75rem;
  border-radius: 0.375rem;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.option-item label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #e2e8f0;
}

.option-item input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #3b82f6;
}

.logout-button {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  font-weight: 500;
}

.logout-button:hover {
  background: rgba(255, 107, 107, 0.3);
  transform: translateY(-1px);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #10b981;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: blink 1.5s ease-in-out infinite;
}

.status-indicator.online {
  background: #10b981;
}

.header-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  animation: glow 3s ease-in-out infinite;
}

/* Main container */
.main-container {
  display: flex;
  min-height: calc(100vh - 80px);
}

/* Sidebar futurista */
.canonika-sidebar {
  width: 240px;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  padding: 1rem 0;
}

.sidebar-header {
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.nav-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.nav-dot {
  width: 3px;
  height: 3px;
  background: #3b82f6;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

.nav-menu {
  list-style: none;
  padding: 1rem 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
  border-radius: 0.375rem;
  margin: 0 0.5rem 0.1rem;
  font-size: 0.8rem;
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #e2e8f0;
}

.nav-item.active .nav-link {
  background: rgba(59, 130, 246, 0.2);
  color: #ffffff;
  font-weight: 500;
}

.nav-icon {
  width: 16px;
  height: 16px;
  position: relative;
}

.icon-hex {
  width: 100%;
  height: 100%;
  background: #3b82f6;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  opacity: 0.8;
}

/* Main content */
.canonika-main {
  flex: 1;
  padding: 1.25rem;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
}

.view-tabs {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.tab-button {
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.375rem;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.tab-button:hover {
  background: rgba(59, 130, 246, 0.2);
}

.tab-button.active {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.card-header h3 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Login container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
}

.login-card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 1rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.login-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #3b82f6, #1d4ed8, #3b82f6);
  border-radius: 20px;
  z-index: -1;
  animation: borderGlow 3s ease-in-out infinite;
}

.login-header {
  text-align: center;
  margin-bottom: 3rem;
}

.login-logo {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.logo-hexagon-large {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: rotate 8s linear infinite;
}

.logo-pulse-large {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 1rem;
}

.login-subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 400;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  position: relative;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  pointer-events: auto;
}

.input-icon {
  position: absolute;
  left: 1rem;
  z-index: 2;
  pointer-events: none;
}

.icon-hex-small {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  opacity: 0.7;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  position: relative;
  z-index: 10;
  pointer-events: auto;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.form-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  background: linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.form-input:focus + .input-glow {
  opacity: 1;
}

.login-button {
  position: relative;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.login-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-button:hover .button-glow {
  left: 100%;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff6b6b;
  font-size: 0.9rem;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.error-icon {
  font-size: 1.2rem;
}

/* Dashboard */
.dashboard-container {
  width: 100%;
  max-width: none;
  margin: 0;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 2rem;
  height: 2rem;
  position: relative;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.dashboard-content {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.welcome-message h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 1rem;
  font-weight: 600;
}

.welcome-message p {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.5;
}

/* View components */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.action-button {
  background: #3b82f6;
  border: none;
  border-radius: 0.375rem;
  color: #ffffff;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.action-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.content-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Table styles */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  color: #374151;
  background: #ffffff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.data-table tr:hover {
  background: #f9fafb;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-badge.inactive {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.table-action {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.table-action:hover {
  background: rgba(59, 130, 246, 0.3);
}

/* Grid layouts */
.roles-grid,
.tokens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.role-card,
.token-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.role-card:hover,
.token-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
}

.role-header,
.token-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.role-header h3,
.token-header h3 {
  color: #60a5fa;
  font-size: 1.2rem;
}

.role-description,
.token-description {
  color: #94a3b8;
  margin-bottom: 1rem;
}

.permissions-list,
.scopes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.permission-tag,
.scope-tag {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.token-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #94a3b8;
}

/* Credits view */
.credits-summary {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.credit-stat {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.credit-value {
  font-size: 3rem;
  font-weight: 700;
  color: #3b82f6;
  display: block;
  margin-top: 1rem;
}

.module-usage {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.usage-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

/* Animações */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

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

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes glow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes borderGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Responsividade */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .canonika-sidebar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: auto;
    padding: 1rem;
  }
  
  .nav-menu {
    display: flex;
    gap: 1rem;
    padding: 0;
  }
  
  .nav-item {
    margin-bottom: 0;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .canonika-main {
    padding: 1rem;
    margin-bottom: 80px;
    margin-left: 0;
  }
  
  .login-card {
    margin: 1rem;
    padding: 2rem;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .credits-summary {
    grid-template-columns: 1fr;
  }
  
  .roles-grid,
  .tokens-grid {
    grid-template-columns: 1fr;
  }
}
</style>
