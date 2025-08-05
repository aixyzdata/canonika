const puppeteer = require('puppeteer');

async function testDevCredentials() {
  console.log('🔧 Testando credenciais de desenvolvimento...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // Acessar Quarter
    console.log('📍 Acessando Quarter...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
    
    // Aguardar formulário carregar
    await page.waitForSelector('.login-form', { timeout: 10000 });
    console.log('✅ Formulário de login carregado');
    
    // Verificar se as credenciais estão pré-preenchidas
    const emailValue = await page.$eval('input[type="email"]', el => el.value);
    const passwordValue = await page.$eval('input[type="password"]', el => el.value);
    
    console.log('📧 Email pré-preenchido:', emailValue);
    console.log('🔑 Senha pré-preenchida:', passwordValue);
    
    if (emailValue === 'admin@canonika.io' && passwordValue === 'admin123') {
      console.log('✅ Credenciais pré-preenchidas corretamente!');
    } else {
      console.log('❌ Credenciais não estão pré-preenchidas');
    }
    
    // Verificar se há a caixa de credenciais de desenvolvimento
    const devCredentials = await page.$('.dev-credentials');
    if (devCredentials) {
      console.log('✅ Caixa de credenciais de desenvolvimento encontrada');
      
      const devText = await page.evaluate(el => el.textContent, devCredentials);
      console.log('📝 Texto da caixa:', devText);
    } else {
      console.log('❌ Caixa de credenciais de desenvolvimento não encontrada');
    }
    
    // Testar login com um clique
    console.log('🚀 Testando login com um clique...');
    await page.click('.login-btn');
    
    // Aguardar redirecionamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log('📍 URL após login:', currentUrl);
    
    if (currentUrl.includes('localhost:3701')) {
      console.log('✅ Login funcionando perfeitamente!');
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
testDevCredentials().catch(console.error); 