# Canonika Design System

## Visão Geral

O Canonika Design System é um sistema de design unificado que padroniza todos os elementos visuais do projeto, garantindo consistência, simetria e organização em todas as views e componentes.

## 🎯 Diretrizes Obrigatórias

### ✅ **Componentização Total**
- **TODOS** os componentes devem ser reutilizáveis
- **NENHUM** CSS inline em componentes específicos
- **TODOS** os estilos devem vir do Design System
- **ZERO** duplicação de código CSS

### ✅ **Padronização Visual**
- **Cores**: Apenas as definidas no Design System
- **Tipografia**: Apenas as classes do Design System
- **Espaçamentos**: Apenas as variáveis do Design System
- **Componentes**: Apenas os templates do Design System

**📋 Para diretrizes completas, veja [DIRETRIZES_COMPONENTIZACAO.md](./DIRETRIZES_COMPONENTIZACAO.md)**

## Estrutura de Arquivos

```
shared/styles/
├── design-system.css          # Sistema de design principal
├── canonika-theme.css         # Tema base do Canonika
├── masterpage.css            # Estilos do layout principal
├── canonika-icons.css        # Ícones e elementos visuais
├── DESIGN_SYSTEM.md          # Documentação completa
└── README.md                 # Este arquivo
```

## Características Principais

