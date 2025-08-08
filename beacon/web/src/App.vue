<template>
  <div id="app" class="canonika-app">
    <!-- Header -->
    <header class="canonika-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo-title">🚀 Beacon</h1>
          <p class="logo-subtitle">Sistema de Monitoramento</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary">Login</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="canonika-main">
      <!-- Sidebar -->
      <aside class="canonika-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/" class="nav-item">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </router-link>
          <router-link to="/websocket" class="nav-item">
            <i class="fas fa-broadcast-tower"></i>
            <span>WebSocket</span>
          </router-link>
          <router-link to="/api" class="nav-item">
            <i class="fas fa-code"></i>
            <span>API</span>
          </router-link>
          <router-link to="/configuracoes" class="nav-item">
            <i class="fas fa-cog"></i>
            <span>Configurações</span>
          </router-link>
        </nav>
      </aside>

      <!-- Content Area -->
      <div class="canonika-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log('✅ App.vue montado com sucesso!')
  }
}
</script>

<style scoped>
/* Layout Principal */
.canonika-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
}

/* Header */
.canonika-header {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  padding: 1rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #60a5fa;
  margin: 0;
}

.logo-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Main Content */
.canonika-main {
  display: flex;
  flex: 1;
}

/* Sidebar */
.canonika-sidebar {
  width: 250px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(148, 163, 184, 0.1);
  padding: 2rem 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.nav-item.router-link-active {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-left: 3px solid #3b82f6;
}

.nav-item i {
  width: 1rem;
  text-align: center;
}

/* Content Area */
.canonika-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Responsividade */
@media (max-width: 768px) {
  .canonika-sidebar {
    width: 200px;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .canonika-content {
    padding: 1rem;
  }
}
</style> 