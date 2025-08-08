<template>
  <nav :class="['sidebar', { collapsed }]">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <i :class="brandIcon"></i>
        <span class="brand-text">{{ brandText }}</span>
      </div>
      <button @click="$emit('sidebar-toggle')" class="sidebar-toggle">
        <i :class="collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>
    </div>
    
    <div class="sidebar-nav">
      <div v-for="section in navigationSections" :key="section.title" class="nav-section">
        <div class="section-header">
          <span class="section-title">{{ section.title }}</span>
        </div>
        <ul class="nav">
          <li v-for="item in section.items" :key="item.title" class="nav-item">
            <a href="#" class="nav-link" @click="$emit('nav-click', item)">
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">{{ item.title }}</div>
                <div class="service-subtitle">{{ item.subtitle }}</div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          <span>{{ user ? user.initial : 'A' }}</span>
        </div>
        <div class="user-details">
          <div class="user-name">{{ user ? user.name : 'Administrador' }}</div>
          <div class="user-role">{{ user ? user.role : 'Admin' }}</div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'CanonikaSidebar',
  props: {
    brandText: {
      type: String,
      default: 'Service'
    },
    brandIcon: {
      type: String,
      default: 'fas fa-cube'
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({
        name: 'Administrador',
        role: 'Admin',
        initial: 'A'
      })
    },
    navigationSections: {
      type: Array,
      default: () => []
    }
  },
  emits: ['nav-click', 'sidebar-toggle']
}
</script>

<style>
@import '../styles/sidebar.css';
</style> 