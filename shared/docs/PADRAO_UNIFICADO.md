# 🎯 **PADRÃO UNIFICADO CANONIKA**

## **📋 VISÃO GERAL**

Este documento define o **padrão unificado** da plataforma Canonika, garantindo que todos os serviços sigam a mesma estrutura e não tenham duplicações de classes CSS.

## **🏗️ ESTRUTURA PADRÃO**

### **📄 Estrutura HTML Padrão**
```html
<div class="canonika-view">
  <!-- View Header -->
  <div class="view-header">
    <div class="view-title">
      <i class="fas fa-*"></i>
      <div class="title-content">
        <h1>Título da View</h1>
        <p>Descrição da View</p>
      </div>
    </div>
    <div class="view-status">
      <div class="status-indicator online"></div>
      <span>Status Text</span>
    </div>
    <div class="view-actions">
      <button class="btn btn-primary btn-sm">
        <i class="fas fa-* me-2"></i>
        Ação
      </button>
    </div>
  </div>

  <!-- View Content -->
  <div class="view-content">
    <div class="canonika-section">
      <div class="section-header">
        <h3 class="section-title">
          <i class="fas fa-* text-success me-2"></i>
          Título da Seção
        </h3>
        <p class="section-description">
          Descrição da seção
        </p>
      </div>
      <div class="section-content">
        <div class="service-cards">
          <div class="service-card">
            <!-- Card content -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## **🎨 CLASSES CSS PADRÃO**

### **🏗️ Layout Principal**
- `.canonika-view` - Container principal da view
- `.view-header` - Cabeçalho da view
- `.view-content` - Conteúdo da view
- `.canonika-section` - Seção de conteúdo

### **📋 Componentes do Header**
- `.view-title` - Título da view
- `.title-content` - Conteúdo do título
- `.view-status` - Status da view
- `.status-indicator` - Indicador de status
- `.view-actions` - Ações da view

### **📄 Componentes do Content**
- `.section-header` - Cabeçalho da seção
- `.section-title` - Título da seção
- `.section-description` - Descrição da seção
- `.service-cards` - Grid de cards
- `.service-card` - Card individual

## **🔧 REGRAS DE IMPLEMENTAÇÃO**

### **✅ OBRIGATÓRIO**
1. **Usar APENAS** `.canonika-view` como container principal
2. **NUNCA** criar classes duplicadas
3. **SEMPRE** usar o sistema compartilhado para estilos padrão
4. **SEMPRE** usar especificidade `.canonika-view .componente`

### **❌ PROIBIDO**
1. **NUNCA** usar `.tollgate-view` (deprecated)
2. **NUNCA** definir `.view-header` sem especificidade
3. **NUNCA** duplicar estilos de componentes padrão
4. **NUNCA** criar classes CSS inline

### **🎯 PERMITIDO**
1. **APENAS** estilos específicos do serviço em arquivos `*_specific.scss`
2. **APENAS** customizações únicas que não existem no sistema compartilhado
3. **APENAS** classes utilitárias específicas do serviço

## **📁 ESTRUTURA DE ARQUIVOS**

### **🏗️ Sistema Compartilhado**
```
shared/styles/scss/
├── main.scss (importa tudo)
├── layout/
│   ├── _view-content.scss (estilos .canonika-view)
│   └── _view-header.scss (estilos .view-header)
└── components/
    ├── _buttons.scss
    └── _cards.scss
```

### **🎯 Serviços Específicos**
```
service/web/src/styles/
├── main.scss (importa shared + specific)
└── scss/
    └── _service-specific.scss (apenas customizações únicas)
```

## **🔍 EXEMPLOS DE IMPLEMENTAÇÃO**

### **✅ CORRETO**
```scss
// shared/styles/scss/layout/_view-header.scss
.canonika-view .view-header {
  // Estilos padrão
}

// service/web/src/styles/scss/_service-specific.scss
.service-custom-header {
  // Apenas customizações únicas
}
```

### **❌ INCORRETO**
```scss
// ❌ NUNCA fazer isso
.view-header {
  // Sem especificidade
}

// ❌ NUNCA duplicar
.canonika-view .view-header {
  // Duplicação de estilos
}
```

## **🚀 BENEFÍCIOS**

### **✅ Consistência**
- **Mesma aparência** em todos os serviços
- **Experiência uniforme** para o usuário
- **Manutenção simplificada**

### **✅ Performance**
- **Menos CSS** para carregar
- **Menos duplicações** de código
- **Cache otimizado**

### **✅ Manutenibilidade**
- **Um único local** para mudanças
- **Fácil debugging** de estilos
- **Evolução centralizada**

## **🔧 FERRAMENTAS DE VERIFICAÇÃO**

### **🔍 Verificar Duplicações**
```bash
# Verificar se há tollgate-view
find . -name "*.vue" -exec grep -l "tollgate-view" {} \;

# Verificar se há view-header sem especificidade
find . -name "*.scss" -exec grep -l "^\.view-header" {} \;
```

### **✅ Checklist de Validação**
- [ ] Usa `.canonika-view` como container
- [ ] Não tem classes `.tollgate-view`
- [ ] Não tem duplicações de `.view-header`
- [ ] Não tem duplicações de `.view-content`
- [ ] Estilos específicos apenas em `*_specific.scss`
- [ ] Importa sistema compartilhado corretamente

## **📞 SUPORTE**

Para dúvidas sobre implementação do padrão unificado:
1. Consulte este documento
2. Verifique os exemplos no `template/`
3. Compare com `beacon/` (referência)
4. Use o script `create-service.sh` como base

---

**🎯 LEMBRE-SE: Um padrão, uma definição, uma plataforma unificada!** 