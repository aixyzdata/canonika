# Tollgate - Sistema de Controle de Créditos

O **Tollgate** é o núcleo de controle financeiro da plataforma Canonika, responsável por gerenciar créditos, consumo e políticas de uso de todos os microserviços.

## 🎯 Funcionalidades

### Backend (API)
- **Autenticação JWT** com refresh tokens
- **Controle de créditos** (padrão, bônus, recorrente)
- **Autorização de consumo** por módulo
- **Reversão de transações** em caso de falha
- **Histórico de transações** com filtros
- **Gestão de planos** e alertas
- **Tokens de API** com escopos
- **Auditoria completa** de todas as operações

### Frontend (Vue.js + Bootstrap)
- **Dashboard** com saldo atual e estatísticas
- **Timeline de consumo** com filtros avançados
- **Gestão de créditos** (Admin)
- **Configuração de planos** e alertas
- **Exportação de dados** em CSV
- **Interface responsiva** e moderna

## 🏗️ Arquitetura

```
tollgate/
├── api/                 # Backend FastAPI
│   ├── main.py         # API principal
│   └── requirements.txt # Dependências Python
├── web/                # Frontend Vue.js
│   ├── App.vue         # Componente principal
│   ├── main.js         # Inicialização Vue
│   ├── index.html      # HTML base
│   ├── package.json    # Dependências Node.js
│   └── vite.config.js  # Configuração Vite
├── nginx/              # Proxy reverso
│   └── nginx.conf      # Configuração nginx
├── Dockerfile          # Container multi-stage
├── start.sh           # Script de inicialização
└── scripts/           # Automação
    ├── build.py       # Construir imagem
    ├── start.py       # Iniciar serviço
    ├── stop.py        # Parar serviço
    ├── rebuild.py     # Reconstruir
    ├── destroy.py     # Destruir tudo
    └── publish.py     # Publicar
```

## 🚀 Início Rápido

### 1. Construir o serviço
```bash
cd tollgate
python build.py
```

### 2. Iniciar o serviço
```bash
python start.py
```

### 3. Acessar a aplicação
- **Frontend**: http://localhost:7732/web/
- **API**: http://localhost:7732/api/
- **Documentação**: http://localhost:7732/docs
- **Health Check**: http://localhost:7732/health

### 4. Credenciais de teste
- **Email**: admin@canonika.io
- **Senha**: Admin@123

## 📊 Endpoints da API

### Autenticação
```
POST /api/auth/login          # Login
POST /api/auth/refresh        # Refresh token
```

### Créditos
```
GET  /api/credits/balance/{user_id}     # Consultar saldo
POST /api/credits/authorize             # Autorizar consumo
POST /api/credits/revert                # Reverter transação
POST /api/credits/add                   # Adicionar créditos
GET  /api/credits/transactions/{user_id} # Histórico
GET  /api/credits/plans                 # Listar planos
GET  /api/credits/alerts/{user_id}      # Alertas
POST /api/credits/alerts                # Criar alerta
```

### Tokens de API
```
GET  /api/tokens              # Listar tokens
POST /api/tokens              # Criar token
```

## 🔧 Scripts de Automação

### build.py
```bash
python build.py
```
- Constrói a imagem Docker
- Prepara o ambiente

### start.py
```bash
python start.py
```
- Inicia o container
- Configura a porta 7723
- Exibe informações de acesso

### stop.py
```bash
python stop.py
```
- Para o container
- Remove recursos

### rebuild.py
```bash
python rebuild.py
```
- Para e remove container
- Reconstrói imagem
- Reinicia serviço

### destroy.py
```bash
python destroy.py
```
- Remove tudo
- Limpa recursos

### publish.py
```bash
python publish.py
```
- Prepara para produção
- Tag de versão

## 🎨 Interface

### Design System
- **Tema**: Tecnológico e inovador
- **Cores**: Tons oceânicos (azuis)
- **Framework**: Bootstrap 5 + Vue.js 3
- **Responsivo**: Mobile-first

