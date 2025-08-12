<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão das outras views -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-broadcast-tower"></i>
        <div class="title-content">
          <h1>Beacon</h1>
          <p>Sistema de Monitoramento</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-cog me-2"></i>
          Configurar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status do Sistema -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-chart-line text-success me-2"></i>
            Status do Sistema
          </h3>
          <p class="section-description">
            Monitoramento em tempo real dos serviços do Beacon.
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
                  <h4>WebSocket</h4>
                  <span class="card-subtitle">Conexão em tempo real</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Disponibilidade</span>
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
                  <i class="fas fa-satellite"></i>
                </div>
                <div class="card-title">
                  <h4>REST API</h4>
                  <span class="card-subtitle">HTTP Endpoints</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Funcionando</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">200</span>
                    <span class="metric-label">Status OK</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Fast</span>
                    <span class="metric-label">Performance</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Disponibilidade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Informações do Serviço -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-info-circle text-info me-2"></i>
            Informações do Serviço
          </h3>
          <p class="section-description">
            Detalhes sobre o Beacon e sua configuração atual.
          </p>
        </div>
        
        <div class="section-content">
          <div class="info-cards">
            <div class="info-card">
              <div class="info-label">Nome</div>
              <div class="info-value">Beacon</div>
              <div class="info-description">Sistema de Monitoramento</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Porta</div>
              <div class="info-value">3703</div>
              <div class="info-description">Porta de desenvolvimento</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Status</div>
              <div class="info-value">Online</div>
              <div class="info-description">Serviço ativo</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Versão</div>
              <div class="info-value">1.0.0</div>
              <div class="info-description">Versão atual</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Framework</div>
              <div class="info-value">Vue.js 3</div>
              <div class="info-description">Frontend framework</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Build Tool</div>
              <div class="info-value">Vite</div>
              <div class="info-description">Development server</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="canonika-footer">
        <div class="footer-info">
          <div class="footer-item">
            <i class="fas fa-code"></i>
            <span>Beacon v1.0.0</span>
          </div>
          <div class="footer-item">
            <i class="fas fa-clock"></i>
            <span>Última atualização: {{ new Date().toLocaleDateString('pt-BR') }}</span>
          </div>
          <div class="footer-item">
            <i class="fas fa-shield-alt"></i>
            <span>Status: Online</span>
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