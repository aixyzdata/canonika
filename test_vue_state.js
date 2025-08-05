const puppeteer = require('puppeteer');

async function testVueState() {
  console.log('🔍 Testando estado do Vue...');
  
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
    
    // Verificar o estado do Vue
    const vueState = await page.evaluate(() => {
      if (window.app) {
        console.log('App Vue encontrado');
        
        // Verificar se o router está disponível
        if (window.app.$router) {
          console.log('Router encontrado');
          console.log('Rotas disponíveis:', window.app.$router.getRoutes().length);
        } else {
          console.log('Router não encontrado');
        }
        
        // Verificar se o user está definido
        if (window.app.user) {
          console.log('User encontrado:', window.app.user);
        } else {
          console.log('User não encontrado');
        }
        
        // Verificar se o template está sendo renderizado
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
          console.log('Login form encontrado');
        } else {
          console.log('Login form não encontrado');
        }
        
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          console.log('Sidebar encontrado');
        } else {
          console.log('Sidebar não encontrado');
        }
        
        const routerView = document.querySelector('router-view');
        if (routerView) {
          console.log('Router-view encontrado');
        } else {
          console.log('Router-view não encontrado');
        }
        
        return {
          appExists: true,
          routerExists: !!window.app.$router,
          userExists: !!window.app.user,
          loginFormExists: !!loginForm,
          sidebarExists: !!sidebar,
          routerViewExists: !!routerView
        };
      } else {
        console.log('App Vue não encontrado');
        return {
          appExists: false,
          routerExists: false,
          userExists: false,
          loginFormExists: false,
          sidebarExists: false,
          routerViewExists: false
        };
      }
    });
    
    console.log('🔍 Estado do Vue:', vueState);
    
    // Simular login
    console.log('🔍 Simulando login...');
    const loginResult = await page.evaluate(() => {
      if (window.app) {
        // Definir o user
        window.app.user = {
          id: 'admin-001',
          name: 'Administrador',
          email: 'admin@canonika.io',
          roles: ['admin']
        };
        
        console.log('User definido:', window.app.user);
        
        // Aguardar um pouco para a reatividade
        return new Promise(resolve => {
          setTimeout(() => {
            const loginFormAfter = document.querySelector('.login-form');
            const sidebarAfter = document.querySelector('.sidebar');
            const routerViewAfter = document.querySelector('router-view');
            
            resolve({
              loginFormExists: !!loginFormAfter,
              sidebarExists: !!sidebarAfter,
              routerViewExists: !!routerViewAfter,
              userExists: !!window.app.user
            });
          }, 1000);
        });
      }
      return null;
    });
    
    console.log('🔍 Resultado após login:', loginResult);
    
    // Verificar se o router-view está funcionando
    if (loginResult && loginResult.routerViewExists) {
      console.log('🔍 Testando navegação...');
      
      const navigationResult = await page.evaluate(() => {
        if (window.app && window.app.$router) {
          // Navegar para /explorer
          window.app.$router.push('/explorer');
          
          return new Promise(resolve => {
            setTimeout(() => {
              const explorerContent = document.querySelector('.explorer-content');
              const currentRoute = window.app.$router.currentRoute.value;
              
              resolve({
                currentRoute: currentRoute,
                explorerContentExists: !!explorerContent
              });
            }, 1000);
          });
        }
        return null;
      });
      
      console.log('🔍 Resultado da navegação:', navigationResult);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testVueState(); 