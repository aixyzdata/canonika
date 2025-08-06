<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Beacon - Sistema de Sinalização</h2>
        <span class="view-subtitle">Monitoramento e controle de sinais</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Online</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-sync"></i>
          Atualizar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Estatísticas Principais -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-broadcast-tower"></i>
            </div>
            <div class="card-title">
              <h4>Sinais Ativos</h4>
              <span class="card-subtitle">Transmissões em tempo real</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">24</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-value">24</span>
                <span class="metric-label">Sinais Ativos</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">12</span>
                <span class="metric-label">Em Espera</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">8</span>
                <span class="metric-label">Conectados</span>
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-wifi"></i>
            </div>
            <div class="card-title">
              <h4>Conectividade</h4>
              <span class="card-subtitle">Status das conexões</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Online</span>
            </div>
          </div>
          <div class="card-content">
            <div class="connection-status">
              <div class="status-item">
                <div class="status-dot online"></div>
                <span>WebSocket: Conectado</span>
              </div>
              <div class="status-item">
                <div class="status-dot online"></div>
                <span>API: Ativo</span>
              </div>
              <div class="status-item">
                <div class="status-dot online"></div>
                <span>Database: Sincronizado</span>
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
              <h4>Performance</h4>
              <span class="card-subtitle">Métricas do sistema</span>
            </div>
            <div class="card-actions">
              <span class="status-badge success">Excelente</span>
            </div>
          </div>
          <div class="card-content">
            <div class="performance-metrics">
              <div class="metric-item">
                <span class="metric-value">99.8%</span>
                <span class="metric-label">Uptime</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">45ms</span>
                <span class="metric-label">Latência</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">1.2K</span>
                <span class="metric-label">Sinais/min</span>
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
                Iniciar Transmissão
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
              <span class="card-subtitle">Últimas transmissões</span>
            </div>
          </div>
          <div class="card-content">
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon success">
                  <i class="fas fa-check"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Sinal de Emergência Transmitido</div>
                  <div class="activity-time">Há 2 minutos</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon info">
                  <i class="fas fa-info"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Sistema Reiniciado</div>
                  <div class="activity-time">Há 15 minutos</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon warning">
                  <i class="fas fa-exclamation"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Conexão Perdida - Reconectado</div>
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

<style scoped>
/* Estilos específicos do HomeView */
.tollgate-view {
  padding: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #475569;
}

.view-title h2 {
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.view-subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

.view-actions {
  display: flex;
  gap: 1rem;
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.card-title {
  flex: 1;
}

.card-title h4 {
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-subtitle {
  color: #94a3b8;
  font-size: 0.8rem;
}

.card-actions {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.online {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.success {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.card-content {
  color: #e2e8f0;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #94a3b8;
}

.connection-status {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  border: 1px solid #475569;
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.3);
}

.btn-info {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.btn-info:hover {
  background: rgba(59, 130, 246, 0.3);
}

.btn-warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.btn-warning:hover {
  background: rgba(245, 158, 11, 0.3);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.activity-icon.success {
  background: #10b981;
}

.activity-icon.info {
  background: #3b82f6;
}

.activity-icon.warning {
  background: #f59e0b;
}

.activity-content {
  flex: 1;
}

.activity-title {
  color: #e2e8f0;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.activity-time {
  color: #94a3b8;
  font-size: 0.8rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Responsive */
@media (max-width: 768px) {
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .metric-grid {
    grid-template-columns: 1fr;
  }
  
  .performance-metrics {
    grid-template-columns: 1fr;
  }
}
</style> 