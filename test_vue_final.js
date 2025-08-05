const puppeteer = require('puppeteer');

async function testVueFinal() {
  console.log('🔍 Teste final do Vue...');
  
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
          
          // Tentar forçar a atualização do Vue
          console.log('🔍 Tentando forçar a atualização do Vue...');
          await page.evaluate(() => {
            if (window.app && window.app.__vue_app__) {
              const vueApp = window.app.__vue_app__;
              if (vueApp.$forceUpdate) {
                console.log('Forçando atualização do Vue...');
                vueApp.$forceUpdate();
              }
            }
          });
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verificar novamente se o login form desapareceu
          const loginFormAfter2 = await page.$('.login-form');
          if (!loginFormAfter2) {
            console.log('✅ Formulário de login desapareceu após forçar atualização');
          } else {
            console.log('❌ Formulário de login ainda presente após forçar atualização');
          }
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

testVueFinal(); 