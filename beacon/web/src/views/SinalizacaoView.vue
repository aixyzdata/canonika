<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Sinalização</h2>
        <span class="view-subtitle">Controle de sinais e alertas</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Ativo</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Novo Sinal
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
              <h4>Sinais Ativos</h4>
              <span class="card-subtitle">Transmissões em andamento</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">24</span>
            </div>
          </div>
          <div class="card-content">
            <div class="signals-list">
              <div class="signal-item">
                <div class="signal-icon emergency">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="signal-info">
                  <div class="signal-name">Alerta de Emergência</div>
                  <div class="signal-details">Prioridade: Alta | Duração: 5min</div>
                </div>
                <div class="signal-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="signal-item">
                <div class="signal-icon warning">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="signal-info">
                  <div class="signal-name">Aviso de Manutenção</div>
                  <div class="signal-details">Prioridade: Média | Duração: 10min</div>
                </div>
                <div class="signal-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="signal-item">
                <div class="signal-icon info">
                  <i class="fas fa-info-circle"></i>
                </div>
                <div class="signal-info">
                  <div class="signal-name">Informação Geral</div>
                  <div class="signal-details">Prioridade: Baixa | Duração: 3min</div>
                </div>
                <div class="signal-status">
                  <span class="status-badge online">Ativo</span>
                </div>
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
              <h4>Configurações</h4>
              <span class="card-subtitle">Parâmetros do sistema</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Frequência de Transmissão</label>
                <select class="form-control">
                  <option>Alta (1 segundo)</option>
                  <option>Média (5 segundos)</option>
                  <option>Baixa (10 segundos)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Volume do Sinal</label>
                <input type="range" min="0" max="100" value="75" class="form-control">
              </div>
              <div class="form-group">
                <label>Duração Padrão</label>
                <input type="number" value="5" class="form-control" placeholder="Minutos">
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
  name: 'SinalizacaoView'
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

.card-content {
  color: #e2e8f0;
}

.signals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.signal-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.signal-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.signal-icon.emergency {
  background: #ef4444;
}

.signal-icon.warning {
  background: #f59e0b;
}

.signal-icon.info {
  background: #3b82f6;
}

.signal-info {
  flex: 1;
}

.signal-name {
  color: #e2e8f0;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.signal-details {
  color: #94a3b8;
  font-size: 0.8rem;
}

.signal-status {
  display: flex;
  align-items: center;
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
}
</style> 