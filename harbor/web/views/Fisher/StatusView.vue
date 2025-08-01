<template>
  <CanonikaViewTemplate
    title="Status do Fisher"
    description="Monitoramento e Status do Tripulante de Pesca"
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
import CanonikaViewTemplate from 'shared/templates/CanonikaViewTemplate.vue'

export default {
  name: 'FisherStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '12d 4h 18m',
        port: '3703',
        version: '1.1.5'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Missões por Hora',
          value: '8.5',
          description: 'Média dos últimos 60 minutos',
          icon: 'fas fa-rocket'
        },
        {
          id: 2,
          name: 'Dados Processados',
          value: '2.3GB',
          description: 'Volume processado hoje',
          icon: 'fas fa-database'
        },
        {
          id: 3,
          name: 'Taxa de Sucesso',
          value: '94.2%',
          description: 'Missões bem-sucedidas',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          name: 'Fontes Ativas',
          value: '12',
          description: 'Fontes de dados ativas',
          icon: 'fas fa-fish'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Missão concluída',
          message: 'Pesca de dados da Receita Federal concluída com sucesso',
          timestamp: '2025-07-27 23:48:22',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          level: 'info',
          title: 'Nova fonte adicionada',
          message: 'Fonte Open Food Facts configurada e testada',
          timestamp: '2025-07-27 23:45:10',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Fonte temporariamente indisponível',
          message: 'API da Receita Federal com resposta lenta',
          timestamp: '2025-07-27 23:42:05',
          icon: 'fas fa-exclamation-triangle'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Intervalo de Pesca',
          value: '30min',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Retry Policy',
          value: '3 tentativas',
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
          name: 'Auto Recovery',
          value: 'Enabled',
          status: 'Ativo'
        }
      ]
    }
  },
  methods: {
    refreshStatus() {
      console.log('Refreshing Fisher status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../../shared/styles/canonika-view.css';
</style> 