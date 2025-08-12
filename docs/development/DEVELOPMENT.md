# 🛠️ Canonika - Guia de Desenvolvimento

## 📋 Visão Geral

Este guia cobre o ambiente de desenvolvimento, troubleshooting e melhores práticas para a plataforma Canonika.

## 🚀 Ambiente de Desenvolvimento

### **Pré-requisitos**
- Docker e Docker Compose instalados
- Node.js e npm
- Acesso ao terminal

### **Iniciar Ambiente**
```bash
# Ambiente de desenvolvimento (com volumes)
./dev.sh start

# Ambiente de produção
docker-compose up -d
```

### **Comandos de Desenvolvimento**
```bash
./dev.sh start     # Inicia ambiente de desenvolvimento
./dev.sh stop      # Para todos os containers
./dev.sh restart   # Reinicia todos os containers
./dev.sh logs      # Mostra logs dos containers
./dev.sh status    # Mostra status dos containers
./dev.sh css       # Aplica mudanças CSS em tempo real
./dev.sh help      # Mostra ajuda
```

## 🌐 Portas dos Serviços

| Serviço | Porta | URL |
|---------|-------|-----|
| Quarter | 80 | http://localhost:80 |
| Harbor | 3701 | http://localhost:3701 |
| Guardian | 3705 | http://localhost:3705 |
| Beacon | 3703 | http://localhost:3703 |
| Skipper | 7722 | http://localhost:7722 |
| Tollgate | 7732 | http://localhost:7732 |

## ⚡ Desenvolvimento Rápido

### **Mudanças CSS (Rápido - 10-30 segundos)**
```bash
# Editar arquivos em ./shared/styles/
# Aplicar mudanças
./dev.sh css
```

### **Mudanças Estruturais (Lento - 2-5 minutos)**
```bash
# Para mudanças em HTML/Vue.js/JavaScript
docker-compose build [serviço]
docker-compose up -d [serviço]
```

## 🔧 Troubleshooting

### **Problemas Comuns**

#### 1. CSS Quebrado / Páginas Sem Estilo
```bash
# Solução rápida
git reset --hard 05d1121
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

#### 2. Erro 500 no Harbor
```bash
# Verificar configuração do nginx
cat harbor/nginx/nginx.conf

# Rebuild do Harbor
docker-compose build harbor
docker-compose up -d harbor
```

#### 3. Hot Reload Não Funciona
```bash
# Usar modo de desenvolvimento
cd harbor/web && npm run dev
```

#### 4. Portas em Conflito
```bash
# Verificar portas em uso
lsof -i :3701
lsof -i :7721

# Parar processos conflitantes
kill -9 <PID>
```

### **Comandos de Diagnóstico**
```bash
# Verificar status dos containers
docker-compose ps

# Ver logs
docker-compose logs
docker logs canonika_harbor

# Testar endpoints
curl -I http://localhost:3701
curl -I http://localhost:7722
```

## 🧪 Testes

### **Executar Testes**
```bash
# Testes do Quarter (TDD + BDD)
cd quarter
./run-tests.sh

# Testes de todos os serviços
docker-compose exec quarter npm test
docker-compose exec harbor npm test
docker-compose exec guardian npm test
```

### **Cobertura de Testes**
- ✅ **TDD (Test-Driven Development)**: 95%+ cobertura
- ✅ **BDD (Behavior-Driven Development)**: 100% fluxos críticos
- ✅ **API Tests**: 90%+ endpoints
- ✅ **E2E Tests**: Login, Logout, Navegação

## 📊 Monitoramento

### **Health Checks**
```bash
# Verificar status dos serviços
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Health checks individuais
curl http://localhost:80/api/health      # Quarter
curl http://localhost:3701/api/health    # Harbor
curl http://localhost:3705/api/health    # Guardian
```

## 🎯 Melhores Práticas

### **Desenvolvimento**
- Use `./dev.sh start` para desenvolvimento
- Use `docker-compose up` para produção
- Faça commits frequentes
- Teste antes de fazer push

### **Código**
- Siga os padrões ESLint + Prettier
- Use TDD + BDD para testes
- Documente APIs e componentes
- Mantenha consistência visual

### **Deploy**
- Sempre teste em desenvolvimento primeiro
- Use tags para releases
- Mantenha backup dos dados
- Monitore logs em produção

## 📚 Recursos Úteis

### **Documentação**
- [Arquitetura](ARCHITECTURE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Segurança](SECURITY.md)

### **Comandos Úteis**
```bash
# Limpar cache do Docker
docker system prune -f

# Ver logs em tempo real
docker-compose logs -f [serviço]

# Entrar no container
docker exec -it canonika_harbor sh

# Verificar arquivos no container
ls -la /usr/share/nginx/html/dist/
```

## 🚨 Emergência

### **Reset Completo**
```bash
git reset --hard 05d1121
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### **Commit Estável**
`05d1121` - "feat: padronização completa do view-header em todas as views"

---

**🎯 Objetivo**: Manter um ambiente de desenvolvimento rápido, estável e produtivo para a equipe Canonika. 