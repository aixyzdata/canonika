<template>
  <div class="canonika-view">
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

<style scoped>
/* Estilos específicos do StatusView mantidos */
.balance-display {
  text-align: center;
  margin-bottom: 1rem;
}

.balance-value {
  font-size: 2rem;
  font-weight: bold;
  color: #10b981;
}

.balance-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.balance-details {
  display: grid;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.detail-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
  color: #1f2937;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.transaction-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d1fae5;
  color: #10b981;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.transaction-amount {
  color: #10b981;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.transaction-time {
  color: #6b7280;
  font-size: 0.75rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.alert-item.success {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
}

.alert-item.info {
  background-color: #eff6ff;
  border-color: #bfdbfe;
}

.alert-item.warning {
  background-color: #fffbeb;
  border-color: #fed7aa;
}

.alert-item.error {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.alert-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-item.success .alert-icon {
  background-color: #d1fae5;
  color: #10b981;
}

.alert-item.info .alert-icon {
  background-color: #dbeafe;
  color: #3b82f6;
}

.alert-item.warning .alert-icon {
  background-color: #fef3c7;
  color: #f59e0b;
}

.alert-item.error .alert-icon {
  background-color: #fee2e2;
  color: #ef4444;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.alert-message {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.alert-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.config-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.config-value {
  color: #10b981;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.config-description {
  color: #6b7280;
  font-size: 0.875rem;
}
</style> 