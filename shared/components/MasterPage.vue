<template>
  <div class="canonika-app">
    <!-- Header -->
    <CanonikaHeader
      :logo-text="headerConfig.logoText"
      :logo-subtitle="headerConfig.logoSubtitle"
      :user="headerConfig.user"
      :system-status="headerConfig.systemStatus"
      :is-online="headerConfig.isOnline"
      @logout="$emit('logout')"
    />

    <!-- Layout -->
    <div class="canonika-layout">
      <!-- Sidebar -->
      <CanonikaSidebar
        :brand-text="sidebarConfig.brandText"
        :brand-icon="sidebarConfig.brandIcon"
        :user="sidebarConfig.user"
        :navigation-sections="sidebarConfig.navigationSections"
        :collapsed="sidebarCollapsed"
        @nav-click="$emit('nav-click', $event)"
        @sidebar-toggle="toggleSidebar"
      />
      
      <!-- Main Content -->
      <main :class="['main-content', { 'sidebar-collapsed': sidebarCollapsed }]">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import CanonikaHeader from './Header.vue'
import CanonikaSidebar from './Sidebar.vue'

export default {
  name: 'CanonikaMasterPage',
  components: {
    CanonikaHeader,
    CanonikaSidebar
  },
  props: {
    headerConfig: {
      type: Object,
      default: () => ({
        logoText: 'CANONIKA',
        logoSubtitle: 'SERVICE',
        user: {
          name: 'Administrador',
          initial: 'A'
        },
        systemStatus: 'ONLINE',
        isOnline: true
      })
    },
    sidebarConfig: {
      type: Object,
      default: () => ({
        brandText: 'Service',
        brandIcon: 'fas fa-cube',
        user: {
          name: 'Administrador',
          role: 'Admin',
          initial: 'A'
        },
        navigationSections: []
      })
    },
    initialSidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sidebarCollapsed: this.initialSidebarCollapsed
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      this.$emit('sidebar-toggle', this.sidebarCollapsed)
    }
  },
  emits: ['logout', 'nav-click', 'sidebar-toggle']
}
</script>

<style scoped>
/* Reset e base - Estilo idêntico ao beacon_old */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.canonika-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Layout */
.canonika-layout {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  transition: all 0.3s ease;
  background: #f8f9fa;
  color: #212529;
}

/* When sidebar is collapsed */
.main-content.sidebar-collapsed {
  margin-left: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style> 