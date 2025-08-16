<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão EXATO do template -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-fish"></i>
        <div class="title-content">
          <h1>Fisher Service</h1>
          <p>Serviço de coleta e processamento de dados</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData" class="btn btn-primary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-download me-2"></i>
          Exportar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Fontes de Dados -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-check-circle text-success me-2"></i>
            FONTES DE DADOS DISPONÍVEIS
          </span>
          <p class="section-description">
            Fontes de dados configuradas e disponíveis para coleta e processamento.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-building"></i>
                </div>
                <div class="card-title">
                  <h4>SEFAZ</h4>
                  <span class="card-subtitle">Receita Federal - Dados CNPJ</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">FUNCIONANDO</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Disponibilidade</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">24/7</span>
                    <span class="metric-label">Operação</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Real-time</span>
                    <span class="metric-label">Sincronização</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="card-title">
                  <h4>Marketplaces</h4>
                  <span class="card-subtitle">Integração com e-commerce</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">FUNCIONANDO</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Conectividade</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Smooth</span>
                    <span class="metric-label">Performance</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Auto</span>
                    <span class="metric-label">Sync</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-plug"></i>
                </div>
                <div class="card-title">
                  <h4>APIs Externas</h4>
                  <span class="card-subtitle">Integração com serviços terceiros</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">FUNCIONANDO</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Integração</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">REST</span>
                    <span class="metric-label">Protocol</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Secure</span>
                    <span class="metric-label">Auth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Funcionalidades Ativas -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-star text-warning me-2"></i>
            FUNCIONALIDADES ATIVAS
          </span>
          <p class="section-description">
            Recursos e funcionalidades que estão ativamente operando no sistema.
          </p>
        </div>
        
        <div class="section-content">
          <div class="feature-cards">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Coleta Automática</div>
              <div class="feature-description">Sistema de coleta automática de dados de todas as fontes</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Processamento em Lote</div>
              <div class="feature-description">Processamento eficiente de grandes volumes de dados</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Cache Inteligente</div>
              <div class="feature-description">Sistema de cache para otimização de performance</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Validação de Dados</div>
              <div class="feature-description">Verificação automática da integridade dos dados coletados</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Monitoramento 24/7</div>
              <div class="feature-description">Acompanhamento contínuo de todas as operações</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Relatórios Automáticos</div>
              <div class="feature-description">Geração automática de relatórios de performance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'FisherView',
  setup() {
    // Methods
    const refreshData = () => {
      console.log('Atualizando dados do Fisher...')
    }

    onMounted(() => {
      console.log('FisherView mounted - padrão EXATO do template aplicado')
    })

    return {
      refreshData
    }
  }
}
</script>

<style scoped>
/* Sem estilos customizados - usando apenas as classes compartilhadas */
</style>