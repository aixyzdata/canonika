<template>
  <div class="home-view">
    <div class="view-header">
      <h1 class="view-title">🏠 Home</h1>
      <div class="view-status">
        <span class="status-indicator online"></span>
        Sistema Online
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-broadcast-tower"></i>
            <h3>WebSocket Status</h3>
          </div>
          <div class="card-content">
            <p>Status da conexão WebSocket</p>
            <div class="status-badge online">Conectado</div>
          </div>
        </div>
        
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-code"></i>
            <h3>API Status</h3>
          </div>
          <div class="card-content">
            <p>Status da API REST</p>
            <div class="status-badge online">Funcionando</div>
          </div>
        </div>
        
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-cog"></i>
            <h3>Configurações</h3>
          </div>
          <div class="card-content">
            <p>Configurações do sistema</p>
            <div class="status-badge warning">Pendente</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  mounted() {
    console.log('🏠 HomeView carregada')
  }
}
</script> 