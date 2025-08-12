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

