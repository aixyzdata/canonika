# 🏗️ CanonikaMasterPage Component

## 📋 Visão Geral

O `CanonikaMasterPage` é o componente principal de layout que integra o Header e Sidebar, fornecendo uma estrutura consistente para todos os serviços da plataforma Canonika, baseado em Bootstrap 5.

## 🎨 Design e Layout

### **Estrutura Visual**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 CanonikaHeader (60px)                                  │
├─────────────────┬─────────────────────────────────────────┤
│ 🧭 CanonikaSidebar │                                     │
│ (280px/60px)    │ 🎨 Conteúdo Principal                 │
│                 │ (Flex)                                 │
│                 │                                         │
│                 │ <slot>                                  │
│                 │                                         │
└─────────────────┴─────────────────────────────────────────┘
```

### **Layout Responsivo**
- **Desktop**: Header + Sidebar + Main Content
- **Tablet**: Header + Sidebar Colapsado + Main Content
- **Mobile**: Header + Sidebar Overlay + Main Content

## 🛠️ Funcionalidades

### **Props Disponíveis**
```javascript
{
  headerConfig: Object,        // Configuração do header
  sidebarConfig: Object,       // Configuração do sidebar
  initialSidebarCollapsed: Boolean  // Estado inicial do sidebar
}
```

### **Events Emitidos**
- `logout`: Emitido quando o usuário faz logout
- `nav-click`: Emitido ao clicar em item de navegação
- `sidebar-toggle`: Emitido ao alternar sidebar

### **Exemplo de Uso**
```vue
<CanonikaMasterPage
  :header-config="headerConfig"
  :sidebar-config="sidebarConfig"
  @logout="handleLogout"
  @nav-click="handleNavClick"
  @sidebar-toggle="handleSidebarToggle"
>
  <!-- Conteúdo específico do serviço -->
  <div class="service-content">
    <h1>Meu Serviço</h1>
    <p>Conteúdo específico</p>
  </div>
</CanonikaMasterPage>
```

## 🎨 Estilos e CSS

### **Classes Bootstrap 5 Utilizadas**
- `d-flex`: Flexbox layout principal
- `justify-content-between`: Espaçamento no header
- `align-items-center`: Alinhamento vertical
- `gap-3`: Espaçamento entre elementos

### **Classes Canonika Específicas**
- `.canonika-app`: Container principal da aplicação
- `.canonika-layout`: Layout flexbox principal
- `.canonika-main`: Área de conteúdo principal
- `.canonika-main-expanded`: Estado quando sidebar colapsado
- `.canonika-content`: Container do conteúdo

### **Variáveis CSS Utilizadas**
```css
--canonika-gradient-dark: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
--canonika-light: #f8fafc;
--canonika-dark: #0f172a;
--canonika-spacing-xl: 2rem;
--canonika-spacing-md: 1rem;
--canonika-transition-normal: 0.3s ease-in-out;
--canonika-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

## 🔧 Integração de Componentes

### **CanonikaHeader**
- Posição: Fixed top
- Altura: 60px
- Z-index: 1030
- Background: Gradiente header

### **CanonikaSidebar**
- Posição: Fixed left (desktop) / Fixed bottom (mobile)
- Largura: 280px (expandido) / 60px (colapsado)
- Altura: calc(100vh - 60px)
- Z-index: 1000

### **Main Content**
- Posição: Flex 1
- Padding: 2rem (desktop) / 1rem (mobile)
- Background: Light
- Color: Dark
- Overflow: Auto

## 📱 Responsividade

### **Desktop (> 768px)**
- Layout horizontal com sidebar lateral
- Header fixo no topo
- Conteúdo principal com padding lateral
- Sidebar colapsável

### **Tablet (768px - 1024px)**
- Sidebar colapsado por padrão
- Conteúdo expandido
- Header responsivo

### **Mobile (≤ 768px)**
- Sidebar como overlay na parte inferior
- Header compacto
- Conteúdo com padding reduzido
- Navegação otimizada para touch

## 🎯 Integração Bootstrap 5

### **Sistema de Grid**
- Flexbox para layout principal
- Classes utilitárias para espaçamento
- Sistema de breakpoints responsivo

