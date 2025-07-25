<template>
  <div class="tollgate-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-shield-alt"></i>
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
        <button @click="openModule" class="action-btn primary">
          <i class="fas fa-shield-alt"></i>
          Ativar Proteção
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <!-- Alertas de Segurança -->
        <div class="service-card">
          <div class="card-header">
            <h3>Alertas de Segurança</h3>
            <div class="card-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">{{ config.metrics[0].value }}</div>
              <div class="balance-label">{{ config.metrics[0].label }}</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Ameaças Bloqueadas:</span>
                <span class="detail-value">{{ config.metrics[1].value }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tempo de Resposta:</span>
                <span class="detail-value">{{ config.metrics[2].value }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Proteção:</span>
                <span class="detail-value">{{ config.metrics[3].value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Eventos Recentes -->
        <div class="service-card">
          <div class="card-header">
            <h3>Eventos Recentes</h3>
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

        <!-- Configurações -->
        <div class="service-card">
          <div class="card-header">
            <h3>Configurações</h3>
            <div class="card-icon">
              <i class="fas fa-cog"></i>
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
  </div>
</template>

<script>
import { getServiceConfig } from '../../shared/config/status-configs.js'

export default {
  name: 'GuardianView',
  data() {
    return {
      config: getServiceConfig('guardian')
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Guardian...')
      // Aqui você faria a chamada para a API do Guardian
      // e atualizaria os dados em tempo real
    },
    openModule() {
      window.open('http://localhost:3705/', '_blank')
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
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
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
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  background: rgba(15, 23, 42, 0.5);
}

.transaction-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.transaction-icon.success {
  background: #10b981;
}

.transaction-icon.warning {
  background: #f59e0b;
}

.transaction-icon.error {
  background: #ef4444;
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
  font-size: 0.875rem;
  font-weight: 600;
}

.transaction-amount.success {
  color: #10b981;
}

.transaction-amount.warning {
  color: #f59e0b;
}

.transaction-amount.error {
  color: #ef4444;
}

.transaction-time {
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.plan-item {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.plan-item:hover {
  background: rgba(15, 23, 42, 0.5);
  transform: translateY(-2px);
}

.plan-item.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.plan-name {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.plan-price {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.plan-credits {
  color: #3b82f6;
  font-size: 1rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.alert-item.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.alert-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.alert-item.warning .alert-icon {
  background: #f59e0b;
}

.alert-item.info .alert-icon {
  background: #3b82f6;
}

.alert-item.error .alert-icon {
  background: #ef4444;
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

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
