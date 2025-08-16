<template>
  <div class="canonika-view">
    <!-- View Header (padrão template) -->
    <div class="view-header-card">
      <div class="header-content">
        <div class="header-left">
          <div class="service-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="service-info">
            <h2>BANCOS DE DADOS - Sistema de Dados</h2>
            <p>Gerenciamento e monitoramento de fontes de dados internas</p>
          </div>
        </div>
        <div class="header-center">
          <div class="status-indicator-large">
            <div class="status-dot online"></div>
            <span>Sistema Operacional</span>
          </div>
        </div>
        <div class="header-right">
          <button @click="backupDatabases" class="btn btn-primary">
            <i class="fas fa-download me-2"></i>
            Backup
          </button>
          <button @click="optimizeDatabases" class="btn btn-secondary">
            <i class="fas fa-cog me-2"></i>
            Otimizar
          </button>
        </div>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Monitoramento de Bancos -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-server section-icon text-success"></i>
            MONITORAMENTO DE BANCOS
          </h3>
          <p class="section-description">
            Status em tempo real das conexões e performance dos bancos de dados.
          </p>
        </div>
        <div class="section-content">
          <div class="service-cards-grid">
            <div class="service-card-large">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-database"></i>
                </div>
                <div class="card-info">
                  <h4>STATUS DAS CONEXÕES</h4>
                  <p class="card-subtitle">Monitoramento em tempo real</p>
                </div>
                <div class="card-status">
                  <span class="status-badge functioning">Funcionando</span>
                </div>
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.activeDatabases }}</span>
                  <span class="metric-label">DBs Ativos</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.successRate }}%</span>
                  <span class="metric-label">Taxa Sucesso</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ connectionStatus.avgResponse }}ms</span>
                  <span class="metric-label">Tempo Médio</span>
                </div>
              </div>
            </div>

            <div class="service-card-large">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <div class="card-info">
                  <h4>ESTATÍSTICAS DE DADOS</h4>
                  <p class="card-subtitle">Volume e performance</p>
                </div>
                <div class="card-status">
                  <span class="status-badge functioning">Ativo</span>
                </div>
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.totalSize }}</span>
                  <span class="metric-label">Tamanho Total</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.totalRecords }}</span>
                  <span class="metric-label">Registros</span>
                </div>
                <div class="metric-item">
                  <span class="metric-value blue">{{ dataStats.connections }}</span>
                  <span class="metric-label">Conexões</span>
                </div>
              </div>
            </div>
          </div>

          <h3 class="section-title mt-4">
            <i class="fas fa-list-alt section-icon text-primary"></i>
            LISTA DE BANCOS CONECTADOS
          </h3>
          <p class="section-description">
            Detalhes e status de cada instância de banco de dados.
          </p>
          <div class="feature-cards-grid">
            <div 
              v-for="database in databases" 
              :key="database.id" 
              class="feature-card"
            >
              <div class="feature-icon">
                <i :class="database.icon"></i>
              </div>
              <div class="feature-title">{{ database.name }}</div>
              <div class="feature-description">{{ database.status }} - {{ database.size }}</div>
              <div class="feature-actions">
                <button class="btn btn-sm btn-outline-primary">
                  <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary">
                  <i class="fas fa-cog"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="canonika-footer">
        <div class="footer-content">
          <div class="footer-info">
            <h3>Bancos de Dados - Fisher Service</h3>
            <p>Sistema de gerenciamento e monitoramento de fontes de dados</p>
          </div>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-value">{{ databases.length }}</span>
              <span class="stat-label">Bancos</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ dataStats.totalSize }}</span>
              <span class="stat-label">Tamanho</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ dataStats.totalRecords }}</span>
              <span class="stat-label">Registros</span>
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



