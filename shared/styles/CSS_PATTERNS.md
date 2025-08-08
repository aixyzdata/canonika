# 🎨 Canonika CSS Patterns

## 📋 Padrões de Nomenclatura CSS

### **1. Estrutura de Arquivos CSS**

```
shared/styles/
├── canonika-bootstrap.css      # Tema Bootstrap 5 principal
├── canonika-components.css     # Estilos de componentes
├── canonika-layout.css         # Layouts e grids
├── canonika-utilities.css      # Classes utilitárias
├── canonika-animations.css     # Animações e transições
├── canonika-responsive.css     # Media queries
└── canonika-theme.css          # Tema e cores
```

### **2. Convenções de Nomenclatura**

#### **Classes Bootstrap 5**
```css
/* Utilizar classes Bootstrap 5 quando possível */
.d-flex
.justify-content-between
.align-items-center
.gap-3
.btn
.btn-primary
.card
.card-body
```

#### **Classes Canonika Específicas**
```css
/* Prefixo: canonika- */
.canonika-header
.canonika-sidebar
.canonika-main
.canonika-layout

/* Componentes específicos */
.canonika-logo
.canonika-logo-hexagon
.canonika-logo-pulse
.canonika-user-avatar
.canonika-status-indicator

/* Estados */
.canonika-sidebar-collapsed
.canonika-nav-active
.canonika-status-online
.canonika-status-offline
```

#### **Variáveis CSS**
```css
/* Cores */
--canonika-primary: #3b82f6;
--canonika-secondary: #64748b;
--canonika-success: #10b981;
--canonika-warning: #f59e0b;
--canonika-danger: #ef4444;

/* Gradientes */
--canonika-gradient-primary: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
--canonika-gradient-dark: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);

/* Espaçamentos */
--canonika-spacing-xs: 0.25rem;
--canonika-spacing-sm: 0.5rem;
--canonika-spacing-md: 1rem;
--canonika-spacing-lg: 1.5rem;
--canonika-spacing-xl: 2rem;

/* Tipografia */
--canonika-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
--canonika-font-size-xs: 0.75rem;
--canonika-font-size-sm: 0.875rem;
--canonika-font-size-base: 1rem;
--canonika-font-size-lg: 1.125rem;
--canonika-font-size-xl: 1.25rem;

/* Transições */
--canonika-transition-fast: 0.15s ease-in-out;
--canonika-transition-normal: 0.3s ease-in-out;
--canonika-transition-slow: 0.5s ease-in-out;

/* Z-Index */
--canonika-z-dropdown: 1000;
--canonika-z-sticky: 1020;
--canonika-z-fixed: 1030;
--canonika-z-modal: 1050;
```

### **3. Estrutura de Componentes**

#### **Header Component**
```css
/* Container principal */
.canonika-header {
  background: var(--canonika-gradient-header);
  height: 60px;
  z-index: var(--canonika-z-fixed);
}

/* Logo */
.canonika-logo {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
}

.canonika-logo-hexagon {
  background: var(--canonika-gradient-primary);
  animation: canonika-rotate 10s linear infinite;
}

.canonika-logo-pulse {
  animation: canonika-pulse 2s ease-in-out infinite;
}

/* Usuário */
.canonika-user-avatar {
  background: var(--canonika-gradient-primary);
  border-radius: 50%;
}

/* Status */
.canonika-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.canonika-status-online {
  background: var(--canonika-success);
  animation: canonika-pulse 2s infinite;
}
```

#### **Sidebar Component**
```css
/* Container principal */
.canonika-sidebar {
  width: 280px;
  background: #212529;
  transition: var(--canonika-transition-normal);
  z-index: var(--canonika-z-dropdown);
}

.canonika-sidebar-collapsed {
  width: 60px;
}

/* Navegação */
.canonika-nav-link {
  padding: var(--canonika-spacing-md);
  transition: var(--canonika-transition-fast);
  border-radius: var(--canonika-border-radius-md);
}

.canonika-nav-active {
  background-color: rgba(59, 130, 246, 0.2);
  color: var(--canonika-primary);
}
```

#### **MasterPage Component**
```css
/* Container principal */
.canonika-app {
  min-height: 100vh;
  background: var(--canonika-gradient-dark);
  font-family: var(--canonika-font-family);
}

.canonika-layout {
  display: flex;
  height: calc(100vh - 60px);
}

.canonika-main {
  flex: 1;
  padding: var(--canonika-spacing-xl);
  background: var(--canonika-light);
  color: var(--canonika-dark);
}
```