### Componentes Principais
- **Logo animado** com hexágono e pulse
- **Dashboard** com cards de créditos
- **Timeline** de transações
- **Formulários** modernos
- **Tabelas** responsivas

## 🔐 Segurança

### Autenticação
- **JWT tokens** com expiração
- **Refresh tokens** automático
- **BCrypt** para senhas
- **CORS** configurado

### Rate Limiting
- **API geral**: 10 req/s
- **Autorização**: 5 req/s
- **Proteção** contra abuso

### Auditoria
- **Logs completos** de todas as operações
- **IP tracking** e headers
- **Timestamps** precisos
- **Origem** das requisições

## 📈 Monitoramento

### Health Check
```bash
curl http://localhost:7732/health
```

### Métricas
- Usuários ativos
- Transações por período
- Planos disponíveis
- Status do serviço

### Alertas
- **90%** de créditos consumidos
- **100%** de créditos zerados
- **Notificações** por email/webhook

## 🗄️ Banco de Dados (Futuro)

### Tabelas Planejadas
```sql
-- Créditos dos usuários
user_credits (
  id, user_id, tipo, valor, 
  expiracao, origem, status
)

-- Transações de créditos
credit_transactions (
  id, user_id, tipo, modulo,
  creditos_consumidos, referencia_externa,
  reversivel, data_hora
)

-- Planos de créditos
credit_plans (
  id, nome, creditos_mes, limites_por_periodo
)

-- Planos dos usuários
user_credit_plan (
  id, user_id, plano_id, inicio, proxima_renovacao
)

-- Alertas de créditos
credit_alerts (
  id, user_id, tipo, valor_percentual, data_disparo
)

-- Tokens de API
api_tokens (
  id, user_id, token, data_criacao, expiracao, escopos
)
```

## 🔄 Integração com Outros Serviços

### Política de Consumo
Cada serviço Canonika deve chamar:
```bash
POST /api/credits/authorize
{
  "user_id": "user-123",
  "module": "skipper",
  "operation_type": "data_analysis",
  "estimated_consumption": 10.5,
  "external_reference": "req-456"
}
```

### Resposta de Autorização
```json
{
  "authorized": true,
  "transaction_id": "tx-789",
  "remaining_credits": 89.5,
  "consumed_credits": 10.5
}
```

### Reversão em Caso de Falha
```bash
POST /api/credits/revert
{
  "user_id": "user-123",
  "transaction_id": "tx-789",
  "reason": "Processamento falhou"
}
```

## 🚀 Deploy em Produção

### Docker Compose
```yaml
tollgate:
  image: canonika/tollgate:latest
  ports:
    - "7732:80"
  environment:
    - DATABASE_URL=postgresql://...
    - REDIS_URL=redis://...
  volumes:
    - ./logs:/app/logs
```

### Variáveis de Ambiente
```bash
DATABASE_URL=postgresql://user:pass@host:5432/tollgate
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
LOG_LEVEL=INFO
```

## 📝 Logs e Debug

### Logs de Auditoria
```json
{
  "user_id": "admin-001",
  "action": "POST /api/credits/authorize",
  "module": "tollgate",
  "details": {
    "path": "/api/credits/authorize",
    "method": "POST"
  },
  "ip_address": "192.168.1.100",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Debug Mode
```bash
# Logs detalhados
docker logs canonika-tollgate

# Acesso ao container
docker exec -it canonika-tollgate sh
```

## 🤝 Contribuição

### Estrutura de Desenvolvimento
1. **Fork** do repositório
2. **Branch** para feature
3. **Testes** locais
4. **Pull Request** com descrição

### Padrões de Código
- **Python**: PEP 8
- **JavaScript**: ESLint
- **Vue**: Vue Style Guide
- **Commits**: Conventional Commits

## 📄 Licença

Este projeto faz parte da plataforma Canonika e está sob a licença MIT.

---

**Tollgate** - O guardião dos créditos da Canonika 🏛️ 