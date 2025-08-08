# 🚀 Canonika - Prompt Base para Cursor

## 📋 Contexto Rápido

**Canonika** é uma plataforma de microserviços com arquitetura modular onde cada serviço mantém suas próprias views e o Harbor (portal central) as carrega dinamicamente.

## 🏗️ Estrutura Essencial

```
canonika/
├── quarter/ (porta 80)     # Ponto de entrada centralizado
├── harbor/ (porta 3701)    # Dashboard principal
├── guardian/ (porta 3705)  # Sistema de segurança
├── beacon/ (porta 3703)    # Sistema de monitoramento
├── shared/                 # Recursos compartilhados
└── [outros serviços]/
    ├── api/                # Backend FastAPI
    ├── web/                # Frontend Vue.js
    └── views/              # Views específicas
```

## 🛠️ Stack Tecnológica

- **Frontend**: Vue.js 3 + Vite + Tailwind CSS
- **Backend**: FastAPI (Python) + PostgreSQL + Redis
- **Infraestrutura**: Docker + Docker Compose + Nginx
- **Segurança**: Keycloak + OPA + ClickHouse
- **Testes**: TDD/BDD + Jest + Cypress

## 📝 Convenções de Código

### **Nomenclatura**
- **Arquivos**: kebab-case (`user-profile.vue`)
- **Componentes**: PascalCase (`UserProfile.vue`)
- **Variáveis**: camelCase (`userProfile`)
- **APIs**: snake_case (`get_user_profile`)
- **CSS**: kebab-case com prefixo `canonika-`

### **Estrutura Padrão de Serviço**
```vue
<template>
  <div class="service-view">
    <div class="view-header">
      <div class="view-title">{{ title }}</div>
      <div class="view-status">{{ status }}</div>
      <div class="view-actions"><!-- Ações --></div>
    </div>
    <div class="view-content"><!-- Conteúdo --></div>
  </div>
</template>
```

### **API FastAPI Padrão**
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Service Name")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "service-name"}
```

## 🚀 Fluxo de Desenvolvimento

### **Criar Novo Serviço**
```bash
./create-service.sh notification 3710 8010
```

### **Desenvolvimento**
```bash
# Ambiente de desenvolvimento
./dev.sh start

# Mudanças CSS (rápido)
./dev.sh css

# Mudanças estruturais (lento)
docker-compose build [serviço]
```

### **Testes**
```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Health checks
curl http://localhost:3701/api/health
```

## 🎯 Diretrizes Importantes

### **Frontend (Vue.js)**
- Componentes funcionais quando possível
- Composition API para lógica complexa
- Props para comunicação pai-filho
- Emits para comunicação filho-pai
- Seguir padrão de views do Harbor

### **Backend (FastAPI)**
- Seguir padrão REST com versionamento
- Usar Pydantic para validação
- Implementar health checks obrigatórios
- Documentar com OpenAPI/Swagger
- Usar async/await para operações I/O

### **Qualidade**
- **TDD**: 95%+ cobertura de testes
- **BDD**: 100% fluxos críticos
- **ESLint + Prettier**: Formatação automática
- **Black + Flake8**: Python code quality
- **Documentação**: README.md em cada serviço

## 🔧 Troubleshooting Rápido

### **Problemas Comuns**
```bash
# CSS quebrado
git reset --hard 05d1121
docker-compose down && docker-compose up -d

# Hot reload não funciona
cd harbor/web && npm run dev

# Portas em conflito
lsof -i :3701 && kill -9 <PID>
```

### **Commit Estável**
`05d1121` - "feat: padronização completa do view-header em todas as views"

## 📚 Recursos Essenciais

### **Documentação Principal**
- `CURSOR_CONTEXT.md` - Contexto completo
- `TEMPLATES.md` - Templates e exemplos
- `create-service.sh` - Script de automação
- `README.md` - Visão geral
- `ARCHITECTURE.md` - Arquitetura
- `DEVELOPMENT.md` - Guia de desenvolvimento

### **Portas Padrão**
- Quarter: 80 (ponto de entrada)
- Harbor: 3701 (dashboard)
- Guardian: 3705 (segurança)
- Beacon: 3703 (monitoramento)
- Skipper: 7722 (IA)
- Tollgate: 7732 (controle)

## 🎨 Design System

### **Cores Canonika**
- Primary: `#3b82f6` (blue-500)
- Success: `#10b981` (emerald-500)
- Warning: `#f59e0b` (amber-500)
- Error: `#ef4444` (red-500)
- Background: `#0f172a` (slate-900)

### **Estrutura Visual**
- Header com logo Canonika
- Sidebar com navegação
- Main content com view-header e view-content
- Status indicators com animações
- Responsive design mobile-first

## 🔐 Segurança

### **Autenticação**
- Keycloak para SSO
- Redis para sessões
- JWT para tokens
- OPA para políticas

### **Autorização**
- Controle de acesso por serviço
- Políticas granulares
- Auditoria completa

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

---

**🎯 Objetivo**: Manter uma plataforma modular, escalável e bem documentada, seguindo as melhores práticas de desenvolvimento e arquitetura de microserviços.

**📞 Suporte**: Para dúvidas técnicas, consulte a documentação ou abra uma issue no repositório. 