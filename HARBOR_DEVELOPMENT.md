# 🚀 GUIA DE DESENVOLVIMENTO - HARBOR

## 🔧 **PROBLEMA RESOLVIDO!**

O problema do hot reload foi resolvido criando um servidor de desenvolvimento dedicado.

## 📋 **OPÇÕES DE DESENVOLVIMENTO:**

### 🚀 **1. MODO DESENVOLVIMENTO (RECOMENDADO)**
```bash
# Inicia servidor de desenvolvimento com hot reload
./dev-harbor.sh

# Acesse: http://localhost:3000
# ✅ Hot reload funcionando
# ✅ Mudanças aplicadas instantaneamente
# ✅ Sem necessidade de rebuild
```

### 🔨 **2. MODO PRODUÇÃO**
```bash
# Build e deploy para produção
./build-harbor.sh

# Acesse: http://localhost:3701
# ⚠️  Sem hot reload
# ⚠️  Necessário rebuild após mudanças
```

## 🎯 **DIFERENÇAS:**

| Modo | URL | Hot Reload | Rebuild | Recomendado |
|------|-----|------------|---------|-------------|
| **Desenvolvimento** | http://localhost:3000 | ✅ Sim | ❌ Não | ✅ **SIM** |
| **Produção** | http://localhost:3701 | ❌ Não | ✅ Sim | ❌ Não |

## 🔧 **CONFIGURAÇÕES:**

### **Vite Config (harbor/web/vite.config.js)**
```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true
  }
});
```

### **Vue Router (harbor/web/main.js)**
```javascript
const router = createRouter({
  history: createWebHistory(),
  routes
});
```

## 📝 **INSTRUÇÕES DE USO:**

### **Para Desenvolvimento:**
1. Execute: `./dev-harbor.sh`
2. Acesse: http://localhost:3000
3. Faça mudanças nos arquivos
4. Veja as mudanças aplicadas automaticamente

### **Para Produção:**
1. Execute: `./build-harbor.sh`
2. Acesse: http://localhost:3701
3. Teste a versão final

## 🎯 **SOLUÇÃO DEFINITIVA:**

**Use sempre o modo de desenvolvimento (`./dev-harbor.sh`) para:**
- ✅ Desenvolvimento rápido
- ✅ Hot reload funcionando
- ✅ Mudanças instantâneas
- ✅ Debugging fácil

**Use o modo de produção (`./build-harbor.sh`) apenas para:**
- ✅ Teste final
- ✅ Deploy
- ✅ Demonstração

## 🚨 **IMPORTANTE:**

- **NUNCA** use o modo de produção para desenvolvimento
- **SEMPRE** use o modo de desenvolvimento para mudanças
- **SEMPRE** teste no modo de produção antes de commitar

---

## ✅ **PROBLEMA RESOLVIDO!**

Agora você tem:
- ✅ Hot reload funcionando
- ✅ Mudanças aplicadas instantaneamente
- ✅ Scripts automatizados
- ✅ Desenvolvimento rápido e eficiente 