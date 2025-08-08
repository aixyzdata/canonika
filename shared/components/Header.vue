<template>
  <header class="canonika-header">
    <div class="header-content">
      <div class="logo-section">
        <div class="logo-icon">
          <div class="logo-hexagon"></div>
          <div class="logo-pulse"></div>
        </div>
        <div class="logo-text-container">
          <h1 class="logo-text">{{ logoText }}</h1>
          <span class="logo-subtitle">{{ logoSubtitle }}</span>
        </div>
      </div>
      
      <div class="header-actions">
        <div class="user-info">
          <div class="user-avatar">
            <span>{{ user ? user.initial : 'A' }}</span>
          </div>
          <span class="user-name">{{ user ? user.name : 'Administrador' }}</span>
        </div>
        <button @click="$emit('logout')" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          Sair
        </button>
        <div class="system-status">
          <div :class="['status-indicator', { online: isOnline }]"></div>
          <span>{{ systemStatus }}</span>
        </div>
      </div>
    </div>
    <div class="header-glow"></div>
  </header>
</template>

<script>
export default {
  name: 'CanonikaHeader',
  props: {
    logoText: {
      type: String,
      default: 'CANONIKA'
    },
    logoSubtitle: {
      type: String,
      default: 'SERVICE'
    },
    user: {
      type: Object,
      default: () => ({
        name: 'Administrador',
        initial: 'A'
      })
    },
    systemStatus: {
      type: String,
      default: 'ONLINE'
    },
    isOnline: {
      type: Boolean,
      default: true
    }
  },
  emits: ['logout']
}
</script>

<style scoped>
/* Header - Estilo idêntico ao beacon_old */
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
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.user-name {
  font-size: 0.8rem;
  color: #e2e8f0;
  font-weight: 500;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
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

.header-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  pointer-events: none;
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

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .user-name {
    display: none;
  }
  
  .system-status span {
    display: none;
  }
}
</style> 