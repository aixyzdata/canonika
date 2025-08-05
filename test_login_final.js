const puppeteer = require('puppeteer');

async function testLoginFinal() {
  console.log('🚀 Iniciando teste final do login do Quarter...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Configurar listener para logs do console
    page.on('console', msg => {
      console.log('📱 Console:', msg.text());
    });
    
    console.log('📍 Navegando para Quarter...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle2' });
    
    // Aguardar um pouco para o Vue carregar
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Verificando elementos do formulário...');
    
    // Verificar se o formulário existe
    const form = await page.$('form');
    if (!form) {
      throw new Error('Formulário não encontrado');
    }
    console.log('✅ Formulário encontrado');
    
    // Verificar se os campos existem
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitButton) {
      throw new Error('Campos do formulário não encontrados');
    }
    console.log('✅ Campos do formulário encontrados');
    
    // Preencher o formulário
    console.log('📝 Preenchendo formulário...');
    await emailInput.type('admin@canonika.io');
    await passwordInput.type('admin123');
    
    console.log('🖱️ Clicando no botão de login...');
    
    // Tentar clicar no botão
    await submitButton.click();
    
    console.log('⏳ Aguardando redirecionamento...');
    
    // Aguardar redirecionamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar URL atual
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);
    
    // Verificar se foi redirecionado
    if (currentUrl.includes('localhost:3701') || currentUrl.includes('localhost:3703')) {
      console.log('✅ Redirecionamento bem-sucedido!');
      
      // Verificar cookies
      const cookies = await page.cookies();
      console.log('🍪 Cookies encontrados:', cookies.length);
      
      const authCookie = cookies.find(c => c.name === 'canonika_authenticated');
      if (authCookie) {
        console.log('✅ Cookie de autenticação encontrado:', authCookie.value);
      } else {
        console.log('❌ Cookie de autenticação não encontrado');
      }
      
      // Verificar localStorage
      const localStorage = await page.evaluate(() => {
        try {
          return {
            authenticated: localStorage.getItem('canonika_authenticated'),
            user: localStorage.getItem('canonika_user')
          };
        } catch (e) {
          return { error: e.message };
        }
      });
      
      console.log('💾 localStorage:', localStorage);
      
    } else {
      console.log('❌ Redirecionamento não ocorreu');
      console.log('📍 URL permaneceu em:', currentUrl);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
    console.log('🏁 Teste finalizado');
  }
}

testLoginFinal(); 