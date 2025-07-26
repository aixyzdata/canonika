<template>
  <div class="tollgate-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-fish"></i>
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
        <button @click="openMissao" class="action-btn primary">
          <i class="fas fa-rocket"></i>
          Executar Missão
        </button>
      </div>
    </div>

    <div class="view-content">
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
                <div class="plan-name">{{ action.title }}</div>
                <div class="plan-price">{{ action.description }}</div>
                <div class="plan-credits">
                  <i :class="action.icon"></i>
                </div>
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
              <div v-for="system in config.systemStatus" :key="system.id" class="alert-item info">
                <div class="alert-icon">
                  <i class="fas fa-server"></i>
                </div>
                <div class="alert-content">
                  <div class="alert-title">{{ system.name }}</div>
                  <div class="alert-message">{{ system.description }}</div>
                  <div class="alert-time">{{ system.port }}</div>
                </div>
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
          <h3>🎣 Executar Missão de Pesca</h3>
          <button @click="closeMissaoModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="executarMissao" class="missao-form">
            <div class="form-group">
              <label for="source">Fonte de Dados</label>
              <select
                id="source"
                v-model="missaoForm.source"
                class="form-control"
                :disabled="isLoading"
              >
                <option value="">Selecione uma fonte</option>
                <option value="receita-federal">Receita Federal - CNPJs</option>
                <option value="open-food-facts">Open Food Facts</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="mission_type">Tipo de Missão</label>
              <select
                id="mission_type"
                v-model="missaoForm.mission_type"
                class="form-control"
                :disabled="isLoading"
              >
                <option value="incremental">Incremental (Apenas atualizações)</option>
                <option value="full">Completa (Todos os dados)</option>
              </select>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!missaoForm.source || isLoading"
              >
                <i class="fas fa-rocket"></i>
                {{ isLoading ? 'Executando...' : '🚀 Executar Missão' }}
              </button>
            </div>
          </form>

          <div v-if="missaoResult" class="result-section">
            <h4>📋 Resultado da Missão</h4>
            <div class="result-content">
              <pre>{{ JSON.stringify(missaoResult, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServiceConfig } from '../../../../shared/config/status-configs.js'

export default {
  name: 'FisherHarborView',
  data() {
    return {
      config: getServiceConfig('fisher'),
      showMissaoModal: false,
      missaoForm: {
        source: '',
        mission_type: 'incremental'
      },
      isLoading: false,
      missaoResult: null
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Fisher...')
      // Aqui você faria a chamada para a API do Fisher
      // e atualizaria os dados em tempo real
    },
    openMissao() {
      this.showMissaoModal = true
    },
    closeMissaoModal() {
      this.showMissaoModal = false
      this.missaoResult = null
    },
    async executarMissao() {
      if (!this.missaoForm.source) return
      
      this.isLoading = true
      this.missaoResult = null
      
      try {
        const response = await fetch('http://localhost:7724/fisher/mission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.missaoForm)
        })
        
        if (response.ok) {
          this.missaoResult = await response.json()
        } else {
          console.error('Erro na missão:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao executar missão:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.tollgate-view {
  height: 100%;
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

.balance-display {
  text-align: center;
  margin-bottom: 1.5rem;
}

.balance-value {
  font-size: 3rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.balance-label {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.balance-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #475569;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.detail-value {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.transaction-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.transaction-icon.success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.transaction-amount {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.transaction-amount.success {
  color: #10b981;
}

.transaction-time {
  color: #64748b;
  font-size: 0.75rem;
}

.plans-grid {
  display: grid;
  gap: 1rem;
}

.plan-item {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.plan-item:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.plan-name {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  flex: 1;
}

.plan-price {
  color: #94a3b8;
  font-size: 0.75rem;
  flex: 1;
}

.plan-credits {
  color: #3b82f6;
  font-size: 1.25rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.alert-icon {
  color: #3b82f6;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.alert-message {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.alert-time {
  color: #64748b;
  font-size: 0.75rem;
}

/* Modal Styles */
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
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #475569;
}

.modal-header h3 {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: #e2e8f0;
  background: rgba(148, 163, 184, 0.1);
}

.modal-body {
  padding: 1.5rem;
}

.missao-form {
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
  font-weight: 600;
  font-size: 0.875rem;
}

.form-control {
  background: #1e293b;
  border: 1px solid #475569;
  color: #e2e8f0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control::placeholder {
  color: #64748b;
}

.form-control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.result-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #475569;
}

.result-section h4 {
  color: #e2e8f0;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.result-content {
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

.result-content pre {
  color: #e2e8f0;
  font-size: 0.75rem;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style> 