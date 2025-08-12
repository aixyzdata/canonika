<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Push Notifications</h2>
        <span class="view-subtitle">Sistema de alertas e notificações</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Serviço Ativo</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Nova Notificação
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="card-title">
              <h4>Notificações Ativas</h4>
              <span class="card-subtitle">Alertas em andamento</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">24</span>
            </div>
          </div>
          <div class="card-content">
            <div class="notifications-list">
              <div class="notification-item">
                <div class="notification-icon emergency">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="notification-info">
                  <div class="notification-title">Alerta de Emergência</div>
                  <div class="notification-details">Prioridade: Alta | Enviados: 156 | Taxa: 98%</div>
                </div>
                <div class="notification-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="notification-item">
                <div class="notification-icon warning">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="notification-info">
                  <div class="notification-title">Aviso de Manutenção</div>
                  <div class="notification-details">Prioridade: Média | Enviados: 89 | Taxa: 95%</div>
                </div>
                <div class="notification-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="notification-item">
                <div class="notification-icon info">
                  <i class="fas fa-info-circle"></i>
                </div>
                <div class="notification-info">
                  <div class="notification-title">Informação Geral</div>
                  <div class="notification-details">Prioridade: Baixa | Enviados: 234 | Taxa: 99%</div>
                </div>
                <div class="notification-status">
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
              <h4>Métricas de Entrega</h4>
              <span class="card-subtitle">Performance das notificações</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-value">98%</span>
                <span class="metric-label">Taxa de Entrega</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">2.3s</span>
                <span class="metric-label">Tempo Médio</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">479</span>
                <span class="metric-label">Total Enviadas</span>
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
              <h4>Configurações Push</h4>
              <span class="card-subtitle">Parâmetros do serviço</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Serviço Push</label>
                <select class="form-control">
                  <option>Firebase Cloud Messaging</option>
                  <option>Apple Push Notification</option>
                  <option>Web Push API</option>
                </select>
              </div>
              <div class="form-group">
                <label>Timeout de Entrega</label>
                <input type="number" value="30" class="form-control" placeholder="segundos">
              </div>
              <div class="form-group">
                <label>Retry Attempts</label>
                <input type="number" value="3" class="form-control">
              </div>
              <div class="form-group">
                <label>Batch Size</label>
                <input type="number" value="100" class="form-control">
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
  name: 'PushView'
}
</script>

