<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão Skipper -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-file-alt"></i>
        <div class="title-content">
          <h1>Arquivos Locais</h1>
          <p>CSV, Excel, XML e outros formatos</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Sistema Operacional</span>
      </div>
      <div class="view-actions">
        <button @click="syncData" class="btn btn-primary btn-sm">
          <i class="fas fa-sync me-2"></i>
          Sincronizar Dados
        </button>
        <button @click="refreshData" class="btn btn-secondary btn-sm">
          <i class="fas fa-sync-alt me-2"></i>
          Atualizar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <div class="service-cards">
        <!-- Status da Fonte -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-signal"></i>
            </div>
            <div class="card-title">
              <h4>Status da Fonte</h4>
              <span class="card-subtitle">Informações da conexão</span>
            </div>
            <div class="card-actions">
              <span class="status-badge online">Online</span>
            </div>
          </div>
          <div class="card-content">
            <div class="balance-display">
              <div class="balance-value">ONLINE</div>
              <div class="balance-label">Arquivos sendo processados</div>
            </div>
            <div class="balance-details">
              <div class="detail-item">
                <span class="detail-label">Última Sincronização:</span>
                <span class="detail-value">2024-01-15 14:30:00</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Arquivos Ativos:</span>
                <span class="detail-value">12</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Taxa de Sucesso:</span>
                <span class="detail-value">97.8%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Arquivos Processados -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="card-title">
              <h4>Arquivos Processados</h4>
              <span class="card-subtitle">Formatos suportados</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">12 Arquivos</span>
            </div>
          </div>
          <div class="card-content">
            <div class="files-grid">
              <div v-for="file in files" :key="file.id" class="file-item">
                <div class="file-icon">
                  <i :class="file.icon"></i>
                </div>
                <div class="file-details">
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-status" :class="file.status">
                    {{ file.statusText }}
                  </div>
                  <div class="file-metrics">
                    <span>{{ file.size }}</span>
                    <span>{{ file.records }} registros</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de Performance -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="card-title">
              <h4>Métricas de Performance</h4>
              <span class="card-subtitle">Indicadores de desempenho</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">4 Métricas</span>
            </div>
          </div>
          <div class="card-content">
            <div class="metrics-grid">
              <div v-for="metric in performanceMetrics" :key="metric.id" class="metric-item">
                <div class="metric-icon">
                  <i :class="metric.icon"></i>
                </div>
                <div class="metric-details">
                  <div class="metric-value">{{ metric.value }}</div>
                  <div class="metric-label">{{ metric.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações -->
        <div class="service-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="card-title">
              <h4>Configurações</h4>
              <span class="card-subtitle">Parâmetros dos arquivos</span>
            </div>
            <div class="card-actions">
              <span class="status-badge info">4 Configs</span>
            </div>
          </div>
          <div class="card-content">
            <div class="config-list">
              <div v-for="config in fileConfigs" :key="config.id" class="config-item">
                <div class="config-name">{{ config.name }}</div>
                <div class="config-value">{{ config.value }}</div>
                <div class="config-description">{{ config.description }}</div>
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
  name: 'FisherFilesView',
  data() {
    return {
      files: [
        {
          id: 1,
          name: 'produtos.csv',
          status: 'online',
          statusText: 'PROCESSADO',
          icon: 'fas fa-file-csv',
          size: '2.1MB',
          records: '15,420'
        },
        {
          id: 2,
          name: 'clientes.xlsx',
          status: 'online',
          statusText: 'PROCESSADO',
          icon: 'fas fa-file-excel',
          size: '1.8MB',
          records: '8,750'
        },
        {
          id: 3,
          name: 'pedidos.xml',
          status: 'online',
          statusText: 'PROCESSADO',
          icon: 'fas fa-file-code',
          size: '3.2MB',
          records: '12,300'
        },
        {
          id: 4,
          name: 'estoque.json',
          status: 'online',
          statusText: 'PROCESSADO',
          icon: 'fas fa-file-alt',
          size: '1.5MB',
          records: '5,890'
        },
        {
          id: 5,
          name: 'relatorio.pdf',
          status: 'online',
          statusText: 'PROCESSADO',
          icon: 'fas fa-file-pdf',
          size: '4.2MB',
          records: 'N/A'
        },
        {
          id: 6,
          name: 'dados.txt',
          status: 'online',
          statusText: 'PROCESSADO',
          icon: 'fas fa-file-alt',
          size: '856KB',
          records: '2,450'
        }
      ],
      performanceMetrics: [
        {
          id: 1,
          name: 'Total de Arquivos',
          value: '12',
          label: 'processados',
          icon: 'fas fa-file-alt'
        },
        {
          id: 2,
          name: 'Tamanho Total',
          value: '15.2MB',
          label: 'armazenados',
          icon: 'fas fa-hdd'
        },
        {
          id: 3,
          name: 'Registros',
          value: '44,810',
          label: 'processados',
          icon: 'fas fa-list'
        },
        {
          id: 4,
          name: 'Formatos',
          value: '6',
          label: 'suportados',
          icon: 'fas fa-file'
        }
      ],
      fileConfigs: [
        {
          id: 1,
          name: 'Auto Process',
          value: 'Ativado',
          description: 'Processamento automático'
        },
        {
          id: 2,
          name: 'File Size Limit',
          value: '50MB',
          description: 'Limite de tamanho'
        },
        {
          id: 3,
          name: 'Supported Formats',
          value: 'CSV, XLSX, XML, JSON, PDF, TXT',
          description: 'Formatos aceitos'
        },
        {
          id: 4,
          name: 'Backup Files',
          value: 'Ativado',
          description: 'Backup automático'
        }
      ]
    }
  },
  methods: {
    syncData() {
      console.log('Sincronizando dados dos arquivos...')
      // Implementar lógica de sincronização
    },
    refreshData() {
      console.log('Atualizando dados dos arquivos...')
      // Implementar lógica de atualização
    }
  }
}
</script>


