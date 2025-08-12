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

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.view-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.status-indicator.online {
  background: #10b981;
}

.view-content {
  flex: 1;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-header i {
  font-size: 1.25rem;
  color: #60a5fa;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
}

.card-content p {
  color: #94a3b8;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.online {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}
</style> 