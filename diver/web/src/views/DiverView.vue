<template>
  <div class="canonika-view">
    <div class="view-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-search"></i>
        </div>
        <div class="header-text">
          <h1>Diver</h1>
          <p>Tripulante de Consulta Canônica</p>
        </div>
        <div class="header-status">
          <span class="status-badge online">ONLINE</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openConsulta">
          <i class="fas fa-search"></i>
          Consultar Produto
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <!-- Consultas Realizadas -->
        <div class="service-card">
          <div class="card-header">
            <h3>Consultas Realizadas</h3>
            <div class="card-icon">
              <i class="fas fa-search"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">{{ config.metrics[0].value }}</div>
              <div class="balance-label">{{ config.metrics[0].label }}</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Produtos Encontrados:</span>
                <span class="detail-value">{{ config.metrics[1].value }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Empresas Cadastradas:</span>
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
                <div class="plan-name">{{ action.name }}</div>
                <div class="plan-price">{{ action.description }}</div>
                <div class="plan-credits">{{ action.status }}</div>
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
              <div v-for="status in config.systemStatus" :key="status.id" class="alert-item info">
                <div class="alert-icon">
                  <i class="fas fa-check"></i>
                </div>
                <div class="alert-content">
                  <div class="alert-title">{{ status.name }}</div>
                  <div class="alert-message">{{ status.description }}</div>
                  <div class="alert-time">{{ status.port }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Consulta -->
    <div v-if="showConsultaModal" class="modal-overlay" @click="closeConsultaModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🔍 Consulta de Produto</h3>
          <button @click="closeConsultaModal" class="modal-close">
            <i class="fas fa-times"></i>
      </button>
    </div>
        <div class="modal-body">
          <form @submit.prevent="consultarProduto" class="canonika-form">
            <div class="form-row">
              <div class="form-group">
                <label for="ean">EAN (Código de Barras)</label>
                <input
                  type="text"
                  id="ean"
                  v-model="consultaForm.ean"
                  placeholder="Ex: 7891234567890"
                  class="form-control"
                  :disabled="isLoading"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="description">Descrição (Opcional)</label>
                <input
                  type="text"
                  id="description"
                  v-model="consultaForm.description"
                  placeholder="Ex: Notebook Lenovo Ideapad 3 15"
                  class="form-control"
                  :disabled="isLoading"
                >
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!consultaForm.ean || isLoading"
              >
                <i class="fas fa-search"></i>
                {{ isLoading ? 'Consultando...' : '🔍 Consultar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serviceConfigs } from '../../../../shared/config/status-configs.js'

export default {
  name: 'DiverView',
  data() {
    return {
      config: serviceConfigs.diver,
      showConsultaModal: false,
      consultaForm: {
        ean: '',
        description: ''
      },
      isLoading: false
    }
  },
  methods: {
    refreshData() {
      // Implementar refresh dos dados
      console.log('Refreshing Diver data...')
    },
    openConsulta() {
      this.showConsultaModal = true
    },
    closeConsultaModal() {
      this.showConsultaModal = false
      this.consultaForm = {
        ean: '',
        description: ''
      }
    },
    async consultarProduto() {
      if (!this.consultaForm.ean) return
      
      this.isLoading = true
      
      try {
        // Simular consulta à API
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Aqui você implementaria a chamada real para a API do Diver
        console.log('Consultando produto:', this.consultaForm)
        
        // Fechar modal após sucesso
        this.closeConsultaModal()
        
      } catch (error) {
        console.error('Erro na consulta:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>


