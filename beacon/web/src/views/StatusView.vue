<template>
  <CanonikaViewTemplate
    title="Status do Beacon"
    description="Monitoramento e Status do Sistema de Sinalização"
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
import CanonikaViewTemplate from '../components/CanonikaViewTemplate.vue'
import { getServiceConfig } from '../config/status-configs.js'

export default {
  name: 'BeaconStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '15d 8h 32m',
        port: '3701',
        version: '1.2.1'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Sinais Ativos',
          value: '15',
          description: 'Sinais Transmitindo',
          icon: 'fas fa-broadcast-tower'
        },
        {
          id: 2,
          name: 'Notificações Enviadas',
          value: '2.847',
          description: 'Hoje',
          icon: 'fas fa-bell'
        },
        {
          id: 3,
          name: 'Taxa de Entrega',
          value: '99.8%',
          description: 'Notificações Entregues',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          name: 'Tempo de Resposta',
          value: '0.3s',
          description: 'Média de Resposta',
          icon: 'fas fa-clock'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Sinal Transmitido',
          message: 'Notificação de sistema enviada',
          timestamp: '2025-07-27 23:55:30',
          icon: 'fas fa-broadcast-tower'
        },
        {
          id: 2,
          level: 'info',
          title: 'Alerta Processado',
          message: 'Alerta de segurança processado',
          timestamp: '2025-07-27 23:52:15',
          icon: 'fas fa-exclamation-triangle'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Broadcast Concluído',
          message: 'Broadcast para todos os usuários',
          timestamp: '2025-07-27 23:48:45',
          icon: 'fas fa-bullhorn'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Força do Sinal',
          value: 'Alta',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Fila de Notificações',
          value: '0 pendentes',
          status: 'Configurado'
        },
        {
          id: 3,
          name: 'Tentativas Automáticas',
          value: '3 tentativas',
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
      console.log('Refreshing Beacon status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../styles/canonika-view.css';
</style> 