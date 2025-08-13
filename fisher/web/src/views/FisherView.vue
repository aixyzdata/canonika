<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão do Beacon -->
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
      <!-- Seção: Status Geral do Fisher -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-chart-line text-success me-2"></i>
            Status Geral
          </h3>
          <p class="section-description">
            Métricas do sistema de coleta de dados.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
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
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ config.metrics[0].value }}</span>
                    <span class="metric-label">{{ config.metrics[0].label }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ config.metrics[1].value }}</span>
                    <span class="metric-label">{{ config.metrics[1].label }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ config.metrics[2].value }}</span>
                    <span class="metric-label">{{ config.metrics[2].label }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ config.metrics[3].value }}</span>
                    <span class="metric-label">{{ config.metrics[3].label }}</span>
                  </div>
                </div>
              </div>
            </div>

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

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="card-title">
                  <h4>Atividades Recentes</h4>
                  <span class="card-subtitle">Últimas operações</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">{{ recentActivities.length }} Atividades</span>
                </div>
              </div>
              <div class="card-content">
                <div class="activity-list">
                  <div 
                    v-for="activity in recentActivities" 
                    :key="activity.id" 
                    class="activity-item"
                  >
                    <div class="activity-icon">
                      <i :class="activity.icon"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">{{ activity.title }}</div>
                      <div class="activity-description">{{ activity.description }}</div>
                    </div>
                    <div class="activity-time">{{ activity.time }}</div>
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
  name: 'FisherView',
  data() {
    return {
      config: {
        metrics: [
          { value: '1.2M', label: 'Registros Processados' },
          { value: '45.2K', label: 'Dados Processados' },
          { value: '12', label: 'Fontes Ativas' },
          { value: '98.5%', label: 'Taxa de Sucesso' }
        ]
      },
      dataSources: [
        {
          id: 1,
          name: 'SEFAZ',
          description: 'Receita Federal',
          status: 'Online',
          type: 'sefaz'
        },
        {
          id: 2,
          name: 'Marketplaces',
          description: 'E-commerce',
          status: 'Online',
          type: 'marketplaces'
        },
        {
          id: 3,
          name: 'APIs Externas',
          description: 'Terceiros',
          status: 'Online',
          type: 'apis'
        },
        {
          id: 4,
          name: 'Bancos de Dados',
          description: 'Internos',
          status: 'Online',
          type: 'databases'
        },
        {
          id: 5,
          name: 'Web Scraping',
          description: 'Coleta Web',
          status: 'Online',
          type: 'scraping'
        },
        {
          id: 6,
          name: 'Arquivos Locais',
          description: 'CSV, Excel, XML',
          status: 'Online',
          type: 'files'
        }
      ],
      recentActivities: [
        {
          id: 1,
          title: 'Coleta SEFAZ',
          description: 'Dados atualizados da Receita Federal',
          icon: 'fas fa-building',
          time: '2 min atrás'
        },
        {
          id: 2,
          title: 'Processamento Marketplaces',
          description: 'Dados de e-commerce processados',
          icon: 'fas fa-shopping-cart',
          time: '5 min atrás'
        },
        {
          id: 3,
          title: 'API Externa',
          description: 'Conectado com serviço terceiro',
          icon: 'fas fa-plug',
          time: '10 min atrás'
        },
        {
          id: 4,
          title: 'Backup Automático',
          description: 'Backup realizado com sucesso',
          icon: 'fas fa-database',
          time: '15 min atrás'
        }
      ]
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Fisher...')
      // Lógica para atualizar dados
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

<style scoped>
/* Estilos específicos do Fisher seguindo padrão Beacon */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.plan-item {
  padding: 1rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.plan-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
}

.plan-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.plan-price {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.plan-credits {
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 600;
}

.activity-list {
  margin-top: 1rem;
}

.activity-item {
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

.activity-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.activity-icon {
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

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.activity-description {
  font-size: 0.7rem;
  color: #94a3b8;
}

.activity-time {
  font-size: 0.7rem;
  color: #94a3b8;
}
</style>


