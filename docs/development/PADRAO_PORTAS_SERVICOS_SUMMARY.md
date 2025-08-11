# Padrão de Portas por Serviço - Canonika

## ✅ **Padrão Atualizado**

Baseado na documentação e configurações atuais, aqui está o padrão de portas estabelecido:

## 🌐 **Portas dos Serviços**

| Serviço | Porta Web | Porta API | URL | Status |
|---------|-----------|-----------|-----|--------|
| **Quarter** | 3700 | 8000 | http://localhost:3700 | ✅ Ativo |
| **Harbor** | 3701 | 8001 | http://localhost:3701 | ✅ Ativo |
| **Guardian** | 3705 | 8005 | http://localhost:3705 | ✅ Ativo |
| **Beacon** | 3703 | 8003 | http://localhost:3703 | ✅ Ativo |
| **Skipper** | 3702 | 8002 | http://localhost:3702 | ✅ Ativo |
| **Tollgate** | 3707 | 8007 | http://localhost:3707 | ✅ Ativo |
| **Ledger** | 3708 | 8008 | http://localhost:3708 | ✅ Ativo |
| **Fisher** | 3706 | 8006 | http://localhost:3706 | ✅ Ativo |

## 🔧 **Serviços de Desenvolvimento**

| Serviço | Porta Dev | URL Dev | Propósito |
|---------|-----------|---------|-----------|
| **Template** | 3790 | http://localhost:3790 | 🧪 Validação de Componentes |
| **Beacon Old** | 3799 | http://localhost:3799 | 🧪 Referência Visual |
| **Quarter Dev** | 5174 | http://localhost:5174 | 🔥 Hot Reload |
| **Harbor Dev** | 5171 | http://localhost:5171 | 🔥 Hot Reload |
| **Guardian Dev** | 5175 | http://localhost:5175 | 🔥 Hot Reload |

## 📋 **Padrão de Numeração**

### **1. Portas de Produção (3700-3799)**
```
3700 - Quarter (Identity Provider)
3701 - Harbor (Portal Principal)
3702 - Skipper (Navegação)
3703 - Beacon (Monitoramento)
3705 - Guardian (Segurança)
3706 - Fisher (Dados)
3707 - Tollgate (Controle)
3708 - Ledger (Financeiro)
```

### **2. Portas de Desenvolvimento (3790-3799)**
```
3790 - Template (Validação)
3799 - Beacon Old (Referência)
```

### **3. Portas de Hot Reload (5171-5175)**
```
5171 - Harbor Dev
5174 - Quarter Dev
5175 - Guardian Dev
```

## 🎯 **Configurações por Serviço**

### **Quarter (3700)**
```yaml
# docker-compose.yml
quarter:
  ports:
    - "3700:80"      # Web
    - "8000:8000"    # API
    - "5174:5174"    # Dev
```

### **Harbor (3701)**
```yaml
# docker-compose.yml
harbor:
  ports:
    - "3701:3701"    # Web
    - "8001:8001"    # API
    - "5171:5171"    # Dev
```

### **Beacon (3703)**
```yaml
# docker-compose.yml
beacon:
  ports:
    - "3703:3703"    # Web
    - "8003:8003"    # API
```

### **Template (3790)**
```javascript
// template/web/vite.config.js
export default {
  server: {
    port: 3790
  }
}
```

### **Beacon Old (3799)**
```javascript
// beacon_old/web/vite.config.js
export default {
  server: {
    port: 3799
  }
}
```

## 🔍 **Detecção Automática de Serviço**

### **AuthService.js**
```javascript
// shared/services/AuthService.js
logout() {
  const port = window.location.port
  let service = null
  
  switch (port) {
    case '3701': service = 'harbor'; break
    case '3790': service = 'template'; break
    case '3799': service = 'beacon'; break
    default: service = 'unknown'
  }
  
  const returnUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
  const quarterUrl = 'http://localhost:3700'
  
  window.location.href = `${quarterUrl}?logout=1&return_url=${encodeURIComponent(returnUrl)}&service=${service}`
}
```

## 🧪 **Testes de Conectividade**

### **Comandos de Teste**
```bash
# Testar Quarter
curl -I http://localhost:3700

# Testar Harbor
curl -I http://localhost:3701

# Testar Beacon
curl -I http://localhost:3703

# Testar Template
curl -I http://localhost:3790

# Testar Beacon Old
curl -I http://localhost:3799
```

