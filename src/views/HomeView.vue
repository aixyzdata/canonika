<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão das outras views -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-rocket"></i>
        <div class="title-content">
          <h1>Template Service</h1>
          <p>Serviço de validação da componentização</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <router-link to="/aggrid-reference" class="btn btn-success btn-sm">
          <i class="fas fa-table me-2"></i>
          AG-Grid Reference
        </router-link>
        <button class="btn btn-primary btn-sm">
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
      <!-- Seção: Validação de Componentes -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-check-circle text-success me-2"></i>
            Validação da Componentização
          </span>
          <p class="section-description">
            Este serviço valida se os componentes compartilhados estão funcionando corretamente.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-cube"></i>
                </div>
                <div class="card-title">
                  <h4>Header Component</h4>
                  <span class="card-subtitle">Componente de cabeçalho reutilizável</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Funcionando</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Compatibilidade</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">24/7</span>
                    <span class="metric-label">Disponibilidade</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">0ms</span>
                    <span class="metric-label">Latência</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-bars"></i>
                </div>
                <div class="card-title">
                  <h4>Sidebar Component</h4>
                  <span class="card-subtitle">Componente de navegação lateral</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Funcionando</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Responsivo</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Smooth</span>
                    <span class="metric-label">Animações</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Flex</span>
                    <span class="metric-label">Layout</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-layer-group"></i>
                </div>
                <div class="card-title">
                  <h4>MasterPage Component</h4>
                  <span class="card-subtitle">Layout principal integrado</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Funcionando</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Integração</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Modular</span>
                    <span class="metric-label">Arquitetura</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Clean</span>
                    <span class="metric-label">Código</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Novo card para AG-Grid Reference -->
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-table"></i>
                </div>
                <div class="card-title">
                  <h4>AG-Grid Reference</h4>
                  <span class="card-subtitle">Template oficial AG-Grid Vue</span>
                </div>
                <div class="card-actions">
                  <router-link to="/aggrid-reference" class="btn btn-primary btn-sm">
                    <i class="fas fa-external-link-alt me-1"></i>
                    Acessar
                  </router-link>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">Oficial</span>
                    <span class="metric-label">Documentação</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">Vue 3</span>
                    <span class="metric-label">Framework</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">v32+</span>
                    <span class="metric-label">AG-Grid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Funcionalidades Testadas -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-star text-warning me-2"></i>
            Funcionalidades Testadas
          </span>
          <p class="section-description">
            Componentes e funcionalidades que foram validados e estão funcionando corretamente.
          </p>
        </div>
        
        <div class="section-content">
          <div class="feature-cards">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Header com logo animada</div>
              <div class="feature-description">Logo animada com efeitos visuais modernos</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Sidebar responsiva</div>
              <div class="feature-description">Navegação lateral com toggle e animações</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">MasterPage integrado</div>
              <div class="feature-description">Layout principal com header e sidebar</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">ViewContent padronizado</div>
              <div class="feature-description">Área de conteúdo com padrão consistente</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">ViewHeader componentizado</div>
              <div class="feature-description">Cabeçalho de view reutilizável</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Cards padronizados</div>
              <div class="feature-description">Service, feature, info e test cards</div>
            </div>

            <!-- Nova feature card para AG-Grid -->
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-table"></i>
              </div>
              <div class="feature-title">AG-Grid Template</div>
              <div class="feature-description">Implementação oficial seguindo docs Vue</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Informações do Serviço -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-info-circle text-info me-2"></i>
            Informações do Serviço
          </span>
          <p class="section-description">
            Detalhes sobre o Template Service e sua configuração atual.
          </p>
        </div>
        
        <div class="section-content">
          <div class="info-cards">
            <div class="info-card">
              <div class="info-label">Nome</div>
              <div class="info-value">Template Service</div>
              <div class="info-description">Serviço de validação</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Porta</div>
              <div class="info-value">3790</div>
              <div class="info-description">Porta de desenvolvimento</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Status</div>
              <div class="info-value">Online</div>
              <div class="info-description">Serviço ativo</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Versão</div>
              <div class="info-value">1.0.0</div>
              <div class="info-description">Versão atual</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Framework</div>
              <div class="info-value">Vue.js 3</div>
              <div class="info-description">Frontend framework</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">Build Tool</div>
              <div class="info-value">Vite</div>
              <div class="info-description">Development server</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: Testes de Componentes -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-vial text-primary me-2"></i>
            Testes de Componentes
          </span>
          <p class="section-description">
            Testes de funcionalidade dos componentes compartilhados.
          </p>
        </div>
        
        <div class="section-content">
          <div class="test-cards">
            <div class="test-card">
              <div class="test-header">
                <div class="test-icon">
                  <i class="fas fa-bootstrap"></i>
                </div>
                <div class="test-title">Bootstrap 5 Integration</div>
              </div>
              <div class="test-description">Classes Bootstrap funcionando corretamente</div>
              <div class="test-actions">
                <button class="btn btn-primary">Primary</button>
                <button class="btn btn-secondary">Secondary</button>
                <button class="btn btn-info">Info</button>
              </div>
            </div>
            
            <div class="test-card">
              <div class="test-header">
                <div class="test-icon">
                  <i class="fas fa-palette"></i>
                </div>
                <div class="test-title">CSS Variables</div>
              </div>
              <div class="test-description">Variáveis CSS do tema Canonika</div>
              <div class="test-actions">
                <button class="btn btn-success">Success</button>
                <button class="btn btn-warning">Warning</button>
                <button class="btn btn-danger">Danger</button>
              </div>
            </div>
            
            <div class="test-card">
              <div class="test-header">
                <div class="test-icon">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                <div class="test-title">Responsive Design</div>
              </div>
              <div class="test-description">Layout responsivo para mobile</div>
              <div class="test-actions">
                <button class="btn btn-outline-primary">Outline</button>
                <button class="btn btn-outline-secondary">Outline</button>
                <button class="btn btn-outline-success">Outline</button>
              </div>
            </div>

            <!-- Novo test card para AG-Grid -->
            <div class="test-card">
              <div class="test-header">
                <div class="test-icon">
                  <i class="fas fa-table"></i>
                </div>
                <div class="test-title">AG-Grid Integration</div>
              </div>
              <div class="test-description">Data grid com tema Canonika integrado</div>
              <div class="test-actions">
                <router-link to="/aggrid-reference" class="btn btn-primary">
                  <i class="fas fa-eye me-1"></i>
                  Ver Template
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="canonika-footer">
        <div class="footer-info">
          <div class="footer-item">
            <i class="fas fa-code"></i>
            <span>Template Service v1.0.0</span>
          </div>
          <div class="footer-item">
            <i class="fas fa-clock"></i>
            <span>Última atualização: {{ new Date().toLocaleDateString('pt-BR') }}</span>
          </div>
          <div class="footer-item">
            <i class="fas fa-shield-alt"></i>
            <span>Status: Online</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>