### 🎨 Identidade Visual Unificada
- **Cores consistentes**: Verde primário (#00BFA6) e azul secundário (#002F6C)
- **Tipografia padronizada**: Segoe UI com hierarquia clara
- **Espaçamentos sistemáticos**: Sistema de 8px base
- **Componentes reutilizáveis**: Cards, botões, formulários padronizados

### 📱 Responsividade Total
- **Mobile-first**: Adaptação automática para todos os dispositivos
- **Grid system flexível**: Layouts que se ajustam automaticamente
- **Breakpoints consistentes**: 768px (tablet) e 480px (mobile)

### ⚡ Performance Otimizada
- **CSS custom properties**: Variáveis CSS para fácil manutenção
- **Animações suaves**: Transições de 0.3s para melhor UX
- **Backdrop filters**: Efeitos visuais modernos

## Componentes Disponíveis

### Tipografia
```css
.canonika-h1    /* 36px, bold */
.canonika-h2    /* 30px, semibold */
.canonika-h3    /* 24px, semibold */
.canonika-h4    /* 20px, semibold */
.canonika-h5    /* 18px, medium */
.canonika-h6    /* 16px, medium */

.canonika-text-xs     /* 12px, cinza */
.canonika-text-sm     /* 14px, cinza claro */
.canonika-text-base   /* 16px, cinza claro */
.canonika-text-lg     /* 18px, cinza claro */

.canonika-subtitle        /* 14px, uppercase */
.canonika-subtitle-large  /* 16px, uppercase */
```

### Layout
```css
.canonika-container       /* Container centralizado */
.canonika-container-fluid /* Container com largura total */

.canonika-grid           /* Grid base */
.canonika-grid-2         /* 2 colunas responsivas */
.canonika-grid-3         /* 3 colunas responsivas */
.canonika-grid-4         /* 4 colunas responsivas */

.canonika-flex           /* Flexbox base */
.canonika-flex-center    /* Centralização */
.canonika-flex-between   /* Espaço entre */
.canonika-flex-gap-sm    /* Gap pequeno */
.canonika-flex-gap-md    /* Gap médio */
.canonika-flex-gap-lg    /* Gap grande */
```

### Componentes
```css
.canonika-page-header    /* Header de página */
.canonika-card          /* Card base */
.canonika-btn           /* Botão base */
.canonika-form          /* Formulário */
.canonika-badge         /* Badge de status */
```

### Espaçamentos
```css
.canonika-spacing-xs    /* 4px */
.canonika-spacing-sm    /* 8px */
.canonika-spacing-md    /* 16px */
.canonika-spacing-lg    /* 24px */
.canonika-spacing-xl    /* 32px */
.canonika-spacing-2xl   /* 48px */
.canonika-spacing-3xl   /* 64px */

.canonika-mt-*          /* Margens superiores */
.canonika-mb-*          /* Margens inferiores */
.canonika-p-*           /* Paddings */
```

## Como Usar

### 1. Importar o CSS
Adicione o link para o design system no `<head>` do seu HTML:

```html
<link rel="stylesheet" href="../../shared/styles/design-system.css">
```

### 2. Estrutura Básica de View
```html
<template>
  <div class="view-container">
    <!-- Page Header -->
    <div class="canonika-page-header">
      <div class="canonika-page-header-content">
        <div class="canonika-page-header-text">
          <div class="canonika-section-title">
            <i class="fas fa-icon canonika-section-icon"></i>
            <h2 class="canonika-h2">Título da Página</h2>
          </div>
          <p class="canonika-subtitle">Descrição da página</p>
        </div>
        <div class="canonika-page-header-actions">
          <button class="canonika-btn canonika-btn-primary">Ação</button>
        </div>
      </div>
    </div>
    
    <!-- Conteúdo Principal -->
    <div class="canonika-container">
      <div class="canonika-card">
        <div class="canonika-card-header">
          <h4 class="canonika-h4">Título do Card</h4>
        </div>
        <div class="canonika-card-body">
          Conteúdo do card
        </div>
      </div>
    </div>
  </div>
</template>
```

### 3. Formulários Padronizados
```html
<form class="canonika-form">
  <div class="canonika-grid canonika-grid-2">
    <div class="canonika-form-group">
      <label class="canonika-form-label">
        <i class="fas fa-user"></i>
        Nome
      </label>
      <input class="canonika-form-input" type="text" placeholder="Digite seu nome">
    </div>
    
    <div class="canonika-form-group">
      <label class="canonika-form-label">
        <i class="fas fa-envelope"></i>
        Email
      </label>
      <input class="canonika-form-input" type="email" placeholder="Digite seu email">
    </div>
  </div>
  
  <div class="canonika-flex canonika-flex-center canonika-flex-gap-md">
    <button type="submit" class="canonika-btn canonika-btn-primary">
      Enviar
    </button>
    <button type="button" class="canonika-btn canonika-btn-outline">
      Cancelar
    </button>
  </div>
</form>
```

## Scripts de Automação

### Aplicar Design System
```bash
node scripts/apply-design-system.js
```

### Importar Design System
```bash
node shared/styles/import-design-system.js
```

## Boas Práticas

1. **Sempre use as classes do design system** em vez de criar estilos customizados
2. **Mantenha a hierarquia visual** usando os headings apropriados
3. **Use espaçamentos consistentes** com as classes de spacing
4. **Prefira flexbox e grid** em vez de floats ou posicionamento absoluto
5. **Teste em diferentes tamanhos de tela** para garantir responsividade
6. **Mantenha a simetria** usando grids e flexbox adequadamente

## Variáveis CSS Disponíveis

### Cores
```css
--canonika-blue: #002F6C
--canonika-green: #00BFA6
--canonika-white: #FFFFFF
--canonika-dark: #1F1F1F
--canonika-gray: #94A3B8
--canonika-light-gray: #E2E8F0
```

### Status Colors
```css
--canonika-success: #10B981
--canonika-warning: #F59E0B
--canonika-error: #EF4444
--canonika-info: #3B82F6
```

### Espaçamentos
```css
--canonika-spacing-xs: 0.25rem   /* 4px */
--canonika-spacing-sm: 0.5rem    /* 8px */
--canonika-spacing-md: 1rem      /* 16px */
--canonika-spacing-lg: 1.5rem    /* 24px */
--canonika-spacing-xl: 2rem      /* 32px */
--canonika-spacing-2xl: 3rem     /* 48px */
--canonika-spacing-3xl: 4rem     /* 64px */
```

### Tipografia
```css
--canonika-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
--canonika-font-size-xs: 0.75rem    /* 12px */
--canonika-font-size-sm: 0.875rem   /* 14px */
--canonika-font-size-base: 1rem     /* 16px */
--canonika-font-size-lg: 1.125rem   /* 18px */
--canonika-font-size-xl: 1.25rem    /* 20px */
--canonika-font-size-2xl: 1.5rem    /* 24px */
--canonika-font-size-3xl: 1.875rem  /* 30px */
--canonika-font-size-4xl: 2.25rem   /* 36px */
```

## Contribuição

Para contribuir com o design system:

1. **Mantenha a consistência** com os padrões existentes
2. **Documente novas classes** no `DESIGN_SYSTEM.md`
3. **Teste em diferentes dispositivos** antes de submeter
4. **Use as variáveis CSS** em vez de valores hardcoded
5. **Siga os princípios de design** estabelecidos

## Suporte

Para dúvidas sobre o design system:

1. Consulte a documentação completa em `DESIGN_SYSTEM.md`
2. Verifique os exemplos de implementação
3. Use os scripts de automação para aplicar o design system
4. Mantenha-se atualizado com as últimas mudanças

---

**Canonika Design System** - Garantindo consistência e qualidade visual em todo o projeto. 