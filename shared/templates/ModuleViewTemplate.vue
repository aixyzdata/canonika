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

