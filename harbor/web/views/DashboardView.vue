<template>
  <div class="tollgate-view">
    <!-- Header Padronizado -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-tachometer-alt"></i>
        <div class="title-content">
          <h1>Dashboard Canonika - TESTE FINAL HOT RELOAD! ✅</h1>
          <p>Visão geral da plataforma</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>ONLINE</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData()" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="exportReport()" class="action-btn primary">
          <i class="fas fa-download"></i>
          Exportar Relatório
        </button>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="view-content">
      <!-- Status dos Serviços -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Status dos Serviços</h3>
            <div class="card-icon">
              <i class="fas fa-server"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="service-status-list">
              <div class="service-status online">
                <span class="status-dot"></span>
                <span class="service-name">Harbor</span>
                <span class="service-port">7721</span>
                <span class="service-description">Portal Central</span>
              </div>
              <div class="service-status online">
                <span class="status-dot"></span>
                <span class="service-name">Tollgate</span>
                <span class="service-port">7732</span>
                <span class="service-description">Sistema de Créditos</span>
              </div>
              <div class="service-status online">
                <span class="status-dot"></span>
                <span class="service-name">Quarter</span>
                <span class="service-port">7725</span>
                <span class="service-description">Gestão de Usuários</span>
              </div>
              <div class="service-status online">
                <span class="status-dot"></span>
                <span class="service-name">Diver</span>
                <span class="service-port">7723</span>
                <span class="service-description">Consulta Canônica</span>
              </div>
              <div class="service-status online">
                <span class="status-dot"></span>
                <span class="service-name">Skipper</span>
                <span class="service-port">7722</span>
                <span class="service-description">Análise de Dados</span>
              </div>
              <div class="service-status online">
                <span class="status-dot"></span>
                <span class="service-name">Ledger</span>
                <span class="service-port">7726</span>
                <span class="service-description">Contabilidade</span>
              </div>




              <div class="service-status online">
                <span class="status-dot"></span>
                <span class="service-name">Dock</span>
                <span class="service-port">7731</span>
                <span class="service-description">Conectividade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Estatísticas da Plataforma</h3>
            <div class="card-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-server"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">12</span>
                  <span class="stat-label">Serviços Ativos</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">1,247</span>
                  <span class="stat-label">Requisições Hoje</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">99.8%</span>
                  <span class="stat-label">Uptime</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">45ms</span>
                  <span class="stat-label">Latência Média</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações Rápidas -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Ações Rápidas</h3>
            <div class="card-icon">
              <i class="fas fa-bolt"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="quick-actions">
              <router-link to="/tollgate/status" class="quick-action-btn">
                <i class="fas fa-coins"></i>
                <span>Ver Créditos</span>
              </router-link>
              <router-link to="/quarter/status" class="quick-action-btn">
                <i class="fas fa-users"></i>
                <span>Gerenciar Usuários</span>
              </router-link>
              <router-link to="/skipper/status" class="quick-action-btn">
                <i class="fas fa-chart-line"></i>
                <span>Análise de Dados</span>
              </router-link>
              <router-link to="/ledger/status" class="quick-action-btn">
                <i class="fas fa-book"></i>
                <span>Contabilidade</span>
              </router-link>


            </div>
          </div>
        </div>
      </div>

      <!-- Atividade Recente -->
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Atividade Recente</h3>
            <div class="card-icon">
              <i class="fas fa-clock"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-coins"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Créditos adicionados</div>
                  <div class="activity-time">2 minutos atrás</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Novo usuário registrado</div>
                  <div class="activity-time">15 minutos atrás</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Análise concluída</div>
                  <div class="activity-time">1 hora atrás</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-download"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Extração de dados finalizada</div>
                  <div class="activity-time">2 horas atrás</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Atualização de segurança</div>
                  <div class="activity-time">3 horas atrás</div>
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
  name: 'DashboardView',
  data() {
    return {
      // Dados do dashboard
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do dashboard...');
    },
    exportReport() {
      console.log('Exportando relatório do dashboard...');
    }
  },
  mounted() {
    this.refreshData();
  }
}
</script>

<style scoped>
.tollgate-view {
  /* height: 100vh; */
  /* padding: 2rem; */
  /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); */
  /* color: #e2e8f0; */
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 1rem;
  border: 1px solid #475569;
}

.view-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-title i {
  color: #3b82f6;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.title-content {
  flex: 1;
}

.title-content h1 {
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.title-content p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.3;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.view-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.view-content {
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.service-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.card-icon {
  color: #3b82f6;
  font-size: 1.25rem;
}

.card-content {
  color: #94a3b8;
}

/* Status dos Serviços */
.service-status-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  transition: all 0.2s ease;
}

.service-status:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

.service-name {
  font-weight: 600;
  color: #e2e8f0;
  flex: 1;
}

.service-port {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.service-description {
  color: #94a3b8;
  font-size: 0.875rem;
  flex: 2;
}

/* Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* Ações Rápidas */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.quick-action-btn:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-color: #3b82f6;
  color: white;
  transform: translateY(-2px);
  text-decoration: none;
}

.quick-action-btn i {
  font-size: 1rem;
  flex-shrink: 0;
}

/* Atividade Recente */
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
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.activity-item:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.activity-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* Animações */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .service-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .service-description {
    flex: none;
  }
}
</style> 