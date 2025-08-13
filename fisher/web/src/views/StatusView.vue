<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão do Beacon -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-chart-line"></i>
        <div class="title-content">
          <h1>Status</h1>
          <p>Monitoramento do Sistema Fisher</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Online</span>
      </div>
      <div class="view-actions">
        <button @click="refreshStatus" class="btn btn-primary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar
        </button>
        <button @click="exportLogs" class="btn btn-secondary btn-sm">
          <i class="fas fa-download me-2"></i>
          Exportar Logs
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status do Serviço -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-server text-success me-2"></i>
            Status do Serviço
          </h3>
          <p class="section-description">
            Informações sobre o estado atual do Fisher.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-server"></i>
                </div>
                <div class="card-title">
                  <h4>Fisher Service</h4>
                  <span class="card-subtitle">localhost:3706</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Online</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ serviceStatus.status }}</span>
                    <span class="metric-label">Status</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ serviceStatus.uptime }}</span>
                    <span class="metric-label">Uptime</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ serviceStatus.version }}</span>
                    <span class="metric-label">Versão</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ serviceStatus.port }}</span>
                    <span class="metric-label">Porta</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-tachometer-alt"></i>
                </div>
                <div class="card-title">
                  <h4>Performance</h4>
                  <span class="card-subtitle">Métricas do sistema</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Normal</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ performanceMetrics.cpu }}%</span>
                    <span class="metric-label">CPU</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ performanceMetrics.memory }}%</span>
                    <span class="metric-label">Memória</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ performanceMetrics.disk }}%</span>
                    <span class="metric-label">Disco</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ performanceMetrics.network }}MB/s</span>
                    <span class="metric-label">Rede</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-list-alt"></i>
                </div>
                <div class="card-title">
                  <h4>Logs Recentes</h4>
                  <span class="card-subtitle">Últimas atividades</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">{{ recentLogs.length }} Logs</span>
                </div>
              </div>
              <div class="card-content">
                <div class="log-list">
                  <div 
                    v-for="log in recentLogs" 
                    :key="log.id" 
                    class="log-item"
                  >
                    <div class="log-timestamp">{{ log.timestamp }}</div>
                    <div class="log-level" :class="`log-${log.level}`">{{ log.level }}</div>
                    <div class="log-message">{{ log.message }}</div>
                  </div>
                </div>
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
  name: 'StatusView',
  data() {
    return {
      serviceStatus: {
        status: 'ONLINE',
        uptime: '2d 14h 32m',
        version: '1.0.0',
        port: '3706'
      },
      performanceMetrics: {
        cpu: 15,
        memory: 45,
        disk: 23,
        network: 2.5
      },
      recentLogs: [
        {
          id: 1,
          timestamp: '14:32:15',
          level: 'info',
          message: 'Sistema iniciado com sucesso'
        },
        {
          id: 2,
          timestamp: '14:30:22',
          level: 'info',
          message: 'Coleta de dados SEFAZ iniciada'
        },
        {
          id: 3,
          timestamp: '14:28:45',
          level: 'warning',
          message: 'Tentativa de reconexão com API externa'
        },
        {
          id: 4,
          timestamp: '14:25:10',
          level: 'success',
          message: 'Backup automático concluído'
        },
        {
          id: 5,
          timestamp: '14:20:33',
          level: 'info',
          message: 'Verificação de integridade executada'
        }
      ]
    }
  },
  methods: {
    refreshStatus() {
      console.log('Atualizando status do Fisher...')
      // Lógica para atualizar status
    },
    exportLogs() {
      console.log('Exportando logs...')
      // Lógica para exportar logs
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do Status seguindo padrão Beacon */
.log-list {
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
}

.log-timestamp {
  color: #94a3b8;
  min-width: 60px;
}

.log-level {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  min-width: 50px;
  text-align: center;
}

.log-level.log-info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.log-level.log-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.log-level.log-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.log-level.log-error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.log-message {
  color: #e2e8f0;
  flex: 1;
}
</style>

