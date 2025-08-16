const puppeteer = require('puppeteer');

async function simpleBootstrapCheck() {
  let browser;
  
  try {
    console.log('🔍 Verificação simples da tabela Bootstrap...');
    
    browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    console.log('📄 Acessando página...');
    await page.goto('http://localhost:3707/sources/sefaz', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Página carregada');
    
    // Verificar se AG-Grid foi removido
    const agGridCount = await page.evaluate(() => {
      return document.querySelectorAll('ag-grid-vue').length;
    });
    
    console.log(`📊 Elementos AG-Grid: ${agGridCount}`);
    
    // Verificar se tabela Bootstrap existe
    const bootstrapTable = await page.evaluate(() => {
      return document.querySelector('.table-responsive') !== null;
    });
    
    console.log(`📊 Tabela Bootstrap: ${bootstrapTable ? '✅ SIM' : '❌ NÃO'}`);
    
    // Verificar se há botão Sincronizar
    const syncButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.btn'));
      return buttons.some(btn => btn.textContent.includes('Sincronizar'));
    });
    
    console.log(`📊 Botão Sincronizar: ${syncButton ? '✅ SIM' : '❌ NÃO'}`);
    
    if (agGridCount === 0 && bootstrapTable && syncButton) {
      console.log('\n🎉 SUCESSO! AG-Grid removido e Bootstrap funcionando!');
    } else {
      console.log('\n❌ PROBLEMA! Verificação falhou.');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

simpleBootstrapCheck(); 