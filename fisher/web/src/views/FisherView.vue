<template>
  <CanonikaViewContent
    title="Fisher"
    subtitle="Tripulante de Pesca de Dados - Status Geral"
    :status="{ type: 'online', text: 'Sistema Operacional' }"
    :actions="true"
  >
    <template #actions>
      <button @click="refreshData" class="btn btn-primary btn-sm">
        <i class="fas fa-sync-alt me-2"></i>
        Atualizar Status
      </button>
      <button class="btn btn-secondary btn-sm">
        <i class="fas fa-cog me-2"></i>
        Configurações
      </button>
    </template>

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
  </CanonikaViewContent>
</template>

<script>
import CanonikaViewContent from '@shared/components/ViewContent.vue'

export default {
  name: 'FisherView',
  components: {
    CanonikaViewContent
  },
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

<!-- Estilos agora são gerenciados pelo SCSS compartilhado -->


