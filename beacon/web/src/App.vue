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
                    <i class="fas fa-code"></i>
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
        <!-- Router View -->
        <div class="router-container">
          <router-view />
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
      user: {
        id: 'admin-001',
        name: 'Administrador Canonika',
        email: 'admin@canonika.io',
        roles: ['canonika_admin']
      },
      sidebarCollapsed: false,
      isAuthenticated: true
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    handleNavClick() {
      console.log('Navegação clicada')
    },
    
    logout() {
      console.log('🚪 Logout do Beacon - Modo Demo')
      // Por enquanto, apenas recarrega a página
      window.location.reload()
    }
  },
  
  mounted() {
    console.log('🚀 BEACON APP CARREGADO - Modo Demo (Sem Autenticação)')
  }
}
</script>

<style scoped>
/* Reset e base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.canonika-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.canonika-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid #475569;
  position: relative;
  overflow: hidden;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 100%;
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
  animation: rotate 10s linear infinite;
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1rem;
  height: 1rem;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.1em;
  margin: 0;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.logout-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 0.5rem;
  border: 1px solid #475569;
  font-size: 0.875rem;
}

.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: pulse 2s infinite;
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
  opacity: 0.5;
}

/* Layout principal */
.canonika-layout {
  display: flex;
  min-height: calc(100vh - 60px);
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-right: 1px solid #475569;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #475569;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e2e8f0;
  font-weight: 600;
}

.sidebar-brand i {
  font-size: 1.25rem;
  color: #3b82f6;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
}

.section-header {
  padding: 0 1.5rem 0.75rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.nav {
  list-style: none;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0 0.5rem 0.5rem 0;
  margin-right: 1rem;
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-link:hover .nav-icon {
  background: #3b82f6;
  color: white;
}

.nav-link.router-link-active .nav-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-text {
  flex: 1;
}

.nav-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.service-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.nav-link.router-link-active .service-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #475569;
}

.sidebar-footer .user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sidebar-footer .user-avatar {
  width: 2rem;
  height: 2rem;
  font-size: 0.875rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details .user-name {
  font-size: 0.875rem;
  font-weight: 600;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
}

/* Main Content */
.main-content {
  flex: 1;
  background: #0f172a;
  overflow-y: auto;
  position: relative;
}

.main-content.sidebar-collapsed {
  margin-left: -200px;
}

/* Router Container */
.router-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Responsividade */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 50;
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .router-container {
    padding: 1rem;
  }
}

/* Animações */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.router-container {
  animation: fadeIn 0.3s ease;
}
</style> 