# 🔧 Canonika - Guia de Troubleshooting

## 🚨 Problemas Comuns e Soluções

### 1. CSS Quebrado / Páginas Sem Estilo

**Sintomas:**
- Páginas aparecem sem CSS
- Layout quebrado
- Erro 500 no Harbor

**Solução Rápida:**
```bash
# 1. Reverter para commit estável
git reset --hard 05d1121

# 2. Parar todos os containers
docker-compose down

# 3. Limpar cache do Docker
docker system prune -f

# 4. Rebuild completo
docker-compose build --no-cache

# 5. Subir containers
docker-compose up -d

# 6. Build do frontend do Harbor
cd harbor/web && npm run build
cd ../.. && docker cp harbor/web/dist/. canonika_harbor:/usr/share/nginx/html/dist/
```

### 2. Erro 500 no Harbor

**Sintomas:**
- `curl -I http://localhost:3701` retorna 500
- Logs mostram "rewrite or internal redirection cycle"

**Solução:**
```bash
# Verificar configuração do nginx
cat harbor/nginx/nginx.conf

# Corrigir se necessário (root path deve ser /usr/share/nginx/html/dist)
# Rebuild do Harbor
docker-compose build harbor
docker-compose up -d harbor
```

### 3. Hot Reload Não Funciona

**Sintomas:**
- Mudanças não aparecem automaticamente
- Precisa rebuild manual

**Solução:**
```bash
# Usar modo de desenvolvimento
cd harbor/web && npm run dev

# Ou usar script de desenvolvimento
./dev-harbor.sh
```

### 4. Portas em Conflito

**Sintomas:**
- Containers não iniciam
- Erro de porta já em uso

**Solução:**
```bash
# Verificar portas em uso
lsof -i :3701
lsof -i :7721
lsof -i :7722

# Parar processos conflitantes
kill -9 <PID>

# Ou mudar portas no docker-compose.yml
```

### 5. Build Falha

**Sintomas:**
- Erro no build do Vite
- Módulos não encontrados

**Solução:**
```bash
# Limpar node_modules
cd harbor/web
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 🔍 Comandos de Diagnóstico

### Verificar Status dos Containers
```bash
docker-compose ps
```

### Ver Logs
```bash
# Todos os containers
docker-compose logs

# Container específico
docker logs canonika_harbor
```

### Testar Endpoints
```bash
# Harbor
curl -I http://localhost:3701

# Skipper
curl -I http://localhost:7722

# Tollgate
curl -I http://localhost:7732
```

### Verificar Arquivos no Container
```bash
# Entrar no container
docker exec -it canonika_harbor sh

# Verificar arquivos
ls -la /usr/share/nginx/html/dist/
```

## 📋 Checklist de Recuperação

### ✅ Sistema Funcionando
- [ ] Harbor responde em http://localhost:3701
- [ ] CSS carrega corretamente
- [ ] Todas as views funcionam
- [ ] Hot reload funciona (se em dev)

### ✅ Build Correto
- [ ] `npm run build` sem erros
- [ ] Arquivos copiados para container
- [ ] Nginx configurado corretamente

### ✅ Containers
- [ ] Todos os containers rodando
- [ ] Portas corretas
- [ ] Logs sem erros

## 🚀 Comandos de Recuperação Rápida

### Reset Completo
```bash
git reset --hard 05d1121
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
cd harbor/web && npm run build
cd ../.. && docker cp harbor/web/dist/. canonika_harbor:/usr/share/nginx/html/dist/
```

### Rebuild Apenas Harbor
```bash
docker-compose build harbor
docker-compose up -d harbor
cd harbor/web && npm run build
cd ../.. && docker cp harbor/web/dist/. canonika_harbor:/usr/share/nginx/html/dist/
```

## 📞 Contatos de Emergência

**Commit Estável:** `05d1121` - "feat: padronização completa do view-header em todas as views"

**Portas Padrão:**
- Harbor: 3701
- Skipper: 7722
- Tollgate: 7732
- Quarter: 7725

**Arquivos Críticos:**
- `harbor/nginx/nginx.conf`
- `harbor/web/vite.config.js`
- `docker-compose.yml` 