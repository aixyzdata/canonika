<template>
  <div class="auditoria-view">
    <!-- Header Padronizado -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-shield-alt"></i>
        <div class="title-content">
    <h1>Auditoria</h1>
          <p>Auditoria de transações e controles</p>
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
        <button @click="exportAudit()" class="action-btn primary">
          <i class="fas fa-download"></i>
          Exportar Relatório
        </button>
      </div>
    </div>

    <!-- Conteúdo da Auditoria -->
    <div class="audit-content">
      <div class="canonika-card">
        <div class="card-header">
          <h5 class="card-title">
            <i class="fas fa-list"></i>
            Logs de Auditoria
          </h5>
        </div>
        <div class="card-body">
          <p>Implementação da auditoria em desenvolvimento...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditoriaView',
  data() {
    return {
      // Dados específicos da auditoria
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados de auditoria...');
      // Implementar chamadas para a API
    },
    exportAudit() {
      console.log('Exportando relatório de auditoria...');
      // Implementar lógica de exportação
    }
  }
}
</script>

<style scoped>
.auditoria-view {
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

.audit-content {
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.canonika-card {
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

.card-header h5 {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.card-body {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .view-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
