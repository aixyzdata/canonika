# 🏗️ Stack Canonika - Arquitetura de Referência

## 📋 Visão Geral

O Canonika é uma plataforma de microserviços marítimos com arquitetura de referência focada em **equilíbrio entre custo e controle**. O stack inclui todos os componentes necessários para uma aplicação enterprise-grade.

## 🏛️ Arquitetura de Referência

### 🔐 **Infraestrutura de Autenticação e Identidade**

| Serviço | Porta | Descrição | Status |
|---------|-------|-----------|--------|
| **Keycloak** | 8080 | Identity Provider (IdP) - SSO, MFA, Federação | ✅ |
| **PostgreSQL** | 5432 | Banco principal para Keycloak e aplicações | ✅ |
| **Redis** | 6379 | Cache e sessões | ✅ |
| **OPA** | 8181-8183 | Políticas ABAC/ReBAC | ✅ |
| **ClickHouse** | 8123/9000 | Logs e auditoria | ✅ |

### 🚢 **Microserviços Canonika**

| Serviço | Porta | Descrição | Status |
|---------|-------|-----------|--------|
| **Quarter** | 80/8000 | Autenticação centralizada | ✅ |
| **Harbor** | 3701 | Dashboard principal | ✅ |
| **Beacon** | 3702 | Navegação e sinalização | ✅ |
| **Fisher** | 3703 | Dados e pesca | ✅ |
| **Ledger** | 3704 | Financeiro e contabilidade | ✅ |
| **Guardian** | 3705 | Segurança e monitoramento | ✅ |
| **Echo** | 3706 | Comunicação | ✅ |
| **Diver** | 3707 | Exploração e mergulho | ✅ |
| **Dock** | 3708 | Porto e atracação | ✅ |
| **Mapmaker** | 3709 | Mapeamento e cartografia | ✅ |
| **Seagull** | 3710 | Monitoramento aéreo | ✅ |
| **Skipper** | 3711 | Navegação rápida | ✅ |
| **Tollgate** | 3712 | Controle de acesso | ✅ |
| **Wayfinder** | 3713 | Descoberta e exploração | ✅ |

## 🚀 **Como Deployar**

### **1. Pré-requisitos**
```bash
# Docker e Docker Compose instalados
docker --version
docker-compose --version

# Git (para clonar o repositório)
git --version
```

### **2. Deploy Completo**
```bash
# Clonar o repositório
git clone <repository-url>
cd canonika

# Deploy de todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

### **3. Deploy por Camadas**
```bash
# 1. Infraestrutura base
docker-compose up -d postgres redis clickhouse

# 2. Autenticação e identidade
docker-compose up -d keycloak opa

# 3. Microserviços principais
docker-compose up -d quarter harbor beacon

# 4. Microserviços de dados
docker-compose up -d fisher ledger guardian

# 5. Microserviços de comunicação
docker-compose up -d echo diver dock

# 6. Microserviços de navegação
docker-compose up -d mapmaker seagull skipper

# 7. Microserviços de controle
docker-compose up -d tollgate wayfinder
```

## 🔧 **Configuração**

### **Variáveis de Ambiente**
```bash
# Banco de dados
DATABASE_URL=postgresql://canonika:canonika123@postgres:5432/canonika

# Cache
REDIS_URL=redis://:redis123@redis:6379

# Autenticação
KEYCLOAK_URL=http://keycloak:8080

# Políticas
OPA_URL=http://opa:8181

# Logs
CLICKHOUSE_URL=http://clickhouse:8123
```

### **Credenciais Padrão**
```bash
# PostgreSQL
POSTGRES_USER=canonika
POSTGRES_PASSWORD=canonika123
POSTGRES_DB=canonika

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin123

# Redis
REDIS_PASSWORD=redis123

# ClickHouse
CLICKHOUSE_USER=canonika
CLICKHOUSE_PASSWORD=clickhouse123
```

## 📊 **Monitoramento**

### **Health Checks**
```bash
# Verificar saúde dos serviços
docker-compose ps

# Logs em tempo real
docker-compose logs -f [service-name]

# Logs específicos
docker-compose logs quarter
docker-compose logs keycloak
```

### **Endpoints de Saúde**
- **Keycloak**: `http://localhost:8080/health/ready`
- **PostgreSQL**: `docker exec canonika_postgres pg_isready`
- **Redis**: `docker exec canonika_redis redis-cli ping`
- **ClickHouse**: `http://localhost:8123/ping`
- **OPA**: `http://localhost:8181/health`

## 🔐 **Segurança**

### **Políticas OPA**
```bash
# Carregar políticas
./policies/load-policies.sh

# Testar políticas
curl -X POST http://localhost:8181/v1/data/canonika/allow \
  -H "Content-Type: application/json" \
  -d '{"input": {...}}'
```

### **Keycloak Setup**
1. Acesse: `http://localhost:8080`
2. Login: `admin` / `admin123`
3. Crie realm: `canonika`
4. Configure client: `canonika-client`
5. Configure roles e usuários

## 📈 **Performance**

### **Recursos Recomendados**
```bash
# Mínimo
CPU: 4 cores
RAM: 8GB
Disk: 50GB

# Recomendado
CPU: 8 cores
RAM: 16GB
Disk: 100GB SSD
```

### **Otimizações**
```bash
# PostgreSQL
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB

# Redis
maxmemory 512mb
maxmemory-policy allkeys-lru

# ClickHouse
max_memory_usage = 4GB
max_bytes_before_external_group_by = 2GB
```

## 🛠️ **Desenvolvimento**

### **Hot Reload (Quarter)**
```bash
# Desenvolvimento com hot reload
docker-compose up quarter

# Acessar: http://localhost
# Mudanças em quarter/web/src/ são refletidas automaticamente
```

### **Logs de Desenvolvimento**
```bash
# Logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs -f quarter
docker-compose logs -f harbor
```

## 🔍 **Troubleshooting**

### **Problemas Comuns**

#### **1. Porta já em uso**
```bash
# Verificar portas
lsof -i :8080
lsof -i :5432

# Parar serviços conflitantes
sudo lsof -ti:8080 | xargs kill -9
```

#### **2. Container não inicia**
```bash
# Verificar logs
docker-compose logs [service-name]

# Rebuild específico
docker-compose build [service-name]
docker-compose up -d [service-name]
```

#### **3. Banco não conecta**
```bash
# Verificar PostgreSQL
docker exec canonika_postgres pg_isready -U canonika

# Reset completo
docker-compose down -v
docker-compose up -d postgres
```

#### **4. Keycloak não carrega**
```bash
# Aguardar PostgreSQL
docker-compose logs postgres

# Verificar Keycloak
docker-compose logs keycloak
```

## 📚 **Documentação Adicional**

- [Arquitetura Detalhada](./ARCHITECTURE.md)
- [Guia de Desenvolvimento](./DEVELOPMENT.md)
- [Diretrizes de Componentização](./DIRETRIZES_COMPONENTIZACAO.md)
- [Guia de Login Centralizado](./GUIA_LOGIN_CENTRALIZADO.md)

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -am 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**🏴‍☠️ Canonika - Navegando o Futuro da Tecnologia Marítima** 