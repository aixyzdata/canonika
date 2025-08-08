# 🏗️ Canonika - Arquitetura

## 📋 Visão Geral

A plataforma Canonika segue uma arquitetura modular onde cada serviço mantém suas próprias views e o Harbor (portal central) as carrega dinamicamente.

## 🏛️ Estrutura da Arquitetura

```
canonika/
├── harbor/                    # Portal central unificado
│   ├── api/                  # Backend FastAPI
│   ├── web/                  # Frontend Vue.js
│   │   ├── services.js       # Configuração dos serviços
│   │   ├── main.js          # Carregamento dinâmico de views
│   │   └── App.vue          # Interface principal
│   └── nginx/               # Proxy reverso
├── quarter/                  # Ponto de entrada centralizado
│   ├── api/                 # Backend FastAPI
│   ├── web/                 # Frontend Vue.js
│   └── nginx/               # Proxy reverso
├── guardian/                # Sistema de segurança
│   ├── api/                 # Backend FastAPI
│   └── web/                 # Frontend Vue.js
├── beacon/                  # Sistema de monitoramento
│   ├── api/                 # Backend FastAPI
│   └── web/                 # Frontend Vue.js
├── shared/                  # Recursos compartilhados
│   ├── styles/             # CSS compartilhado
│   └── config/             # Configurações
└── [outros serviços]/
    ├── api/
    ├── web/
    └── views/
        └── [ServiceName]View.vue
```

## 🔧 Componentes Principais

### **1. Harbor (Portal Central)**
- **Função**: Portal unificado que integra todos os serviços
- **Tecnologia**: Vue.js + FastAPI
- **Responsabilidades**:
  - Login único (SSO)
  - Navegação entre serviços
  - Carregamento dinâmico de views
  - Identidade visual consistente

### **2. Quarter (Ponto de Entrada)**
- **Função**: Ponto de entrada centralizado
- **Tecnologia**: Vue.js + FastAPI
- **Responsabilidades**:
  - Autenticação centralizada
  - Redirecionamento para serviços
  - Interface responsiva

### **3. Views Modulares**
- **Localização**: `{serviço}/views/{ServiceName}View.vue`
- **Responsabilidades**:
  - Interface específica do serviço
  - Lógica de negócio específica
  - Integração com API do serviço
  - Design consistente com o Harbor

### **4. Sistema de Configuração**
- **Arquivo**: `harbor/web/services.js`
- **Função**: Mapear serviços e suas views
- **Benefícios**:
  - Configuração centralizada
  - Fácil adição de novos serviços
  - Metadados dos serviços (ícones, cores, etc.)

## 🚀 Como Funciona

### **1. Carregamento Dinâmico**
```javascript
// harbor/web/main.js
const loadServiceViews = async () => {
  const TollgateView = await import('../../tollgate/views/TollgateView.vue')
  const QuarterView = await import('../../quarter/views/QuarterView.vue')
  // ... outros serviços
  
  app.component('TollgateView', TollgateView.default)
  app.component('QuarterView', QuarterView.default)
  // ... registrar outros componentes
}
```

### **2. Configuração de Serviços**
```javascript
// harbor/web/services.js
export const services = {
  tollgate: {
    name: 'Tollgate',
    title: 'Tollgate - Sistema de Créditos',
    description: 'Controle de créditos e consumo da plataforma',
    icon: 'fas fa-coins',
    color: '#3b82f6',
    view: 'TollgateView',
    path: '../../tollgate/views/TollgateView.vue'
  },
  // ... outros serviços
}
```

### **3. Renderização Dinâmica**
```vue
<!-- harbor/web/App.vue -->
<component 
  :is="getServiceComponent()" 
  v-if="getServiceComponent()"
  class="service-view"
/>
```

## 📦 Benefícios da Arquitetura

### **✅ Vantagens**
1. **Modularidade**: Cada serviço é independente
2. **Escalabilidade**: Fácil adição de novos serviços
3. **Manutenibilidade**: Código organizado por domínio
4. **Reutilização**: Views podem ser usadas em outros contextos
5. **Desenvolvimento Paralelo**: Equipes podem trabalhar independentemente
6. **Consistência**: Design unificado através do Harbor

### **🔧 Flexibilidade**
- Views podem ser desenvolvidas independentemente
- Cada serviço pode ter sua própria API
- Fácil customização por serviço
- Possibilidade de deploy independente

## 🛠️ Como Adicionar um Novo Serviço

### **1. Criar Estrutura**
```bash
mkdir novo-servico
mkdir novo-servico/views
```

### **2. Criar View**
```vue
<!-- novo-servico/views/NovoServicoView.vue -->
<template>
  <div class="novo-servico-view">
    <!-- Interface específica do serviço -->
  </div>
</template>

<script>
export default {
  name: 'NovoServicoView',
  // Lógica específica do serviço
}
</script>
```

### **3. Configurar no Harbor**
```javascript
// harbor/web/services.js
export const services = {
  // ... serviços existentes
  'novo-servico': {
    name: 'NovoServico',
    title: 'Novo Serviço - Descrição',
    description: 'Descrição do novo serviço',
    icon: 'fas fa-icon',
    color: '#color',
    view: 'NovoServicoView',
    path: '../../novo-servico/views/NovoServicoView.vue'
  }
}
```

### **4. Registar no main.js**
```javascript
// harbor/web/main.js
const NovoServicoView = await import('../../novo-servico/views/NovoServicoView.vue')
app.component('NovoServicoView', NovoServicoView.default)
```

## 🎨 Padrões de Design

### **Consistência Visual**
- Todas as views seguem o mesmo padrão de design
- Cores e estilos definidos no Harbor
- Componentes reutilizáveis

### **Estrutura Padrão das Views**
```vue
<template>
  <div class="service-view">
    <div class="view-header">
      <!-- Status e ações -->
    </div>
    <div class="view-content">
      <!-- Conteúdo específico do serviço -->
    </div>
  </div>
</template>
```

## 🔄 Fluxo de Dados

1. **Usuário acessa Quarter**
2. **Login único (SSO)**
3. **Redirecionamento para Harbor**
4. **Navegação para serviço**
5. **Harbor carrega view dinamicamente**
6. **View se comunica com API do serviço**
7. **Dados são exibidos na interface**

## 🧪 Testes e Qualidade

### **Testes por Serviço**
- Cada view pode ser testada independentemente
- APIs podem ser testadas isoladamente
- Integração testada no Harbor

### **Qualidade de Código**
- Padrões consistentes em todos os serviços
- Documentação específica por módulo
- Revisão de código por domínio

## 📚 Documentação por Serviço

Cada serviço deve ter sua própria documentação:

```
{serviço}/
├── README.md              # Documentação do serviço
├── API.md                 # Documentação da API
├── views/
│   └── README.md         # Documentação das views
└── tests/                # Testes específicos
```

## 🚀 Deploy e Infraestrutura

### **Desenvolvimento**
- Todos os serviços rodam localmente
- Harbor integra todos os serviços
- Hot reload para desenvolvimento

### **Produção**
- Cada serviço pode ser deployado independentemente
- Harbor como ponto de entrada único
- Load balancing entre instâncias

## 🔮 Próximos Passos

1. **Implementar views específicas** para todos os serviços
2. **Configurar APIs** de cada serviço
3. **Adicionar testes** para cada módulo
4. **Implementar cache** para melhor performance
5. **Adicionar monitoramento** por serviço
6. **Criar documentação** específica de cada módulo

---

**🎯 Objetivo**: Criar uma plataforma modular, escalável e fácil de manter, onde cada serviço é independente mas integrado através do Harbor. 
 
 