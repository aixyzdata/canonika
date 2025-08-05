<template>
  <MasterPage 
    :serviceConfig="serviceConfig"
    :hasLogin="false"
    @view-changed="handleViewChange"
    @login="handleLogin"
    @logout="handleLogout"
  >
    <!-- Router view para o conteúdo -->
    <router-view />
  </MasterPage>
</template>

<script>
import MasterPage from './components/MasterPage.vue'
import BeaconView from './views/BeaconView.vue'
import { getServiceMenu } from './config/service-menus.js'
import config from './config/env.js'

export default {
  name: 'BeaconApp',
  components: {
    MasterPage,
    BeaconView
  },
  data() {
    return {
      currentView: 'dashboard',
      serviceConfig: getServiceMenu('beacon')
    }
  },
  methods: {
    handleViewChange(viewId) {
      this.currentView = viewId
      console.log('View changed to:', viewId)
      
      // Navegar usando o router
      if (viewId === 'dashboard') {
        this.$router.push('/')
      } else if (viewId === 'status') {
        this.$router.push('/status')
      } else {
        // Para outras views, usar a rota padrão
        this.$router.push('/')
      }
    },
    handleLogin(user) {
      console.log('User logged in:', user)
    },
    handleLogout() {
      console.log('User logged out')
    }
  }
}
</script>

<style>
@import './styles/canonika-view.css';

.beacon-dashboard,
.beacon-sinalizacao,
.beacon-transmissao,
.beacon-configuracoes,
.beacon-default {
  padding: 2rem;
}

.beacon-dashboard h2,
.beacon-sinalizacao h2,
.beacon-transmissao h2,
.beacon-configuracoes h2 {
  color: #e2e8f0;
  margin-bottom: 1rem;
}

.beacon-dashboard p,
.beacon-sinalizacao p,
.beacon-transmissao p,
.beacon-configuracoes p {
  color: #94a3b8;
  line-height: 1.6;
}
</style> 