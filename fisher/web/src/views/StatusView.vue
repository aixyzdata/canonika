<template>
  <CanonikaViewContent
    title="Status do Fisher"
    subtitle="Monitoramento e Status do Tripulante de Pesca"
    :status="{ type: 'online', text: 'Sistema Operacional' }"
    :actions="true"
  >
    <template #actions>
      <button @click="refreshStatus" class="btn btn-primary btn-sm">
        <i class="fas fa-sync-alt me-2"></i>
        Atualizar Status
      </button>
      <button class="btn btn-secondary btn-sm">
        <i class="fas fa-cog me-2"></i>
        Configurações
      </button>
    </template>

    <div class="service-cards">
      <!-- Status do Serviço -->
      <div class="service-card">
        <div class="card-header">
          <div class="card-icon">
            <i class="fas fa-server"></i>
          </div>
          <div class="card-title">
            <h4>Status do Serviço</h4>
            <span class="card-subtitle">Informações do sistema</span>
          </div>
          <div class="card-actions">
            <span class="status-badge online">{{ serviceStatus.status }}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="balance-display">
            <div class="balance-value">{{ serviceStatus.status }}</div>
            <div class="balance-label">{{ serviceStatus.description }}</div>
          </div>
          <div class="balance-details">
            <div class="detail-item">
              <span class="detail-label">Uptime:</span>
              <span class="detail-value">{{ serviceStatus.uptime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Porta:</span>
              <span class="detail-value">{{ serviceStatus.port }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Versão:</span>
              <span class="detail-value">{{ serviceStatus.version }}</span>
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
            <span class="status-badge info">{{ performanceMetrics.length }} Métricas</span>
          </div>
        </div>
        <div class="card-content">
          <div class="metric-grid">
            <div v-for="metric in performanceMetrics" :key="metric.id" class="metric-item">
              <div class="metric-icon">
                <i :class="metric.icon"></i>
              </div>
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-label">{{ metric.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs Recentes -->
      <div class="service-card">
        <div class="card-header">
          <div class="card-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="card-title">
            <h4>Logs Recentes</h4>
            <span class="card-subtitle">Últimas atividades</span>
          </div>
          <div class="card-actions">
            <span class="status-badge info">{{ recentLogs.length }} Logs</span>
          </div>
        </div>
        <div class="card-content">
          <div class="activity-list">
            <div v-for="log in recentLogs" :key="log.id" class="activity-item">
              <div class="activity-icon">
                <i :class="log.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ log.title }}</div>
                <div class="activity-description">{{ log.message }}</div>
              </div>
              <div class="activity-time">{{ log.time }}</div>
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
  name: 'StatusView',
  components: {
    CanonikaViewContent
  },
  data() {
    return {
      serviceStatus: {
        status: 'Online',
        description: 'Serviço funcionando normalmente',
        uptime: '99.9%',
        port: '3706',
        version: '1.0.0'
      },
      performanceMetrics: [
        {
          id: 1,
          name: 'CPU Usage',
          value: '15%',
          icon: 'fas fa-microchip',
          description: 'Uso de processador'
        },
        {
          id: 2,
          name: 'Memory Usage',
          value: '45%',
          icon: 'fas fa-memory',
          description: 'Uso de memória'
        },
        {
          id: 3,
          name: 'Disk Usage',
          value: '30%',
          icon: 'fas fa-hdd',
          description: 'Uso de disco'
        },
        {
          id: 4,
          name: 'Network',
          value: '2.5 MB/s',
          icon: 'fas fa-network-wired',
          description: 'Tráfego de rede'
        }
      ],
      recentLogs: [
        {
          id: 1,
          title: 'INFO',
          message: 'Serviço iniciado com sucesso',
          icon: 'fas fa-info-circle',
          time: '2 min atrás'
        },
        {
          id: 2,
          title: 'SUCCESS',
          message: 'Conexão com banco estabelecida',
          icon: 'fas fa-check-circle',
          time: '5 min atrás'
        },
        {
          id: 3,
          title: 'WARNING',
          message: 'Cache próximo do limite',
          icon: 'fas fa-exclamation-triangle',
          time: '10 min atrás'
        },
        {
          id: 4,
          title: 'INFO',
          message: 'Backup automático realizado',
          icon: 'fas fa-info-circle',
          time: '15 min atrás'
        }
      ]
    }
  },
  methods: {
    refreshStatus() {
      console.log('Atualizando status do Fisher...')
      // Implementar lógica de atualização
    }
  }
}
</script>

<!-- Estilos agora são gerenciados pelo SCSS compartilhado -->

