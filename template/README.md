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
