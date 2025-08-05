const puppeteer = require('puppeteer');

async function testSimpleLogout() {
  console.log('🚪 Testando logout simples...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Fazer login
    console.log('\n📍 Fazendo login...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.login-form', { timeout: 10000 });
    await page.click('.login-btn');
    
    // Aguardar redirecionamento para Harbor
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const harborUrl = page.url();
    console.log('📍 URL após login:', harborUrl);
    
    if (harborUrl.includes('localhost:3701')) {
      console.log('✅ Login bem-sucedido');
      
      // 2. Aguardar Harbor carregar
      await page.waitForSelector('.canonika-header', { timeout: 10000 });
      console.log('✅ Harbor carregado');
      
      // 3. Verificar se o botão de logout existe
      const logoutButton = await page.$('.logout-btn');
      if (logoutButton) {
        console.log('✅ Botão de logout encontrado');
        
        // 4. Clicar no botão de logout
        console.log('🖱️ Clicando no botão de logout...');
        await logoutButton.click();
        
        // 5. Aguardar um pouco e verificar a URL
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const currentUrl = page.url();
        console.log('📍 URL após clicar no logout:', currentUrl);
        
        // 6. Verificar se redirecionou para Quarter
        if (currentUrl.includes('localhost:3700')) {
          console.log('✅ Logout funcionando - redirecionado para Quarter');
        } else {
          console.log('❌ Logout não redirecionou para Quarter');
          console.log('📍 URL atual:', currentUrl);
        }
        
      } else {
        console.log('❌ Botão de logout não encontrado');
      }
      
    } else {
      console.log('❌ Login falhou');
    }
    
    // Aguardar um pouco para visualizar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testSimpleLogout().catch(console.error); 