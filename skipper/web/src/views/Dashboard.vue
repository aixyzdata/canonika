<template>
  <div class="tollgate-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-ship"></i>
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
          <i class="fas fa-play"></i>
          Iniciar Simulação
        </button>
      </div>
    </div>

    <div class="view-content">
      <div class="service-cards">
        <!-- Pesquisas Realizadas -->
        <div class="service-card">
        <div class="card-header">
            <h3>Pesquisas Realizadas</h3>
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
                <span class="detail-label">Produtos Extraídos:</span>
                <span class="detail-value">{{ config.metrics[1].value }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fontes Ativas:</span>
                <span class="detail-value">{{ config.metrics[2].value }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Sucesso:</span>
                <span class="detail-value">{{ config.metrics[3].value }}</span>
              </div>
          </div>
        </div>
      </div>

        <!-- Extrações Recentes -->
        <div class="service-card">
        <div class="card-header">
            <h3>Extrações Recentes</h3>
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
import { getServiceConfig } from '../../../../shared/config/status-configs.js'

export default {
  name: 'SkipperHarborView',
  data() {
    return {
      config: getServiceConfig('skipper')
    }
  },
  methods: {
    refreshData() {
      console.log('Atualizando dados do Skipper...')
      // Aqui você faria a chamada para a API do Skipper
      // e atualizaria os dados em tempo real
    },
    openModule() {
      window.open('http://localhost:7722/web/', '_blank')
    }
  }
}
</script>

