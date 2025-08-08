# 🚀 Canonika - Contexto para Cursor

## 📋 Visão Geral do Projeto

**Canonika** é uma plataforma moderna de microserviços desenvolvida com arquitetura distribuída, oferecendo uma solução completa para gestão de dados, autenticação centralizada e segurança empresarial.

### 🎯 Objetivos Técnicos
- **Modularidade**: Cada serviço é independente e pode ser desenvolvido/deployado separadamente
- **Escalabilidade**: Fácil adição de novos serviços sem impactar os existentes
- **Consistência**: Design unificado através do Harbor (portal central)
- **Segurança**: Autenticação centralizada com Keycloak e políticas OPA
- **Qualidade**: Testes TDD/BDD com 95%+ de cobertura

### 👥 Público-Alvo
- Desenvolvedores de microserviços
- Equipes de DevOps
- Administradores de sistemas empresariais
- Analistas de dados

### 💎 Valor Entregue
- Plataforma unificada para múltiplos serviços
- Autenticação centralizada (SSO)
- Monitoramento em tempo real
- Analytics avançados
- Segurança empresarial

## 🏗️ Organização do Código

### **Estrutura de Serviços**
```
canonika/
├── quarter/                    # Ponto de entrada centralizado (porta 80)
│   ├── api/                   # Backend FastAPI
│   ├── web/                   # Frontend Vue.js
│   └── nginx/                 # Proxy reverso
├── harbor/                    # Dashboard principal (porta 3701)
│   ├── api/                   # Backend FastAPI
│   └── web/                   # Frontend Vue.js
├── guardian/                  # Sistema de segurança (porta 3705)
│   ├── api/                   # Backend FastAPI
│   └── web/                   # Frontend Vue.js
├── beacon/                    # Sistema de monitoramento (porta 3703)
│   ├── api/                   # Backend FastAPI
│   └── web/                   # Frontend Vue.js
├── shared/                    # Recursos compartilhados
│   ├── styles/               # CSS compartilhado
│   └── config/               # Configurações
└── [outros serviços]/
    ├── api/                  # Backend FastAPI
    ├── web/                  # Frontend Vue.js
    └── views/                # Views específicas
```

### **Estrutura Padrão de Serviço**
```
{serviço}/
├── api/                       # Backend FastAPI
│   ├── main.py               # Ponto de entrada da API
│   ├── requirements.txt      # Dependências Python
│   └── Dockerfile           # Containerização
├── web/                       # Frontend Vue.js
│   ├── src/
│   │   ├── App.vue          # Componente principal
│   │   ├── main.js          # Ponto de entrada Vue
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── views/           # Páginas/views
│   │   ├── services/        # Serviços de API
│   │   ├── config/          # Configurações
│   │   └── styles/          # Estilos CSS
│   ├── package.json         # Dependências Node.js
│   └── vite.config.js       # Configuração Vite
├── nginx/                     # Proxy reverso (opcional)
│   └── nginx.conf           # Configuração Nginx
├── views/                     # Views específicas do Harbor
│   └── {ServiceName}View.vue
└── README.md                 # Documentação
```

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Vue.js 3**: Framework principal
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS (via canonika-theme.css)
- **Font Awesome**: Ícones
- **Vue Router**: Roteamento (quando necessário)

### **Backend**
- **FastAPI**: Framework Python para APIs
- **PostgreSQL**: Banco de dados principal
- **Redis**: Cache e sessões
- **ClickHouse**: Analytics e logs
- **OPA**: Políticas de segurança

### **Infraestrutura**
- **Docker**: Containerização
- **Docker Compose**: Orquestração
- **Nginx**: Proxy reverso
- **Keycloak**: Identity Provider

### **Testes**
- **Jest**: Testes unitários
- **Cypress**: Testes E2E
- **TDD**: Test-Driven Development
- **BDD**: Behavior-Driven Development

## 📝 Diretrizes de Desenvolvimento

### **APIs (FastAPI)**
- Seguir padrão REST com versionamento
- Usar Pydantic para validação de dados
- Implementar health checks em todos os serviços
- Documentar com OpenAPI/Swagger
- Usar async/await para operações I/O

### **Frontend (Vue.js)**
- Componentes funcionais quando possível
- Composition API para lógica complexa
- Props para comunicação pai-filho
- Emits para comunicação filho-pai
- Vuex/Pinia para estado global (quando necessário)

### **Testes**
- **TDD**: 95%+ cobertura de testes unitários
- **BDD**: 100% fluxos críticos testados
- **E2E**: Login, Logout, Navegação
- **API Tests**: 90%+ endpoints testados

### **Qualidade de Código**
- **ESLint + Prettier**: Formatação automática
- **Black + Flake8**: Python code quality
- **TypeScript**: Quando possível para JavaScript
- **Documentação**: README.md em cada serviço

## 🏷️ Convenções de Nomenclatura

