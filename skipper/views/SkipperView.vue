<template>
  <StatusViewTemplate
    :service-name="config.serviceName"
    :service-description="config.serviceDescription"
    :service-icon="config.serviceIcon"
    :service-status="config.serviceStatus"
    :status-text="config.statusText"
    :metrics="config.metrics"
    :recent-activity="config.recentActivity"
    :system-status="config.systemStatus"
    :configurations="config.configurations"
    :actions="config.actions"
    :primary-action="config.primaryAction"
    @refresh="refreshData"
  />
</template>

<script>
import StatusViewTemplate from '../../shared/templates/StatusViewTemplate.vue'
import { getServiceConfig } from '../../shared/config/status-configs.js'

export default {
  name: 'SkipperView',
  components: {
    StatusViewTemplate
  },
  data() {
    return {
      config: getServiceConfig('skipper')
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Skipper...')
      // Aqui você faria a chamada para a API do Skipper
      // e atualizaria os dados em tempo real
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do Skipper, se necessário */
</style>
