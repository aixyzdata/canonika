<template>
  <CanonikaViewTemplate
    title="Status do Seagull"
    description="Monitoramento e Status do Sistema de Vigilância"
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
  name: 'SeagullStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '19d 7h 33m',
        port: '3715',
        version: '1.3.7'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Câmeras Ativas',
          value: '24',
          description: 'Câmeras Online',
          icon: 'fas fa-video'
        },
        {
          id: 2,
          name: 'Taxa de Detecção',
          value: '98.5%',
          description: 'Precisão de Detecção',
          icon: 'fas fa-bullseye'
        },
        {
          id: 3,
          name: 'Alertas Hoje',
          value: '47',
          description: 'Eventos Detectados',
          icon: 'fas fa-bell'
        },
        {
          id: 4,
          name: 'Armazenamento',
          value: '2.3TB',
          description: 'Gravações Salvadas',
          icon: 'fas fa-hdd'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Movimento Detectado',
          message: 'Atividade detectada na câmera 3',
          timestamp: '2025-07-27 23:59:45',
          icon: 'fas fa-running'
        },
        {
          id: 2,
          level: 'info',
          title: 'Alerta Processado',
          message: 'Análise de segurança concluída',
          timestamp: '2025-07-27 23:56:30',
          icon: 'fas fa-shield-check'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Backup Realizado',
          message: 'Gravações salvas automaticamente',
          timestamp: '2025-07-27 23:52:15',
          icon: 'fas fa-save'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Qualidade de Gravação',
          value: '1080p HD',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Sensibilidade de Movimento',
          value: 'Média',
          status: 'Configurado'
        },
        {
          id: 3,
          name: 'Período de Retenção',
          value: '30 dias',
          status: 'Ativo'
        },
        {
          id: 4,
          name: 'Log Level',
          value: 'INFO',
          status: 'Ativo'
        }
      ]
    }
  },
  methods: {
    refreshStatus() {
      console.log('Refreshing Seagull status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../shared/styles/canonika-view.css';
</style> 