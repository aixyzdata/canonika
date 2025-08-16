<template>
  <div class="canonika-view">
    <!-- View Header (padrão template) -->
    <div class="view-header-card">
      <div class="header-content">
        <div class="header-left">
          <div class="service-icon">
            <i class="fas fa-table"></i>
          </div>
          <div class="service-info">
            <h2>AG-GRID - Template de Referência</h2>
            <p>Implementação oficial do AG-Grid seguindo documentação Vue</p>
          </div>
        </div>
        <div class="header-center">
          <div class="status-indicator-large">
            <div class="status-dot online"></div>
            <span>Sistema Operacional</span>
          </div>
        </div>
        <div class="header-right">
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
    </div>

    <!-- View Content -->
    <div class="view-content">
      <!-- Seção: AG-Grid Oficial -->
      <div class="canonika-section">
        <div class="section-header">
          <h3 class="section-title">
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
              :rowData="rowData"
              :columnDefs="colDefs"
              class="ag-theme-canonika"
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
          <h3 class="section-title">
            <i class="fas fa-info-circle section-icon text-primary"></i>
            INFORMAÇÕES DO TEMPLATE
          </h3>
          <p class="section-description">
            Exemplo oficial baseado na documentação AG-Grid Vue Getting Started.
          </p>
        </div>
        <div class="section-content">
          <div class="info-cards-grid">
            <div class="info-card">
              <div class="info-label">Total de Linhas</div>
              <div class="info-value">{{ rowData.length }}</div>
              <div class="info-description">Registros carregados</div>
            </div>
            <div class="info-card">
              <div class="info-label">Colunas</div>
              <div class="info-value">{{ colDefs.length }}</div>
              <div class="info-description">Campos definidos</div>
            </div>
            <div class="info-card">
              <div class="info-label">Versão AG-Grid</div>
              <div class="info-value">v32+</div>
              <div class="info-description">Community Edition</div>
            </div>
            <div class="info-card">
              <div class="info-label">Framework</div>
              <div class="info-value">Vue 3</div>
              <div class="info-description">ag-grid-vue3</div>
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
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

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
            '<span class="badge bg-success">Sim</span>' : 
            '<span class="badge bg-secondary">Não</span>';
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

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.bg-success {
  background-color: #10b981 !important;
  color: white;
}

.bg-secondary {
  background-color: #6b7280 !important;
  color: white;
}
</style>