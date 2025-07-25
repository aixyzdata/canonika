<template>
  <div class="beacon-harbor-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-broadcast-tower"></i>
        <div class="title-content">
          <h1>Beacon - Sistema de Alertas</h1>
          <p>Gerenciamento de alertas, notificações e sinalizações do sistema</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>ONLINE</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="openModule" class="action-btn primary">
          <i class="fas fa-external-link-alt"></i>
          Acessar
        </button>
      </div>
    </div>

    <div class="dashboard-cards">
      <div class="card">
        <div class="card-header">
          <i class="fas fa-bell"></i>
          <h3>Alertas Ativos</h3>
        </div>
        <div class="card-content">
          <div class="metric">
            <span class="number">{{ stats.activeAlerts }}</span>
            <span class="label">Alertas em andamento</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Críticos Hoje</h3>
        </div>
        <div class="card-content">
          <div class="metric">
            <span class="number">{{ stats.criticalToday }}</span>
            <span class="label">Alertas críticos</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <i class="fas fa-chart-line"></i>
          <h3>Taxa de Resolução</h3>
        </div>
        <div class="card-content">
          <div class="metric">
            <span class="number">{{ stats.resolutionRate }}%</span>
            <span class="label">Média de resolução</span>
          </div>
        </div>
      </div>
    </div>

    <div class="actions-panel">
      <h3>Ações Rápidas</h3>
      <div class="action-buttons">
        <button @click="createAlert" class="action-btn primary">
          <i class="fas fa-plus"></i>
          Criar Alerta
        </button>
        <button @click="openDashboard" class="action-btn">
          <i class="fas fa-tachometer-alt"></i>
          Dashboard
        </button>
        <button @click="viewHistory" class="action-btn">
          <i class="fas fa-history"></i>
          Histórico
        </button>
        <button @click="openSettings" class="action-btn">
          <i class="fas fa-cog"></i>
          Configurações
        </button>
      </div>
    </div>

    <div class="recent-alerts">
      <h3>Alertas Recentes</h3>
      <div class="alert-list">
        <div v-for="alert in recentAlerts" :key="alert.id" class="alert-item" :class="alert.priority">
          <div class="alert-icon">
            <i :class="alert.icon"></i>
          </div>
          <div class="alert-details">
            <div class="alert-text">{{ alert.message }}</div>
            <div class="alert-time">{{ alert.time }}</div>
          </div>
          <div class="alert-status" :class="alert.status">
            {{ alert.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BeaconHarborView',
  data() {
    return {
      stats: {
        activeAlerts: 3,
        criticalToday: 1,
        resolutionRate: 94
      },
      recentAlerts: [
        {
          id: 1,
          message: 'Alto uso de CPU no servidor principal',
          time: '2 minutos atrás',
          priority: 'critical',
          status: 'ativo',
          icon: 'fas fa-server'
        },
        {
          id: 2,
          message: 'Falha na conexão com banco de dados',
          time: '15 minutos atrás',
          priority: 'high',
          status: 'resolvido',
          icon: 'fas fa-database'
        },
        {
          id: 3,
          message: 'Backup diário concluído com sucesso',
          time: '1 hora atrás',
          priority: 'info',
          status: 'concluído',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          message: 'Atualização de segurança disponível',
          time: '2 horas atrás',
          priority: 'medium',
          status: 'pendente',
          icon: 'fas fa-shield-alt'
        }
      ]
    };
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Beacon...');
    },
    openModule() {
      window.open('http://localhost:7701/web/', '_blank');
    },
    createAlert() {
      console.log('Abrindo formulário de criação de alerta...');
    },
    openDashboard() {
      console.log('Abrindo dashboard de alertas...');
    },
    viewHistory() {
      console.log('Visualizando histórico de alertas...');
    },
    openSettings() {
      console.log('Abrindo configurações do Beacon...');
    }
  }
};
</script>

<style scoped>
.beacon-harbor-view {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  padding: 2rem;
  min-height: 100vh;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.view-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-title i {
  color: #f97316;
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
  font-weight: 600;
  color: #059669;
  font-size: 0.875rem;
}

.view-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online {
  background: #10b981;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-header i {
  color: #f97316;
  font-size: 1.25rem;
}

.card-header h3 {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.metric {
  text-align: center;
}

.metric .number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 0.5rem;
}

.metric .label {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.actions-panel {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.actions-panel h3 {
  margin: 0 0 1rem 0;
  color: #e2e8f0;
  font-size: 1.125rem;
  font-weight: 600;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: 1px solid #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

.recent-alerts {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recent-alerts h3 {
  margin: 0 0 1rem 0;
  color: #e2e8f0;
  font-size: 1.125rem;
  font-weight: 600;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border-left: 4px solid #6b7280;
}

.alert-item.critical {
  border-left-color: #ef4444;
}

.alert-item.high {
  border-left-color: #f97316;
}

.alert-item.medium {
  border-left-color: #eab308;
}

.alert-item.info {
  border-left-color: #10b981;
}

.alert-icon {
  width: 2rem;
  height: 2rem;
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-details {
  flex: 1;
}

.alert-text {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.875rem;
}

.alert-time {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.alert-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.alert-status.ativo {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.alert-status.resolvido {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.alert-status.concluído {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.alert-status.pendente {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
}
</style> 