<template>
  <div class="service-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-volume-up"></i>
        <div class="title-content">
          <h1>Echo</h1>
          <p>Sistema de Comunicação e Resposta</p>
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
          <i class="fas fa-volume-up"></i>
          Acessar Echo
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <div class="service-card">
          <div class="card-header">
            <h3>Echo</h3>
            <div class="card-icon">
              <i class="fas fa-volume-up"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="service-info">
              <p>Sistema de comunicação e resposta</p>
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
  name: 'EchoView',
  data() {
    return {
      // Dados específicos do serviço
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Echo...');
      // Implementar chamadas para a API do serviço
    },
    openModule() {
      window.open('http://localhost:3702/', '_blank')
    }
  }
}
</script>

<style scoped>
.service-view {
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

.service-info {
  text-align: center;
}

.service-info p {
  color: #94a3b8;
  margin-bottom: 1rem;
}

.service-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 600;
}

.status-dot.online {
  width: 0.5rem;
  height: 0.5rem;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
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
}
</style>
