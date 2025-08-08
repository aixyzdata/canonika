<template>
  <nav :class="['sidebar', { collapsed: collapsed }]">
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
      <div v-for="section in navigationSections" :key="section.id" class="nav-section">
        <div class="section-header">
          <span class="section-title">{{ section.title }}</span>
        </div>
        <ul class="nav">
          <li v-for="item in section.items" :key="item.id" class="nav-item">
            <a :href="item.href" class="nav-link" :class="{ 'router-link-exact-active': item.active }" @click="$emit('nav-click', item)">
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
          <span class="user-name">{{ user ? user.name : 'Administrador' }}</span>
          <span class="user-role">{{ user ? user.role : 'Administrador' }}</span>
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
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['nav-click', 'sidebar-toggle']
}
</script>

<style scoped>
/* Sidebar - Estilo idêntico ao beacon_old */
.sidebar {
  width: 280px;
  background: #212529;
  border-right: 1px solid #343a40;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  height: calc(100vh - 60px);
  z-index: 1000;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #343a40;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
  font-weight: 600;
  font-size: 1.125rem;
}

.sidebar-brand i {
  font-size: 1.25rem;
  color: #3b82f6;
}

.collapsed .brand-text {
  display: none;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease;
}

.sidebar-toggle:hover {
  color: #adb5bd;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.section-header {
  padding: 0 1rem 0.5rem;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #6c757d;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.8;
}

.nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #adb5bd;
  text-decoration: none;
  transition: all 0.15s ease-in-out;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  margin: 0 0.5rem;
}

.nav-link:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.nav-link.router-link-exact-active {
  color: #ffffff !important;
  background-color: #3b82f6;
  border-radius: 0.375rem;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.nav-link.router-link-exact-active .nav-title,
.nav-link.router-link-exact-active .service-subtitle {
  color: #ffffff !important;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nav-title {
  font-weight: 600;
  color: inherit;
  margin: 0;
  white-space: nowrap;
}

.service-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  margin: 0;
  white-space: nowrap;
  color: inherit;
}

.collapsed .nav-text {
  display: none;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #343a40;
}

.sidebar-footer .user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sidebar-footer .user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.8rem;
  color: #e2e8f0;
  font-weight: 500;
}

.user-role {
  font-size: 0.7rem;
  color: #6c757d;
  margin-top: 0.1rem;
}

.collapsed .user-details {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    border-right: none;
    border-top: 1px solid #475569;
  }
  
  .main-content {
    margin-bottom: 80px;
  }
}
</style> 