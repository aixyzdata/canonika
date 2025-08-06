<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Transmissão</h2>
        <span class="view-subtitle">Controle de transmissões e broadcasts</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Transmissão Ativa</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-play"></i>
          Iniciar Broadcast
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-broadcast-tower"></i>
            </div>
            <div class="card-title">
              <h4>Broadcasts Ativos</h4>
              <span class="card-subtitle">Transmissões em tempo real</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">12</span>
            </div>
          </div>
          <div class="card-content">
            <div class="broadcast-list">
              <div class="broadcast-item">
                <div class="broadcast-icon">
                  <i class="fas fa-broadcast-tower"></i>
                </div>
                <div class="broadcast-info">
                  <div class="broadcast-name">Canal Principal</div>
                  <div class="broadcast-details">Frequência: 2.4GHz | Potência: 100W</div>
                </div>
                <div class="broadcast-status">
                  <span class="status-badge online">Transmitindo</span>
                </div>
              </div>
              <div class="broadcast-item">
                <div class="broadcast-icon">
                  <i class="fas fa-satellite"></i>
                </div>
                <div class="broadcast-info">
                  <div class="broadcast-name">Canal Secundário</div>
                  <div class="broadcast-details">Frequência: 5.8GHz | Potência: 50W</div>
                </div>
                <div class="broadcast-status">
                  <span class="status-badge online">Transmitindo</span>
                </div>
              </div>
              <div class="broadcast-item">
                <div class="broadcast-icon">
                  <i class="fas fa-wifi"></i>
                </div>
                <div class="broadcast-info">
                  <div class="broadcast-name">Canal de Backup</div>
                  <div class="broadcast-details">Frequência: 900MHz | Potência: 25W</div>
                </div>
                <div class="broadcast-status">
                  <span class="status-badge warning">Em Espera</span>
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
              <h4>Métricas de Transmissão</h4>
              <span class="card-subtitle">Performance e qualidade</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-value">99.8%</span>
                <span class="metric-label">Qualidade do Sinal</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">-45dBm</span>
                <span class="metric-label">Força do Sinal</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">0.1%</span>
                <span class="metric-label">Taxa de Erro</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">1.2K</span>
                <span class="metric-label">Pacotes/s</span>
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
              <h4>Configurações de Transmissão</h4>
              <span class="card-subtitle">Parâmetros técnicos</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Frequência Principal</label>
                <select class="form-control">
                  <option>2.4 GHz</option>
                  <option>5.8 GHz</option>
                  <option>900 MHz</option>
                </select>
              </div>
              <div class="form-group">
                <label>Potência de Transmissão</label>
                <input type="range" min="0" max="100" value="75" class="form-control">
                <span class="range-value">75%</span>
              </div>
              <div class="form-group">
                <label>Modo de Transmissão</label>
                <select class="form-control">
                  <option>Contínuo</option>
                  <option>Intermitente</option>
                  <option>Sob Demanda</option>
                </select>
              </div>
              <button class="btn btn-primary">Aplicar Configurações</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransmissaoView'
}
</script>

<style scoped>
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

.status-badge.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.card-content {
  color: #e2e8f0;
}

.broadcast-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.broadcast-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.broadcast-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.broadcast-info {
  flex: 1;
}

.broadcast-name {
  color: #e2e8f0;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.broadcast-details {
  color: #94a3b8;
  font-size: 0.8rem;
}

.broadcast-status {
  display: flex;
  align-items: center;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-control {
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.range-value {
  color: #94a3b8;
  font-size: 0.8rem;
  text-align: center;
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 