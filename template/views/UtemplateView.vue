<template>
  <div class="service-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-icon"></i>
        <span>{{ serviceTitle }}</span>
      </div>
      <div class="view-status">
        <div class="status-indicator" :class="statusClass"></div>
        <span>{{ statusText }}</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="openSettings" class="action-btn">
          <i class="fas fa-cog"></i>
          Configurações
        </button>
      </div>
    </div>

    <div class="view-content">
      <div class="content-header">
        <h2>{{ serviceName }}</h2>
        <p>{{ serviceDescription }}</p>
      </div>

      <div class="content-body">
        <div class="data-section">
          <h3>📊 Dados do Serviço</h3>
          <div class="data-grid">
            <div class="data-card" v-for="item in dataItems" :key="item.id">
              <div class="card-header">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </div>
              <div class="card-content">
                <p>{{ item.description }}</p>
                <div class="card-status" :class="item.statusClass">
                  {{ item.status }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <h3>⚡ Ações Rápidas</h3>
          <div class="actions-grid">
            <button 
              v-for="action in quickActions" 
              :key="action.id"
              @click="action.handler"
              class="action-card"
            >
              <i :class="action.icon"></i>
              <span>{{ action.title }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UtemplateView',
  data() {
    return {
      serviceTitle: 'template',
      serviceName: 'Sistema template',
      serviceDescription: 'Descrição do serviço template e suas funcionalidades principais',
      status: 'online',
      dataItems: [
        {
          id: 1,
          title: 'Status Principal',
          description: 'Sistema funcionando normalmente',
          icon: 'fas fa-check-circle',
          status: 'Ativo',
          statusClass: 'success'
        },
        {
          id: 2,
          title: 'Configurações',
          description: 'Parâmetros do sistema',
          icon: 'fas fa-cog',
          status: 'Pendente',
          statusClass: 'warning'
        },
        {
          id: 3,
          title: 'Logs',
          description: 'Registros do sistema',
          icon: 'fas fa-file-alt',
          status: 'Disponível',
          statusClass: 'info'
        }
      ],
      quickActions: [
        {
          id: 1,
          title: 'Verificar Status',
          icon: 'fas fa-heartbeat',
          handler: this.checkStatus
        },
        {
          id: 2,
          title: 'Abrir Logs',
          icon: 'fas fa-list',
          handler: this.openLogs
        },
        {
          id: 3,
          title: 'Configurar',
          icon: 'fas fa-wrench',
          handler: this.openSettings
        }
      ]
    }
  },
  computed: {
    statusClass() {
      return this.status === 'online' ? 'online' : 'offline'
    },
    statusText() {
      return this.status === 'online' ? 'ONLINE' : 'OFFLINE'
    }
  },
  methods: {
    async refreshData() {
      console.log('Atualizando dados...')
      // Implementar lógica de atualização
    },
    openSettings() {
      console.log('Abrindo configurações...')
      // Implementar lógica de configurações
    },
    checkStatus() {
      console.log('Verificando status...')
      // Implementar verificação de status
    },
    openLogs() {
      console.log('Abrindo logs...')
      // Implementar visualização de logs
    }
  },
  mounted() {
    console.log('UtemplateView montado')
  }
}
</script>

<style scoped>
.service-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid #334155;
}

.view-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

.status-indicator.offline {
  background: #ef4444;
}

.view-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid #3b82f6;
  color: #3b82f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #3b82f6;
  color: white;
}

.view-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.content-header {
  text-align: center;
  margin-bottom: 2rem;
}

.content-header h2 {
  font-size: 2rem;
  color: #60a5fa;
  margin-bottom: 0.5rem;
}

.content-header p {
  color: #94a3b8;
  font-size: 1.1rem;
}

.data-section,
.actions-section {
  margin-bottom: 2rem;
}

.data-section h3,
.actions-section h3 {
  color: #f1f5f9;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.data-card {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #334155;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #60a5fa;
  font-weight: 600;
}

.card-content p {
  color: #94a3b8;
  margin-bottom: 1rem;
}

.card-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  display: inline-block;
}

.card-status.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.card-status.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.card-status.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #334155;
  border-radius: 0.75rem;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.action-card i {
  font-size: 1.5rem;
  color: #60a5fa;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
