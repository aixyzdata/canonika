const puppeteer = require('puppeteer');

async function testBasicVue() {
  console.log('🔍 Testando Vue básico...');
  
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
    
    // Verificar se o elemento #app existe
    const appElement = await page.$('#app');
    if (appElement) {
      console.log('✅ Elemento #app encontrado');
    } else {
      console.log('❌ Elemento #app não encontrado');
    }
    
    // Verificar se o Vue está sendo carregado
    const vueLoaded = await page.evaluate(() => {
      return typeof window.Vue !== 'undefined';
    });
    console.log('🔍 Vue carregado:', vueLoaded);
    
    // Verificar se o app está sendo exposto
    const appExposed = await page.evaluate(() => {
      return typeof window.app !== 'undefined';
    });
    console.log('🔍 App exposto:', appExposed);
    
    if (appExposed) {
      // Verificar se o app tem as propriedades esperadas
      const appProperties = await page.evaluate(() => {
        if (window.app) {
          return {
            hasUser: 'user' in window.app,
            hasRouter: 'router' in window.app,
            hasLogin: 'login' in window.app,
            hasLogout: 'logout' in window.app
          };
        }
        return null;
      });
      console.log('🔍 Propriedades do app:', appProperties);
    }
    
    // Verificar se há algum erro no console
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    if (consoleErrors.length > 0) {
      console.log('❌ Erros no console:', consoleErrors);
    }
    
    // Verificar se o login está presente
    const loginForm = await page.$('.login-form');
    if (loginForm) {
      console.log('✅ Formulário de login encontrado');
      
      // Simular login
      console.log('🔍 Simulando login via console...');
      await page.evaluate(() => {
        if (window.app) {
          window.app.user = {
            id: 'admin-001',
            name: 'Administrador',
            email: 'admin@canonika.io',
            roles: ['admin']
          };
          console.log('User definido via console:', window.app.user);
        } else {
          console.log('App não encontrado');
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se o login form desapareceu
      const loginFormAfter = await page.$('.login-form');
      if (!loginFormAfter) {
        console.log('✅ Formulário de login desapareceu após login via console');
      } else {
        console.log('❌ Formulário de login ainda presente após login via console');
      }
      
      // Verificar se o sidebar apareceu
      const sidebar = await page.$('.sidebar');
      if (sidebar) {
        console.log('✅ Sidebar apareceu após login via console');
      } else {
        console.log('❌ Sidebar não apareceu após login via console');
      }
      
      // Verificar se o router-view está presente
      const routerView = await page.$('[data-v-router-view]');
      if (routerView) {
        console.log('✅ Router-view encontrado após login via console');
      } else {
        console.log('❌ Router-view não encontrado após login via console');
        
        // Verificar se há algum elemento com router-view
        const allElements = await page.$$('*');
        console.log('🔍 Total de elementos na página:', allElements.length);
        
        // Verificar se há algum elemento com data-v-router-view
        const routerElements = await page.$$('[data-v-router-view]');
        console.log('🔍 Elementos com data-v-router-view:', routerElements.length);
        
        // Verificar se há algum elemento com router-view
        const routerViewElements = await page.$$('router-view');
        console.log('🔍 Elementos router-view:', routerViewElements.length);
        
        // Verificar se há algum elemento com router-container
        const routerContainerElements = await page.$$('.router-container');
        console.log('🔍 Elementos .router-container:', routerContainerElements.length);
        
        // Verificar se há algum elemento com v-if="user"
        const userConditionElements = await page.$$('[v-if="user"]');
        console.log('🔍 Elementos com v-if="user":', userConditionElements.length);
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

testBasicVue(); 