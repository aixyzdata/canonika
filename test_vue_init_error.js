const puppeteer = require('puppeteer');

async function testVueInitError() {
  console.log('🔍 Testando erro específico na inicialização do Vue...');
  
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
    
    // Verificar se há algum erro específico na inicialização do Vue
    const vueInitErrorCheck = await page.evaluate(() => {
      console.log('Verificando erro específico na inicialização do Vue...');
      
      // Verificar se há algum erro específico na inicialização
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
      
      // Verificar se o app foi criado corretamente
      if (window.app) {
        console.log('App Vue encontrado');
        
        // Verificar se o app tem as propriedades básicas do Vue
        if (window.app.$el) {
          console.log('App tem $el');
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
        
        // Verificar se há algum erro específico na inicialização
        if (window.vueInitError) {
          console.log('Erro na inicialização do Vue:', window.vueInitError);
          errors.push({ message: window.vueInitError });
        }
        
        // Verificar se há algum erro específico na criação do app
        if (window.appCreationError) {
          console.log('Erro na criação do app:', window.appCreationError);
          errors.push({ message: window.appCreationError });
        }
        
        // Verificar se há algum erro específico na montagem do app
        if (window.appMountError) {
          console.log('Erro na montagem do app:', window.appMountError);
          errors.push({ message: window.appMountError });
        }
        
        return {
          appExists: true,
          hasEl: !!window.app.$el,
          hasOptions: !!window.app.$options,
          hasRouter: !!window.app.$router,
          errors: errors
        };
      } else {
        console.log('App Vue não encontrado');
        return {
          appExists: false,
          hasEl: false,
          hasOptions: false,
          hasRouter: false,
          errors: errors
        };
      }
    });
    
    console.log('🔍 Verificação de erro na inicialização do Vue:', vueInitErrorCheck);
    
    // Se há erros, tentar recriar o app manualmente
    if (vueInitErrorCheck.appExists && !vueInitErrorCheck.hasOptions) {
      console.log('🔍 Tentando recriar o app manualmente...');
      
      const manualAppCreation = await page.evaluate(() => {
        try {
          // Tentar recriar o app manualmente
          console.log('Tentando recriar o app manualmente...');
          
          // Verificar se o Vue está disponível
          if (typeof window.Vue !== 'undefined') {
            console.log('Vue disponível');
            
            // Tentar criar um app simples
            const testApp = window.Vue.createApp({
              template: '<div>Test App</div>'
            });
            
            console.log('App de teste criado com sucesso');
            
            // Tentar montar o app
            const testMount = testApp.mount('#app');
            
            console.log('App de teste montado com sucesso');
            
            return { success: true, error: null };
          } else {
            console.log('Vue não disponível');
            return { success: false, error: 'Vue não disponível' };
          }
        } catch (error) {
          console.log('Erro ao criar app manualmente:', error.message);
          return { success: false, error: error.message };
        }
      });
      
      console.log('🔍 Criação manual do app:', manualAppCreation);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testVueInitError(); 