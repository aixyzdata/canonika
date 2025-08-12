<template>
  <div class="websocket-view">
    <div class="view-header">
      <h1 class="view-title">📡 WebSocket</h1>
      <div class="view-status">
        <span class="status-indicator online"></span>
        Conectado
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-broadcast-tower"></i>
            <h3>Conexão WebSocket</h3>
          </div>
          <div class="card-content">
            <p>Status da conexão em tempo real</p>
            <div class="status-badge online">Ativo</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebSocketView',
  mounted() {
    console.log('📡 WebSocketView carregada')
  }
}
</script>

<style scoped>
.websocket-view {
  height: 100%;
}
</style>