<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>SMS Gateway</h2>
        <span class="view-subtitle">Sistema de mensagens SMS</span>
      </div>
      <div class="view-status">
        <div class="status-indicator offline"></div>
        <span>Serviço Offline</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Nova Mensagem
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-sms"></i>
            </div>
            <div class="card-title">
              <h4>Mensagens SMS</h4>
              <span class="card-subtitle">Histórico de envios</span>
            </div>
            <div class="card-actions">
              <span class="status-badge offline">0</span>
            </div>
          </div>
          <div class="card-content">
            <div class="sms-list">
              <div class="sms-item">
                <div class="sms-icon">
                  <i class="fas fa-sms"></i>
                </div>
                <div class="sms-info">
                  <div class="sms-text">Alerta de Segurança - Sistema</div>
                  <div class="sms-details">Para: +55 11 99999-9999 | Status: Falha | 2h atrás</div>
                </div>
                <div class="sms-status">
                  <span class="status-badge offline">Falha</span>
                </div>
              </div>
              <div class="sms-item">
                <div class="sms-icon">
                  <i class="fas fa-sms"></i>
                </div>
                <div class="sms-info">
                  <div class="sms-text">Código de Verificação</div>
                  <div class="sms-details">Para: +55 11 88888-8888 | Status: Falha | 4h atrás</div>
                </div>
                <div class="sms-status">
                  <span class="status-badge offline">Falha</span>
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
              <h4>Métricas de Entrega</h4>
              <span class="card-subtitle">Performance do SMS</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-value">0%</span>
                <span class="metric-label">Taxa de Entrega</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">--</span>
                <span class="metric-label">Tempo Médio</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">0</span>
                <span class="metric-label">Total Enviados</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">100%</span>
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
              <h4>Configurações SMS</h4>
              <span class="card-subtitle">Parâmetros do serviço</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Provedor SMS</label>
                <select class="form-control">
                  <option>Twilio</option>
                  <option>Vonage</option>
                  <option>Zenvia</option>
                </select>
              </div>
              <div class="form-group">
                <label>Account SID</label>
                <input type="text" value="" class="form-control" placeholder="Digite o SID">
              </div>
              <div class="form-group">
                <label>Auth Token</label>
                <input type="password" value="" class="form-control" placeholder="Digite o token">
              </div>
              <div class="form-group">
                <label>Número Remetente</label>
                <input type="text" value="" class="form-control" placeholder="+55 11 99999-9999">
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
  name: 'SmsView'
}
</script>

