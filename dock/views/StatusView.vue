<template>
  <CanonikaViewTemplate
    title="Status do Dock"
    description="Monitoramento e Status do Sistema de Docking"
    header-icon="fas fa-chart-line"
    status-text="ONLINE"
    :primary-action="{
      text: 'Atualizar Status',
      icon: 'fas fa-sync-alt',
      handler: refreshStatus
    }"
    @refresh="refreshStatus"
  >
    <div class="service-cards">
      <!-- Status do Serviço -->
      <div class="service-card">
        <div class="card-header">
          <h3>Status do Serviço</h3>
          <div class="card-icon">
            <i class="fas fa-server"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="balance-display">
            <div class="balance-value">{{ serviceStatus.status }}</div>
            <div class="balance-label">{{ serviceStatus.description }}</div>
          </div>
          <div class="balance-details">
            <div class="detail-item">
              <span class="detail-label">Uptime:</span>
              <span class="detail-value">{{ serviceStatus.uptime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Porta:</span>
              <span class="detail-value">{{ serviceStatus.port }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Versão:</span>
              <span class="detail-value">{{ serviceStatus.version }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas de Performance -->
      <div class="service-card">
        <div class="card-header">
          <h3>Métricas de Performance</h3>
          <div class="card-icon">
            <i class="fas fa-tachometer-alt"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="transaction-list">
            <div v-for="metric in performanceMetrics" :key="metric.id" class="transaction-item">
              <div class="transaction-icon success">
                <i :class="metric.icon"></i>
              </div>
              <div class="transaction-details">
                <div class="transaction-title">{{ metric.name }}</div>
                <div class="transaction-amount success">
                  {{ metric.value }}
                </div>
                <div class="transaction-time">{{ metric.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs Recentes -->
      <div class="service-card">
        <div class="card-header">
          <h3>Logs Recentes</h3>
          <div class="card-icon">
            <i class="fas fa-list-alt"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="alerts-list">
            <div v-for="log in recentLogs" :key="log.id" :class="`alert-item ${log.level}`">
              <div class="alert-icon">
                <i :class="log.icon"></i>
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ log.title }}</div>
                <div class="alert-message">{{ log.message }}</div>
                <div class="alert-time">{{ log.timestamp }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configurações do Sistema -->
      <div class="service-card">
        <div class="card-header">
          <h3>Configurações</h3>
          <div class="card-icon">
            <i class="fas fa-cog"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="plans-grid">
            <div 
              v-for="config in systemConfigs" 
              :key="config.id" 
              class="plan-item"
            >
              <div class="plan-name">{{ config.name }}</div>
              <div class="plan-price">{{ config.value }}</div>
              <div class="plan-credits">{{ config.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CanonikaViewTemplate>
</template>

<script>
import CanonikaViewTemplate from '../../shared/templates/CanonikaViewTemplate.vue'

export default {
  name: 'DockStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '22d 8h 15m',
        port: '3710',
        version: '1.1.8'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Docks Ativos',
          value: '8',
          description: 'Recursos conectados',
          icon: 'fas fa-link'
        },
        {
          id: 2,
          name: 'Uso de Recursos',
          value: '67%',
          description: 'Capacidade utilizada',
          icon: 'fas fa-chart-pie'
        },
        {
          id: 3,
          name: 'Velocidade de Conexão',
          value: '1.2GB/s',
          description: 'Taxa de transferência',
          icon: 'fas fa-tachometer-alt'
        },
        {
          id: 4,
          name: 'Tempo Ativo',
          value: '99.8%',
          description: 'Disponibilidade',
          icon: 'fas fa-clock'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Recurso conectado',
          message: 'Novo dispositivo dockado automaticamente',
          timestamp: '2025-07-27 23:52:30',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          level: 'info',
          title: 'Recurso desconectado',
          message: 'Dispositivo removido do dock',
          timestamp: '2025-07-27 23:50:15',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Atualização de firmware',
          message: 'Firmware atualizado com sucesso',
          timestamp: '2025-07-27 23:48:45',
          icon: 'fas fa-exclamation-triangle'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Máximo de Docks',
          value: '20 simultâneos',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Atualização Automática',
          value: 'Ativada',
          status: 'Configurado'
        },
        {
          id: 3,
          name: 'Log Level',
          value: 'INFO',
          status: 'Ativo'
        },
        {
          id: 4,
          name: 'Limite de Alerta',
          value: '80% de uso',
          status: 'Ativo'
        }
      ]
    }
  },
  methods: {
    refreshStatus() {
      console.log('Refreshing Dock status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../shared/styles/canonika-view.css';
</style> 