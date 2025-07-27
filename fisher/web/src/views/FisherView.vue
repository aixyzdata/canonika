<template>
  <CanonikaViewTemplate
    title="Fisher"
    description="Tripulante de Pesca de Dados"
    header-icon="fas fa-fish"
    status-text="ONLINE"
    :primary-action="{
      text: 'Executar Missão',
      icon: 'fas fa-rocket',
      handler: openMissao
    }"
    @refresh="refreshData"
  >
    <div class="service-cards">
      <!-- Missões Executadas -->
      <div class="service-card">
        <div class="card-header">
          <h3>Missões Executadas</h3>
          <div class="card-icon">
            <i class="fas fa-rocket"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="balance-display">
            <div class="balance-value">{{ config.metrics[0].value }}</div>
            <div class="balance-label">{{ config.metrics[0].label }}</div>
          </div>
          <div class="balance-details">
            <div class="detail-item">
              <span class="detail-label">Dados Processados:</span>
              <span class="detail-value">{{ config.metrics[1].value }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fontes Ativas:</span>
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

    <!-- Modal de Missão -->
    <div v-if="showMissaoModal" class="modal-overlay" @click="closeMissaoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🚀 Executar Missão de Pesca</h3>
          <button @click="closeMissaoModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="executeMission" class="canonika-form">
            <div class="form-row">
              <div class="form-group">
                <label for="source">Fonte de Dados</label>
                <select
                  id="source"
                  v-model="missionForm.source"
                  class="form-control"
                  :disabled="isLoading"
                >
                  <option value="">Selecione uma fonte...</option>
                  <option value="receita-federal">Receita Federal - CNPJs</option>
                  <option value="open-food-facts">Open Food Facts</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="missionType">Tipo de Missão</label>
                <select
                  id="missionType"
                  v-model="missionForm.missionType"
                  class="form-control"
                  :disabled="isLoading"
                >
                  <option value="incremental">Incremental (Apenas atualizações)</option>
                  <option value="full">Completa (Todos os dados)</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!missionForm.source || isLoading"
              >
                <i class="fas fa-rocket"></i>
                {{ isLoading ? 'Executando...' : '🚀 Executar Missão' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </CanonikaViewTemplate>
</template>

<script>
import { serviceConfigs } from '../../../../shared/config/status-configs.js'
import CanonikaViewTemplate from '../../../../shared/templates/CanonikaViewTemplate.vue'

export default {
  name: 'FisherView',
  components: {
    CanonikaViewTemplate
  },
  data() {
    return {
      config: serviceConfigs.fisher,
      showMissaoModal: false,
      missionForm: {
        source: '',
        missionType: 'incremental'
      },
      isLoading: false
    }
  },
  methods: {
    refreshData() {
      // Implementar refresh dos dados
      console.log('Refreshing Fisher data...')
    },
    openMissao() {
      this.showMissaoModal = true
    },
    closeMissaoModal() {
      this.showMissaoModal = false
      this.missionForm = {
        source: '',
        missionType: 'incremental'
      }
    },
    async executeMission() {
      if (!this.missionForm.source) return
      
      this.isLoading = true
      
      try {
        // Simular execução de missão
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Aqui você implementaria a chamada real para a API do Fisher
        console.log('Executando missão:', this.missionForm)
        
        // Fechar modal após sucesso
        this.closeMissaoModal()
        
      } catch (error) {
        console.error('Erro na missão:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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