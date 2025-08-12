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
          <i class="fas fa-broadcast-tower"></i>
          <div class="title-content">
            <h1>Beacon</h1>
            <p>Sistema de Monitoramento</p>
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
            <i class="fas fa-cog me-2"></i>
            Configurar
          </button>
        </div>
      </div>

      <!-- View Content -->
      <div class="view-content">
        <!-- Seção: Status do Sistema -->
        <div class="canonika-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="fas fa-chart-line text-success me-2"></i>
              Status do Sistema
            </h3>
            <p class="section-description">
              Monitoramento em tempo real dos serviços do Beacon.
            </p>
          </div>
          
          <div class="section-content">
            <div class="service-cards">
              <div class="service-card">
                <div class="card-header">
                  <div class="card-icon">
                    <i class="fas fa-broadcast-tower"></i>
                  </div>
                  <div class="card-title">
                    <h4>WebSocket</h4>
                    <span class="card-subtitle">Conexão em tempo real</span>
                  </div>
                  <div class="card-actions">
                    <span class="status-badge online">Ativo</span>
                  </div>
                </div>
                <div class="card-content">
                  <div class="metric-grid">
                    <div class="metric-item">
                      <span class="metric-value">100%</span>
                      <span class="metric-label">Disponibilidade</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-value">0ms</span>
                      <span class="metric-label">Latência</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-value">24/7</span>
                      <span class="metric-label">Uptime</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="service-card">
                <div class="card-header">
                  <div class="card-icon">
                    <i class="fas fa-satellite"></i>
                  </div>
                  <div class="card-title">
                    <h4>REST API</h4>
                    <span class="card-subtitle">HTTP Endpoints</span>
                  </div>
                  <div class="card-actions">
                    <span class="status-badge online">Funcionando</span>
                  </div>
                </div>
                <div class="card-content">
                  <div class="metric-grid">
                    <div class="metric-item">
                      <span class="metric-value">200</span>
                      <span class="metric-label">Status OK</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-value">Fast</span>
                      <span class="metric-label">Performance</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-value">Secure</span>
                      <span class="metric-label">Autenticação</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="service-card">
                <div class="card-header">
                  <div class="card-icon">
                    <i class="fas fa-bell"></i>
                  </div>
                  <div class="card-title">
                    <h4>Push Notifications</h4>
                    <span class="card-subtitle">Sistema de alertas</span>
                  </div>
                  <div class="card-actions">
                    <span class="status-badge online">Ativo</span>
                  </div>
                </div>
                <div class="card-content">
                  <div class="metric-grid">
                    <div class="metric-item">
                      <span class="metric-value">Real-time</span>
                      <span class="metric-label">Entrega</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-value">Multi</span>
                      <span class="metric-label">Plataformas</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-value">Smart</span>
                      <span class="metric-label">Filtros</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção: Serviços de Comunicação -->
        <div class="canonika-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="fas fa-comments text-info me-2"></i>
              Serviços de Comunicação
            </h3>
            <p class="section-description">
              Canais de comunicação disponíveis para envio de notificações.
            </p>
          </div>
          
          <div class="section-content">
            <div class="feature-cards">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="feature-title">Email Service</div>
                <div class="feature-description">Envio de emails transacionais</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-sms"></i>
                </div>
                <div class="feature-title">SMS Gateway</div>
                <div class="feature-description">Mensagens de texto</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="feature-title">Voice Service</div>
                <div class="feature-description">Chamadas de voz</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-cog"></i>
                </div>
                <div class="feature-title">Configurações</div>
                <div class="feature-description">Parâmetros do sistema</div>
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
              Detalhes sobre o Beacon e sua configuração atual.
            </p>
          </div>
          
          <div class="section-content">
            <div class="info-cards">
              <div class="info-card">
                <div class="info-label">Nome</div>
                <div class="info-value">Beacon</div>
                <div class="info-description">Sistema de Monitoramento</div>
              </div>
              
              <div class="info-card">
                <div class="info-label">Porta</div>
                <div class="info-value">3703</div>
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

        <!-- Footer -->
        <div class="canonika-footer">
          <div class="footer-info">
            <div class="footer-item">
              <i class="fas fa-code"></i>
              <span>Beacon v1.0.0</span>
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
import CanonikaMasterPage from '/app/shared/components/MasterPage.vue'
import AuthService from '/app/shared/services/AuthService.js'
import { checkServiceStatus } from '/app/shared/config/status-standardization.js'

export default {
  name: 'BeaconApp',
  components: {
    CanonikaMasterPage
  },
  data() {
    return {
      user: null,
      headerConfig: {
        logoText: 'CANONIKA',
        logoSubtitle: 'BEACON',
        user: {
          name: 'Administrador Canonika',
          initial: 'A'
        },
        systemStatus: 'BEACON ONLINE',
        isOnline: true
      },
      sidebarConfig: {
        brandText: 'BEACON',
        brandIcon: 'fas fa-broadcast-tower',
        user: {
          name: 'Administrador Canonika',
          role: 'Admin',
          initial: 'A'
        },
        navigationSections: [
          {
            title: 'SOLUÇÕES',
            items: [
              {
                id: 'home',
                title: 'Home',
                subtitle: 'Página Inicial',
                icon: 'fas fa-home',
                href: '#',
                active: true
              }
            ]
          },
          {
            title: 'SERVIÇOS',
            items: [
              {
                id: 'websocket',
                title: 'WebSocket',
                subtitle: 'Tempo Real',
                icon: 'fas fa-broadcast-tower',
                href: '#websocket'
              },
              {
                id: 'api',
                title: 'REST API',
                subtitle: 'HTTP Endpoints',
                icon: 'fas fa-satellite',
                href: '#api'
              },
              {
                id: 'notifications',
                title: 'Push Notifications',
                subtitle: 'Alertas',
                icon: 'fas fa-bell',
                href: '#notifications'
              },
              {
                id: 'email',
                title: 'Email Service',
                subtitle: 'Comunicação',
                icon: 'fas fa-envelope',
                href: '#email'
              },
              {
                id: 'sms',
                title: 'SMS Gateway',
                subtitle: 'Mensagens',
                icon: 'fas fa-sms',
                href: '#sms'
              },
              {
                id: 'voice',
                title: 'Voice Service',
                subtitle: 'Chamadas',
                icon: 'fas fa-phone',
                href: '#voice'
              },
              {
                id: 'config',
                title: 'Configurações',
                subtitle: 'Parâmetros',
                icon: 'fas fa-cog',
                href: '#config'
              }
            ]
          }
        ]
      }
    }
  },
  async mounted() {
    console.log('🚀 BEACON APP MOUNTED')
    
    // Processar token da URL se existir (padrão Harbor)
    this.processAuthToken()
    
    // Verificar autenticação
    await this.checkAuthentication()
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
        // O Quarter envia um token base64 simples, não JWT
        const payload = JSON.parse(atob(token))
        return payload
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error)
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
      // Usar a URL completa do Beacon
      const currentUrl = window.location.href
      const returnUrl = encodeURIComponent(currentUrl)
      
      // Usar o padrão return_url e service como Harbor
      const quarterRedirectUrl = `${quarterUrl}?return_url=${returnUrl}&service=beacon`
      
      console.log('🔄 Redirecionando para Quarter com URL:', currentUrl)
      console.log('🔄 URL completa do Quarter:', quarterRedirectUrl)
      
      // Usar replace para evitar problemas de navegação
      window.location.replace(quarterRedirectUrl)
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do Beacon */
.canonika-icon-bg {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 