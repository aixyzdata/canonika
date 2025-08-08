<template>
  <CanonikaMasterPage
    :header-config="headerConfig"
    :sidebar-config="sidebarConfig"
    @logout="handleLogout"
    @nav-click="handleNavClick"
    @sidebar-toggle="handleSidebarToggle"
  >
    <CanonikaViewContent 
      title="🚀 Template Service" 
      subtitle="Serviço de validação da componentização"
      :actions="true"
    >
      <template #actions>
        <button class="btn btn-canonika-primary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar
        </button>
        <button class="btn btn-secondary btn-sm">
          <i class="fas fa-download me-2"></i>
          Exportar
        </button>
      </template>

      <div class="d-flex flex-column gap-4">
        <!-- Seção de Validação -->
        <div class="card-canonika">
          <div class="card-body">
            <h2 class="h3 text-dark mb-4">✅ Validação da Componentização</h2>
            <p class="text-secondary mb-4">Este serviço valida se os componentes compartilhados estão funcionando corretamente.</p>
            
            <div class="row g-4">
              <div class="col-md-4">
                <div class="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <div class="canonika-icon-bg">
                    <i class="fas fa-cube text-white"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h3 class="h6 text-dark mb-2">Header Component</h3>
                    <p class="text-secondary small mb-2">Componente de cabeçalho reutilizável</p>
                    <span class="badge-canonika badge-canonika-success">Funcionando</span>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <div class="canonika-icon-bg">
                    <i class="fas fa-bars text-white"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h3 class="h6 text-dark mb-2">Sidebar Component</h3>
                    <p class="text-secondary small mb-2">Componente de navegação lateral</p>
                    <span class="badge-canonika badge-canonika-success">Funcionando</span>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <div class="canonika-icon-bg">
                    <i class="fas fa-layer-group text-white"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h3 class="h6 text-dark mb-2">MasterPage Component</h3>
                    <p class="text-secondary small mb-2">Layout principal integrado</p>
                    <span class="badge-canonika badge-canonika-success">Funcionando</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de Funcionalidades -->
        <div class="card-canonika">
          <div class="card-body">
            <h2 class="h3 text-dark mb-4">🎯 Funcionalidades Testadas</h2>
            <div class="row g-3">
              <div class="col-md-6 col-lg-4">
                <div class="p-3 bg-light rounded">
                  <span class="text-success">✅</span> Header com logo animada
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="p-3 bg-light rounded">
                  <span class="text-success">✅</span> Sidebar colapsável
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="p-3 bg-light rounded">
                  <span class="text-success">✅</span> Navegação responsiva
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="p-3 bg-light rounded">
                  <span class="text-success">✅</span> Integração de componentes
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="p-3 bg-light rounded">
                  <span class="text-success">✅</span> Estilos compartilhados
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="p-3 bg-light rounded">
                  <span class="text-success">✅</span> Props e eventos
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de Informações -->
        <div class="card-canonika">
          <div class="card-body">
            <h2 class="h3 text-dark mb-4">📋 Informações do Serviço</h2>
            <div class="row g-3">
              <div class="col-md-6 col-lg-3">
                <div class="p-3 bg-light rounded border">
                  <strong class="text-dark">Nome:</strong> Template Service
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="p-3 bg-light rounded border">
                  <strong class="text-dark">Porta Web:</strong> 3790
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="p-3 bg-light rounded border">
                  <strong class="text-dark">Porta API:</strong> 8015
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="p-3 bg-light rounded border">
                  <strong class="text-dark">Status:</strong> 
                  <span class="text-success fw-bold">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de Testes -->
        <div class="card-canonika">
          <div class="card-body">
            <h2 class="h3 text-dark mb-4">🧪 Testes de Componentes</h2>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="p-3 bg-light rounded">
                  <h4 class="h6 text-dark mb-2">Bootstrap 5 Integration</h4>
                  <p class="text-secondary small mb-2">Classes Bootstrap funcionando corretamente</p>
                  <div class="d-flex gap-2">
                    <button class="btn btn-canonika-primary btn-sm">Primary</button>
                    <button class="btn btn-secondary btn-sm">Secondary</button>
                    <button class="btn btn-success btn-sm">Success</button>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 bg-light rounded">
                  <h4 class="h6 text-dark mb-2">Canonika Classes</h4>
                  <p class="text-secondary small mb-2">Classes customizadas Canonika</p>
                  <div class="d-flex gap-2">
                    <span class="badge-canonika badge-canonika-success">Success</span>
                    <span class="badge-canonika badge-canonika-warning">Warning</span>
                    <span class="badge-canonika badge-canonika-danger">Danger</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-secondary small">
            <i class="fas fa-clock me-1"></i>
            Última atualização: {{ new Date().toLocaleString() }}
          </div>
          <div class="text-secondary small">
            <i class="fas fa-code me-1"></i>
            Versão: 1.0.0
          </div>
        </div>
      </template>
    </CanonikaViewContent>
  </CanonikaMasterPage>
</template>

<script>
import CanonikaMasterPage from '../../../shared/components/MasterPage.vue'
import CanonikaViewContent from '../../../shared/components/ViewContent.vue'

export default {
  name: 'TemplateApp',
  components: {
    CanonikaMasterPage,
    CanonikaViewContent
  },
  data() {
    return {
      headerConfig: {
        logoText: 'CANONIKA',
        logoSubtitle: 'TEMPLATE',
        user: {
          name: 'Administrador Template',
          initial: 'T'
        },
        systemStatus: 'ONLINE',
        isOnline: true
      },
      sidebarConfig: {
        brandText: 'Template',
        brandIcon: 'fas fa-cube',
        user: {
          name: 'Admin Template',
          role: 'Template Admin',
          initial: 'T'
        },
        navigationSections: [
          {
            id: 'solutions',
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
            id: 'services',
            title: 'SERVIÇOS',
            items: [
              {
                id: 'websocket',
                title: 'WebSocket',
                subtitle: 'Tempo Real',
                icon: 'fas fa-broadcast-tower',
                href: '#'
              },
              {
                id: 'api',
                title: 'REST API',
                subtitle: 'HTTP Endpoints',
                icon: 'fas fa-satellite',
                href: '#'
              },
              {
                id: 'push',
                title: 'Push Notifications',
                subtitle: 'Alertas',
                icon: 'fas fa-bell',
                href: '#'
              },
              {
                id: 'email',
                title: 'Email Service',
                subtitle: 'Comunicação',
                icon: 'fas fa-envelope',
                href: '#'
              },
              {
                id: 'sms',
                title: 'SMS Gateway',
                subtitle: 'Mensagens',
                icon: 'fas fa-sms',
                href: '#'
              },
              {
                id: 'voice',
                title: 'Voice Service',
                subtitle: 'Chamadas',
                icon: 'fas fa-phone',
                href: '#'
              },
              {
                id: 'settings',
                title: 'Configurações',
                subtitle: 'Parâmetros',
                icon: 'fas fa-cog',
                href: '#'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    handleLogout() {
      console.log('Logout solicitado')
    },
    handleNavClick(item) {
      console.log('Navegação clicada:', item)
    },
    handleSidebarToggle(collapsed) {
      console.log('Sidebar toggle:', collapsed)
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do Template Service */
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
