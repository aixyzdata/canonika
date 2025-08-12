<template>
  <div class="canonika-view">
    <div class="view-header">
      <div class="view-title">
        <i :class="headerIcon"></i>
        <div class="title-content">
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>{{ statusText }}</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button 
          v-if="primaryAction"
          @click="primaryAction.handler" 
          class="action-btn primary"
        >
          <i :class="primaryAction.icon"></i>
          {{ primaryAction.text }}
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CanonikaViewTemplate',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    headerIcon: {
      type: String,
      required: true
    },
    statusText: {
      type: String,
      default: 'ONLINE'
    },
    primaryAction: {
      type: Object,
      default: null
    }
  },
  methods: {
    refreshData() {
      this.$emit('refresh');
    }
  }
}
</script>

