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
              <div class="module-icon icon-guardian"></div>
              <span class="logo-subtitle">GUARDIAN</span>
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
              <button @click="openKeycloakAccount" class="account-btn">
                <i class="fas fa-user-cog"></i>
                Conta
              </button>
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
      <!-- Sidebar futurista -->
      <nav class="canonika-sidebar">
        <div class="sidebar-header">
          <div class="nav-icon active">
            <i class="nav-dot"></i>
            <span>SEGURANÇA</span>
          </div>
        </div>
        <ul class="nav-menu">
          <li class="nav-item" :class="{ active: currentView === 'dashboard' }">
            <div class="nav-link" @click="setView('dashboard')">
              <div class="nav-icon">
                <i class="fas fa-tachometer-alt"></i>
              </div>
              <div class="nav-text">
                <span class="nav-title">Dashboard</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'keycloak-admin' }">
            <div class="nav-link" @click="setView('keycloak-admin')">
              <div class="nav-icon">
                <i class="fas fa-users-cog"></i>
              </div>
              <div class="nav-text">
                <span class="nav-title">Keycloak Admin</span>
                <span class="service-subtitle">Gestão de Usuários</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'autenticacao' }">
            <div class="nav-link" @click="setView('autenticacao')">
              <div class="nav-icon">
                <i class="fas fa-key"></i>
              </div>
              <div class="nav-text">
                <span class="nav-title">Autenticação</span>
                <span class="service-subtitle">Login & MFA</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'autorizacao' }">
            <div class="nav-link" @click="setView('autorizacao')">
              <div class="nav-icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <div class="nav-text">
                <span class="nav-title">Autorização</span>
                <span class="service-subtitle">OPA & Políticas</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'sessoes' }">
            <div class="nav-link" @click="setView('sessoes')">
              <div class="nav-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="nav-text">
                <span class="nav-title">Sessões</span>
                <span class="service-subtitle">Controle Ativo</span>
              </div>
            </div>
          </li>
          <li class="nav-item" :class="{ active: currentView === 'auditoria' }">
            <div class="nav-link" @click="setView('auditoria')">
              <div class="nav-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="nav-text">
                <span class="nav-title">Auditoria</span>
                <span class="service-subtitle">Logs & Relatórios</span>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Conteúdo principal -->
      <main class="canonika-main">
        <!-- Dashboard -->
        <div v-if="currentView === 'dashboard'" class="canonika-view">
          <div class="view-header">
            <h2 class="view-title">Dashboard de Segurança</h2>
            <p class="view-subtitle">Monitoramento centralizado do sistema de segurança Canonika</p>
          </div>
          
          <div class="dashboard-grid">
            <!-- Status dos Serviços -->
            <div class="canonika-card">
              <div class="card-header">
                <h3 class="card-title">Status dos Serviços</h3>
                <div class="card-actions">
                  <button @click="refreshStatus" class="canonika-btn canonika-btn-secondary">
                    <i class="fas fa-sync-alt"></i>
                    Atualizar
                  </button>
                </div>
              </div>
              <div class="card-content">
                <div class="service-status-grid">
                  <div class="service-status" v-for="service in serviceStatus" :key="service.name">
                    <div class="status-icon" :class="service.status">
                      <i :class="service.icon"></i>
                    </div>
                    <div class="status-info">
                      <span class="service-name">{{ service.name }}</span>
                      <span class="status-text">{{ service.statusText }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações Rápidas -->
            <div class="canonika-card">
              <div class="card-header">
                <h3 class="card-title">Ações Rápidas</h3>
              </div>
              <div class="card-content">
                <div class="quick-actions">
                  <button @click="openKeycloakAdmin" class="canonika-btn canonika-btn-primary">
                    <i class="fas fa-users-cog"></i>
                    Keycloak Admin
                  </button>
                  <button @click="openKeycloakAccount" class="canonika-btn canonika-btn-secondary">
                    <i class="fas fa-user-cog"></i>
                    Minha Conta
                  </button>
                  <button @click="openOPAPolicies" class="canonika-btn canonika-btn-secondary">
                    <i class="fas fa-shield-alt"></i>
                    Políticas OPA
                  </button>
                  <button @click="openAuditLogs" class="canonika-btn canonika-btn-secondary">
                    <i class="fas fa-file-alt"></i>
                    Logs de Auditoria
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Keycloak Admin -->
        <div v-if="currentView === 'keycloak-admin'" class="canonika-view">
          <div class="view-header">
            <h2 class="view-title">Keycloak Admin Console</h2>
            <p class="view-subtitle">Gestão centralizada de usuários, grupos e permissões</p>
          </div>
          
          <div class="keycloak-admin-container">
            <div class="admin-actions">
              <button @click="openKeycloakAdmin" class="canonika-btn canonika-btn-primary">
                <i class="fas fa-external-link-alt"></i>
                Abrir Admin Console
              </button>
              <button @click="openKeycloakAccount" class="canonika-btn canonika-btn-secondary">
                <i class="fas fa-user-cog"></i>
                Account Console
              </button>
            </div>
            
            <div class="admin-info">
              <div class="info-card">
                <h4>URL do Admin Console</h4>
                <p>http://localhost:8080/admin</p>
                <p><strong>Credenciais:</strong> admin / admin123</p>
                <p><strong>Realm:</strong> canonika</p>
                <p><strong>Usuário Canonika:</strong> admin@canonika.io</p>
              </div>
              <div class="info-card">
                <h4>Funcionalidades Disponíveis</h4>
                <ul>
                  <li>Gestão de usuários e grupos</li>
                  <li>Configuração de roles e permissões</li>
                  <li>Gerenciamento de clientes (apps)</li>
                  <li>Controle de sessões ativas</li>
                  <li>Configuração de políticas de segurança</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Autenticação -->
        <div v-if="currentView === 'autenticacao'" class="canonika-view">
          <div class="view-header">
            <h2 class="view-title">Sistema de Autenticação</h2>
            <p class="view-subtitle">Configuração e monitoramento de login, MFA e segurança</p>
          </div>
          
          <div class="auth-container">
            <div class="canonika-card">
              <div class="card-header">
                <h3 class="card-title">Métodos de Autenticação</h3>
              </div>
              <div class="card-content">
                <div class="auth-method" v-for="method in authMethods" :key="method.name">
                  <div class="method-icon">
                    <i :class="method.icon"></i>
                  </div>
                  <div class="method-info">
                    <span class="method-name">{{ method.name }}</span>
                    <span class="method-status" :class="method.status">{{ method.statusText }}</span>
                  </div>
                  <button @click="toggleAuthMethod(method)" class="canonika-btn canonika-btn-small">
                    {{ method.status === 'enabled' ? 'Desativar' : 'Ativar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Autorização -->
        <div v-if="currentView === 'autorizacao'" class="canonika-view">
          <div class="view-header">
            <h2 class="view-title">Sistema de Autorização</h2>
            <p class="view-subtitle">Políticas OPA e controle de acesso granular</p>
          </div>
          
          <div class="authorization-container">
            <div class="canonika-card">
              <div class="card-header">
                <h3 class="card-title">Políticas OPA</h3>
                <div class="card-actions">
                  <button @click="openOPAPolicies" class="canonika-btn canonika-btn-secondary">
                    <i class="fas fa-external-link-alt"></i>
                    Abrir OPA
                  </button>
                </div>
              </div>
              <div class="card-content">
                <div class="policy-status">
                  <div class="status-item">
                    <span class="status-label">Status OPA:</span>
                    <span class="status-value online">Online</span>
                  </div>
                  <div class="status-item">
                    <span class="status-label">Políticas Carregadas:</span>
                    <span class="status-value">{{ opaStats.loadedPolicies }}</span>
                  </div>
                  <div class="status-item">
                    <span class="status-label">Decisões/Minuto:</span>
                    <span class="status-value">{{ opaStats.decisionsPerMinute }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sessões -->
        <div v-if="currentView === 'sessoes'" class="canonika-view">
          <div class="view-header">
            <h2 class="view-title">Controle de Sessões</h2>
            <p class="view-subtitle">Monitoramento e gestão de sessões ativas</p>
          </div>
          
          <div class="sessions-container">
            <div class="canonika-card">
              <div class="card-header">
                <h3 class="card-title">Sessões Ativas</h3>
                <div class="card-actions">
                  <button @click="refreshSessions" class="canonika-btn canonika-btn-secondary">
                    <i class="fas fa-sync-alt"></i>
                    Atualizar
                  </button>
                </div>
              </div>
              <div class="card-content">
                <div class="sessions-list">
                  <div class="session-item" v-for="session in activeSessions" :key="session.id">
                    <div class="session-info">
                      <div class="session-user">
                        <div class="user-avatar small">
                          <span>{{ session.user.charAt(0).toUpperCase() }}</span>
                        </div>
                        <span class="user-name">{{ session.user }}</span>
                      </div>
                      <div class="session-details">
                        <span class="session-ip">{{ session.ip }}</span>
                        <span class="session-time">{{ session.lastActivity }}</span>
                      </div>
                    </div>
                    <div class="session-actions">
                      <button @click="terminateSession(session.id)" class="canonika-btn canonika-btn-danger canonika-btn-small">
                        <i class="fas fa-times"></i>
                        Encerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Auditoria -->
        <div v-if="currentView === 'auditoria'" class="canonika-view">
          <div class="view-header">
            <h2 class="view-title">Logs de Auditoria</h2>
            <p class="view-subtitle">Monitoramento de atividades e eventos de segurança</p>
          </div>
          
          <div class="audit-container">
            <div class="canonika-card">
              <div class="card-header">
                <h3 class="card-title">Eventos Recentes</h3>
                <div class="card-actions">
                  <button @click="openAuditLogs" class="canonika-btn canonika-btn-secondary">
                    <i class="fas fa-external-link-alt"></i>
                    Ver Todos
                  </button>
                </div>
              </div>
              <div class="card-content">
                <div class="audit-events">
                  <div class="event-item" v-for="event in auditEvents" :key="event.id" :class="event.level">
                    <div class="event-icon">
                      <i :class="event.icon"></i>
                    </div>
                    <div class="event-content">
                      <div class="event-header">
                        <span class="event-service">{{ event.service }}</span>
                        <span class="event-time">{{ event.timestamp }}</span>
                      </div>
                      <div class="event-message">{{ event.message }}</div>
                      <div class="event-details">
                        <span class="event-user">{{ event.user }}</span>
                        <span class="event-ip">{{ event.ip }}</span>
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
  name: 'GuardianApp',
  data() {
    return {
      user: {
        name: 'Administrador Canonika',
        email: 'admin@canonika.io',
        roles: ['canonika_admin', 'security_admin']
      },
      currentView: 'dashboard',
      
      // Status dos serviços
      serviceStatus: [
        { name: 'Keycloak', status: 'online', statusText: 'Online', icon: 'fas fa-users-cog' },
        { name: 'OPA', status: 'online', statusText: 'Online', icon: 'fas fa-shield-alt' },
        { name: 'ClickHouse', status: 'online', statusText: 'Online', icon: 'fas fa-database' },
        { name: 'Redis', status: 'online', statusText: 'Online', icon: 'fas fa-memory' }
      ],
      
      // Métodos de autenticação
      authMethods: [
        { name: 'Login/Password', status: 'enabled', statusText: 'Ativo', icon: 'fas fa-key' },
        { name: 'MFA/TOTP', status: 'enabled', statusText: 'Ativo', icon: 'fas fa-mobile-alt' },
        { name: 'WebAuthn', status: 'disabled', statusText: 'Inativo', icon: 'fas fa-fingerprint' },
        { name: 'SAML', status: 'disabled', statusText: 'Inativo', icon: 'fas fa-exchange-alt' }
      ],
      
      // Estatísticas OPA
      opaStats: {
        loadedPolicies: 15,
        decisionsPerMinute: 245
      },
      
      // Sessões ativas
      activeSessions: [
        { id: 1, user: 'admin', ip: '192.168.1.100', lastActivity: '2 min atrás' },
        { id: 2, user: 'user1', ip: '192.168.1.101', lastActivity: '5 min atrás' },
        { id: 3, user: 'user2', ip: '192.168.1.102', lastActivity: '10 min atrás' }
      ],
      
      // Eventos de auditoria
      auditEvents: [
        { id: 1, level: 'info', service: 'keycloak', message: 'Usuário admin fez login', user: 'admin', ip: '192.168.1.100', timestamp: '2 min atrás', icon: 'fas fa-sign-in-alt' },
        { id: 2, level: 'warn', service: 'opa', message: 'Tentativa de acesso negada', user: 'user1', ip: '192.168.1.101', timestamp: '5 min atrás', icon: 'fas fa-ban' },
        { id: 3, level: 'error', service: 'guardian', message: 'Falha na conexão com OPA', user: 'system', ip: 'localhost', timestamp: '10 min atrás', icon: 'fas fa-exclamation-triangle' }
      ]
    }
  },
  
  methods: {
    setView(view) {
      this.currentView = view
    },
    
    logout() {
      window.location.href = 'http://localhost:8080/auth/realms/canonika/protocol/openid-connect/logout'
    },
    
    openKeycloakAdmin() {
      window.open('http://localhost:8080/admin', '_blank')
    },
    
    openKeycloakAccount() {
      window.open('http://localhost:8080/auth/realms/canonika/account', '_blank')
    },
    
    login() {
      window.location.href = 'http://localhost:8080/auth/realms/canonika/protocol/openid-connect/auth?client_id=guardian&redirect_uri=http://localhost:3705&response_type=code'
    },
    
    openOPAPolicies() {
      window.open('http://localhost:8181', '_blank')
    },
    
    openAuditLogs() {
      window.open('http://localhost:8123', '_blank')
    },
    
    refreshStatus() {
      console.log('Atualizando status dos serviços...')
    },
    
    toggleAuthMethod(method) {
      method.status = method.status === 'enabled' ? 'disabled' : 'enabled'
      method.statusText = method.status === 'enabled' ? 'Ativo' : 'Inativo'
    },
    
    refreshSessions() {
      console.log('Atualizando sessões...')
    },
    
    terminateSession(sessionId) {
      this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId)
    }
  }
}
</script>

<style>
@import './guardian-styles.css';

/* Estilos específicos do Guardian */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.service-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.service-status {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--canonika-card-bg);
  border-radius: 8px;
  border: 1px solid var(--canonika-border);
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
}

.status-icon.online {
  background: var(--canonika-success);
  color: white;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.keycloak-admin-container,
.auth-container,
.authorization-container,
.sessions-container,
.audit-container {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.admin-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-card {
  padding: 1.5rem;
  background: var(--canonika-card-bg);
  border-radius: 8px;
  border: 1px solid var(--canonika-border);
}

.info-card h4 {
  margin-bottom: 1rem;
  color: var(--canonika-primary);
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--canonika-border);
}

.info-card li:last-child {
  border-bottom: none;
}

.auth-method {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--canonika-card-bg);
  border-radius: 8px;
  border: 1px solid var(--canonika-border);
  margin-bottom: 1rem;
}

.method-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--canonika-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.method-info {
  flex: 1;
}

.method-name {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.method-status {
  font-size: 0.9rem;
}

.method-status.enabled {
  color: var(--canonika-success);
}

.method-status.disabled {
  color: var(--canonika-danger);
}

.policy-status {
  display: grid;
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--canonika-border);
}

.status-item:last-child {
  border-bottom: none;
}

.status-value.online {
  color: var(--canonika-success);
}

.sessions-list {
  display: grid;
  gap: 1rem;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--canonika-card-bg);
  border-radius: 8px;
  border: 1px solid var(--canonika-border);
}

.session-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.session-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar.small {
  width: 30px;
  height: 30px;
  font-size: 0.8rem;
}

.session-details {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: var(--canonika-text-secondary);
}

.audit-events {
  display: grid;
  gap: 1rem;
}

.event-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--canonika-card-bg);
  border-radius: 8px;
  border: 1px solid var(--canonika-border);
}

.event-item.info {
  border-left: 4px solid var(--canonika-info);
}

.event-item.warn {
  border-left: 4px solid var(--canonika-warning);
}

.event-item.error {
  border-left: 4px solid var(--canonika-danger);
}

.event-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--canonika-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-content {
  flex: 1;
}

.event-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.event-service {
  font-weight: bold;
  color: var(--canonika-primary);
}

.event-time {
  font-size: 0.9rem;
  color: var(--canonika-text-secondary);
}

.event-message {
  margin-bottom: 0.5rem;
}

.event-details {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--canonika-text-secondary);
}

.account-btn {
  background: var(--canonika-secondary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.account-btn:hover {
  background: var(--canonika-secondary-dark);
}
</style> 