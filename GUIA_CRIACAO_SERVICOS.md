# 🚀 Guia de Criação de Serviços - Canonika

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de um Serviço](#estrutura-de-um-serviço)
3. [Padrões de Nomenclatura](#padrões-de-nomenclatura)
4. [Configuração de Portas](#configuração-de-portas)
5. [Estrutura de Arquivos](#estrutura-de-arquivos)
6. [Implementação do Frontend](#implementação-do-frontend)
7. [Integração com Harbor](#integração-com-harbor)
8. [Página de Status](#página-de-status)
9. [Scripts de Desenvolvimento](#scripts-de-desenvolvimento)
10. [Docker e Deploy](#docker-e-deploy)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O projeto Canonika segue uma arquitetura de microserviços onde cada serviço é independente mas integrado através do Harbor (portal principal). Este guia define todos os padrões e estruturas necessários para criar um novo serviço.

### 🏗️ Arquitetura Atual
- **Harbor**: Portal principal (porta 3701)
- **Skipper**: Simulação e pesquisa (porta 3702)
- **Tollgate**: Controle de pedágios (porta 3703)
- **Quarter**: Gestão de quartéis (porta 3704)
- **Diver**: Busca e exploração (porta 3705)
- **Fisher**: Pesca de dados (porta 3706)
- **Dock**: Gestão de docas (porta 3707)
- **Beacon**: Sinalização (porta 3708)
- **Echo**: Comunicação (porta 3709)
- **Guardian**: Segurança (porta 3710)
- **Mapmaker**: Criação de mapas (porta 3711)
- **Seagull**: Vigilância (porta 3712)
- **Wayfinder**: Navegação (porta 3713)

---

## 📁 Estrutura de um Serviço

### Estrutura Básica
```
servico-nome/
├── api/
│   ├── main.py
│   └── requirements.txt
├── web/
│   ├── index.html
│   ├── main.js
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.vue
│       └── views/
│           ├── ServicoView.vue
│           └── StatusView.vue
├── views/
│   └── StatusView.vue
├── Dockerfile
├── nginx/
│   └── nginx.conf
├── start.sh
├── stop.sh
└── test.sh
```

---

## 🏷️ Padrões de Nomenclatura

### Nome do Serviço
- **Formato**: Nome em inglês, substantivo
- **Exemplos**: `diver`, `fisher`, `skipper`, `tollgate`
- **Convenção**: lowercase, sem hífens

### Arquivos e Pastas
- **View principal**: `ServicoView.vue` (ex: `DiverView.vue`)
- **View de status**: `StatusView.vue`
- **Pasta views**: `views/` (dentro do serviço)
- **Pasta web**: `web/` (frontend Vue.js)

---

## 🔌 Configuração de Portas

### Range de Portas
- **Intervalo**: 3700-3750
- **Atribuição**: Sequencial por ordem de criação
- **Exemplo**: Diver (3705), Fisher (3706), Dock (3707)

### Configuração no Docker
```yaml
# docker-compose.yml
services:
  novo-servico:
    ports:
      - "370X:80"  # X = próxima porta disponível
```

---

## 📄 Estrutura de Arquivos

### 1. API (Backend)
```python
# api/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Novo Serviço")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Novo Serviço API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### 2. Frontend (Vue.js)
```javascript
// web/package.json
{
  "name": "novo-servico-web",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.4.0"
  }
}
```

### 3. Vite Config
```javascript
// web/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist'
  }
})
```

### 4. Nginx Config
```nginx
# nginx/nginx.conf
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80;

        location /api/ {
            proxy_pass         http://localhost:8000/;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;
        }

        location / {
            root /usr/share/nginx/html/dist;
            try_files $uri $uri/ /index.html;
            index index.html;
        }
    }
}
```

### 5. Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/dist
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🎨 Implementação do Frontend

### 1. View Principal
```vue
<!-- web/src/views/ServicoView.vue -->
<template>
  <div class="canonika-view">
    <CanonikaViewTemplate
      :title="'Novo Serviço'"
      :description="'Descrição do novo serviço'"
      :icon="'fa-cog'"
      :primary-action="'Ação Principal'"
      @primary-action="handlePrimaryAction"
    >
      <div class="view-content">
        <!-- Conteúdo específico do serviço -->
        <div class="service-dashboard">
          <h3>Dashboard do Serviço</h3>
          <p>Conteúdo específico aqui...</p>
        </div>
      </div>
    </CanonikaViewTemplate>
  </div>
</template>

<script>
import CanonikaViewTemplate from '../../../../shared/templates/CanonikaViewTemplate.vue'
import '../../../../shared/styles/canonika-view.css'

export default {
  name: 'ServicoView',
  components: {
    CanonikaViewTemplate
  },
  methods: {
    handlePrimaryAction() {
      console.log('Ação principal executada')
    }
  }
}
</script>

<style scoped>
.service-dashboard {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
```

### 2. View de Status
```vue
<!-- views/StatusView.vue -->
<template>
  <div class="canonika-view">
    <CanonikaViewTemplate
      title="Status do Serviço"
      description="Monitoramento e métricas do serviço"
      icon="fa-chart-line"
    >
      <div class="status-content">
        <!-- Status do Serviço -->
        <div class="status-section">
          <h3>Status do Serviço</h3>
          <div class="status-grid">
            <div class="status-card">
              <div class="status-indicator online"></div>
              <span>Online</span>
            </div>
            <div class="status-card">
              <div class="status-indicator warning"></div>
              <span>Uptime: 99.9%</span>
            </div>
          </div>
        </div>

        <!-- Métricas de Performance -->
        <div class="metrics-section">
          <h3>Métricas de Performance</h3>
          <div class="metrics-grid">
            <div class="metric-card">
              <h4>Requisições/min</h4>
              <span class="metric-value">1,234</span>
            </div>
            <div class="metric-card">
              <h4>Tempo de resposta</h4>
              <span class="metric-value">45ms</span>
            </div>
          </div>
        </div>

        <!-- Logs Recentes -->
        <div class="logs-section">
          <h3>Logs Recentes</h3>
          <div class="logs-list">
            <div class="log-entry">
              <span class="log-time">2024-01-15 10:30:15</span>
              <span class="log-level info">INFO</span>
              <span class="log-message">Serviço iniciado com sucesso</span>
            </div>
          </div>
        </div>

        <!-- Configurações do Sistema -->
        <div class="config-section">
          <h3>Configurações do Sistema</h3>
          <div class="config-grid">
            <div class="config-item">
              <span class="config-label">Versão:</span>
              <span class="config-value">1.0.0</span>
            </div>
            <div class="config-item">
              <span class="config-label">Porta:</span>
              <span class="config-value">370X</span>
            </div>
          </div>
        </div>
      </div>
    </CanonikaViewTemplate>
  </div>
</template>

<script>
import CanonikaViewTemplate from '../../shared/templates/CanonikaViewTemplate.vue'
import '../../shared/styles/canonika-view.css'

export default {
  name: 'StatusView',
  components: {
    CanonikaViewTemplate
  }
}
</script>

<style scoped>
.status-content {
  padding: 20px;
}

.status-section, .metrics-section, .logs-section, .config-section {
  margin-bottom: 30px;
}

.status-grid, .metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.status-card, .metric-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #10b981;
}

.status-indicator.warning {
  background: #f59e0b;
}

.metric-value {
  font-size: 1.5em;
  font-weight: bold;
  color: #3b82f6;
}

.logs-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.log-entry {
  padding: 10px 15px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 15px;
  align-items: center;
}

.log-time {
  color: #6b7280;
  font-size: 0.9em;
}

.log-level {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.log-level.info {
  background: #dbeafe;
  color: #1e40af;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.config-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
}

.config-label {
  font-weight: bold;
  color: #374151;
}

.config-value {
  color: #3b82f6;
}
</style>
```

---

## 🔗 Integração com Harbor

### 1. Configuração no services.js
```javascript
// harbor/web/services.js
export const services = {
  // ... outros serviços
  novoServico: {
    name: "Novo Serviço",
    description: "Descrição do novo serviço",
    icon: "fa-cog",
    port: 370X,
    color: "#3b82f6", // Azul padrão
    status: "online"
  }
}
```

### 2. Configuração no status-configs.js
```javascript
// shared/config/status-configs.js
export const serviceConfigs = {
  // ... outros serviços
  novoServico: {
    name: "Novo Serviço",
    description: "Descrição detalhada do serviço",
    icon: "fa-cog",
    color: "#3b82f6",
    metrics: {
      uptime: "99.9%",
      requests: "1,234/min",
      responseTime: "45ms",
      errors: "0.1%"
    },
    recentActivity: [
      {
        time: "2024-01-15 10:30:15",
        level: "INFO",
        message: "Serviço iniciado com sucesso"
      }
    ],
    systemStatus: {
      status: "online",
      version: "1.0.0",
      port: 370X,
      lastRestart: "2024-01-15 10:30:00"
    },
    configurations: {
      version: "1.0.0",
      port: 370X,
      environment: "production",
      database: "connected"
    },
    actions: [
      {
        name: "Reiniciar",
        icon: "fa-redo",
        action: "restart"
      },
      {
        name: "Logs",
        icon: "fa-file-alt",
        action: "logs"
      }
    ]
  }
}
```

### 3. Menu no App.vue
```vue
<!-- harbor/web/App.vue -->
<template>
  <!-- ... menu existente ... -->
  <div class="menu-item" @click="toggleSubmenu('novoServico')">
    <i class="fas fa-cog"></i>
    <span>Novo Serviço</span>
    <i class="fas fa-chevron-down" :class="{ 'rotated': openSubmenus.novoServico }"></i>
  </div>
  <div class="submenu" v-if="openSubmenus.novoServico">
    <router-link to="/novo-servico/status" class="submenu-item">
      <i class="fas fa-chart-line"></i>
      <span>Status</span>
    </router-link>
  </div>
  <!-- ... resto do menu ... -->
</template>

<script>
export default {
  data() {
    return {
      openSubmenus: {
        // ... outros serviços
        novoServico: false
      }
    }
  },
  methods: {
    toggleSidebar() {
      // ... lógica existente ...
      this.openSubmenus.novoServico = !this.openSubmenus.novoServico
    }
  }
}
</script>
```

### 4. Rotas no routes.js
```javascript
// harbor/web/routes.js
import NovoServicoView from '../../novo-servico/web/src/views/NovoServicoView.vue'
import NovoServicoStatusView from '../../novo-servico/views/StatusView.vue'

export const routes = [
  // ... rotas existentes ...
  {
    path: '/novo-servico',
    name: 'NovoServico',
    component: NovoServicoView
  },
  {
    path: '/novo-servico/status',
    name: 'NovoServicoStatus',
    component: NovoServicoStatusView
  }
]
```

---

## 📊 Página de Status

### Padrão Obrigatório
Todos os serviços devem ter uma página de status que inclui:

1. **Status do Serviço**
   - Indicador online/offline
   - Uptime
   - Tempo de resposta

2. **Métricas de Performance**
   - Requisições por minuto
   - Tempo de resposta médio
   - Taxa de erro

3. **Logs Recentes**
   - Últimas 10 entradas
   - Timestamp, nível, mensagem

4. **Configurações do Sistema**
   - Versão
   - Porta
   - Ambiente
   - Conexões

5. **Ações Disponíveis**
   - Reiniciar serviço
   - Ver logs
   - Configurar

### Template Padrão
Use sempre o `CanonikaViewTemplate` e importe o CSS global:

```vue
<template>
  <div class="canonika-view">
    <CanonikaViewTemplate
      title="Status do Serviço"
      description="Monitoramento e métricas"
      icon="fa-chart-line"
    >
      <!-- Conteúdo específico -->
    </CanonikaViewTemplate>
  </div>
</template>

<script>
import CanonikaViewTemplate from '../../shared/templates/CanonikaViewTemplate.vue'
import '../../shared/styles/canonika-view.css'

export default {
  components: { CanonikaViewTemplate }
}
</script>
```

---

## 🛠️ Scripts de Desenvolvimento

### Scripts Obrigatórios
Cada serviço deve ter os seguintes scripts:

```bash
# start.sh
#!/bin/bash
echo "🚀 Iniciando Novo Serviço..."
cd api && python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
cd ../web && npm run dev &
echo "✅ Novo Serviço iniciado em http://localhost:370X"
```

```bash
# stop.sh
#!/bin/bash
echo "🛑 Parando Novo Serviço..."
pkill -f "uvicorn main:app"
pkill -f "vite"
echo "✅ Novo Serviço parado"
```

```bash
# test.sh
#!/bin/bash
echo "🧪 Testando Novo Serviço..."
curl -f http://localhost:370X/api/health || exit 1
echo "✅ Testes passaram"
```

### Permissões
```bash
chmod +x start.sh stop.sh test.sh
```

---

## 🐳 Docker e Deploy

### 1. Build do Frontend
```bash
cd novo-servico/web
npm install
npm run build
```

### 2. Deploy no Container
```bash
docker cp novo-servico/web/dist/. canonika-novo-servico-1:/usr/share/nginx/html/dist/
```

### 3. Verificação
```bash
curl http://localhost:370X
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. CSS não carrega
```bash
# Solução
cd harbor/web
npm run build
docker cp dist/. canonika-harbor-1:/usr/share/nginx/html/dist/
```

#### 2. Hot reload não funciona
```bash
# Verificar se o Vite está rodando
cd novo-servico/web
npm run dev
```

#### 3. Erro de import
```bash
# Verificar caminhos relativos
# De: ../../../shared/
# Para: ../../shared/
```

#### 4. Porta já em uso
```bash
# Verificar portas
lsof -i :370X
# Matar processo se necessário
kill -9 PID
```

#### 5. Build falha
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Comandos de Debug
```bash
# Verificar logs do container
docker logs canonika-novo-servico-1

# Entrar no container
docker exec -it canonika-novo-servico-1 sh

# Verificar arquivos no container
docker exec canonika-novo-servico-1 ls -la /usr/share/nginx/html/dist/
```

---

## 📝 Checklist de Criação

### ✅ Estrutura Básica
- [ ] Criar pasta do serviço
- [ ] Configurar API (main.py)
- [ ] Configurar Frontend (Vue.js)
- [ ] Configurar Nginx
- [ ] Configurar Dockerfile

### ✅ Integração
- [ ] Adicionar ao services.js
- [ ] Adicionar ao status-configs.js
- [ ] Adicionar menu no App.vue
- [ ] Adicionar rotas no routes.js
- [ ] Criar StatusView.vue

### ✅ Scripts
- [ ] Criar start.sh
- [ ] Criar stop.sh
- [ ] Criar test.sh
- [ ] Dar permissões de execução

### ✅ Deploy
- [ ] Build do frontend
- [ ] Deploy no container
- [ ] Testar acesso
- [ ] Verificar hot reload

### ✅ Documentação
- [ ] Atualizar este guia
- [ ] Documentar funcionalidades específicas
- [ ] Criar README do serviço

---

## 🎯 Exemplo Completo

Para criar um novo serviço chamado "Scanner":

1. **Criar estrutura**:
```bash
mkdir scanner
cd scanner
mkdir api web views nginx
```

2. **Configurar API**:
```python
# api/main.py
from fastapi import FastAPI
app = FastAPI(title="Scanner")
@app.get("/health")
async def health():
    return {"status": "healthy"}
```

3. **Configurar Frontend**:
```bash
cd web
npm init -y
npm install vue vue-router
npm install -D @vitejs/plugin-vue vite
```

4. **Criar views**:
```vue
<!-- web/src/views/ScannerView.vue -->
<template>
  <div class="canonika-view">
    <CanonikaViewTemplate title="Scanner" description="Serviço de escaneamento" icon="fa-search">
      <!-- Conteúdo -->
    </CanonikaViewTemplate>
  </div>
</template>
```

5. **Integrar com Harbor**:
- Adicionar ao services.js
- Adicionar menu no App.vue
- Adicionar rotas no routes.js

6. **Deploy**:
```bash
cd web && npm run build
docker cp dist/. canonika-scanner-1:/usr/share/nginx/html/dist/
```

---

## 📚 Recursos Adicionais

- **Vue.js**: https://vuejs.org/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Vite**: https://vitejs.dev/
- **Nginx**: https://nginx.org/
- **Docker**: https://docker.com/

---

*Última atualização: Janeiro 2024*
*Versão: 1.0* 