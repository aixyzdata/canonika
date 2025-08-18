<template>
  <div class="tollgate-view">
    <!-- View Header -->
    <div class="view-header">
      <div class="view-title">
        <h2>Fisher Service</h2>
      </div>
      <div class="view-status">
        <span class="status-badge online">ONLINE</span>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary">
          <i class="fas fa-sync-alt me-2"></i>
          Sincronizar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção de Notificações -->
      <div v-if="notifications.length > 0" class="notifications-section mb-4">
        <div class="notifications-header">
          <div class="notifications-header-content">
            <div class="notifications-icon-wrapper">
              <i class="fas fa-bell notifications-icon"></i>
            </div>
            <div class="notifications-title-wrapper">
              <h4 class="notifications-title">Notificações de Download</h4>
              <span class="notifications-count">{{ notifications.length }} {{ notifications.length === 1 ? 'notificação' : 'notificações' }}</span>
            </div>
          </div>
          <button @click="clearNotifications" class="btn-clear-notifications">
            <i class="fas fa-trash-alt"></i>
            <span>Limpar</span>
          </button>
        </div>
        <div class="notifications-list">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="`notification-${notification.type}`"
          >
            <div class="notification-header">
              <span class="notification-title">{{ notification.title }}</span>
              <button @click="removeNotification(notification.id)" class="btn-close">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="notification-message">{{ notification.message }}</div>
            <div v-if="notification.progress > 0 && notification.progress < 100" class="notification-progress">
              <div class="progress">
                <div 
                  class="progress-bar" 
                  :class="`bg-${notification.type === 'success' ? 'success' : notification.type === 'error' ? 'danger' : 'primary'}`"
                  :style="{ width: `${notification.progress}%` }"
                ></div>
              </div>
              <span class="progress-text">{{ notification.progress.toFixed(1) }}%</span>
            </div>
            <div class="notification-time">
              {{ new Date(notification.timestamp).toLocaleTimeString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Seção: AG-Grid Oficial -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="canonika-section-title">
            <i class="fas fa-database section-icon text-primary"></i>
            Arquivos CNPJ - Receita Federal
          </h3>
          <p class="section-description">
            Lista de arquivos disponíveis em https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/
          </p>
          <div class="section-actions">
            <button 
              @click="fetchCnpjFiles" 
              class="btn btn-primary"
              :disabled="loading"
            >
              <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i>
              {{ loading ? 'Atualizando...' : 'Atualizar' }}
            </button>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-2">Buscando arquivos da Receita Federal...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Erro ao carregar dados:</strong> {{ error }}
          </div>
          <button @click="fetchCnpjFiles" class="btn btn-warning btn-sm">
            <i class="fas fa-redo me-2"></i>
            Tentar Novamente
          </button>
        </div>

        <!-- Grid Content -->
        <div v-else class="section-content">
          <!-- Seção de Filtros -->
          <div class="filters-section mb-4">
            <div class="row">
              <div class="col-md-4">
                <label for="versionFilter" class="form-label">
                  <i class="fas fa-filter me-2"></i>
                  Filtrar por Versão
                </label>
                <select 
                  id="versionFilter" 
                  v-model="selectedVersion" 
                  @change="filterByVersion"
                  class="form-select"
                >
                  <option value="">Todas as versões</option>
                  <option 
                    v-for="version in availableVersions" 
                    :key="version" 
                    :value="version"
                  >
                    {{ version }}
                  </option>
                </select>
              </div>
              <div class="col-md-8">
                <label class="form-label">
                  <i class="fas fa-tasks me-2"></i>
                  Ações em Massa
                </label>
                <div class="d-flex gap-2">
                  <button 
                    @click="bulkDownload" 
                    class="btn btn-success btn-sm"
                    :disabled="!hasSelectedFiles || bulkLoading"
                  >
                    <i class="fas fa-download me-1"></i>
                    Download Selecionados
                  </button>
                  <button 
                    @click="bulkProcess" 
                    class="btn btn-warning btn-sm"
                    :disabled="!hasSelectedFiles || bulkLoading"
                  >
                    <i class="fas fa-cogs me-1"></i>
                    Processar Selecionados
                  </button>
                  <button 
                    @click="bulkDelete" 
                    class="btn btn-danger btn-sm"
                    :disabled="!hasSelectedFiles || bulkLoading"
                  >
                    <i class="fas fa-trash me-1"></i>
                    Excluir Selecionados
                  </button>
                  <button 
                    @click="selectAll" 
                    class="btn btn-outline-primary btn-sm"
                  >
                    <i class="fas fa-check-square me-1"></i>
                    Selecionar Todos
                  </button>
                  <button 
                    @click="clearSelection" 
                    class="btn btn-outline-secondary btn-sm"
                  >
                    <i class="fas fa-square me-1"></i>
                    Limpar Seleção
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- AG Grid Component -->
          <div class="ag-grid-container">
            <ag-grid-vue
              :theme="theme"
              :rowData="rowData"
              :columnDefs="colDefs"
              class="ag-grid-reference"
              :defaultColDef="defaultColDef"
              :pagination="true"
              :paginationPageSize="20"
              :paginationPageSizeSelector="[20, 50, 100]"
              :getRowClass="getRowClass"
              :rowSelection="rowSelectionConfig"
              @grid-ready="onGridReady"
              @selection-changed="onSelectionChanged"
            >
            </ag-grid-vue>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
        import { AgGridVue } from 'ag-grid-vue3';
        import {
          AllCommunityModule,
          ModuleRegistry,
          // Base Themes
          themeQuartz,
          // Color Schemes
          colorSchemeDarkBlue,
          // Icon Sets
          iconSetQuartzRegular
        } from 'ag-grid-community';
import fisherWebSocketService from '../../services/WebSocketService.js';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default {
  name: 'SefazView',
  components: {
    AgGridVue, // Add Vue Data Grid component
  },
  setup() {
    // Tema Canonika simplificado
    const theme = themeQuartz
      .withPart(colorSchemeDarkBlue)
      .withPart(iconSetQuartzRegular);

    // Row Data: The data to be displayed (arquivos da Receita Federal)
    const rowData = ref([]);
    const loading = ref(true);
    const error = ref(null);
    
    // Filtros e seleção
    const selectedVersion = ref('');
    const availableVersions = ref([]);
    const bulkLoading = ref(false);
    const selectedFiles = ref([]);

    // WebSocket e progresso de downloads
    const downloadProgress = ref({});
    const activeDownloads = ref({});
    const wsConnected = ref(false);
    const notifications = ref([]);

    // Função para buscar dados reais da API
    const fetchCnpjFiles = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        console.log('🔄 Buscando arquivos CNPJ da API...');
        
        const response = await fetch('http://localhost:3706/api/cnpj/files/refresh');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.files && Array.isArray(data.files)) {
          console.log(`✅ ${data.files.length} arquivos carregados da API`);
          
          // Transformar dados da API para o formato do grid
          rowData.value = data.files.map(file => ({
            version: file.month_year || file.version || 'N/A',
            file: file.filename || file.file || 'Arquivo desconhecido',
            status: getFileStatus(file.status)
          }));
          
          // Atualizar versões disponíveis
          updateAvailableVersions();
          
          if (window.showSuccess) {
            window.showSuccess(`${rowData.value.length} arquivos carregados com sucesso!`, 3000);
          }
        } else {
          throw new Error(data.error || 'Resposta inválida da API');
        }
      } catch (err) {
        console.error('❌ Erro ao buscar arquivos CNPJ:', err);
        error.value = `Erro ao carregar dados: ${err.message}`;
        
        // Em caso de erro, mostrar lista vazia
        rowData.value = [];
        
        if (window.showError) {
          window.showError(`Falha ao carregar arquivos: ${err.message}`, 5000);
        }
      } finally {
        loading.value = false;
      }
    };

    // Função auxiliar para mapear status
    const getFileStatus = (status) => {
      if (!status) return 'Disponível';
      
      const statusLower = status.toLowerCase();
      
      if (statusLower.includes('downloaded') || statusLower.includes('baixado')) {
        return 'Baixado';
      } else if (statusLower.includes('processed') || statusLower.includes('processado')) {
        return 'Processado';
      } else if (statusLower.includes('available') || statusLower.includes('disponível')) {
        return 'Disponível';
      } else {
        return 'Disponível'; // Status padrão
      }
    };

    // Função para download de arquivo
    const downloadFile = async (filename, version, event) => {
      try {
        console.log(`Iniciando download: ${filename} (${version})`);
        
        // Mostrar loading no botão
        const button = event?.target?.closest('button');
        if (button) {
          const originalContent = button.innerHTML;
          button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
          button.disabled = true;
        }
        
        // Chamar API de download
        const response = await fetch(`http://localhost:3706/api/cnpj/download/${filename}?month_year=${version}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
          console.log(`Download iniciado: ${filename}`);
          // Atualizar status na lista
          const fileIndex = rowData.value.findIndex(f => f.file === filename);
          if (fileIndex !== -1) {
            rowData.value[fileIndex].status = 'Baixado';
          }
          
          // Mostrar alerta de sucesso
          if (window.showSuccess) {
            window.showSuccess(`Download iniciado: ${filename}`, 3000);
          }
        } else {
          console.error(`Erro no download: ${result.error}`);
          if (window.showError) {
            window.showError(`Erro ao baixar ${filename}: ${result.error}`, 5000);
          }
        }
        
      } catch (err) {
        console.error('Erro no download:', err);
        if (window.showError) {
          window.showError(`Erro ao baixar ${filename}: ${err.message}`, 5000);
        }
      } finally {
        // Restaurar botão
        const button = event.target.closest('button');
        const isDownloaded = rowData.value.find(f => f.file === filename)?.status === 'Baixado';
        button.innerHTML = isDownloaded ? '<i class="fas fa-redo"></i>' : '<i class="fas fa-download"></i>';
        button.disabled = false;
      }
    };

    // Função para processar arquivo
    const processFile = async (filename, version, event) => {
      try {
        console.log(`Iniciando processamento: ${filename} (${version})`);
        const button = event?.target?.closest('button');
        if (button) {
          const originalContent = button.innerHTML;
          button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
          button.disabled = true;
        }

        // Chamar API de processamento
        const response = await fetch(`http://localhost:3706/api/cnpj/process/${filename}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        
        if (data.status === 'success') {
          console.log(`Processamento concluído: ${filename}`);
          // Atualizar status no grid
          const fileIndex = rowData.value.findIndex(f => f.file === filename);
          if (fileIndex !== -1) {
            rowData.value[fileIndex].status = 'Processado';
          }
          
          // Mostrar alerta de sucesso
          if (window.showSuccess) {
            window.showSuccess(`Arquivo ${filename} processado com sucesso!`, 3000);
          }
        } else {
          throw new Error(data.error || data.message || 'Erro no processamento');
        }
      } catch (err) {
        console.error('Erro no processamento:', err);
        if (window.showError) {
          window.showError(`Erro ao processar ${filename}: ${err.message}`, 5000);
        }
      } finally {
        const button = event.target.closest('button');
        button.innerHTML = '<i class="fas fa-cogs me-1"></i> Processar';
        button.disabled = false;
      }
    };

    // Função para excluir arquivo
    const deleteFile = async (filename, version, event) => {
      try {
        if (window.confirmDialog) {
          const confirmed = await window.confirmDialog(
            `Tem certeza que deseja excluir o arquivo ${filename}?`,
            'Confirmar exclusão'
          );
          if (!confirmed) {
            return;
          }
        } else {
          // Fallback para confirm nativo se o sistema de confirmação não estiver disponível
          if (!confirm(`Tem certeza que deseja excluir o arquivo ${filename}?`)) {
            return;
          }
        }

        console.log(`Iniciando exclusão: ${filename} (${version})`);
        const button = event?.target?.closest('button');
        if (button) {
          const originalContent = button.innerHTML;
          button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';
          button.disabled = true;
        }

        // Chamar API de exclusão
        const response = await fetch(`http://localhost:3706/api/cnpj/files/${filename}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        
        if (data.status === 'success') {
          console.log(`Exclusão concluída: ${filename}`);
          // Remover arquivo do grid
          const fileIndex = rowData.value.findIndex(f => f.file === filename);
          if (fileIndex !== -1) {
            rowData.value.splice(fileIndex, 1);
          }
          // Mostrar alerta de sucesso
          if (window.showSuccess) {
            window.showSuccess(`Arquivo ${filename} excluído com sucesso!`, 3000);
          }
        } else {
          throw new Error(data.error || data.message || 'Erro na exclusão');
        }
      } catch (err) {
        console.error('Erro na exclusão:', err);
        if (window.showError) {
          window.showError(`Erro ao excluir ${filename}: ${err.message}`, 5000);
        }
      } finally {
        const button = event.target.closest('button');
        button.innerHTML = '<i class="fas fa-trash me-1"></i> Excluir';
        button.disabled = false;
      }
    };

    // Função para filtrar por versão
    const filterByVersion = () => {
      if (!selectedVersion.value) {
        // Mostrar todos os arquivos
        gridApi?.setFilterModel(null);
      } else {
        // Filtrar por versão específica
        gridApi?.setFilterModel({
          version: {
            type: 'equals',
            filter: selectedVersion.value
          }
        });
      }
    };

    // Função para obter versões disponíveis
    const updateAvailableVersions = () => {
      const versions = [...new Set(rowData.value.map(file => file.version))];
      availableVersions.value = versions.sort((a, b) => {
        // Converter para Date para comparação correta
        const dateA = new Date(a + '-01'); // Adiciona dia 01 para criar data válida
        const dateB = new Date(b + '-01');
        return dateB - dateA; // Ordem decrescente (mais recente primeiro)
      });
    };

    // Funções de seleção
    const selectAll = () => {
      if (gridApi) {
        gridApi.selectAll();
        updateSelectedFiles();
      }
    };

    const clearSelection = () => {
      if (gridApi) {
        gridApi.deselectAll();
        updateSelectedFiles();
      }
    };

    // Função para atualizar arquivos selecionados
    const updateSelectedFiles = () => {
      if (gridApi) {
        const selectedNodes = gridApi.getSelectedNodes();
        selectedFiles.value = selectedNodes.map(node => ({
          file: node.data.file,
          version: node.data.version,
          status: node.data.status
        }));
      }
    };

    // Event handler para mudanças de seleção
    const onSelectionChanged = () => {
      updateSelectedFiles();
    };

    // Computed properties
    const hasSelectedFiles = computed(() => {
      return selectedFiles.value.length > 0;
    });

    // Funções de ações em massa
    const bulkDownload = async () => {
      if (!hasSelectedFiles.value) return;
      
      try {
        bulkLoading.value = true;
        const promises = selectedFiles.value.map(file => 
          downloadFile(file.file, file.version)
        );
        
        await Promise.all(promises);
        if (window.showSuccess) {
          window.showSuccess(`${selectedFiles.value.length} arquivos baixados com sucesso!`, 3000);
        }
        clearSelection();
      } catch (err) {
        console.error('Erro no download em massa:', err);
        if (window.showError) {
          window.showError(`Erro no download em massa: ${err.message}`, 5000);
        }
      } finally {
        bulkLoading.value = false;
      }
    };

    const bulkProcess = async () => {
      if (!hasSelectedFiles.value) return;
      
      try {
        bulkLoading.value = true;
        const promises = selectedFiles.value.map(file => 
          processFile(file.file, file.version)
        );
        
        await Promise.all(promises);
        if (window.showSuccess) {
          window.showSuccess(`${selectedFiles.value.length} arquivos processados com sucesso!`, 3000);
        }
        clearSelection();
      } catch (err) {
        console.error('Erro no processamento em massa:', err);
        if (window.showError) {
          window.showError(`Erro no processamento em massa: ${err.message}`, 5000);
        }
      } finally {
        bulkLoading.value = false;
      }
    };

    const bulkDelete = async () => {
      if (!hasSelectedFiles.value) return;
      
      if (window.confirmDialog) {
        const confirmed = await window.confirmDialog(
          `Tem certeza que deseja excluir ${selectedFiles.value.length} arquivos?`,
          'Confirmar exclusão em massa'
        );
        if (!confirmed) {
          return;
        }
      } else {
        // Fallback para confirm nativo se o sistema de confirmação não estiver disponível
        if (!confirm(`Tem certeza que deseja excluir ${selectedFiles.value.length} arquivos?`)) {
          return;
        }
      }
      
      try {
        bulkLoading.value = true;
        const promises = selectedFiles.value.map(file => 
          deleteFile(file.file, file.version)
        );
        
        await Promise.all(promises);
        if (window.showSuccess) {
          window.showSuccess(`${selectedFiles.value.length} arquivos excluídos com sucesso!`, 3000);
        }
        clearSelection();
      } catch (err) {
        console.error('Erro na exclusão em massa:', err);
        if (window.showError) {
          window.showError(`Erro na exclusão em massa: ${err.message}`, 5000);
        }
      } finally {
        bulkLoading.value = false;
      }
    };

                // Configurar função global para os botões
            onMounted(() => {
              fetchCnpjFiles();
              initializeWebSocket();
              window.downloadFile = downloadFile;
              window.processFile = processFile;
              window.deleteFile = deleteFile;
            });

    // Funções WebSocket e notificações
    const initializeWebSocket = () => {
      console.log('🔌 Inicializando WebSocket para Fisher...');
      
      // Registrar callbacks
      fisherWebSocketService.onConnectionChange((status) => {
        wsConnected.value = status === 'connected';
        console.log('🔌 Status WebSocket Fisher:', status);
        
        if (status === 'connected') {
          console.log('✅ WebSocket Fisher conectado com sucesso');
          if (window.showSuccess) {
            window.showSuccess('WebSocket conectado com sucesso!', 3000);
          }
        } else if (status === 'disconnected') {
          console.log('❌ WebSocket Fisher desconectado');
          if (window.showWarning) {
            window.showWarning('WebSocket desconectado. Tentando reconectar...', 5000);
          }
        } else if (status === 'error') {
          console.log('❌ Erro no WebSocket Fisher');
          if (window.showError) {
            window.showError('Erro na conexão WebSocket', 5000);
          }
        }
      });

      fisherWebSocketService.onDownloadProgress((data) => {
        console.log('📥 Progresso de download recebido:', data);
        handleDownloadProgress(data);
      });

      // Conectar ao WebSocket
      fisherWebSocketService.connect();
    };

    const handleDownloadProgress = (data) => {
      const { download_id, filename, status, progress, message, speed, eta, bytes_downloaded, total_size } = data;
      
      // Atualizar progresso
      downloadProgress.value[download_id] = {
        filename,
        status,
        progress: progress || 0,
        message: message || '',
        speed: speed || '0 MB/s',
        eta: eta || 'calculando...',
        bytes_downloaded: bytes_downloaded || 0,
        total_size: total_size || 0,
        timestamp: Date.now()
      };

      // Adicionar notificação
      addNotification({
        id: download_id,
        type: status === 'completed' ? 'success' : (status === 'error' ? 'error' : 'info'),
        title: `Download: ${filename}`,
        message: message || `Status: ${status}`,
        progress: progress || 0,
        timestamp: Date.now()
      });

      // Se download concluído ou com erro, atualizar grid após delay
      if (status === 'completed' || status === 'error') {
        setTimeout(() => {
          fetchCnpjFiles();
        }, 2000);
      }
    };

    const addNotification = (notification) => {
      notifications.value.unshift(notification);
      
      // Manter apenas as últimas 10 notificações
      if (notifications.value.length > 10) {
        notifications.value = notifications.value.slice(0, 10);
      }

      // Auto-remover notificações de sucesso após 5 segundos
      if (notification.type === 'success') {
        setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      }
    };

    const removeNotification = (id) => {
      const index = notifications.value.findIndex(n => n.id === id);
      if (index > -1) {
        notifications.value.splice(index, 1);
      }
    };

    const clearNotifications = () => {
      notifications.value = [];
    };

    // Column Definitions: Defines the columns to be displayed (arquivos da Receita Federal)
    const colDefs = ref([
      {
        headerName: '',
        field: 'selected',
        width: 50,
        pinned: 'left',
        sortable: false,
        filter: false,
        resizable: false,
        checkboxSelection: true,
        headerCheckboxSelection: true
      },
      { 
        field: "version", 
        headerName: "Versão", 
        sortable: true, 
        filter: true,
        width: 120,
        cellStyle: { fontWeight: '600' }
      },
      { 
        field: "file", 
        headerName: "Arquivo", 
        sortable: true, 
        filter: true,
        flex: 2,
        cellStyle: { fontFamily: 'monospace', fontSize: '0.9rem' }
      },
      { 
        field: "status", 
        headerName: "Status", 
        sortable: true, 
        filter: true,
        cellStyle: { textAlign: 'left' },
        cellRenderer: (params) => {
          const status = params.value?.toLowerCase();
          switch (status) {
            case 'disponível':
              return '<span style="color: #3b82f6; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-folder-open"></i> Disponível</span>';
            case 'baixado':
              return '<span style="color: #f59e0b; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-download"></i> Baixado</span>';
            case 'processado':
              return '<span style="color: #10b981; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-check-circle"></i> Processado</span>';
            default:
              return `<span style="color: #6b7280; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-question-circle"></i> ${params.value}</span>`;
          }
        },
        width: 150
      },
      { 
        field: "actions", 
        headerName: "Ações", 
        sortable: false, 
        filter: false,
        width: 140,
        cellRenderer: (params) => {
          const status = params.data.status?.toLowerCase();
          const filename = params.data.file;
          const version = params.data.version;
          
          // Determinar ação baseada no status real
          if (status === 'disponível' || status === 'available') {
            // Arquivo não encontrado - botão Download
            return `
              <button
                onclick="window.downloadFile('${filename}', '${version}', event)"
                class="btn btn-success btn-sm"
                style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.8125rem; font-weight: 500; border-radius: 6px; transition: all 0.2s ease;"
              >
                <i class="fas fa-cloud-download-alt"></i>
                Download
              </button>
            `;
          } else if (status === 'baixado' || status === 'downloaded') {
            // Arquivo baixado mas não processado - botão Processar
            return `
              <button
                onclick="window.processFile('${filename}', '${version}', event)"
                class="btn btn-warning btn-sm"
                style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.8125rem; font-weight: 500; border-radius: 6px; transition: all 0.2s ease;"
              >
                <i class="fas fa-cogs"></i>
                Processar
              </button>
            `;
          } else if (status === 'processado' || status === 'processed') {
            // Arquivo já no banco - botão Excluir
            return `
              <button
                onclick="window.deleteFile('${filename}', '${version}', event)"
                class="btn btn-danger btn-sm"
                style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.8125rem; font-weight: 500; border-radius: 6px; transition: all 0.2s ease;"
              >
                <i class="fas fa-trash-alt"></i>
                Excluir
              </button>
            `;
          } else {
            // Status desconhecido - botão Download como fallback
            return `
              <button
                onclick="window.downloadFile('${filename}', '${version}', event)"
                class="btn btn-primary btn-sm"
                style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.8125rem; font-weight: 500; border-radius: 6px; transition: all 0.2s ease;"
              >
                <i class="fas fa-cloud-download-alt"></i>
                Download
              </button>
            `;
          }
        }
      }
    ]);

    // Default column definition
    const defaultColDef = ref({
      flex: 1,
      minWidth: 100,
      resizable: true,
    });

    let gridApi = null;

    const onGridReady = (params) => {
      gridApi = params.api;
    };

        const getRowClass = (params) => {
      const status = params.data.status?.toLowerCase();

      if (status === 'baixado' || status === 'downloaded') {
        return 'downloaded-row';
      } else if (status === 'processado' || status === 'processed') {
        return 'processed-row';
      }

      return '';
    };

    const rowSelectionConfig = ref({
      mode: 'multiple'
    });

    return {
      theme,
      rowData,
      colDefs,
      defaultColDef,
      onGridReady,
      loading,
      error,
      fetchCnpjFiles,
      downloadFile,
      processFile,
      deleteFile,
      getRowClass,
      // Filtros e seleção
      selectedVersion,
      availableVersions,
      bulkLoading,
      selectedFiles,
      hasSelectedFiles,
      filterByVersion,
      selectAll,
      clearSelection,
      updateSelectedFiles,
      onSelectionChanged,
      bulkDownload,
      bulkProcess,
      bulkDelete,
      rowSelectionConfig,
      // WebSocket e notificações
      wsConnected,
      downloadProgress,
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
    };
  },
};
</script>

<style scoped>
.ag-grid-container {
  margin: 1rem 0;
}

.ag-grid-reference {
  height: 400px;
  width: 100%;
}

/* Estilos para seção de filtros */
.filters-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.filters-section .form-label {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  display: block;
  line-height: 1.4;
}

.filters-section .form-select {
  background-color: #374151;
  border: 1px solid #4b5563;
  color: #f3f4f6;
  border-radius: 6px;
  padding: 0.625rem 0.875rem;
  margin-bottom: 1.5rem;
}

.filters-section .form-select:focus {
  background-color: #374151;
  border-color: #3b82f6;
  color: #f3f4f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

.filters-section .form-select option {
  background-color: #374151;
  color: #f3f4f6;
}

.filters-section .btn {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  margin-right: 0.75rem;
  margin-bottom: 0.5rem;
}

.filters-section .btn:last-child {
  margin-right: 0;
}

.filters-section .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.filters-section .btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.filters-section .btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: 1px solid #10b981;
  color: white;
}

.filters-section .btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: 1px solid #f59e0b;
  color: white;
}

.filters-section .btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: 1px solid #ef4444;
  color: white;
}

.filters-section .btn-outline-primary {
  background: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.filters-section .btn-outline-primary:hover {
  background: #3b82f6;
  color: white;
}

.filters-section .btn-outline-secondary {
  background: transparent;
  border: 1px solid #6b7280;
  color: #6b7280;
}

.filters-section .btn-outline-secondary:hover {
  background: #6b7280;
  color: white;
}

.filters-section .gap-2 {
  gap: 0.75rem !important;
}

/* Ajustes específicos para o layout responsivo */
.filters-section .row {
  margin: 0;
}

.filters-section .col-md-4,
.filters-section .col-md-8 {
  padding: 0 1rem;
}

.filters-section .col-md-4 {
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .filters-section .col-md-4 {
    margin-bottom: 0;
  }
}

/* Estilo especial para linhas de registros baixados */
:deep(.downloaded-row) {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important;
  border-left: 4px solid #3b82f6 !important;
  position: relative;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

:deep(.downloaded-row::before) {
  content: "⬇️";
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #3b82f6;
  font-weight: bold;
  font-size: 14px;
  z-index: 1;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.downloaded-row:hover) {
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%) !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Estilo especial para linhas de registros processados */
:deep(.processed-row) {
  background: linear-gradient(135deg, #065f46 0%, #047857 100%) !important;
  border-left: 4px solid #10b981 !important;
  position: relative;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

:deep(.processed-row::before) {
  content: "⚡";
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #10b981;
  font-weight: bold;
  font-size: 14px;
  z-index: 1;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.processed-row:hover) {
  background: linear-gradient(135deg, #047857 0%, #059669 100%) !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Ajuste para o conteúdo da linha baixada/processada */
:deep(.downloaded-row .ag-cell),
:deep(.processed-row .ag-cell) {
  padding-left: 35px !important;
  color: #ffffff !important;
  font-weight: 500;
}

/* Melhorar contraste do texto nas linhas marcadas */
:deep(.downloaded-row .ag-cell-value) {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

:deep(.processed-row .ag-cell-value) {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Estilo especial para checkboxes nas linhas marcadas */
:deep(.downloaded-row .ag-checkbox-input-wrapper) {
  background: rgba(59, 130, 246, 0.2) !important;
  border: 2px solid #3b82f6 !important;
}

:deep(.processed-row .ag-checkbox-input-wrapper) {
  background: rgba(16, 185, 129, 0.2) !important;
  border: 2px solid #10b981 !important;
}

.section-actions {
  margin-top: 1rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error-state {
  padding: 1rem;
}

.error-state .alert {
  margin-bottom: 1rem;
}

/* Estilos para notificações */
.notifications-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.notifications-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
  border-radius: 12px 12px 0 0;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notifications-header-content {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.notifications-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.notifications-icon {
  color: #ffffff;
  font-size: 1rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.notifications-title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.notifications-title {
  color: #f8fafc;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

.notifications-count {
  color: #94a3b8;
  font-size: 0.8125rem;
  font-weight: 500;
}

.btn-clear-notifications {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-clear-notifications:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fecaca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.btn-clear-notifications:active {
  transform: translateY(0);
}

.btn-clear-notifications i {
  font-size: 0.875rem;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.notification-item.notification-success {
  border-left: 4px solid #10b981;
}

.notification-item.notification-error {
  border-left: 4px solid #ef4444;
}

.notification-item.notification-info {
  border-left: 4px solid #3b82f6;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.notification-title {
  color: #f3f4f6;
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-close {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-close:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.notification-message {
  color: #d1d5db;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.notification-progress {
  margin-bottom: 0.75rem;
}

.progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  color: #9ca3af;
  font-size: 0.8rem;
  font-weight: 500;
}

.notification-time {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Responsividade para notificações */
@media (max-width: 768px) {
  .notifications-section {
    padding: 1rem;
    border-radius: 10px;
  }
  
  .notifications-header {
    margin-bottom: 1rem;
    padding-bottom: 0.875rem;
  }
  
  .notifications-header-content {
    gap: 0.75rem;
  }
  
  .notifications-icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }
  
  .notifications-icon {
    font-size: 0.875rem;
  }
  
  .notifications-title {
    font-size: 1rem;
  }
  
  .notifications-count {
    font-size: 0.75rem;
  }
  
  .btn-clear-notifications {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    gap: 0.375rem;
  }
  
  .btn-clear-notifications span {
    display: none;
  }
  
  .notification-item {
    padding: 0.875rem;
    margin-bottom: 0.625rem;
  }
  
  .notification-title {
    font-size: 0.875rem;
  }
  
  .notification-message {
    font-size: 0.8125rem;
  }
}

/* Estilos para o AG-Grid melhorado */
:deep(.ag-theme-quartz) {
  --ag-header-height: 48px;
  --ag-header-foreground-color: #f8fafc;
  --ag-header-background-color: #1e293b;
  --ag-header-cell-hover-background-color: #334155;
  --ag-header-cell-moving-background-color: #475569;
  --ag-row-hover-color: rgba(59, 130, 246, 0.08);
  --ag-selected-row-background-color: rgba(59, 130, 246, 0.12);
  --ag-cell-horizontal-border: solid 1px rgba(255, 255, 255, 0.05);
  --ag-row-border-color: rgba(255, 255, 255, 0.05);
  --ag-font-size: 0.875rem;
  --ag-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:deep(.ag-header-cell) {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-size: 0.75rem;
}

:deep(.ag-cell) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.ag-row) {
  transition: all 0.2s ease;
}

:deep(.ag-row:hover) {
  background-color: rgba(59, 130, 246, 0.04);
}

/* Estilos para botões do grid */
:deep(.ag-cell button) {
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.ag-cell button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.ag-cell button:active) {
  transform: translateY(0);
}

/* Estilos para status */
:deep(.ag-cell .status-display) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

/* Melhorias para linhas baixadas/processadas */
.downloaded-row {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%);
  border-left: 4px solid #3b82f6;
  position: relative;
}

.downloaded-row::before {
  content: '⬇️';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  opacity: 0.6;
}

.processed-row {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%);
  border-left: 4px solid #10b981;
  position: relative;
}

.processed-row::before {
  content: '⚡';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  opacity: 0.6;
}

/* Responsividade para o grid */
@media (max-width: 768px) {
  :deep(.ag-header-cell) {
    font-size: 0.6875rem;
    padding: 0.5rem 0.75rem;
  }
  
  :deep(.ag-cell) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
  
  :deep(.ag-cell button) {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>