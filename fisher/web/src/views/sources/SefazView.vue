<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão EXATO do template -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-building"></i>
        <div class="title-content">
          <h1>SEFAZ - Sistema de Escrituração Digital</h1>
          <p>Processamento de arquivos CNPJ da Receita Federal</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button @click="syncCnpjFiles" class="btn btn-primary btn-sm">
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
      <!-- Seção: Processamento de Arquivos CNPJ -->
      <div class="canonika-section">
        <div class="section-header">
          <span class="section-title">
            <i class="fas fa-check-circle text-success me-2"></i>
            PROCESSAMENTO DE ARQUIVOS CNPJ
          </span>
          <p class="section-description">
            Este serviço valida se os arquivos CNPJ estão sendo processados corretamente.
          </p>
        </div>
        
        <div class="section-content">
          <div class="service-cards">
            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-file-alt"></i>
                </div>
                <div class="card-title">
                  <h4>Arquivos CNPJ</h4>
                  <span class="card-subtitle">Processamento de dados da Receita Federal</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">FUNCIONANDO</span>
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
                  <i class="fas fa-sync-alt"></i>
                </div>
                <div class="card-title">
                  <h4>Sincronização SEFAZ</h4>
                  <span class="card-subtitle">Atualização automática de dados</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">FUNCIONANDO</span>
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
                  <i class="fas fa-database"></i>
                </div>
                <div class="card-title">
                  <h4>Base de Dados</h4>
                  <span class="card-subtitle">Armazenamento centralizado</span>
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
          <span class="section-title">
            <i class="fas fa-star text-warning me-2"></i>
            FUNCIONALIDADES TESTADAS
          </span>
          <p class="section-description">
            Componentes e funcionalidades que foram validados e estão funcionando corretamente.
          </p>
        </div>
        
        <div class="section-content">
          <div class="feature-cards">
            <div class="feature-card" v-for="file in paginatedCnpjFiles" :key="file.id">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">{{ file.name }}</div>
              <div class="feature-description">{{ formatFileSize(file.size) }} - {{ file.status }}</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Processamento Real-time</div>
              <div class="feature-description">Atualização automática de dados em tempo real</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Validação de Dados</div>
              <div class="feature-description">Verificação automática de integridade dos arquivos</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Backup Automático</div>
              <div class="feature-description">Cópia de segurança dos dados processados</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Monitoramento de Status</div>
              <div class="feature-description">Acompanhamento em tempo real do processamento</div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="feature-title">Relatórios Automáticos</div>
              <div class="feature-description">Geração automática de relatórios de processamento</div>
            </div>
          </div>

          <!-- Pagination - como no template original -->
          <nav aria-label="Page navigation" v-if="totalPages > 1" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Anterior</a>
              </li>
              <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: currentPage === page }">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Próxima</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'SefazView',
  setup() {
    // Data
    const cnpjFiles = ref([
      { id: 1, name: 'CNPJ_2024_01.csv', size: 1024000, status: 'Disponível' },
      { id: 2, name: 'CNPJ_2024_02.csv', size: 1950000, status: 'Processando' },
      { id: 3, name: 'CNPJ_2023_12.csv', size: 1460000, status: 'Disponível' },
      { id: 4, name: 'CNPJ_2023_11.csv', size: 1710000, status: 'Erro' },
      { id: 5, name: 'CNPJ_2023_10.csv', size: 1220000, status: 'Disponível' }
    ])

    // Pagination
    const currentPage = ref(1)
    const itemsPerPage = ref(3)

    // Computed
    const totalPages = computed(() => Math.ceil(cnpjFiles.value.length / itemsPerPage.value))
    
    const paginatedCnpjFiles = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return cnpjFiles.value.slice(start, end)
    })

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    // Methods
    const syncCnpjFiles = () => {
      console.log('Sincronizando arquivos CNPJ...')
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
      return (bytes / 1048576).toFixed(2) + ' MB'
    }

    onMounted(() => {
      console.log('SefazView mounted - seguindo padrão EXATO do template')
    })

    return {
      cnpjFiles,
      currentPage,
      totalPages,
      paginatedCnpjFiles,
      visiblePages,
      syncCnpjFiles,
      changePage,
      formatFileSize
    }
  }
}
</script>

<style scoped>
/* Sem estilos customizados - usando apenas as classes compartilhadas */
</style>