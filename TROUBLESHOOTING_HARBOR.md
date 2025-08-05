# Troubleshooting Harbor - Problemas de Autenticação

## 🔍 Diagnóstico Inicial

### 1. Verificar se os serviços estão rodando

```bash
node check_services.js
```

**Resultado esperado:**
- Quarter (3700): ✅ Online
- Harbor (3701): ✅ Online

### 2. Testar fluxo completo

```bash
node test_fluxo_harbor.js
```

## 🚨 Problemas Comuns e Soluções

### Problema 1: Harbor não redireciona para Quarter

**Sintomas:**
- Acessa `http://localhost:3701` e fica na página
- Não aparece tela de login do Quarter

**Soluções:**
1. Verificar se o AuthService está sendo importado corretamente
2. Verificar se o método `checkAuthentication()` está sendo chamado
3. Verificar se o `redirectToQuarter()` está funcionando

**Debug:**
```javascript
// No console do browser, verificar:
console.log('AuthService:', authService);
console.log('isAuthenticated:', authService.isAuthenticated());
```

### Problema 2: Quarter não redireciona de volta para Harbor

**Sintomas:**
- Faz login no Quarter
- Fica na página do Quarter após login
- Não volta para Harbor

**Soluções:**
1. Verificar se o parâmetro `redirect_to` está sendo passado
2. Verificar se os cookies estão sendo salvos corretamente
3. Verificar se o redirecionamento está funcionando

**Debug:**
```javascript
// No console do Quarter, verificar:
console.log('redirect_to:', new URLSearchParams(window.location.search).get('redirect_to'));
console.log('Cookies:', document.cookie);
```

### Problema 3: Cookies não estão sendo salvos

**Sintomas:**
- Login funciona mas não persiste
- Sempre volta para Quarter

**Soluções:**
1. Verificar se os cookies estão sendo configurados corretamente
2. Verificar se não há problemas de CORS
3. Verificar se o domínio está correto

**Debug:**
```javascript
// Verificar cookies no console:
console.log('Todos os cookies:', document.cookie);
console.log('canonika_authenticated:', document.cookie.includes('canonika_authenticated'));
```

### Problema 4: Harbor não reconhece autenticação

**Sintomas:**
- Volta do Quarter com cookies
- Harbor ainda mostra tela de login

**Soluções:**
1. Verificar se o AuthService está lendo cookies corretamente
2. Verificar se o método `isAuthenticated()` está funcionando
3. Verificar se o `getCurrentUser()` está retornando dados

**Debug:**
```javascript
// No console do Harbor:
console.log('AuthService:', authService);
console.log('isAuthenticated:', authService.isAuthenticated());
console.log('getCurrentUser:', authService.getCurrentUser());
```

## 🛠️ Scripts de Debug

### 1. Verificar serviços
```bash
node check_services.js
```

### 2. Testar fluxo completo
```bash
node test_fluxo_harbor.js
```

### 3. Testar com cookies limpos
```bash
node test_fluxo_limpo.js
```

### 4. Verificar logs em tempo real
```bash
# Terminal 1 - Harbor
cd harbor/web && npm run dev

# Terminal 2 - Quarter  
cd quarter/web && npm run dev

# Terminal 3 - Teste
node test_fluxo_harbor.js
```

## 🔧 Configurações Importantes

### 1. URLs corretas
- Quarter: `http://localhost:3700`
- Harbor: `http://localhost:3701`

### 2. Cookies necessários
- `canonika_token`: JWT token
- `canonika_authenticated`: Flag de autenticação
- `canonika_refresh`: Refresh token

### 3. Credenciais de teste
- Email: `admin@canonika.io`
- Senha: `admin123`

## 📋 Checklist de Verificação

- [ ] Quarter está rodando na porta 3700
- [ ] Harbor está rodando na porta 3701
- [ ] AuthService está importado no Harbor
- [ ] Cookies estão sendo salvos corretamente
- [ ] Redirecionamentos estão funcionando
- [ ] Autenticação está sendo verificada
- [ ] MasterPage está sendo exibida após login

## 🆘 Se nada funcionar

1. **Limpar tudo:**
   ```bash
   # Parar todos os serviços
   pkill -f "npm run dev"
   
   # Limpar cookies do browser
   # Abrir DevTools > Application > Storage > Clear site data
   
   # Reiniciar serviços
   ./start-canonika.sh
   ```

2. **Verificar logs:**
   - Abrir DevTools > Console
   - Verificar erros JavaScript
   - Verificar logs de rede

3. **Testar manualmente:**
   - Acessar `http://localhost:3701`
   - Verificar se redireciona para `http://localhost:3700`
   - Fazer login com `admin@canonika.io` / `admin123`
   - Verificar se volta para `http://localhost:3701`

## 📞 Logs de Debug

Adicione estes logs para debug:

```javascript
// No Quarter - App.vue
console.log('🔐 Quarter: handleLogin chamado');
console.log('🍪 Quarter: Cookies salvos:', document.cookie);
console.log('🔄 Quarter: Redirecionando para:', targetUrl);

// No Harbor - AuthService.js
console.log('🔍 Harbor: checkAuthentication chamado');
console.log('🍪 Harbor: Cookies encontrados:', document.cookie);
console.log('👤 Harbor: Usuário:', this.getCurrentUser());
``` 