### **Arquivos e Pastas**
- **kebab-case**: `user-profile.vue`, `api-service.js`
- **PascalCase**: `UserProfile.vue`, `ApiService.js` (componentes/classes)
- **camelCase**: `userProfile`, `apiService` (variáveis/funções)

### **Componentes Vue**
- **PascalCase**: `UserProfile.vue`, `ServiceCard.vue`
- **Prefixo de serviço**: `BeaconView.vue`, `HarborView.vue`

### **APIs FastAPI**
- **snake_case**: `get_user_profile`, `create_service`
- **Prefixo de serviço**: `quarter_`, `harbor_`, `guardian_`

### **Banco de Dados**
- **snake_case**: `user_profiles`, `service_configs`
- **Prefixo de serviço**: `quarter_`, `harbor_`, `guardian_`

### **CSS Classes**
- **kebab-case**: `user-profile`, `service-card`
- **Prefixo canonika**: `canonika-`, `canonika-header`, `canonika-layout`

## 🎨 Padrões de Design

### **Estrutura Padrão de View**
```vue
<template>
  <div class="service-view">
    <div class="view-header">
      <div class="view-title">{{ title }}</div>
      <div class="view-status">{{ status }}</div>
      <div class="view-actions">
        <!-- Ações -->
      </div>
    </div>
    <div class="view-content">
      <!-- Conteúdo específico -->
    </div>
  </div>
</template>
```

### **Estrutura Padrão de API**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Service Name")

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/health")
async def health_check():
    return HealthResponse(status="healthy", service="service-name")
```

### **Estrutura Padrão de Serviço**
```javascript
// services/ApiService.js
export class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async get(endpoint) {
    // Implementação
  }

  async post(endpoint, data) {
    // Implementação
  }
}
```

## 🔧 Diretrizes de Estilo

### **CSS/SCSS**
- Usar variáveis CSS para cores e espaçamentos
- Seguir metodologia BEM quando necessário
- Responsive design mobile-first
- Acessibilidade (WCAG 2.1)

### **JavaScript/TypeScript**
- Preferir const/let sobre var
- Usar arrow functions quando apropriado
- Destructuring para objetos/arrays
- Template literals para strings

### **Python**
- PEP 8 compliance
- Type hints obrigatórios
- Docstrings para funções públicas
- Virtual environments para cada projeto

## 🚀 Fluxo de Desenvolvimento

### **1. Criar Novo Serviço**
```bash
# Estrutura básica
mkdir novo-servico
mkdir novo-servico/api
mkdir novo-servico/web
mkdir novo-servico/views

# Configurar backend
cd novo-servico/api
# Criar main.py, requirements.txt, Dockerfile

# Configurar frontend
cd ../web
# Criar package.json, vite.config.js, src/
```

### **2. Desenvolvimento**
```bash
# Ambiente de desenvolvimento
./dev.sh start

# Mudanças CSS (rápido)
./dev.sh css

# Mudanças estruturais (lento)
docker-compose build [serviço]
```

### **3. Testes**
```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Testes de API
pytest api/tests/
```

### **4. Deploy**
```bash
# Desenvolvimento
docker-compose up -d

# Produção
docker-compose -f docker-compose.yml up -d
```

## 📚 Documentação

### **Arquivos Essenciais**
- **README.md**: Visão geral do projeto
- **ARCHITECTURE.md**: Arquitetura detalhada
- **DEVELOPMENT.md**: Guia de desenvolvimento
- **TROUBLESHOOTING.md**: Solução de problemas
- **SERVICES.md**: Documentação de serviços

### **Por Serviço**
- **README.md**: Visão geral do serviço
- **API.md**: Documentação da API
- **views/README.md**: Documentação das views

## 🔐 Segurança

### **Autenticação**
- **Keycloak**: SSO, MFA, OIDC/SAML
- **Redis**: Sessões e tokens
- **JWT**: Tokens de acesso

### **Autorização**
- **OPA**: Políticas ABAC/ReBAC
- **Controle de acesso**: Por serviço e endpoint
- **Auditoria**: Logs completos

## 📊 Monitoramento

### **Health Checks**
```bash
curl http://localhost:80/api/health      # Quarter
curl http://localhost:3701/api/health    # Harbor
curl http://localhost:3705/api/health    # Guardian
curl http://localhost:3703/api/health    # Beacon
```

### **Logs**
- Todos os serviços logam para ClickHouse
- Monitoramento em tempo real
- Alertas automáticos

## 🎯 Próximos Passos

### **Melhorias Planejadas**
- Integração avançada com Keycloak
- Temas personalizados
- MFA (Multi-Factor Authentication)
- Federação de identidade
- Analytics avançados
- Monitoramento em tempo real

### **Novos Serviços**
- Sistema de notificações
- Sistema de relatórios
- Sistema de backup
- Sistema de auditoria

---

**🎯 Objetivo**: Manter uma plataforma modular, escalável e bem documentada, seguindo as melhores práticas de desenvolvimento e arquitetura de microserviços.

**📞 Suporte**: Para dúvidas técnicas, consulte a documentação ou abra uma issue no repositório. 