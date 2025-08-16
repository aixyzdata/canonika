# 🔍 Guia de Verificação Manual - Classe do Tema AG-Grid

## 🎯 **Objetivo**
Verificar se o AG-Grid está usando a classe correta `ag-theme-canonika` em vez de `ag-theme-alpine`.

## 📋 **Passos para Verificação**

### **1. Acesse a Página**
```bash
# Certifique-se que o Fisher está rodando
cd fisher/web
npm run dev

# Acesse no navegador
http://localhost:3707/sources/sefaz
```

### **2. Ative o AG-Grid**
- Clique no botão **"Sincronização CNPJ"**
- Aguarde o AG-Grid ser renderizado

### **3. Abra o DevTools**
- Pressione **F12** ou **Cmd+Option+I** (Mac)
- Vá para a aba **Console**

### **4. Execute os Comandos de Verificação**

#### **Comando 1: Verificar se o elemento ag-grid-vue existe**
```javascript
const agGridVue = document.querySelector('ag-grid-vue');
console.log('Elemento ag-grid-vue:', agGridVue);
```
**Resultado esperado:** Deve retornar o elemento, não `null`

#### **Comando 2: Verificar a classe do elemento ag-grid-vue**
```javascript
const agGridVue = document.querySelector('ag-grid-vue');
console.log('Classe do ag-grid-vue:', agGridVue.className);
```
**Resultado esperado:** Deve retornar `"ag-theme-canonika"` (NÃO `"ag-theme-alpine"`)

#### **Comando 3: Verificar elementos com tema Canonika**
```javascript
const canonikaElements = document.querySelectorAll('.ag-theme-canonika');
console.log('Elementos com ag-theme-canonika:', canonikaElements.length);
```
**Resultado esperado:** Deve retornar `> 0`

#### **Comando 4: Verificar elementos com tema Alpine**
```javascript
const alpineElements = document.querySelectorAll('.ag-theme-alpine');
console.log('Elementos com ag-theme-alpine:', alpineElements.length);
```
**Resultado esperado:** Deve retornar `0`

#### **Comando 5: Verificar cores aplicadas**
```javascript
const agGrid = document.querySelector('.ag-theme-canonika');
if (agGrid) {
  const styles = getComputedStyle(agGrid);
  console.log('Cor de fundo:', styles.backgroundColor);
  console.log('Cor do texto:', styles.color);
}
```
**Resultado esperado:** 
- Fundo: `rgb(30, 41, 59)` (equivalente a `#1e293b`)
- Texto: `rgb(226, 232, 240)` (equivalente a `#e2e8f0`)

### **5. Verificação Visual**
- **✅ CORRETO:** AG-Grid com fundo escuro e texto claro
- **❌ INCORRETO:** AG-Grid com fundo claro e texto escuro

## 📊 **Interpretação dos Resultados**

### **✅ SUCESSO - Tema Canonika Aplicado**
```
Elemento ag-grid-vue: <ag-grid-vue class="ag-theme-canonika">
Classe do ag-grid-vue: ag-theme-canonika
Elementos com ag-theme-canonika: 2
Elementos com ag-theme-alpine: 0
Cor de fundo: rgb(30, 41, 59)
Cor do texto: rgb(226, 232, 240)
```

### **❌ PROBLEMA - Tema Alpine Ainda Presente**
```
Elemento ag-grid-vue: <ag-grid-vue class="ag-theme-alpine">
Classe do ag-grid-vue: ag-theme-alpine
Elementos com ag-theme-canonika: 0
Elementos com ag-theme-alpine: 2
Cor de fundo: rgb(255, 255, 255)
Cor do texto: rgb(0, 0, 0)
```

## 🔧 **Se o Problema Persistir**

### **1. Verificar gridOptions**
```javascript
// No console do navegador
const agGridVue = document.querySelector('ag-grid-vue');
const vueInstance = agGridVue.__vueParentComponent;
console.log('GridOptions:', vueInstance.props.gridOptions);
console.log('Tema no gridOptions:', vueInstance.props.gridOptions.theme);
```

### **2. Verificar se o CSS está carregado**
```javascript
// Verificar se o CSS do tema Canonika está carregado
const styleSheets = Array.from(document.styleSheets);
const canonikaStyles = styleSheets.filter(sheet => 
  sheet.href && sheet.href.includes('ag-grid-canonika')
);
console.log('CSS Canonika carregado:', canonikaStyles.length > 0);
```

### **3. Forçar aplicação do tema (temporário)**
```javascript
// Aplicar tema Canonika forçadamente
const agGridVue = document.querySelector('ag-grid-vue');
agGridVue.className = 'ag-theme-canonika';

// Aplicar estilos forçados
const style = document.createElement('style');
style.textContent = `
  .ag-theme-canonika {
    --ag-background-color: #1e293b !important;
    --ag-foreground-color: #e2e8f0 !important;
    background-color: #1e293b !important;
    color: #e2e8f0 !important;
  }
`;
document.head.appendChild(style);
```

## 📝 **Relatório de Verificação**

Após executar os comandos, preencha:

- [ ] Elemento `ag-grid-vue` encontrado
- [ ] Classe aplicada: `ag-theme-canonika` (não `ag-theme-alpine`)
- [ ] Elementos com tema Canonika: `> 0`
- [ ] Elementos com tema Alpine: `0`
- [ ] Cores corretas aplicadas (fundo escuro, texto claro)
- [ ] Visual correto (tema escuro)

**Status Final:** ✅ SUCESSO / ❌ PROBLEMA 