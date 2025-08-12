<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão das outras views -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-satellite"></i>
        <div class="title-content">
          <h1>REST API</h1>
          <p>HTTP Endpoints</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>API Funcionando</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Testar API
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-book me-2"></i>
          Documentação
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Endpoints da API -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-code text-primary me-2"></i>
            Endpoints REST
          </h3>
          <p class="section-description">
            Status e informações dos endpoints da API REST do Beacon.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-heartbeat"></i>
                </div>
                <div class="card-title">
                  <h4>Health Check</h4>
                  <span class="card-subtitle">GET /health</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">200 OK</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">200</span>
                    <span class="metric-label">Status Code</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">5ms</span>
                    <span class="metric-label">Response Time</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Uptime</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-info-circle"></i>
                </div>
                <div class="card-title">
                  <h4>Status Info</h4>
                  <span class="card-subtitle">GET /status</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">200 OK</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">JSON</span>
                    <span class="metric-label">Response Type</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">2KB</span>
                    <span class="metric-label">Payload Size</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Fast</span>
                    <span class="metric-label">Performance</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="card-title">
                  <h4>Security</h4>
                  <span class="card-subtitle">Authentication</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Protegida</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">JWT</span>
                    <span class="metric-label">Auth Type</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">HTTPS</span>
                    <span class="metric-label">Protocol</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">CORS</span>
                    <span class="metric-label">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Métricas de Performance -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-chart-line text-success me-2"></i>
            Métricas de Performance
          </h3>
          <p class="section-description">
            Estatísticas de performance e utilização da API.
          </p>
        </div>
        
        <div class="section-content">
          <div class="info-cards">
            <div class="info-card">
              <div class="info-label">Requests/min</div>
              <div class="info-value">1,234</div>
              <div class="info-description">Requisições por minuto</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Avg Response</div>
              <div class="info-value">15ms</div>
              <div class="info-description">Tempo médio de resposta</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Error Rate</div>
              <div class="info-value">0.1%</div>
              <div class="info-description">Taxa de erro</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Uptime</div>
              <div class="info-value">99.9%</div>
              <div class="info-description">Disponibilidade</div>
            </div>
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