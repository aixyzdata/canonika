# Guia: Layout Bootstrap Nativo - Simulação Skipper

## Resumo das Mudanças

Aplicamos um layout Bootstrap nativo no formulário de configuração da pesquisa, removendo CSS personalizado desnecessário e usando as classes Bootstrap 5.3.0 já disponíveis no projeto.

## Mudanças Aplicadas

### 1. HTML - Estrutura Bootstrap Nativa

**Antes:**
```html
<div class="form-row">
  <div class="col-6">
    <!-- Nome do Produto duplicado -->
  </div>
  <div class="col-4">
    <!-- Máximo de Resultados -->
  </div>
  <div class="col-2">
    <!-- Botão Pesquisar -->
  </div>
</div>
```

**Depois:**
```html
<div class="row align-items-end">
  <!-- Nome do Produto + Checkbox -->
  <div class="col-sm-6 mb-2">
    <label for="productName" class="form-label">Nome do Produto</label>
    <div class="d-flex align-items-center gap-2">
      <input type="text" class="form-control" id="productName" v-model="productName" placeholder="Ex: iPhone 15, Samsung Galaxy, etc." :disabled="isRunning">
      <div class="form-check ms-2">
        <input class="form-check-input" type="checkbox" id="autoSelectSources" v-model="autoSelectSources" :disabled="isRunning">
        <label class="form-check-label" for="autoSelectSources">
          Selecionar automaticamente as melhores fontes
        </label>
      </div>
    </div>
  </div>
  <!-- Máximo de Resultados -->
  <div class="col-sm-3 mb-2">
    <label for="maxResults" class="form-label">Máximo de Resultados</label>
    <input type="number" class="form-control" id="maxResults" v-model="maxResults" min="1" max="10" :disabled="isRunning">
  </div>
  <!-- Botão Pesquisar -->
  <div class="col-sm-3 mb-2 d-flex align-items-end">
    <button type="submit" :disabled="!productName || isRunning" class="btn btn-primary w-100">
      <i class="fas fa-search"></i>
      {{ isRunning ? 'Pesquisando...' : '🔍 Pesquisar' }}
    </button>
  </div>
</div>
```

### 2. Classes Bootstrap Utilizadas

- **`row`**: Container flexbox do Bootstrap
- **`align-items-end`**: Alinha itens ao final da linha
- **`col-sm-6`**: 50% da largura em telas pequenas e maiores
- **`col-sm-3`**: 25% da largura em telas pequenas e maiores
- **`mb-2`**: Margem inferior (0.5rem)
- **`d-flex`**: Display flex
- **`align-items-center`**: Alinha itens ao centro
- **`gap-2`**: Espaçamento entre elementos (0.5rem)
- **`ms-2`**: Margem esquerda (0.5rem)
- **`form-control`**: Classe Bootstrap para inputs
- **`btn btn-primary`**: Classe Bootstrap para botões
- **`w-100`**: Largura 100%

### 3. CSS Removido

Removemos todo o CSS personalizado desnecessário:
- `.form-inline`
- `.form-row`
- `.col-6`, `.col-4`, `.col-2`
- `.w-100`
- Classes de grid personalizadas

### 4. Benefícios

1. **Consistência**: Usa o sistema de grid nativo do Bootstrap
2. **Responsividade**: Funciona automaticamente em diferentes tamanhos de tela
3. **Manutenibilidade**: Menos CSS personalizado para manter
4. **Performance**: Menos CSS para carregar
5. **Padrão**: Segue as convenções do Bootstrap

### 5. Layout Final

- **Nome do Produto + Checkbox**: 50% da largura (col-sm-6)
- **Máximo de Resultados**: 25% da largura (col-sm-3)
- **Botão Pesquisar**: 25% da largura (col-sm-3)

Todos os elementos ficam em uma única linha no desktop e se empilham responsivamente no mobile.

## Como Testar

1. Acesse: `http://localhost:7721/skipper/simulacao`
2. Verifique se o formulário está organizado conforme o layout especificado
3. Teste a responsividade redimensionando a janela do navegador
4. Confirme que o checkbox está ao lado do input "Nome do Produto"

## Status

✅ **Implementado e testado**
- Layout Bootstrap nativo aplicado
- CSS personalizado removido
- Responsividade funcionando
- Container Docker reconstruído 