<template>
  <div class="configuracoes-view">
    <div class="view-header">
      <h1 class="view-title">⚙️ Configurações</h1>
      <div class="view-status">
        <span class="status-indicator warning"></span>
        Configurando
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-cog"></i>
            <h3>Configurações Gerais</h3>
          </div>
          <div class="card-content">
            <p>Configurações básicas do sistema</p>
            <div class="status-badge warning">Pendente</div>
          </div>
        </div>
        
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-user-cog"></i>
            <h3>Usuários</h3>
          </div>
          <div class="card-content">
            <p>Gerenciamento de usuários</p>
            <div class="status-badge online">Ativo</div>
          </div>
        </div>
        
        <div class="service-card">
          <div class="card-header">
            <i class="fas fa-database"></i>
            <h3>Banco de Dados</h3>
          </div>
          <div class="card-content">
            <p>Configurações do banco de dados</p>
            <div class="status-badge online">Conectado</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfiguracoesView',
  mounted() {
    console.log('⚙️ ConfiguracoesView carregada')
  }
}
</script>