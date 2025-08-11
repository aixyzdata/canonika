# 🚀 Canonika - Serviços

## 📋 Visão Geral

Esta documentação descreve todos os serviços da plataforma Canonika, suas funcionalidades e como interagem entre si.

## 🏗️ Arquitetura de Serviços

### **Serviços Principais**

| Serviço | Porta | Descrição | Status |
|---------|-------|-----------|--------|
| **Quarter** | 80 | Ponto de entrada centralizado | ✅ Produção |
| **Harbor** | 3701 | Dashboard principal | ✅ Produção |
| **Guardian** | 3705 | Sistema de segurança | ✅ Produção |
| **Beacon** | 3703 | Sistema de monitoramento | ✅ Produção |
| **Skipper** | 7722 | Sistema de IA e automação | ✅ Produção |
| **Tollgate** | 7732 | Sistema de controle de acesso | ✅ Produção |
| **Fisher** | 7733 | Sistema de dados e analytics | ✅ Produção |
| **Diver** | 7734 | Sistema de exploração de dados | ✅ Produção |

### **Serviços de Infraestrutura**

| Serviço | Porta | Descrição | Status |
|---------|-------|-----------|--------|
| **Keycloak** | 8080 | Identity Provider | ✅ Produção |
| **PostgreSQL** | 5432 | Banco de dados principal | ✅ Produção |
| **Redis** | 6379 | Cache e sessões | ✅ Produção |
| **OPA** | 8181 | Políticas de segurança | ✅ Produção |
| **ClickHouse** | 8123 | Analytics e logs | ✅ Produção |

## 🔧 Detalhes dos Serviços

### **Quarter - Ponto de Entrada**
- **Função**: Autenticação centralizada e redirecionamento
- **Tecnologia**: Vue.js + FastAPI
- **Responsabilidades**:
  - Login único (SSO)
  - Redirecionamento para serviços
  - Interface responsiva
  - Testes TDD/BDD completos

### **Harbor - Dashboard Principal**
- **Função**: Portal unificado que integra todos os serviços
- **Tecnologia**: Vue.js + FastAPI
- **Responsabilidades**:
  - Navegação entre serviços
  - Carregamento dinâmico de views
  - Identidade visual consistente
  - Logout integrado

### **Guardian - Segurança**
- **Função**: Sistema de segurança e monitoramento
- **Tecnologia**: Vue.js + FastAPI
- **Responsabilidades**:
  - Monitoramento de segurança
  - Políticas de acesso
  - Integração com Keycloak
  - Auditoria completa

### **Beacon - Monitoramento**
- **Função**: Sistema de monitoramento em tempo real
- **Tecnologia**: Vue.js + FastAPI
- **Responsabilidades**:
  - Monitoramento de serviços
  - Alertas em tempo real
  - Métricas de performance
  - Dashboard de status

### **Skipper - IA e Automação**
- **Função**: Sistema de IA e automação de processos
- **Tecnologia**: Vue.js + FastAPI + IA Agents
- **Responsabilidades**:
  - Automação de tarefas
  - Processamento de dados
  - Agentes de IA
  - Simulação de cenários

### **Tollgate - Controle de Acesso**
- **Função**: Sistema de controle de acesso e créditos
- **Tecnologia**: Vue.js + FastAPI
- **Responsabilidades**:
  - Controle de créditos
  - Limitação de acesso
  - Auditoria de uso
  - Políticas de consumo

### **Fisher - Dados e Analytics**
- **Função**: Sistema de dados e analytics
- **Tecnologia**: Vue.js + FastAPI + ClickHouse
- **Responsabilidades**:
  - Processamento de dados
  - Analytics avançados
  - Relatórios
  - Integração com SEFAZ

### **Diver - Exploração de Dados**
- **Função**: Sistema de exploração e análise de dados
- **Tecnologia**: Vue.js + FastAPI
- **Responsabilidades**:
  - Exploração de dados
  - Visualizações
  - Análise exploratória
  - Descoberta de insights

## 🔄 Interação Entre Serviços

