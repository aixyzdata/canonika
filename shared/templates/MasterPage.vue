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
              <div :class="['module-icon', serviceConfig.iconClass]"></div>
              <span class="logo-subtitle">{{ serviceConfig.name }}</span>
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
          <!-- Menu items dinâmicos baseados na configuração -->
          <template v-for="menuItem in serviceConfig.menuItems" :key="menuItem.id">
            <!-- Item simples -->
            <li v-if="!menuItem.submenu" class="nav-item" :class="{ active: currentView === menuItem.id }">
              <div class="nav-link" @click="setView(menuItem.id)">
                <div class="nav-icon">
                  <i :class="menuItem.icon"></i>
                </div>
                <div v-if="!sidebarCollapsed" class="nav-text">
                  <span class="nav-title">{{ menuItem.title }}</span>
                  <span v-if="menuItem.subtitle" class="service-subtitle">{{ menuItem.subtitle }}</span>
                </div>
              </div>
            </li>
            
            <!-- Item com submenu -->
            <li v-else class="nav-item" :class="{ active: openSubmenus[menuItem.id] }">
              <div class="nav-link" @click="toggleSubmenu(menuItem.id)">
                <div class="nav-icon">
                  <i :class="menuItem.icon"></i>
                </div>
                <div v-if="!sidebarCollapsed" class="nav-text">
                  <span class="nav-title">{{ menuItem.title }}</span>
                  <span v-if="menuItem.subtitle" class="service-subtitle">{{ menuItem.subtitle }}</span>
                </div>
                <i v-if="!sidebarCollapsed" :class="openSubmenus[menuItem.id] ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="submenu-icon"></i>
              </div>
              
              <!-- Submenu -->
              <ul v-if="!sidebarCollapsed" class="nav flex-column submenu" :class="{ show: openSubmenus[menuItem.id] }">
                <li v-for="subItem in menuItem.submenu" :key="subItem.id" class="nav-item">
                  <div class="nav-link" @click="setView(subItem.id)">
                    <div class="nav-icon">
                      <i :class="subItem.icon"></i>
                    </div>
                    <div class="nav-text">
                      <div class="nav-title">{{ subItem.title }}</div>
                      <div v-if="subItem.subtitle" class="service-subtitle">{{ subItem.subtitle }}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </nav>

      <!-- Conteúdo principal -->
      <main :class="['canonika-main', { 'sidebar-collapsed': sidebarCollapsed }]">
        <!-- Tela de login -->
        <div v-if="!user" class="login-container">
          <div class="login-card">
            <div class="login-header">
              <div class="login-logo">
                <div class="logo-hexagon-large"></div>
                <div class="logo-pulse-large"></div>
              </div>
              <h2 class="login-title">Acesso ao {{ serviceConfig.name }}</h2>
              <p class="login-subtitle">{{ serviceConfig.description }}</p>
            </div>
            <form @submit.prevent="login" class="login-form">
              <div class="form-group">
                <div class="input-container">
                  <span class="input-icon">👤</span>
                  <input 
                    v-model="loginForm.username" 
                    type="text" 
                    placeholder="Usuário" 
                    class="form-input"
                    required
                  >
                </div>
              </div>
              <div class="form-group">
                <div class="input-container">
                  <span class="input-icon">🔒</span>
                  <input 
                    v-model="loginForm.password" 
                    type="password" 
                    placeholder="Senha" 
                    class="form-input"
                    required
                  >
                </div>
              </div>
              <button type="submit" class="login-btn">
                <span>🚀</span> Entrar
              </button>
            </form>
          </div>
        </div>

        <!-- Conteúdo do serviço -->
        <div v-else class="service-content">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MasterPage',
  props: {
    serviceConfig: {
      type: Object,
      required: true,
      default: () => ({
        name: 'Serviço',
        description: 'Descrição do serviço',
        iconClass: 'icon-default',
        menuItems: []
      })
    }
  },
  data() {
    return {
      user: null,
      sidebarCollapsed: false,
      currentView: 'dashboard',
      openSubmenus: {},
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    setView(viewId) {
      this.currentView = viewId
      this.$emit('view-changed', viewId)
    },
    toggleSubmenu(menuId) {
      this.$set(this.openSubmenus, menuId, !this.openSubmenus[menuId])
    },
    login() {
      // Simular login
      this.user = {
        name: this.loginForm.username,
        role: 'admin'
      }
      this.$emit('login', this.user)
    },
    logout() {
      this.user = null
      this.$emit('logout')
    }
  },
  mounted() {
    // Inicializar submenus fechados
    this.serviceConfig.menuItems.forEach(item => {
      if (item.submenu) {
        this.$set(this.openSubmenus, item.id, false)
      }
    })
  }
}
</script>

<style scoped>
/* Estilos específicos do MasterPage */
.canonika-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
}

.canonika-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid #475569;
  position: relative;
  overflow: hidden;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
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
  width: 3rem;
  height: 3rem;
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
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.logo-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
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
}

.user-name {
  font-weight: 500;
  color: #e2e8f0;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 500;
}

.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.header-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
  pointer-events: none;
}

.canonika-layout {
  display: flex;
  min-height: calc(100vh - 4rem);
}

.sidebar-toggle {
  position: fixed;
  top: 5rem;
  left: 1rem;
  z-index: 1000;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  background: rgba(59, 130, 246, 0.2);
}

.canonika-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-right: 1px solid #475569;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.canonika-sidebar.sidebar-collapsed {
  width: 4rem;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #475569;
}

.nav-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #3b82f6;
  border-radius: 50%;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.nav-item.active .nav-link {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-right: 2px solid #3b82f6;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  min-width: 0;
}

.nav-title {
  font-weight: 500;
  color: inherit;
  font-size: 0.875rem;
}

.service-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.125rem;
}

.submenu-icon {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.nav-item.active .submenu-icon {
  transform: rotate(90deg);
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(15, 23, 42, 0.5);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.submenu.show {
  max-height: 500px;
}

.submenu .nav-link {
  padding-left: 2.5rem;
  font-size: 0.875rem;
}

.canonika-main {
  flex: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

.canonika-main.sidebar-collapsed {
  margin-left: 4rem;
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4rem);
}

.login-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
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
  animation: rotate 10s linear infinite;
}

.logo-pulse-large {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
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
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
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
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.service-content {
  width: 100%;
}

/* Animações */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Responsive */
@media (max-width: 768px) {
  .canonika-sidebar {
    position: fixed;
    top: 4rem;
    left: 0;
    height: calc(100vh - 4rem);
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .canonika-sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
  
  .canonika-main {
    margin-left: 0;
    padding: 1rem;
  }
  
  .sidebar-toggle {
    display: flex;
  }
}
</style> 