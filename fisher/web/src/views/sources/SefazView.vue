<template>
  <CanonikaViewContent
    title="SEFAZ"
    subtitle="Dados da Receita Federal"
    :status="{ type: 'online', text: 'Sistema Operacional' }"
    :actions="true"
  >
    <template #actions>
      <button @click="syncData" class="btn btn-primary btn-sm">
        <i class="fas fa-sync me-2"></i>
        Sincronizar Dados
      </button>
      <button @click="refreshData" class="btn btn-secondary btn-sm">
        <i class="fas fa-sync-alt me-2"></i>
        Atualizar
      </button>
    </template>

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

      <!-- Dados Coletados -->
      <div class="service-card">
        <div class="card-header">
          <div class="card-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="card-title">
            <h4>Dados Coletados</h4>
            <span class="card-subtitle">Estatísticas de coleta</span>
          </div>
          <div class="card-actions">
            <span class="status-badge success">{{ dataStats.total }} Registros</span>
          </div>
        </div>
        <div class="card-content">
          <div class="metric-grid">
            <div class="metric-item">
              <div class="metric-value">{{ dataStats.total }}</div>
              <div class="metric-label">Total de Registros</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ dataStats.today }}</div>
              <div class="metric-label">Coletados Hoje</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ dataStats.successRate }}%</div>
              <div class="metric-label">Taxa de Sucesso</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ dataStats.avgTime }}ms</div>
              <div class="metric-label">Tempo Médio</div>
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
  name: 'SefazView',
  components: {
    CanonikaViewContent
  },
  data() {
    return {
      sefazServices: [
        {
          id: 1,
          name: 'Consulta CNPJ',
          status: 'online',
          statusText: 'Online',
          icon: 'fas fa-building',
          requests: '1,250',
          responseTime: '150'
        },
        {
          id: 2,
          name: 'Consulta CPF',
          status: 'online',
          statusText: 'Online',
          icon: 'fas fa-user',
          requests: '850',
          responseTime: '120'
        },
        {
          id: 3,
          name: 'Consulta NFe',
          status: 'online',
          statusText: 'Online',
          icon: 'fas fa-file-invoice',
          requests: '320',
          responseTime: '200'
        },
        {
          id: 4,
          name: 'Consulta CEP',
          status: 'online',
          statusText: 'Online',
          icon: 'fas fa-map-marker-alt',
          requests: '30',
          responseTime: '80'
        }
      ],
      dataStats: {
        total: '2.5M',
        today: '2,450',
        successRate: '99.1',
        avgTime: '150'
      }
    }
  },
  methods: {
    syncData() {
      console.log('Sincronizando dados SEFAZ...')
      // Implementar lógica de sincronização
    },
    refreshData() {
      console.log('Atualizando dados SEFAZ...')
      // Implementar lógica de atualização
    }
  }
}
</script>

<!-- Estilos agora são gerenciados pelo SCSS compartilhado -->

