<template>
  <div class="tollgate-view">
    <!-- View Header (padrão oficial) -->
    <div class="view-header">
      <div class="view-title">
        <div class="service-icon">
          <i class="fas fa-table"></i>
        </div>
        <div class="title-content">
          <h1>AG-GRID - Template de Referência</h1>
          <p>Implementação oficial do AG-Grid seguindo documentação Vue</p>
        </div>
      </div>
      <div class="view-status">
        <div class="status-indicator">
          <div class="status-dot online"></div>
          <span>Sistema Operacional</span>
        </div>
      </div>
      <div class="view-actions">
        <button @click="addRow" class="btn btn-primary">
          <i class="fas fa-plus me-2"></i>
          Adicionar Linha
        </button>
        <button @click="exportData" class="btn btn-secondary">
          <i class="fas fa-download me-2"></i>
          Exportar
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: AG-Grid Oficial -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="canonika-section-title">
            <i class="fas fa-table section-icon text-success"></i>
            AG-GRID OFICIAL TEMPLATE
          </h3>
          <p class="section-description">
            Implementação seguindo exatamente o exemplo da documentação oficial AG-Grid Vue.
          </p>
        </div>
        <div class="section-content">
          <!-- AG Grid Component -->
          <div class="ag-grid-container">
            <ag-grid-vue
              :theme="theme"
              :rowData="rowData"
              :columnDefs="colDefs"
              style="height: 400px; width: 100%;"
              :defaultColDef="defaultColDef"
              :pagination="true"
              :paginationPageSize="10"
              @grid-ready="onGridReady"
            >
            </ag-grid-vue>
          </div>
        </div>
      </div>

      <!-- Seção: Informações -->
      <div class="canonika-section mt-4">
        <div class="section-header">
          <h3 class="canonika-section-title">
            <i class="fas fa-info-circle section-icon text-primary"></i>
            INFORMAÇÕES DO TEMPLATE
          </h3>
          <p class="section-description">
            Exemplo oficial baseado na documentação AG-Grid Vue Getting Started.
          </p>
        </div>
        <div class="section-content">
          <div class="service-cards-grid">
            <div class="service-card">
              <div class="card-header">
                <i class="fas fa-list text-primary"></i>
                <h4>Total de Linhas</h4>
              </div>
              <div class="card-body">
                <div class="metric-value">{{ rowData.length }}</div>
                <p class="metric-description">Registros carregados</p>
              </div>
            </div>
            <div class="service-card">
              <div class="card-header">
                <i class="fas fa-columns text-success"></i>
                <h4>Colunas</h4>
              </div>
              <div class="card-body">
                <div class="metric-value">{{ colDefs.length }}</div>
                <p class="metric-description">Campos definidos</p>
              </div>
            </div>
            <div class="service-card">
              <div class="card-header">
                <i class="fas fa-code text-warning"></i>
                <h4>Versão AG-Grid</h4>
              </div>
              <div class="card-body">
                <div class="metric-value">v32+</div>
                <p class="metric-description">Community Edition</p>
              </div>
            </div>
            <div class="service-card">
              <div class="card-header">
                <i class="fab fa-vuejs text-info"></i>
                <h4>Framework</h4>
              </div>
              <div class="card-body">
                <div class="metric-value">Vue 3</div>
                <p class="metric-description">ag-grid-vue3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="canonika-footer">
        <div class="footer-content">
          <div class="footer-info">
            <h3>AG-Grid Reference - Template Service</h3>
            <p>Template oficial de implementação AG-Grid seguindo documentação Vue</p>
          </div>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-value">{{ rowData.length }}</span>
              <span class="stat-label">Linhas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ colDefs.length }}</span>
              <span class="stat-label">Colunas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">100%</span>
              <span class="stat-label">Oficial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// =============================================================================
// TEMA DARK NATIVO com pequenos ajustes Canonika
// =============================================================================
// Usando o tema Quartz dark nativo que é superior ao nosso customizado
const canonikaTheme = themeQuartz.withParams({
  colorScheme: 'dark',
  accentColor: '#3b82f6', // Accent azul Canonika
});

