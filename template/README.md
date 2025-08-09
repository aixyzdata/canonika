# 🧪 Template Service

## 📋 Visão Geral

O **Template Service** é um serviço de teste e validação dos componentes compartilhados da plataforma Canonika. Ele demonstra a integração Bootstrap 5 e os padrões CSS estabelecidos.

## 🚀 Execução

### **Desenvolvimento Local**
```bash
cd template/web
npm install
npm run dev
```

### **API via Docker (recomendado)**
```bash
# Build da imagem
docker build -t canonika_template_api:latest -f template/api/Dockerfile template/api

# Verificar/crear rede compartilhada (usada pelo Canonika)
docker network ls | grep canonika_canonika-network \
  || docker network create --subnet 172.20.0.0/16 canonika_canonika-network

# Subir API na porta 8015 e conectar na rede
docker run -d --name canonika_template_api \
  --network canonika_canonika-network \
  -p 8015:8015 canonika_template_api:latest

# Health check
curl -s http://localhost:8015/health
```

### **Conflito de Porta (8015 já em uso)**
Se aparecer o erro "port is already allocated" ao subir a API:
```bash
# 1) Descobrir quem ocupa a porta 8015
lsof -i :8015
docker ps --format 'table {{.Names}}\t{{.Ports}}'

# 2a) Parar o container existente
docker rm -f canonika_template_api

# 2b) OU subir em outra porta do host (ex.: 3815)
docker run -d --name canonika_template_api_alt \
  --network canonika_canonika-network \
  -p 3815:8015 canonika_template_api:latest
```

### **Conectar container existente à rede**
Se a API foi iniciada sem rede, conecte-a à rede compartilhada:
```bash
docker network connect canonika_canonika-network canonika_template_api
```

### **Acesso**
- **URL**: http://localhost:3790
- **Porta Web**: 3790
- **Porta API**: 8015

## 🧩 Componentes Testados

### **CanonikaMasterPage**
- Layout principal integrado
- Header + Sidebar + Main Content
- Responsividade completa

### **CanonikaHeader**
- Logo animada com hexágono
- Informações do usuário
- Status do sistema
- Bootstrap 5 integration

### **CanonikaSidebar**
- Navegação lateral colapsável
- Seções dinâmicas
- Estados expandido/colapsado
- Mobile overlay

## 🎨 Bootstrap 5 Integration

### **Classes Utilizadas**
- Grid System: `.row`, `.col-md-*`
- Flexbox: `.d-flex`, `.align-items-center`
- Typography: `.display-4`, `.lead`
- Spacing: `.mb-5`, `.p-3`

### **Componentes Canonika**
- Cards: `.card-canonika`
- Badges: `.badge-canonika`
- Buttons: `.btn-canonika-primary`
- Layout: `.canonika-container`

## 📱 Responsividade

### **Desktop (> 768px)**
- Layout completo com sidebar
- Grid system com 3 colunas
- Espaçamento otimizado

### **Mobile (≤ 768px)**
- Layout em coluna única
- Sidebar como overlay
- Componentes adaptados

## 🧪 Funcionalidades de Teste

### **Validação Visual**
- ✅ Header com logo animada
- ✅ Sidebar colapsável
- ✅ Layout responsivo
- ✅ Cores e gradientes

### **Bootstrap 5**
- ✅ Grid system funcionando
- ✅ Classes utilitárias
- ✅ Componentes responsivos
- ✅ Typography classes

### **Canonika Classes**
- ✅ Cards customizados
- ✅ Badges personalizados
- ✅ Botões com gradientes
- ✅ Variáveis CSS

## 📋 Configurações

### **Header Config**
```javascript
{
  logoText: 'CANONIKA',
  logoSubtitle: 'TEMPLATE',
  user: {
    name: 'Administrador Template',
    initial: 'T'
  },
  systemStatus: 'ONLINE',
  isOnline: true
}
```

### **Sidebar Config**
```javascript
{
  brandText: 'Template',
  brandIcon: 'fas fa-cube',
  user: {
    name: 'Admin Template',
    role: 'Template Admin',
    initial: 'T'
  },
  navigationSections: [
    // Seções de navegação
  ]
}
```

## 🎯 Objetivo

Demonstrar e validar todos os componentes refatorados da plataforma Canonika, garantindo:
- Integração Bootstrap 5
- Padrões CSS estabelecidos
- Responsividade completa
- Performance otimizada

---

**🚀 Status**: Template Service funcionando na porta 3790!
