const puppeteer = require('puppeteer');

async function testMainJs() {
  console.log('🔍 Testando main.js...');
  
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
    
    console.log('📍 Navegando para Harbor...');
    await page.goto('http://localhost:3701/', { waitUntil: 'networkidle2', timeout: 15000 });
    
    console.log('📍 URL atual:', page.url());
    
    // Aguardar um pouco para carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se há algum erro específico na inicialização
    const mainJsCheck = await page.evaluate(() => {
      if (window.app) {
        console.log('App Vue encontrado');
        
        // Verificar se há algum erro específico
        if (window.mainJsError) {
          console.log('Erro no main.js:', window.mainJsError);
        }
        
        // Verificar se o Vue está disponível
        if (typeof window.Vue !== 'undefined') {
          console.log('Vue disponível globalmente');
        } else {
          console.log('Vue não disponível globalmente');
        }
        
        // Verificar se o Vue Router está disponível
        if (typeof window.VueRouter !== 'undefined') {
          console.log('VueRouter disponível globalmente');
        } else {
          console.log('VueRouter não disponível globalmente');
        }
        
        // Verificar se há algum erro na importação
        if (window.importError) {
          console.log('Erro de importação:', window.importError);
        }
        
        return {
          appExists: true,
          vueAvailable: typeof window.Vue !== 'undefined',
          vueRouterAvailable: typeof window.VueRouter !== 'undefined',
          mainJsError: window.mainJsError || null,
          importError: window.importError || null
        };
      } else {
        console.log('App Vue não encontrado');
        return {
          appExists: false,
          vueAvailable: false,
          vueRouterAvailable: false,
          mainJsError: null,
          importError: null
        };
      }
    });
    
    console.log('🔍 Verificação do main.js:', mainJsCheck);
    
    // Se o Vue Router não está disponível, verificar se há algum erro específico
    if (!mainJsCheck.vueRouterAvailable) {
      console.log('🔍 Verificando se há erro específico na importação do Vue Router...');
      
      const routerImportCheck = await page.evaluate(() => {
        // Verificar se há algum erro específico na importação do Vue Router
        const errors = [];
        
        // Interceptar erros de módulo
        window.addEventListener('error', (event) => {
          if (event.filename && event.filename.includes('index-')) {
            errors.push({
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            });
          }
        });
        
        // Verificar se há algum erro específico
        if (window.vueRouterError) {
          errors.push({ message: window.vueRouterError });
        }
        
        return errors;
      });
      
      console.log('🔍 Erros de importação do Vue Router:', routerImportCheck);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testMainJs(); 