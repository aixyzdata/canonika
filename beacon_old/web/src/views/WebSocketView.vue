<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>WebSocket Service</h2>
        <span class="view-subtitle">Comunicação em tempo real</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Serviço Ativo</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Nova Conexão
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-broadcast-tower"></i>
            </div>
            <div class="card-title">
              <h4>Conexões Ativas</h4>
              <span class="card-subtitle">WebSocket connections</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">1.2K</span>
            </div>
          </div>
          <div class="card-content">
            <div class="connections-list">
              <div class="connection-item">
                <div class="connection-icon">
                  <i class="fas fa-desktop"></i>
                </div>
                <div class="connection-info">
                  <div class="connection-name">Cliente Web - Dashboard</div>
                  <div class="connection-details">IP: 192.168.1.100 | Conectado há: 2h 15min</div>
                </div>
                <div class="connection-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="connection-item">
                <div class="connection-icon">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                <div class="connection-info">
                  <div class="connection-name">App Mobile - Usuário</div>
                  <div class="connection-details">IP: 10.0.0.50 | Conectado há: 45min</div>
                </div>
                <div class="connection-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="connection-item">
                <div class="connection-icon">
                  <i class="fas fa-server"></i>
                </div>
                <div class="connection-info">
                  <div class="connection-name">Servidor IoT - Sensor</div>
                  <div class="connection-details">IP: 172.16.0.10 | Conectado há: 1h 30min</div>
                </div>
                <div class="connection-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="card-title">
              <h4>Métricas de Performance</h4>
              <span class="card-subtitle">Estatísticas do WebSocket</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-value">45ms</span>
                <span class="metric-label">Latência Média</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">99.9%</span>
                <span class="metric-label">Uptime</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">2.5K</span>
                <span class="metric-label">Mensagens/min</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">0.1%</span>
                <span class="metric-label">Taxa de Erro</span>
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="card-title">
              <h4>Configurações WebSocket</h4>
              <span class="card-subtitle">Parâmetros do serviço</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Porta WebSocket</label>
                <input type="number" value="8080" class="form-control">
              </div>
              <div class="form-group">
                <label>Heartbeat Interval</label>
                <select class="form-control">
                  <option>30 segundos</option>
                  <option>60 segundos</option>
                  <option>120 segundos</option>
                </select>
              </div>
              <div class="form-group">
                <label>Max Connections</label>
                <input type="number" value="10000" class="form-control">
              </div>
              <div class="form-group">
                <label>SSL/TLS</label>
                <div class="checkbox-group">
                  <input type="checkbox" id="websocket-ssl" checked>
                  <label for="websocket-ssl">Habilitar SSL</label>
                </div>
              </div>
              <button class="btn btn-primary">Salvar Configurações</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebSocketView'
}
</script>

<style scoped>
.tollgate-view {
  padding: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #475569;
}

.view-title h2 {
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.view-subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
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
}

.status-indicator.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

.view-actions {
  display: flex;
  gap: 1rem;
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.card-title {
  flex: 1;
}

.card-title h4 {
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-subtitle {
  color: #94a3b8;
  font-size: 0.8rem;
}

.card-actions {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.online {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.card-content {
  color: #e2e8f0;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.connection-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.connection-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.connection-info {
  flex: 1;
}

.connection-name {
  color: #e2e8f0;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.connection-details {
  color: #94a3b8;
  font-size: 0.8rem;
}

.connection-status {
  display: flex;
  align-items: center;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #94a3b8;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-control {
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 