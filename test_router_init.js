const puppeteer = require('puppeteer');

async function testRouterInit() {
  console.log('🔍 Testando inicialização do Router...');
  
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
    
    // Verificar se o router está sendo inicializado
    const routerInit = await page.evaluate(() => {
      if (window.app) {
        console.log('App Vue encontrado');
        
        // Verificar se o router está disponível
        if (window.app.$router) {
          console.log('Router encontrado');
          const routes = window.app.$router.getRoutes();
          console.log('Rotas disponíveis:', routes.length);
          
          for (let i = 0; i < routes.length; i++) {
            console.log(`Rota ${i}:`, {
              path: routes[i].path,
              name: routes[i].name,
              component: routes[i].component ? 'Component' : 'No Component'
            });
          }
          
          return {
            routerExists: true,
            routesCount: routes.length,
            routes: routes.map(r => ({ path: r.path, name: r.name }))
          };
        } else {
          console.log('Router não encontrado');
          
          // Verificar se há algum erro na inicialização
          if (window.routerError) {
            console.log('Erro do router:', window.routerError);
          }
          
          return {
            routerExists: false,
            routesCount: 0,
            routes: []
          };
        }
      } else {
        console.log('App Vue não encontrado');
        return {
          routerExists: false,
          routesCount: 0,
          routes: []
        };
      }
    });
    
    console.log('🔍 Inicialização do Router:', routerInit);
    
    // Se o router não existe, tentar forçar a inicialização
    if (!routerInit.routerExists) {
      console.log('🔍 Tentando forçar inicialização do router...');
      
      const forceInit = await page.evaluate(() => {
        try {
          // Verificar se o Vue Router está disponível
          if (typeof window.VueRouter !== 'undefined') {
            console.log('VueRouter disponível globalmente');
          } else {
            console.log('VueRouter não disponível globalmente');
          }
          
          // Verificar se há algum erro no console
          const errors = [];
          const originalError = console.error;
          console.error = function(...args) {
            errors.push(args.join(' '));
            originalError.apply(console, args);
          };
          
          // Tentar criar um router simples
          try {
            const router = window.VueRouter.createRouter({
              history: window.VueRouter.createWebHistory(),
              routes: []
            });
            console.log('Router criado com sucesso');
            return { success: true, errors: errors };
          } catch (error) {
            console.log('Erro ao criar router:', error.message);
            return { success: false, errors: errors, error: error.message };
          }
        } catch (error) {
          console.log('Erro geral:', error.message);
          return { success: false, errors: [], error: error.message };
        }
      });
      
      console.log('🔍 Forçar inicialização:', forceInit);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testRouterInit(); 