### **4. Animações Padronizadas**

#### **Rotação**
```css
@keyframes canonika-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.canonika-rotate {
  animation: canonika-rotate 10s linear infinite;
}
```

#### **Pulse**
```css
@keyframes canonika-pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.05);
  }
}

.canonika-pulse {
  animation: canonika-pulse 2s ease-in-out infinite;
}
```

#### **Fade In**
```css
@keyframes canonika-fade-in {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.canonika-fade-in {
  animation: canonika-fade-in 0.3s ease-out;
}
```

### **5. Responsividade**

#### **Breakpoints Bootstrap 5**
```css
/* Extra small devices (phones, 576px and down) */
@media (max-width: 575.98px) { }

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) { }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { }

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) { }

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) { }
```

#### **Canonika Responsive**
```css
/* Mobile First */
.canonika-sidebar {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: var(--canonika-z-fixed);
}

/* Desktop */
@media (min-width: 768px) {
  .canonika-sidebar {
    width: 280px;
    position: relative;
    top: auto;
    left: auto;
  }
}
```

### **6. Estados e Interações**

#### **Hover States**
```css
.canonika-nav-link:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--canonika-primary);
  transform: translateX(5px);
}

.btn-canonika-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--canonika-shadow-lg);
}
```

#### **Focus States**
```css
.canonika-focus:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: var(--canonika-primary);
}
```

#### **Loading States**
```css
.canonika-loading {
  position: relative;
  overflow: hidden;
}

.canonika-loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: canonika-loading 1.5s infinite;
}
```

### **7. Utilitários**

#### **Spacing Utilities**
```css
.canonika-m-0 { margin: 0; }
.canonika-m-1 { margin: var(--canonika-spacing-xs); }
.canonika-m-2 { margin: var(--canonika-spacing-sm); }
.canonika-m-3 { margin: var(--canonika-spacing-md); }
.canonika-m-4 { margin: var(--canonika-spacing-lg); }
.canonika-m-5 { margin: var(--canonika-spacing-xl); }

.canonika-p-0 { padding: 0; }
.canonika-p-1 { padding: var(--canonika-spacing-xs); }
.canonika-p-2 { padding: var(--canonika-spacing-sm); }
.canonika-p-3 { padding: var(--canonika-spacing-md); }
.canonika-p-4 { padding: var(--canonika-spacing-lg); }
.canonika-p-5 { padding: var(--canonika-spacing-xl); }
```

#### **Text Utilities**
```css
.canonika-text-primary { color: var(--canonika-primary); }
.canonika-text-secondary { color: var(--canonika-secondary); }
.canonika-text-success { color: var(--canonika-success); }
.canonika-text-warning { color: var(--canonika-warning); }
.canonika-text-danger { color: var(--canonika-danger); }

.canonika-text-xs { font-size: var(--canonika-font-size-xs); }
.canonika-text-sm { font-size: var(--canonika-font-size-sm); }
.canonika-text-base { font-size: var(--canonika-font-size-base); }
.canonika-text-lg { font-size: var(--canonika-font-size-lg); }
.canonika-text-xl { font-size: var(--canonika-font-size-xl); }
```

### **8. Boas Práticas**

#### **✅ Recomendado**
- Usar classes Bootstrap 5 quando possível
- Prefixar classes customizadas com `canonika-`
- Utilizar variáveis CSS para valores reutilizáveis
- Seguir mobile-first approach
- Manter especificidade baixa

#### **❌ Evitar**
- Classes muito específicas
- Valores hardcoded
- Aninhamento excessivo
- !important desnecessário
- Classes muito longas

#### **📝 Exemplos**

**✅ Bom**
```css
.canonika-card {
  background: white;
  border-radius: var(--canonika-border-radius-lg);
  box-shadow: var(--canonika-shadow-sm);
  transition: var(--canonika-transition-normal);
}

.canonika-card:hover {
  box-shadow: var(--canonika-shadow-md);
  transform: translateY(-1px);
}
```

**❌ Ruim**
```css
.canonika-very-specific-card-with-hover-effect-and-shadow {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}

.canonika-very-specific-card-with-hover-effect-and-shadow:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}
```

---

**🎯 Objetivo**: Manter consistência, reutilização e manutenibilidade no CSS da plataforma Canonika, seguindo os padrões Bootstrap 5. 