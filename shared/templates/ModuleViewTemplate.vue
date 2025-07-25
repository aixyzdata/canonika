<template>
  <div class="module-harbor-view">
    <div class="view-header">
      <div class="view-info">
        <h1>{{ moduleTitle }}</h1>
        <p>{{ moduleDescription }}</p>
      </div>
      <div class="view-actions">
        <div class="view-status">
          <div class="status-indicator online"></div>
          <span>ONLINE</span>
        </div>
        <button @click="openModule" class="access-btn">
          <i class="fas fa-external-link-alt"></i>
          Acessar
        </button>
      </div>
    </div>

    <div class="dashboard-cards">
      <div v-for="stat in stats" :key="stat.id" class="card">
        <div class="card-header">
          <i :class="stat.icon"></i>
          <h3>{{ stat.title }}</h3>
        </div>
        <div class="card-content">
          <div class="metric">
            <span class="number">{{ stat.value }}</span>
            <span class="label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="actions-panel">
      <h3>Ações Disponíveis</h3>
      <div class="action-buttons">
        <button v-for="action in actions" :key="action.id" @click="openModule" class="action-btn" :class="action.class">
          <i :class="action.icon"></i>
          {{ action.label }}
        </button>
      </div>
    </div>

    <div class="recent-activity">
      <h3>Atividade Recente</h3>
      <div class="activity-list">
        <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
          <div class="activity-icon">
            <i :class="activity.icon"></i>
          </div>
          <div class="activity-content">
            <span class="activity-text">{{ activity.text }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleViewTemplate',
  props: {
    moduleTitle: {
      type: String,
      required: true
    },
    moduleDescription: {
      type: String,
      required: true
    },
    modulePort: {
      type: String,
      required: true
    },
    stats: {
      type: Array,
      default: () => []
    },
    actions: {
      type: Array,
      default: () => []
    },
    recentActivity: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    openModule() {
      window.open(`http://localhost:${this.modulePort}/web/`, '_blank');
    }
  }
}
</script>

<style scoped>
.module-harbor-view {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100%;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.view-info h1 {
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  font-size: 1.875rem;
  font-weight: 700;
}

.view-info p {
  color: #6b7280;
  margin: 0;
}

.view-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #059669;
}

.access-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.access-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-header i {
  color: #3b82f6;
  font-size: 1.25rem;
}

.card-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1rem;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric .number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.metric .label {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.actions-panel {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.actions-panel h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.action-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.recent-activity {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.recent-activity h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.activity-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.activity-text {
  color: #1f2937;
  font-weight: 500;
}

.activity-time {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style> 