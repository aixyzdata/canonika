<template>
  <div class="tollgate-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-search"></i>
        <div class="title-content">
          <h1>{{ config.serviceName }}</h1>
          <p>{{ config.serviceDescription }}</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>{{ config.statusText }}</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="openConsulta" class="action-btn primary">
          <i class="fas fa-search"></i>
          Consultar Produto
        </button>
      </div>
    </div>

    <div class="view-content">
      <div class="service-cards">
        <!-- Consultas Realizadas -->
        <div class="service-card">
          <div class="card-header">
            <h3>Consultas Realizadas</h3>
            <div class="card-icon">
              <i class="fas fa-search"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">{{ config.metrics[0].value }}</div>
              <div class="balance-label">{{ config.metrics[0].label }}</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Produtos Encontrados:</span>
                <span class="detail-value">{{ config.metrics[1].value }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Empresas Cadastradas:</span>
                <span class="detail-value">{{ config.metrics[2].value }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Sucesso:</span>
                <span class="detail-value">{{ config.metrics[3].value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Atividades Recentes -->
        <div class="service-card">
          <div class="card-header">
            <h3>Atividades Recentes</h3>
            <div class="card-icon">
              <i class="fas fa-history"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="transaction-list">
              <div v-for="activity in config.recentActivity" :key="activity.id" class="transaction-item">
                <div class="transaction-icon success">
                  <i :class="activity.icon"></i>
                </div>
                <div class="transaction-details">
                  <div class="transaction-title">{{ activity.title }}</div>
                  <div class="transaction-amount success">
                    {{ activity.description }}
                  </div>
                  <div class="transaction-time">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ferramentas Disponíveis -->
        <div class="service-card">
          <div class="card-header">
            <h3>Ferramentas</h3>
            <div class="card-icon">
              <i class="fas fa-tools"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="plans-grid">
              <div 
                v-for="action in config.actions" 
                :key="action.id" 
                class="plan-item"
                @click="action.handler"
              >
                <div class="plan-name">{{ action.name }}</div>
                <div class="plan-price">{{ action.description }}</div>
                <div class="plan-credits">{{ action.status }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status do Sistema -->
        <div class="service-card">
          <div class="card-header">
            <h3>Status do Sistema</h3>
            <div class="card-icon">
              <i class="fas fa-server"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="alerts-list">
              <div v-for="status in config.systemStatus" :key="status.id" class="alert-item info">
                <div class="alert-icon">
                  <i class="fas fa-check"></i>
                </div>
                <div class="alert-content">
                  <div class="alert-title">{{ status.name }}</div>
                  <div class="alert-message">{{ status.description }}</div>
                  <div class="alert-time">{{ status.port }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Consulta -->
    <div v-if="showConsultaModal" class="modal-overlay" @click="closeConsultaModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🔍 Consulta de Produto</h3>
          <button @click="closeConsultaModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="consultarProduto" class="canonika-form">
            <div class="form-row">
              <div class="form-group">
                <label for="ean">EAN (Código de Barras)</label>
                <input
                  type="text"
                  id="ean"
                  v-model="consultaForm.ean"
                  placeholder="Ex: 7891234567890"
                  class="form-control"
                  :disabled="isLoading"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="description">Descrição (Opcional)</label>
                <input
                  type="text"
                  id="description"
                  v-model="consultaForm.description"
                  placeholder="Ex: Notebook Lenovo Ideapad 3 15"
                  class="form-control"
                  :disabled="isLoading"
                >
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!consultaForm.ean || isLoading"
              >
                <i class="fas fa-search"></i>
                {{ isLoading ? 'Consultando...' : '🔍 Consultar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serviceConfigs } from '../../../../shared/config/status-configs.js'

export default {
  name: 'DiverView',
  data() {
    return {
      config: serviceConfigs.diver,
      showConsultaModal: false,
      consultaForm: {
        ean: '',
        description: ''
      },
      isLoading: false
    }
  },
  methods: {
    refreshData() {
      // Implementar refresh dos dados
      console.log('Refreshing Diver data...')
    },
    openConsulta() {
      this.showConsultaModal = true
    },
    closeConsultaModal() {
      this.showConsultaModal = false
      this.consultaForm = {
        ean: '',
        description: ''
      }
    },
    async consultarProduto() {
      if (!this.consultaForm.ean) return
      
      this.isLoading = true
      
      try {
        // Simular consulta à API
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Aqui você implementaria a chamada real para a API do Diver
        console.log('Consultando produto:', this.consultaForm)
        
        // Fechar modal após sucesso
        this.closeConsultaModal()
        
      } catch (error) {
        console.error('Erro na consulta:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do Diver */
.tollgate-view .view-title i {
  color: #06b6d4; /* Cyan para Diver */
}

.action-btn {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  color: #06b6d4;
}

.action-btn:hover {
  background: rgba(6, 182, 212, 0.2);
}

.action-btn.primary {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border-color: #06b6d4;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
}

.balance-value {
  color: #06b6d4;
}

.transaction-icon.success {
  background: #06b6d4;
}

.transaction-amount.success {
  color: #06b6d4;
}

.plan-item.active {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.1);
}

.plan-credits {
  color: #06b6d4;
}

.alert-item.info .alert-icon {
  background: #06b6d4;
}

.alert-item.info {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  color: #e2e8f0;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
}

.modal-close:hover {
  color: #e2e8f0;
}

.canonika-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
}

.form-control {
  background: #334155;
  border: 1px solid #475569;
  color: #e2e8f0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-control:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.form-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>

<style>
@import '../../../../shared/styles/canonika-view.css';
</style> 