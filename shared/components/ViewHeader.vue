<template>
  <div class="canonika-view-header">
    <!-- View Title Section -->
    <div class="view-title-section">
      <h2 v-if="title" class="view-title">{{ title }}</h2>
      <span v-if="subtitle" class="view-subtitle">{{ subtitle }}</span>
    </div>
    
    <!-- View Status -->
    <div v-if="status" class="view-status">
      <div :class="['status-indicator', status.type]"></div>
      <span>{{ status.text }}</span>
    </div>
    
    <!-- View Actions -->
    <div v-if="actions" class="view-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CanonikaViewHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    status: {
      type: Object,
      default: null
    },
    actions: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<!-- Estilos agora são gerenciados pelo SCSS compartilhado -->
