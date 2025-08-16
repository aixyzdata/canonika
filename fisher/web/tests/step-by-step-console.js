// COMANDOS PASSO A PASSO PARA CONSOLE
// Execute cada linha separadamente no console do navegador

// 1. Verificar elementos ag-grid-vue
document.querySelectorAll('ag-grid-vue').length

// 2. Verificar classes do primeiro AG-Grid
document.querySelectorAll('ag-grid-vue')[0]?.className

// 3. Verificar se tem ag-theme-canonika
document.querySelectorAll('ag-grid-vue')[0]?.className.includes('ag-theme-canonika')

// 4. Verificar se tem ag-theme-alpine
document.querySelectorAll('ag-grid-vue')[0]?.className.includes('ag-theme-alpine')

// 5. Verificar elementos .ag-root-wrapper
document.querySelectorAll('.ag-root-wrapper').length

// 6. Verificar classes do primeiro root-wrapper
document.querySelectorAll('.ag-root-wrapper')[0]?.parentElement?.className

// 7. Comando único para verificar tudo
(() => {
  const agGridElements = document.querySelectorAll('ag-grid-vue');
  console.log('AG-Grids encontrados:', agGridElements.length);
  
  agGridElements.forEach((el, i) => {
    console.log(`AG-Grid ${i+1}:`, el.className);
    console.log(`  Canonika:`, el.className.includes('ag-theme-canonika'));
    console.log(`  Alpine:`, el.className.includes('ag-theme-alpine'));
  });
  
  const rootWrappers = document.querySelectorAll('.ag-root-wrapper');
  console.log('Root wrappers encontrados:', rootWrappers.length);
  
  rootWrappers.forEach((wrapper, i) => {
    console.log(`Root wrapper ${i+1} parent:`, wrapper.parentElement?.className);
  });
})() 