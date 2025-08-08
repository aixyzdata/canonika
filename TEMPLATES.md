# 🎨 Canonika - Templates e Exemplos

## 📋 Templates para Novos Serviços

### **1. Template de API FastAPI**

```python
# api/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(
    title="Service Name",
    description="Descrição do serviço",
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
        service="service-name",
        version="1.0.0"
    )

# API Routes
@app.get("/api/v1/data")
async def get_data():
    """Obter dados do serviço"""
    return {"message": "Dados do serviço"}

@app.post("/api/v1/data")
async def create_data(data: ServiceData):
    """Criar novo dado"""
    return {"message": "Dado criado", "data": data}

@app.get("/api/v1/data/{item_id}")
async def get_data_by_id(item_id: int):
    """Obter dado por ID"""
    return {"message": f"Dado {item_id}", "id": item_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

```txt
# api/requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
psycopg2-binary==2.9.9
redis==5.0.1
```

```dockerfile
# api/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **2. Template de Frontend Vue.js**

```javascript
// web/package.json
{
  "name": "service-name-web",
  "version": "1.0.0",
  "description": "Service Name Frontend",
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
```

```javascript
// web/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3700
  }
})
```

```html
<!-- web/index.html -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Name</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

```javascript
// web/src/main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

console.log('🚀 Service Name iniciado com sucesso!')
```

```vue
<!-- web/src/App.vue -->
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
            <span class="logo-subtitle">SERVICE NAME</span>
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
        <h1>🚀 Service Name</h1>
        <p>Sistema de exemplo</p>
        
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
  name: 'ServiceApp',
  data() {
    return {
      title: 'Service Name',
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
/* Estilos básicos - usar canonika-theme.css em produção */
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
```

### **3. Template de View para Harbor**

```vue
<!-- views/ServiceNameView.vue -->
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
  name: 'ServiceNameView',
  data() {
    return {
      serviceTitle: 'Service Name',
      serviceName: 'Sistema de Exemplo',
      serviceDescription: 'Descrição do serviço e suas funcionalidades principais',
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
    console.log('ServiceNameView montado')
  }
}
</script>

<style scoped>
.service-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid #334155;
}

.view-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
}

.view-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #10b981;
  animation: pulse 2s infinite;
}

.status-indicator.offline {
  background: #ef4444;
}

.view-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
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

.action-btn:hover {
  background: #3b82f6;
  color: white;
}

