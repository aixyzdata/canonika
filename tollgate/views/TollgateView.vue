<template>
  <div class="tollgate-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-toll"></i>
        <div class="title-content">
          <h1>Tollgate</h1>
          <p>Sistema de Controle de Acesso e Pagamentos</p>
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
        <button @click="addCredits()" class="action-btn primary">
          <i class="fas fa-plus"></i>
          Adicionar Créditos
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <!-- Saldo de Créditos -->
        <div class="service-card">
          <div class="card-header">
            <h3>Saldo de Créditos</h3>
            <div class="card-icon">
              <i class="fas fa-coins"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">{{ balance }}</div>
              <div class="balance-label">Créditos Disponíveis</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Plano Ativo:</span>
                <span class="detail-value">{{ currentPlan }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Próxima Renovação:</span>
                <span class="detail-value">{{ nextRenewal }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Limite Diário:</span>
                <span class="detail-value">{{ dailyLimit }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Transações Recentes -->
        <div class="service-card">
          <div class="card-header">
            <h3>Transações Recentes</h3>
            <div class="card-icon">
              <i class="fas fa-history"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="transaction-list">
              <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
                <div class="transaction-icon" :class="transaction.type">
                  <i :class="transaction.icon"></i>
                </div>
                <div class="transaction-details">
                  <div class="transaction-title">{{ transaction.title }}</div>
                  <div class="transaction-amount" :class="transaction.type">
                    {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }}
                  </div>
                  <div class="transaction-time">{{ transaction.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Planos Disponíveis -->
        <div class="service-card">
          <div class="card-header">
            <h3>Planos Disponíveis</h3>
            <div class="card-icon">
              <i class="fas fa-crown"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="plans-grid">
              <div 
                v-for="plan in plans" 
                :key="plan.id" 
                class="plan-item"
                :class="{ active: plan.id === currentPlanId }"
                @click="selectPlan(plan.id)"
              >
                <div class="plan-name">{{ plan.name }}</div>
                <div class="plan-price">{{ plan.price }}</div>
                <div class="plan-credits">{{ plan.credits }} créditos</div>
                <div class="plan-features">
                  <div v-for="feature in plan.features" :key="feature" class="plan-feature">
                    <i class="fas fa-check"></i>
                    {{ feature }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alertas e Notificações -->
        <div class="service-card">
          <div class="card-header">
            <h3>Alertas</h3>
            <div class="card-icon">
              <i class="fas fa-bell"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="alerts-list">
              <div v-for="alert in alerts" :key="alert.id" class="alert-item" :class="alert.type">
                <div class="alert-icon">
                  <i :class="alert.icon"></i>
                </div>
                <div class="alert-content">
                  <div class="alert-title">{{ alert.title }}</div>
                  <div class="alert-message">{{ alert.message }}</div>
                  <div class="alert-time">{{ alert.time }}</div>
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
  name: 'TollgateView',
  data() {
    return {
      balance: 1247,
      currentPlan: 'Premium',
      currentPlanId: 'premium',
      nextRenewal: '15/08/2024',
      dailyLimit: '500 créditos',
      transactions: [
        {
          id: 1,
          title: 'Créditos Adicionados',
          amount: 500,
          type: 'credit',
          icon: 'fas fa-plus',
          time: '2 minutos atrás'
        },
        {
          id: 2,
          title: 'Análise de Dados',
          amount: -25,
          type: 'debit',
          icon: 'fas fa-minus',
          time: '15 minutos atrás'
        },
        {
          id: 3,
          title: 'Processamento IA',
          amount: -10,
          type: 'debit',
          icon: 'fas fa-minus',
          time: '1 hora atrás'
        },
        {
          id: 4,
          title: 'Relatório Gerado',
          amount: -5,
          type: 'debit',
          icon: 'fas fa-minus',
          time: '2 horas atrás'
        }
      ],
      plans: [
        {
          id: 'basic',
          name: 'Básico',
          price: 'R$ 29/mês',
          credits: '500',
          features: ['Análises básicas', 'Suporte por email', '5 relatórios/mês']
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 'R$ 79/mês',
          credits: '2.000',
          features: ['Análises avançadas', 'Suporte prioritário', 'Relatórios ilimitados']
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 'R$ 149/mês',
          credits: '5.000',
          features: ['IA personalizada', 'Suporte 24/7', 'API completa']
        }
      ],
      alerts: [
        {
          id: 1,
          title: 'Créditos Baixos',
          message: 'Você tem apenas 247 créditos restantes',
          type: 'warning',
          icon: 'fas fa-exclamation-triangle',
          time: '1 hora atrás'
        },
        {
          id: 2,
          title: 'Renovação Próxima',
          message: 'Seu plano será renovado em 5 dias',
          type: 'info',
          icon: 'fas fa-info-circle',
          time: '2 horas atrás'
        }
      ]
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Tollgate...');
      // Aqui você faria a chamada para a API do Tollgate
    },
    addCredits() {
      console.log('Abrindo modal para adicionar créditos...');
      // Implementar modal de adição de créditos
    },
    selectPlan(planId) {
      this.currentPlanId = planId;
      this.currentPlan = this.plans.find(p => p.id === planId)?.name || 'Premium';
      console.log(`Plano selecionado: ${planId}`);
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
  margin-bottom: 0.5rem;
}

.balance-label {
  color: #94a3b8;
  font-size: 1rem;
}

.balance-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #475569;
}

.detail-label {
  color: #64748b;
  font-size: 0.875rem;
}

.detail-value {
  color: #e2e8f0;
  font-weight: 600;
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
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
}

.transaction-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.transaction-icon.credit {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.transaction-icon.debit {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.875rem;
}

.transaction-amount {
  font-weight: 600;
  font-size: 1rem;
}

.transaction-amount.credit {
  color: #10b981;
}

.transaction-amount.debit {
  color: #ef4444;
}

.transaction-time {
  color: #64748b;
  font-size: 0.75rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.plan-item {
  padding: 1rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  text-align: center;
  border: 1px solid #475569;
  transition: all 0.2s ease;
  cursor: pointer;
}

.plan-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.plan-item.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.plan-name {
  color: #e2e8f0;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.plan-price {
  color: #3b82f6;
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.plan-credits {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.plan-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.75rem;
}

.plan-feature i {
  color: #10b981;
  font-size: 0.625rem;
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
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0.5rem;
  border-left: 4px solid;
}

.alert-item.warning {
  border-left-color: #f59e0b;
}

.alert-item.info {
  border-left-color: #3b82f6;
}

.alert-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.alert-item.warning .alert-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.alert-item.info .alert-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
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
  font-size: 0.625rem;
}
</style> 
 
 