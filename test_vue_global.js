const puppeteer = require('puppeteer');

async function testVueGlobal() {
  console.log('🔍 Testando se o Vue está sendo exposto globalmente...');
  
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
    
    // Verificar se o Vue está sendo exposto globalmente
    const vueGlobalCheck = await page.evaluate(() => {
      console.log('Verificando se o Vue está sendo exposto globalmente...');
      
      // Verificar se o Vue está disponível
      if (typeof window.Vue !== 'undefined') {
        console.log('Vue disponível globalmente');
        return { vueAvailable: true, error: null };
      } else {
        console.log('Vue não disponível globalmente');
        
        // Verificar se há algum erro específico
        if (window.vueGlobalError) {
          console.log('Erro na exposição global do Vue:', window.vueGlobalError);
          return { vueAvailable: false, error: window.vueGlobalError };
        } else {
          return { vueAvailable: false, error: 'Vue não está sendo exposto globalmente' };
        }
      }
    });
    
    console.log('🔍 Verificação global do Vue:', vueGlobalCheck);
    
    // Se o Vue não está disponível globalmente, tentar expô-lo manualmente
    if (!vueGlobalCheck.vueAvailable) {
      console.log('🔍 Tentando expor o Vue globalmente...');
      
      const manualVueExposure = await page.evaluate(() => {
        try {
          // Tentar expor o Vue globalmente
          if (window.app) {
            console.log('App encontrado, tentando expor Vue...');
            
            // Verificar se o Vue está disponível no app
            if (window.app.$options && window.app.$options.components) {
              console.log('Vue disponível no app');
              
              // Tentar expor o Vue globalmente
              window.Vue = window.app.constructor;
              
              console.log('Vue exposto globalmente');
              
              return { success: true, error: null };
            } else {
              console.log('Vue não disponível no app');
              return { success: false, error: 'Vue não disponível no app' };
            }
          } else {
            console.log('App não encontrado');
            return { success: false, error: 'App não encontrado' };
          }
        } catch (error) {
          console.log('Erro ao expor Vue globalmente:', error.message);
          return { success: false, error: error.message };
        }
      });
      
      console.log('🔍 Exposição manual do Vue:', manualVueExposure);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testVueGlobal(); 