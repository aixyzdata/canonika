const puppeteer = require('puppeteer');

async function testRoutesError() {
  console.log('🔍 Testando erro específico na importação do routes.js...');
  
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se há algum erro específico na importação do routes.js
    const routesErrorCheck = await page.evaluate(() => {
      if (window.app) {
        console.log('App Vue encontrado');
        
        // Verificar se há algum erro específico na importação do routes.js
        if (window.routesImportError) {
          console.log('Erro na importação do routes.js:', window.routesImportError);
        }
        
        // Verificar se há algum erro específico na criação do router
        if (window.routerCreationError) {
          console.log('Erro na criação do router:', window.routerCreationError);
        }
        
        // Verificar se há algum erro específico na aplicação do router
        if (window.routerApplicationError) {
          console.log('Erro na aplicação do router:', window.routerApplicationError);
        }
        
        // Verificar se há algum erro específico na importação do Vue Router
        if (window.vueRouterImportError) {
          console.log('Erro na importação do Vue Router:', window.vueRouterImportError);
        }
        
        // Verificar se há algum erro específico na importação do Vue
        if (window.vueImportError) {
          console.log('Erro na importação do Vue:', window.vueImportError);
        }
        
        return {
          appExists: true,
          routesImportError: window.routesImportError || null,
          routerCreationError: window.routerCreationError || null,
          routerApplicationError: window.routerApplicationError || null,
          vueRouterImportError: window.vueRouterImportError || null,
          vueImportError: window.vueImportError || null
        };
      } else {
        console.log('App Vue não encontrado');
        return {
          appExists: false,
          routesImportError: null,
          routerCreationError: null,
          routerApplicationError: null,
          vueRouterImportError: null,
          vueImportError: null
        };
      }
    });
    
    console.log('🔍 Verificação de erro no routes.js:', routesErrorCheck);
    
    // Se não há erros específicos, tentar recriar o router manualmente
    if (routesErrorCheck.appExists && !routesErrorCheck.routesImportError && !routesErrorCheck.routerCreationError) {
      console.log('🔍 Tentando recriar o router manualmente...');
      
      const manualRouterCreation = await page.evaluate(() => {
        try {
          // Tentar criar um router manualmente
          if (window.app) {
            console.log('Tentando criar router manualmente...');
            
            // Verificar se o Vue está disponível
            if (typeof window.Vue !== 'undefined') {
              console.log('Vue disponível');
              
              // Verificar se o Vue Router está disponível
              if (typeof window.VueRouter !== 'undefined') {
                console.log('VueRouter disponível');
                
                // Tentar criar um router simples
                const testRouter = window.VueRouter.createRouter({
                  history: window.VueRouter.createWebHistory(),
                  routes: []
                });
                
                console.log('Router de teste criado com sucesso');
                
                // Tentar aplicar o router ao app
                window.app.use(testRouter);
                
                console.log('Router aplicado com sucesso');
                
                return { success: true, error: null };
              } else {
                console.log('VueRouter não disponível');
                return { success: false, error: 'VueRouter não disponível' };
              }
            } else {
              console.log('Vue não disponível');
              return { success: false, error: 'Vue não disponível' };
            }
          } else {
            console.log('App não encontrado');
            return { success: false, error: 'App não encontrado' };
          }
        } catch (error) {
          console.log('Erro ao criar router manualmente:', error.message);
          return { success: false, error: error.message };
        }
      });
      
      console.log('🔍 Criação manual do router:', manualRouterCreation);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testRoutesError(); 