<template>
  <MasterPage 
    :service-config="skipperConfig"
    @view-changed="handleViewChange"
    @refresh-data="handleRefreshData"
  >
    <template #default="{ currentView, serviceConfig, user, refreshData }">
      <!-- Dashboard Principal do Skipper -->
      <div v-if="currentView === 'dashboard'" class="dashboard-container">
        <div class="dashboard-header">
          <h1>Dashboard Skipper</h1>
          <p>Centro de controle de navegação inteligente</p>
        </div>
        
        <div class="dashboard-grid">
          <!-- Status dos Sistemas -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Status dos Sistemas</h3>
              <span class="card-icon">🚢</span>
            </div>
            <div class="service-status-list">
              <div class="service-status">
                <div class="status-dot"></div>
                <span class="service-name">Motor Principal</span>
                <span class="service-port">Online</span>
              </div>
              <div class="service-status">
                <div class="status-dot"></div>
                <span class="service-name">Sistema de Navegação</span>
                <span class="service-port">Ativo</span>
              </div>
              <div class="service-status">
                <div class="status-dot"></div>
                <span class="service-name">Comunicações</span>
                <span class="service-port">Operacional</span>
              </div>
            </div>
          </div>

          <!-- Métricas de Navegação -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Métricas de Navegação</h3>
              <span class="card-icon">📊</span>
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">25.4</div>
                <div class="stat-label">Nós</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">127°</div>
                <div class="stat-label">Rumo</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">847</div>
                <div class="stat-label">Milhas</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">98%</div>
                <div class="stat-label">Eficiência</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View de Simulação -->
      <div v-else-if="currentView === 'simulacao'" class="service-view">
        <div class="view-header">
          <div>
            <h1>Simulação de Navegação</h1>
            <div class="view-status">
              <div class="status-dot"></div>
              <span>Simulador Ativo</span>
            </div>
          </div>
          <div class="view-actions">
            <button @click="refreshData" class="action-btn">
              <span>🔄</span> Atualizar
            </button>
            <button class="action-btn primary">
              <span>▶️</span> Iniciar Simulação
              </button>
            </div>
          </div>

        <div class="service-cards">
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Cenários de Simulação</h3>
              <span class="card-icon">🎯</span>
            </div>
            <div class="analysis-list">
              <div class="analysis-item">
                <div class="analysis-icon">🌊</div>
                <div class="analysis-details">
                  <div class="analysis-title">Navegação em Mar Agitado</div>
                  <div class="analysis-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 75%"></div>
                    </div>
                    <span class="progress-text">75%</span>
                  </div>
                  <div class="analysis-time">Tempo estimado: 2h 30min</div>
                </div>
              </div>
              <div class="analysis-item">
                <div class="analysis-icon">⚓</div>
                <div class="analysis-details">
                  <div class="analysis-title">Manobra de Atracação</div>
                  <div class="analysis-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 45%"></div>
                    </div>
                    <span class="progress-text">45%</span>
                  </div>
                  <div class="analysis-time">Tempo estimado: 1h 15min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View de Fontes -->
      <div v-else-if="currentView === 'fontes'" class="service-view">
        <div class="view-header">
          <div>
            <h1>Fontes de Dados</h1>
            <div class="view-status">
              <div class="status-dot"></div>
              <span>12 Fontes Conectadas</span>
            </div>
          </div>
          <div class="view-actions">
            <button @click="refreshData" class="action-btn">
              <span>🔄</span> Atualizar
            </button>
          </div>
        </div>

        <div class="service-cards">
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Fontes Ativas</h3>
              <span class="card-icon">📡</span>
            </div>
            <div class="service-status-list">
              <div class="service-status">
                <div class="status-dot"></div>
                <span class="service-name">GPS Primário</span>
                <span class="service-port">Alta Precisão</span>
              </div>
              <div class="service-status">
                <div class="status-dot"></div>
                <span class="service-name">Radar Marítimo</span>
                <span class="service-port">360° Cobertura</span>
              </div>
              <div class="service-status">
                <div class="status-dot"></div>
                <span class="service-name">Sensores Climáticos</span>
                <span class="service-port">Tempo Real</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View Padrão para outras views -->
      <div v-else class="service-view">
        <div class="view-header">
          <div>
            <h1>{{ getViewTitle(currentView) }}</h1>
            <div class="view-status">
              <div class="status-dot"></div>
              <span>Sistema Operacional</span>
            </div>
          </div>
          <div class="view-actions">
            <button @click="refreshData" class="action-btn">
              <span>🔄</span> Atualizar
            </button>
          </div>
        </div>

        <div class="service-info">
          <p>Funcionalidade {{ getViewTitle(currentView) }} em desenvolvimento</p>
          <div class="service-status">
            <div class="status-dot"></div>
            <span>Aguardando implementação</span>
          </div>
        </div>
  </div>
    </template>
  </MasterPage>
</template>

<script>
import MasterPage from './components/MasterPage.vue'

export default {
  name: 'SkipperApp',
  components: {
    MasterPage
  },
  data() {
    return {
      skipperConfig: {
        name: 'SKIPPER',
        subtitle: 'Navegação Inteligente',
        description: 'Sistema de controle e otimização de navegação marítima',
        iconClass: 'icon-skipper',
        menuItems: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            subtitle: 'Visão Geral',
            icon: '🏠'
          },
          {
            id: 'simulacao',
            title: 'Simulação',
            subtitle: 'Cenários Virtuais',
            icon: '🎮'
          },
          {
            id: 'fontes',
            title: 'Fontes',
            subtitle: 'Dados em Tempo Real',
            icon: '📡'
          },
          {
            id: 'analises',
            title: 'Análises',
            subtitle: 'Relatórios e Insights',
            icon: '📊'
          },
          {
            id: 'extracao',
            title: 'Extração',
            subtitle: 'Dados Históricos',
            icon: '📥'
          }
        ]
      }
    }
  },
  methods: {
    handleViewChange(viewId) {
      console.log(`Mudança de view para: ${viewId}`);
    },
    handleRefreshData() {
      console.log('Atualizando dados do Skipper...');
    },
    getViewTitle(viewId) {
      const menuItem = this.skipperConfig.menuItems.find(item => item.id === viewId);
      return menuItem ? menuItem.title : 'Desconhecido';
    }
  }
}
</script>

<style>
/* Estilos específicos das views do Skipper */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.dashboard-header p {
  color: #94a3b8;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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

.service-status-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(15, 23, 42, 0.3);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

.service-name {
  flex: 1;
  color: #e2e8f0;
  font-weight: 500;
}

.service-port {
  color: #64748b;
  font-size: 0.875rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.analysis-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.analysis-details {
  flex: 1;
}

.analysis-title {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.analysis-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.progress-bar {
  flex: 1;
  height: 0.5rem;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 0.25rem;
  transition: width 0.3s ease;
}

.progress-text {
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.875rem;
  min-width: 3rem;
}

.analysis-time {
  color: #64748b;
  font-size: 0.75rem;
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

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
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

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.service-info {
  text-align: center;
  padding: 2rem;
  }
  
.service-info p {
  color: #94a3b8;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  }
  
.service-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 600;
}
</style> 