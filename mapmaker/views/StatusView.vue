<template>
  <CanonikaViewTemplate
    title="Status do Mapmaker"
    description="Monitoramento e Status do Sistema de Criação de Mapas"
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
  name: 'MapmakerStatusView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Serviço funcionando normalmente',
        uptime: '8d 12h 45m',
        port: '3712',
        version: '1.0.8'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'Mapas Ativos',
          value: '47',
          description: 'Mapas em Uso',
          icon: 'fas fa-map'
        },
        {
          id: 2,
          name: 'Camadas Totais',
          value: '2.847',
          description: 'Camadas Criadas',
          icon: 'fas fa-layer-group'
        },
        {
          id: 3,
          name: 'Armazenamento',
          value: '45.2GB',
          description: 'Espaço Utilizado',
          icon: 'fas fa-hdd'
        },
        {
          id: 4,
          name: 'Tempo de Processamento',
          value: '1.8s',
          description: 'Média por Mapa',
          icon: 'fas fa-stopwatch'
        }
      ],
      recentLogs: [
        {
          id: 1,
          level: 'success',
          title: 'Mapa Criado',
          message: 'Novo mapa de rotas criado',
          timestamp: '2025-07-27 23:58:30',
          icon: 'fas fa-plus'
        },
        {
          id: 2,
          level: 'info',
          title: 'Camada Adicionada',
          message: 'Camada de tráfego atualizada',
          timestamp: '2025-07-27 23:55:15',
          icon: 'fas fa-layer-group'
        },
        {
          id: 3,
          level: 'warning',
          title: 'Exportação Concluída',
          message: 'Mapa exportado em PDF',
          timestamp: '2025-07-27 23:50:45',
          icon: 'fas fa-download'
        }
      ],
      systemConfigs: [
        {
          id: 1,
          name: 'Máximo de Mapas',
          value: '1.000 simultâneos',
          status: 'Ativo'
        },
        {
          id: 2,
          name: 'Formato de Tiles',
          value: 'PNG 256x256',
          status: 'Configurado'
        },
        {
          id: 3,
          name: 'Tamanho do Cache',
          value: '10GB',
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
      console.log('Refreshing Mapmaker status...')
      // Aqui você implementaria a chamada real para a API
    }
  }
}
</script>

<style>
@import '../../shared/styles/canonika-view.css';
</style> 