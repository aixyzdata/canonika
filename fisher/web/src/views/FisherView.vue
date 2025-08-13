<template>
  <div class="tollgate-view">
    <!-- View Header seguindo padrão Skipper -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-fish"></i>
        <div class="title-content">
          <h1>Fisher</h1>
          <p>Tripulante de Pesca de Dados - Status Geral</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData" class="btn btn-primary btn-sm">
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
        <!-- Status Geral do Fisher -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="card-title">
              <h4>Status Geral</h4>
              <span class="card-subtitle">Métricas do sistema</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Ativo</span>
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
            <div class="card-icon">
              <i class="fas fa-database"></i>
            </div>
            <div class="card-title">
              <h4>Fontes de Dados</h4>
              <span class="card-subtitle">Conectores ativos</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">{{ dataSources.length }} Ativas</span>
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
            <div class="card-icon">
              <i class="fas fa-history"></i>
            </div>
            <div class="card-title">
              <h4>Atividades Recentes</h4>
              <span class="card-subtitle">Log de operações</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">{{ config.recentActivity.length }} Atividades</span>
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
            <div class="card-icon">
              <i class="fas fa-server"></i>
            </div>
            <div class="card-title">
              <h4>Status do Sistema</h4>
              <span class="card-subtitle">Monitoramento</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Online</span>
            </div>
          </div>
          <div class="card-content">
            <div class="system-metrics">
              <div class="metric-item">
                <span class="metric-value">100%</span>
                <span class="metric-label">Disponibilidade</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">0ms</span>
                <span class="metric-label">Latência</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">24/7</span>
                <span class="metric-label">Uptime</span>
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
      console.log('Atualizando dados do Fisher...')
      // Implementar lógica de atualização
    },
    openDataSource(source) {
      console.log('Abrindo fonte de dados:', source)
      
      // Mapear tipos para rotas
      const routeMap = {
        'sefaz': '/sources/sefaz',
        'marketplaces': '/sources/marketplaces',
        'apis': '/sources/apis',
        'databases': '/sources/databases',
        'scraping': '/sources/scraping',
        'files': '/sources/files'
      }
      
      const route = routeMap[source.type]
      if (route) {
        this.$router.push(route)
      } else {
        console.error('Rota não encontrada para:', source.type)
      }
    }
  }
}
</script>


