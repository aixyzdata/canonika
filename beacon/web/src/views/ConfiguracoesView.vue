<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão das outras views -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-cog"></i>
        <div class="title-content">
          <h1>Configurações</h1>
          <p>Parâmetros do Sistema</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator warning"></div>
        <span>Configurando</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary btn-sm">
          <i class="fas fa-save me-2"></i>
          Salvar
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-undo me-2"></i>
          Restaurar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Configurações Gerais -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-cog text-primary me-2"></i>
            Configurações Gerais
          </h3>
          <p class="section-description">
            Configurações básicas do sistema Beacon.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-server"></i>
                </div>
                <div class="card-title">
                  <h4>Servidor</h4>
                  <span class="card-subtitle">Configurações do servidor</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">3703</span>
                    <span class="metric-label">Porta</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Development</span>
                    <span class="metric-label">Ambiente</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Vite</span>
                    <span class="metric-label">Build Tool</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-database"></i>
                </div>
                <div class="card-title">
                  <h4>Banco de Dados</h4>
                  <span class="card-subtitle">Configurações do DB</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Conectado</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">PostgreSQL</span>
                    <span class="metric-label">Tipo</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">5432</span>
                    <span class="metric-label">Porta</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">canonika</span>
                    <span class="metric-label">Database</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-user-cog"></i>
                </div>
                <div class="card-title">
                  <h4>Usuários</h4>
                  <span class="card-subtitle">Gerenciamento</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">JWT</span>
                    <span class="metric-label">Auth Type</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">24h</span>
                    <span class="metric-label">Token Expiry</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Admin</span>
                    <span class="metric-label">Role</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Configurações Avançadas -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-sliders-h text-info me-2"></i>
            Configurações Avançadas
          </h3>
          <p class="section-description">
            Configurações avançadas e parâmetros do sistema.
          </p>
        </div>
        
        <div class="section-content">
          <div class="info-cards">
            <div class="info-card">
              <div class="info-label">Log Level</div>
              <div class="info-value">INFO</div>
              <div class="info-description">Nível de log</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Cache TTL</div>
              <div class="info-value">300s</div>
              <div class="info-description">Tempo de vida do cache</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Max Connections</div>
              <div class="info-value">100</div>
              <div class="info-description">Conexões simultâneas</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Backup Schedule</div>
              <div class="info-value">Daily</div>
              <div class="info-description">Agendamento de backup</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfiguracoesView',
  mounted() {
    console.log('⚙️ ConfiguracoesView carregada')
  }
}
</script>