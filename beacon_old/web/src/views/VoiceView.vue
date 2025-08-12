<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Voice Service</h2>
        <span class="view-subtitle">Sistema de chamadas de voz</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Serviço Ativo</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Nova Chamada
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div class="card-title">
              <h4>Chamadas Ativas</h4>
              <span class="card-subtitle">Conexões em andamento</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">3</span>
            </div>
          </div>
          <div class="card-content">
            <div class="calls-list">
              <div class="call-item">
                <div class="call-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="call-info">
                  <div class="call-number">+55 11 99999-9999</div>
                  <div class="call-details">Duração: 4min 32s | Status: Ativa</div>
                </div>
                <div class="call-status">
                  <span class="status-badge online">Ativa</span>
                </div>
              </div>
              <div class="call-item">
                <div class="call-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="call-info">
                  <div class="call-number">+55 11 88888-8888</div>
                  <div class="call-details">Duração: 2min 15s | Status: Ativa</div>
                </div>
                <div class="call-status">
                  <span class="status-badge online">Ativa</span>
                </div>
              </div>
              <div class="call-item">
                <div class="call-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="call-info">
                  <div class="call-number">+55 11 77777-7777</div>
                  <div class="call-details">Duração: 1min 45s | Status: Ativa</div>
                </div>
                <div class="call-status">
                  <span class="status-badge online">Ativa</span>
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
              <h4>Métricas de Chamadas</h4>
              <span class="card-subtitle">Performance do serviço</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-value">12</span>
                <span class="metric-label">Total Chamadas</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">4.2s</span>
                <span class="metric-label">Duração Média</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">99.8%</span>
                <span class="metric-label">Qualidade</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">0.2%</span>
                <span class="metric-label">Taxa de Falha</span>
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
              <h4>Configurações de Voz</h4>
              <span class="card-subtitle">Parâmetros do serviço</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Provedor de Voz</label>
                <select class="form-control">
                  <option>Twilio Voice</option>
                  <option>Vonage Voice</option>
                  <option>Amazon Connect</option>
                </select>
              </div>
              <div class="form-group">
                <label>Número de Origem</label>
                <input type="text" value="+55 11 99999-9999" class="form-control">
              </div>
              <div class="form-group">
                <label>Timeout de Chamada</label>
                <input type="number" value="30" class="form-control" placeholder="segundos">
              </div>
              <div class="form-group">
                <label>Qualidade de Áudio</label>
                <select class="form-control">
                  <option>HD (720p)</option>
                  <option>Standard (480p)</option>
                  <option>Low (360p)</option>
                </select>
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
  name: 'VoiceView'
}
</script>

