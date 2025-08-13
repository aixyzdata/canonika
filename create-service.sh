#!/bin/bash

# Canonika - Script de Criação de Serviços
# Uso: ./create-service.sh <nome-do-servico> [porta-web] [porta-api]

SERVICE_NAME=$1
SERVICE_PORT=$2
API_PORT=$3

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se o nome do serviço foi fornecido
if [ -z "$SERVICE_NAME" ]; then
    print_error "Nome do serviço é obrigatório!"
    echo "Uso: ./create-service.sh <nome-do-servico> [porta-web] [porta-api]"
    echo "Exemplo: ./create-service.sh notification 3710 8010"
    exit 1
fi

# Valores padrão
WEB_PORT=${SERVICE_PORT:-3700}
API_PORT=${API_PORT:-8000}

# Converter nome para PascalCase (para o nome da view)
SERVICE_NAME_PASCAL=$(echo $SERVICE_NAME | sed 's/^./\U&/; s/-\([a-z]\)/\U\1/g')

print_info "🚀 Criando serviço: $SERVICE_NAME"
print_info "📡 Porta Web: $WEB_PORT"
print_info "🔌 Porta API: $API_PORT"
print_info "🎨 Nome da View: ${SERVICE_NAME_PASCAL}View"

# Verificar se o diretório já existe
if [ -d "$SERVICE_NAME" ]; then
    print_warning "Diretório $SERVICE_NAME já existe!"
    read -p "Deseja sobrescrever? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Operação cancelada."
        exit 1
    fi
    rm -rf "$SERVICE_NAME"
fi

# Criar estrutura de diretórios
print_status "Criando estrutura de diretórios..."
mkdir -p $SERVICE_NAME/{api,web/src,views,nginx}

# Criar arquivos da API
print_status "Criando arquivos da API..."

cat > $SERVICE_NAME/api/main.py << EOF
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(
    title="$SERVICE_NAME",
    description="Descrição do serviço $SERVICE_NAME",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

class ServiceData(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    active: bool = True

# Health Check
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="$SERVICE_NAME",
        version="1.0.0"
    )

# API Routes
@app.get("/api/v1/data")
async def get_data():
    """Obter dados do serviço"""
    return {"message": "Dados do serviço $SERVICE_NAME"}

@app.post("/api/v1/data")
async def create_data(data: ServiceData):
    """Criar novo dado"""
    return {"message": "Dado criado", "data": data}

@app.get("/api/v1/data/{item_id}")
async def get_data_by_id(item_id: int):
    """Obter dado por ID"""
    return {"message": f"Dado {item_id}", "id": item_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=$API_PORT)
EOF

cat > $SERVICE_NAME/api/requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
psycopg2-binary==2.9.9
redis==5.0.1
EOF

cat > $SERVICE_NAME/api/Dockerfile << EOF
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE $API_PORT

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$API_PORT"]
EOF

# Criar arquivos do Web
print_status "Criando arquivos do Web..."

cat > $SERVICE_NAME/web/package.json << EOF
{
  "name": "$SERVICE_NAME-web",
  "version": "1.0.0",
  "description": "$SERVICE_NAME Frontend",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.0.0",
    "vite": "^4.0.0"
  }
}
EOF

cat > $SERVICE_NAME/web/vite.config.js << EOF
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: $WEB_PORT
  }
})
EOF

cat > $SERVICE_NAME/web/index.html << EOF
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$SERVICE_NAME</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
EOF

cat > $SERVICE_NAME/web/src/main.js << EOF
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

console.log('🚀 $SERVICE_NAME iniciado com sucesso!')
EOF

cat > $SERVICE_NAME/web/src/App.vue << EOF
<template>
  <div class="service-app">
    <header class="service-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <i class="fas fa-icon"></i>
          </div>
          <div class="logo-text-container">
            <h1 class="logo-text">CANONIKA</h1>
            <span class="logo-subtitle">$SERVICE_NAME</span>
          </div>
        </div>
        
        <div class="header-actions">
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span>ONLINE</span>
          </div>
        </div>
      </div>
    </header>

    <main class="service-main">
      <div class="service-content">
        <h1>🚀 $SERVICE_NAME</h1>
        <p>Sistema em desenvolvimento</p>
        
        <div class="service-cards">
          <div class="service-card">
            <h3>📊 Status</h3>
            <p>Sistema funcionando perfeitamente!</p>
            <div class="status-badge success">Ativo</div>
          </div>
          
          <div class="service-card">
            <h3>⚙️ Configurações</h3>
            <p>Parâmetros do sistema</p>
            <div class="status-badge warning">Pendente</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: '${SERVICE_NAME_PASCAL}App',
  data() {
    return {
      title: '$SERVICE_NAME',
      status: 'online'
    }
  },
  methods: {
    async checkHealth() {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        console.log('Health check:', data)
      } catch (error) {
        console.error('Erro no health check:', error)
      }
    }
  },
  mounted() {
    this.checkHealth()
  }
}
</script>

