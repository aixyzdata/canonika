<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão EXATO do template -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-heartbeat"></i>
        <div class="title-content">
          <h1>Status do Sistema</h1>
          <p>Monitoramento e saúde dos serviços</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Todos os Serviços Online</span>
      </div>
      <div class="view-actions">
        <button @click="refreshStatus" class="btn btn-primary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar Status
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-download me-2"></i>
          Relatório
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status dos Serviços -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-check-circle text-success me-2"></i>
            STATUS DOS SERVIÇOS
          </span>
          <p class="section-description">
            Monitoramento em tempo real do estado de todos os componentes do sistema.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-server"></i>
                </div>
                <div class="card-title">
                  <h4>Fisher API</h4>
                  <span class="card-subtitle">Serviço principal de coleta</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">ONLINE</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">99.9%</span>
                    <span class="metric-label">Uptime</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">45ms</span>
                    <span class="metric-label">Latência</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">CPU</span>
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
                  <h4>Base de Dados</h4>
                  <span class="card-subtitle">PostgreSQL cluster</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">ONLINE</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Conectividade</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">12ms</span>
                    <span class="metric-label">Query Time</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">85%</span>
                    <span class="metric-label">Uso Disco</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-memory"></i>
                </div>
                <div class="card-title">
                  <h4>Cache Redis</h4>
                  <span class="card-subtitle">Sistema de cache distribuído</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">ONLINE</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Disponível</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">1ms</span>
                    <span class="metric-label">Latência</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">2.4GB</span>
                    <span class="metric-label">Memória</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Logs do Sistema -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-list text-info me-2"></i>
            LOGS DO SISTEMA
          </span>
          <p class="section-description">
            Registro de atividades e eventos do sistema em tempo real.
          </p>
        </div>
        
        <div class="section-content">
          <div class="feature-cards">
            <div class="feature-card" v-for="log in systemLogs" :key="log.id">
              <div class="feature-icon">
                <i :class="getLogIcon(log.level)"></i>
              </div>
              <div class="feature-title">{{ log.message }}</div>
              <div class="feature-description">{{ log.timestamp }} - {{ log.service }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'StatusView',
  setup() {
    // Data
    const systemLogs = ref([
      {
        id: 1,
        level: 'info',
        message: 'Sistema inicializado com sucesso',
        service: 'Fisher API',
        timestamp: '14:32:15'
      },
      {
        id: 2,
        level: 'success',
        message: 'Conexão com base de dados estabelecida',
        service: 'Database',
        timestamp: '14:32:16'
      },
      {
        id: 3,
        level: 'info',
        message: 'Cache Redis conectado',
        service: 'Redis',
        timestamp: '14:32:17'
      },
      {
        id: 4,
        level: 'success',
        message: 'Sincronização SEFAZ concluída',
        service: 'SEFAZ Integration',
        timestamp: '14:35:22'
      },
      {
        id: 5,
        level: 'info',
        message: 'Backup automático executado',
        service: 'Backup Service',
        timestamp: '14:40:00'
      },
      {
        id: 6,
        level: 'success',
        message: 'Relatório de status gerado',
        service: 'Report Generator',
        timestamp: '14:45:10'
      }
    ])

    // Methods
    const refreshStatus = () => {
      console.log('Atualizando status do sistema...')
    }

    const getLogIcon = (level) => {
      const icons = {
        'info': 'fas fa-info-circle text-primary',
        'success': 'fas fa-check-circle text-success',
        'warning': 'fas fa-exclamation-triangle text-warning',
        'error': 'fas fa-times-circle text-danger'
      }
      return icons[level] || 'fas fa-circle text-secondary'
    }

    onMounted(() => {
      console.log('StatusView mounted - padrão EXATO do template aplicado')
    })

    return {
      systemLogs,
      refreshStatus,
      getLogIcon
    }
  }
}
</script>

<style scoped>
/* Sem estilos customizados - usando apenas as classes compartilhadas */
</style>