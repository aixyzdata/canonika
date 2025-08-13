<template>
  <div class="tollgate-view">
    <!-- View Header seguindo padrão Skipper -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-chart-line"></i>
        <div class="title-content">
          <h1>Status do Fisher</h1>
          <p>Monitoramento e Status do Tripulante de Pesca</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button @click="refreshStatus" class="btn btn-primary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar Status
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-cog me-2"></i>
          Configurações
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <!-- Status do Serviço -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-server"></i>
            </div>
            <div class="card-title">
              <h4>Status do Serviço</h4>
              <span class="card-subtitle">Informações do sistema</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">{{ serviceStatus.status }}</span>
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
            <div class="card-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="card-title">
              <h4>Métricas de Performance</h4>
              <span class="card-subtitle">Indicadores de desempenho</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">{{ performanceMetrics.length }} Métricas</span>
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
            <div class="card-icon">
              <i class="fas fa-list-alt"></i>
            </div>
            <div class="card-title">
              <h4>Logs Recentes</h4>
              <span class="card-subtitle">Registros do sistema</span>
            </div>
            <div class="card-actions">
              <span class="status-badge warning">{{ recentLogs.length }} Logs</span>
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
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="card-title">
              <h4>Configurações</h4>
              <span class="card-subtitle">Parâmetros do sistema</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">{{ systemConfig.length }} Configs</span>
            </div>
          </div>
          <div class="card-content">
            <div class="config-list">
              <div v-for="config in systemConfig" :key="config.id" class="config-item">
                <div class="config-name">{{ config.name }}</div>
                <div class="config-value">{{ config.value }}</div>
                <div class="config-description">{{ config.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FisherStatusView',
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        description: 'Sistema funcionando normalmente',
        uptime: '99.9%',
        port: '3705',
        version: '1.0.0'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'CPU Usage',
          value: '15%',
          description: 'Uso de processador',
          icon: 'fas fa-microchip'
        },
        {
          id: 2,
          name: 'Memory Usage',
          value: '45%',
          description: 'Uso de memória',
          icon: 'fas fa-memory'
        },
        {
          id: 3,
          name: 'Disk Usage',
          value: '30%',
          description: 'Uso de disco',
          icon: 'fas fa-hdd'
        },
        {
          id: 4,
          name: 'Network',
          value: '2.5 MB/s',
          description: 'Tráfego de rede',
          icon: 'fas fa-network-wired'
        }
      ],
      recentLogs: [
        {
          id: 1,
          title: 'Sincronização SEFAZ',
          message: '2.1K registros processados com sucesso',
          timestamp: '2 min atrás',
          level: 'success',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          title: 'Atualização Marketplaces',
          message: '1.8K produtos atualizados',
          timestamp: '15 min atrás',
          level: 'info',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          title: 'Backup Automático',
          message: 'Database backup realizado com sucesso',
          timestamp: '1 hora atrás',
          level: 'success',
          icon: 'fas fa-database'
        },
        {
          id: 4,
          title: 'Limpeza de Cache',
          message: 'Cache limpo com sucesso',
          timestamp: '2 horas atrás',
          level: 'warning',
          icon: 'fas fa-broom'
        }
      ],
      systemConfig: [
        {
          id: 1,
          name: 'API Rate Limit',
          value: '1000 req/min',
          description: 'Limite de requisições por minuto'
        },
        {
          id: 2,
          name: 'Cache TTL',
          value: '3600s',
          description: 'Tempo de vida do cache'
        },
        {
          id: 3,
          name: 'Database Pool',
          value: '10 connections',
          description: 'Pool de conexões do banco'
        },
        {
          id: 4,
          name: 'Log Level',
          value: 'INFO',
          description: 'Nível de log do sistema'
        }
      ]
    }
  },
  methods: {
    refreshStatus() {
      console.log('Atualizando status do Fisher...')
      // Implementar lógica de atualização
    }
  }
}
</script>

