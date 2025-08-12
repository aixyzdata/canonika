<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão Skipper -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-database"></i>
        <div class="title-content">
          <h1>Bancos de Dados</h1>
          <p>Bases de dados internas e externas</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button @click="syncData" class="btn btn-primary btn-sm">
          <i class="fas fa-sync me-2"></i>
          Sincronizar Dados
        </button>
        <button @click="refreshData" class="btn btn-secondary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <!-- Status da Fonte -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-signal"></i>
            </div>
            <div class="card-title">
              <h4>Status da Fonte</h4>
              <span class="card-subtitle">Informações da conexão</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Online</span>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">ONLINE</div>
              <div class="balance-label">Todas as bases conectadas</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Última Sincronização:</span>
                <span class="detail-value">2024-01-15 14:30:00</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Bases Ativas:</span>
                <span class="detail-value">5</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Sucesso:</span>
                <span class="detail-value">99.2%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bases Conectadas -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-database"></i>
            </div>
            <div class="card-title">
              <h4>Bases Conectadas</h4>
              <span class="card-subtitle">Bancos de dados ativos</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">5 Bases</span>
            </div>
          </div>
          <div class="card-content">
            <div class="databases-grid">
              <div v-for="db in databases" :key="db.id" class="database-item">
                <div class="database-icon">
                  <i :class="db.icon"></i>
                </div>
                <div class="database-details">
                  <div class="database-name">{{ db.name }}</div>
                  <div class="database-status" :class="db.status">
                    {{ db.statusText }}
                  </div>
                  <div class="database-metrics">
                    <span>{{ db.size }}</span>
                    <span>{{ db.connections }} conexões</span>
                  </div>
                </div>
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
              <span class="status-badge info">4 Métricas</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div v-for="metric in performanceMetrics" :key="metric.id" class="metric-item">
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
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="card-title">
              <h4>Configurações</h4>
              <span class="card-subtitle">Parâmetros do banco</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">4 Configs</span>
            </div>
          </div>
          <div class="card-content">
            <div class="config-list">
              <div v-for="config in dbConfigs" :key="config.id" class="config-item">
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
  name: 'FisherDatabasesView',
  data() {
    return {
      databases: [
        {
          id: 1,
          name: 'PostgreSQL',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-database',
          size: '2.5GB',
          connections: '25'
        },
        {
          id: 2,
          name: 'MySQL',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-database',
          size: '1.8GB',
          connections: '18'
        },
        {
          id: 3,
          name: 'MongoDB',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-database',
          size: '3.2GB',
          connections: '12'
        },
        {
          id: 4,
          name: 'Redis',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-memory',
          size: '512MB',
          connections: '8'
        },
        {
          id: 5,
          name: 'ClickHouse',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-chart-line',
          size: '5.1GB',
          connections: '15'
        }
      ],
      performanceMetrics: [
        {
          id: 1,
          name: 'Total de Dados',
          value: '13.1GB',
          label: 'armazenados',
          icon: 'fas fa-hdd'
        },
        {
          id: 2,
          name: 'Queries/min',
          value: '1,250',
          label: 'consultas',
          icon: 'fas fa-search'
        },
        {
          id: 3,
          name: 'Tempo Médio',
          value: '45ms',
          label: 'resposta',
          icon: 'fas fa-clock'
        },
        {
          id: 4,
          name: 'Conexões Ativas',
          value: '78',
          label: 'ativas',
          icon: 'fas fa-plug'
        }
      ],
      dbConfigs: [
        {
          id: 1,
          name: 'Connection Pool',
          value: '50 conexões',
          description: 'Pool máximo de conexões'
        },
        {
          id: 2,
          name: 'Query Timeout',
          value: '30s',
          description: 'Timeout de consultas'
        },
        {
          id: 3,
          name: 'Backup Schedule',
          value: 'Diário 02:00',
          description: 'Agendamento de backup'
        },
        {
          id: 4,
          name: 'Log Level',
          value: 'INFO',
          description: 'Nível de log do banco'
        }
      ]
    }
  },
  methods: {
    syncData() {
      console.log('Sincronizando dados dos bancos...')
      // Implementar lógica de sincronização
    },
    refreshData() {
      console.log('Atualizando dados dos bancos...')
      // Implementar lógica de atualização
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do DatabasesView mantidos */
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

.databases-grid {
  display: grid;
  gap: 0.75rem;
}

.database-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.database-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d1fae5;
  color: #10b981;
  flex-shrink: 0;
}

.database-details {
  flex: 1;
}

.database-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.database-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.database-status.online {
  background-color: #d1fae5;
  color: #10b981;
}

.database-status.offline {
  background-color: #fee2e2;
  color: #ef4444;
}

.database-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.metric-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d1fae5;
  color: #10b981;
  flex-shrink: 0;
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 0.25rem;
}

.metric-label {
  color: #6b7280;
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

<style>
@import '../../../../../shared/styles/canonika-view.css';
</style> 