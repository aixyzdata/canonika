<template>
  <CanonikaViewTemplate
    title="Status do Quarter"
    description="Monitoramento e Status do Sistema de Gestão de Usuários"
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
  name: 'QuarterStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '18d 12h 45m',
        port: '3714',
        version: '1.3.2'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Usuários Ativos',
          value: '1.156',
          description: 'Logados hoje',
          icon: 'fas fa-users'
        },
        {
          id: 2,
          name: 'Novos Registros',
          value: '89',
          description: 'Registrados hoje',
          icon: 'fas fa-user-plus'
        },
        {
          id: 3,
          name: 'Taxa de Sucesso',
          value: '99.2%',
          description: 'Logins bem-sucedidos',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          name: 'Administradores',
          value: '12',
          description: 'Usuários admin ativos',
          icon: 'fas fa-shield-alt'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Novo usuário registrado',
          message: 'João Silva criou sua conta com sucesso',
          timestamp: '2025-07-27 23:50:15',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          level: 'info',
          title: 'Login realizado',
          message: 'Maria Santos fez login no sistema',
          timestamp: '2025-07-27 23:48:30',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Tentativa de login falhou',
          message: 'Tentativa de login com credenciais inválidas',
          timestamp: '2025-07-27 23:45:12',
          icon: 'fas fa-exclamation-triangle'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Timeout de Sessão',
          value: '24 horas',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Política de Senhas',
          value: 'Mínimo 8 caracteres',
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
          name: 'Auto Backup',
          value: 'Enabled',
          status: 'Ativo'
        }
      ]
    }
  },
  methods: {
    refreshStatus() {
      console.log('Refreshing Quarter status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../../../shared/styles/canonika-view.css';
</style> 