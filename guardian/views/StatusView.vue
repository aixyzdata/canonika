<template>
  <CanonikaViewTemplate
    title="Status do Guardian"
    description="Monitoramento e Status do Sistema de Segurança"
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
  name: 'GuardianStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '25d 14h 22m',
        port: '3704',
        version: '2.1.3'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Ameaças Ativas',
          value: '0',
          description: 'Sem ameaças detectadas',
          icon: 'fas fa-shield-check'
        },
        {
          id: 2,
          name: 'Ataques Bloqueados',
          value: '127',
          description: 'Nas últimas 24h',
          icon: 'fas fa-ban'
        },
        {
          id: 3,
          name: 'Score de Segurança',
          value: '98/100',
          description: 'Nível de Proteção',
          icon: 'fas fa-star'
        },
        {
          id: 4,
          name: 'Dados Criptografados',
          value: '100%',
          description: 'Transmissão Segura',
          icon: 'fas fa-lock'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Ataque Bloqueado',
          message: 'Tentativa de SQL Injection bloqueada',
          timestamp: '2025-07-27 23:59:30',
          icon: 'fas fa-shield-alt'
        },
        {
          id: 2,
          level: 'info',
          title: 'Certificado Renovado',
          message: 'SSL certificate atualizado automaticamente',
          timestamp: '2025-07-27 23:55:15',
          icon: 'fas fa-certificate'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Backup Realizado',
          message: 'Backup de segurança concluído',
          timestamp: '2025-07-27 23:50:45',
          icon: 'fas fa-save'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Regras de Firewall',
          value: '247 regras ativas',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Nível de Criptografia',
          value: 'AES-256-GCM',
          status: 'Configurado'
        },
        {
          id: 3,
          name: 'Frequência de Backup',
          value: 'A cada 6 horas',
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
      console.log('Refreshing Guardian status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../shared/styles/canonika-view.css';
</style> 