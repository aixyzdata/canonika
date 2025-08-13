<template>
  <div class="canonika-view">
    <!-- View Header seguindo padrão do Beacon -->
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-file-alt"></i>
        <div class="title-content">
          <h1>Arquivos Locais</h1>
          <p>Processamento de arquivos CSV, Excel, XML</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>Ativo</span>
      </div>
      <div class="view-actions">
        <button @click="uploadFiles" class="btn btn-primary btn-sm">
          <i class="fas fa-upload me-2"></i>
          Upload
        </button>
        <button @click="processFiles" class="btn btn-secondary btn-sm">
          <i class="fas fa-cog me-2"></i>
          Processar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: Status do Processamento -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-file-alt text-success me-2"></i>
            Status do Processamento
          </h3>
          <p class="section-description">
            Monitoramento do processamento de arquivos locais.
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
                  <h4>Status Arquivos</h4>
                  <span class="card-subtitle">156 arquivos processados</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ fileStatus.totalFiles }}</span>
                    <span class="metric-label">Total Arquivos</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ fileStatus.successRate }}%</span>
                    <span class="metric-label">Taxa Sucesso</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ fileStatus.processedToday }}</span>
                    <span class="metric-label">Processados Hoje</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ fileStatus.lastProcessed }}</span>
                    <span class="metric-label">Último Processado</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <div class="card-title">
                  <h4>Estatísticas</h4>
                  <span class="card-subtitle">Dados processados</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">Ativo</span>
                </div>
              </div>
              <div class="card-content">
                <div class="metric-grid">
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.totalData }}</span>
                    <span class="metric-label">Total de Dados</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.fileTypes }}</span>
                    <span class="metric-label">Tipos de Arquivo</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.storageUsed }}</span>
                    <span class="metric-label">Armazenamento</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-value">{{ dataStats.avgProcessingTime }}</span>
                    <span class="metric-label">Tempo Médio</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="service-card">
              <div class="card-header">
                <div class="card-icon">
                  <i class="fas fa-folder"></i>
                </div>
                <div class="card-title">
                  <h4>Tipos de Arquivo</h4>
                  <span class="card-subtitle">Formatos suportados</span>
                </div>
                <div class="card-actions">
                  <span class="status-badge online">{{ fileTypes.length }} Suportados</span>
                </div>
              </div>
              <div class="card-content">
                <div class="filetypes-list">
                  <div 
                    v-for="fileType in fileTypes" 
                    :key="fileType.id" 
                    class="filetype-item"
                  >
                    <div class="filetype-icon">
                      <i :class="fileType.icon"></i>
                    </div>
                    <div class="filetype-content">
                      <div class="filetype-name">{{ fileType.name }}</div>
                      <div class="filetype-status">{{ fileType.status }}</div>
                    </div>
                    <div class="filetype-metrics">
                      <span>{{ fileType.count }} arquivos</span>
                    </div>
                  </div>
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
export default {
  name: 'FilesView',
  data() {
    return {
      fileStatus: {
        totalFiles: 156,
        successRate: 97.8,
        processedToday: 12,
        lastProcessed: '15 min atrás'
      },
      dataStats: {
        totalData: '1.8GB',
        fileTypes: 6,
        storageUsed: '2.1GB',
        avgProcessingTime: '45s'
      },
      fileTypes: [
        {
          id: 1,
          name: 'CSV Files',
          status: 'Suportado',
          icon: 'fas fa-file-csv',
          count: 45
        },
        {
          id: 2,
          name: 'Excel Files',
          status: 'Suportado',
          icon: 'fas fa-file-excel',
          count: 38
        },
        {
          id: 3,
          name: 'XML Files',
          status: 'Suportado',
          icon: 'fas fa-file-code',
          count: 28
        },
        {
          id: 4,
          name: 'JSON Files',
          status: 'Suportado',
          icon: 'fas fa-file-alt',
          count: 22
        },
        {
          id: 5,
          name: 'PDF Files',
          status: 'Suportado',
          icon: 'fas fa-file-pdf',
          count: 15
        },
        {
          id: 6,
          name: 'TXT Files',
          status: 'Suportado',
          icon: 'fas fa-file-alt',
          count: 8
        }
      ]
    }
  },
  methods: {
    uploadFiles() {
      console.log('Abrindo upload de arquivos...')
      // Lógica para upload
    },
    processFiles() {
      console.log('Processando arquivos...')
      // Lógica para processar arquivos
    }
  }
}
</script>

<style scoped>
/* Estilos específicos dos Files seguindo padrão Beacon */
.filetypes-list {
  margin-top: 1rem;
}

.filetype-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.filetype-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.filetype-icon {
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.filetype-content {
  flex: 1;
}

.filetype-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.filetype-status {
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 500;
}

.filetype-metrics {
  font-size: 0.7rem;
  color: #94a3b8;
}
</style>


