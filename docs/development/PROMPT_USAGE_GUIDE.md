# 📋 Guia de Uso dos Prompts Canonika

## 🎯 Quando Usar Cada Prompt

### **1. CURSOR_QUICK_PROMPT.md** - Uso Rápido
**Quando usar:**
- Cursor "se perdeu" no contexto
- Precisa de referência rápida
- Trabalhando em tarefas simples
- Lembrar comandos básicos

**Como usar:**
```bash
# Copie e cole no Cursor quando necessário
# Ideal para sessões curtas ou consultas rápidas
```

### **2. CURSOR_PROMPT_BASE.md** - Contexto Completo
**Quando usar:**
- Iniciando nova sessão de desenvolvimento
- Trabalhando em features complexas
- Precisa de contexto detalhado
- Onboarding de novos desenvolvedores

**Como usar:**
```bash
# Use como prompt inicial em novas sessões
# Copie todo o conteúdo no início do trabalho
```

### **3. CURSOR_CONTEXT.md** - Contexto Detalhado
**Quando usar:**
- Primeira vez no projeto
- Precisa entender arquitetura completa
- Trabalhando em refatorações grandes
- Definindo novos padrões

**Como usar:**
```bash
# Use para sessões longas ou complexas
# Ideal para entender o projeto completamente
```

## 🚀 Fluxo Recomendado

### **Sessão Curta (1-2 horas)**
1. Use `CURSOR_QUICK_PROMPT.md`
2. Se precisar de mais contexto, use `CURSOR_PROMPT_BASE.md`

### **Sessão Média (2-4 horas)**
1. Comece com `CURSOR_PROMPT_BASE.md`
2. Mantenha `CURSOR_QUICK_PROMPT.md` para referência rápida

### **Sessão Longa (4+ horas)**
1. Comece com `CURSOR_CONTEXT.md`
2. Use `CURSOR_PROMPT_BASE.md` para manutenção
3. Use `CURSOR_QUICK_PROMPT.md` para comandos rápidos

## 📝 Exemplos de Uso

### **Exemplo 1: Criando Novo Serviço**
```bash
# 1. Use CURSOR_PROMPT_BASE.md como contexto inicial
# 2. Execute o comando
./create-service.sh notification 3710 8010
# 3. Use TEMPLATES.md para referência
# 4. Use CURSOR_QUICK_PROMPT.md para comandos rápidos
```

### **Exemplo 2: Debugging**
```bash
# 1. Use CURSOR_QUICK_PROMPT.md para troubleshooting
# 2. Execute comandos de debug
git reset --hard 05d1121
docker-compose down && docker-compose up -d
# 3. Use CURSOR_PROMPT_BASE.md se precisar de mais contexto
```

### **Exemplo 3: Desenvolvimento de Feature**
```bash
# 1. Use CURSOR_CONTEXT.md para entender arquitetura
# 2. Use TEMPLATES.md para padrões
# 3. Use CURSOR_PROMPT_BASE.md para manutenção
# 4. Use CURSOR_QUICK_PROMPT.md para comandos
```

## 🔧 Dicas de Uso

### **1. Salvar Prompts Favoritos**
- Salve `CURSOR_QUICK_PROMPT.md` como snippet favorito
- Use atalhos de teclado para acesso rápido
- Mantenha versões personalizadas se necessário

### **2. Contexto Progressivo**
- Comece com o prompt mais simples
- Evolua para prompts mais detalhados conforme necessário
- Não sobrecarregue o Cursor com contexto desnecessário

### **3. Manutenção de Contexto**
- Use prompts para "recalibrar" o Cursor
- Quando o Cursor der respostas inconsistentes, use o prompt base
- Mantenha os prompts atualizados conforme o projeto evolui

### **4. Prompts Específicos**
- Para testes: Use `TEMPLATES.md` seção de testes
- Para APIs: Use `TEMPLATES.md` seção de FastAPI
- Para frontend: Use `TEMPLATES.md` seção de Vue.js

## 📚 Recursos Complementares

### **Documentação de Referência**
- `README.md` - Visão geral do projeto
- `ARCHITECTURE.md` - Arquitetura detalhada
- `DEVELOPMENT.md` - Guia de desenvolvimento
- `TROUBLESHOOTING.md` - Solução de problemas

### **Scripts de Automação**
- `create-service.sh` - Criar novos serviços
- `dev.sh` - Ambiente de desenvolvimento
- `docker-compose.yml` - Orquestração

### **Templates**
- `TEMPLATES.md` - Templates completos
- `CURSOR_SUMMARY.md` - Resumo de todos os elementos

## 🎯 Estratégia de Uso

### **Para Desenvolvedores Novos**
1. `CURSOR_CONTEXT.md` - Entender o projeto
2. `TEMPLATES.md` - Aprender padrões
3. `CURSOR_PROMPT_BASE.md` - Desenvolvimento diário
4. `CURSOR_QUICK_PROMPT.md` - Comandos rápidos

### **Para Desenvolvedores Experientes**
1. `CURSOR_QUICK_PROMPT.md` - Comandos rápidos
2. `CURSOR_PROMPT_BASE.md` - Contexto quando necessário
3. `TEMPLATES.md` - Referência para padrões
4. `create-service.sh` - Automação

### **Para Debugging**
1. `CURSOR_QUICK_PROMPT.md` - Troubleshooting rápido
2. `TROUBLESHOOTING.md` - Problemas específicos
3. `CURSOR_PROMPT_BASE.md` - Contexto completo se necessário

---

**🎯 Objetivo**: Manter o Cursor sempre no contexto correto do projeto Canonika, usando o prompt adequado para cada situação. 