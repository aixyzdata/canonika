<template>
  <div class="api-view">
    <div class="view-header">
      <h1 class="view-title">🔌 API</h1>
      <div class="view-status">
        <span class="status-indicator online"></span>
        Funcionando
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-code"></i>
            <h3>Endpoints REST</h3>
          </div>
          <div class="card-content">
            <p>Status dos endpoints da API</p>
            <div class="status-badge online">Ativo</div>
          </div>
        </div>
        
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-chart-line"></i>
            <h3>Performance</h3>
          </div>
          <div class="card-content">
            <p>Métricas de performance da API</p>
            <div class="status-badge online">Ótima</div>
          </div>
        </div>
        
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-shield-alt"></i>
            <h3>Segurança</h3>
          </div>
          <div class="card-content">
            <p>Status de segurança da API</p>
            <div class="status-badge online">Protegida</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiView',
  mounted() {
    console.log('🔌 ApiView carregada')
  }
}
</script>

<style scoped>
.api-view {
  height: 100%;
}
</style> 