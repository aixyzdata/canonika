<template>
  <MasterPage 
    :serviceConfig="serviceConfig"
    :hasLogin="true"
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
import BeaconAuthService from './auth/AuthService.js'

export default {
  name: 'BeaconApp',
  components: {
    MasterPage,
    BeaconView
  },
  data() {
    return {
      currentView: 'dashboard',
      serviceConfig: getServiceMenu('beacon'),
      user: null,
      isAuthenticated: false
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
      this.user = user
      this.isAuthenticated = true
    },
    handleLogout() {
      console.log('🚪 Logout solicitado no Beacon')
      BeaconAuthService.logout()
    },
    // Verificar autenticação
    checkAuthentication() {
      console.log('🔍 Verificando autenticação no Beacon...')
      
      // Verificar se está autenticado
      if (BeaconAuthService.isAuthenticated()) {
        console.log('✅ Usuário autenticado no Beacon')
        this.user = BeaconAuthService.getUserInfo()
        this.isAuthenticated = true
        return true
      } else {
        console.log('❌ Usuário não autenticado no Beacon')
        this.user = null
        this.isAuthenticated = false
        return false
      }
    }
  },
  mounted() {
    console.log('🚀 BEACON APP CARREGADO - Sistema de Autenticação Centralizado')
    
    // Verificar se é logout
    if (window.location.search.includes('logout=1')) {
      console.log('🚪 Logout detectado, redirecionando para Quarter...')
      window.location.href = 'http://localhost:3700';
      return;
    }
    
    // Processar token de autenticação se presente na URL
    BeaconAuthService.processAuthToken();
    
    // Verificar autenticação
    if (!this.checkAuthentication()) {
      console.log('🔄 Redirecionando para Quarter...')
      BeaconAuthService.redirectToQuarter()
    } else {
      console.log('✅ Usuário autenticado no Beacon')
      this.user = BeaconAuthService.getUserInfo()
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