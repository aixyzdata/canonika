# 🚀 Canonika - Plataforma de Microserviços

## 📋 Visão Geral

O **Canonika** é uma plataforma moderna de microserviços desenvolvida com arquitetura distribuída, oferecendo uma solução completa para gestão de dados, autenticação centralizada e segurança empresarial.

## 🏗️ Arquitetura

### **Microserviços Implementados**

| Serviço | Porta | Descrição | Status |
|---------|-------|-----------|--------|
| **Quarter** | 3700 | Ponto de entrada centralizado | ✅ Produção |
| **Template** | 3790 | Layout oficial da plataforma | ✅ Produção |
| **Harbor** | 3701 | Dashboard principal | ✅ Produção |
| **Guardian** | 3705 | Sistema de segurança | ✅ Produção |
| **Beacon** | 3703 | Sistema de monitoramento | ✅ Produção |
| **Keycloak** | 8080 | Identity Provider | ✅ Produção |
| **PostgreSQL** | 5432 | Banco de dados principal | ✅ Produção |
| **Redis** | 6379 | Cache e sessões | ✅ Produção |
| **OPA** | 8181 | Políticas de segurança | ✅ Produção |
| **ClickHouse** | 8123 | Analytics e logs | ✅ Produção |

### **Stack Tecnológica**

- **Frontend**: Vue.js 3 + Vite
- **Backend**: FastAPI (Python)
- **Banco de Dados**: PostgreSQL + ClickHouse
- **Cache**: Redis
- **Autenticação**: Keycloak
- **Segurança**: OPA (Open Policy Agent)
- **Containerização**: Docker + Docker Compose
- **Testes**: TDD + BDD (Vitest + Cypress)
- **Estilos**: SCSS + Design System compartilhado

## 🚀 Quick Start

### **Pré-requisitos**
```bash
# Docker e Docker Compose
docker --version
docker-compose --version

# Node.js (para desenvolvimento)
node --version
npm --version
```

### **Deploy Completo**
```bash
# 1. Clone o repositório
git clone https://github.com/aixyzdata/canonika.git
cd canonika

# 2. Inicie todos os serviços
docker-compose up -d

# 3. Acesse o Quarter (ponto de entrada)
open http://localhost:3700
```

### **Credenciais de Acesso**
- **Email**: `admin@canonika.io`
- **Senha**: `admin123`

## 📁 Estrutura do Projeto

```
canonika/
├── quarter/                    # Ponto de entrada centralizado
│   ├── web/                   # Frontend Vue.js
│   ├── api/                   # Backend FastAPI
│   └── nginx/                 # Proxy reverso
├── template/                  # Layout oficial da plataforma
│   └── web/                   # Frontend Vue.js
├── harbor/                    # Dashboard principal
│   └── web/                   # Frontend Vue.js
├── guardian/                  # Sistema de segurança
│   └── web/                   # Frontend Vue.js
├── beacon/                    # Sistema de monitoramento
│   └── web/                   # Frontend Vue.js
├── shared/                    # Recursos compartilhados
│   ├── styles/               # SCSS compartilhado
│   ├── components/           # Componentes Vue.js
│   └── config/               # Configurações
├── docs/                      # Documentação organizada
├── scripts/                   # Scripts de inicialização
├── policies/                  # Políticas OPA
└── docker-compose.yml         # Orquestração
```

## 🧪 Testes

### **Executar Todos os Testes**
```bash
# Testes do Quarter (TDD + BDD)
cd quarter
./run-tests.sh

# Testes de todos os serviços
docker-compose exec quarter npm test
docker-compose exec harbor npm test
docker-compose exec guardian npm test
```

## 🔐 Autenticação e Segurança

### **Fluxo de Autenticação**
1. **Quarter** (porta 3700) - Ponto de entrada
2. **Login** com credenciais
3. **Redirecionamento** para Harbor
4. **Logout** retorna ao Quarter

### **Segurança Implementada**
- ✅ **Keycloak**: SSO, MFA, OIDC/SAML
- ✅ **OPA**: Políticas ABAC/ReBAC
- ✅ **Redis**: Sessões e tokens
- ✅ **PostgreSQL**: Dados seguros
- ✅ **ClickHouse**: Auditoria e logs

## 🛠️ Desenvolvimento

### **Ambiente de Desenvolvimento**
```bash
# Instalar dependências
cd quarter/web && npm install
cd template/web && npm install
cd harbor/web && npm install
cd guardian/web && npm install

# Executar em modo desenvolvimento
cd quarter/web && npm run dev
cd template/web && npm run dev
cd harbor/web && npm run dev
cd guardian/web && npm run dev
```

### **Script de Desenvolvimento**
```bash
# Iniciar ambiente de desenvolvimento
./dev.sh start

# Aplicar mudanças CSS
./dev.sh css

# Ver status
./dev.sh status
```

## 📊 Monitoramento

### **Health Checks**
```bash
# Verificar status dos serviços
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Health checks individuais
curl http://localhost:3700/api/health      # Quarter
curl http://localhost:3790/api/health      # Template
curl http://localhost:3701/api/health      # Harbor
curl http://localhost:3705/api/health      # Guardian
```

## 🤝 Contribuição

### **Como Contribuir**
1. **Fork** o repositório
2. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
3. **Commit** suas mudanças: `git commit -am 'Adiciona nova funcionalidade'`
4. **Push** para a branch: `git push origin feature/nova-funcionalidade`
5. **Abra** um Pull Request

## 📚 Documentação

### **Documentação Organizada**
- 📖 [Documentação Principal](docs/README.md)
- 🏗️ [Arquitetura](docs/architecture/)
- 🛠️ [Desenvolvimento](docs/development/)
- 📖 [Guias](docs/guides/)

## 🎉 Status do Projeto

### **✅ Implementado**
- ✅ Arquitetura de microserviços
- ✅ Autenticação centralizada (Quarter)
- ✅ Layout oficial (Template)
- ✅ Dashboard principal (Harbor)
- ✅ Sistema de segurança (Guardian)
- ✅ Sistema de monitoramento (Beacon)
- ✅ Stack compartilhado (Keycloak, PostgreSQL, Redis, OPA, ClickHouse)
- ✅ Design System compartilhado (SCSS)
- ✅ Testes TDD e BDD completos
- ✅ CI/CD pipeline
- ✅ Documentação organizada

### **🚀 Próximos Passos**
- 🔄 Integração com Keycloak avançada
- 🔄 Temas personalizados
- 🔄 MFA (Multi-Factor Authentication)
- 🔄 Federação de identidade
- 🔄 Analytics avançados
- 🔄 Monitoramento em tempo real

## 📞 Suporte

### **Contato**
- 📧 **Email**: admin@canonika.io
- 🐛 **Issues**: [GitHub Issues](https://github.com/aixyzdata/canonika/issues)
- 📖 **Documentação**: [docs/](docs/)

---

## 🏆 **Canonika - A Plataforma do Futuro**

**🚀 Arquitetura moderna de microserviços**
**🔐 Segurança empresarial de ponta**
**🧪 Qualidade garantida por testes**
**📊 Monitoramento completo**
**🔄 CI/CD automatizado**
**🎨 Design System compartilhado**

**Acesse agora: http://localhost:3700** 🚪

---

*Desenvolvido com ❤️ pela equipe Canonika* 