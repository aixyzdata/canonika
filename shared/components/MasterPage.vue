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
        :collapsed="sidebarCollapsed"
        :user="sidebarConfig.user"
        :navigation-sections="sidebarConfig.navigationSections"
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
  mounted() {
    console.log('🔍 MasterPage - sidebarConfig recebido:', this.sidebarConfig)
    console.log('🔍 MasterPage - navigationSections:', this.sidebarConfig.navigationSections)
  },
  methods: {
    toggleSidebar() {
      // Se estiver recolhido, sempre expandir
      if (this.sidebarCollapsed) {
        this.sidebarCollapsed = false
        this.$emit('sidebar-toggle', false)
      } else {
        // Se estiver expandido, permitir recolher
        this.sidebarCollapsed = true
        this.$emit('sidebar-toggle', true)
      }
    }
  },
  emits: ['logout', 'nav-click', 'sidebar-toggle']
}
</script>

<!-- Estilos agora são gerenciados pelo SCSS compartilhado --> 