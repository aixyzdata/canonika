# 🎨 CanonikaViewContent

## 📋 Visão Geral

O **CanonikaViewContent** é um componente padronizado para estruturar o conteúdo das views em todos os serviços da plataforma Canonika. Ele fornece uma estrutura consistente com header, conteúdo principal e footer opcional.

## 🏗️ Estrutura

### **Layout**
```
┌─────────────────────────────────────┐
│ Header da View (opcional)           │
│ ├── Título e Subtítulo             │
│ └── Ações (opcional)               │
├─────────────────────────────────────┤
│ Conteúdo Principal                 │
│ (slot padrão)                      │
├─────────────────────────────────────┤
│ Footer da View (opcional)          │
│ (slot footer)                      │
└─────────────────────────────────────┘
```

### **Componentes**
- **Header**: Título, subtítulo e ações
- **Main Content**: Área principal com scroll
- **Footer**: Área opcional para informações adicionais

## 🎯 Props

### **title** (String)
- **Descrição**: Título principal da view
- **Padrão**: `''`
- **Exemplo**: `"Dashboard"`

### **subtitle** (String)
- **Descrição**: Subtítulo da view
- **Padrão**: `''`
- **Exemplo**: `"Visão geral do sistema"`

### **actions** (Boolean)
- **Descrição**: Mostra área de ações no header
- **Padrão**: `false`
- **Exemplo**: `true`

## 🎨 Slots

### **Slot Padrão**
Conteúdo principal da view.

```vue
<CanonikaViewContent title="Dashboard">
  <div class="dashboard-content">
    <!-- Conteúdo principal aqui -->
  </div>
</CanonikaViewContent>
```

### **Slot Actions**
Ações no header da view.

```vue
<CanonikaViewContent title="Dashboard" :actions="true">
  <template #actions>
    <button class="btn btn-primary">Nova Tarefa</button>
    <button class="btn btn-secondary">Exportar</button>
  </template>
  
  <!-- Conteúdo principal -->
</CanonikaViewContent>
```

### **Slot Footer**
Informações adicionais no footer.

```vue
<CanonikaViewContent title="Dashboard">
  <!-- Conteúdo principal -->
  
  <template #footer>
    <div class="footer-info">
      <p>Última atualização: {{ lastUpdate }}</p>
    </div>
  </template>
</CanonikaViewContent>
```

## 🎨 Estilos

### **Classes CSS**
- `.canonika-view-content`: Container principal
- `.view-header`: Header da view
- `.view-title-section`: Seção do título
- `.view-title`: Título principal
- `.view-subtitle`: Subtítulo
- `.view-actions`: Área de ações
- `.view-main-content`: Conteúdo principal
- `.view-footer`: Footer da view

### **Temas**
- **Light Theme**: Padrão (claro)
- **Dark Theme**: `.dark-theme` (escuro)

### **Responsividade**
- **Desktop**: Layout completo
- **Mobile**: Header em coluna, padding reduzido

## 📱 Responsividade

### **Desktop (> 768px)**
- Header horizontal com título e ações
- Padding: 2rem
- Layout flexível

### **Mobile (≤ 768px)**
- Header em coluna
- Padding: 1rem
- Títulos menores

## 🎯 Casos de Uso

### **1. Dashboard Simples**
```vue
<CanonikaViewContent title="Dashboard" subtitle="Visão geral do sistema">
  <div class="dashboard-grid">
    <!-- Cards e widgets -->
  </div>
</CanonikaViewContent>
```

### **2. View com Ações**
```vue
<CanonikaViewContent title="Usuários" subtitle="Gerenciamento de usuários" :actions="true">
  <template #actions>
    <button class="btn btn-primary">Novo Usuário</button>
    <button class="btn btn-secondary">Importar</button>
  </template>
  
  <div class="users-table">
    <!-- Tabela de usuários -->
  </div>
</CanonikaViewContent>
```

### **3. View com Footer**
```vue
<CanonikaViewContent title="Relatórios" subtitle="Análises e métricas">
  <div class="reports-content">
    <!-- Gráficos e relatórios -->
  </div>
  
  <template #footer>
    <div class="report-info">
      <p>Gerado em: {{ generatedAt }}</p>
      <p>Total de registros: {{ totalRecords }}</p>
    </div>
  </template>
</CanonikaViewContent>
```

### **4. Dark Theme**
```vue
<CanonikaViewContent title="Configurações" class="dark-theme">
  <div class="settings-content">
    <!-- Formulários de configuração -->
  </div>
</CanonikaViewContent>
```

## 🔧 Integração

### **Com MasterPage**
```vue
<CanonikaMasterPage :header-config="headerConfig" :sidebar-config="sidebarConfig">
  <CanonikaViewContent title="Dashboard">
    <!-- Conteúdo da view -->
  </CanonikaViewContent>
</CanonikaMasterPage>
```

### **Com Router**
```vue
<template>
  <CanonikaViewContent title="Home" subtitle="Página inicial">
    <router-view />
  </CanonikaViewContent>
</template>
```

## 📋 Boas Práticas

### **1. Títulos Descritivos**
```vue
<!-- ✅ Bom -->
<CanonikaViewContent title="Dashboard" subtitle="Visão geral do sistema">

<!-- ❌ Evitar -->
<CanonikaViewContent title="Página">
```

### **2. Ações Relevantes**
```vue
<!-- ✅ Bom -->
<template #actions>
  <button class="btn btn-primary">Ação Principal</button>
  <button class="btn btn-secondary">Ação Secundária</button>
</template>
```

### **3. Conteúdo Organizado**
```vue
<!-- ✅ Bom -->
<CanonikaViewContent title="Usuários">
  <div class="users-container">
    <div class="users-filters">
      <!-- Filtros -->
    </div>
    <div class="users-table">
      <!-- Tabela -->
    </div>
  </div>
</CanonikaViewContent>
```

## 🧪 Testes

### **Testes Recomendados**
- Renderização com diferentes props
- Slots funcionando corretamente
- Responsividade em diferentes tamanhos
- Dark theme aplicado corretamente
- Scroll no conteúdo principal

### **Exemplo de Teste**
```javascript
// Teste básico
it('should render with title and subtitle', () => {
  const wrapper = mount(CanonikaViewContent, {
    props: {
      title: 'Test Title',
      subtitle: 'Test Subtitle'
    }
  })
  
  expect(wrapper.find('.view-title').text()).toBe('Test Title')
  expect(wrapper.find('.view-subtitle').text()).toBe('Test Subtitle')
})
```

## 🚀 Performance

### **Otimizações**
- CSS scoped para isolamento
- Flexbox para layout eficiente
- Overflow scroll apenas quando necessário
- Classes condicionais para renderização

### **Bundle Size**
- Componente leve (~5KB)
- Sem dependências externas
- CSS otimizado

---

**🎯 Objetivo**: Fornecer uma estrutura padronizada e consistente para todas as views da plataforma Canonika, garantindo experiência de usuário uniforme e desenvolvimento eficiente. 