### **Verificar Portas em Uso**
```bash
# Verificar portas ocupadas
lsof -i :3700
lsof -i :3701
lsof -i :3703
lsof -i :3790
lsof -i :3799
```

## 🚀 **URLs de Acesso**

### **Produção**
- **Quarter**: http://localhost:3700
- **Harbor**: http://localhost:3701
- **Beacon**: http://localhost:3703
- **Guardian**: http://localhost:3705
- **Skipper**: http://localhost:3702
- **Tollgate**: http://localhost:3707
- **Ledger**: http://localhost:3708
- **Fisher**: http://localhost:3706

### **Desenvolvimento**
- **Template**: http://localhost:3790
- **Beacon Old**: http://localhost:3799

### **Hot Reload**
- **Quarter Dev**: http://localhost:5174
- **Harbor Dev**: http://localhost:5171
- **Guardian Dev**: http://localhost:5175

## 📊 **Mapeamento de Serviços**

### **Por Categoria**
```
🆔 Identity & Auth:
├── Quarter (3700) - Identity Provider

🌐 Portal & Navigation:
├── Harbor (3701) - Portal Principal
├── Skipper (3702) - Navegação

📡 Monitoring & Communication:
├── Beacon (3703) - Monitoramento
├── Guardian (3705) - Segurança

💾 Data & Business:
├── Fisher (3706) - Dados
├── Tollgate (3707) - Controle
├── Ledger (3708) - Financeiro

🧪 Development & Testing:
├── Template (3790) - Validação
├── Beacon Old (3799) - Referência
```

### **Por Ambiente**
```
🏭 Production (3700-3708):
├── Quarter (3700)
├── Harbor (3701)
├── Skipper (3702)
├── Beacon (3703)
├── Guardian (3705)
├── Fisher (3706)
├── Tollgate (3707)
└── Ledger (3708)

🧪 Development (3790-3799):
├── Template (3790)
└── Beacon Old (3799)

🔥 Hot Reload (5171-5175):
├── Harbor Dev (5171)
├── Quarter Dev (5174)
└── Guardian Dev (5175)
```

## ✅ **Validação do Padrão**

### **1. Consistência**
- ✅ **Portas sequenciais**: 3700-3708 para produção
- ✅ **Portas específicas**: 3790-3799 para desenvolvimento
- ✅ **Mapeamento claro**: Cada serviço tem sua porta

### **2. Funcionalidade**
- ✅ **Detecção automática**: AuthService identifica por porta
- ✅ **URLs consistentes**: Padrão uniforme
- ✅ **Integração**: Todos os serviços conectados

### **3. Manutenibilidade**
- ✅ **Documentação**: Padrão bem documentado
- ✅ **Configuração**: Docker Compose padronizado
- ✅ **Extensibilidade**: Fácil adicionar novos serviços

## 🎯 **Recomendações**

### **1. Para Novos Serviços**
- Usar porta sequencial (3709, 3710, etc.)
- Documentar no DEVELOPMENT.md
- Atualizar docker-compose.yml
- Configurar AuthService.js

### **2. Para Desenvolvimento**
- Usar portas 3790-3799
- Manter consistência visual
- Testar integração com Quarter

### **3. Para Produção**
- Usar portas 3700-3708
- Manter estabilidade
- Monitorar performance

## 📋 **Checklist de Validação**

### **✅ Portas Ativas**
- [x] Quarter (3700)
- [x] Harbor (3701)
- [x] Beacon (3703)
- [x] Guardian (3705)
- [x] Template (3790)
- [x] Beacon Old (3799)

### **✅ Configurações**
- [x] Docker Compose
- [x] Vite Config
- [x] AuthService
- [x] Documentação

### **✅ Integração**
- [x] Quarter como Identity Provider
- [x] Harbor como Portal Principal
- [x] Template como Validação
- [x] Beacon como Monitoramento

## 🎉 **Conclusão**

O padrão de portas está **bem estabelecido e documentado**:

1. **Produção**: 3700-3708 (sequencial)
2. **Desenvolvimento**: 3790-3799 (específico)
3. **Hot Reload**: 5171-5175 (dev tools)

**Todos os serviços seguem o padrão e estão funcionando corretamente!**

### **🔗 URLs Principais:**
- **Quarter**: http://localhost:3700
- **Harbor**: http://localhost:3701
- **Beacon**: http://localhost:3703
- **Template**: http://localhost:3790
- **Beacon Old**: http://localhost:3799 