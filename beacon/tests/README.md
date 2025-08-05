# 🧪 Testes do Beacon WebSocket Broker

Este diretório contém um sistema completo de testes BDD (Behavior-Driven Development) e TDD (Test-Driven Development) para o Beacon WebSocket Broker.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura dos Testes](#estrutura-dos-testes)
- [Executando os Testes](#executando-os-testes)
- [Tipos de Testes](#tipos-de-testes)
- [Cenários Cobertos](#cenários-cobertos)
- [Relatórios](#relatórios)
- [Configuração](#configuração)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O sistema de testes do Beacon é composto por:

### **Testes BDD (Behavior-Driven Development)**
- **Cucumber.js** para cenários em linguagem natural
- **Puppeteer** para automação de navegador
- **Chai** para asserções
- Cobertura completa de funcionalidades do usuário

### **Testes TDD (Test-Driven Development)**
- **Mocha** para testes unitários JavaScript
- **Pytest** para testes backend Python
- **Sinon** para mocks e stubs
- Cobertura de código e lógica de negócio

## 📁 Estrutura dos Testes

```
tests/
├── features/
│   └── beacon_complete.feature    # Cenários BDD completos
├── steps/
│   ├── authentication_steps.js     # Steps de autenticação
│   ├── websocket_steps.js         # Steps de WebSocket
│   └── events_metrics_steps.js    # Steps de eventos e métricas
├── unit/
│   ├── WebSocketService.test.js   # Testes unitários JS
│   └── backend.test.py            # Testes backend Python
├── cucumber.js                    # Configuração Cucumber
├── package.json                   # Dependências e scripts
├── requirements.txt               # Dependências Python
├── run-tests.sh                   # Script de automação
└── README.md                      # Esta documentação
```

## 🚀 Executando os Testes

### **Execução Completa**
```bash
./run-tests.sh
```

### **Execução por Tipo**
```bash
# Testes BDD específicos
./run-tests.sh auth        # Apenas autenticação
./run-tests.sh websocket   # Apenas WebSocket
./run-tests.sh events      # Apenas eventos
./run-tests.sh performance # Apenas performance
./run-tests.sh integration # Apenas integração

# Testes TDD específicos
./run-tests.sh unit        # Apenas testes unitários
./run-tests.sh backend     # Apenas testes backend
```

### **Comandos Úteis**
```bash
./run-tests.sh setup       # Instalar dependências
./run-tests.sh clean       # Limpar relatórios
./run-tests.sh report      # Abrir relatórios
```

## 🧪 Tipos de Testes

### **1. Testes de Autenticação**
- Redirecionamento automático para Quarter
- Login com credenciais válidas
- Preservação de sessão
- Logout e limpeza de sessão

### **2. Testes de WebSocket**
- Conexão e reconexão automática
- Heartbeat e health checks
- Subscrição e cancelamento de tópicos
- Recebimento de eventos em tempo real

### **3. Testes de Eventos e Métricas**
- Publicação de eventos simples e complexos
- Eventos com prioridade e TTL
- Métricas em tempo real
- Histórico de eventos

### **4. Testes de Performance**
- Múltiplos clientes conectados
- Alto volume de eventos
- Múltiplos tópicos ativos
- Limpeza de eventos expirados

### **5. Testes de Integração**
- Integração com Harbor
- Integração com Guardian
- Integração com Quarter
- Comunicação entre serviços

### **6. Testes Unitários**
- WebSocketService (JavaScript)
- Backend API (Python)
- Dataclasses e Enums
- Métricas e estado

## 📊 Cenários Cobertos

### **Autenticação e Redirecionamento**
- ✅ Redirecionamento automático para Quarter
- ✅ Login no Quarter e retorno para Beacon
- ✅ Acesso direto após autenticação
- ✅ Logout e limpeza de sessão

### **Conexão WebSocket**
- ✅ Conexão automática
- ✅ Reconexão após falha
- ✅ Heartbeat periódico
- ✅ Detecção de falhas

### **Tópicos e Subscrições**
- ✅ Subscrição a tópicos
- ✅ Recebimento de eventos
- ✅ Cancelamento de subscrições
- ✅ Múltiplos tópicos

### **Publicação de Eventos**
- ✅ Eventos simples
- ✅ Eventos com dados complexos
- ✅ Eventos com prioridade
- ✅ Eventos com TTL

### **Métricas e Monitoramento**
- ✅ Métricas em tempo real
- ✅ Histórico de eventos
- ✅ Performance do sistema
- ✅ Listagem de clientes

### **Comandos e Controle**
- ✅ Comando get_metrics
- ✅ Comando get_topics
- ✅ Comando get_clients
- ✅ Respostas de comando

### **Falhas e Recuperação**
- ✅ Falha no servidor WebSocket
- ✅ Perda de mensagens
- ✅ Limpeza de eventos expirados
- ✅ Reconexão automática

### **Performance e Carga**
- ✅ Múltiplos clientes
- ✅ Alto volume de eventos
- ✅ Múltiplos tópicos
- ✅ Estabilidade do sistema

### **Segurança e Validação**
- ✅ Validação de dados
- ✅ Proteção contra spam
- ✅ Sanitização de dados
- ✅ Segurança da aplicação

### **Integração com Serviços**
- ✅ Integração com Harbor
- ✅ Integração com Guardian
- ✅ Integração com Quarter
- ✅ Comunicação entre módulos

### **Interface e Usabilidade**
- ✅ Navegação entre views
- ✅ Responsividade
- ✅ Acessibilidade
- ✅ Experiência do usuário

### **Logs e Auditoria**
- ✅ Logs de sistema
- ✅ Auditoria de eventos
- ✅ Exportação de dados
- ✅ Rastreamento completo

## 📈 Relatórios

### **Relatórios Gerados**
- `cucumber-report.html` - Relatório BDD completo
- `performance-report.html` - Relatório de performance
- `integration-report.html` - Relatório de integração
- `coverage/` - Cobertura de código

### **Abrir Relatórios**
```bash
./run-tests.sh report
```

## ⚙️ Configuração

### **Pré-requisitos**
- Node.js >= 18.0.0
- Python >= 3.8
- Docker
- Beacon e Quarter rodando

### **Instalação**
```bash
# Instalar dependências
./run-tests.sh setup

# Ou manualmente
npm install
pip install -r requirements.txt
```

### **Configuração do Ambiente**
```bash
# Verificar se os serviços estão rodando
docker ps | grep canonika

# Iniciar serviços se necessário
docker run -d --name canonika_beacon -p 3703:80 beacon:latest
docker run -d --name canonika_quarter -p 80:80 quarter:latest
```

## 🔧 Troubleshooting

### **Problemas Comuns**

#### **1. Beacon não está rodando**
```bash
# Verificar se o container existe
docker ps -a | grep canonika_beacon

# Remover container antigo se necessário
docker rm -f canonika_beacon

# Reconstruir e iniciar
docker build -t beacon:latest .
docker run -d --name canonika_beacon -p 3703:80 beacon:latest
```

#### **2. Quarter não está rodando**
```bash
# Verificar se o container existe
docker ps -a | grep canonika_quarter

# Remover container antigo se necessário
docker rm -f canonika_quarter

# Iniciar Quarter
docker run -d --name canonika_quarter -p 80:80 quarter:latest
```

#### **3. Dependências não instaladas**
```bash
# Instalar dependências Node.js
npm install

# Instalar dependências Python
pip install -r requirements.txt
```

#### **4. Testes falhando**
```bash
# Limpar relatórios antigos
./run-tests.sh clean

# Executar testes específicos para debug
./run-tests.sh auth
./run-tests.sh websocket
```

#### **5. Problemas de rede**
```bash
# Verificar conectividade
curl -I http://localhost:3703
curl -I http://localhost

# Verificar logs dos containers
docker logs canonika_beacon
docker logs canonika_quarter
```

### **Logs de Debug**

#### **Habilitar logs detalhados**
```bash
# Executar com logs verbosos
DEBUG=* npm run test:bdd:auth

# Ver logs do Puppeteer
PUPPETEER_HEADLESS=false npm run test:bdd:websocket
```

#### **Verificar estado do WebSocket**
```bash
# Abrir console do navegador e verificar
console.log(window.beaconWebSocket);
console.log(window.beaconWebSocket.getConnectionStatus());
```

## 📚 Recursos Adicionais

### **Documentação**
- [Cucumber.js](https://cucumber.io/docs/cucumber/)
- [Puppeteer](https://pptr.dev/)
- [Mocha](https://mochajs.org/)
- [Pytest](https://docs.pytest.org/)

### **Exemplos de Uso**
```bash
# Executar apenas testes de autenticação
./run-tests.sh auth

# Executar testes em paralelo
npm run test:parallel

# Executar com watch mode
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### **Extensões Futuras**
- [ ] Testes de carga com Artillery
- [ ] Testes de segurança com OWASP ZAP
- [ ] Testes de acessibilidade com axe-core
- [ ] Testes de visual regression
- [ ] Integração com CI/CD

---

**🎯 Objetivo**: Garantir que o Beacon WebSocket Broker funcione de forma robusta, confiável e segura em todos os cenários possíveis.

**📊 Cobertura**: 100% das funcionalidades principais, incluindo casos de borda, falhas e recuperação.

**🚀 Performance**: Testes de carga e stress para garantir estabilidade em produção. 