const puppeteer = require('puppeteer');

async function testDebugScript() {
  console.log('🔍 Testando debug do script...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Capturar logs do console
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    
    page.on('pageerror', error => {
      console.log('Page Error:', error.message);
    });
    
    // Interceptar requisições para ver se há erros 404
    page.on('response', response => {
      if (response.status() === 404) {
        console.log('❌ 404 Error:', response.url());
      }
    });
    
    console.log('📍 Navegando para Harbor...');
    await page.goto('http://localhost:3701/', { waitUntil: 'networkidle2', timeout: 15000 });
    
    console.log('📍 URL atual:', page.url());
    
    // Aguardar um pouco para carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se o script foi carregado
    const scriptLoaded = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      console.log('Scripts encontrados:', scripts.length);
      
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        console.log(`Script ${i}:`, {
          src: script.src,
          type: script.type,
          text: script.textContent.substring(0, 100) + '...'
        });
      }
      
      return scripts.length;
    });
    
    console.log('🔍 Scripts carregados:', scriptLoaded);
    
    // Verificar se há erros de JavaScript
    const jsErrors = await page.evaluate(() => {
      return window.jsErrors || [];
    });
    
    console.log('🔍 Erros JavaScript:', jsErrors);
    
    // Tentar executar o script manualmente
    const scriptExecution = await page.evaluate(() => {
      try {
        // Verificar se o script principal foi carregado
        const mainScript = document.querySelector('script[src*="index-"]');
        if (mainScript) {
          console.log('Script principal encontrado:', mainScript.src);
          
          // Verificar se o script foi executado
          if (window.app) {
            console.log('App Vue encontrado:', window.app);
            return true;
          } else {
            console.log('App Vue não encontrado');
            return false;
          }
        } else {
          console.log('Script principal não encontrado');
          return false;
        }
      } catch (error) {
        console.log('Erro ao verificar script:', error.message);
        return false;
      }
    });
    
    console.log('🔍 Script executado:', scriptExecution);
    
    // Verificar se há algum erro de rede
    const networkErrors = await page.evaluate(() => {
      return window.networkErrors || [];
    });
    
    console.log('🔍 Erros de rede:', networkErrors);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testDebugScript(); 