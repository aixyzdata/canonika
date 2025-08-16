const puppeteer = require('puppeteer');

async function verifyBootstrapTable() {
  let browser;
  
  try {
    console.log('🔍 Verificando se a tabela Bootstrap está funcionando...');
    
    browser = await puppeteer.launch({ 
      headless: false, 
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Acessar a página Sefaz
    console.log('📄 Acessando página Sefaz...');
    const response = await page.goto('http://localhost:3707/sources/sefaz');
    
    if (!response.ok()) {
      console.log('❌ Fisher não está rodando. Status:', response.status());
      return;
    }
    
    await page.waitForSelector('#app', { timeout: 10000 });
    console.log('✅ Página carregada');
    
    // Verificar se há elementos AG-Grid (não deve haver)
    console.log('🔍 Verificando se AG-Grid foi removido...');
    const agGridElements = await page.evaluate(() => {
      return document.querySelectorAll('ag-grid-vue').length;
    });
    
    if (agGridElements > 0) {
      console.log('❌ PROBLEMA! Ainda há elementos AG-Grid:', agGridElements);
    } else {
      console.log('✅ SUCESSO! AG-Grid foi completamente removido');
    }
    
    // Verificar se há tabela Bootstrap
    console.log('🔍 Verificando tabela Bootstrap...');
    const bootstrapTable = await page.evaluate(() => {
      return document.querySelector('.table-responsive') !== null;
    });
    
    if (bootstrapTable) {
      console.log('✅ SUCESSO! Tabela Bootstrap encontrada');
    } else {
      console.log('❌ PROBLEMA! Tabela Bootstrap não encontrada');
    }
    
    // Verificar se há botão Sincronizar SEFAZ
    console.log('🔍 Verificando botão Sincronizar SEFAZ...');
    const syncButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.btn'));
      return buttons.some(btn => btn.textContent.includes('Sincronizar SEFAZ'));
    });
    
    if (syncButton) {
      console.log('✅ SUCESSO! Botão Sincronizar SEFAZ encontrado');
    } else {
      console.log('❌ PROBLEMA! Botão Sincronizar SEFAZ não encontrado');
    }
    
    // Clicar no botão para testar funcionalidade
    console.log('🔄 Testando funcionalidade...');
    await page.click('text=Sincronizar SEFAZ');
    await page.waitForTimeout(2000);
    
    // Verificar se a tabela tem dados
    console.log('🔍 Verificando dados na tabela...');
    const tableData = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });
    
    if (tableData > 0) {
      console.log('✅ SUCESSO! Tabela tem dados:', tableData, 'linhas');
    } else {
      console.log('❌ PROBLEMA! Tabela não tem dados');
    }
    
    // Verificar se há paginação
    console.log('🔍 Verificando paginação...');
    const pagination = await page.evaluate(() => {
      return document.querySelector('.pagination') !== null;
    });
    
    if (pagination) {
      console.log('✅ SUCESSO! Paginação Bootstrap encontrada');
    } else {
      console.log('❌ PROBLEMA! Paginação não encontrada');
    }
    
    // Verificar se há abas
    console.log('🔍 Verificando abas...');
    const tabs = await page.evaluate(() => {
      return document.querySelectorAll('.nav-tabs .nav-link').length;
    });
    
    if (tabs > 0) {
      console.log('✅ SUCESSO! Abas encontradas:', tabs);
    } else {
      console.log('❌ PROBLEMA! Abas não encontradas');
    }
    
    // Aguardar um pouco para visualizar
    await page.waitForTimeout(3000);
    
    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA!');
    console.log('📊 A tabela Bootstrap deve estar funcionando corretamente.');
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

verifyBootstrapTable(); 