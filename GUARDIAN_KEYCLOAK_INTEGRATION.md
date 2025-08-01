# 🛡️ Guardian - Integração Completa com Keycloak

## 🎯 **Visão Geral**

O **Guardian** é o sistema de segurança centralizado do Canonika que aproveita **TODAS** as funcionalidades nativas do Keycloak, mantendo nossa identidade visual e diretrizes do projeto.

## 🔐 **Funcionalidades Keycloak Aproveitadas**

### **1. Keycloak Hosted Pages - ✅ INTEGRADO**

#### **Telas de Autenticação**
- **Login**: `http://localhost:8080/auth/realms/canonika/protocol/openid-connect/auth`
- **Cadastro**: `http://localhost:8080/auth/realms/canonika/login-actions/registration`
- **Esqueci a Senha**: `http://localhost:8080/auth/realms/canonika/login-actions/reset-credentials`
- **MFA/TOTP**: `http://localhost:8080/auth/realms/canonika/login-actions/otp`
- **WebAuthn**: `http://localhost:8080/auth/realms/canonika/login-actions/webauthn`

#### **Telas de Consentimento**
- **Consentimento OAuth**: `http://localhost:8080/auth/realms/canonika/protocol/openid-connect/auth`
- **Seleção de IdP**: `http://localhost:8080/auth/realms/canonika/broker/`

### **2. Keycloak Admin Console - ✅ INTEGRADO**

#### **Gestão de Usuários**
- **URL**: `http://localhost:8080/admin`
- **Credenciais**: `admin` / `admin123`
- **Funcionalidades**:
  - ✅ Criação e edição de usuários
  - ✅ Gestão de grupos e hierarquias
  - ✅ Configuração de roles e permissões
  - ✅ Controle de sessões ativas
  - ✅ Configuração de políticas de senha
  - ✅ Gestão de clientes (aplicações)

#### **Gestão de Clientes**
- **Configuração OAuth/OIDC**
- **Scopes e Permissões**
- **Redirecionamentos**
- **Secrets e Tokens**

### **3. Keycloak Account Console - ✅ INTEGRADO**

#### **Self-Service do Usuário**
- **URL**: `http://localhost:8080/auth/realms/canonika/account`
- **Funcionalidades**:
  - ✅ Atualização de perfil
  - ✅ Troca de senha
  - ✅ Gerenciamento de dispositivos
  - ✅ Configuração de MFA
  - ✅ Visualização de sessões
  - ✅ Apps autorizados

### **4. Temas Keycloak - ✅ IMPLEMENTADO**

#### **Tema Corporativo Canonika**
```css
/* Aplicação do tema Canonika no Keycloak */
:root {
  --canonika-primary: #1e40af;
  --canonika-secondary: #64748b;
  --canonika-accent: #f59e0b;
  --canonika-success: #10b981;
  --canonika-danger: #ef4444;
}
```

## 🎨 **Identidade Visual Mantida**

### **1. Design System Canonika**
- ✅ **Cores**: Apenas as definidas no Design System
- ✅ **Tipografia**: Classes padronizadas
- ✅ **Componentes**: Reutilizáveis e consistentes
- ✅ **Espaçamentos**: Variáveis CSS unificadas

### **2. Componentes Compartilhados**
```vue
<!-- Guardian usa os mesmos componentes -->
<template>
  <div class="canonika-app">
    <header class="canonika-header">
      <!-- Header unificado -->
    </header>
    <nav class="canonika-sidebar">
      <!-- Sidebar unificado -->
    </nav>
    <main class="canonika-main">
      <!-- Conteúdo específico do Guardian -->
    </main>
  </div>
</template>
```

### **3. Estilos Unificados**
```css
/* Importação dos estilos compartilhados */
@import '../../../shared/styles/design-system.css';
@import '../../../shared/styles/canonika-view.css';
@import '../../../shared/styles/canonika-icons.css';
@import '../../../shared/styles/canonika-theme.css';
```

## 🚀 **Funcionalidades do Guardian**

### **1. Dashboard de Segurança**
- **Status dos Serviços**: Keycloak, OPA, ClickHouse, Redis
- **Ações Rápidas**: Links diretos para consoles
- **Monitoramento**: Métricas em tempo real

### **2. Keycloak Admin Console**
- **Acesso Direto**: Botão para abrir console
- **Informações**: URLs e credenciais
- **Funcionalidades**: Lista de recursos disponíveis

### **3. Sistema de Autenticação**
- **Métodos Ativos**: Login/Password, MFA/TOTP, WebAuthn, SAML
- **Controle**: Ativar/desativar métodos
- **Status**: Monitoramento em tempo real

### **4. Sistema de Autorização**
- **OPA Integration**: Status e políticas
- **Decisões/Minuto**: Métricas de performance
- **Acesso Direto**: Console OPA