<style>
.service-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.service-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid #475569;
  padding: 1rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: #94a3b8;
}

.service-main {
  padding: 2rem;
}

.service-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.service-card {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: left;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  display: inline-block;
  margin-top: 0.5rem;
}

.status-badge.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}
</style>
EOF

# Criar view para Harbor
print_status "Criando view para Harbor..."

cat > $SERVICE_NAME/views/${SERVICE_NAME_PASCAL}View.vue << EOF
<template>
  <div class="service-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-icon"></i>
        <span>{{ serviceTitle }}</span>
      </div>
      <div class="view-status">
        <div class="status-indicator" :class="statusClass"></div>
        <span>{{ statusText }}</span>
      </div>
      <div class="view-actions">
        <button @click="refreshData" class="action-btn">
          <i class="fas fa-sync-alt"></i>
          Atualizar
        </button>
        <button @click="openSettings" class="action-btn">
          <i class="fas fa-cog"></i>
          Configurações
        </button>
      </div>
    </div>

    <div class="view-content">
      <div class="content-header">
        <h2>{{ serviceName }}</h2>
        <p>{{ serviceDescription }}</p>
      </div>

      <div class="content-body">
        <div class="data-section">
          <h3>📊 Dados do Serviço</h3>
          <div class="data-grid">
            <div class="data-card" v-for="item in dataItems" :key="item.id">
              <div class="card-header">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </div>
              <div class="card-content">
                <p>{{ item.description }}</p>
                <div class="card-status" :class="item.statusClass">
                  {{ item.status }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <h3>⚡ Ações Rápidas</h3>
          <div class="actions-grid">
            <button 
              v-for="action in quickActions" 
              :key="action.id"
              @click="action.handler"
              class="action-card"
            >
              <i :class="action.icon"></i>
              <span>{{ action.title }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '${SERVICE_NAME_PASCAL}View',
  data() {
    return {
      serviceTitle: '$SERVICE_NAME',
      serviceName: 'Sistema $SERVICE_NAME',
      serviceDescription: 'Descrição do serviço $SERVICE_NAME e suas funcionalidades principais',
      status: 'online',
      dataItems: [
        {
          id: 1,
          title: 'Status Principal',
          description: 'Sistema funcionando normalmente',
          icon: 'fas fa-check-circle',
          status: 'Ativo',
          statusClass: 'success'
        },
        {
          id: 2,
          title: 'Configurações',
          description: 'Parâmetros do sistema',
          icon: 'fas fa-cog',
          status: 'Pendente',
          statusClass: 'warning'
        },
        {
          id: 3,
          title: 'Logs',
          description: 'Registros do sistema',
          icon: 'fas fa-file-alt',
          status: 'Disponível',
          statusClass: 'info'
        }
      ],
      quickActions: [
        {
          id: 1,
          title: 'Verificar Status',
          icon: 'fas fa-heartbeat',
          handler: this.checkStatus
        },
        {
          id: 2,
          title: 'Abrir Logs',
          icon: 'fas fa-list',
          handler: this.openLogs
        },
        {
          id: 3,
          title: 'Configurar',
          icon: 'fas fa-wrench',
          handler: this.openSettings
        }
      ]
    }
  },
  computed: {
    statusClass() {
      return this.status === 'online' ? 'online' : 'offline'
    },
    statusText() {
      return this.status === 'online' ? 'ONLINE' : 'OFFLINE'
    }
  },
  methods: {
    async refreshData() {
      console.log('Atualizando dados...')
      // Implementar lógica de atualização
    },
    openSettings() {
      console.log('Abrindo configurações...')
      // Implementar lógica de configurações
    },
    checkStatus() {
      console.log('Verificando status...')
      // Implementar verificação de status
    },
    openLogs() {
      console.log('Abrindo logs...')
      // Implementar visualização de logs
    }
  },
  mounted() {
    console.log('${SERVICE_NAME_PASCAL}View montado')
  }
}
</script>

<style scoped>
.service-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.canonika-view .view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid #334155;
}

.canonika-view .view-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
}

.canonika-view .view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.canonika-view .status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.canonika-view .status-indicator.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

.canonika-view .status-indicator.offline {
  background: #ef4444;
}

.canonika-view .view-actions {
  display: flex;
  gap: 0.5rem;
}

.canonika-view .action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid #3b82f6;
  color: #3b82f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.canonika-view .action-btn:hover {
  background: #3b82f6;
  color: white;
}

.canonika-view .view-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.content-header {
  text-align: center;
  margin-bottom: 2rem;
}

.content-header h2 {
  font-size: 2rem;
  color: #60a5fa;
  margin-bottom: 0.5rem;
}

.content-header p {
  color: #94a3b8;
  font-size: 1.1rem;
}

.data-section,
.actions-section {
  margin-bottom: 2rem;
}

.data-section h3,
.actions-section h3 {
  color: #f1f5f9;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.data-card {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #334155;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #60a5fa;
  font-weight: 600;
}

