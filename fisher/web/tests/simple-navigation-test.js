#!/usr/bin/env node

/**
 * Teste Simples de Navegação - Verificar Classe CSS do AG-Grid
 */

const puppeteer = require('puppeteer');

async function simpleNavigationTest() {
  console.log('🔍 Teste Simples de Navegação - Verificar Classe CSS do AG-Grid');
  console.log('==============================================================');
  console.log('');
  
  let browser;
  
  try {
    // Verificar se o Fisher está rodando
    console.log('🔍 Verificando se o Fisher está rodando...');
    const http = require('http');
    const response = await new Promise((resolve, reject) => {
      http.get('http://localhost:3707', (res) => {
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode });
      }).on('error', reject);
    });
    
    if (!response.ok) {
      throw new Error(`Fisher não está rodando. Status: ${response.status}`);
    }
    console.log('✅ Fisher está rodando');
    
    // Iniciar navegador com configurações mais simples
    console.log('🌐 Iniciando navegador...');
    browser = await puppeteer.launch({ 
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    const page = await browser.newPage();
    
    // Configurar timeout maior
    page.setDefaultTimeout(30000);
    
    // Acessar página Sefaz
    console.log('📄 Acessando página Sefaz...');
    await page.goto('http://localhost:3707/sources/sefaz', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('✅ Página Sefaz carregada');
    
    // Aguardar um pouco para a aplicação carregar
    console.log('⏳ Aguardando carregamento da aplicação...');
    await page.waitForTimeout(3000);
    
    // Verificar se há abas
    console.log('🔍 Verificando abas disponíveis...');
    const tabTexts = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('.tab-button'));
      return tabs.map(tab => tab.textContent.trim());
    });
    
    console.log(`  - Abas encontradas: ${tabTexts.join(', ')}`);
    
    // Procurar pela aba "Sincronização CNPJ"
    const syncTabIndex = tabTexts.findIndex(text => text.includes('Sincronização CNPJ'));
    
    if (syncTabIndex === -1) {
      console.log('❌ Aba "Sincronização CNPJ" não encontrada');
      console.log('  - Abas disponíveis:', tabTexts);
      return;
    }
    
    // Clicar na aba "Sincronização CNPJ"
    console.log('🖱️  Clicando na aba "Sincronização CNPJ"...');
    const tabButtons = await page.$$('.tab-button');
    await tabButtons[syncTabIndex].click();
    
    // Aguardar carregamento da aba
    console.log('⏳ Aguardando carregamento da aba...');
    await page.waitForTimeout(2000);
    
    // Verificar se o AG-Grid está presente
    console.log('🔍 Verificando presença do AG-Grid...');
    const agGridElements = await page.$$('ag-grid-vue');
    console.log(`  - Elementos ag-grid-vue encontrados: ${agGridElements.length}`);
    
    if (agGridElements.length === 0) {
      console.log('⚠️  AG-Grid não encontrado. Verificando se há botões para renderizar...');
      
      // Listar todos os botões
      const buttons = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.map(btn => btn.textContent.trim());
      });
      
      console.log('  - Botões disponíveis:', buttons);
      
      // Tentar clicar em botões que possam renderizar dados
      const syncButtons = buttons.filter(text => 
        text.includes('Sincronizar') || 
        text.includes('Atualizar') || 
        text.includes('Carregar') ||
        text.includes('Iniciar')
      );
      
      if (syncButtons.length > 0) {
        console.log(`🖱️  Clicando em botão: "${syncButtons[0]}"`);
        await page.click(`text=${syncButtons[0]}`);
        await page.waitForTimeout(3000);
        
        // Verificar novamente
        const agGridElementsAfter = await page.$$('ag-grid-vue');
        console.log(`  - Elementos ag-grid-vue após clique: ${agGridElementsAfter.length}`);
      }
    }
    
    // Verificar classes aplicadas
    console.log('🔍 Verificando classes aplicadas...');
    
    const agGridVueElements = await page.$$('ag-grid-vue');
    for (let i = 0; i < agGridVueElements.length; i++) {
      const className = await agGridVueElements[i].evaluate(el => el.className);
      console.log(`  - AG-Grid ${i + 1} classes: "${className}"`);
      
      const hasCanonika = className.includes('ag-theme-canonika');
      const hasAlpine = className.includes('ag-theme-alpine');
      
      console.log(`    - ag-theme-canonika: ${hasCanonika ? '✅ SIM' : '❌ NÃO'}`);
      console.log(`    - ag-theme-alpine: ${hasAlpine ? '❌ SIM (PROBLEMA)' : '✅ NÃO'}`);
    }
    
    // Verificar elementos internos do AG-Grid
    console.log('🔍 Verificando elementos internos do AG-Grid...');
    const rootWrappers = await page.$$('.ag-root-wrapper');
    console.log(`  - Elementos .ag-root-wrapper encontrados: ${rootWrappers.length}`);
    
    for (let i = 0; i < rootWrappers.length; i++) {
      const parentClass = await rootWrappers[i].evaluate(el => el.parentElement?.className || 'sem parent');
      console.log(`  - Root wrapper ${i + 1} parent classes: "${parentClass}"`);
      
      const hasCanonika = parentClass.includes('ag-theme-canonika');
      const hasAlpine = parentClass.includes('ag-theme-alpine');
      
      console.log(`    - ag-theme-canonika: ${hasCanonika ? '✅ SIM' : '❌ NÃO'}`);
      console.log(`    - ag-theme-alpine: ${hasAlpine ? '❌ SIM (PROBLEMA)' : '✅ NÃO'}`);
    }
    
    // Análise final
    console.log('\n📊 ANÁLISE FINAL:');
    
    const finalAgGridElements = await page.$$('ag-grid-vue');
    if (finalAgGridElements.length === 0) {
      console.log('⚠️  AG-Grid não foi renderizado');
      console.log('  - Pode ser necessário clicar em um botão específico');
      console.log('  - Ou o AG-Grid só é renderizado com dados');
    } else {
      const allHaveCanonika = await Promise.all(
        finalAgGridElements.map(el => el.evaluate(el => el.className.includes('ag-theme-canonika')))
      );
      const allHaveAlpine = await Promise.all(
        finalAgGridElements.map(el => el.evaluate(el => el.className.includes('ag-theme-alpine')))
      );
      
      if (allHaveCanonika.every(Boolean) && !allHaveAlpine.some(Boolean)) {
        console.log('✅ SUCESSO! Todos os AG-Grids têm tema Canonika aplicado!');
      } else if (allHaveAlpine.some(Boolean)) {
        console.log('❌ PROBLEMA! Alguns AG-Grids ainda têm tema Alpine!');
      } else {
        console.log('⚠️  ATENÇÃO! Nem todos os AG-Grids têm tema Canonika aplicado');
      }
    }
    
    // Salvar screenshot para inspeção
    await page.screenshot({ path: './ag-grid-navigation-test.png', fullPage: true });
    console.log('\n💾 Screenshot salvo em: ./ag-grid-navigation-test.png');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

simpleNavigationTest().catch(console.error); 