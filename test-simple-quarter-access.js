const puppeteer = require('puppeteer');

async function testQuarterAccess() {
  console.log('🧪 Testando acesso ao Quarter...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Acessar Quarter
    console.log('📍 Acessando Quarter...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
    
    // Verificar se a página carregou
    const title = await page.title();
    console.log('📍 Título da página:', title);
    
    // Verificar se há campos de login
    const emailField = await page.$('input[type="email"]');
    const passwordField = await page.$('input[type="password"]');
    
    if (emailField && passwordField) {
      console.log('✅ Campos de login encontrados');
    } else {
      console.log('❌ Campos de login não encontrados');
    }
    
    // Aguardar um pouco para ver a página
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await browser.close();
  }
}

testQuarterAccess(); 