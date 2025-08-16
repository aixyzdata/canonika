#!/usr/bin/env node

/**
 * Guia para Verificação Manual da Classe CSS do AG-Grid
 */

const http = require('http');

async function manualVerificationGuide() {
  console.log('🔍 Guia para Verificação Manual da Classe CSS do AG-Grid');
  console.log('========================================================');
  console.log('');
  
  try {
    // Verificar se o Fisher está rodando
    console.log('🔍 Verificando se o Fisher está rodando...');
    const response = await new Promise((resolve, reject) => {
      http.get('http://localhost:3707', (res) => {
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode });
      }).on('error', reject);
    });
    
    if (!response.ok) {
      throw new Error(`Fisher não está rodando. Status: ${response.status}`);
    }
    console.log('✅ Fisher está rodando');
    
    console.log('\n🎯 INSTRUÇÕES PARA VERIFICAÇÃO MANUAL:');
    console.log('=======================================');
    console.log('');
    console.log('1. 🌐 Abra o navegador e acesse:');
    console.log('   http://localhost:3707/sources/sefaz');
    console.log('');
    console.log('2. 🖱️  Clique na aba "Sincronização CNPJ"');
    console.log('');
    console.log('3. 🔍 Abra o DevTools (F12)');
    console.log('');
    console.log('4. 📋 No console, execute os seguintes comandos:');
    console.log('');
    console.log('   // Verificar elementos ag-grid-vue');
    console.log('   const agGridElements = document.querySelectorAll("ag-grid-vue");');
    console.log('   console.log("Elementos ag-grid-vue encontrados:", agGridElements.length);');
    console.log('');
    console.log('   // Verificar classes de cada elemento');
    console.log('   agGridElements.forEach((el, index) => {');
    console.log('     console.log(`AG-Grid ${index + 1} classes:`, el.className);');
    console.log('     console.log(`  - ag-theme-canonika:`, el.className.includes("ag-theme-canonika"));');
    console.log('     console.log(`  - ag-theme-alpine:`, el.className.includes("ag-theme-alpine"));');
    console.log('   });');
    console.log('');
    console.log('   // Verificar elementos internos');
    console.log('   const rootWrappers = document.querySelectorAll(".ag-root-wrapper");');
    console.log('   rootWrappers.forEach((wrapper, index) => {');
    console.log('     const parentClass = wrapper.parentElement?.className || "sem parent";');
    console.log('     console.log(`Root wrapper ${index + 1} parent classes:`, parentClass);');
    console.log('   });');
    console.log('');
    console.log('5. 🎨 Verificar visualmente:');
    console.log('   - O fundo do AG-Grid deve ser escuro (#1e293b)');
    console.log('   - O header deve ser mais escuro (#0f172a)');
    console.log('   - O texto deve ser claro (#e2e8f0)');
    console.log('');
    console.log('6. ✅ RESULTADO ESPERADO:');
    console.log('   - Classe deve ser: "ag-theme-canonika ag-grid-vue"');
    console.log('   - NÃO deve ter: "ag-theme-alpine"');
    console.log('');
    console.log('7. 📸 Se necessário, tire um screenshot da página');
    console.log('');
    console.log('8. 📝 Reporte o resultado:');
    console.log('   - Quais classes foram encontradas');
    console.log('   - Se o tema visual está correto');
    console.log('   - Se há algum problema');
    console.log('');
    
    console.log('🔧 CORREÇÃO APLICADA:');
    console.log('=====================');
    console.log('✅ CSS importa apenas ag-grid.css (sem Alpine)');
    console.log('✅ Tema Canonika definido independentemente');
    console.log('✅ Classe ag-theme-canonika aplicada no template');
    console.log('✅ Sem métodos de força ou workarounds');
    console.log('');
    console.log('📊 Se a classe ainda for "ag-theme-alpine",');
    console.log('   pode haver outro problema que precisamos investigar.');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('');
    console.log('🔧 SOLUÇÃO:');
    console.log('1. Inicie o servidor Fisher: npm run dev');
    console.log('2. Aguarde o carregamento completo');
    console.log('3. Execute este teste novamente');
  }
}

manualVerificationGuide().catch(console.error); 