# Template Service - Testes BDD

Este diretório contém testes automatizados usando BDD (Behavior Driven Development) para garantir que a jornada de autenticação do Template Service esteja funcionando corretamente.

## 🎯 Objetivo

Validar que o fluxo de autenticação entre Template Service (3790) → Quarter (3700) → Harbor (3701) está funcionando perfeitamente.

## 📁 Estrutura

```
tests/
├── bdd/
│   └── authentication_journey.feature    # Cenários BDD
├── steps/
│   └── authentication_steps.js           # Implementação dos steps
├── cucumber.js                           # Configuração do Cucumber
├── package.json                          # Dependências de teste
├── run-tests.sh                          # Script de execução
└── README.md                             # Esta documentação
```

## 🚀 Como Executar

### Pré-requisitos

1. **Serviços rodando:**
   - Template Service: http://localhost:3790
   - Quarter Service: http://localhost:3700
   - Harbor Service: http://localhost:3701

2. **Dependências:**
   ```bash
   cd template/tests
   npm install
   ```

### Executar Testes

```bash
# Executar todos os testes
./run-tests.sh

# Ou executar manualmente
npm run test:auth
```

## 📋 Cenários Testados

### 1. Acesso sem Autenticação
- **Cenário:** Usuário acessa Template Service sem estar logado
- **Esperado:** Redirecionamento para Quarter com `redirect_to=http://localhost:3790`

### 2. Login pelo Quarter
- **Cenário:** Usuário faz login no Quarter e retorna ao Template
- **Esperado:** Acesso ao dashboard do Template com autenticação válida

### 3. Logout do Template
- **Cenário:** Usuário faz logout do Template Service
- **Esperado:** Redirecionamento para Quarter e limpeza da autenticação

### 4. Acesso com Token Válido
- **Cenário:** Acesso direto ao Template com token de autenticação válido
- **Esperado:** Acesso direto sem redirecionamento

### 5. Acesso com Token Expirado
- **Cenário:** Acesso com token de autenticação expirado
- **Esperado:** Redirecionamento para Quarter

### 6. Carregamento de Estilos
- **Cenário:** Verificar se todos os estilos compartilhados carregam
- **Esperado:** Sem erros 404 para arquivos CSS

## 🔍 Debug

Para executar com mais detalhes:

```bash
npm run test:debug
```

Isso gerará um relatório HTML em `cucumber-report.html` com detalhes de cada teste.

## 🐛 Solução de Problemas

### Erro: "Template Service (3790) - FALHOU"
- Verificar se o container `canonika_template_web` está rodando
- Verificar se a porta 3790 está livre

### Erro: "Quarter Service (3700) - FALHOU"
- Verificar se o container `canonika_quarter` está rodando
- Verificar se a porta 3700 está livre

### Erro: "Harbor Service (3701) - FALHOU"
- Verificar se o container `canonika_harbor` está rodando
- Verificar se a porta 3701 está livre

### Testes Falhando
- Verificar logs do navegador no relatório HTML
- Verificar se os redirecionamentos estão corretos
- Verificar se os estilos compartilhados estão disponíveis

## 📊 Relatórios

Após a execução, você encontrará:
- **Console:** Progresso em tempo real
- **HTML:** Relatório detalhado em `cucumber-report.html`
- **Logs:** Detalhes de cada step executado

## 🔧 Manutenção

Para adicionar novos cenários:
1. Edite `bdd/authentication_journey.feature`
2. Implemente os steps em `steps/authentication_steps.js`
3. Execute os testes para validar

Para modificar comportamentos:
1. Atualize os steps em `steps/authentication_steps.js`
2. Execute os testes para garantir que não quebrou nada
3. Atualize esta documentação se necessário 