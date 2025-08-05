const puppeteer = require('puppeteer');

async function testManualHarborAccess() {
  console.log('🧪 Testando acesso manual ao Harbor...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Usar contexto incógnito para garantir que não há dados salvos
    console.log('📍 Usando contexto limpo...');
    
    // 2. Tentar acessar Harbor diretamente
    console.log('📍 Tentando acessar Harbor diretamente...');
    await page.goto('http://localhost:3701', { waitUntil: 'networkidle0' });
    
    // Aguardar um pouco para ver se redireciona
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);
    
    // 3. Verificar se foi redirecionado para Quarter
    if (currentUrl.includes('localhost:3700')) {
      console.log('✅ SUCCESS: Harbor redirecionou corretamente para Quarter');
    } else {
      console.log('❌ FAIL: Harbor não redirecionou para Quarter');
      console.log('   URL atual:', currentUrl);
    }
    
    // 4. Verificar se não há tokens no localStorage
    const tokens = await page.evaluate(() => {
      return {
        harbor_access_token: localStorage.getItem('harbor_access_token'),
        harbor_refresh_token: localStorage.getItem('harbor_refresh_token')
      };
    });
    
    console.log('📋 Tokens no localStorage:', tokens);
    
    if (!tokens.harbor_access_token && !tokens.harbor_refresh_token) {
      console.log('✅ SUCCESS: Não há tokens no localStorage');
    } else {
      console.log('❌ FAIL: Ainda há tokens no localStorage');
    }
    
    // Aguardar um pouco para ver a página
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await browser.close();
  }
}

testManualHarborAccess(); 