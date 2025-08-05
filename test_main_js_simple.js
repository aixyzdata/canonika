const puppeteer = require('puppeteer');

async function testMainJsSimple() {
  console.log('🔍 Testando main.js de forma simples...');
  
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
    const mainJsSimpleCheck = await page.evaluate(() => {
      console.log('Verificando inicialização do main.js...');
      
      // Verificar se o app foi criado
      if (window.app) {
        console.log('App Vue encontrado');
        
        // Verificar se o app tem as propriedades básicas do Vue
        if (window.app.$el) {
          console.log('App tem $el (elemento DOM)');
        } else {
          console.log('App não tem $el');
        }
        
        if (window.app.$options) {
          console.log('App tem $options');
        } else {
          console.log('App não tem $options');
        }
        
        if (window.app.$router) {
          console.log('App tem $router');
        } else {
          console.log('App não tem $router');
        }
        
        return {
          appExists: true,
          hasEl: !!window.app.$el,
          hasOptions: !!window.app.$options,
          hasRouter: !!window.app.$router
        };
      } else {
        console.log('App Vue não encontrado');
        return {
          appExists: false,
          hasEl: false,
          hasOptions: false,
          hasRouter: false
        };
      }
    });
    
    console.log('🔍 Verificação simples do main.js:', mainJsSimpleCheck);
    
    // Se o app não tem $options, há um problema na inicialização do Vue
    if (mainJsSimpleCheck.appExists && !mainJsSimpleCheck.hasOptions) {
      console.log('🔍 Problema na inicialização do Vue detectado...');
      
      const vueInitCheck = await page.evaluate(() => {
        try {
          // Verificar se há algum erro específico na inicialização
          if (window.vueInitError) {
            console.log('Erro na inicialização do Vue:', window.vueInitError);
            return { error: window.vueInitError };
          }
          
          // Verificar se há algum erro específico na criação do app
          if (window.appCreationError) {
            console.log('Erro na criação do app:', window.appCreationError);
            return { error: window.appCreationError };
          }
          
          // Verificar se há algum erro específico na montagem do app
          if (window.appMountError) {
            console.log('Erro na montagem do app:', window.appMountError);
            return { error: window.appMountError };
          }
          
          return { error: 'Erro desconhecido na inicialização do Vue' };
        } catch (error) {
          console.log('Erro ao verificar inicialização:', error.message);
          return { error: error.message };
        }
      });
      
      console.log('🔍 Verificação de erro na inicialização:', vueInitCheck);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testMainJsSimple(); 