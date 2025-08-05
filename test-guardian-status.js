const puppeteer = require('puppeteer');

async function testGuardianStatus() {
  console.log('🛡️ Testando status do Guardian...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // Acessar o Guardian
    console.log('📍 Acessando Guardian em http://localhost:3705');
    await page.goto('http://localhost:3705', { waitUntil: 'networkidle0' });
    
    // Aguardar um pouco para carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar a URL atual
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);
    
    // Verificar se a página carregou
    const pageTitle = await page.title();
    console.log('📄 Título da página:', pageTitle);
    
    // Verificar se há elementos específicos do Guardian
    const guardianElements = await page.evaluate(() => {
      return {
        hasBody: !!document.body,
        hasHeader: !!document.querySelector('header'),
        hasMain: !!document.querySelector('main'),
        hasAnyContent: document.body ? document.body.innerHTML.length > 0 : false
      };
    });
    
    console.log('🔍 Elementos do Guardian encontrados:', guardianElements);
    
    // Aguardar um pouco para visualizar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testGuardianStatus().catch(console.error); 