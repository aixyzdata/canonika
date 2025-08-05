const puppeteer = require('puppeteer');

async function testAuthAfterLogout() {
  console.log('🧪 Testando acesso ao Harbor após logout...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Fazer login no Quarter
    console.log('📍 Fazendo login no Quarter...');
    await page.goto('http://localhost:3700');
    await page.waitForSelector('input[type="email"]');
    
    await page.type('input[type="email"]', 'admin@canonika.io');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para Harbor
    await page.waitForNavigation({ timeout: 60000 });
    console.log('✅ Login bem-sucedido, redirecionado para Harbor');
    
    // 2. Verificar se está no Harbor
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);
    
    if (!currentUrl.includes('localhost:3701')) {
      throw new Error('Não foi redirecionado para Harbor');
    }
    
    // 3. Fazer logout
    console.log('📍 Fazendo logout...');
    await page.waitForSelector('.logout-btn');
    await page.click('.logout-btn');
    
    // Aguardar redirecionamento para Quarter
    await page.waitForNavigation({ timeout: 60000 });
    console.log('✅ Logout realizado, redirecionado para Quarter');
    
    // 4. Tentar acessar Harbor diretamente
    console.log('📍 Tentando acessar Harbor diretamente...');
    await page.goto('http://localhost:3701');
    
    // Aguardar um pouco para ver se redireciona
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalUrl = page.url();
    console.log('📍 URL final após tentativa de acesso:', finalUrl);
    
    // 5. Verificar se foi redirecionado para Quarter
    if (finalUrl.includes('localhost:3700')) {
      console.log('✅ SUCCESS: Harbor redirecionou corretamente para Quarter após logout');
    } else {
      console.log('❌ FAIL: Harbor não redirecionou para Quarter após logout');
      console.log('   URL atual:', finalUrl);
    }
    
    // 6. Verificar se não há tokens no localStorage
    const tokens = await page.evaluate(() => {
      return {
        harbor_access_token: localStorage.getItem('harbor_access_token'),
        harbor_refresh_token: localStorage.getItem('harbor_refresh_token')
      };
    });
    
    console.log('📋 Tokens no localStorage:', tokens);
    
    if (!tokens.harbor_access_token && !tokens.harbor_refresh_token) {
      console.log('✅ SUCCESS: Tokens foram limpos corretamente');
    } else {
      console.log('❌ FAIL: Tokens ainda estão presentes');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await browser.close();
  }
}

testAuthAfterLogout(); 