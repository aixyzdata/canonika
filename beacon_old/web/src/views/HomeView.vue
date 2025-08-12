<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Beacon - Plataforma de Comunicação</h2>
        <span class="view-subtitle">Sistema integrado de sinalização e comunicação</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Plataforma Online</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-sync"></i>
          Atualizar Status
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Status dos Serviços -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-broadcast-tower"></i>
            </div>
            <div class="card-title">
              <h4>WebSocket</h4>
              <span class="card-subtitle">Comunicação em tempo real</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Ativo</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-value">1.2K</span>
                <span class="metric-label">Conexões</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">45ms</span>
                <span class="metric-label">Latência</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">99.9%</span>
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
              <span class="card-subtitle">Endpoints HTTP</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Ativo</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-value">850</span>
                <span class="metric-label">Req/min</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">12ms</span>
                <span class="metric-label">Response</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">0.1%</span>
                <span class="metric-label">Erro</span>
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="card-title">
              <h4>Push Notifications</h4>
              <span class="card-subtitle">Alertas e notificações</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Ativo</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-value">24</span>
                <span class="metric-label">Ativos</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">156</span>
                <span class="metric-label">Enviados</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">98%</span>
                <span class="metric-label">Entrega</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Serviços Adicionais -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="card-title">
              <h4>Email Service</h4>
              <span class="card-subtitle">Comunicação por email</span>
            </div>
            <div class="card-actions">
              <span class="status-badge warning">Manutenção</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-value">89</span>
                <span class="metric-label">Enviados</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">95%</span>
                <span class="metric-label">Entrega</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">2min</span>
                <span class="metric-label">Delay</span>
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-sms"></i>
            </div>
            <div class="card-title">
              <h4>SMS Gateway</h4>
              <span class="card-subtitle">Mensagens SMS</span>
            </div>
            <div class="card-actions">
              <span class="status-badge offline">Offline</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-value">0</span>
                <span class="metric-label">Ativos</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">--</span>
                <span class="metric-label">Status</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">--</span>
                <span class="metric-label">Conexão</span>
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div class="card-title">
              <h4>Voice Service</h4>
              <span class="card-subtitle">Chamadas de voz</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Ativo</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-value">3</span>
                <span class="metric-label">Ativas</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">12</span>
                <span class="metric-label">Chamadas</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">4.2s</span>
                <span class="metric-label">Média</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações Rápidas -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-bolt"></i>
            </div>
            <div class="card-title">
              <h4>Ações Rápidas</h4>
              <span class="card-subtitle">Controles principais</span>
            </div>
          </div>
          <div class="card-content">
            <div class="action-buttons">
              <button class="btn btn-primary">
                <i class="fas fa-play"></i>
                Iniciar Todos
              </button>
              <button class="btn btn-secondary">
                <i class="fas fa-pause"></i>
                Pausar Sistema
              </button>
              <button class="btn btn-info">
                <i class="fas fa-cog"></i>
                Configurações
              </button>
              <button class="btn btn-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Teste de Emergência
              </button>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-history"></i>
            </div>
            <div class="card-title">
              <h4>Atividade Recente</h4>
              <span class="card-subtitle">Últimas operações</span>
            </div>
          </div>
          <div class="card-content">
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon success">
                  <i class="fas fa-check"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">WebSocket: Nova conexão estabelecida</div>
                  <div class="activity-time">Há 2 minutos</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon info">
                  <i class="fas fa-info"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Push Notification: 15 alertas enviados</div>
                  <div class="activity-time">Há 5 minutos</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon warning">
                  <i class="fas fa-exclamation"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">SMS Gateway: Falha de conexão</div>
                  <div class="activity-time">Há 15 minutos</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon success">
                  <i class="fas fa-check"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Voice Service: Chamada finalizada</div>
                  <div class="activity-time">Há 1 hora</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      // Dados do componente
    }
  },
  methods: {
    // Métodos do componente
  }
}
</script>

