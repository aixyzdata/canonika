<template>
  <CanonikaViewTemplate
    title="Bancos de Dados"
    description="Bases de dados internas"
    header-icon="fas fa-database"
    status-text="ONLINE"
    :primary-action="{
      text: 'Sincronizar Dados',
      icon: 'fas fa-sync',
      handler: syncData
    }"
    @refresh="refreshData"
  >
    <div class="service-cards">
      <!-- Status da Fonte -->
      <div class="service-card">
        <div class="card-header">
          <h3>Status da Fonte</h3>
          <div class="card-icon">
            <i class="fas fa-signal"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="balance-display">
            <div class="balance-value">{{ sourceStatus.status }}</div>
            <div class="balance-label">{{ sourceStatus.description }}</div>
          </div>
          <div class="balance-details">
            <div class="detail-item">
              <span class="detail-label">Última Sincronização:</span>
              <span class="detail-value">{{ sourceStatus.lastSync }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Bancos Conectados:</span>
              <span class="detail-value">{{ sourceStatus.connectedDatabases }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Taxa de Sucesso:</span>
              <span class="detail-value">{{ sourceStatus.successRate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bancos Conectados -->
      <div class="service-card">
        <div class="card-header">
          <h3>Bancos Conectados</h3>
          <div class="card-icon">
            <i class="fas fa-server"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="databases-grid">
            <div v-for="database in databases" :key="database.id" class="database-item">
              <div class="database-icon">
                <i :class="database.icon"></i>
              </div>
              <div class="database-details">
                <div class="database-name">{{ database.name }}</div>
                <div class="database-status" :class="database.status">
                  {{ database.statusText }}
                </div>
                <div class="database-metrics">
                  <span>{{ database.tables }} tabelas</span>
                  <span>{{ database.size }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas de Dados -->
      <div class="service-card">
        <div class="card-header">
          <h3>Métricas de Dados</h3>
          <div class="card-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="metrics-grid">
            <div v-for="metric in dataMetrics" :key="metric.id" class="metric-item">
              <div class="metric-icon">
                <i :class="metric.icon"></i>
              </div>
              <div class="metric-details">
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-label">{{ metric.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configurações -->
      <div class="service-card">
        <div class="card-header">
          <h3>Configurações</h3>
          <div class="card-icon">
            <i class="fas fa-cog"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="config-list">
            <div v-for="config in configurations" :key="config.id" class="config-item">
              <div class="config-label">{{ config.name }}</div>
              <div class="config-value">{{ config.value }}</div>
              <div class="config-status" :class="config.status">
                {{ config.statusText }}
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
          <div class="logs-list">
            <div v-for="log in recentLogs" :key="log.id" :class="`log-item ${log.level}`">
              <div class="log-icon">
                <i :class="log.icon"></i>
              </div>
              <div class="log-content">
                <div class="log-title">{{ log.title }}</div>
                <div class="log-message">{{ log.message }}</div>
                <div class="log-time">{{ log.timestamp }}</div>
              </div>
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
  name: 'DatabasesView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      sourceStatus: {
        status: 'ONLINE',
        description: 'Conexão ativa com bancos de dados',
        lastSync: '2024-01-15 14:30:00',
        connectedDatabases: '4/4',
        successRate: '99.9%'
      },
      databases: [
        {
          id: 1,
          name: 'PostgreSQL',
          status: 'online',
          statusText: 'ATIVO',
          tables: '150',
          size: '2.1GB',
          icon: 'fas fa-database'
        },
        {
          id: 2,
          name: 'MySQL',
          status: 'online',
          statusText: 'ATIVO',
          tables: '85',
          size: '1.8GB',
          icon: 'fas fa-database'
        },
        {
          id: 3,
          name: 'MongoDB',
          status: 'online',
          statusText: 'ATIVO',
          tables: '45',
          size: '3.2GB',
          icon: 'fas fa-database'
        },
        {
          id: 4,
          name: 'Redis',
          status: 'online',
          statusText: 'ATIVO',
          tables: '12',
          size: '512MB',
          icon: 'fas fa-memory'
        }
      ],
      dataMetrics: [
        {
          id: 1,
          value: '292',
          label: 'Tabelas Totais',
          icon: 'fas fa-table'
        },
        {
          id: 2,
          value: '7.6GB',
          label: 'Dados Armazenados',
          icon: 'fas fa-hdd'
        },
        {
          id: 3,
          value: '1.2M',
          label: 'Registros Processados',
          icon: 'fas fa-list'
        },
        {
          id: 4,
          value: '99.9%',
          label: 'Taxa de Disponibilidade',
          icon: 'fas fa-check-circle'
        }
      ],
      configurations: [
        {
          id: 1,
          name: 'Connection Pool',
          value: '20 conexões',
          status: 'online',
          statusText: 'ATIVO'
        },
        {
          id: 2,
          name: 'Backup Automático',
          value: 'Diário às 02:00',
          status: 'online',
          statusText: 'CONFIGURADO'
        },
        {
          id: 3,
          name: 'Timeout de Query',
          value: '30 segundos',
          status: 'online',
          statusText: 'OK'
        },
        {
          id: 4,
          name: 'Replicação',
          value: 'Ativa',
          status: 'online',
          statusText: 'ATIVO'
        }
      ],
      recentLogs: [
        {
          id: 1,
          title: 'Backup PostgreSQL',
          message: 'Backup automático concluído com sucesso',
          timestamp: '2 min atrás',
          level: 'success',
          icon: 'fas fa-check-circle'
        },
        {
          id: 2,
          title: 'Sincronização MySQL',
          message: '150 registros sincronizados',
          timestamp: '15 min atrás',
          level: 'info',
          icon: 'fas fa-info-circle'
        },
        {
          id: 3,
          title: 'Limpeza MongoDB',
          message: 'Cache limpo e otimizado',
          timestamp: '1 hora atrás',
          level: 'info',
          icon: 'fas fa-database'
        },
        {
          id: 4,
          title: 'Monitoramento Redis',
          message: 'Performance dentro dos parâmetros',
          timestamp: '2 horas atrás',
          level: 'info',
          icon: 'fas fa-chart-line'
        }
      ]
    }
  },
  methods: {
    refreshData() {
      console.log('Refreshing Databases data...')
      // Implementar refresh dos dados
    },
    syncData() {
      console.log('Synchronizing Databases data...')
      // Implementar sincronização
    }
  }
}
</script>

<style scoped>
.databases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.database-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.database-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.database-details {
  flex: 1;
}

.database-name {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.database-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
  display: inline-block;
}

.database-status.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.database-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.database-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.metric-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
}

.metric-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.config-label {
  color: #e2e8f0;
  font-weight: 600;
  flex: 1;
}

.config-value {
  color: #94a3b8;
  font-size: 0.875rem;
  flex: 2;
  text-align: center;
}

.config-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  flex: 1;
  text-align: center;
}

.config-status.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.config-status.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.log-item.success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.log-item.info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.log-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.log-item.error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.log-icon {
  font-size: 1rem;
  margin-top: 0.125rem;
}

.log-item.success .log-icon {
  color: #22c55e;
}

.log-item.info .log-icon {
  color: #3b82f6;
}

.log-item.warning .log-icon {
  color: #f59e0b;
}

.log-item.error .log-icon {
  color: #ef4444;
}

.log-content {
  flex: 1;
}

.log-title {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.log-message {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.log-time {
  color: #64748b;
  font-size: 0.75rem;
}
</style>

<style>
@import '../../../../../shared/styles/canonika-view.css';
</style> 