# CanonikaViewHeader Component

## 📋 Visão Geral

O `CanonikaViewHeader` é um componente reutilizável para cabeçalhos de views, baseado no padrão visual do `beacon_old`. Ele fornece uma estrutura consistente para títulos, subtítulos, status e ações de views.

## 🎨 Design e Layout

### Estrutura
- **View Title Section**: Título principal e subtítulo
- **View Status**: Indicador de status com animação
- **View Actions**: Botões e ações da view

### Cores e Temas
- **Tema Escuro** (padrão): Fundo `#334155`, texto claro
- **Tema Claro** (autenticado): Fundo branco, texto escuro
- **Status Indicators**: Verde (online), vermelho (offline), amarelo (warning), roxo (maintenance)

## ⚙️ Funcionalidades

### Props
- `title` (String): Título principal da view
- `subtitle` (String): Subtítulo descritivo
- `status` (Object): Objeto com `type` e `text` para status
- `actions` (Boolean): Habilita slot para ações

### Slots
- `actions`: Slot para botões e ações da view

### Eventos
- Não emite eventos específicos

## 🎯 Estilos

### Classes CSS
- `.canonika-view-header`: Container principal
- `.view-title-section`: Seção do título
- `.view-title`: Título principal
- `.view-subtitle`: Subtítulo
- `.view-status`: Container do status
- `.status-indicator`: Indicador visual
- `.view-actions`: Container das ações

### Variáveis CSS
- Cores baseadas no tema Canonika
- Animações de pulse para status
- Responsividade mobile-first

## 📱 Responsividade

### Mobile (< 768px)
- Layout em coluna
- Ações alinhadas à direita
- Espaçamento reduzido

### Desktop (≥ 768px)
- Layout em linha
- Distribuição equilibrada
- Espaçamento padrão

## 🔧 Integração Bootstrap 5

### Compatibilidade
- Funciona com classes Bootstrap
- Não interfere com grid system
- Suporta utilitários Bootstrap

### Classes Recomendadas
```html
<CanonikaViewHeader 
  title="Dashboard" 
  subtitle="Visão geral do sistema"
  :status="{ type: 'online', text: 'Sistema Ativo' }"
  :actions="true"
>
  <template #actions>
    <button class="btn btn-canonika-primary btn-sm">
      <i class="fas fa-sync-alt me-2"></i>
      Atualizar
    </button>
  </template>
</CanonikaViewHeader>
```

## ♿ Acessibilidade

### ARIA Labels
- Títulos semânticos
- Indicadores de status acessíveis
- Navegação por teclado

### Boas Práticas
- Contraste adequado
- Textos descritivos
- Estados visuais claros

## 🧪 Testes Recomendados

### Unit Tests
- Renderização de props
- Slots funcionando
- Estados de status

### Integration Tests
- Integração com MasterPage
- Responsividade
- Temas claro/escuro

## 📊 Performance

### Otimizações
- CSS scoped
- Animações otimizadas
- Renderização condicional

### Boas Práticas
- Props tipadas
- Slots flexíveis
- Reutilização máxima

## 🔄 Versões e Compatibilidade

### Vue 3
- Composition API ready
- TypeScript support
- Modern reactivity

### Dependências
- Font Awesome (ícones)
- Bootstrap 5 (utilitários)
- CSS customizado

## 📝 Exemplos de Uso

### Exemplo Básico
```vue
<CanonikaViewHeader 
  title="Serviços" 
  subtitle="Gerenciamento de serviços ativos"
/>
```

### Exemplo com Status
```vue
<CanonikaViewHeader 
  title="Monitoramento" 
  subtitle="Status em tempo real"
  :status="{ type: 'online', text: 'Todos os sistemas operacionais' }"
/>
```

### Exemplo Completo
```vue
<CanonikaViewHeader 
  title="Dashboard" 
  subtitle="Visão geral do sistema"
  :status="{ type: 'warning', text: '2 alertas ativos' }"
  :actions="true"
>
  <template #actions>
    <button class="btn btn-canonika-primary btn-sm">
      <i class="fas fa-sync-alt me-2"></i>
      Atualizar
    </button>
    <button class="btn btn-secondary btn-sm">
      <i class="fas fa-download me-2"></i>
      Exportar
    </button>
  </template>
</CanonikaViewHeader>
``` 