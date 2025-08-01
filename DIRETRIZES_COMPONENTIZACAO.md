# 🎨 Diretrizes de Componentização e Padronização - Canonika

## 📋 Resumo Executivo

Este documento estabelece as **DIRETRIZES OBRIGATÓRIAS** para componentização e padronização de estilos em todo o projeto Canonika.

## 🎯 Princípios Fundamentais

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

### ✅ **Arquitetura Unificada**
- **MasterPage**: Componente único para todos os serviços
- **LoginTemplate**: Componente único para todos os serviços
- **Design System**: Fonte única de verdade para estilos

## 🏗️ Estrutura Obrigatória

### Componentes Core
```
shared/templates/
├── MasterPage.vue              # Layout principal unificado
├── LoginTemplate.vue           # Login unificado
├── CanonikaViewTemplate.vue    # Template base para views
└── StatusViewTemplate.vue      # Template para status
```

### Configurações
```
shared/config/
├── service-menus.js            # Menus dinâmicos por serviço
├── status-configs.js           # Configurações de status
└── design-variables.js         # Variáveis de design
```

### Estilos
```
shared/styles/
├── design-system.css           # Sistema principal
├── canonika-view.css           # Estilos de views
├── canonika-icons.css          # Ícones e elementos visuais
└── canonika-theme.css          # Tema base
```

## 📐 Regras de Implementação

### ✅ **O QUE FAZER**

1. **Usar Componentes Compartilhados**
   ```vue
   <!-- ✅ CORRETO -->
   <template>
     <MasterPage :serviceConfig="serviceConfig">
       <router-view />
     </MasterPage>
   </template>
   ```

2. **Importar Design System**
   ```vue
   <!-- ✅ CORRETO -->
   <style>
   @import '../../../shared/styles/design-system.css';
   </style>
   ```

3. **Usar Classes Padronizadas**
   ```vue
   <!-- ✅ CORRETO -->
   <div class="canonika-card">
     <h2 class="canonika-h2">Título</h2>
     <button class="canonika-btn canonika-btn-primary">Ação</button>
   </div>
   ```

### ❌ **O QUE NÃO FAZER**

1. **CSS Inline em Componentes**
   ```vue
   <!-- ❌ INCORRETO -->
   <style scoped>
   .header {
     background: #1e293b; /* Não usar cores hardcoded */
   }
   </style>
   ```

2. **Duplicar Componentes**
   ```vue
   <!-- ❌ INCORRETO -->
   <!-- Não criar MasterPage específico para cada serviço -->
   ```

3. **Usar Classes Não Padronizadas**
   ```vue
   <!-- ❌ INCORRETO -->
   <div class="custom-header"> <!-- Não usar classes customizadas -->
   ```

## 🔧 Processo de Desenvolvimento

### 1. **Novo Serviço**
```bash
# 1. Copiar estrutura base
cp -r beacon/ novo-servico/

# 2. Usar componentes compartilhados
# - MasterPage.vue
# - LoginTemplate.vue
# - CanonikaViewTemplate.vue

# 3. Configurar menu no service-menus.js
# 4. Importar design-system.css
```

### 2. **Novo Componente**
```vue
<!-- 1. Usar template base -->
<template>
  <CanonikaViewTemplate>
    <!-- Conteúdo específico -->
  </CanonikaViewTemplate>
</template>

<!-- 2. Importar design system -->
<style>
@import '../../../shared/styles/design-system.css';
</style>
```

### 3. **Modificação de Estilo**
```bash
# 1. Modificar APENAS shared/styles/design-system.css
# 2. Testar em TODOS os serviços
# 3. Garantir que não quebra nada
```

## 🎨 Padrões Visuais Obrigatórios

### Cores (Apenas estas)
```css
/* Primárias */
--canonika-blue: #002F6C;
--canonika-green: #00BFA6;
--canonika-white: #FFFFFF;

/* Status */
--canonika-success: #10B981;
--canonika-warning: #F59E0B;
--canonika-error: #EF4444;
--canonika-info: #3B82F6;

/* Gradientes */
--canonika-gradient-primary: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
--canonika-gradient-header: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
```

### Tipografia (Apenas estas classes)
```css
.canonika-h1    /* 36px, bold */
.canonika-h2    /* 30px, semibold */
.canonika-h3    /* 24px, semibold */
.canonika-h4    /* 20px, semibold */
.canonika-h5    /* 18px, medium */
.canonika-h6    /* 16px, medium */

.canonika-text-xs     /* 12px */
.canonika-text-sm     /* 14px */
.canonika-text-base   /* 16px */
.canonika-text-lg     /* 18px */
```

### Componentes (Apenas estes)
```css
.canonika-card          /* Card base */
.canonika-btn           /* Botão base */
.canonika-form          /* Formulário */
.canonika-badge         /* Badge */
.canonika-page-header   /* Header de página */
```

## 🔍 Checklist de Validação

### Para Cada Serviço
- [ ] Usa `MasterPage.vue` compartilhado
- [ ] Usa `LoginTemplate.vue` compartilhado
- [ ] Importa `design-system.css`
- [ ] Não tem CSS inline específico
- [ ] Usa apenas classes padronizadas
- [ ] Configurado em `service-menus.js`

### Para Cada Componente
- [ ] Usa template base quando apropriado
- [ ] Importa design system
- [ ] Não duplica estilos existentes
- [ ] Usa variáveis CSS quando possível
- [ ] Responsivo por padrão

### Para Cada Modificação
- [ ] Testado em múltiplos serviços
- [ ] Não quebra funcionalidades existentes
- [ ] Documentado se necessário
- [ ] Segue padrões estabelecidos

## 🚀 Benefícios da Componentização

### ✅ **Consistência Visual**
- Todos os serviços têm aparência idêntica
- Mudanças aplicadas automaticamente a todos
- Zero inconsistências visuais

### ✅ **Manutenibilidade**
- Mudança em um lugar = aplicada em todos
- Debugging centralizado
- Menos código para manter

### ✅ **Performance**
- CSS compartilhado = menos downloads
- Cache otimizado
- Carregamento mais rápido

### ✅ **Desenvolvimento Rápido**
- Novos serviços em minutos
- Componentes prontos para usar
- Menos decisões de design

## 📚 Documentação Completa

- [Design System](./shared/styles/DESIGN_SYSTEM.md)
- [Diretrizes Detalhadas](./shared/styles/DIRETRIZES_COMPONENTIZACAO.md)
- [UX Best Practices](./shared/styles/UX_BEST_PRACTICES.md)
- [Status Views Improvements](./shared/styles/STATUS_VIEWS_IMPROVEMENTS.md)

---

**⚠️ IMPORTANTE**: Estas diretrizes são **OBRIGATÓRIAS** para todos os desenvolvedores do projeto. Qualquer desvio deve ser justificado e aprovado pela equipe. 