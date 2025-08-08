# 🧭 CanonikaSidebar Component

## 📋 Visão Geral

O `CanonikaSidebar` é um componente de navegação lateral colapsável baseado em Bootstrap 5, que fornece navegação consistente e flexível para todos os serviços da plataforma Canonika.

## 🎨 Design e Layout

### **Estrutura Visual**
```
┌─────────────────┐
│ 🏷️ Canonika    │
│    [◀]         │
├─────────────────┤
│ SOLUÇÕES        │
│ 🏠 Home         │
│    Página Inicial│
├─────────────────┤
│ SERVIÇOS        │
│ 📡 WebSocket    │
│    Tempo Real   │
│ 📡 REST API     │
│    HTTP Endpoints│
│ 🔔 Push         │
│    Alertas      │
├─────────────────┤
│ 👤 Admin        │
│    Admin        │
└─────────────────┘
```

### **Estados do Componente**
- **Expandido**: 280px de largura com texto completo
- **Colapsado**: 60px de largura com apenas ícones
- **Mobile**: Overlay na parte inferior da tela

## 🛠️ Funcionalidades

### **Props Disponíveis**
```javascript
{
  brandText: String,           // Texto da marca (default: 'Canonika')
  brandIcon: String,           // Ícone da marca (default: 'fas fa-cube')
  collapsed: Boolean,          // Estado colapsado (default: false)
  user: Object,                // Informações do usuário
  navigationSections: Array    // Seções de navegação
}
```

### **Events Emitidos**
- `toggle-sidebar`: Emitido ao alternar estado do sidebar
- `nav-click`: Emitido ao clicar em item de navegação

### **Exemplo de Uso**
```vue
<CanonikaSidebar
  :brand-text="'Canonika'"
  :brand-icon="'fas fa-cube'"
  :collapsed="sidebarCollapsed"
  :user="{ name: 'Admin', role: 'Admin', initial: 'A' }"
  :navigation-sections="navSections"
  @toggle-sidebar="toggleSidebar"
  @nav-click="handleNavClick"
/>
```

## 🎨 Estilos e CSS

### **Classes Bootstrap 5 Utilizadas**
- `d-flex`: Flexbox layout
- `align-items-center`: Alinhamento vertical
- `gap-3`: Espaçamento entre elementos
- `btn btn-link`: Botão de toggle
- `me-2`: Margin end para ícones

### **Classes Canonika Específicas**
- `.canonika-sidebar`: Container principal
- `.canonika-sidebar-collapsed`: Estado colapsado
- `.canonika-sidebar-header`: Cabeçalho do sidebar
- `.canonika-sidebar-nav`: Área de navegação
- `.canonika-nav-section`: Seção de navegação
- `.canonika-nav-link`: Link de navegação
- `.canonika-nav-active`: Estado ativo do link

### **Variáveis CSS Utilizadas**
```css
--canonika-spacing-xs: 0.25rem;
--canonika-spacing-sm: 0.5rem;
--canonika-spacing-md: 1rem;
--canonika-spacing-lg: 1.5rem;
--canonika-font-size-xs: 0.75rem;
--canonika-font-size-sm: 0.875rem;
--canonika-font-size-lg: 1.125rem;
--canonika-font-size-xl: 1.25rem;
--canonika-transition-fast: 0.15s ease-in-out;
--canonika-transition-normal: 0.3s ease-in-out;
--canonika-border-radius-sm: 0.25rem;
--canonika-border-radius-md: 0.5rem;
--canonika-z-dropdown: 1000;
--canonika-z-fixed: 1030;
```

## 🔧 Animações e Transições

### **Transição de Largura**
- **Duração**: 0.3s ease-in-out
- **Propriedade**: width
- **Estados**: 280px ↔ 60px

### **Hover Effects**
- **Links**: Background com opacidade
- **Botões**: Mudança de cor
- **Transição**: 0.15s ease-in-out

### **Responsividade**
- **Desktop**: Sidebar lateral fixo
- **Mobile**: Overlay na parte inferior
- **Breakpoint**: 768px

## 📱 Responsividade

### **Desktop (> 768px)**
- Sidebar lateral fixo
- Largura: 280px (expandido) / 60px (colapsado)
- Altura: calc(100vh - 60px)
- Scroll interno na área de navegação

### **Mobile (≤ 768px)**
- Sidebar como overlay
- Posição: fixed bottom
- Largura: 100%
- Altura: 80px
- Navegação horizontal

## 🎯 Integração Bootstrap 5

