<template>
  <nav :class="['sidebar', { collapsed }]">
    <div class="sidebar-header">
      <div class="sidebar-brand" v-show="!collapsed">
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
          <li v-for="item in section.items" :key="item.title" class="nav-item" :data-title="item.title">
            <a href="#" class="nav-link" @click="handleItemClick(item)">
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="nav-text">
                <div class="nav-title">{{ item.title }}</div>
                <div class="service-subtitle">{{ item.subtitle }}</div>
              </div>
              <div v-if="item.subItems && item.subItems.length > 0" class="nav-arrow" :class="{ 'rotated': expandedItems.includes(item.id) }">
                <i class="fas fa-chevron-down"></i>
              </div>
            </a>
            
            <!-- Subitens do menu -->
            <ul v-if="item.subItems && item.subItems.length > 0" class="nav-submenu" :class="{ 'expanded': expandedItems.includes(item.id) }">
              <li v-for="subItem in item.subItems" :key="subItem.title" class="nav-subitem">
                <a href="#" class="nav-sublink" @click="$emit('nav-click', subItem)">
                  <div class="nav-subicon">
                    <i :class="subItem.icon"></i>
                  </div>
                  <div class="nav-subtext">
                    <div class="nav-subtitle">{{ subItem.title }}</div>
                    <div class="nav-subsubtitle">{{ subItem.subtitle }}</div>
                  </div>
                </a>
              </li>
            </ul>
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
  data() {
    return {
      expandedItems: []
    }
  },
  mounted() {
    console.log('🔍 Sidebar - navigationSections recebido:', this.navigationSections)
    console.log('🔍 Sidebar - sections count:', this.navigationSections.length)
  },
  methods: {
    handleItemClick(item) {
      // Se o sidebar estiver recolhido, sempre expandir primeiro
      if (this.collapsed) {
        this.$emit('sidebar-toggle')
        return
      }
      
      if (item.subItems && item.subItems.length > 0) {
        // Toggle accordion
        const index = this.expandedItems.indexOf(item.id)
        if (index > -1) {
          this.expandedItems.splice(index, 1)
        } else {
          this.expandedItems.push(item.id)
        }
      } else {
        // Emit nav-click for items without subitems
        this.$emit('nav-click', item)
      }
    }
  },
  emits: ['nav-click', 'sidebar-toggle']
}
</script>

<style>
@import '../styles/sidebar.css';
</style> 