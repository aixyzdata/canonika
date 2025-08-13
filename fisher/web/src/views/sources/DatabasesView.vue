<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão do Beacon -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-database"></i>
        <div class="title-content">
          <h1>Bancos de Dados</h1>
          <p>Fontes de dados internas</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Conectado</span>
      </div>
      <div class="view-actions">
        <button @click="backupDatabases" class="btn btn-primary btn-sm">
          <i class="fas fa-download me-2"></i>
          Backup
        </button>
        <button @click="optimizeDatabases" class="btn btn-secondary btn-sm">
          <i class="fas fa-cog me-2"></i>
          Otimizar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status da Conexão -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-plug text-success me-2"></i>
            Status da Conexão
          </h3>
          <p class="section-description">
            Monitoramento dos bancos de dados internos.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-database"></i>
                </div>
                <div class="card-title">
                  <h4>Conexão Databases</h4>
                  <span class="card-subtitle">5 bancos conectados</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Conectado</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.activeDatabases }}</span>
                    <span class="metric-label">DBs Ativos</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.successRate }}%</span>
                    <span class="metric-label">Taxa Sucesso</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.avgResponse }}ms</span>
                    <span class="metric-label">Tempo Médio</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ connectionStatus.lastBackup }}</span>
                    <span class="metric-label">Último Backup</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <div class="card-title">
                  <h4>Estatísticas</h4>
                  <span class="card-subtitle">Dados armazenados</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.totalSize }}</span>
                    <span class="metric-label">Tamanho Total</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.totalRecords }}</span>
                    <span class="metric-label">Total Registros</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.performance }}%</span>
                    <span class="metric-label">Performance</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.connections }}</span>
                    <span class="metric-label">Conexões Ativas</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-server"></i>
                </div>
                <div class="card-title">
                  <h4>Bancos Conectados</h4>
                  <span class="card-subtitle">Instâncias ativas</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">{{ databases.length }} Ativos</span>
                </div>
              </div>
              <div class="card-content">
                <div class="databases-list">
                  <div 
                    v-for="database in databases" 
                    :key="database.id" 
                    class="database-item"
                  >
                    <div class="database-icon">
                      <i :class="database.icon"></i>
                    </div>
                    <div class="database-content">
                      <div class="database-name">{{ database.name }}</div>
                      <div class="database-status">{{ database.status }}</div>
                    </div>
                    <div class="database-metrics">
                      <span>{{ database.size }}</span>
                    </div>
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
  name: 'DatabasesView',
  data() {
    return {
      connectionStatus: {
        activeDatabases: 5,
        successRate: 99.8,
        avgResponse: 45,
        lastBackup: '2h atrás'
      },
      dataStats: {
        totalSize: '2.8GB',
        totalRecords: '15.2M',
        performance: 98.5,
        connections: 24
      },
      databases: [
        {
          id: 1,
          name: 'PostgreSQL Main',
          status: 'Online',
          icon: 'fas fa-database',
          size: '1.2GB'
        },
        {
          id: 2,
          name: 'MySQL Analytics',
          status: 'Online',
          icon: 'fas fa-chart-line',
          size: '850MB'
        },
        {
          id: 3,
          name: 'Redis Cache',
          status: 'Online',
          icon: 'fas fa-bolt',
          size: '320MB'
        },
        {
          id: 4,
          name: 'MongoDB Logs',
          status: 'Online',
          icon: 'fas fa-file-alt',
          size: '280MB'
        },
        {
          id: 5,
          name: 'ClickHouse Analytics',
          status: 'Online',
          icon: 'fas fa-chart-bar',
          size: '150MB'
        }
      ]
    }
  },
  methods: {
    backupDatabases() {
      console.log('Iniciando backup dos bancos...')
      // Lógica para backup
    },
    optimizeDatabases() {
      console.log('Otimizando bancos de dados...')
      // Lógica para otimização
    }
  }
}
</script>

<style scoped>
/* Estilos específicos dos Databases seguindo padrão Beacon */
.databases-list {
  margin-top: 1rem;
}

.database-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.database-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.database-icon {
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.database-content {
  flex: 1;
}

.database-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.database-status {
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 500;
}

.database-metrics {
  font-size: 0.7rem;
  color: #94a3b8;
}
</style>


