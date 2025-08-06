<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Configurações</h2>
        <span class="view-subtitle">Parâmetros do sistema Beacon</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Configurado</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-save"></i>
          Salvar Configurações
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="card-title">
              <h4>Configurações Gerais</h4>
              <span class="card-subtitle">Parâmetros básicos do sistema</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Nome do Sistema</label>
                <input type="text" value="Beacon Principal" class="form-control">
              </div>
              <div class="form-group">
                <label>Modo de Operação</label>
                <select class="form-control">
                  <option>Automático</option>
                  <option>Manual</option>
                  <option>Teste</option>
                </select>
              </div>
              <div class="form-group">
                <label>Intervalo de Verificação</label>
                <select class="form-control">
                  <option>1 segundo</option>
                  <option>5 segundos</option>
                  <option>10 segundos</option>
                  <option>30 segundos</option>
                </select>
              </div>
              <div class="form-group">
                <label>Log Level</label>
                <select class="form-control">
                  <option>Debug</option>
                  <option>Info</option>
                  <option>Warning</option>
                  <option>Error</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-network-wired"></i>
            </div>
            <div class="card-title">
              <h4>Configurações de Rede</h4>
              <span class="card-subtitle">Parâmetros de conectividade</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Endereço IP</label>
                <input type="text" value="192.168.1.100" class="form-control">
              </div>
              <div class="form-group">
                <label>Porta WebSocket</label>
                <input type="number" value="8080" class="form-control">
              </div>
              <div class="form-group">
                <label>Porta API</label>
                <input type="number" value="8000" class="form-control">
              </div>
              <div class="form-group">
                <label>Timeout de Conexão</label>
                <input type="number" value="30" class="form-control" placeholder="segundos">
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="card-title">
              <h4>Configurações de Segurança</h4>
              <span class="card-subtitle">Parâmetros de autenticação</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Autenticação Obrigatória</label>
                <div class="checkbox-group">
                  <input type="checkbox" id="auth-required" checked>
                  <label for="auth-required">Requer autenticação</label>
                </div>
              </div>
              <div class="form-group">
                <label>SSL/TLS</label>
                <div class="checkbox-group">
                  <input type="checkbox" id="ssl-enabled">
                  <label for="ssl-enabled">Habilitar SSL</label>
                </div>
              </div>
              <div class="form-group">
                <label>Rate Limiting</label>
                <select class="form-control">
                  <option>Desabilitado</option>
                  <option>Baixo (100 req/min)</option>
                  <option>Médio (50 req/min)</option>
                  <option>Alto (10 req/min)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Token de Acesso</label>
                <input type="text" value="beacon-access-2024" class="form-control" readonly>
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
              <h4>Configurações de Dados</h4>
              <span class="card-subtitle">Parâmetros de armazenamento</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Retenção de Logs</label>
                <select class="form-control">
                  <option>1 dia</option>
                  <option>7 dias</option>
                  <option>30 dias</option>
                  <option>90 dias</option>
                </select>
              </div>
              <div class="form-group">
                <label>Backup Automático</label>
                <div class="checkbox-group">
                  <input type="checkbox" id="auto-backup" checked>
                  <label for="auto-backup">Habilitar backup</label>
                </div>
              </div>
              <div class="form-group">
                <label>Frequência de Backup</label>
                <select class="form-control">
                  <option>Diário</option>
                  <option>Semanal</option>
                  <option>Mensal</option>
                </select>
              </div>
              <div class="form-group">
                <label>Compressão de Dados</label>
                <div class="checkbox-group">
                  <input type="checkbox" id="data-compression" checked>
                  <label for="data-compression">Habilitar compressão</label>
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
  name: 'ConfiguracoesView'
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

.card-content {
  color: #e2e8f0;
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

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
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