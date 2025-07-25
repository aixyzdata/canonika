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
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <span class="user-name">{{ user.name }}</span>
            <button @click="logout" class="logout-btn">
              <span>🚪</span> Sair
            </button>
          </div>
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span>Sistema Online</span>
          </div>
        </div>
      </div>
      <div class="header-glow"></div>
    </header>

    <!-- Container principal -->
    <div class="main-container">
      <!-- Botão toggle sidebar -->
      <button 
        @click="toggleSidebar" 
        :class="['sidebar-toggle', { 'sidebar-collapsed': sidebarCollapsed }]"
      >
        ☰
      </button>

      <!-- Sidebar -->
      <nav :class="['canonika-sidebar', { 'sidebar-collapsed': sidebarCollapsed }]">
        <div class="sidebar-header">
          <div class="nav-icon">
            <div class="nav-dot"></div>
            <span>{{ serviceConfig.subtitle }}</span>
          </div>
        </div>

        <ul class="nav-menu">
          <li 
            v-for="menuItem in serviceConfig.menuItems" 
            :key="menuItem.id"
            :class="['nav-item', { active: currentView === menuItem.id }]"
          >
            <a @click="setView(menuItem.id)" class="nav-link">
              <div class="nav-icon">{{ menuItem.icon }}</div>
              <div class="nav-text">
                <div class="nav-title">{{ menuItem.title }}</div>
                <div class="service-subtitle">{{ menuItem.subtitle }}</div>
              </div>
            </a>
          </li>
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
              <div v-if="loginError" class="error-message">
                {{ loginError }}
              </div>
              <button type="submit" class="login-btn">
                <span class="btn-glow"></span>
                Entrar
              </button>
            </form>
          </div>
        </div>

        <!-- Dashboard/Views dos serviços -->
        <div v-else class="service-content">
          <!-- Slot para as views específicas de cada serviço -->
          <slot 
            :currentView="currentView" 
            :serviceConfig="serviceConfig"
            :user="user"
            :refreshData="refreshData"
          ></slot>
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
        name: 'SERVICE',
        subtitle: 'Serviço',
        description: 'Descrição do serviço',
        iconClass: 'icon-default',
        menuItems: []
      })
    }
  },
  data() {
    return {
      user: null,
      currentView: 'dashboard',
      sidebarCollapsed: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginError: ''
    }
  },
  methods: {
    login() {
      if (this.loginForm.username === 'admin' && this.loginForm.password === 'admin') {
        this.user = {
          name: this.loginForm.username,
          email: 'admin@canonika.com'
        };
        this.loginError = '';
      } else {
        this.loginError = 'Credenciais inválidas';
      }
    },
    logout() {
      this.user = null;
      this.currentView = 'dashboard';
      this.loginForm = { username: '', password: '' };
    },
    setView(viewId) {
      this.currentView = viewId;
      this.$emit('view-changed', viewId);
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    refreshData() {
      this.$emit('refresh-data');
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