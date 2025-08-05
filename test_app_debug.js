const puppeteer = require('puppeteer');

async function testAppDebug() {
  console.log('🔍 Testando debug do app Vue...');
  
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
    
    // Verificar se o app está sendo exposto
    const appExposed = await page.evaluate(() => {
      return typeof window.app !== 'undefined';
    });
    console.log('🔍 App exposto:', appExposed);
    
    if (appExposed) {
      // Verificar as propriedades do app
      const appProperties = await page.evaluate(() => {
        if (window.app) {
          return {
            hasUser: 'user' in window.app,
            hasRouter: 'router' in window.app,
            hasLogin: 'login' in window.app,
            hasLogout: 'logout' in window.app,
            hasMount: 'mount' in window.app,
            hasUse: 'use' in window.app,
            hasConfig: 'config' in window.app,
            hasVersion: 'version' in window.app
          };
        }
        return null;
      });
      console.log('🔍 Propriedades do app:', appProperties);
      
      // Verificar se o app tem métodos
      const appMethods = await page.evaluate(() => {
        if (window.app) {
          const methods = [];
          for (const key in window.app) {
            if (typeof window.app[key] === 'function') {
              methods.push(key);
            }
          }
          return methods;
        }
        return [];
      });
      console.log('🔍 Métodos do app:', appMethods);
      
      // Verificar se o app tem propriedades reativas
      const appReactiveProps = await page.evaluate(() => {
        if (window.app) {
          const props = [];
          for (const key in window.app) {
            if (typeof window.app[key] !== 'function') {
              props.push(key);
            }
          }
          return props;
        }
        return [];
      });
      console.log('🔍 Propriedades reativas do app:', appReactiveProps);
      
      // Verificar se o app tem o user
      const userValue = await page.evaluate(() => {
        if (window.app && 'user' in window.app) {
          return window.app.user;
        }
        return null;
      });
      console.log('🔍 Valor do user:', userValue);
      
      // Verificar se o app tem o router
      const routerValue = await page.evaluate(() => {
        if (window.app && 'router' in window.app) {
          return window.app.router;
        }
        return null;
      });
      console.log('🔍 Valor do router:', routerValue);
      
    }
    
    // Verificar se o login está presente
    const loginForm = await page.$('.login-form');
    if (loginForm) {
      console.log('✅ Formulário de login encontrado');
      
      // Verificar se os campos estão presentes
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const loginButton = await page.$('.login-btn');
      
      if (emailInput && passwordInput && loginButton) {
        console.log('✅ Campos de login encontrados');
        
        // Preencher o formulário
        await emailInput.type('admin@canonika.io');
        await passwordInput.type('Admin@123');
        
        console.log('🔍 Clicando no botão de login...');
        await loginButton.click();
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se o login form desapareceu
        const loginFormAfter = await page.$('.login-form');
        if (!loginFormAfter) {
          console.log('✅ Formulário de login desapareceu após login via formulário');
        } else {
          console.log('❌ Formulário de login ainda presente após login via formulário');
        }
        
        // Verificar se o sidebar apareceu
        const sidebar = await page.$('.sidebar');
        if (sidebar) {
          console.log('✅ Sidebar apareceu após login via formulário');
        } else {
          console.log('❌ Sidebar não apareceu após login via formulário');
        }
        
        // Verificar se o router-view está presente
        const routerView = await page.$('[data-v-router-view]');
        if (routerView) {
          console.log('✅ Router-view encontrado após login via formulário');
        } else {
          console.log('❌ Router-view não encontrado após login via formulário');
          
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
        console.log('❌ Campos de login não encontrados');
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

testAppDebug(); 