### **Sistema de Grid**
- Flexbox para layout principal
- Classes utilitárias para espaçamento
- Sistema de breakpoints responsivo

### **Componentes Bootstrap**
- Botões com classes `.btn`
- Flexbox com `.d-flex`
- Espaçamento com `.gap-*`
- Alinhamento com `.align-items-*`

### **Customizações Canonika**
- Cores personalizadas via variáveis CSS
- Gradientes específicos da marca
- Animações customizadas
- Z-index padronizado

## 🔍 Acessibilidade

### **Semântica HTML**
- Tag `<nav>` para navegação
- Lista `<ul>` para itens de menu
- Links `<a>` para navegação
- Botões com `aria-label`

### **Navegação por Teclado**
- Tab order lógico
- Estados de foco visíveis
- Atalhos de teclado para toggle
- Escape para fechar (mobile)

## 🧪 Testes Recomendados

### **Funcionalidade**
- [ ] Toggle do sidebar
- [ ] Navegação entre itens
- [ ] Estados ativos
- [ ] Responsividade

### **Acessibilidade**
- [ ] Navegação por teclado
- [ ] Estados de foco
- [ ] Screen readers
- [ ] Contraste de cores

### **Performance**
- [ ] Transições suaves
- [ ] Renderização eficiente
- [ ] Memória otimizada
- [ ] Scroll performance

## 📚 Exemplos de Implementação

### **Configuração Básica**
```vue
<template>
  <CanonikaSidebar
    :brand-text="'Canonika'"
    :brand-icon="'fas fa-cube'"
    :collapsed="sidebarCollapsed"
    :user="userInfo"
    :navigation-sections="navSections"
    @toggle-sidebar="toggleSidebar"
    @nav-click="handleNavClick"
  />
</template>

<script>
export default {
  data() {
    return {
      sidebarCollapsed: false,
      userInfo: {
        name: 'Administrador',
        role: 'Admin',
        initial: 'A'
      },
      navSections: [
        {
          id: 'solutions',
          title: 'SOLUÇÕES',
          items: [
            {
              id: 'home',
              title: 'Home',
              subtitle: 'Página Inicial',
              icon: 'fas fa-home',
              href: '#',
              active: true
            }
          ]
        }
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    handleNavClick(item) {
      console.log('Navegação:', item)
    }
  }
}
</script>
```

### **Configuração Avançada**
```vue
<template>
  <CanonikaSidebar
    :brand-text="sidebarConfig.brandText"
    :brand-icon="sidebarConfig.brandIcon"
    :collapsed="sidebarCollapsed"
    :user="sidebarConfig.user"
    :navigation-sections="sidebarConfig.navigationSections"
    @toggle-sidebar="handleSidebarToggle"
    @nav-click="handleNavClick"
  />
</template>

<script>
export default {
  data() {
    return {
      sidebarCollapsed: false,
      sidebarConfig: {
        brandText: 'Canonika',
        brandIcon: 'fas fa-cube',
        user: {
          name: 'Admin Complex',
          role: 'Super Admin',
          initial: 'C'
        },
        navigationSections: [
          {
            id: 'solutions',
            title: 'SOLUÇÕES',
            items: [
              {
                id: 'home',
                title: 'Home',
                subtitle: 'Página Inicial',
                icon: 'fas fa-home',
                href: '#',
                active: true
              }
            ]
          },
          {
            id: 'services',
            title: 'SERVIÇOS',
            items: [
              {
                id: 'websocket',
                title: 'WebSocket',
                subtitle: 'Tempo Real',
                icon: 'fas fa-broadcast-tower',
                href: '#'
              },
              {
                id: 'api',
                title: 'REST API',
                subtitle: 'HTTP Endpoints',
                icon: 'fas fa-satellite',
                href: '#'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    handleSidebarToggle(collapsed) {
      this.sidebarCollapsed = collapsed
      this.$emit('sidebar-toggle', collapsed)
    },
    handleNavClick(item) {
      this.$emit('nav-click', item)
    }
  }
}
</script>
```

## 🚀 Melhorias Futuras

### **Funcionalidades Planejadas**
- [ ] Submenus expansíveis
- [ ] Busca em tempo real
- [ ] Favoritos personalizáveis
- [ ] Histórico de navegação

### **Otimizações Técnicas**
- [ ] Virtual scrolling para listas grandes
- [ ] Lazy loading de ícones
- [ ] Memoização de seções
- [ ] Service workers para cache

---

**🎯 Objetivo**: Fornecer uma navegação lateral consistente, acessível e performática para todos os serviços da plataforma Canonika, seguindo os padrões Bootstrap 5. 