.view-content {
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
```

### **4. Template de Configuração do Harbor**

```javascript
// harbor/web/services.js (adicionar novo serviço)
export const services = {
  // ... serviços existentes
  'service-name': {
    name: 'ServiceName',
    title: 'Service Name - Descrição',
    description: 'Descrição do novo serviço',
    icon: 'fas fa-icon',
    color: '#3b82f6',
    view: 'ServiceNameView',
    path: '../../service-name/views/ServiceNameView.vue',
    port: 3700,
    apiPort: 8000
  }
}
```

```javascript
// harbor/web/main.js (registrar novo componente)
const ServiceNameView = await import('../../service-name/views/ServiceNameView.vue')
app.component('ServiceNameView', ServiceNameView.default)
```

### **5. Template de Docker Compose**

```yaml
# docker-compose.yml (adicionar novo serviço)
services:
  # ... serviços existentes
  
  service-name:
    build:
      context: ./service-name/api
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/service_name
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - canonika-network

  service-name-web:
    build:
      context: ./service-name/web
      dockerfile: Dockerfile
    ports:
      - "3700:80"
    depends_on:
      - service-name
    networks:
      - canonika-network
```

### **6. Template de Testes**

```javascript
// web/tests/unit/ServiceName.test.js
import { mount } from '@vue/test-utils'
import ServiceNameView from '../../views/ServiceNameView.vue'

describe('ServiceNameView', () => {
  test('renders service title', () => {
    const wrapper = mount(ServiceNameView)
    expect(wrapper.text()).toContain('Service Name')
  })

  test('shows online status', () => {
    const wrapper = mount(ServiceNameView)
    expect(wrapper.find('.status-indicator').classes()).toContain('online')
  })

  test('has data items', () => {
    const wrapper = mount(ServiceNameView)
    expect(wrapper.findAll('.data-card')).toHaveLength(3)
  })
})
```

```python
# api/tests/test_main.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "service-name"

def test_get_data():
    response = client.get("/api/v1/data")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data

def test_create_data():
    data = {"name": "Test", "description": "Test description"}
    response = client.post("/api/v1/data", json=data)
    assert response.status_code == 200
    result = response.json()
    assert result["message"] == "Dado criado"
```

## 🚀 Script de Criação Automática

```bash
#!/bin/bash
# create-service.sh

SERVICE_NAME=$1
SERVICE_PORT=$2
API_PORT=$3

if [ -z "$SERVICE_NAME" ]; then
    echo "Uso: ./create-service.sh <nome-do-servico> [porta-web] [porta-api]"
    exit 1
fi

# Valores padrão
WEB_PORT=${SERVICE_PORT:-3700}
API_PORT=${API_PORT:-8000}

echo "🚀 Criando serviço: $SERVICE_NAME"
echo "📡 Porta Web: $WEB_PORT"
echo "🔌 Porta API: $API_PORT"

# Criar estrutura de diretórios
mkdir -p $SERVICE_NAME/{api,web/src,views,nginx}

# Criar arquivos da API
cat > $SERVICE_NAME/api/main.py << EOF
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="$SERVICE_NAME")

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/health")
async def health_check():
    return HealthResponse(status="healthy", service="$SERVICE_NAME")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=$API_PORT)
EOF

cat > $SERVICE_NAME/api/requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
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
cat > $SERVICE_NAME/web/package.json << EOF
{
  "name": "$SERVICE_NAME-web",
  "version": "1.0.0",
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

# Criar view para Harbor
cat > $SERVICE_NAME/views/${SERVICE_NAME^}View.vue << EOF
<template>
  <div class="service-view">
    <div class="view-header">
      <div class="view-title">
        <i class="fas fa-icon"></i>
        <span>$SERVICE_NAME</span>
      </div>
    </div>
    <div class="view-content">
      <h2>🚀 $SERVICE_NAME</h2>
      <p>Sistema em desenvolvimento</p>
    </div>
  </div>
</template>

<script>
export default {
  name: '${SERVICE_NAME^}View'
}
</script>
EOF

echo "✅ Serviço $SERVICE_NAME criado com sucesso!"
echo "📁 Estrutura criada em: $SERVICE_NAME/"
echo "🔧 Próximos passos:"
echo "   1. cd $SERVICE_NAME/api && pip install -r requirements.txt"
echo "   2. cd ../web && npm install"
echo "   3. Configurar no Harbor (services.js)"
echo "   4. Adicionar ao docker-compose.yml"
```

## 📝 Checklist de Criação de Serviço

### **✅ Estrutura Básica**
- [ ] Criar diretório do serviço
- [ ] Configurar API (FastAPI)
- [ ] Configurar Web (Vue.js)
- [ ] Criar view para Harbor
- [ ] Configurar Docker

### **✅ Integração**
- [ ] Adicionar ao services.js do Harbor
- [ ] Registrar componente no main.js
- [ ] Adicionar ao docker-compose.yml
- [ ] Configurar portas

### **✅ Testes**
- [ ] Testes unitários (Vue.js)
- [ ] Testes de API (FastAPI)
- [ ] Testes E2E (Cypress)
- [ ] Health checks

### **✅ Documentação**
- [ ] README.md do serviço
- [ ] Documentação da API
- [ ] Documentação das views
- [ ] Atualizar SERVICES.md

---

**🎯 Objetivo**: Facilitar a criação de novos serviços seguindo os padrões estabelecidos da plataforma Canonika. 