<template>
  <div class="canonika-view">
    <div class="view-header">
      <div class="header-content">
        <div class="header-icon">
          <i :class="config.serviceIcon"></i>
        </div>
        <div class="header-text">
          <h1>{{ config.serviceName }}</h1>
          <p>{{ config.serviceDescription }}</p>
        </div>
        <div class="header-status">
          <span class="status-badge online">{{ config.statusText }}</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="config.primaryAction.handler">
          <i :class="config.primaryAction.icon"></i>
          {{ config.primaryAction.text }}
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <div class="service-cards">
        <!-- Status do Serviço -->
        <div class="service-card">
          <div class="card-header">
            <h3>Status do Serviço</h3>
            <div class="card-icon">
              <i class="fas fa-server"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">{{ config.serviceStatus.status }}</div>
              <div class="balance-label">{{ config.serviceStatus.description }}</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Uptime:</span>
                <span class="detail-value">{{ config.serviceStatus.uptime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Porta:</span>
                <span class="detail-value">{{ config.serviceStatus.port }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Versão:</span>
                <span class="detail-value">{{ config.serviceStatus.version }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de Performance -->
        <div class="service-card">
          <div class="card-header">
            <h3>Métricas de Performance</h3>
            <div class="card-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="transaction-list">
              <div v-for="metric in config.metrics" :key="metric.id" class="transaction-item">
                <div class="transaction-icon success">
                  <i :class="metric.icon"></i>
                </div>
                <div class="transaction-details">
                  <div class="transaction-title">{{ metric.name }}</div>
                  <div class="transaction-amount success">
                    {{ metric.value }}
                  </div>
                  <div class="transaction-time">{{ metric.description }}</div>
                </div>
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
            <div class="alerts-list">
              <div v-for="activity in config.recentActivity" :key="activity.id" :class="`alert-item ${activity.level}`">
                <div class="alert-icon">
                  <i :class="activity.icon"></i>
                </div>
                <div class="alert-content">
                  <div class="alert-title">{{ activity.title }}</div>
                  <div class="alert-message">{{ activity.message }}</div>
                  <div class="alert-time">{{ activity.timestamp }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações do Sistema -->
        <div class="service-card">
          <div class="card-header">
            <h3>Configurações</h3>
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
          </div>
          <div class="card-content">
            <div class="plans-grid">
              <div 
                v-for="config in config.configurations" 
                :key="config.id" 
                class="plan-item"
              >
                <div class="plan-name">{{ config.name }}</div>
                <div class="plan-price">{{ config.value }}</div>
                <div class="plan-credits">{{ config.status }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServiceConfig } from '../../shared/config/status-configs.js'

export default {
  name: 'SkipperView',
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
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do Skipper, se necessário */
</style>

<style>
@import '../../shared/styles/canonika-view.css';
</style>
