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
          <div :class="['status-indicator', isOnline ? 'online' : 'offline']"></div>
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

<style>
@import '../styles/header.css';
</style> 