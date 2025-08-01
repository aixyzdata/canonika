# 🔧 Configuração de Ambiente Canonika

## 🎯 Visão Geral

Todas as URLs entre serviços são configuradas através de **variáveis de ambiente**, centralizando a configuração e tornando o sistema mais flexível e seguro.

## 📁 Estrutura de Arquivos

```
shared/config/
├── env.js          # Configuração para Frontend (Vue.js)
├── settings.py     # Configuração para Backend (Python/FastAPI)
└── README.md       # Esta documentação
```

## 🚀 Como Usar

### Frontend (Vue.js)

```javascript
// Importar configuração
import config from '../../shared/config/env.js'

// Obter URL de um serviço
const harborUrl = config.getServiceUrl('harbor')
const guardianUrl = config.getServiceUrl('guardian')

// Obter URL de infraestrutura
const keycloakUrl = config.getInfraUrl('keycloak')

// Construir URL de API
const apiUrl = config.buildApiUrl('guardian', '/users')
const healthUrl = config.buildHealthUrl('harbor')

// Verificar modo de desenvolvimento
if (config.isDevMode()) {
    console.log('Modo de desenvolvimento ativo')
}
```

### Backend (Python/FastAPI)

```python
# Importar configuração
from shared.config.settings import settings

# Obter URL de um serviço
harbor_url = settings.get_service_url('harbor')
guardian_url = settings.get_service_url('guardian')

# Obter URL de infraestrutura
keycloak_url = settings.get_infra_url('keycloak')

# Construir URL de API
api_url = settings.build_api_url('guardian', '/users')
health_url = settings.build_health_url('harbor')

# Verificar modo de desenvolvimento
if settings.is_dev_mode():
    print('Modo de desenvolvimento ativo')
```

## 🔧 Variáveis de Ambiente

### Microserviços
```bash
QUARTER_URL=http://quarter:80
HARBOR_URL=http://harbor:3701
GUARDIAN_URL=http://guardian:3705
SKIPPER_URL=http://skipper:3702
BEACON_URL=http://beacon:3703
FISHER_URL=http://fisher:3706
TOLLGATE_URL=http://tollgate:3707
LEDGER_URL=http://ledger:3708
```

### Infraestrutura
```bash
KEYCLOAK_URL=http://keycloak:8080
POSTGRES_URL=postgresql://canonika:canonika123@postgres:5432/canonika
REDIS_URL=redis://redis:6379
OPA_URL=http://opa:8181
CLICKHOUSE_URL=http://clickhouse:8123
```

### Configurações Gerais
```bash
DEV_MODE=false
API_TIMEOUT=30
RETRY_ATTEMPTS=3
SECRET_KEY=canonika-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
LOG_LEVEL=INFO
```

## 🔄 Exemplos de Uso

### 1. Health Check de Serviços

```javascript
// Frontend
async function checkServiceHealth(serviceName) {
    const healthUrl = config.buildHealthUrl(serviceName)
    try {
        const response = await fetch(healthUrl)
        return response.ok
    } catch (error) {
        console.error(`Erro ao verificar ${serviceName}:`, error)
        return false
    }
}

// Verificar todos os serviços
const services = ['quarter', 'harbor', 'guardian', 'skipper', 'beacon']
for (const service of services) {
    const isHealthy = await checkServiceHealth(service)
    console.log(`${service}: ${isHealthy ? '✅' : '❌'}`)
}
```

```python
# Backend
import aiohttp
import asyncio

async def check_service_health(service_name: str) -> bool:
    health_url = settings.build_health_url(service_name)
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(health_url) as response:
                return response.status == 200
    except Exception as e:
        print(f"Erro ao verificar {service_name}: {e}")
        return False

# Verificar todos os serviços
async def check_all_services():
    services = ['quarter', 'harbor', 'guardian', 'skipper', 'beacon']
    tasks = [check_service_health(service) for service in services]
    results = await asyncio.gather(*tasks)
    
    for service, is_healthy in zip(services, results):
        status = "✅" if is_healthy else "❌"
        print(f"{service}: {status}")

# Executar
asyncio.run(check_all_services())
```

### 2. Comunicação entre Serviços

```javascript
// Frontend - Harbor chamando Guardian
async function getGuardianUsers() {
    const guardianUrl = config.getServiceUrl('guardian')
    const apiUrl = `${guardianUrl}/api/users`
    
    try {
        const response = await fetch(apiUrl)
        return await response.json()
    } catch (error) {
        console.error('Erro ao buscar usuários do Guardian:', error)
        return []
    }
}
```

```python
# Backend - Harbor chamando Guardian
import aiohttp

async def get_guardian_users():
    guardian_url = settings.get_service_url('guardian')
    api_url = f"{guardian_url}/api/users"
    
    try {
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url) as response:
                return await response.json()
    except Exception as e:
        print(f"Erro ao buscar usuários do Guardian: {e}")
        return []
```

### 3. Integração com Keycloak

```javascript
// Frontend
async function authenticateWithKeycloak(username, password) {
    const keycloakUrl = config.getInfraUrl('keycloak')
    const tokenUrl = `${keycloakUrl}/auth/realms/canonika/protocol/openid-connect/token`
    
    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('client_id', 'canonika-client')
    formData.append('username', username)
    formData.append('password', password)
    
    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            body: formData
        })
        return await response.json()
    } catch (error) {
        console.error('Erro na autenticação:', error)
        return null
    }
}
```

```python
# Backend
import aiohttp

async def authenticate_with_keycloak(username: str, password: str):
    keycloak_url = settings.get_infra_url('keycloak')
    token_url = f"{keycloak_url}/auth/realms/canonika/protocol/openid-connect/token"
    
    data = {
        'grant_type': 'password',
        'client_id': 'canonika-client',
        'username': username,
        'password': password
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(token_url, data=data) as response:
                return await response.json()
    except Exception as e:
        print(f"Erro na autenticação: {e}")
        return None
```

## 🔒 Segurança

### ✅ Benefícios
- **Configuração centralizada** - Todas as URLs em um lugar
- **Flexibilidade** - Fácil mudança de ambiente (dev/staging/prod)
- **Segurança** - URLs sensíveis não hardcoded
- **Manutenibilidade** - Mudanças em um local afetam todo o sistema

### 🛡️ Boas Práticas
1. **Nunca** commitar senhas ou chaves secretas
2. **Sempre** usar variáveis de ambiente para configurações sensíveis
3. **Validar** URLs antes de usar
4. **Logar** erros de conectividade
5. **Implementar** retry logic para falhas temporárias

## 🔧 Troubleshooting

### ❌ Problema: Variável de ambiente não encontrada
**Solução:**
```bash
# Verificar se a variável está definida
echo $QUARTER_URL

# Definir variável se necessário
export QUARTER_URL=http://quarter:80
```

### ❌ Problema: URL incorreta
**Solução:**
```bash
# Verificar configuração no Docker Compose
docker-compose config

# Verificar variáveis de ambiente no container
docker exec canonika_guardian env | grep URL
```

### ❌ Problema: Serviço não responde
**Solução:**
```bash
# Verificar se o serviço está rodando
docker-compose ps

# Verificar logs
docker-compose logs guardian

# Testar conectividade
docker exec canonika_guardian curl -f http://quarter:80/api/health
```

## 📚 Referências

- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [Vue.js Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html)
- [FastAPI Settings](https://fastapi.tiangolo.com/advanced/settings/)
- [Python Environment Variables](https://docs.python.org/3/library/os.html#os.environ)

---

**🎉 Agora você tem configuração centralizada e flexível!** 