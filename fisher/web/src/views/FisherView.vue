<template>
  <CanonikaViewTemplate
    title="Fisher"
    description="Tripulante de Pesca de Dados - Status Geral"
    header-icon="fas fa-fish"
    status-text="ONLINE"
    :primary-action="{
      text: 'Atualizar Status',
      icon: 'fas fa-sync-alt',
      handler: refreshData
    }"
    @refresh="refreshData"
  >
    <div class="service-cards">
      <!-- Status Geral do Fisher -->
      <div class="service-card">
        <div class="card-header">
          <h3>Status Geral</h3>
          <div class="card-icon">
            <i class="fas fa-chart-line"></i>
        </div>
        </div>
        <div class="card-content">
          <div class="balance-display">
            <div class="balance-value">{{ config.metrics[0].value }}</div>
            <div class="balance-label">{{ config.metrics[0].label }}</div>
      </div>
          <div class="balance-details">
            <div class="detail-item">
              <span class="detail-label">Dados Processados:</span>
              <span class="detail-value">{{ config.metrics[1].value }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fontes Ativas:</span>
              <span class="detail-value">{{ config.metrics[2].value }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Taxa de Sucesso:</span>
              <span class="detail-value">{{ config.metrics[3].value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fontes de Dados -->
      <div class="service-card">
        <div class="card-header">
          <h3>Fontes de Dados</h3>
          <div class="card-icon">
            <i class="fas fa-database"></i>
                </div>
              </div>
        <div class="card-content">
          <div class="plans-grid">
            <div 
              v-for="source in dataSources" 
              :key="source.id" 
              class="plan-item"
              @click="openDataSource(source)"
            >
              <div class="plan-name">{{ source.name }}</div>
              <div class="plan-price">{{ source.description }}</div>
              <div class="plan-credits">{{ source.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Atividades Recentes -->
      <div class="service-card">
        <div class="card-header">
          <h3>Atividades Recentes</h3>
          <div class="card-icon">
            <i class="fas fa-history"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="transaction-list">
            <div v-for="activity in config.recentActivity" :key="activity.id" class="transaction-item">
              <div class="transaction-icon success">
                <i :class="activity.icon"></i>
              </div>
              <div class="transaction-details">
                <div class="transaction-title">{{ activity.title }}</div>
                <div class="transaction-amount success">
                  {{ activity.description }}
                </div>
                <div class="transaction-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- Status do Sistema -->
      <div class="service-card">
        <div class="card-header">
          <h3>Status do Sistema</h3>
          <div class="card-icon">
            <i class="fas fa-server"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="system-status">
            <div class="status-item">
              <span class="status-label">API Status:</span>
              <span class="status-value online">ONLINE</span>
            </div>
            <div class="status-item">
              <span class="status-label">Database:</span>
              <span class="status-value online">CONECTADO</span>
            </div>
            <div class="status-item">
              <span class="status-label">Cache:</span>
              <span class="status-value online">ATIVO</span>
            </div>
            <div class="status-item">
              <span class="status-label">Última Sincronização:</span>
              <span class="status-value">{{ lastSync }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CanonikaViewTemplate>
</template>

<script>
export default {
  name: 'FisherView',
  data() {
    return {
      lastSync: '2024-01-15 14:30:00',
      dataSources: [
        {
          id: 1,
          name: 'SEFAZ',
          description: 'Dados da Receita Federal',
          status: 'ATIVO',
          type: 'sefaz'
        },
        {
          id: 2,
          name: 'Marketplaces',
          description: 'E-commerce e Marketplaces',
          status: 'ATIVO',
          type: 'marketplaces'
        },
        {
          id: 3,
          name: 'APIs Externas',
          description: 'APIs de terceiros',
          status: 'ATIVO',
          type: 'apis'
        },
        {
          id: 4,
          name: 'Bancos de Dados',
          description: 'Bases de dados internas',
          status: 'ATIVO',
          type: 'databases'
        },
        {
          id: 5,
          name: 'Web Scraping',
          description: 'Coleta de dados web',
          status: 'ATIVO',
          type: 'scraping'
        },
        {
          id: 6,
          name: 'Arquivos Locais',
          description: 'CSV, Excel, XML',
          status: 'ATIVO',
          type: 'files'
        }
      ],
      config: {
        metrics: [
          { value: '1,247', label: 'Missões Executadas' },
          { value: '2.5M', label: 'Dados Processados' },
          { value: '6', label: 'Fontes Ativas' },
          { value: '98.5%', label: 'Taxa de Sucesso' }
        ],
        recentActivity: [
          {
            id: 1,
            title: 'Sincronização SEFAZ',
            description: '2.1K registros processados',
            time: '2 min atrás',
            icon: 'fas fa-sync'
          },
          {
            id: 2,
            title: 'Atualização Marketplaces',
            description: '1.8K produtos atualizados',
            time: '15 min atrás',
            icon: 'fas fa-shopping-cart'
          },
          {
            id: 3,
            title: 'Backup Automático',
            description: 'Database backup realizado',
            time: '1 hora atrás',
            icon: 'fas fa-database'
          },
          {
            id: 4,
            title: 'Limpeza de Cache',
            description: 'Cache limpo com sucesso',
            time: '2 horas atrás',
            icon: 'fas fa-broom'
          }
        ]
      }
    }
  },
  methods: {
    refreshData() {
      console.log('Refreshing Fisher status...')
      // Implementar refresh dos dados
    },
    openDataSource(source) {
      // Navegar para a tela específica da fonte de dados
      console.log('Abrindo fonte de dados:', source)
      // Aqui você implementaria a navegação para a tela específica
      // Por exemplo: this.$router.push(`/fisher/${source.type}`)
    }
  }
}
</script>

<style scoped>
.system-status {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(71, 85, 105, 0.3);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: #94a3b8;
  font-weight: 500;
}

.status-value {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.status-value.online {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-value.offline {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
</style>

<style>
@import '../../../../shared/styles/canonika-view.css';
</style> 