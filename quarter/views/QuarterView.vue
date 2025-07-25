<template>
  <div class="quarter-view">
    <div class="view-header">
      <div class="view-status">
        <div class="status-indicator online"></div>
        <span>ONLINE</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData()" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="addUser()" class="action-btn primary">
          <i class="fas fa-plus"></i>
          Novo Usuário
        </button>
        <button @click="exportData()" class="action-btn">
          <i class="fas fa-download"></i>
          Exportar
        </button>
      </div>
    </div>
    
    <div class="view-content">
      <!-- Estatísticas Rápidas -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">Total de Usuários</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.newToday }}</div>
            <div class="stat-label">Novos Hoje</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.activeUsers }}</div>
            <div class="stat-label">Usuários Ativos</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.admins }}</div>
            <div class="stat-label">Administradores</div>
          </div>
        </div>
      </div>

      <!-- AG Grid Container -->
      <div class="grid-container">
        <div class="grid-header">
          <h3>Gestão de Usuários</h3>
          <div class="grid-actions">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                v-model="searchText" 
                @input="onSearchChange"
                placeholder="Buscar usuários..."
                class="search-input"
              />
            </div>
            <button @click="refreshGrid()" class="grid-action-btn">
              <i class="fas fa-sync-alt"></i>
            </button>
            <button @click="exportGrid()" class="grid-action-btn">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
        
        <div class="ag-theme-alpine-dark" style="height: 600px; width: 100%;">
          <ag-grid-vue
            :columnDefs="columnDefs"
            :rowData="rowData"
            :defaultColDef="defaultColDef"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            @row-clicked="onRowClicked"
            @cell-value-changed="onCellValueChanged"
            class="ag-grid-custom"
          />
        </div>
      </div>
    </div>

    <!-- Modal para Adicionar/Editar Usuário -->
    <div v-if="showUserModal" class="modal-overlay" @click="closeUserModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingUser ? 'Editar Usuário' : 'Novo Usuário' }}</h3>
          <button @click="closeUserModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nome</label>
            <input v-model="userForm.name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="userForm.email" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label>Função</label>
            <select v-model="userForm.role" class="form-input">
              <option value="user">Usuário</option>
              <option value="manager">Gerente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="userForm.status" class="form-input">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="suspended">Suspenso</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeUserModal" class="btn-secondary">Cancelar</button>
          <button @click="saveUser" class="btn-primary">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

