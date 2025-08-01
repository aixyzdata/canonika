<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div v-if="showLogo" class="login-logo" :class="`logo-${logoSize}`">
          <div class="logo-hexagon-large"></div>
          <div class="logo-pulse-large"></div>
        </div>
        <h2 class="login-title">{{ title || 'Portal Canonika' }}</h2>
        <p class="login-subtitle">{{ subtitle || 'Acesso unificado à plataforma' }}</p>
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
          <span>{{ buttonText }}</span>
          <div class="btn-glow"></div>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginTemplate',
  props: {
    title: {
      type: String,
      default: 'Portal Canonika'
    },
    subtitle: {
      type: String,
      default: 'Acesso unificado à plataforma'
    },
    defaultEmail: {
      type: String,
      default: 'admin@canonika.io'
    },
    defaultPassword: {
      type: String,
      default: 'Admin@123'
    },
    showLogo: {
      type: Boolean,
      default: true
    },
    logoSize: {
      type: String,
      default: 'large', // 'small', 'medium', 'large'
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    buttonText: {
      type: String,
      default: 'ENTRAR'
    },
    theme: {
      type: String,
      default: 'default', // 'default', 'minimal', 'futuristic'
      validator: value => ['default', 'minimal', 'futuristic'].includes(value)
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
          roles: ['admin']
        }
        
        // Salvar estado de autenticação
        this.saveAuthState(user);
        
        // Emitir evento de login
        this.$emit('login-success', user);
      } catch (e) {
        this.error = 'Erro ao fazer login.';
      }
    },
    saveAuthState(user) {
      if (user) {
        localStorage.setItem('canonika_user', JSON.stringify(user));
        localStorage.setItem('canonika_authenticated', 'true');
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
}

.login-card {
  background: linear-gradient(135deg, #334155, #475569);
  border: 1px solid #64748b;
  border-radius: 1rem;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px #0000004d;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo {
  position: relative;
  margin: 0 auto 1rem;
}

.login-logo.logo-small {
  width: 2rem;
  height: 2rem;
}

.login-logo.logo-medium {
  width: 3rem;
  height: 3rem;
}

.login-logo.logo-large {
  width: 4rem;
  height: 4rem;
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
  background: #0f172a80;
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
  background: #ef44441a;
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.login-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #fff;
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
  box-shadow: 0 8px 25px #3b82f64d;
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


</style> 