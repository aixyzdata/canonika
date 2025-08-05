const puppeteer = require('puppeteer');

async function testVueLogin() {
  console.log('🔍 Testando login através da instância do Vue...');
  
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
      
      // Tentar acessar a instância do Vue e simular login
      console.log('🔍 Simulando login através da instância do Vue...');
      const loginResult = await page.evaluate(() => {
        if (window.app && window.app.__vue_app__) {
          const vueApp = window.app.__vue_app__;
          console.log('Instância do Vue encontrada:', vueApp);
          
          // Verificar se a instância tem o método login
          if ('login' in vueApp) {
            console.log('Método login encontrado');
            vueApp.login();
            return { success: true, method: 'login' };
          } else {
            console.log('Método login não encontrado');
            
            // Verificar se tem o user
            if ('user' in vueApp) {
              console.log('User encontrado:', vueApp.user);
              
              // Simular login definindo o user diretamente
              vueApp.user = {
                id: 'admin-001',
                name: 'Administrador',
                email: 'admin@canonika.io',
                roles: ['admin']
              };
              
              console.log('User definido:', vueApp.user);
              return { success: true, method: 'direct' };
            } else {
              console.log('User não encontrado');
              return { success: false, error: 'User não encontrado' };
            }
          }
        } else {
          console.log('Instância do Vue não encontrada');
          return { success: false, error: 'Instância do Vue não encontrada' };
        }
      });
      
      console.log('🔍 Resultado do login:', loginResult);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se o login form desapareceu
      const loginFormAfter = await page.$('.login-form');
      if (!loginFormAfter) {
        console.log('✅ Formulário de login desapareceu após login via instância do Vue');
      } else {
        console.log('❌ Formulário de login ainda presente após login via instância do Vue');
      }
      
      // Verificar se o sidebar apareceu
      const sidebar = await page.$('.sidebar');
      if (sidebar) {
        console.log('✅ Sidebar apareceu após login via instância do Vue');
      } else {
        console.log('❌ Sidebar não apareceu após login via instância do Vue');
      }
      
      // Verificar se o router-view está presente
      const routerView = await page.$('[data-v-router-view]');
      if (routerView) {
        console.log('✅ Router-view encontrado após login via instância do Vue');
      } else {
        console.log('❌ Router-view não encontrado após login via instância do Vue');
        
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
      
      // Verificar se o Explorer está presente
      const explorerLink = await page.$('a[href="/explorer"]');
      if (explorerLink) {
        console.log('✅ Link do Explorer encontrado após login via instância do Vue');
        
        // Clicar no Explorer
        console.log('🔍 Clicando no Explorer...');
        await explorerLink.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('📍 URL após clique:', page.url());
        
        // Verificar se a página do Explorer carregou
        const explorerContent = await page.$('.explorer-content');
        if (explorerContent) {
          console.log('✅ Página do Explorer carregou corretamente');
        } else {
          console.log('❌ Página do Explorer não carregou');
          
          // Verificar se há algum erro
          const errorElement = await page.$('.error');
          if (errorElement) {
            const errorText = await page.evaluate(el => el.textContent, errorElement);
            console.log('❌ Erro encontrado:', errorText);
          }
          
          // Verificar se há algum elemento com explorer
          const explorerElements = await page.$$('[class*="explorer"]');
          console.log('🔍 Elementos com explorer:', explorerElements.length);
        }
      } else {
        console.log('❌ Link do Explorer não encontrado após login via instância do Vue');
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

testVueLogin(); 