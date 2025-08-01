# 🚀 Guia: Login Centralizado para Todos os Serviços

## 📋 **Objetivo**
Centralizar a página de login para que todos os serviços usem o mesmo componente `LoginTemplate`, baseado na implementação oficial do Harbor.

## ✅ **Status Atual**
- ✅ **LoginTemplate criado**: `shared/templates/LoginTemplate.vue`
- ✅ **Beacon atualizado**: Usando login centralizado
- ⏳ **Outros serviços**: Pendentes de atualização

## 🔧 **Implementação no Beacon (Concluída)**

### 1. **Componente Centralizado**
```vue
<!-- shared/templates/LoginTemplate.vue -->
<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Interface de login padronizada -->
    </div>
  </div>
</template>
```

### 2. **MasterPage Atualizada**
```vue
<!-- beacon/web/src/components/MasterPage.vue -->
<template>
  <!-- Tela de login centralizada -->
  <LoginTemplate 
    v-if="!user"
    :title="`Acesso ao ${serviceConfig.name}`"
    :subtitle="serviceConfig.description"
    @login-success="handleLoginSuccess"
  />
</template>
```

### 3. **Funcionalidades Implementadas**
- ✅ **Login unificado**: Mesma interface para todos os serviços
- ✅ **Persistência**: Estado salvo no localStorage
- ✅ **Autenticação**: Carregamento automático do estado
- ✅ **Logout**: Limpeza do estado de autenticação

## 📝 **Passos para Outros Serviços**

### **Passo 1: Copiar LoginTemplate**
```bash
cp shared/templates/LoginTemplate.vue [servico]/web/src/components/
```

### **Passo 2: Atualizar MasterPage**
```vue
<!-- Importar o componente -->
import LoginTemplate from './LoginTemplate.vue'

<!-- Adicionar aos components -->
components: {
  LoginTemplate
}

<!-- Substituir a tela de login -->
<LoginTemplate 
  v-if="!user"
  :title="`Acesso ao ${serviceConfig.name}`"
  :subtitle="serviceConfig.description"
  @login-success="handleLoginSuccess"
/>
```

### **Passo 3: Atualizar Métodos**
```javascript
// Adicionar métodos de autenticação
handleLoginSuccess(user) {
  this.user = user;
  this.$emit('login', user);
},
loadAuthState() {
  const authenticated = localStorage.getItem('canonika_authenticated');
  const userData = localStorage.getItem('canonika_user');
  
  if (authenticated === 'true' && userData) {
    try {
      this.user = JSON.parse(userData);
    } catch (e) {
      this.clearAuthState();
    }
  }
},
clearAuthState() {
  localStorage.removeItem('canonika_user');
  localStorage.removeItem('canonika_authenticated');
}
```

### **Passo 4: Remover Estilos Antigos**
- Remover estilos de login do MasterPage
- Manter apenas os estilos do LoginTemplate

## 🎯 **Serviços Pendentes**

### **Prioridade Alta**
- [ ] **Harbor**: Atualizar para usar LoginTemplate
- [ ] **Fisher**: Implementar login centralizado
- [ ] **Skipper**: Implementar login centralizado

### **Prioridade Média**
- [ ] **Tollgate**: Implementar login centralizado
- [ ] **Quarter**: Implementar login centralizado
- [ ] **Diver**: Implementar login centralizado

### **Prioridade Baixa**
- [ ] **Dock**: Implementar login centralizado
- [ ] **Echo**: Implementar login centralizado
- [ ] **Guardian**: Implementar login centralizado
- [ ] **Mapmaker**: Implementar login centralizado
- [ ] **Seagull**: Implementar login centralizado
- [ ] **Wayfinder**: Implementar login centralizado

## 🔄 **Benefícios da Centralização**

### **1. Consistência Visual**
- ✅ Interface idêntica em todos os serviços
- ✅ Mesma experiência de usuário
- ✅ Branding unificado

### **2. Manutenibilidade**
- ✅ Alterações em um só lugar
- ✅ Correções automáticas em todos os serviços
- ✅ Redução de código duplicado

### **3. Funcionalidades Unificadas**
- ✅ Persistência de login entre serviços
- ✅ Logout global
- ✅ Estados de autenticação sincronizados

### **4. Desenvolvimento**
- ✅ Hot reload funcionando
- ✅ Componentes reutilizáveis
- ✅ Arquitetura escalável

## 🚀 **Próximos Passos**

1. **Aplicar ao Harbor** (serviço principal)
2. **Implementar nos serviços críticos** (Fisher, Skipper)
3. **Padronizar demais serviços**
4. **Testar navegação entre serviços**
5. **Implementar logout global**

## 📊 **Status de Implementação**

| Serviço | Status | Porta | Login Centralizado |
|---------|--------|-------|-------------------|
| Harbor | ⏳ Pendente | 3701 | ❌ |
| Beacon | ✅ Concluído | 3708 | ✅ |
| Fisher | ⏳ Pendente | 3702 | ❌ |
| Skipper | ⏳ Pendente | 3703 | ❌ |
| Tollgate | ⏳ Pendente | 3704 | ❌ |
| Quarter | ⏳ Pendente | 3705 | ❌ |
| Diver | ⏳ Pendente | 3706 | ❌ |
| Dock | ⏳ Pendente | 3707 | ❌ |
| Echo | ⏳ Pendente | 3709 | ❌ |
| Guardian | ⏳ Pendente | 3710 | ❌ |
| Mapmaker | ⏳ Pendente | 3711 | ❌ |
| Seagull | ⏳ Pendente | 3712 | ❌ |
| Wayfinder | ⏳ Pendente | 3713 | ❌ |

---

**🎉 Resultado**: Login centralizado implementado com sucesso no Beacon! Agora todos os serviços podem usar o mesmo padrão de autenticação. 