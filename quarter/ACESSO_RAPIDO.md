# 🚀 Acesso Rápido - Quartermaster

## 🌐 URLs de Acesso

### **Frontend (Interface Web)**
```
http://localhost:7725/web/
```

### **API (Backend)**
```
http://localhost:7725/api/
```

### **Documentação da API (Swagger)**
```
http://localhost:7725/api/docs
```

## 🔑 Credenciais de Login

### **Usuário Administrador**
```
Email: admin@canonika.io
Senha: Admin@123
```

### **Usuário Supervisor**
```
Email: supervisor@canonika.io
Senha: Super@123
```

### **Usuário Operador**
```
Email: operator@canonika.io
Senha: Oper@123
```

## 🎯 Funcionalidades Principais

### **1. Dashboard**
- Estatísticas em tempo real
- Gráficos de uso
- Alertas e notificações
- Ações rápidas

### **2. Gestão de Usuários**
- **Aba Usuários:** Lista e gestão de usuários
- **Aba Roles:** Gestão de roles e permissões
- **Aba Tokens API:** Gestão de tokens de integração
- **Aba Auditoria:** Logs de atividades
- **Aba Créditos:** Controle de uso de recursos

### **3. Menu de Usuário (Header)**
- **Perfil:** Informações do usuário logado
- **Configurações:** Preferências do sistema
- **Sair:** Logout seguro

## 🛠️ Comandos Úteis

### **Iniciar o Sistema**
```bash
cd quarter
docker-compose up -d
```

### **Parar o Sistema**
```bash
docker-compose down
```

### **Rebuild Completo**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### **Ver Logs**
```bash
docker logs canonika_quartermaster
```

### **Acessar Container**
```bash
docker exec -it canonika_quartermaster sh
```

## 🔧 Troubleshooting

### **Problema: Página não carrega**
```bash
# Verificar se o container está rodando
docker ps | grep quartermaster

# Verificar logs
docker logs canonika_quartermaster

# Rebuild se necessário
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### **Problema: Login não funciona**
```bash
# Testar API diretamente
curl -X POST http://localhost:7725/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@canonika.io","password":"Admin@123"}'
```

### **Problema: Assets não carregam**
```bash
# Verificar build do frontend
docker exec canonika_quartermaster ls -la /app/web/dist/

# Rebuild frontend
docker-compose exec quartermaster npm run build
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## 🎨 Design

### **Tema Atual**
- **Fundo:** Gradiente azul/roxo escuro
- **Cores:** Azul tecnológico (#3b82f6)
- **Tipografia:** Moderna e legível
- **Efeitos:** Blur e transparências

### **Navegação**
- **Header:** Logo + menu de usuário
- **Sidebar:** Dashboard + Usuários
- **Conteúdo:** Dinâmico baseado na seleção

## 📊 Dados de Teste

### **Usuários Disponíveis**
- **admin@canonika.io** (Administrador)
- **supervisor@canonika.io** (Supervisor)
- **operator@canonika.io** (Operador)

### **Roles Disponíveis**
- **admin:** Acesso total
- **analyst:** Leitura e análise
- **operator:** Operações limitadas
- **viewer:** Apenas visualização

### **Tokens de API**
- **Skipper Integration:** 1000 req/dia
- **Wayfinder API:** 500 req/dia
- **MapMaker Tools:** 200 req/dia

## 🚀 Próximos Passos

### **Para Desenvolvedores**
1. Explore a documentação da API em `/api/docs`
2. Teste os endpoints com diferentes usuários
3. Experimente as funcionalidades de auditoria
4. Verifique a responsividade em diferentes dispositivos

### **Para Administradores**
1. Configure roles e permissões
2. Monitore logs de auditoria
3. Gerencie tokens de API
4. Acompanhe uso de créditos

### **Para Usuários**
1. Explore o dashboard
2. Teste a navegação entre abas
3. Experimente o menu de usuário
4. Verifique a responsividade

---

**Sistema pronto para uso! 🎉**

*Guia criado em: Dezembro 2024* 