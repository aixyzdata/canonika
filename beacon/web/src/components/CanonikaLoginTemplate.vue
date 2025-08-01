<template>
  <div class="canonika-app">
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
              <div :class="['module-icon', moduleIconClass]"></div>
              <span class="logo-subtitle">{{ moduleName.toUpperCase() }}</span>
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
      <div class="header-glow"></div>
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
          <p class="login-subtitle">Acesso ao {{ moduleName }}</p>
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
  name: 'CanonikaLoginTemplate',
  props: {
    moduleName: {
      type: String,
      required: true,
      default: 'Portal'
    },
    moduleIconClass: {
      type: String,
      default: 'icon-harbor'
    },
    redirectUrl: {
      type: String,
      default: '/'
    },
    defaultEmail: {
      type: String,
      default: 'admin@canonika.io'
    },
    defaultPassword: {
      type: String,
      default: 'Admin@123'
    }
  },
  data() {
    return {
      loginForm: {
        email: this.defaultEmail,
        password: this.defaultPassword
      },
      error: null
    }
  },
  methods: {
    async handleLogin() {
      this.error = null;
      try {
        // Simular login bem-sucedido
        const user = {
          id: 'admin-001',
          name: 'Administrador',
          email: this.loginForm.email,
          roles: ['admin'],
          module: this.moduleName
        }
        
        // Salvar estado de autenticação
        this.saveAuthState(user);
        
        // Emitir evento de login com dados do usuário e URL de redirecionamento
        this.$emit('login-success', {
          user: user,
          redirectUrl: this.redirectUrl
        });
      } catch (error) {
        this.error = 'Erro ao fazer login.';
      }
    },
    saveAuthState(user) {
      localStorage.setItem('canonika_authenticated', 'true');
      localStorage.setItem('canonika_user', JSON.stringify(user));
      localStorage.setItem('canonika_module', this.moduleName);
    }
  }
}
</script>

<style scoped>
/* Reset CSS Universal */
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
  z-index: 2;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
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
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
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

/* Login */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
}

.login-card {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  border: 1px solid #64748b;
  border-radius: 1rem;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
  width: 0.5rem;
  height: 0.5rem;
  background: #ffffff;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
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
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #64748b;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.login-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover .btn-glow {
  left: 100%;
}

/* Animations */
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
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
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
  
  .system-status span {
    display: none;
  }
}
</style> 