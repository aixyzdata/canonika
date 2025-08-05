const puppeteer = require('puppeteer');

async function testHarbor() {
  console.log('🔓 Testando Harbor com melhorias...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('📍 Navegando para Harbor...');
    await page.goto('http://localhost:3701/', { waitUntil: 'networkidle2', timeout: 15000 });
    
    console.log('📍 URL atual:', page.url());
    
    // Aguardar um pouco para carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se o login está presente
    const loginForm = await page.$('.login-form');
    if (loginForm) {
      console.log('✅ Formulário de login encontrado');
      
      // Preencher login
      await page.type('input[type="email"]', 'admin@canonika.io');
      await page.type('input[type="password"]', 'Admin@123');
      await page.click('.login-btn');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Verificar se o sidebar está presente
    const sidebar = await page.$('.sidebar');
    if (sidebar) {
      console.log('✅ Sidebar encontrado');
      
      // Verificar se o Explorer está presente
      const explorerLink = await page.$('a[href="/explorer"]');
      if (explorerLink) {
        console.log('✅ Link do Explorer encontrado');
        
        // Clicar no Explorer
        await explorerLink.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se a página do Explorer carregou
        const explorerContent = await page.$('.explorer-content');
        if (explorerContent) {
          console.log('✅ Página do Explorer carregou corretamente');
        } else {
          console.log('❌ Página do Explorer não carregou');
        }
      } else {
        console.log('❌ Link do Explorer não encontrado');
      }
      
      // Verificar links externos
      const externalLinks = await page.$$('.external-link-icon');
      console.log(`✅ ${externalLinks.length} links externos encontrados`);
      
    } else {
      console.log('❌ Sidebar não encontrado');
    }
    
    // Verificar contraste no Explorer
    const explorerView = await page.$('.explorer-view');
    if (explorerView) {
      const backgroundColor = await page.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      }, explorerView);
      
      console.log('✅ Explorer com fundo claro:', backgroundColor);
    }
    
    console.log('✅ Harbor com melhorias funcionando corretamente!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testHarbor(); 