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

