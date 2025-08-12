<template>
  <div class="relatorios-view">
    <!-- Header Padronizado -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-chart-bar"></i>
        <div class="title-content">
    <h1>Relatórios</h1>
          <p>Relatórios financeiros e contábeis</p>
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

    <!-- Conteúdo dos Relatórios -->
    <div class="relatorios-content">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-list"></i>
            Relatórios Disponíveis
          </h5>
        </div>
        <div class="card-body">
          <p>Implementação dos relatórios em desenvolvimento...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelatoriosView',
  data() {
    return {
      // Dados específicos dos relatórios
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados dos relatórios...');
      // Implementar chamadas para a API
    },
    exportReport() {
      console.log('Exportando relatório...');
      // Implementar lógica de exportação
    }
  }
}
</script>

