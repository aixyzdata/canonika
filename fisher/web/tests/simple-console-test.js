// Teste Simples para Console do Navegador
// Copie e cole este código no console do navegador

console.log('🔍 Verificando Classes do AG-Grid...');

// Verificar elementos ag-grid-vue
const agGridElements = document.querySelectorAll('ag-grid-vue');
console.log('Elementos ag-grid-vue encontrados:', agGridElements.length);

// Verificar classes de cada elemento
agGridElements.forEach((el, index) => {
  console.log(`AG-Grid ${index + 1} classes:`, el.className);
  console.log(`  - ag-theme-canonika:`, el.className.includes('ag-theme-canonika'));
  console.log(`  - ag-theme-alpine:`, el.className.includes('ag-theme-alpine'));
});

// Verificar elementos internos
const rootWrappers = document.querySelectorAll('.ag-root-wrapper');
console.log('Elementos .ag-root-wrapper encontrados:', rootWrappers.length);

rootWrappers.forEach((wrapper, index) => {
  const parentClass = wrapper.parentElement?.className || 'sem parent';
  console.log(`Root wrapper ${index + 1} parent classes:`, parentClass);
});

// Análise final
console.log('\n📊 ANÁLISE FINAL:');
if (agGridElements.length === 0) {
  console.log('⚠️  AG-Grid não encontrado');
} else {
  const hasCanonika = Array.from(agGridElements).some(el => el.className.includes('ag-theme-canonika'));
  const hasAlpine = Array.from(agGridElements).some(el => el.className.includes('ag-theme-alpine'));
  
  if (hasCanonika && !hasAlpine) {
    console.log('✅ SUCESSO! Tema Canonika aplicado corretamente!');
  } else if (hasAlpine) {
    console.log('❌ PROBLEMA! Classe ag-theme-alpine ainda está sendo aplicada!');
  } else {
    console.log('⚠️  ATENÇÃO! Nenhuma classe de tema encontrada');
  }
} 