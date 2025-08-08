# 🎯 CanonikaHeader Component

## 📋 Visão Geral

O `CanonikaHeader` é um componente de cabeçalho reutilizável baseado em Bootstrap 5, que fornece uma interface consistente para todos os serviços da plataforma Canonika.

## 🎨 Design e Layout

### **Estrutura Visual**
```
┌─────────────────────────────────────────────────────────────┐
│ 🏷️ Logo (Hexágono Animado)  CANONIKA  PLATFORM           │
│                                                             │
│ 👤 Admin  [🚪 Sair]  ● ONLINE                             │
└─────────────────────────────────────────────────────────────┘
```

### **Elementos Principais**
- **Logo Animada**: Hexágono com rotação contínua e efeito pulse
- **Informações do Usuário**: Avatar circular com inicial e nome
- **Botão de Logout**: Estilo Bootstrap 5 com hover effects
- **Status do Sistema**: Indicador visual com animação

## 🛠️ Funcionalidades

### **Props Disponíveis**
```javascript
{
  logoText: String,        // Texto da logo (default: 'CANONIKA')
  logoSubtitle: String,    // Subtítulo da logo (default: 'PLATFORM')
  user: Object,            // Informações do usuário
  systemStatus: String,    // Status do sistema (default: 'ONLINE')
  isOnline: Boolean        // Status online/offline (default: true)
}
```

### **Events Emitidos**
- `logout`: Emitido quando o usuário clica no botão "Sair"

### **Exemplo de Uso**
```vue
<CanonikaHeader
  :logo-text="'CANONIKA'"
  :logo-subtitle="'SERVICE'"
  :user="{ name: 'Admin', initial: 'A' }"
  :system-status="'ONLINE'"
  :is-online="true"
  @logout="handleLogout"
/>
```

## 🎨 Estilos e CSS

### **Classes Bootstrap 5 Utilizadas**
- `d-flex`: Flexbox layout
- `justify-content-between`: Espaçamento entre elementos
- `align-items-center`: Alinhamento vertical
- `gap-3`: Espaçamento entre elementos
- `btn btn-canonika-danger`: Botão de logout customizado

### **Classes Canonika Específicas**
- `.canonika-header`: Container principal
- `.canonika-logo`: Container da logo
- `.canonika-logo-hexagon`: Hexágono animado
- `.canonika-logo-pulse`: Efeito pulse
- `.canonika-user-avatar`: Avatar do usuário
- `.canonika-status-indicator`: Indicador de status

### **Variáveis CSS Utilizadas**
```css
--canonika-gradient-header: linear-gradient(135deg, #1e293b 0%, #334155 100%);
--canonika-gradient-primary: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
--canonika-spacing-sm: 0.5rem;
--canonika-spacing-md: 1rem;
--canonika-font-size-sm: 0.875rem;
--canonika-font-size-xl: 1.25rem;
--canonika-transition-normal: 0.3s ease-in-out;
--canonika-z-fixed: 1030;
```

## 🔧 Animações

### **Logo Hexágono**
- **Rotação**: 10s linear infinite
- **Efeito**: Rotação contínua do hexágono

### **Logo Pulse**
- **Duração**: 2s ease-in-out infinite
- **Efeito**: Escala e opacidade pulsante

### **Status Indicator**
- **Online**: Animação pulse contínua
- **Offline**: Cor vermelha estática

## 📱 Responsividade

### **Desktop (> 768px)**
- Layout completo com todos os elementos visíveis
- Espaçamento otimizado
- Animações ativas

### **Mobile (≤ 768px)**
- Nome do usuário oculto
- Texto do botão logout oculto
- Layout compacto
- Animações reduzidas

## 🎯 Integração Bootstrap 5

### **Sistema de Grid**
- Utiliza flexbox do Bootstrap 5
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
- Tag `<header>` para estrutura semântica
- Botões com `aria-label` apropriados
- Estados de foco visíveis

### **Navegação por Teclado**
- Tab order lógico
- Estados de foco destacados
- Atalhos de teclado suportados

## 🧪 Testes Recomendados

### **Funcionalidade**
- [ ] Renderização correta dos props
- [ ] Emissão de eventos
- [ ] Responsividade em diferentes telas
- [ ] Animações funcionando

### **Acessibilidade**
- [ ] Navegação por teclado
- [ ] Estados de foco
- [ ] Contraste de cores
- [ ] Screen readers

### **Performance**
- [ ] Animações suaves
- [ ] Carregamento rápido
- [ ] Memória otimizada
- [ ] Re-renderização eficiente

## 📚 Exemplos de Implementação

### **Serviço Simples**
```vue
<template>
  <CanonikaHeader
    :logo-text="'CANONIKA'"
    :logo-subtitle="'SERVICE'"
    :user="userInfo"
    @logout="handleLogout"
  />
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        name: 'Administrador',
        initial: 'A'
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
  <CanonikaHeader
    :logo-text="headerConfig.logoText"
    :logo-subtitle="headerConfig.logoSubtitle"
    :user="headerConfig.user"
    :system-status="headerConfig.systemStatus"
    :is-online="headerConfig.isOnline"
    @logout="handleLogout"
  />
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
      }
    }
  }
}
</script>
```

## 🚀 Melhorias Futuras

### **Funcionalidades Planejadas**
- [ ] Notificações em tempo real
- [ ] Menu de usuário dropdown
- [ ] Temas dinâmicos
- [ ] Breadcrumbs integrados

### **Otimizações Técnicas**
- [ ] Lazy loading de animações
- [ ] Memoização de props
- [ ] Virtual scrolling para listas
- [ ] Service workers para cache

---

**🎯 Objetivo**: Fornecer um cabeçalho consistente, acessível e performático para todos os serviços da plataforma Canonika, seguindo os padrões Bootstrap 5. 