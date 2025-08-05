const puppeteer = require('puppeteer');

async function testVueImportError() {
  console.log('🔍 Testando erro específico na importação do Vue...');
  
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
    
    console.log('📍 Navegando para Harbor...');
    await page.goto('http://localhost:3701/', { waitUntil: 'networkidle2', timeout: 15000 });
    
    console.log('📍 URL atual:', page.url());
    
    // Aguardar um pouco para carregar
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar se há algum erro específico na importação do Vue
    const vueImportErrorCheck = await page.evaluate(() => {
      console.log('Verificando erro específico na importação do Vue...');
      
      // Verificar se há algum erro específico na importação
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
      
      // Verificar se o Vue está disponível
      if (typeof window.Vue !== 'undefined') {
        console.log('Vue disponível globalmente');
        return {
          vueAvailable: true,
          errors: errors
        };
      } else {
        console.log('Vue não disponível globalmente');
        
        // Verificar se há algum erro específico na importação
        if (window.vueImportError) {
          console.log('Erro na importação do Vue:', window.vueImportError);
          errors.push({ message: window.vueImportError });
        }
        
        // Verificar se há algum erro específico na importação do Vue Router
        if (window.vueRouterImportError) {
          console.log('Erro na importação do Vue Router:', window.vueRouterImportError);
          errors.push({ message: window.vueRouterImportError });
        }
        
        // Verificar se há algum erro específico na importação do routes
        if (window.routesImportError) {
          console.log('Erro na importação do routes:', window.routesImportError);
          errors.push({ message: window.routesImportError });
        }
        
        return {
          vueAvailable: false,
          errors: errors
        };
      }
    });
    
    console.log('🔍 Verificação de erro na importação do Vue:', vueImportErrorCheck);
    
    // Se o Vue não está disponível, tentar importá-lo manualmente
    if (!vueImportErrorCheck.vueAvailable) {
      console.log('🔍 Tentando importar o Vue manualmente...');
      
      const manualVueImport = await page.evaluate(() => {
        try {
          // Tentar importar o Vue manualmente
          console.log('Tentando importar o Vue manualmente...');
          
          // Verificar se há algum script do Vue carregado
          const vueScripts = document.querySelectorAll('script[src*="vue"]');
          console.log('Scripts do Vue encontrados:', vueScripts.length);
          
          // Verificar se há algum script do Vue Router carregado
          const vueRouterScripts = document.querySelectorAll('script[src*="vue-router"]');
          console.log('Scripts do Vue Router encontrados:', vueRouterScripts.length);
          
          // Verificar se há algum script principal carregado
          const mainScripts = document.querySelectorAll('script[src*="index-"]');
          console.log('Scripts principais encontrados:', mainScripts.length);
          
          return {
            vueScripts: vueScripts.length,
            vueRouterScripts: vueRouterScripts.length,
            mainScripts: mainScripts.length
          };
        } catch (error) {
          console.log('Erro ao verificar scripts:', error.message);
          return { error: error.message };
        }
      });
      
      console.log('🔍 Verificação de scripts:', manualVueImport);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testVueImportError(); 