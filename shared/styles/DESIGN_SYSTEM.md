# Canonika Design System

## Visão Geral

O Canonika Design System é um sistema de design unificado que padroniza todos os elementos visuais do projeto, garantindo consistência, simetria e organização em todas as views e componentes.

## 🎯 Diretrizes de Componentização

### ✅ **OBRIGATÓRIO: Componentização Total**
- **TODOS** os componentes devem ser reutilizáveis
- **NENHUM** CSS inline em componentes específicos  
- **TODOS** os estilos devem vir do Design System
- **ZERO** duplicação de código CSS

### ✅ **OBRIGATÓRIO: Padronização Visual**
- **Cores**: Apenas as definidas no Design System
- **Tipografia**: Apenas as classes do Design System
- **Espaçamentos**: Apenas as variáveis do Design System
- **Componentes**: Apenas os templates do Design System

### ✅ **OBRIGATÓRIO: Arquitetura Unificada**
- **MasterPage**: Componente único para todos os serviços
- **LoginTemplate**: Componente único para todos os serviços
- **Design System**: Fonte única de verdade para estilos

**📋 Para detalhes completos, veja [DIRETRIZES_COMPONENTIZACAO.md](./DIRETRIZES_COMPONENTIZACAO.md)**

## Princípios de Design

### 1. Hierarquia Visual
- **Títulos**: Use `canonika-h1` a `canonika-h6` para criar hierarquia clara
- **Subtítulos**: Use `canonika-subtitle` ou `canonika-subtitle-large`
- **Textos**: Use `canonika-text-xs`, `canonika-text-sm`, `canonika-text-base`, `canonika-text-lg`

### 2. Espaçamentos Consistentes
- **XS**: 4px (0.25rem)
- **SM**: 8px (0.5rem)
- **MD**: 16px (1rem)
- **LG**: 24px (1.5rem)
- **XL**: 32px (2rem)
- **2XL**: 48px (3rem)
- **3XL**: 64px (4rem)

### 3. Cores Unificadas
- **Primária**: `#00BFA6` (verde)
- **Secundária**: `#002F6C` (azul)
- **Sucesso**: `#10B981`
- **Aviso**: `#F59E0B`
- **Erro**: `#EF4444`
- **Info**: `#3B82F6`

## Componentes Padronizados

### Page Header
```html
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
```

### Cards
```html
<div class="canonika-card">
  <div class="canonika-card-header">
    <h4 class="canonika-h4">Título do Card</h4>
  </div>
  <div class="canonika-card-body">
    Conteúdo do card
  </div>
  <div class="canonika-card-footer">
    Rodapé do card
  </div>
</div>
```

### Formulários
```html
<form class="canonika-form">
  <div class="canonika-form-group">
    <label class="canonika-form-label">
      <i class="fas fa-icon"></i>
      Label do Campo
    </label>
    <input class="canonika-form-input" type="text" placeholder="Placeholder">
  </div>
  
  <div class="canonika-form-check">
    <input class="canonika-form-check-input" type="checkbox" id="check1">
    <label class="canonika-form-check-label" for="check1">Opção</label>
  </div>
</form>
```

### Botões
```html
<!-- Botão Primário -->
<button class="canonika-btn canonika-btn-primary">Botão Primário</button>

<!-- Botão Secundário -->
<button class="canonika-btn canonika-btn-secondary">Botão Secundário</button>

<!-- Botão Outline -->
<button class="canonika-btn canonika-btn-outline">Botão Outline</button>

<!-- Tamanhos -->
<button class="canonika-btn canonika-btn-sm">Pequeno</button>
<button class="canonika-btn canonika-btn-lg">Grande</button>
```

### Badges
```html
<span class="canonika-badge canonika-badge-success">Sucesso</span>
<span class="canonika-badge canonika-badge-warning">Aviso</span>
<span class="canonika-badge canonika-badge-error">Erro</span>
<span class="canonika-badge canonika-badge-info">Info</span>
```

## Layout e Grid

### Container
```html
<div class="canonika-container">
  <!-- Conteúdo centralizado com largura máxima -->
</div>

<div class="canonika-container-fluid">
  <!-- Conteúdo com largura total -->
</div>
```

### Grid System
```html
<div class="canonika-grid canonika-grid-2">
  <!-- 2 colunas responsivas -->
</div>

<div class="canonika-grid canonika-grid-3">
  <!-- 3 colunas responsivas -->
</div>

<div class="canonika-grid canonika-grid-4">
  <!-- 4 colunas responsivas -->
</div>
```

### Flexbox Utilities
```html
<div class="canonika-flex canonika-flex-center">
  <!-- Flex com centralização -->
</div>

<div class="canonika-flex canonika-flex-between">
  <!-- Flex com espaço entre -->
</div>

<div class="canonika-flex canonika-flex-gap-lg">
  <!-- Flex com gap grande -->
</div>
```

## Espaçamentos

### Margens
```html
<div class="canonika-mt-lg">Margem superior grande</div>
<div class="canonika-mb-md">Margem inferior média</div>
<div class="canonika-space-xl">Margem em todos os lados</div>
```

