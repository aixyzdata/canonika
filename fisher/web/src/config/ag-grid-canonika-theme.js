// =============================================================================
// AG-GRID CANONIKA THEME - CONFIGURAÇÃO OFICIAL
// =============================================================================
// Configuração do tema personalizado Canonika para AG-Grid
// Tema oficial do projeto Canonika

import { 
  themeQuartz,
  colorSchemeDarkBlue,
  iconSetQuartzRegular
} from 'ag-grid-community';

// =============================================================================
// CANONIKA AG-GRID THEME - TEMA OFICIAL
// =============================================================================

export const canonikaAgGridTheme = themeQuartz
  .withPart(colorSchemeDarkBlue)
  .withPart(iconSetQuartzRegular)
  .withParams({
    // Canonika Design System Colors
    backgroundColor: '#0f172a', // $dark-bg
    foregroundColor: '#e2e8f0', // $dark-text
    accentColor: '#3b82f6', // $primary-color
    
    // Chrome and UI Colors
    chromeBackgroundColor: '#1e293b', // $dark-surface
    borderColor: '#475569', // $dark-border
    headerBackgroundColor: '#1e293b', // $dark-surface
    headerTextColor: '#e2e8f0', // $dark-text
    
    // Text Colors
    textColor: '#e2e8f0', // $dark-text
    cellTextColor: '#e2e8f0', // $dark-text
    headerTextColor: '#e2e8f0', // $dark-text
    
    // Row Colors
    oddRowBackgroundColor: 'rgba(30, 41, 59, 0.5)', // $dark-surface with transparency
    evenRowBackgroundColor: 'rgba(15, 23, 42, 0.8)', // $dark-bg with transparency
    rowHoverBackgroundColor: 'rgba(59, 130, 246, 0.1)', // $primary-color with transparency
    
    // Selection Colors
    selectedRowBackgroundColor: 'rgba(59, 130, 246, 0.2)', // $primary-color with transparency
    rangeSelectionBackgroundColor: 'rgba(59, 130, 246, 0.15)', // $primary-color with transparency
    
    // Input and Control Colors
    inputBackgroundColor: '#1e293b', // $dark-surface
    inputBorderColor: '#475569', // $dark-border
    inputTextColor: '#e2e8f0', // $dark-text
    
    // Button Colors
    buttonBackgroundColor: 'rgba(59, 130, 246, 0.2)', // $primary-color with transparency
    buttonTextColor: '#3b82f6', // $primary-color
    buttonBorderColor: 'rgba(59, 130, 246, 0.3)', // $primary-color with transparency
    
    // Pagination Colors
    paginationBackgroundColor: '#1e293b', // $dark-surface
    paginationTextColor: '#e2e8f0', // $dark-text
    
    // Filter and Menu Colors
    menuBackgroundColor: '#1e293b', // $dark-surface
    menuTextColor: '#e2e8f0', // $dark-text
    menuBorderColor: '#475569', // $dark-border
    
    // Tool Panel Colors
    toolPanelBackgroundColor: '#1e293b', // $dark-surface
    toolPanelTextColor: '#e2e8f0', // $dark-text
    
    // Status Colors
    successColor: '#10b981', // $success
    warningColor: '#f59e0b', // $warning
    errorColor: '#ef4444', // $error
    infoColor: '#3b82f6', // $info
  });

// =============================================================================
// CANONIKA AG-GRID CELL RENDERERS - CONFIGURAÇÃO
// =============================================================================

export const canonikaAgGridCellRenderers = {
  // Boolean renderer with Canonika badges
  boolean: (params) => {
    return params.value ? 
      '<span class="canonika-ag-badge canonika-ag-badge-success">✅ Sim</span>' : 
      '<span class="canonika-ag-badge canonika-ag-badge-secondary">❌ Não</span>';
  },
  
  // Status renderer with Canonika badges
  status: (params) => {
    const status = params.value?.toLowerCase();
    switch (status) {
      case 'active':
      case 'online':
      case 'success':
        return '<span class="canonika-ag-badge canonika-ag-badge-success">🟢 Ativo</span>';
      case 'inactive':
      case 'offline':
      case 'error':
        return '<span class="canonika-ag-badge canonika-ag-badge-error">🔴 Inativo</span>';
      case 'warning':
      case 'pending':
        return '<span class="canonika-ag-badge canonika-ag-badge-warning">🟡 Pendente</span>';
      default:
        return '<span class="canonika-ag-badge canonika-ag-badge-secondary">⚪ Desconhecido</span>';
    }
  },
  
  // Currency renderer with Canonika formatting
  currency: (params) => {
    if (params.value == null) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(params.value);
  },
  
  // Date renderer with Canonika formatting
  date: (params) => {
    if (params.value == null) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(params.value));
  },
  
  // Number renderer with Canonika formatting
  number: (params) => {
    if (params.value == null) return '';
    return new Intl.NumberFormat('pt-BR').format(params.value);
  }
};

// =============================================================================
// CANONIKA AG-GRID DEFAULT CONFIG - CONFIGURAÇÃO
// =============================================================================

export const canonikaAgGridDefaultConfig = {
  // Theme
  theme: canonikaAgGridTheme,
  
  // Default column definition
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  },
  
  // Pagination
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 25, 50, 100],
  
  // Row selection
  rowSelection: 'single',
  
  // Row height
  rowHeight: 48,
  headerHeight: 48,
  
  // Animations
  animateRows: true,
  
  // Tooltips
  tooltipShowDelay: 500,
  
  // Sidebar
  sideBar: {
    toolPanels: ['columns', 'filters'],
    defaultToolPanel: 'columns'
  },
  
  // Status bar
  statusBar: {
    statusPanels: [
      { statusPanel: 'agTotalRowCountComponent', align: 'left' },
      { statusPanel: 'agSelectedRowCountComponent', align: 'center' },
      { statusPanel: 'agAggregationComponent', align: 'right' }
    ]
  }
};

// =============================================================================
// EXPORT DEFAULT - CONFIGURAÇÃO PADRÃO
// =============================================================================

export default {
  theme: canonikaAgGridTheme,
  cellRenderers: canonikaAgGridCellRenderers,
  defaultConfig: canonikaAgGridDefaultConfig
}; 