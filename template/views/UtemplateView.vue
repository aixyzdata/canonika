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

