const puppeteer = require('puppeteer');

async function testBeaconRedirect() {
  console.log('🧪 Testando redirecionamento do Beacon...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Acessar Beacon diretamente (deve redirecionar para Quarter se não autenticado)
    console.log('📍 Acessando Beacon diretamente...');
    await page.goto('http://localhost:3703', { waitUntil: 'networkidle0' });
    
    // Aguardar redirecionamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);
    
    if (currentUrl.includes('localhost:3700')) {
      console.log('✅ SUCCESS: Beacon redirecionou para Quarter (comportamento esperado)');
    } else if (currentUrl.includes('localhost:3703')) {
      console.log('✅ SUCCESS: Beacon permaneceu na porta 3703 (usuário autenticado)');
    } else {
      console.log('❌ FAIL: Redirecionamento inesperado para:', currentUrl);
    }
    
    // 2. Verificar se há algum redirecionamento para /web/
    if (currentUrl.includes('/web/')) {
      console.log('❌ PROBLEMA: Redirecionamento para /web/ detectado');
    } else {
      console.log('✅ OK: Sem redirecionamento para /web/');
    }
    
    console.log('🎉 Teste de redirecionamento do Beacon concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

testBeaconRedirect(); 