<template>
  <CanonikaMasterPage
    :header-config="headerConfig"
    :sidebar-config="sidebarConfig"
    @logout="handleLogout"
    @nav-click="handleNavClick"
    @sidebar-toggle="handleSidebarToggle"
  >
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
            <h3 class="section-title">
              <i class="fas fa-check-circle text-success me-2"></i>
              Validação da Componentização
            </h3>
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
            </div>
          </div>
        </div>

        <!-- Seção: Funcionalidades Testadas -->
        <div class="canonika-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="fas fa-star text-warning me-2"></i>
              Funcionalidades Testadas
            </h3>
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
            </div>
          </div>
        </div>

        <!-- Seção: Informações do Serviço -->
        <div class="canonika-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="fas fa-info-circle text-info me-2"></i>
              Informações do Serviço
            </h3>
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
            <h3 class="section-title">
              <i class="fas fa-vial text-primary me-2"></i>
              Testes de Componentes
            </h3>
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
  </CanonikaMasterPage>
</template>

<script>
import CanonikaMasterPage from '../../../shared/components/MasterPage.vue'
import AuthService from '../../../shared/services/AuthService.js'

export default {
  name: 'TemplateApp',
  components: {
    CanonikaMasterPage
  },
  data() {
    return {
      user: null,
      headerConfig: {
        title: 'Template Service',
        subtitle: 'Serviço de validação da componentização',
        icon: 'fas fa-rocket',
        showUserInfo: true,
        showLogout: true
      },
      sidebarConfig: {
        brandText: 'Template Service',
        brandIcon: 'fas fa-rocket',
        user: {
          name: 'Administrador',
          role: 'Admin',
          initial: 'A'
        },
        navigationSections: [
          {
            title: 'Navegação',
            items: [
              {
                id: 'dashboard',
                title: 'Dashboard',
                subtitle: 'Visão Geral',
                icon: 'fas fa-tachometer-alt',
                href: '#',
                active: true
              },
              {
                id: 'components',
                title: 'Componentes',
                subtitle: 'Validação',
                icon: 'fas fa-cube',
                href: '#',
                subItems: [
                  {
                    id: 'header',
                    title: 'Header',
                    subtitle: 'Cabeçalho',
                    icon: 'fas fa-heading',
                    href: '#header'
                  },
                  {
                    id: 'sidebar',
                    title: 'Sidebar',
                    subtitle: 'Menu Lateral',
                    icon: 'fas fa-bars',
                    href: '#sidebar'
                  },
                  {
                    id: 'masterpage',
                    title: 'MasterPage',
                    subtitle: 'Layout Principal',
                    icon: 'fas fa-layer-group',
                    href: '#masterpage'
                  },
                  {
                    id: 'viewcontent',
                    title: 'ViewContent',
                    subtitle: 'Conteúdo',
                    icon: 'fas fa-file-alt',
                    href: '#viewcontent'
                  },
                  {
                    id: 'viewheader',
                    title: 'ViewHeader',
                    subtitle: 'Cabeçalho da View',
                    icon: 'fas fa-window-maximize',
                    href: '#viewheader'
                  }
                ]
              },
              {
                id: 'services',
                title: 'Serviços',
                subtitle: 'Integração',
                icon: 'fas fa-server',
                href: '#',
                subItems: [
                  {
                    id: 'auth',
                    title: 'Autenticação',
                    subtitle: 'Login/Logout',
                    icon: 'fas fa-key',
                    href: '#auth'
                  },
                  {
                    id: 'quarter',
                    title: 'Quarter',
                    subtitle: 'Identity Provider',
                    icon: 'fas fa-shield-alt',
                    href: '#quarter'
                  },
                  {
                    id: 'harbor',
                    title: 'Harbor',
                    subtitle: 'Portal Principal',
                    icon: 'fas fa-anchor',
                    href: '#harbor'
                  },
                  {
                    id: 'beacon',
                    title: 'Beacon',
                    subtitle: 'Monitoramento',
                    icon: 'fas fa-broadcast-tower',
                    href: '#beacon'
                  }
                ]
              },
              {
                id: 'tests',
                title: 'Testes',
                subtitle: 'Funcionalidades',
                icon: 'fas fa-vial',
                href: '#',
                subItems: [
                  {
                    id: 'unit',
                    title: 'Unitários',
                    subtitle: 'Testes Unitários',
                    icon: 'fas fa-microchip',
                    href: '#unit'
                  },
                  {
                    id: 'integration',
                    title: 'Integração',
                    subtitle: 'Testes de Integração',
                    icon: 'fas fa-plug',
                    href: '#integration'
                  },
                  {
                    id: 'e2e',
                    title: 'End-to-End',
                    subtitle: 'Testes E2E',
                    icon: 'fas fa-route',
                    href: '#e2e'
                  },
                  {
                    id: 'performance',
                    title: 'Performance',
                    subtitle: 'Testes de Performance',
                    icon: 'fas fa-tachometer-alt',
                    href: '#performance'
                  }
                ]
              },
              {
                id: 'info',
                title: 'Informações',
                subtitle: 'Detalhes',
                icon: 'fas fa-info-circle',
                href: '#',
                subItems: [
                  {
                    id: 'docs',
                    title: 'Documentação',
                    subtitle: 'Guias e Tutoriais',
                    icon: 'fas fa-book',
                    href: '#docs'
                  },
                  {
                    id: 'api',
                    title: 'API',
                    subtitle: 'Endpoints',
                    icon: 'fas fa-code',
                    href: '#api'
                  },
                  {
                    id: 'config',
                    title: 'Configuração',
                    subtitle: 'Settings',
                    icon: 'fas fa-cog',
                    href: '#config'
                  },
                  {
                    id: 'about',
                    title: 'Sobre',
                    subtitle: 'Informações do Sistema',
                    icon: 'fas fa-info',
                    href: '#about'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  async mounted() {
    console.log('🚀 TEMPLATE APP MOUNTED')
    
    // Processar token da URL se existir (padrão Harbor)
    this.processAuthToken()
    
    // Verificar autenticação
    await this.checkAuthentication()
    
    // Se ainda não há usuário após verificação, forçar redirecionamento
    if (!this.user) {
      console.log('❌ Nenhum usuário encontrado após verificação, forçando redirecionamento para Quarter')
      this.redirectToQuarter()
    }
  },
  methods: {
    async checkAuthentication() {
      console.log('🔍 Verificando autenticação...')
      
      // Verificar se precisa renovar o token
      const tokenValid = await AuthService.checkAndRefreshToken()
      
      if (tokenValid) {
        this.user = AuthService.getCurrentUser()
        console.log('✅ Usuário autenticado:', this.user)
      } else {
        // Verificar se há token no localStorage (fallback)
        const storedToken = localStorage.getItem('canonika_access_token')
        const storedUser = localStorage.getItem('canonika_user')
        
        if (storedToken && storedUser) {
          try {
            this.user = JSON.parse(storedUser)
            console.log('✅ Usuário recuperado do localStorage:', this.user)
          } catch (error) {
            console.log('❌ Erro ao parsear usuário do localStorage')
            this.redirectToQuarter()
          }
        } else {
          // Se não há autenticação válida, redirecionar para Quarter
          console.log('❌ Usuário não autenticado, redirecionando para Quarter')
          this.redirectToQuarter()
        }
      }
    },
    
    processAuthToken() {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('auth_token')
      
      if (token) {
        console.log('🔑 Token recebido do Quarter')
        
        try {
          // Decodificar token JWT
          const payload = this.decodeToken(token)
          
          // Criar objeto usuário
          this.user = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            roles: payload.roles || [],
            permissions: payload.permissions || []
          }
          
          // Salvar token no localStorage
          localStorage.setItem('canonika_access_token', token)
          localStorage.setItem('canonika_user', JSON.stringify(this.user))
          
          // Limpar URL
          const newUrl = window.location.pathname
          window.history.replaceState({}, document.title, newUrl)
          
          console.log('✅ Usuário autenticado:', this.user.name)
          
        } catch (error) {
          console.error('❌ Erro ao processar token:', error)
          // Se token inválido, redirecionar para Quarter
          this.redirectToQuarter()
        }
      }
    },
    
    decodeToken(token) {
      try {
        // Verificar se é um JWT real (3 partes) ou token simulado (base64 simples)
        const parts = token.split('.')
        
        if (parts.length === 3) {
          // JWT real - decodificar payload (parte 1)
          const payload = JSON.parse(atob(parts[1]))
          return payload
        } else {
          // Token simulado do Quarter - decodificar diretamente
          const payload = JSON.parse(atob(token))
          return payload
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error)
        throw new Error('Token inválido')
      }
    },
    
    handleLogout() {
      console.log('🚪 Logout solicitado')
      AuthService.logout()
      this.user = null
    },
    
    handleNavClick(item) {
      console.log('Navegação clicada:', item)
    },
    
    handleSidebarToggle(collapsed) {
      console.log('Sidebar toggle:', collapsed)
    },
    
    redirectToQuarter() {
      const quarterUrl = 'http://localhost:3700'
      // Usar a URL completa do Template Service com porta explícita
      const currentUrl = `http://localhost:3790${window.location.pathname}${window.location.search}`
      const redirectTo = encodeURIComponent(currentUrl)
      
      // Usar o padrão redirect_to (padrão do Quarter)
      const quarterRedirectUrl = `${quarterUrl}?redirect_to=${redirectTo}`
      
      console.log('🔄 Redirecionando para Quarter com URL:', currentUrl)
      console.log('🔄 URL completa do Quarter:', quarterRedirectUrl)
      
      // Usar replace para evitar problemas de navegação
      window.location.replace(quarterRedirectUrl)
    }
  }
}
</script>

<!-- Estilos agora são gerenciados pelo SCSS -->
