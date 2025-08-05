const puppeteer = require('puppeteer');

async function testVueReactivity() {
  console.log('🔍 Testando reatividade do Vue...');
  
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
        // Tentar acessar o user através do app
        if (window.app && window.app.user !== undefined) {
          return window.app.user;
        }
        return null;
      });
      console.log('🔍 Estado inicial do user:', initialUserState);
      
      // Simular login através do método login() do Vue
      console.log('🔍 Simulando login através do método login()...');
      const loginResult = await page.evaluate(() => {
        if (window.app && window.app.login) {
          // Chamar o método login() diretamente
          window.app.login();
          return true;
        } else {
          console.log('Método login() não encontrado');
          return false;
        }
      });
      
      console.log('🔍 Login através do método:', loginResult ? 'Sucesso' : 'Falha');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar o estado do user após login
      const userStateAfterLogin = await page.evaluate(() => {
        if (window.app && window.app.user !== undefined) {
          return window.app.user;
        }
        return null;
      });
      console.log('🔍 Estado do user após login:', userStateAfterLogin);
      
      // Verificar se o login form desapareceu
      const loginFormAfter = await page.$('.login-form');
      if (!loginFormAfter) {
        console.log('✅ Formulário de login desapareceu após login via método');
      } else {
        console.log('❌ Formulário de login ainda presente após login via método');
      }
      
      // Verificar se o sidebar apareceu
      const sidebar = await page.$('.sidebar');
      if (sidebar) {
        console.log('✅ Sidebar apareceu após login via método');
      } else {
        console.log('❌ Sidebar não apareceu após login via método');
      }
      
      // Verificar se o router-view está presente
      const routerView = await page.$('[data-v-router-view]');
      if (routerView) {
        console.log('✅ Router-view encontrado após login via método');
      } else {
        console.log('❌ Router-view não encontrado após login via método');
        
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
        console.log('✅ Link do Explorer encontrado após login via método');
        
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
        console.log('❌ Link do Explorer não encontrado após login via método');
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

testVueReactivity(); 