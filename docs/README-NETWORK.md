# 🌐 Canonika Network Architecture

## 🎯 Visão Geral

O Canonika agora utiliza uma **rede Docker dedicada** para comunicação entre microserviços, eliminando a necessidade de containers isolados e permitindo comunicação direta entre os serviços.

## 🏗️ Arquitetura de Rede

### 📡 Rede Docker
```yaml
networks:
  canonika-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 🔗 Comunicação entre Serviços

**Antes (Isolado):**
```
Container A (localhost:3701) ❌ Container B (localhost:3705)
```

**Agora (Rede Compartilhada):**
```
Container A (harbor:3701) ✅ Container B (guardian:3705)
```

## 🚀 Como Usar

### 1. Iniciar Ecossistema Completo
```bash
./start-canonika.sh start
```

### 2. Menu Interativo
```bash
./start-canonika.sh menu
```

### 3. Verificar Status
```bash
./start-canonika.sh status
```

### 4. Parar Ecossistema
```bash
./start-canonika.sh stop
```

## 📊 Serviços Disponíveis

### 🔐 Microserviços
| Serviço | Porta | URL | Descrição |
|---------|-------|-----|-----------|
| Quarter | 80 | http://localhost | Ponto de entrada |
| Harbor | 3701 | http://localhost:3701 | Dashboard principal |
| Guardian | 3705 | http://localhost:3705 | Segurança |
| Skipper | 3702 | http://localhost:3702 | Navegação |
| Beacon | 3703 | http://localhost:3703 | Monitoramento |
| Fisher | 3706 | http://localhost:3706 | Coleta de dados |
| Tollgate | 3707 | http://localhost:3707 | Gateway |
| Ledger | 3708 | http://localhost:3708 | Financeiro |

### 🏗️ Infraestrutura
| Serviço | Porta | URL | Descrição |
|---------|-------|-----|-----------|
| Keycloak | 8080 | http://localhost:8080 | Autenticação |
| PostgreSQL | 5432 | localhost:5432 | Banco principal |
| Redis | 6379 | localhost:6379 | Cache |
| OPA | 8181 | http://localhost:8181 | Políticas |
| ClickHouse | 8123 | http://localhost:8123 | Analytics |

## 🔄 Comunicação Interna

### 🌐 URLs Internas (Dentro da Rede)
```bash
# Entre microserviços
http://quarter:80
http://harbor:3701
http://guardian:3705
http://skipper:3702
http://beacon:3703
http://fisher:3706
http://tollgate:3707
http://ledger:3708

# Infraestrutura
http://keycloak:8080
http://postgres:5432
http://redis:6379
http://opa:8181
http://clickhouse:8123
```

### 🔗 Exemplo de Comunicação
```javascript
// Antes (não funcionava)
fetch('http://localhost:3705/api/health')

// Agora (funciona)
fetch('http://guardian:3705/api/health')
```

## 🛠️ Configuração de Ambiente

### 📝 Variáveis de Ambiente
Cada serviço pode acessar outros através do nome do container:

```bash
# Exemplo: Guardian acessando Keycloak
KEYCLOAK_URL=http://keycloak:8080

# Exemplo: Harbor acessando PostgreSQL
DATABASE_URL=postgresql://canonika:canonika123@postgres:5432/canonika

# Exemplo: Beacon acessando ClickHouse
CLICKHOUSE_URL=http://clickhouse:8123
```

## 🔍 Monitoramento

### 📊 Verificar Status
```bash
# Status de todos os serviços
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f guardian
```

### 🏥 Health Checks
```bash
# Verificar se Quarter está respondendo
curl http://localhost/api/health

# Verificar se Guardian está respondendo
curl http://localhost:3705/api/health

# Verificar se Keycloak está respondendo
curl http://localhost:8080/health
```

## 🚀 Benefícios da Nova Arquitetura

### ✅ Comunicação Direta
- **Microserviços** podem se comunicar diretamente
- **Zero** configuração de proxy
- **Latência** reduzida

### ✅ Segurança
- **Rede isolada** do host
- **Comunicação interna** protegida
- **Portas expostas** apenas quando necessário

### ✅ Escalabilidade
- **Fácil** adição de novos serviços
- **Load balancing** nativo
- **Service discovery** automático

### ✅ Desenvolvimento
- **Hot reload** em todos os serviços
- **Debugging** simplificado
- **Logs centralizados**

## 🔧 Troubleshooting

### ❌ Problema: Serviço não consegue acessar outro
**Solução:**
```bash
# Verificar se estão na mesma rede
docker network ls
docker network inspect canonika-network

# Verificar conectividade
docker exec canonika_guardian ping harbor
```

### ❌ Problema: Porta já em uso
**Solução:**
```bash
# Parar todos os containers
./start-canonika.sh stop

# Limpar tudo
./start-canonika.sh clean

# Reiniciar
./start-canonika.sh start
```

### ❌ Problema: Imagens desatualizadas
**Solução:**
```bash
# Reconstruir todas as imagens
./start-canonika.sh build

# Reiniciar
./start-canonika.sh start
```

## 🎯 Próximos Passos

### 🐳 Kubernetes (Opcional)
Para produção, podemos migrar para Kubernetes:

```yaml
# Exemplo de deployment Kubernetes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: canonika-quarter
spec:
  replicas: 3
  selector:
    matchLabels:
      app: quarter
  template:
    metadata:
      labels:
        app: quarter
    spec:
      containers:
      - name: quarter
        image: quarter:latest
        ports:
        - containerPort: 80
```

### 🔄 Service Mesh
Para comunicação avançada entre serviços:
- **Istio** para roteamento e segurança
- **Linkerd** para observabilidade
- **Consul** para service discovery

## 📚 Referências

- [Docker Networking](https://docs.docker.com/network/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Kubernetes](https://kubernetes.io/docs/)
- [Service Mesh](https://servicemesh.io/)

---

**🎉 Agora você tem um ecossistema completo e conectado!** 