### **Componentes Bootstrap**
- Flexbox com `.d-flex`
- Espaçamento com `.gap-*`
- Alinhamento com `.align-items-*`
- Responsividade com media queries

### **Customizações Canonika**
- Cores personalizadas via variáveis CSS
- Gradientes específicos da marca
- Animações customizadas
- Z-index padronizado

## 🔍 Acessibilidade

### **Semântica HTML**
- Tag `<main>` para conteúdo principal
- Estrutura semântica clara
- Landmarks apropriados
- Navegação lógica

### **Navegação por Teclado**
- Tab order lógico
- Estados de foco visíveis
- Atalhos de teclado
- Escape para fechar modais

## 🧪 Testes Recomendados

### **Funcionalidade**
- [ ] Renderização dos componentes filhos
- [ ] Emissão de eventos
- [ ] Responsividade em diferentes telas
- [ ] Integração com Bootstrap 5

### **Acessibilidade**
- [ ] Navegação por teclado
- [ ] Estados de foco
- [ ] Screen readers
- [ ] Contraste de cores

### **Performance**
- [ ] Renderização eficiente
- [ ] Memória otimizada
- [ ] Carregamento rápido
- [ ] Transições suaves

## 📚 Exemplos de Implementação

### **Serviço Simples**
```vue
<template>
  <CanonikaMasterPage
    :header-config="headerConfig"
    :sidebar-config="sidebarConfig"
    @logout="handleLogout"
  >
    <div class="service-content">
      <h1>🚀 Meu Serviço</h1>
      <p>Conteúdo específico do serviço</p>
      
      <div class="row">
        <div class="col-md-6">
          <div class="card-canonika">
            <div class="card-body">
              <h5 class="card-title">Funcionalidade 1</h5>
              <p class="card-text">Descrição da funcionalidade</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card-canonika">
            <div class="card-body">
              <h5 class="card-title">Funcionalidade 2</h5>
              <p class="card-text">Descrição da funcionalidade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CanonikaMasterPage>
</template>

<script>
export default {
  data() {
    return {
      headerConfig: {
        logoText: 'CANONIKA',
        logoSubtitle: 'SERVICE',
        user: {
          name: 'Administrador',
          initial: 'A'
        },
        systemStatus: 'ONLINE',
        isOnline: true
      },
      sidebarConfig: {
        brandText: 'Canonika',
        brandIcon: 'fas fa-cube',
        user: {
          name: 'Admin',
          role: 'Admin',
          initial: 'A'
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
          }
        ]
      }
    }
  },
  methods: {
    handleLogout() {
      // Lógica de logout
    }
  }
}
</script>
```

### **Serviço Complexo**
```vue
<template>
  <CanonikaMasterPage
    :header-config="headerConfig"
    :sidebar-config="sidebarConfig"
    @logout="handleLogout"
    @nav-click="handleNavClick"
    @sidebar-toggle="handleSidebarToggle"
  >
    <router-view />
  </CanonikaMasterPage>
</template>

<script>
export default {
  data() {
    return {
      headerConfig: {
        logoText: 'CANONIKA',
        logoSubtitle: 'COMPLEX SERVICE',
        user: {
          name: 'Admin Complex',
          initial: 'C'
        },
        systemStatus: 'ONLINE',
        isOnline: true
      },
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
    handleLogout() {
      this.$emit('logout')
    },
    handleNavClick(item) {
      this.$emit('nav-click', item)
    },
    handleSidebarToggle(collapsed) {
      this.$emit('sidebar-toggle', collapsed)
    }
  }
}
</script>
```

## 🚀 Melhorias Futuras

### **Funcionalidades Planejadas**
- [ ] Temas dinâmicos
- [ ] Layouts personalizáveis
- [ ] Breadcrumbs integrados
- [ ] Notificações em tempo real

### **Otimizações Técnicas**
- [ ] Lazy loading de componentes
- [ ] Memoização de props
- [ ] Virtual scrolling
- [ ] Service workers para cache

---

**🎯 Objetivo**: Fornecer um layout principal consistente, acessível e performático para todos os serviços da plataforma Canonika, seguindo os padrões Bootstrap 5. 