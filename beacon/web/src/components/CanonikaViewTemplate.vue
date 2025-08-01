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

<style scoped>
.canonika-view {
  height: 100%;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 1rem;
  border: 1px solid #475569;
}

.view-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-title i {
  color: #3b82f6;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.title-content {
  flex: 1;
}

.title-content h1 {
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.title-content p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.3;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.view-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.view-content {
  height: calc(100vh - 250px);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style> 