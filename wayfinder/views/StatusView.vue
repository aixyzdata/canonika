<template>
  <CanonikaViewTemplate
    title="Status do Wayfinder"
    description="Monitoramento e Status do Sistema de Navegação"
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
  name: 'WayfinderStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '11d 9h 15m',
        port: '3717',
        version: '1.4.2'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Rotas Ativas',
          value: '156',
          description: 'Rotas Calculadas',
          icon: 'fas fa-route'
        },
        {
          id: 2,
          name: 'Tempo Médio',
          value: '23min',
          description: 'Tempo de Viagem',
          icon: 'fas fa-clock'
        },
        {
          id: 3,
          name: 'Score de Tráfego',
          value: '8.5/10',
          description: 'Condições de Tráfego',
          icon: 'fas fa-chart-line'
        },
        {
          id: 4,
          name: 'Eficiência',
          value: '92%',
          description: 'Economia de Combustível',
          icon: 'fas fa-gas-pump'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Nova Rota Calculada',
          message: 'Rota otimizada para destino',
          timestamp: '2025-07-27 23:59:30',
          icon: 'fas fa-route'
        },
        {
          id: 2,
          level: 'info',
          title: 'Tráfego Atualizado',
          message: 'Condições de tráfego atualizadas',
          timestamp: '2025-07-27 23:56:15',
          icon: 'fas fa-traffic-light'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Desvio Aplicado',
          message: 'Rota alterada devido a obstáculo',
          timestamp: '2025-07-27 23:53:45',
          icon: 'fas fa-arrow-right'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Preferência de Rota',
          value: 'Mais Rápida',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Atualizações de Tráfego',
          value: 'A cada 5 minutos',
          status: 'Configurado'
        },
        {
          id: 3,
          name: 'Modo Econômico',
          value: 'Ativado',
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
      console.log('Refreshing Wayfinder status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../shared/styles/canonika-view.css';
</style> 