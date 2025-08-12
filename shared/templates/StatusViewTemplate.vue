<template>
  <div class="canonika-status-view">
    <!-- Header Padrão -->
    <div class="canonika-status-header">
      <div class="canonika-status-header-content">
        <div class="canonika-status-header-info">
          <div class="canonika-service-icon">
            <i :class="serviceIcon"></i>
          </div>
          <div class="canonika-service-info">
            <div class="canonika-service-title">
              <h1 class="canonika-service-name">{{ serviceName }}</h1>
              <div class="canonika-status-indicator" :class="serviceStatus">
                <div class="canonika-status-dot"></div>
                <span>{{ statusText }}</span>
              </div>
            </div>
            <p class="canonika-service-description">{{ serviceDescription }}</p>
          </div>
        </div>
        <div class="canonika-status-actions">
          <button @click="refreshData" class="canonika-btn canonika-btn-outline">
            <i class="fas fa-sync-alt"></i>
            Atualizar
          </button>
          <button v-if="primaryAction" @click="primaryAction.handler" class="canonika-btn canonika-btn-primary">
            <i :class="primaryAction.icon"></i>
            {{ primaryAction.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- Grid de Métricas Principais -->
    <div class="canonika-metrics-grid">
      <div v-for="metric in metrics" :key="metric.id" class="canonika-metric-card">
        <div class="canonika-metric-header">
          <div class="canonika-metric-icon">
            <i :class="metric.icon"></i>
          </div>
          <h3 class="canonika-metric-title">{{ metric.title }}</h3>
        </div>
        <div class="canonika-metric-value">{{ metric.value }}</div>
        <p class="canonika-metric-label">{{ metric.label }}</p>
      </div>
    </div>

    <!-- Grid de Cards de Sistema -->
    <div class="canonika-system-grid">
      <!-- Card de Atividade Recente -->
      <div v-if="recentActivity.length > 0" class="canonika-system-card">
        <div class="canonika-system-card-header">
          <div class="canonika-system-card-icon">
            <i class="fas fa-history"></i>
          </div>
          <h3 class="canonika-system-card-title">Atividade Recente</h3>
        </div>
        <div class="canonika-activity-list">
          <div v-for="activity in recentActivity" :key="activity.id" class="canonika-activity-item">
            <div class="canonika-activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="canonika-activity-content">
              <div class="canonika-activity-title">{{ activity.title }}</div>
              <div class="canonika-activity-description">{{ activity.description }}</div>
              <div class="canonika-activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card de Status do Sistema -->
      <div v-if="systemStatus.length > 0" class="canonika-system-card">
        <div class="canonika-system-card-header">
          <div class="canonika-system-card-icon">
            <i class="fas fa-server"></i>
          </div>
          <h3 class="canonika-system-card-title">Status do Sistema</h3>
        </div>
        <div class="canonika-system-list">
          <div v-for="system in systemStatus" :key="system.id" 
               class="canonika-system-item" :class="system.status">
            <div class="canonika-system-status-dot" :class="system.status"></div>
            <div class="canonika-system-info">
              <div class="canonika-system-name">{{ system.name }}</div>
              <div class="canonika-system-description">{{ system.description }}</div>
              <div v-if="system.port" class="canonika-system-port">{{ system.port }}</div>
          </div>
        </div>
      </div>
    </div>

      <!-- Card de Configurações -->
      <div v-if="configurations.length > 0" class="canonika-system-card">
        <div class="canonika-system-card-header">
          <div class="canonika-system-card-icon">
            <i class="fas fa-cog"></i>
          </div>
          <h3 class="canonika-system-card-title">Configurações</h3>
        </div>
        <div class="canonika-system-list">
          <div v-for="config in configurations" :key="config.id" class="canonika-system-item">
            <div class="canonika-system-info">
              <div class="canonika-system-name">{{ config.name }}</div>
              <div class="canonika-system-description">{{ config.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de Ações -->
    <div v-if="actions.length > 0" class="canonika-actions-grid">
      <div v-for="action in actions" :key="action.id" 
           class="canonika-action-card" @click="action.handler">
        <div class="canonika-action-icon">
          <i :class="action.icon"></i>
        </div>
        <h3 class="canonika-action-title">{{ action.title }}</h3>
        <p class="canonika-action-description">{{ action.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusViewTemplate',
  props: {
    // Informações do Serviço
    serviceName: {
      type: String,
      required: true
    },
    serviceDescription: {
      type: String,
      required: true
    },
    serviceIcon: {
      type: String,
      required: true
    },
    serviceStatus: {
      type: String,
      default: 'online',
      validator: value => ['online', 'offline', 'warning'].includes(value)
    },
    statusText: {
      type: String,
      default: 'ONLINE'
    },
    
    // Métricas Principais
    metrics: {
      type: Array,
      default: () => []
    },
    
    // Atividade Recente
    recentActivity: {
      type: Array,
      default: () => []
    },
    
    // Status do Sistema
    systemStatus: {
      type: Array,
      default: () => []
    },
    
    // Configurações
    configurations: {
      type: Array,
      default: () => []
    },
    
    // Ações Disponíveis
    actions: {
      type: Array,
      default: () => []
    },
    
    // Ação Principal
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

