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
          <h1 class="logo-text">CANONIKA</h1>
          <span class="logo-subtitle">HARBOR</span>
        </div>
        <div class="header-actions">
          <div v-if="user" class="user-info">
            <div class="user-avatar">
              <div class="avatar-ring"></div>
              <span>{{ user.charAt(0).toUpperCase() }}</span>
            </div>
            <span class="user-name">{{ user }}</span>
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
            <span>DASHBOARD</span>
          </div>
        </div>
        <ul class="nav-menu">
          <li class="nav-item active">
            <div class="nav-link">
              <div class="nav-icon">
                <div class="icon-hex"></div>
              </div>
              <span>Dashboard</span>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <div class="nav-icon">
                <div class="icon-hex"></div>
              </div>
              <span>Créditos</span>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <div class="nav-icon">
                <div class="icon-hex"></div>
              </div>
              <span>Serviços</span>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <div class="nav-icon">
                <div class="icon-hex"></div>
              </div>
              <span>Analytics</span>
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
              <p class="login-subtitle">Entre com suas credenciais para acessar o Harbor</p>
            </div>
            
            <form @submit.prevent="login" class="login-form">
              <div class="form-group">
                <div class="input-container">
                  <div class="input-icon">
                    <div class="icon-hex-small"></div>
                  </div>
                  <input 
                    v-model="username" 
                    class="form-input" 
                    placeholder="Usuário"
                    required 
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
                    v-model="password" 
                    type="password" 
                    class="form-input" 
                    placeholder="Senha"
                    required 
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
          <div class="dashboard-header">
            <h2 class="dashboard-title">Dashboard</h2>
            <div class="dashboard-stats">
              <div class="stat-card">
                <div class="stat-icon">
                  <div class="icon-hex"></div>
                </div>
                <div class="stat-content">
                  <span class="stat-value">12</span>
                  <span class="stat-label">Serviços Ativos</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <div class="icon-hex"></div>
                </div>
                <div class="stat-content">
                  <span class="stat-value">99.9%</span>
                  <span class="stat-label">Uptime</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <div class="icon-hex"></div>
                </div>
                <div class="stat-content">
                  <span class="stat-value">1.2ms</span>
                  <span class="stat-label">Latência</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="dashboard-content">
            <div class="welcome-message">
              <h3>Bem-vindo ao Canonika Harbor!</h3>
              <p>Sistema operacional e funcionando perfeitamente.</p>
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
      username: '',
      password: '',
      user: null,
      error: null
    }
  },
  methods: {
    async login() {
      this.error = null;
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });
        if (!res.ok) throw new Error('Usuário ou senha inválidos');
        const data = await res.json();
        this.user = this.username;
        localStorage.setItem('token', data.access_token);
      } catch (e) {
        this.error = e.message;
      }
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  overflow-x: hidden;
}

.canonika-app {
  min-height: 100vh;
  position: relative;
}

/* Header futurista */
.canonika-header {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  position: relative;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  position: relative;
  width: 50px;
  height: 50px;
}

.logo-hexagon {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: rotate 10s linear infinite;
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00d4ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
}

.logo-subtitle {
  font-size: 0.8rem;
  color: #00d4ff;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000000;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.avatar-ring {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid rgba(0, 212, 255, 0.5);
  border-radius: 50%;
  animation: rotate 4s linear infinite;
}

.user-name {
  color: #ffffff;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #00d4ff;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: blink 1.5s ease-in-out infinite;
}

.status-indicator.online {
  background: #00ff88;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.header-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  animation: glow 3s ease-in-out infinite;
}

/* Main container */
.main-container {
  display: flex;
  min-height: calc(100vh - 80px);
}

/* Sidebar futurista */
.canonika-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%);
  border-right: 1px solid rgba(0, 255, 255, 0.1);
  padding: 2rem 0;
}

.sidebar-header {
  padding: 0 2rem 2rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
}

.nav-icon {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #00d4ff;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.nav-dot {
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

.nav-menu {
  list-style: none;
  padding: 2rem 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
}

.nav-item.active .nav-link {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border-right: 3px solid #00d4ff;
}

.nav-icon {
  width: 20px;
  height: 20px;
  position: relative;
}

.icon-hex {
  width: 100%;
  height: 100%;
  background: #00d4ff;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  opacity: 0.7;
}

/* Main content */
.canonika-main {
  flex: 1;
  padding: 2rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
}

/* Login container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
}

.login-card {
  background: linear-gradient(135deg, rgba(10, 10, 25, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  backdrop-filter: blur(10px);
}

.login-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00d4ff, #0099cc, #00d4ff);
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
  background: linear-gradient(45deg, #00d4ff, #0099cc);
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
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00d4ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.login-subtitle {
  color: #cccccc;
  font-size: 1.1rem;
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
}

.input-icon {
  position: absolute;
  left: 1rem;
  z-index: 2;
}

.icon-hex-small {
  width: 16px;
  height: 16px;
  background: #00d4ff;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  opacity: 0.7;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: #999999;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
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
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 10px;
  color: #000000;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
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
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00d4ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: linear-gradient(135deg, rgba(10, 10, 25, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
}

.stat-icon {
  width: 50px;
  height: 50px;
  position: relative;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #00d4ff;
}

.stat-label {
  font-size: 0.9rem;
  color: #aaaaaa;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.dashboard-content {
  background: linear-gradient(135deg, rgba(10, 10, 25, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  padding: 3rem;
}

.welcome-message h3 {
  font-size: 1.8rem;
  color: #00d4ff;
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.welcome-message p {
  color: #dddddd;
  font-size: 1.1rem;
  font-weight: 400;
}

/* Animações */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
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
  }
  
  .login-card {
    margin: 1rem;
    padding: 2rem;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}
</style>