### **5. Controle de Sessões**
- **Sessões Ativas**: Lista de usuários conectados
- **Encerramento**: Controle granular
- **Monitoramento**: IP, tempo de atividade

### **6. Logs de Auditoria**
- **Eventos Recentes**: Logs em tempo real
- **Filtros**: Por nível e serviço
- **Detalhes**: Usuário, IP, timestamp

## 🔧 **Integração Técnica**

### **1. URLs Configuradas**
```javascript
// Guardian - Configurações de integração
const keycloakConfig = {
  adminUrl: 'http://localhost:8080/admin',
  accountUrl: 'http://localhost:8080/auth/realms/canonika/account',
  authUrl: 'http://localhost:8080/auth/realms/canonika/protocol/openid-connect/auth',
  logoutUrl: 'http://localhost:8080/auth/realms/canonika/protocol/openid-connect/logout'
}
```

### **2. Métodos de Acesso**
```javascript
// Acesso direto aos consoles
openKeycloakAdmin() {
  window.open('http://localhost:8080/admin', '_blank')
},

openKeycloakAccount() {
  window.open('http://localhost:8080/auth/realms/canonika/account', '_blank')
}
```

### **3. Logout Integrado**
```javascript
// Logout via Keycloak
logout() {
  window.location.href = 'http://localhost:8080/auth/realms/canonika/protocol/openid-connect/logout'
}
```

## 📋 **Como Usar**

### **1. Acessar Guardian**
```bash
# URL: http://localhost:3705
# Credenciais: admin/admin123 (via Keycloak)
```

### **2. Dashboard Principal**
- **Status dos Serviços**: Verificar saúde dos componentes
- **Ações Rápidas**: Acesso direto aos consoles
- **Métricas**: Estatísticas de segurança

### **3. Keycloak Admin**
- **Gestão de Usuários**: Criar, editar, gerenciar
- **Configuração de Clientes**: Apps e permissões
- **Políticas de Segurança**: Senhas, MFA, sessões

### **4. Account Console**
- **Perfil do Usuário**: Dados pessoais
- **Segurança**: Senha, MFA, dispositivos
- **Sessões**: Controle de logins ativos

### **5. Autenticação**
- **Métodos Ativos**: Configuração de login
- **MFA**: TOTP, WebAuthn, SMS
- **Federação**: SAML, OIDC

### **6. Autorização**
- **OPA**: Políticas de acesso
- **Métricas**: Performance e decisões
- **Console**: Interface de gestão

## 🎯 **Vantagens da Integração**

### **1. Zero Reimplementação**
- ✅ **Hosted Pages**: Telas nativas do Keycloak
- ✅ **Admin Console**: Gestão completa via Keycloak
- ✅ **Account Console**: Self-service nativo
- ✅ **Temas**: Aplicação de identidade visual

### **2. Manutenção Simplificada**
- ✅ **Atualizações**: Automáticas via Keycloak
- ✅ **Segurança**: Patches e correções
- ✅ **Funcionalidades**: Novas features nativas

### **3. Consistência Visual**
- ✅ **Design System**: Aplicado em todo o sistema
- ✅ **Componentes**: Reutilizáveis
- ✅ **Experiência**: Unificada

### **4. Escalabilidade**
- ✅ **Performance**: Otimizada pelo Keycloak
- ✅ **Confiabilidade**: Sistema maduro e testado
- ✅ **Integração**: Padrões abertos (OIDC/SAML)

## 🔐 **Segurança Enterprise**

### **1. Autenticação Robusta**
- **Múltiplos Fatores**: TOTP, WebAuthn, SMS
- **Federação**: SAML, OIDC, LDAP
- **Políticas**: Senhas fortes, expiração

### **2. Autorização Granular**
- **OPA**: Políticas ABAC/ReBAC
- **Roles**: Hierarquia de permissões
- **Scopes**: Controle fino de acesso

### **3. Auditoria Completa**
- **Logs**: Todas as ações registradas
- **ClickHouse**: Análise e relatórios
- **Compliance**: LGPD, SOX, PCI

### **4. Monitoramento**
- **Health Checks**: Status dos serviços
- **Métricas**: Performance e uso
- **Alertas**: Notificações em tempo real

## 🎉 **Resultado Final**

O **Guardian** aproveita **100%** das funcionalidades nativas do Keycloak:

- ✅ **Hosted Pages**: Login, cadastro, MFA, consentimento
- ✅ **Admin Console**: Gestão completa de usuários e apps
- ✅ **Account Console**: Self-service do usuário
- ✅ **Temas**: Identidade visual Canonika aplicada
- ✅ **Zero Reimplementação**: Aproveitamento total
- ✅ **Manutenção Simplificada**: Atualizações automáticas
- ✅ **Segurança Enterprise**: Padrões industriais

**O Guardian é o centro de controle de segurança do Canonika, integrando perfeitamente com Keycloak e mantendo nossa identidade visual!** 🛡️ 