export default {
  name: 'AgGridReferenceView',
  components: {
    AgGridVue, // Add Vue Data Grid component
  },
  setup() {
    // Row Data: The data to be displayed (seguindo exemplo oficial)
    const rowData = ref([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
      { make: "BMW", model: "X3", price: 54200, electric: false },
      { make: "Audi", model: "A4", price: 45000, electric: false },
      { make: "Mercedes", model: "C-Class", price: 48000, electric: false },
      { make: "Volkswagen", model: "Golf", price: 28000, electric: false },
      { make: "Nissan", model: "Leaf", price: 32000, electric: true },
      { make: "Hyundai", model: "Ioniq", price: 35000, electric: true },
      { make: "Kia", model: "Niro", price: 31000, electric: true },
      { make: "Chevrolet", model: "Bolt", price: 31500, electric: true },
      { make: "Jaguar", model: "I-Pace", price: 69500, electric: true },
    ]);

    // Column Definitions: Defines the columns to be displayed (seguindo exemplo oficial)
    const colDefs = ref([
      { field: "make", headerName: "Marca", sortable: true, filter: true },
      { field: "model", headerName: "Modelo", sortable: true, filter: true },
      { 
        field: "price", 
        headerName: "Preço", 
        sortable: true, 
        filter: 'agNumberColumnFilter',
        valueFormatter: params => {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'USD'
          }).format(params.value);
        }
      },
      { 
        field: "electric", 
        headerName: "Elétrico", 
        sortable: true, 
        filter: true,
        cellRenderer: params => {
          return params.value ? 
            '<span class="canonika-badge canonika-badge-success">✅ Sim</span>' : 
            '<span class="canonika-badge canonika-badge-secondary">❌ Não</span>';
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

    const addRow = () => {
      const newRow = {
        make: "Nova Marca",
        model: "Novo Modelo", 
        price: Math.floor(Math.random() * 50000) + 20000,
        electric: Math.random() > 0.5
      };
      rowData.value.push(newRow);
    };

    const exportData = () => {
      if (gridApi) {
        gridApi.exportDataAsCsv({
          fileName: 'ag-grid-reference-data.csv'
        });
      }
    };

    return {
      theme: canonikaTheme,
      rowData,
      colDefs,
      defaultColDef,
      onGridReady,
      addRow,
      exportData,
    };
  },
};
</script>

<style scoped>
.ag-grid-container {
  margin: 1rem 0;
}

.ag-theme-canonika {
  /* Tema customizado será aplicado via CSS global */
}

/* Canonika Badges - Padrão oficial */
.canonika-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.canonika-badge-success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}

.canonika-badge-secondary {
  background: rgba(100, 116, 139, 0.2);
  color: #94a3b8;
  border-color: rgba(100, 116, 139, 0.3);
}

/* AG-Grid Pagination - Padrão Canonika */
:deep(.ag-paging-panel) {
  background: rgba(30, 41, 59, 0.8) !important;
  border-top: 1px solid rgba(71, 85, 105, 0.3) !important;
  padding: 1rem !important;
  color: #e2e8f0 !important;
}

:deep(.ag-paging-row-summary-panel) {
  color: #94a3b8 !important;
}

:deep(.ag-paging-button) {
  background: rgba(59, 130, 246, 0.2) !important;
  border: 1px solid rgba(59, 130, 246, 0.3) !important;
  color: #3b82f6 !important;
  border-radius: 0.375rem !important;
  padding: 0.5rem 0.75rem !important;
  font-weight: 600 !important;
  transition: all 0.2s ease !important;
}

:deep(.ag-paging-button:hover) {
  background: rgba(59, 130, 246, 0.3) !important;
  border-color: rgba(59, 130, 246, 0.5) !important;
  transform: translateY(-1px) !important;
}

:deep(.ag-paging-button:disabled) {
  background: rgba(71, 85, 105, 0.2) !important;
  border-color: rgba(71, 85, 105, 0.3) !important;
  color: #64748b !important;
  cursor: not-allowed !important;
}

:deep(.ag-paging-page-size-select) {
  background: rgba(30, 41, 59, 0.8) !important;
  border: 1px solid rgba(71, 85, 105, 0.3) !important;
  color: #e2e8f0 !important;
  border-radius: 0.375rem !important;
  padding: 0.375rem 0.5rem !important;
}

:deep(.ag-paging-page-summary-panel) {
  color: #e2e8f0 !important;
  font-weight: 600 !important;
}
</style>