export default {
  name: 'QuarterView',
  components: {
    AgGridVue
  },
  data() {
    return {
      stats: {
        totalUsers: 1247,
        newToday: 89,
        activeUsers: 1156,
        admins: 12
      },
      searchText: '',
      showUserModal: false,
      editingUser: null,
      userForm: {
        name: '',
        email: '',
        role: 'user',
        status: 'active'
      },
      gridApi: null,
      columnDefs: [
        { 
          field: 'id', 
          headerName: 'ID', 
          width: 80,
          sortable: true,
          filter: true
        },
        { 
          field: 'name', 
          headerName: 'Nome', 
          width: 200,
          sortable: true,
          filter: true,
          editable: true
        },
        { 
          field: 'email', 
          headerName: 'Email', 
          width: 250,
          sortable: true,
          filter: true,
          editable: true
        },
        { 
          field: 'role', 
          headerName: 'Função', 
          width: 150,
          sortable: true,
          filter: true,
          cellRenderer: this.roleRenderer
        },
        { 
          field: 'status', 
          headerName: 'Status', 
          width: 120,
          sortable: true,
          filter: true,
          cellRenderer: this.statusRenderer
        },
        { 
          field: 'lastLogin', 
          headerName: 'Último Login', 
          width: 180,
          sortable: true,
          filter: true
        },
        { 
          field: 'createdAt', 
          headerName: 'Criado em', 
          width: 180,
          sortable: true,
          filter: true
        },
        {
          headerName: 'Ações',
          width: 120,
          cellRenderer: this.actionsRenderer,
          sortable: false,
          filter: false
        }
      ],
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
      },
      gridOptions: {
        pagination: true,
        paginationPageSize: 20,
        rowSelection: 'single',
        animateRows: true
      },
      rowData: []
    }
  },
  mounted() {
    console.log('QuarterView carregado com sucesso!')
    this.loadUsers()
  },
  methods: {
    loadUsers() {
      // Simular dados de usuários
      this.rowData = [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@empresa.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-07-23 14:30',
          createdAt: '2024-01-15 09:00'
        },
        {
          id: 2,
          name: 'Maria Santos',
          email: 'maria@empresa.com',
          role: 'manager',
          status: 'active',
          lastLogin: '2024-07-23 12:15',
          createdAt: '2024-02-20 10:30'
        },
        {
          id: 3,
          name: 'Pedro Costa',
          email: 'pedro@empresa.com',
          role: 'user',
          status: 'active',
          lastLogin: '2024-07-22 16:45',
          createdAt: '2024-03-10 14:20'
        },
        {
          id: 4,
          name: 'Ana Oliveira',
          email: 'ana@empresa.com',
          role: 'user',
          status: 'inactive',
          lastLogin: '2024-07-15 11:20',
          createdAt: '2024-04-05 08:45'
        },
        {
          id: 5,
          name: 'Carlos Mendes',
          email: 'carlos@empresa.com',
          role: 'manager',
          status: 'active',
          lastLogin: '2024-07-23 09:30',
          createdAt: '2024-05-12 16:00'
        }
      ]
    },
    
    onGridReady(params) {
      this.gridApi = params.api
      this.gridApi.sizeColumnsToFit()
    },
    
    onRowClicked(event) {
      console.log('Row clicked:', event.data)
    },
    
    onCellValueChanged(event) {
      console.log('Cell value changed:', event)
    },
    
    onSearchChange() {
      if (this.gridApi) {
        this.gridApi.setQuickFilter(this.searchText)
      }
    },
    
    refreshGrid() {
      this.loadUsers()
      if (this.gridApi) {
        this.gridApi.refreshCells()
      }
    },
    
    exportGrid() {
      if (this.gridApi) {
        this.gridApi.exportDataAsCsv()
      }
    },
    
    addUser() {
      this.editingUser = null
      this.userForm = {
        name: '',
        email: '',
        role: 'user',
        status: 'active'
      }
      this.showUserModal = true
    },
    
    editUser(user) {
      this.editingUser = user
      this.userForm = { ...user }
      this.showUserModal = true
    },
    
    saveUser() {
      if (this.editingUser) {
        // Editar usuário existente
        const index = this.rowData.findIndex(u => u.id === this.editingUser.id)
        if (index !== -1) {
          this.rowData[index] = { ...this.rowData[index], ...this.userForm }
        }
      } else {
        // Adicionar novo usuário
        const newUser = {
          id: this.rowData.length + 1,
          ...this.userForm,
          lastLogin: '-',
          createdAt: new Date().toLocaleString()
        }
        this.rowData.unshift(newUser)
      }
      
      this.closeUserModal()
      this.refreshGrid()
    },
    
    closeUserModal() {
      this.showUserModal = false
      this.editingUser = null
    },
    
    deleteUser(userId) {
      this.rowData = this.rowData.filter(u => u.id !== userId)
      this.refreshGrid()
    },
    
    roleRenderer(params) {
      const roles = {
        admin: { text: 'Administrador', class: 'role-admin' },
        manager: { text: 'Gerente', class: 'role-manager' },
        user: { text: 'Usuário', class: 'role-user' }
      }
      const role = roles[params.value] || roles.user
      return `<span class="role-badge ${role.class}">${role.text}</span>`
    },
    
    statusRenderer(params) {
      const statuses = {
        active: { text: 'Ativo', class: 'status-active' },
        inactive: { text: 'Inativo', class: 'status-inactive' },
        suspended: { text: 'Suspenso', class: 'status-suspended' }
      }
      const status = statuses[params.value] || statuses.inactive
      return `<span class="status-badge ${status.class}">${status.text}</span>`
    },
    
    actionsRenderer(params) {
      return `
        <div class="grid-actions-cell">
          <button onclick="window.editUser(${params.data.id})" class="action-btn-small">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="window.deleteUser(${params.data.id})" class="action-btn-small delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `
    },
    
    refreshData() {
      console.log('Atualizando dados do Quarter...')
      this.loadUsers()
    },
    
    exportData() {
      console.log('Exportando dados...')
      this.exportGrid()
    }
  }
}
</script>

<style scoped>
.quarter-view {
  height: 100%;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 1rem;
  border: 1px solid #475569;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.view-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.view-content {
  height: calc(100vh - 250px);
  overflow-y: auto;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* Grid Container */
.grid-container {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 1.5rem;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.grid-header h3 {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.grid-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
}

.search-input {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  width: 250px;
}

.search-input::placeholder {
  color: #64748b;
}

.grid-action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.grid-action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
}

/* AG Grid Custom Styles */
.ag-grid-custom {
  --ag-background-color: transparent;
  --ag-header-background-color: rgba(15, 23, 42, 0.8);
  --ag-odd-row-background-color: rgba(15, 23, 42, 0.3);
  --ag-row-hover-color: rgba(59, 130, 246, 0.1);
  --ag-selected-row-background-color: rgba(59, 130, 246, 0.2);
  --ag-text-color: #e2e8f0;
  --ag-header-foreground-color: #94a3b8;
  --ag-border-color: #475569;
  --ag-input-border-color: #475569;
  --ag-input-focus-border-color: #3b82f6;
  --ag-range-selection-border-color: #3b82f6;
  --ag-range-selection-background-color: rgba(59, 130, 246, 0.1);
}

/* Role and Status Badges */
.role-badge, .status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-admin {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.role-manager {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.role-user {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.status-active {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status-inactive {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.status-suspended {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Grid Actions Cell */
.grid-actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn-small {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.75rem;
}

.action-btn-small:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.1);
}

.action-btn-small.delete {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.action-btn-small.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  color: #e2e8f0;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: #e2e8f0;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-secondary {
  background: rgba(107, 114, 128, 0.1);
  border: 1px solid rgba(107, 114, 128, 0.2);
  color: #6b7280;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(107, 114, 128, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: 1px solid #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}
</style> 
 
 