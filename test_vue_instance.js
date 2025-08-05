const puppeteer = require('puppeteer');

async function testVueInstance() {
  console.log('🔍 Testando instância do Vue...');
  
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
      // Tentar acessar a instância do Vue através do elemento DOM
      const vueInstance = await page.evaluate(() => {
        if (window.app && window.app.__vue_app__) {
          return window.app.__vue_app__;
        }
        return null;
      });
      console.log('🔍 Instância do Vue encontrada:', vueInstance !== null);
      
      if (vueInstance) {
        // Verificar as propriedades da instância do Vue
        const vueProperties = await page.evaluate(() => {
          if (window.app && window.app.__vue_app__) {
            const vueApp = window.app.__vue_app__;
            return {
              hasUser: 'user' in vueApp,
              hasRouter: 'router' in vueApp,
              hasLogin: 'login' in vueApp,
              hasLogout: 'logout' in vueApp,
              hasMount: 'mount' in vueApp,
              hasUse: 'use' in vueApp,
              hasConfig: 'config' in vueApp,
              hasVersion: 'version' in vueApp
            };
          }
          return null;
        });
        console.log('🔍 Propriedades da instância do Vue:', vueProperties);
        
        // Verificar se a instância do Vue tem métodos
        const vueMethods = await page.evaluate(() => {
          if (window.app && window.app.__vue_app__) {
            const vueApp = window.app.__vue_app__;
            const methods = [];
            for (const key in vueApp) {
              if (typeof vueApp[key] === 'function') {
                methods.push(key);
              }
            }
            return methods;
          }
          return [];
        });
        console.log('🔍 Métodos da instância do Vue:', vueMethods);
        
        // Verificar se a instância do Vue tem propriedades reativas
        const vueReactiveProps = await page.evaluate(() => {
          if (window.app && window.app.__vue_app__) {
            const vueApp = window.app.__vue_app__;
            const props = [];
            for (const key in vueApp) {
              if (typeof vueApp[key] !== 'function') {
                props.push(key);
              }
            }
            return props;
          }
          return [];
        });
        console.log('🔍 Propriedades reativas da instância do Vue:', vueReactiveProps);
        
        // Verificar se a instância do Vue tem o user
        const userValue = await page.evaluate(() => {
          if (window.app && window.app.__vue_app__) {
            const vueApp = window.app.__vue_app__;
            if ('user' in vueApp) {
              return vueApp.user;
            }
          }
          return null;
        });
        console.log('🔍 Valor do user na instância do Vue:', userValue);
        
        // Verificar se a instância do Vue tem o router
        const routerValue = await page.evaluate(() => {
          if (window.app && window.app.__vue_app__) {
            const vueApp = window.app.__vue_app__;
            if ('router' in vueApp) {
              return vueApp.router;
            }
          }
          return null;
        });
        console.log('🔍 Valor do router na instância do Vue:', routerValue);
        
      }
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

testVueInstance(); 