### **Fluxo de Autenticação**
1. **Quarter** (porta 80) - Ponto de entrada
2. **Login** com credenciais
3. **Redirecionamento** para Harbor
4. **Navegação** para serviço específico
5. **Logout** retorna ao Quarter

### **Comunicação de Dados**
- **PostgreSQL**: Dados principais
- **Redis**: Cache e sessões
- **ClickHouse**: Analytics e logs
- **OPA**: Políticas de segurança
- **Keycloak**: Autenticação e autorização

## 🛠️ Desenvolvimento

### **Estrutura Padrão de Serviço**
```
{serviço}/
├── api/                    # Backend FastAPI
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── web/                    # Frontend Vue.js
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── components/
│   │   ├── views/
│   │   ├── services/
│   │   └── config/
│   ├── package.json
│   └── vite.config.js
├── nginx/                  # Proxy reverso (opcional)
│   └── nginx.conf
├── views/                  # Views específicas
│   └── {ServiceName}View.vue
└── README.md              # Documentação
```

### **Como Adicionar um Novo Serviço**

1. **Criar estrutura básica**
```bash
mkdir novo-servico
mkdir novo-servico/api
mkdir novo-servico/web
mkdir novo-servico/views
```

2. **Configurar backend (FastAPI)**
```python
# novo-servico/api/main.py
from fastapi import FastAPI

app = FastAPI(title="Novo Serviço")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

3. **Configurar frontend (Vue.js)**
```javascript
// novo-servico/web/src/main.js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

4. **Criar view específica**
```vue
<!-- novo-servico/views/NovoServicoView.vue -->
<template>
  <div class="novo-servico-view">
    <!-- Interface específica -->
  </div>
</template>

<script>
export default {
  name: 'NovoServicoView'
}
</script>
```

5. **Configurar no Harbor**
```javascript
// harbor/web/services.js
export const services = {
  'novo-servico': {
    name: 'NovoServico',
    title: 'Novo Serviço - Descrição',
    description: 'Descrição do novo serviço',
    icon: 'fas fa-icon',
    color: '#color',
    view: 'NovoServicoView',
    path: '../../novo-servico/views/NovoServicoView.vue'
  }
}
```

## 🧪 Testes

### **Testes por Serviço**
- Cada serviço pode ser testado independentemente
- APIs podem ser testadas isoladamente
- Integração testada no Harbor

### **Cobertura de Testes**
- ✅ **TDD (Test-Driven Development)**: 95%+ cobertura
- ✅ **BDD (Behavior-Driven Development)**: 100% fluxos críticos
- ✅ **API Tests**: 90%+ endpoints
- ✅ **E2E Tests**: Login, Logout, Navegação

## 📊 Monitoramento

### **Health Checks**
```bash
# Verificar status dos serviços
curl http://localhost:80/api/health      # Quarter
curl http://localhost:3701/api/health    # Harbor
curl http://localhost:3705/api/health    # Guardian
curl http://localhost:3703/api/health    # Beacon
```

### **Logs Centralizados**
- Todos os serviços logam para ClickHouse
- Monitoramento em tempo real
- Alertas automáticos

## 🔐 Segurança

### **Autenticação**
- **Keycloak**: SSO, MFA, OIDC/SAML
- **Redis**: Sessões e tokens
- **OPA**: Políticas ABAC/ReBAC

### **Autorização**
- Controle de acesso por serviço
- Políticas granulares
- Auditoria completa

## 🚀 Deploy

### **Desenvolvimento**
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ou usar script de desenvolvimento
./dev.sh start
```

### **Produção**
```bash
# Deploy completo
docker-compose -f docker-compose.yml up -d

# Deploy individual
docker-compose up -d [serviço]
```

## 📚 Documentação por Serviço

Cada serviço deve ter sua própria documentação:

- **README.md**: Visão geral do serviço
- **API.md**: Documentação da API
- **views/README.md**: Documentação das views
- **tests/**: Testes específicos

---

**🎯 Objetivo**: Manter uma arquitetura modular, escalável e bem documentada para todos os serviços da plataforma Canonika. 