.card-content p {
  color: #94a3b8;
  margin-bottom: 1rem;
}

.card-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  display: inline-block;
}

.card-status.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.card-status.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.card-status.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #334155;
  border-radius: 0.75rem;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.action-card i {
  font-size: 1.5rem;
  color: #60a5fa;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
EOF

# Criar README do serviço
print_status "Criando documentação..."

cat > $SERVICE_NAME/README.md << EOF
# $SERVICE_NAME

## 📋 Descrição

$SERVICE_NAME é um serviço da plataforma Canonika que...

## 🚀 Início Rápido

### Desenvolvimento

\`\`\`bash
# API
cd $SERVICE_NAME/api
pip install -r requirements.txt
uvicorn main:app --reload --port $API_PORT

# Web
cd ../web
npm install
npm run dev
\`\`\`

### Produção

\`\`\`bash
# Build e deploy
docker-compose up -d $SERVICE_NAME
docker-compose up -d $SERVICE_NAME-web
\`\`\`

## 📡 API

### Health Check
\`\`\`bash
curl http://localhost:$API_PORT/health
\`\`\`

### Endpoints
- \`GET /api/v1/data\` - Obter dados
- \`POST /api/v1/data\` - Criar dados
- \`GET /api/v1/data/{id}\` - Obter dado por ID

## 🎨 Interface

Acesse a interface web em: http://localhost:$WEB_PORT

## 🔧 Configuração

### Variáveis de Ambiente
- \`DATABASE_URL\`: URL do banco de dados
- \`REDIS_URL\`: URL do Redis
- \`API_PORT\`: Porta da API (padrão: $API_PORT)

## 🧪 Testes

\`\`\`bash
# Testes da API
cd api
pytest

# Testes do Web
cd ../web
npm test
\`\`\`

## 📚 Documentação

- [API Documentation](http://localhost:$API_PORT/docs)
- [ReDoc](http://localhost:$API_PORT/redoc)
EOF

# Criar arquivo de configuração do Harbor
print_status "Criando configuração do Harbor..."

cat > $SERVICE_NAME/harbor-config.js << EOF
// Configuração para adicionar ao harbor/web/services.js
export const serviceConfig = {
  '$SERVICE_NAME': {
    name: '${SERVICE_NAME_PASCAL}',
    title: '$SERVICE_NAME - Descrição',
    description: 'Descrição do serviço $SERVICE_NAME',
    icon: 'fas fa-icon',
    color: '#3b82f6',
    view: '${SERVICE_NAME_PASCAL}View',
    path: '../../$SERVICE_NAME/views/${SERVICE_NAME_PASCAL}View.vue',
    port: $WEB_PORT,
    apiPort: $API_PORT
  }
}

// Configuração para adicionar ao harbor/web/main.js
// const ${SERVICE_NAME_PASCAL}View = await import('../../$SERVICE_NAME/views/${SERVICE_NAME_PASCAL}View.vue')
// app.component('${SERVICE_NAME_PASCAL}View', ${SERVICE_NAME_PASCAL}View.default)
EOF

# Criar arquivo de configuração do Docker Compose
print_status "Criando configuração do Docker Compose..."

cat > $SERVICE_NAME/docker-compose-config.yml << EOF
# Configuração para adicionar ao docker-compose.yml
services:
  $SERVICE_NAME:
    build:
      context: ./$SERVICE_NAME/api
      dockerfile: Dockerfile
    ports:
      - "$API_PORT:$API_PORT"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/$SERVICE_NAME
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - canonika-network

  $SERVICE_NAME-web:
    build:
      context: ./$SERVICE_NAME/web
      dockerfile: Dockerfile
    ports:
      - "$WEB_PORT:80"
    depends_on:
      - $SERVICE_NAME
    networks:
      - canonika-network
EOF

# Tornar o script executável
chmod +x $SERVICE_NAME/create-service.sh

print_status "Serviço $SERVICE_NAME criado com sucesso!"
echo
print_info "📁 Estrutura criada em: $SERVICE_NAME/"
echo
print_info "🔧 Próximos passos:"
echo "   1. cd $SERVICE_NAME/api && pip install -r requirements.txt"
echo "   2. cd ../web && npm install"
echo "   3. Adicionar configuração ao Harbor (ver harbor-config.js)"
echo "   4. Adicionar ao docker-compose.yml (ver docker-compose-config.yml)"
echo "   5. Testar o serviço"
echo
print_info "📚 Documentação criada:"
echo "   - README.md: Documentação do serviço"
echo "   - harbor-config.js: Configuração do Harbor"
echo "   - docker-compose-config.yml: Configuração do Docker"
echo
print_warning "⚠️  Lembre-se de:"
echo "   - Configurar ícones apropriados (Font Awesome)"
echo "   - Ajustar cores e branding"
echo "   - Implementar lógica específica do serviço"
echo "   - Adicionar testes"
echo "   - Documentar APIs" 