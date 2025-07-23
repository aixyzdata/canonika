<template>
  <div id="app" class="tollgate-app">
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);">
      <div class="container-fluid">
        <div class="navbar-brand d-flex align-items-center">
          <div class="logo-icon me-2">
            <div class="logo-hexagon"></div>
            <div class="logo-pulse"></div>
          </div>
          <div class="logo-text-container">
            <h1 class="logo-text mb-0">CANONIKA</h1>
            <span class="logo-subtitle">TOLLGATE</span>
          </div>
        </div>
        
        <div class="navbar-nav ms-auto">
          <div v-if="user" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
              <div class="user-avatar me-2">
                <span>{{ user.name.charAt(0).toUpperCase() }}</span>
              </div>
              <span>{{ user.name }}</span>
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" @click="logout">Sair</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-fluid mt-4">
      <div v-if="!user" class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="logo-icon-large mx-auto mb-3">
                  <div class="logo-hexagon-large"></div>
                  <div class="logo-pulse-large"></div>
                </div>
                <h2 class="card-title">Acesso ao Tollgate</h2>
                <p class="text-muted">Sistema de Controle de Créditos</p>
              </div>
              
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="loginForm.email" 
                    required
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Senha</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="loginForm.password" 
                    required
                  >
                </div>
                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <button type="submit" class="btn btn-primary w-100">Entrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="row">
        <!-- Sidebar -->
        <div class="col-md-3">
          <div class="card shadow-sm border-0">
            <div class="card-body">
              <h5 class="card-title mb-3">Menu</h5>
              <div class="list-group list-group-flush">
                <a 
                  href="#" 
                  class="list-group-item list-group-item-action"
                  :class="{ active: currentView === 'dashboard' }"
                  @click="setView('dashboard')"
                >
                  <i class="fas fa-tachometer-alt me-2"></i>
                  Dashboard
                </a>
                <a 
                  href="#" 
                  class="list-group-item list-group-item-action"
                  :class="{ active: currentView === 'transactions' }"
                  @click="setView('transactions')"
                >
                  <i class="fas fa-exchange-alt me-2"></i>
                  Transações
                </a>
                <a 
                  href="#" 
                  class="list-group-item list-group-item-action"
                  :class="{ active: currentView === 'plans' }"
                  @click="setView('plans')"
                >
                  <i class="fas fa-credit-card me-2"></i>
                  Planos
                </a>
                <a 
                  href="#" 
                  class="list-group-item list-group-item-action"
                  :class="{ active: currentView === 'alerts' }"
                  @click="setView('alerts')"
                >
                  <i class="fas fa-bell me-2"></i>
                  Alertas
                </a>
                <a 
                  v-if="isAdmin"
                  href="#" 
                  class="list-group-item list-group-item-action"
                  :class="{ active: currentView === 'admin' }"
                  @click="setView('admin')"
                >
                  <i class="fas fa-cog me-2"></i>
                  Administração
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-md-9">
          <!-- Dashboard -->
          <div v-if="currentView === 'dashboard'" class="dashboard">
            <div class="row mb-4">
              <div class="col-12">
                <h2 class="mb-3">Dashboard de Créditos</h2>
              </div>
            </div>

            <!-- Credit Balance Cards -->
            <div class="row mb-4">
              <div class="col-md-3">
                <div class="card bg-primary text-white">
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h6 class="card-title">Total</h6>
                        <h3 class="mb-0">{{ creditBalance.total_credits?.toFixed(2) || '0.00' }}</h3>
                      </div>
                      <i class="fas fa-coins fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-success text-white">
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h6 class="card-title">Padrão</h6>
                        <h3 class="mb-0">{{ creditBalance.standard_credits?.toFixed(2) || '0.00' }}</h3>
                      </div>
                      <i class="fas fa-star fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-warning text-white">
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h6 class="card-title">Bônus</h6>
                        <h3 class="mb-0">{{ creditBalance.bonus_credits?.toFixed(2) || '0.00' }}</h3>
                      </div>
                      <i class="fas fa-gift fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-info text-white">
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h6 class="card-title">Recorrente</h6>
                        <h3 class="mb-0">{{ creditBalance.recurring_credits?.toFixed(2) || '0.00' }}</h3>
                      </div>
                      <i class="fas fa-sync fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Transactions -->
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">Transações Recentes</h5>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Módulo</th>
                            <th>Créditos</th>
                            <th>Descrição</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="tx in recentTransactions" :key="tx.id">
                            <td>{{ formatDate(tx.timestamp) }}</td>
                            <td>
                              <span :class="getTransactionBadgeClass(tx.transaction_type)">
                                {{ getTransactionTypeLabel(tx.transaction_type) }}
                              </span>
                            </td>
                            <td>{{ tx.module }}</td>
                            <td>{{ tx.credits_amount.toFixed(2) }}</td>
                            <td>{{ tx.description }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Transactions -->
          <div v-if="currentView === 'transactions'" class="transactions">
            <div class="row mb-4">
              <div class="col-12">
                <h2 class="mb-3">Histórico de Transações</h2>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Transações</h5>
                    <button class="btn btn-outline-primary btn-sm" @click="exportTransactions">
                      <i class="fas fa-download me-1"></i>
                      Exportar CSV
                    </button>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Módulo</th>
                            <th>Créditos</th>
                            <th>Referência</th>
                            <th>Descrição</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="tx in transactions" :key="tx.id">
                            <td>{{ tx.id }}</td>
                            <td>{{ formatDate(tx.timestamp) }}</td>
                            <td>
                              <span :class="getTransactionBadgeClass(tx.transaction_type)">
                                {{ getTransactionTypeLabel(tx.transaction_type) }}
                              </span>
                            </td>
                            <td>{{ tx.module }}</td>
                            <td>{{ tx.credits_amount.toFixed(2) }}</td>
                            <td>{{ tx.external_reference || '-' }}</td>
                            <td>{{ tx.description }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Plans -->
          <div v-if="currentView === 'plans'" class="plans">
            <div class="row mb-4">
              <div class="col-12">
                <h2 class="mb-3">Planos de Créditos</h2>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4" v-for="plan in creditPlans" :key="plan.id">
                <div class="card h-100">
                  <div class="card-header text-center">
                    <h5 class="mb-0">{{ plan.name }}</h5>
                  </div>
                  <div class="card-body text-center">
                    <h2 class="text-primary mb-3">R$ {{ plan.price.toFixed(2) }}</h2>
                    <p class="text-muted mb-3">{{ plan.monthly_credits }} créditos/mês</p>
                    <ul class="list-unstyled">
                      <li v-for="feature in plan.features" :key="feature" class="mb-2">
                        <i class="fas fa-check text-success me-2"></i>
                        {{ feature }}
                      </li>
                    </ul>
                  </div>
                  <div class="card-footer text-center">
                    <button class="btn btn-primary">Selecionar Plano</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div v-if="currentView === 'alerts'" class="alerts">
            <div class="row mb-4">
              <div class="col-12">
                <h2 class="mb-3">Alertas de Créditos</h2>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">Configurar Alertas</h5>
                  </div>
                  <div class="card-body">
                    <form @submit.prevent="createAlert">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Tipo de Alerta</label>
                            <select class="form-select" v-model="newAlert.alert_type">
                              <option value="threshold">Limite de Créditos</option>
                              <option value="zero">Créditos Zerados</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Valor (%)</label>
                            <input type="number" class="form-control" v-model="newAlert.percentage_value" min="0" max="100">
                          </div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary">Criar Alerta</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin -->
          <div v-if="currentView === 'admin' && isAdmin" class="admin">
            <div class="row mb-4">
              <div class="col-12">
                <h2 class="mb-3">Administração</h2>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">Adicionar Créditos</h5>
                  </div>
                  <div class="card-body">
                    <form @submit.prevent="addCredits">
                      <div class="mb-3">
                        <label class="form-label">Usuário ID</label>
                        <input type="text" class="form-control" v-model="creditAddition.user_id" required>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Tipo de Crédito</label>
                        <select class="form-select" v-model="creditAddition.credit_type">
                          <option value="standard">Padrão</option>
                          <option value="bonus">Bônus</option>
                          <option value="recurring">Recorrente</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Quantidade</label>
                        <input type="number" class="form-control" v-model="creditAddition.amount" required>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Descrição</label>
                        <input type="text" class="form-control" v-model="creditAddition.description" required>
                      </div>
                      <button type="submit" class="btn btn-primary">Adicionar Créditos</button>
                    </form>
                  </div>
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
  name: 'App',
  data() {
    return {
      user: null,
      loginForm: {
        email: '',
        password: ''
      },
      error: null,
      currentView: 'dashboard',
      creditBalance: {},
      transactions: [],
      creditPlans: [],
      creditAlerts: [],
      newAlert: {
        alert_type: 'threshold',
        percentage_value: 90
      },
      creditAddition: {
        user_id: '',
        credit_type: 'standard',
        amount: 0,
        description: ''
      }
    }
  },
  computed: {
    isAdmin() {
      return this.user?.roles?.includes('admin') || false;
    },
    recentTransactions() {
      return this.transactions.slice(0, 5);
    }
  },
  methods: {
    async login() {
      this.error = null;
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginForm)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Erro no login');
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        await this.loadUserData();
      } catch (e) {
        this.error = e.message;
      }
    },
    
    async loadUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Simular dados do usuário
        this.user = {
          id: 'admin-001',
          name: 'Administrador',
          email: 'admin@canonika.io',
          roles: ['admin']
        };
        
        await this.loadCreditBalance();
        await this.loadTransactions();
        await this.loadCreditPlans();
        await this.loadCreditAlerts();
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    },
    
    async loadCreditBalance() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/credits/balance/${this.user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.creditBalance = await response.json();
        }
      } catch (e) {
        console.error('Erro ao carregar saldo:', e);
      }
    },
    
    async loadTransactions() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/credits/transactions/${this.user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.transactions = await response.json();
        }
      } catch (e) {
        console.error('Erro ao carregar transações:', e);
      }
    },
    
    async loadCreditPlans() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/credits/plans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.creditPlans = await response.json();
        }
      } catch (e) {
        console.error('Erro ao carregar planos:', e);
      }
    },
    
    async loadCreditAlerts() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/credits/alerts/${this.user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.creditAlerts = await response.json();
        }
      } catch (e) {
        console.error('Erro ao carregar alertas:', e);
      }
    },
    
    async addCredits() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/credits/add', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.creditAddition)
        });
        
        if (response.ok) {
          alert('Créditos adicionados com sucesso!');
          await this.loadCreditBalance();
          this.creditAddition = {
            user_id: '',
            credit_type: 'standard',
            amount: 0,
            description: ''
          };
        }
      } catch (e) {
        console.error('Erro ao adicionar créditos:', e);
      }
    },
    
    async createAlert() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/credits/alerts', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            user_id: this.user.id,
            ...this.newAlert
          })
        });
        
        if (response.ok) {
          alert('Alerta criado com sucesso!');
          await this.loadCreditAlerts();
          this.newAlert = {
            alert_type: 'threshold',
            percentage_value: 90
          };
        }
      } catch (e) {
        console.error('Erro ao criar alerta:', e);
      }
    },
    
    setView(view) {
      this.currentView = view;
    },
    
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      this.user = null;
      this.currentView = 'dashboard';
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('pt-BR');
    },
    
    getTransactionTypeLabel(type) {
      const labels = {
        'consumption': 'Consumo',
        'addition': 'Adição',
        'reversal': 'Reversão',
        'renewal': 'Renovação'
      };
      return labels[type] || type;
    },
    
    getTransactionBadgeClass(type) {
      const classes = {
        'consumption': 'badge bg-danger',
        'addition': 'badge bg-success',
        'reversal': 'badge bg-warning',
        'renewal': 'badge bg-info'
      };
      return classes[type] || 'badge bg-secondary';
    },
    
    exportTransactions() {
      // Implementar exportação CSV
      alert('Funcionalidade de exportação será implementada');
    }
  },
  
  mounted() {
    this.loadUserData();
  }
}
</script>

<style>
.tollgate-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.logo-icon {
  position: relative;
  width: 2rem;
  height: 2rem;
}

.logo-hexagon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.25rem;
  height: 0.25rem;
  background: #ffffff;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.05em;
  line-height: 1;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #e2e8f0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 1;
  opacity: 0.9;
}

.logo-icon-large {
  position: relative;
  width: 4rem;
  height: 4rem;
}

.logo-hexagon-large {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-pulse-large {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background: #ffffff;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
}

.card {
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.75rem;
}

.card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
  border-radius: 0.75rem 0.75rem 0 0 !important;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.form-control, .form-select {
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.list-group-item {
  border: none;
  border-radius: 0.5rem !important;
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;
}

.list-group-item:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  transform: translateX(2px);
}

.list-group-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.8; 
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  }
  50% { 
    opacity: 1; 
    box-shadow: 0 0 8px rgba(255, 255, 255, 1), 0 0 12px rgba(255, 255, 255, 0.6);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .navbar-brand {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .logo-subtitle {
    font-size: 0.625rem;
  }
}
</style> 