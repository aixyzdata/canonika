const puppeteer = require('puppeteer');

async function testVueError() {
  console.log('🔍 Testando erro na inicialização do Vue...');
  
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
    
    // Verificar se há erros no console
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    if (consoleErrors.length > 0) {
      console.log('❌ Erros no console:', consoleErrors);
    }
    
    // Verificar se há erros de rede
    const networkErrors = await page.evaluate(() => {
      return window.networkErrors || [];
    });
    if (networkErrors.length > 0) {
      console.log('❌ Erros de rede:', networkErrors);
    }
    
    // Verificar se há erros de JavaScript
    const jsErrors = await page.evaluate(() => {
      return window.jsErrors || [];
    });
    if (jsErrors.length > 0) {
      console.log('❌ Erros de JavaScript:', jsErrors);
    }
    
    // Verificar se o elemento #app existe
    const appElement = await page.$('#app');
    if (appElement) {
      console.log('✅ Elemento #app encontrado');
      
      // Verificar o conteúdo do elemento #app
      const appContent = await page.evaluate(() => {
        const app = document.querySelector('#app');
        return app ? app.innerHTML : null;
      });
      console.log('🔍 Conteúdo do #app:', appContent ? appContent.substring(0, 200) + '...' : 'null');
    } else {
      console.log('❌ Elemento #app não encontrado');
    }
    
    // Verificar se há scripts carregados
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).map(script => ({
        src: script.src,
        type: script.type,
        content: script.innerHTML.substring(0, 100)
      }));
    });
    console.log('🔍 Scripts carregados:', scripts.length);
    
    // Verificar se há scripts do Vue
    const vueScripts = scripts.filter(script => 
      script.src.includes('vue') || 
      script.content.includes('Vue') || 
      script.content.includes('createApp')
    );
    console.log('🔍 Scripts do Vue:', vueScripts.length);
    
    // Verificar se há scripts do Vue Router
    const routerScripts = scripts.filter(script => 
      script.src.includes('router') || 
      script.content.includes('VueRouter') || 
      script.content.includes('createRouter')
    );
    console.log('🔍 Scripts do Vue Router:', routerScripts.length);
    
    // Verificar se há scripts principais
    const mainScripts = scripts.filter(script => 
      script.src.includes('index') || 
      script.src.includes('main') || 
      script.content.includes('main')
    );
    console.log('🔍 Scripts principais:', mainScripts.length);
    
    // Verificar se o login está presente
    const loginForm = await page.$('.login-form');
    if (loginForm) {
      console.log('✅ Formulário de login encontrado');
      
      // Tentar simular login através do formulário HTML
      console.log('🔍 Tentando login através do formulário HTML...');
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
          console.log('✅ Formulário de login desapareceu após login via formulário HTML');
        } else {
          console.log('❌ Formulário de login ainda presente após login via formulário HTML');
        }
        
        // Verificar se o sidebar apareceu
        const sidebar = await page.$('.sidebar');
        if (sidebar) {
          console.log('✅ Sidebar apareceu após login via formulário HTML');
        } else {
          console.log('❌ Sidebar não apareceu após login via formulário HTML');
        }
        
        // Verificar se o router-view está presente
        const routerView = await page.$('[data-v-router-view]');
        if (routerView) {
          console.log('✅ Router-view encontrado após login via formulário HTML');
        } else {
          console.log('❌ Router-view não encontrado após login via formulário HTML');
          
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
          console.log('✅ Link do Explorer encontrado após login via formulário HTML');
          
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
          console.log('❌ Link do Explorer não encontrado após login via formulário HTML');
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

testVueError(); 