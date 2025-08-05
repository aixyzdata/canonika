const puppeteer = require('puppeteer');

async function testBeaconAuth() {
  console.log('🧪 Testando autenticação do Beacon...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Tentar acessar Beacon diretamente (deve redirecionar para Quarter)
    console.log('📍 Tentando acessar Beacon diretamente...');
    await page.goto('http://localhost:3703', { waitUntil: 'networkidle0' });
    
    // Aguardar redirecionamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);
    
    if (currentUrl.includes('localhost:3700')) {
      console.log('✅ SUCCESS: Beacon redirecionou para Quarter');
    } else {
      console.log('❌ FAIL: Beacon não redirecionou para Quarter');
      console.log('📍 URL atual:', currentUrl);
    }
    
    // 2. Fazer login no Quarter
    console.log('📍 Fazendo login no Quarter...');
    await page.waitForSelector('input[type="email"]');
    
    await page.type('input[type="email"]', 'admin@canonika.io');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para Beacon
    await page.waitForNavigation({ timeout: 60000 });
    
    const beaconUrl = page.url();
    console.log('📍 URL após login:', beaconUrl);
    
    if (beaconUrl.includes('localhost:3703')) {
      console.log('✅ SUCCESS: Login bem-sucedido, redirecionado para Beacon');
    } else {
      console.log('❌ FAIL: Não foi redirecionado para Beacon');
      console.log('📍 URL atual:', beaconUrl);
    }
    
    // 3. Verificar se o Beacon carregou corretamente
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const beaconTitle = await page.title();
    console.log('📍 Título da página Beacon:', beaconTitle);
    
    // 4. Verificar se há elementos do Beacon
    const beaconElements = await page.$$('.tollgate-view');
    if (beaconElements.length > 0) {
      console.log('✅ SUCCESS: Beacon carregou corretamente');
    } else {
      console.log('❌ FAIL: Beacon não carregou corretamente');
    }
    
    // 5. Testar logout
    console.log('📍 Testando logout...');
    const logoutButton = await page.$('button[data-testid="logout"]') || 
                        await page.$('button:contains("Sair")') ||
                        await page.$('button:contains("Logout")');
    
    if (logoutButton) {
      await logoutButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const logoutUrl = page.url();
      console.log('📍 URL após logout:', logoutUrl);
      
      if (logoutUrl.includes('localhost:3700')) {
        console.log('✅ SUCCESS: Logout funcionou, redirecionado para Quarter');
      } else {
        console.log('❌ FAIL: Logout não funcionou corretamente');
      }
    } else {
      console.log('⚠️ WARNING: Botão de logout não encontrado');
    }
    
    console.log('🎉 Teste de autenticação do Beacon concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

testBeaconAuth(); 