### Padding
```html
<div class="canonika-p-lg">Padding grande</div>
<div class="canonika-p-xl">Padding extra grande</div>
```

## Tipografia

### Headings
- `canonika-h1`: 36px, bold
- `canonika-h2`: 30px, semibold
- `canonika-h3`: 24px, semibold
- `canonika-h4`: 20px, semibold
- `canonika-h5`: 18px, medium
- `canonika-h6`: 16px, medium

### Textos
- `canonika-text-xs`: 12px, cinza
- `canonika-text-sm`: 14px, cinza claro
- `canonika-text-base`: 16px, cinza claro
- `canonika-text-lg`: 18px, cinza claro

### Subtítulos
- `canonika-subtitle`: 14px, uppercase, letter-spacing
- `canonika-subtitle-large`: 16px, uppercase, letter-spacing

## Animações

### Fade In
```html
<div class="canonika-fade-in">
  <!-- Elemento com animação de entrada -->
</div>
```

### Pulse
```html
<div class="canonika-pulse">
  <!-- Elemento com animação de pulso -->
</div>
```

### Glow
```html
<div class="canonika-glow">
  <!-- Elemento com animação de brilho -->
</div>
```

## Responsividade

O design system é totalmente responsivo e se adapta automaticamente:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Grids se ajustam para 2 colunas
- **Mobile**: Grids se tornam 1 coluna, headers se empilham

## Como Usar

### 1. Importar o CSS
```html
<link rel="stylesheet" href="/shared/styles/design-system.css">
```

### 2. Estrutura Básica de uma View
```html
<template>
  <div class="view-container">
    <!-- Page Header -->
    <div class="canonika-page-header">
      <!-- Conteúdo do header -->
    </div>
    
    <!-- Conteúdo Principal -->
    <div class="canonika-container">
      <div class="canonika-card">
        <!-- Conteúdo do card -->
      </div>
    </div>
  </div>
</template>
```

### 3. Padrão para Formulários
```html
<form class="canonika-form">
  <div class="canonika-grid canonika-grid-2">
    <div class="canonika-form-group">
      <!-- Campo 1 -->
    </div>
    <div class="canonika-form-group">
      <!-- Campo 2 -->
    </div>
  </div>
  
  <div class="canonika-flex canonika-flex-center">
    <button type="submit" class="canonika-btn canonika-btn-primary">
      Enviar
    </button>
  </div>
</form>
```

## Boas Práticas

1. **Sempre use as classes do design system** em vez de criar estilos customizados
2. **Mantenha a hierarquia visual** usando os headings apropriados
3. **Use espaçamentos consistentes** com as classes de spacing
4. **Prefira flexbox e grid** em vez de floats ou posicionamento absoluto
5. **Teste em diferentes tamanhos de tela** para garantir responsividade
6. **Mantenha a simetria** usando grids e flexbox adequadamente

## Exemplos de Implementação

### Dashboard
```html
<div class="view-container">
  <div class="canonika-page-header">
    <div class="canonika-page-header-content">
      <div class="canonika-page-header-text">
        <div class="canonika-section-title">
          <i class="fas fa-chart-line canonika-section-icon"></i>
          <h1 class="canonika-h1">Dashboard</h1>
        </div>
        <p class="canonika-subtitle">Visão geral do sistema</p>
      </div>
    </div>
  </div>
  
  <div class="canonika-grid canonika-grid-3">
    <div class="canonika-card">
      <h3 class="canonika-h3">Métricas</h3>
      <!-- Conteúdo -->
    </div>
    <div class="canonika-card">
      <h3 class="canonika-h3">Atividades</h3>
      <!-- Conteúdo -->
    </div>
    <div class="canonika-card">
      <h3 class="canonika-h3">Alertas</h3>
      <!-- Conteúdo -->
    </div>
  </div>
</div>
```

### Formulário de Configuração
```html
<div class="canonika-card">
  <div class="canonika-card-header">
    <h4 class="canonika-h4">Configurações</h4>
  </div>
  
  <form class="canonika-form">
    <div class="canonika-grid canonika-grid-2">
      <div class="canonika-form-group">
        <label class="canonika-form-label">
          <i class="fas fa-cog"></i>
          Nome da Configuração
        </label>
        <input class="canonika-form-input" type="text">
      </div>
      
      <div class="canonika-form-group">
        <label class="canonika-form-label">
          <i class="fas fa-toggle-on"></i>
          Status
        </label>
        <div class="canonika-form-check">
          <input class="canonika-form-check-input" type="checkbox" id="active">
          <label class="canonika-form-check-label" for="active">Ativo</label>
        </div>
      </div>
    </div>
    
    <div class="canonika-flex canonika-flex-center canonika-flex-gap-md">
      <button type="submit" class="canonika-btn canonika-btn-primary">
        Salvar
      </button>
      <button type="button" class="canonika-btn canonika-btn-outline">
        Cancelar
      </button>
    </div>
  </form>
</div>
```

Este design system garante que todas as views do projeto tenham uma aparência consistente, profissional e organizada, seguindo os princípios de simetria e hierarquia visual. 