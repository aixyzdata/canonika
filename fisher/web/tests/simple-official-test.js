#!/usr/bin/env node

/**
 * Teste Simples - Abordagem Oficial AG-Grid
 * Verifica se estamos seguindo a documentação oficial sem usar Puppeteer
 */

const http = require('http');

async function testOfficialApproach() {
  console.log('🎯 Teste Simples - Abordagem Oficial AG-Grid');
  console.log('============================================');
  console.log('Documentação: https://www.ag-grid.com/javascript-data-grid/themes/#built-in-themes');
  console.log('');
  
  try {
    // Verificar se o Fisher está rodando
    console.log('🔍 Verificando se o Fisher está rodando...');
    const response = await fetch('http://localhost:3707');
    if (!response.ok) {
      throw new Error(`Fisher não está rodando. Status: ${response.status}`);
    }
    console.log('✅ Fisher está rodando');
    
    // Verificar se o arquivo de configuração está correto
    console.log('📄 Verificando configuração do tema...');
    
    // Verificar se o arquivo ag-grid-theme.js existe e tem o import correto
    const fs = require('fs');
    const path = require('path');
    
    const themeConfigPath = path.join(__dirname, '../src/config/ag-grid-theme.js');
    
    if (!fs.existsSync(themeConfigPath)) {
      console.log('❌ Arquivo ag-grid-theme.js não encontrado');
      return;
    }
    
    const themeConfigContent = fs.readFileSync(themeConfigPath, 'utf8');
    
    // Verificar se tem o import correto
    const hasImport = themeConfigContent.includes('import { themeAlpine }');
    const hasThemeCanonika = themeConfigContent.includes('export const themeCanonika');
    const hasObjectTheme = themeConfigContent.includes('theme: themeCanonika');
    
    console.log('📊 Análise da configuração:');
    console.log(`  - Import themeAlpine: ${hasImport ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`  - Export themeCanonika: ${hasThemeCanonika ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`  - Tema como objeto: ${hasObjectTheme ? '✅ SIM' : '❌ NÃO'}`);
    
    // Verificar se o SefazView.vue está usando a configuração correta
    const sefazViewPath = path.join(__dirname, '../src/views/sources/SefazView.vue');
    
    if (!fs.existsSync(sefazViewPath)) {
      console.log('❌ Arquivo SefazView.vue não encontrado');
      return;
    }
    
    const sefazViewContent = fs.readFileSync(sefazViewPath, 'utf8');
    
    // Verificar se está importando gridOptionsDefaults
    const hasImportDefaults = sefazViewContent.includes('import { gridOptionsDefaults }');
    const hasSpreadDefaults = sefazViewContent.includes('...gridOptionsDefaults');
    
    console.log('📊 Análise do SefazView.vue:');
    console.log(`  - Import gridOptionsDefaults: ${hasImportDefaults ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`  - Spread gridOptionsDefaults: ${hasSpreadDefaults ? '✅ SIM' : '❌ NÃO'}`);
    
    // Verificar se não tem mais o método forceCanonikaTheme
    const hasForceMethod = sefazViewContent.includes('forceCanonikaTheme');
    
    console.log('📊 Limpeza do código:');
    console.log(`  - Método forceCanonikaTheme removido: ${!hasForceMethod ? '✅ SIM' : '❌ NÃO'}`);
    
    // Análise final
    console.log('\n📊 ANÁLISE FINAL:');
    
    if (hasImport && hasThemeCanonika && hasObjectTheme && hasImportDefaults && hasSpreadDefaults && !hasForceMethod) {
      console.log('✅ SUCESSO! Abordagem oficial implementada corretamente!');
      console.log('  - Tema definido via objeto (conforme documentação)');
      console.log('  - Import correto do themeAlpine');
      console.log('  - Configuração aplicada no SefazView');
      console.log('  - Código limpo sem métodos desnecessários');
    } else {
      console.log('❌ PROBLEMA! Abordagem oficial não implementada completamente');
      
      if (!hasImport) console.log('  - Falta import do themeAlpine');
      if (!hasThemeCanonika) console.log('  - Falta export do themeCanonika');
      if (!hasObjectTheme) console.log('  - Falta tema como objeto');
      if (!hasImportDefaults) console.log('  - Falta import do gridOptionsDefaults');
      if (!hasSpreadDefaults) console.log('  - Falta spread do gridOptionsDefaults');
      if (hasForceMethod) console.log('  - Método forceCanonikaTheme ainda presente');
    }
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. Reinicie o servidor Fisher: npm run dev');
    console.log('2. Acesse: http://localhost:3707/sources/sefaz');
    console.log('3. Clique em "Sincronização CNPJ"');
    console.log('4. Verifique se o AG-Grid tem fundo escuro');
    console.log('5. Abra DevTools e verifique se não há erros no console');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Função fetch para Node.js
async function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          text: () => Promise.resolve(data)
        });
      });
    }).on('error', reject);
  });
}

testOfficialApproach().catch(console.error); 