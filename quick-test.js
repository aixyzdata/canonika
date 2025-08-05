const puppeteer = require('puppeteer');

async function quickTest() {
  console.log('🧪 Teste rápido - Acesso ao Harbor após logout...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Usar contexto limpo
    console.log('📍 Usando contexto limpo...');
    
    // 2. Tentar acessar Harbor diretamente
    console.log('📍 Acessando Harbor diretamente...');
    await page.goto('http://localhost:3701', { waitUntil: 'networkidle0' });
    
    // Aguardar redirecionamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);
    
    if (currentUrl.includes('localhost:3700')) {
      console.log('✅ SUCCESS: Harbor redirecionou para Quarter');
    } else {
      console.log('❌ FAIL: Harbor não redirecionou');
      console.log('   URL atual:', currentUrl);
    }
    
    // Aguardar para ver a página
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

quickTest(); 