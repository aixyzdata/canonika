const puppeteer = require('puppeteer');

async function debugPageLoad() {
  let browser;
  
  try {
    console.log('🔍 Debugando carregamento da página...');
    
    browser = await puppeteer.launch({ 
      headless: false, 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Capturar erros do console
    page.on('console', msg => {
      console.log('📱 Console:', msg.text());
    });
    
    page.on('pageerror', error => {
      console.log('❌ Erro da página:', error.message);
    });
    
    console.log('📄 Acessando página...');
    await page.goto('http://localhost:3707/sources/sefaz', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Página carregada');
    
    // Aguardar um pouco para o JavaScript carregar
    await page.waitForTimeout(5000);
    
    // Verificar se o app Vue foi montado
    const appMounted = await page.evaluate(() => {
      return document.querySelector('#app').children.length > 0;
    });
    
    console.log(`📊 App Vue montado: ${appMounted ? '✅ SIM' : '❌ NÃO'}`);
    
    if (appMounted) {
      // Verificar elementos específicos
      const elements = await page.evaluate(() => {
        return {
          app: document.querySelector('#app')?.innerHTML?.substring(0, 200) || 'vazio',
          hasTable: document.querySelector('.table-responsive') !== null,
          hasButtons: document.querySelectorAll('.btn').length,
          hasTabs: document.querySelectorAll('.nav-tabs').length
        };
      });
      
      console.log('📊 Elementos encontrados:');
      console.log(`  - App HTML: ${elements.app}...`);
      console.log(`  - Tabela: ${elements.hasTable ? '✅ SIM' : '❌ NÃO'}`);
      console.log(`  - Botões: ${elements.hasButtons}`);
      console.log(`  - Abas: ${elements.hasTabs}`);
    }
    
    // Aguardar para visualizar
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugPageLoad(); 