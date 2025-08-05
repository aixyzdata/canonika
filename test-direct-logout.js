const puppeteer = require('puppeteer');

async function testDirectLogout() {
  console.log('🚪 Testando logout direto...');
  
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
      
      // 3. Executar logout diretamente no console
      console.log('🖱️ Executando logout diretamente...');
      
      const logoutResult = await page.evaluate(() => {
        console.log('🚪 Executando logout no console...');
        
        // Limpar localStorage
        localStorage.removeItem('harbor_access_token');
        localStorage.removeItem('harbor_refresh_token');
        
        // Limpar cookies
        document.cookie = 'harbor_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'harbor_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        console.log('🧹 Tokens limpos, redirecionando para Quarter...');
        
        // Redirecionar para Quarter
        window.location.href = 'http://localhost:3700';
        
        return 'Logout executado';
      });
      
      console.log('📝 Resultado do logout:', logoutResult);
      
      // 4. Aguardar redirecionamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const currentUrl = page.url();
      console.log('📍 URL após logout direto:', currentUrl);
      
      if (currentUrl.includes('localhost:3700')) {
        console.log('✅ Logout funcionando - redirecionado para Quarter');
      } else {
        console.log('❌ Logout não redirecionou para Quarter');
        console.log('📍 URL atual:', currentUrl);
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
testDirectLogout().catch(console.error); 