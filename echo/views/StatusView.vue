<template>
  <CanonikaViewTemplate
    title="Status do Echo"
    description="Monitoramento e Status do Sistema de Comunicação"
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
  name: 'EchoStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '12d 6h 18m',
        port: '3707',
        version: '1.1.5'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Chats Ativos',
          value: '12',
          description: 'Conversas em Andamento',
          icon: 'fas fa-comments'
        },
        {
          id: 2,
          name: 'Mensagens Hoje',
          value: '1.247',
          description: 'Total de Mensagens',
          icon: 'fas fa-envelope'
        },
        {
          id: 3,
          name: 'Tempo de Resposta',
          value: '1.2s',
          description: 'Média de Resposta',
          icon: 'fas fa-clock'
        },
        {
          id: 4,
          name: 'Satisfação',
          value: '4.8/5',
          description: 'Avaliação dos Usuários',
          icon: 'fas fa-smile'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Nova Conversa',
          message: 'Usuário iniciou chat de suporte',
          timestamp: '2025-07-27 23:58:15',
          icon: 'fas fa-plus'
        },
        {
          id: 2,
          level: 'info',
          title: 'Mensagem Enviada',
          message: 'Resposta automática enviada',
          timestamp: '2025-07-27 23:55:30',
          icon: 'fas fa-paper-plane'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Chat Finalizado',
          message: 'Conversa marcada como resolvida',
          timestamp: '2025-07-27 23:50:45',
          icon: 'fas fa-check'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Resposta Automática',
          value: 'Ativada',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Máximo de Chats',
          value: '50 simultâneos',
          status: 'Configurado'
        },
        {
          id: 3,
          name: 'Idioma Principal',
          value: 'Português',
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
      console.log('Refreshing Echo status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../shared/styles/canonika-view.css';
</style> 