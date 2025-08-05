const puppeteer = require('puppeteer');

async function testUserDebug() {
  console.log('🔍 Testando debug do user...');
  
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
    
    // Verificar se o login está presente
    const loginForm = await page.$('.login-form');
    if (loginForm) {
      console.log('✅ Formulário de login encontrado');
      
      // Verificar o estado inicial do user
      const initialUserState = await page.evaluate(() => {
        if (window.app) {
          console.log('App encontrado, verificando user inicial...');
          console.log('User inicial:', window.app.user);
          return window.app.user;
        } else {
          console.log('App não encontrado');
          return null;
        }
      });
      
      console.log('🔍 Estado inicial do user:', initialUserState);
      
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
          
          // Forçar reatividade
          if (window.app.$forceUpdate) {
            window.app.$forceUpdate();
            console.log('Forçando atualização do app');
          }
          
          return true;
        } else {
          console.log('App não encontrado');
          return false;
        }
      });
      
      console.log('🔍 Login simulado:', loginResult ? 'Sucesso' : 'Falha');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar o estado do user após login
      const userStateAfterLogin = await page.evaluate(() => {
        if (window.app) {
          console.log('Verificando user após login...');
          console.log('User após login:', window.app.user);
          return window.app.user;
        } else {
          console.log('App não encontrado após login');
          return null;
        }
      });
      
      console.log('🔍 Estado do user após login:', userStateAfterLogin);
      
      // Verificar se o login form desapareceu
      const loginFormAfter = await page.$('.login-form');
      if (!loginFormAfter) {
        console.log('✅ Formulário de login desapareceu após login');
      } else {
        console.log('❌ Formulário de login ainda presente após login');
      }
      
      // Verificar se o sidebar apareceu
      const sidebar = await page.$('.sidebar');
      if (sidebar) {
        console.log('✅ Sidebar apareceu após login');
      } else {
        console.log('❌ Sidebar não apareceu após login');
      }
      
      // Verificar se o router-view está presente
      const routerView = await page.$('[data-v-router-view]');
      if (routerView) {
        console.log('✅ Router-view encontrado após login');
      } else {
        console.log('❌ Router-view não encontrado após login');
        
        // Verificar se há algum elemento com router-view
        const allElements = await page.$$('*');
        console.log('🔍 Total de elementos na página:', allElements.length);
        
        // Verificar se há algum elemento com data-v-router-view
        const routerElements = await page.$$('[data-v-router-view]');
        console.log('🔍 Elementos com data-v-router-view:', routerElements.length);
        
        // Verificar se há algum elemento com router-view
        const routerViewElements = await page.$$('router-view');
        console.log('🔍 Elementos router-view:', routerViewElements.length);
      }
      
    } else {
      console.log('❌ Formulário de login não encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testUserDebug(); 