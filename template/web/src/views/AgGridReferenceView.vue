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
        <div class="status-dot online"></div>
        <span>Sistema Operacional</span>
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
          <!-- Theme Selector -->
          <div class="theme-selector">
            <label for="theme-select">Tema:</label>
            <select 
              id="theme-select" 
              v-model="theme" 
              class="theme-select"
            >
              <option v-for="(themeValue, themeName) in themes" :key="themeName" :value="themeValue">
                {{ themeName }}
              </option>
            </select>
          </div>
          
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
import { 
  AllCommunityModule, 
  ModuleRegistry,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz
} from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default {
  name: 'AgGridReferenceView',
  components: {
    AgGridVue, // Add Vue Data Grid component
  },
  setup() {
    // Theme selector
    const theme = ref(themeQuartz);
    const themes = {
      themeQuartz,
      themeBalham,
      themeMaterial,
      themeAlpine,
    };

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
          return params.value ? '✅ Sim' : '❌ Não';
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
      theme,
      themes,
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

.theme-selector {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-selector label {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.theme-select {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.3);
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 150px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-select:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(15, 23, 42, 0.9);
}

.theme-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.theme-select option {
  background: rgba(15, 23, 42, 0.95);
  color: #e2e8f0;
  padding: 0.5rem;
}
</style>