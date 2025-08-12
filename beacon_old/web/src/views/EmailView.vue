<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Email Service</h2>
        <span class="view-subtitle">Sistema de comunicação por email</span>
      </div>
      <div class="view-status">
        <div class="status-indicator warning"></div>
        <span>Em Manutenção</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Novo Email
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="card-title">
              <h4>Emails Recentes</h4>
              <span class="card-subtitle">Últimas comunicações</span>
            </div>
            <div class="card-actions">
              <span class="status-badge warning">89</span>
            </div>
          </div>
          <div class="card-content">
            <div class="emails-list">
              <div class="email-item">
                <div class="email-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="email-info">
                  <div class="email-subject">Relatório Diário - Sistema</div>
                  <div class="email-details">Para: admin@canonika.io | Status: Enviado | 2min atrás</div>
                </div>
                <div class="email-status">
                  <span class="status-badge online">Enviado</span>
                </div>
              </div>
              <div class="email-item">
                <div class="email-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="email-info">
                  <div class="email-subject">Alerta de Segurança</div>
                  <div class="email-details">Para: security@canonika.io | Status: Enviado | 15min atrás</div>
                </div>
                <div class="email-status">
                  <span class="status-badge online">Enviado</span>
                </div>
              </div>
              <div class="email-item">
                <div class="email-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="email-info">
                  <div class="email-subject">Boas-vindas - Novo Usuário</div>
                  <div class="email-details">Para: user@example.com | Status: Pendente | 1h atrás</div>
                </div>
                <div class="email-status">
                  <span class="status-badge warning">Pendente</span>
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
              <span class="card-subtitle">Performance do email</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-value">95%</span>
                <span class="metric-label">Taxa de Entrega</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">2min</span>
                <span class="metric-label">Tempo Médio</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">89</span>
                <span class="metric-label">Total Enviados</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">5%</span>
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
              <h4>Configurações de Email</h4>
              <span class="card-subtitle">Parâmetros do serviço</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Servidor SMTP</label>
                <input type="text" value="smtp.gmail.com" class="form-control">
              </div>
              <div class="form-group">
                <label>Porta SMTP</label>
                <input type="number" value="587" class="form-control">
              </div>
              <div class="form-group">
                <label>Email Remetente</label>
                <input type="email" value="noreply@canonika.io" class="form-control">
              </div>
              <div class="form-group">
                <label>Rate Limiting</label>
                <select class="form-control">
                  <option>100 emails/hora</option>
                  <option>50 emails/hora</option>
                  <option>10 emails/hora</option>
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
  name: 'EmailView'
}
</script>

