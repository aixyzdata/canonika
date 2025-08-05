const puppeteer = require('puppeteer');

async function testBuildError() {
  console.log('🔍 Testando erros no build...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Capturar TODOS os logs do console
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
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar se há algum erro de JavaScript
    const jsErrors = await page.evaluate(() => {
      return window.jsErrors || [];
    });
    
    console.log('🔍 Erros JavaScript:', jsErrors);
    
    // Verificar se o script foi executado
    const scriptExecution = await page.evaluate(() => {
      // Verificar se há algum erro na execução do script
      const errors = [];
      
      // Interceptar erros
      window.addEventListener('error', (event) => {
        errors.push({
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });
      
      // Verificar se o Vue foi inicializado
      if (window.app) {
        console.log('App Vue encontrado');
        
        // Verificar se há algum erro na inicialização
        if (window.app.$router) {
          console.log('Router encontrado');
          return { success: true, errors: errors };
        } else {
          console.log('Router não encontrado');
          
          // Verificar se há algum erro específico
          if (window.initError) {
            console.log('Erro de inicialização:', window.initError);
            errors.push({ message: window.initError });
          }
          
          return { success: false, errors: errors };
        }
      } else {
        console.log('App Vue não encontrado');
        return { success: false, errors: errors };
      }
    });
    
    console.log('🔍 Execução do script:', scriptExecution);
    
    // Se há erros, tentar executar o script manualmente
    if (!scriptExecution.success) {
      console.log('🔍 Tentando executar script manualmente...');
      
      const manualExecution = await page.evaluate(() => {
        try {
          // Tentar executar o script principal
          const mainScript = document.querySelector('script[src*="index-"]');
          if (mainScript) {
            console.log('Executando script manualmente...');
            
            // Tentar recarregar o script
            const newScript = document.createElement('script');
            newScript.src = mainScript.src;
            newScript.type = 'module';
            
            document.head.appendChild(newScript);
            
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({
                  appExists: !!window.app,
                  routerExists: window.app ? !!window.app.$router : false
                });
              }, 2000);
            });
          } else {
            return { appExists: false, routerExists: false };
          }
        } catch (error) {
          console.log('Erro ao executar script manualmente:', error.message);
          return { appExists: false, routerExists: false, error: error.message };
        }
      });
      
      console.log('🔍 Execução manual:', manualExecution);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testBuildError(); 