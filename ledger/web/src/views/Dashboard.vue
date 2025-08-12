<template>
  <div class="service-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-book"></i>
        <div class="title-content">
          <h1>Ledger</h1>
          <p>Sistema de Contabilidade Financeira</p>
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
        <button @click="openModule()" class="action-btn primary">
          <i class="fas fa-book"></i>
          Acessar Ledger
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Ledger</h3>
            <div class="card-icon">
              <i class="fas fa-book"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="service-info">
              <p>Sistema de contabilidade financeira</p>
              <div class="service-status">
                <div class="status-dot online"></div>
                <span>Serviço Online</span>
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
  name: 'LedgerView',
  data() {
    return {
      // Dados específicos do serviço
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Ledger...');
      // Implementar chamadas para a API do serviço
    },
    openModule() {
      window.open('http://localhost:3707/', '_blank')
    }
  }
}
</script>

