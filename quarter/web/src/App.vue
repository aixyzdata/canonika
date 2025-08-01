<template>
  <div class="canonika-app">
    <!-- Header simplificado -->
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
              <span class="logo-subtitle">QUARTER</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span>ONLINE</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Login Container -->
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <div class="logo-hexagon-large"></div>
            <div class="logo-pulse-large"></div>
          </div>
          <h2 class="login-title">Portal Canonika</h2>
          <p class="login-subtitle">Acesso Centralizado</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
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
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loginForm: {
        email: 'admin@canonika.io',
        password: 'admin123'
      },
      error: null
    }
  },
  methods: {
    async handleLogin() {
      this.error = null;
      try {
        // Validação simples
        if (this.loginForm.email === 'admin@canonika.io' && this.loginForm.password === 'admin123') {
          // Salvar estado de autenticação
          this.saveAuthState();
          
          // Redirecionar para Harbor (dashboard principal)
          window.location.href = 'http://localhost:3701';
        } else {
          this.error = 'Credenciais inválidas.';
        }
      } catch (error) {
        this.error = 'Erro ao fazer login.';
      }
    },
    saveAuthState() {
      localStorage.setItem('canonika_authenticated', 'true');
      localStorage.setItem('canonika_user', JSON.stringify({
        id: 'admin-001',
        name: 'Administrador Canonika',
        email: 'admin@canonika.io',
        roles: ['canonika_admin']
      }));
    }
  }
}
</script>

<style scoped>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

/* App Container */
.canonika-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
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
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
}

.logo-text-container {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.1em;
  margin: 0;
}

.module-title-with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-subtitle {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

/* Login Container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
}

.login-card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid #475569;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}

.logo-hexagon-large {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-pulse-large {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #f59e0b;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #94a3b8;
  font-size: 1rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  color: #64748b;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid #475569;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input::placeholder {
  color: #64748b;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(51, 65, 85, 1);
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
}

.login-btn {
  position: relative;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-btn:hover .btn-glow {
  left: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
    margin: 1rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}
</style> 