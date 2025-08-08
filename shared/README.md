# 🧩 Canonika Shared Components

## 📋 Visão Geral

O diretório `shared` contém todos os componentes reutilizáveis e recursos compartilhados da plataforma Canonika, garantindo consistência visual e funcional em todos os serviços.

## 🏗️ Estrutura

```
shared/
├── components/           # Componentes Vue.js reutilizáveis
│   ├── Header.vue       # Cabeçalho da aplicação
│   ├── Sidebar.vue      # Navegação lateral
│   └── MasterPage.vue   # Layout principal integrado
├── styles/              # Estilos CSS compartilhados
│   ├── header.css       # Estilos do header
│   ├── sidebar.css      # Estilos do sidebar
│   ├── masterpage.css   # Estilos da master page
│   ├── canonika-theme.css    # Tema principal
│   ├── canonika-icons.css    # Ícones
│   └── canonika-view.css     # Estilos de views
├── services/            # Serviços JavaScript compartilhados
├── config/             # Configurações compartilhadas
└── templates/          # Templates base
```

## 🧩 Componentes

### **CanonikaHeader**
Componente de cabeçalho reutilizável com logo animada e informações do usuário.

**Props:**
- `logoText` (String): Texto da logo
- `logoSubtitle` (String): Subtítulo da logo
- `user` (Object): Informações do usuário
- `systemStatus` (String): Status do sistema
- `isOnline` (Boolean): Status online/offline

**Events:**
- `logout`: Emitido quando o usuário clica em "Sair"

**Uso:**
```vue
<CanonikaHeader
  :logo-text="'CANONIKA'"
  :logo-subtitle="'PLATFORM'"
  :user="userInfo"
  :system-status="'ONLINE'"
  :is-online="true"
  @logout="handleLogout"
/>
```

### **CanonikaSidebar**
Componente de navegação lateral colapsável.

**Props:**
- `brandText` (String): Texto da marca
- `brandIcon` (String): Ícone da marca
- `collapsed` (Boolean): Estado colapsado
- `user` (Object): Informações do usuário
- `navigationSections` (Array): Seções de navegação

**Events:**
- `toggle-sidebar`: Emitido ao alternar sidebar
- `nav-click`: Emitido ao clicar em item de navegação

**Uso:**
```vue
<CanonikaSidebar
  :brand-text="'Canonika'"
  :brand-icon="'fas fa-cube'"
  :collapsed="sidebarCollapsed"
  :user="userInfo"
  :navigation-sections="navSections"
  @toggle-sidebar="toggleSidebar"
  @nav-click="handleNavClick"
/>
```

### **CanonikaMasterPage**
Layout principal que integra Header e Sidebar.

**Props:**
- `headerConfig` (Object): Configuração do header
- `sidebarConfig` (Object): Configuração do sidebar
- `initialSidebarCollapsed` (Boolean): Estado inicial do sidebar

**Events:**
- `logout`: Emitido quando o usuário faz logout
- `nav-click`: Emitido ao clicar em item de navegação
- `sidebar-toggle`: Emitido ao alternar sidebar

**Uso:**
```vue
<CanonikaMasterPage
  :header-config="headerConfig"
  :sidebar-config="sidebarConfig"
  @logout="handleLogout"
  @nav-click="handleNavClick"
  @sidebar-toggle="handleSidebarToggle"
>
  <!-- Conteúdo específico do serviço -->
</CanonikaMasterPage>
```

## 🎨 Estilos

### **header.css**
Estilos específicos para o componente Header:
- Logo animada com hexágono
- Efeitos de glow
- Responsividade
- Animações de pulse

### **sidebar.css**
Estilos específicos para o componente Sidebar:
- Navegação colapsável
- Hover effects
- Transições suaves
- Layout responsivo

### **masterpage.css**
Estilos para o layout principal:
- Reset CSS
- Layout flexbox
- Responsividade
- Transições

## 🚀 Como Usar

### **1. Importar Componentes**
```javascript
import CanonikaMasterPage from '../../../shared/components/MasterPage.vue'
import CanonikaHeader from '../../../shared/components/Header.vue'
import CanonikaSidebar from '../../../shared/components/Sidebar.vue'
```

### **2. Configurar Props**
```javascript
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
        role: 'Administrador',
        initial: 'A'
      },
      navigationSections: [
        // Configuração das seções
      ]
    }
  }
}
```

### **3. Implementar Eventos**
```javascript
methods: {
  handleLogout() {
    // Lógica de logout
  },
  handleNavClick(item) {
    // Lógica de navegação
  },
  handleSidebarToggle(collapsed) {
    // Lógica de toggle
  }
}
```

## 📱 Responsividade

Todos os componentes são responsivos e se adaptam a diferentes tamanhos de tela:

- **Desktop**: Layout completo com sidebar
- **Tablet**: Sidebar colapsável
- **Mobile**: Sidebar como overlay

## 🎯 Benefícios

### **Consistência**
- Identidade visual unificada
- Comportamento padronizado
- Experiência do usuário consistente

### **Reutilização**
- Componentes flexíveis
- Configuração via props
- Fácil manutenção

### **Manutenibilidade**
- Código centralizado
- Atualizações automáticas
- Debugging simplificado

### **Performance**
- CSS otimizado
- Componentes leves
- Carregamento eficiente

## 🔧 Customização

### **Cores**
As cores podem ser customizadas através de variáveis CSS:
```css
:root {
  --canonika-primary: #3b82f6;
  --canonika-secondary: #1d4ed8;
  --canonika-success: #10b981;
  --canonika-warning: #f59e0b;
  --canonika-error: #ef4444;
}
```

### **Temas**
Diferentes temas podem ser aplicados:
- Tema claro
- Tema escuro
- Tema personalizado

### **Animações**
Animações podem ser desabilitadas ou customizadas:
```css
.sidebar {
  --transition-duration: 0.3s;
  --animation-timing: ease;
}
```

## 📚 Exemplos

### **Serviço Simples**
```vue
<template>
  <CanonikaMasterPage
    :header-config="headerConfig"
    :sidebar-config="sidebarConfig"
    @logout="handleLogout"
  >
    <div class="service-content">
      <h1>Meu Serviço</h1>
      <p>Conteúdo específico</p>
    </div>
  </CanonikaMasterPage>
</template>
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
```

## 🧪 Validação

O serviço **Template** (porta 3715) foi criado especificamente para validar a componentização:

- ✅ Header funcionando
- ✅ Sidebar colapsável
- ✅ Navegação responsiva
- ✅ Integração de componentes
- ✅ Estilos compartilhados
- ✅ Props e eventos

## 📋 Checklist de Implementação

### **Para Novos Serviços**
- [ ] Importar `CanonikaMasterPage`
- [ ] Configurar `headerConfig`
- [ ] Configurar `sidebarConfig`
- [ ] Implementar eventos necessários
- [ ] Testar responsividade
- [ ] Validar integração

### **Para Atualizações**
- [ ] Verificar compatibilidade
- [ ] Testar em diferentes serviços
- [ ] Documentar mudanças
- [ ] Atualizar exemplos

---

**🎯 Objetivo**: Manter uma base sólida de componentes reutilizáveis que garantam consistência e qualidade em toda a plataforma Canonika. 