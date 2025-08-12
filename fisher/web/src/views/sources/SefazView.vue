<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão Skipper -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-building"></i>
        <div class="title-content">
          <h1>SEFAZ</h1>
          <p>Dados da Receita Federal</p>
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
              <div class="balance-label">Conexão ativa com SEFAZ</div>
                </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Última Sincronização:</span>
                <span class="detail-value">2024-01-15 14:30:00</span>
                </div>
              <div class="detail-item">
                <span class="detail-label">Consultas Hoje:</span>
                <span class="detail-value">2,450</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Sucesso:</span>
                <span class="detail-value">99.1%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Serviços SEFAZ -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-server"></i>
            </div>
            <div class="card-title">
              <h4>Serviços SEFAZ</h4>
              <span class="card-subtitle">APIs disponíveis</span>
          </div>
            <div class="card-actions">
              <span class="status-badge info">4 Serviços</span>
              </div>
              </div>
          <div class="card-content">
            <div class="services-grid">
              <div v-for="service in sefazServices" :key="service.id" class="service-item">
                <div class="service-icon">
                  <i :class="service.icon"></i>
              </div>
                <div class="service-details">
                  <div class="service-name">{{ service.name }}</div>
                  <div class="service-status" :class="service.status">
                    {{ service.statusText }}
              </div>
                  <div class="service-metrics">
                    <span>{{ service.requests }} consultas</span>
                    <span>{{ service.responseTime }}ms</span>
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
              <span class="card-subtitle">Parâmetros da SEFAZ</span>
              </div>
            <div class="card-actions">
              <span class="status-badge info">4 Configs</span>
            </div>
          </div>
          <div class="card-content">
            <div class="config-list">
              <div v-for="config in sefazConfigs" :key="config.id" class="config-item">
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
  name: 'FisherSefazView',
  data() {
    return {
      sefazServices: [
          {
            id: 1,
          name: 'Consulta CNPJ',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-search',
          requests: '1,250',
          responseTime: '180'
          },
          {
            id: 2,
          name: 'Consulta CPF',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-user',
          requests: '890',
          responseTime: '220'
          },
          {
            id: 3,
          name: 'Consulta NFe',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-file-invoice',
          requests: '210',
          responseTime: '150'
          },
          {
            id: 4,
          name: 'Consulta CEP',
          status: 'online',
          statusText: 'ONLINE',
          icon: 'fas fa-map-marker-alt',
          requests: '100',
          responseTime: '120'
        }
      ],
      performanceMetrics: [
        {
          id: 1,
          name: 'Total de Consultas',
          value: '2,450',
          label: 'hoje',
          icon: 'fas fa-search'
        },
        {
          id: 2,
          name: 'Tempo Médio',
          value: '167ms',
          label: 'resposta',
          icon: 'fas fa-clock'
        },
        {
          id: 3,
          name: 'Taxa de Sucesso',
          value: '99.1%',
          label: 'consultas',
          icon: 'fas fa-check-circle'
        },
        {
          id: 4,
          name: 'Serviços Ativos',
          value: '4/4',
          label: 'funcionando',
          icon: 'fas fa-server'
        }
      ],
      sefazConfigs: [
        {
          id: 1,
          name: 'API Rate Limit',
          value: '100 req/min',
          description: 'Limite de requisições por minuto'
        },
        {
          id: 2,
          name: 'Timeout',
          value: '30s',
          description: 'Tempo limite de resposta'
        },
        {
          id: 3,
          name: 'Retry Policy',
          value: '3 tentativas',
          description: 'Política de retry'
        },
        {
          id: 4,
          name: 'Cache TTL',
          value: '3600s',
          description: 'Tempo de vida do cache'
        }
      ]
    }
  },
  methods: {
    syncData() {
      console.log('Sincronizando dados da SEFAZ...')
      // Implementar lógica de sincronização
    },
    refreshData() {
      console.log('Atualizando dados da SEFAZ...')
      // Implementar lógica de atualização
    }
  }
}
</script>

