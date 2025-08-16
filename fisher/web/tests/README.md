# 🧪 Testes BDD - AG-Grid Canonika Theme

## 📋 Descrição

Este conjunto de testes BDD garante que o AG-Grid na tela Sefaz do Fisher está usando corretamente o tema Canonika, seguindo as especificações do design system.

## 🎯 Objetivos dos Testes

### ✅ Validação do Tema Canonika
- Verifica se a classe `ag-theme-canonika` está aplicada
- Confirma que a classe `ag-theme-alpine` NÃO está presente
- Valida as cores do tema escuro Canonika

### 🎨 Validação de Cores
- **Fundo**: `#1e293b` (azul escuro)
- **Texto**: `#e2e8f0` (cinza claro)
- **Header**: `#0f172a` (azul muito escuro)
- **Bordas**: `#475569` (cinza azulado)

### 🔧 Validação de Funcionalidades
- Renderização correta do AG-Grid
- Ordenação de colunas
- Filtros funcionais
- Redimensionamento de colunas
- Responsividade

## 🚀 Como Executar

### Pré-requisitos
1. **Fisher rodando**: `http://localhost:3707`
2. **Node.js**: Versão 14 ou superior
3. **Navegador**: Chrome/Chromium (para Puppeteer)

### Execução Rápida
```bash
# Navegue para a pasta de testes
cd fisher/web/tests

# Execute o script principal
./run-ag-grid-tests.sh
```

### Execução Manual
```bash
# Instale dependências
npm install

# Execute todos os testes
npm test

# Execute apenas testes do AG-Grid
npm run test:ag-grid

# Execute com relatório HTML
npm run test:report
```

## 📊 Relatórios

### Relatório HTML
Após a execução, um relatório detalhado é gerado em:
```
tests/cucumber-report.html
```

### Relatório no Terminal
```
🧪 Iniciando testes BDD do AG-Grid Canonika Theme...
==================================================
✅ Fisher está rodando em http://localhost:3707
📦 Verificando dependências...
🚀 Executando testes BDD...

✅ Todos os testes passaram! AG-Grid está usando o tema Canonika corretamente.
```

## 🧩 Estrutura dos Testes

### Feature File
```
tests/ag-grid-canonika-theme.feature
```
- Cenários de teste em linguagem natural
- Especificações do comportamento esperado

### Steps Implementation
```
tests/steps/ag-grid-theme-steps.js
```
- Implementação dos passos dos testes
- Validações usando Puppeteer e Chai

### Configuração
```
tests/cucumber.js
tests/package.json
```
- Configuração do Cucumber
- Dependências dos testes

## 🔍 Cenários de Teste

### 1. Verificação do Tema Canonika
- ✅ Classe `ag-theme-canonika` aplicada
- ❌ Classe `ag-theme-alpine` não presente

### 2. Validação de Cores
- ✅ Fundo escuro Canonika
- ✅ Texto claro legível
- ✅ Headers com contraste adequado
- ✅ Bordas consistentes

### 3. Funcionalidades do AG-Grid
- ✅ Tabela renderizada com dados
- ✅ Colunas corretas (Pasta, Arquivo, Tamanho, Status)
- ✅ Ordenação funcional
- ✅ Filtros operacionais
- ✅ Redimensionamento de colunas

### 4. Responsividade
- ✅ Adaptação a diferentes tamanhos de tela
- ✅ Tema mantido em diferentes resoluções

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Fisher não está rodando
```bash
# Inicie o Fisher primeiro
cd fisher/web
npm run dev
```

#### 2. Dependências não instaladas
```bash
cd tests
npm install
```

#### 3. Timeout nos testes
- Verifique se o AG-Grid está carregando
- Aumente timeouts no arquivo de steps se necessário

#### 4. Puppeteer não consegue conectar
- Verifique se o Chrome está instalado
- Execute com `--no-sandbox` se necessário

## 📈 Integração Contínua

### GitHub Actions (Exemplo)
```yaml
name: AG-Grid Theme Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: |
          cd fisher/web
          npm install
          cd tests
          npm install
      - name: Start Fisher
        run: |
          cd fisher/web
          npm run dev &
          sleep 10
      - name: Run tests
        run: |
          cd fisher/web/tests
          npm run test:headless
```

## 🎯 Resultados Esperados

### ✅ Sucesso
- Todos os cenários passam
- Tema Canonika aplicado corretamente
- Funcionalidades do AG-Grid operacionais

### ❌ Falha
- Relatório detalhado das falhas
- Screenshots automáticos (se configurado)
- Logs de erro para debugging

## 📝 Manutenção

### Adicionando Novos Testes
1. Adicione cenários no arquivo `.feature`
2. Implemente os steps correspondentes
3. Execute os testes para validar

### Atualizando Cores
Se as cores do tema Canonika mudarem, atualize:
- Valores hexadecimais nos steps
- Documentação neste README

### Debugging
Para debug visual, execute com `headless: false`:
```javascript
browser = await puppeteer.launch({ 
  headless: false,  // Mostra o navegador
  slowMo: 100       // Desacelera para visualizar
});
``` 