<template>
  <CanonikaViewTemplate
    title="Status do Diver"
    description="Monitoramento e Status do Tripulante de Consulta"
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
import CanonikaViewTemplate from '../../../../shared/templates/CanonikaViewTemplate.vue'

export default {
  name: 'DiverStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '15d 7h 32m',
        port: '3702',
        version: '1.2.0'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Consultas por Minuto',
          value: '45.2',
          description: 'Média dos últimos 5 minutos',
          icon: 'fas fa-search'
        },
        {
          id: 2,
          name: 'Tempo de Resposta',
          value: '1.2s',
          description: 'Tempo médio de resposta',
          icon: 'fas fa-clock'
        },
        {
          id: 3,
          name: 'Taxa de Sucesso',
          value: '98.5%',
          description: 'Consultas bem-sucedidas',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          name: 'Erros por Hora',
          value: '0.3',
          description: 'Média de erros por hora',
          icon: 'fas fa-exclamation-triangle'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'info',
          title: 'Consulta realizada',
          message: 'Produto EAN 7891234567890 consultado com sucesso',
          timestamp: '2025-07-27 23:45:12',
          icon: 'fas fa-info-circle'
        },
        {
          id: 2,
          level: 'success',
          title: 'Cache atualizado',
          message: 'Cache de produtos atualizado com 1.2k novos registros',
          timestamp: '2025-07-27 23:42:30',
          icon: 'fas fa-check-circle'
        },
        {
          id: 3,
          level: 'warning',
          title: 'API externa lenta',
          message: 'Tempo de resposta da API externa acima do esperado',
          timestamp: '2025-07-27 23:40:15',
          icon: 'fas fa-exclamation-triangle'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Cache TTL',
          value: '3600s',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Rate Limit',
          value: '100/min',
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
          name: 'Auto Restart',
          value: 'Enabled',
          status: 'Ativo'
        }
      ]
    }
  },
  methods: {
    refreshStatus() {
      console.log('Refreshing Diver status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../../../shared/styles/canonika-view.css';
</style> 