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
      openSubmenus: {}
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

    logout() {
      this.user = null;
      this.clearAuthState();
      this.$emit('logout');
    },
    loadAuthState() {
      const authenticated = localStorage.getItem('canonika_authenticated');
      const userData = localStorage.getItem('canonika_user');
      
      if (authenticated === 'true' && userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (e) {
          // Se houver erro ao parsear, limpar dados corrompidos
          this.clearAuthState();
        }
      }
    },
    clearAuthState() {
      localStorage.removeItem('canonika_user');
      localStorage.removeItem('canonika_authenticated');
    }
  },
  mounted() {
    // Carregar estado de autenticação ao iniciar
    this.loadAuthState();
    
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
  background: linear-gradient(135deg, #1e293b, #334155, #475569);
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.canonika-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
  padding: 1rem 2rem;
  position: relative;
  overflow: hidden;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  height: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  min-width: 0;
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

.logo-text-container {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
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
  flex-shrink: 0;
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
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-name {
  font-weight: 600;
  color: #e2e8f0;
}

.logout-btn {
  background: #ffffff1a;
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
  background: #fff3;
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
  box-shadow: 0 0 8px #10b98180;
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

.canonika-layout {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
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

.service-content {
  width: 100%;
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
  
  /* Responsividade do header */
  .header-content {
    padding: 0 1rem;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .logo-subtitle {
    font-size: 0.625rem;
  }
  
  .header-actions {
    gap: 1rem;
  }
  
  .user-name {
    display: none;
  }
  
  .system-status span {
    display: none;
  }
}
</style> 