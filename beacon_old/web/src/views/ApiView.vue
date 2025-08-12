<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>REST API Service</h2>
        <span class="view-subtitle">Endpoints HTTP e documentação</span>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Serviço Ativo</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-book"></i>
          Documentação
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-satellite"></i>
            </div>
            <div class="card-title">
              <h4>Endpoints Ativos</h4>
              <span class="card-subtitle">APIs disponíveis</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">24</span>
            </div>
          </div>
          <div class="card-content">
            <div class="endpoints-list">
              <div class="endpoint-item">
                <div class="endpoint-method get">GET</div>
                <div class="endpoint-info">
                  <div class="endpoint-path">/api/v1/status</div>
                  <div class="endpoint-details">Status do sistema</div>
                </div>
                <div class="endpoint-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="endpoint-item">
                <div class="endpoint-method post">POST</div>
                <div class="endpoint-info">
                  <div class="endpoint-path">/api/v1/messages</div>
                  <div class="endpoint-details">Enviar mensagem</div>
                </div>
                <div class="endpoint-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="endpoint-item">
                <div class="endpoint-method put">PUT</div>
                <div class="endpoint-info">
                  <div class="endpoint-path">/api/v1/config</div>
                  <div class="endpoint-details">Atualizar configuração</div>
                </div>
                <div class="endpoint-status">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="endpoint-item">
                <div class="endpoint-method delete">DELETE</div>
                <div class="endpoint-info">
                  <div class="endpoint-path">/api/v1/connections</div>
                  <div class="endpoint-details">Remover conexão</div>
                </div>
                <div class="endpoint-status">
                  <span class="status-badge warning">Manutenção</span>
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
              <h4>Métricas da API</h4>
              <span class="card-subtitle">Performance e uso</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-value">850</span>
                <span class="metric-label">Req/min</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">12ms</span>
                <span class="metric-label">Response Time</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">99.9%</span>
                <span class="metric-label">Uptime</span>
              </div>
              <div class="metric-item">
                <span class="metric-value">0.1%</span>
                <span class="metric-label">Error Rate</span>
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
              <h4>Configurações da API</h4>
              <span class="card-subtitle">Parâmetros do serviço</span>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-form">
              <div class="form-group">
                <label>Porta da API</label>
                <input type="number" value="8000" class="form-control">
              </div>
              <div class="form-group">
                <label>Rate Limiting</label>
                <select class="form-control">
                  <option>1000 req/min</option>
                  <option>500 req/min</option>
                  <option>100 req/min</option>
                </select>
              </div>
              <div class="form-group">
                <label>Timeout</label>
                <input type="number" value="30" class="form-control" placeholder="segundos">
              </div>
              <div class="form-group">
                <label>CORS</label>
                <div class="checkbox-group">
                  <input type="checkbox" id="api-cors" checked>
                  <label for="api-cors">Habilitar CORS</label>
                </div>
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
  name: 'ApiView'
}
</script>

