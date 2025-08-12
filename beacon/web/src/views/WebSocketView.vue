<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão das outras views -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-broadcast-tower"></i>
        <div class="title-content">
          <h1>WebSocket</h1>
          <p>Conexão Real-time</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Conectado</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary btn-sm">
          <i class="fas fa-plug me-2"></i>
          Conectar
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-times me-2"></i>
          Desconectar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status da Conexão -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-signal text-success me-2"></i>
            Status da Conexão
          </h3>
          <p class="section-description">
            Monitoramento em tempo real da conexão WebSocket.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-broadcast-tower"></i>
                </div>
                <div class="card-title">
                  <h4>Conexão WebSocket</h4>
                  <span class="card-subtitle">ws://localhost:3703/ws</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Conectado</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">OPEN</span>
                    <span class="metric-label">Estado</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">0ms</span>
                    <span class="metric-label">Latência</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">24/7</span>
                    <span class="metric-label">Uptime</span>
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
                  <h4>Métricas</h4>
                  <span class="card-subtitle">Performance</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ótima</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">1,234</span>
                    <span class="metric-label">Mensagens/min</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">99.9%</span>
                    <span class="metric-label">Delivery Rate</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">5ms</span>
                    <span class="metric-label">Avg Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Eventos em Tempo Real -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-bell text-warning me-2"></i>
            Eventos em Tempo Real
          </h3>
          <p class="section-description">
            Últimos eventos recebidos via WebSocket.
          </p>
        </div>
        
        <div class="section-content">
          <div class="info-cards">
            <div class="info-card">
              <div class="info-label">Último Evento</div>
              <div class="info-value">Status Update</div>
              <div class="info-description">Há 2 segundos</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Total Eventos</div>
              <div class="info-value">15,678</div>
              <div class="info-description">Hoje</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Conexões Ativas</div>
              <div class="info-value">42</div>
              <div class="info-description">Clientes conectados</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Bandwidth</div>
              <div class="info-value">2.5 MB/s</div>
              <div class="info-description">Uso de rede</div>
            </div>
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