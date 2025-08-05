const puppeteer = require('puppeteer');

async function testQuarterLogin() {
  console.log('🧪 Testando login do Quarter...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // Acessar o Quarter
    console.log('📍 Acessando Quarter em http://localhost:3700');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
    
    // Aguardar o formulário de login carregar
    await page.waitForSelector('.login-form', { timeout: 10000 });
    console.log('✅ Formulário de login carregado');
    
    // Verificar se os campos estão presentes
    const emailField = await page.$('input[type="email"]');
    const passwordField = await page.$('input[type="password"]');
    const loginButton = await page.$('.login-btn');
    
    console.log('🔍 Campos encontrados:', {
      email: !!emailField,
      password: !!passwordField,
      loginButton: !!loginButton
    });
    
    // Preencher credenciais
    console.log('🔐 Preenchendo credenciais...');
    await page.type('input[type="email"]', 'admin@canonika.io');
    await page.type('input[type="password"]', 'admin123');
    
    // Clicar no botão de login
    console.log('🚀 Clicando no botão de login...');
    await page.click('.login-btn');
    
    // Aguardar um pouco para ver se há algum erro
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar se há mensagem de erro
    const errorMessage = await page.$('.error-message');
    if (errorMessage) {
      const errorText = await page.evaluate(el => el.textContent, errorMessage);
      console.log('❌ Erro encontrado:', errorText);
    }
    
    // Verificar a URL atual
    const currentUrl = page.url();
    console.log('📍 URL atual após login:', currentUrl);
    
    // Se ainda estiver no Quarter, tentar aguardar redirecionamento
    if (currentUrl.includes('localhost:3700')) {
      console.log('⏳ Aguardando redirecionamento...');
      try {
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
        const newUrl = page.url();
        console.log('📍 Nova URL após redirecionamento:', newUrl);
      } catch (navError) {
        console.log('⚠️ Timeout no redirecionamento, verificando URL atual...');
        const finalUrl = page.url();
        console.log('📍 URL final:', finalUrl);
      }
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
testQuarterLogin().catch(console.error); 