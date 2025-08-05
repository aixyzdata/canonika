const puppeteer = require('puppeteer');

async function testDebugRedirect() {
  console.log('🔍 DEBUG: Testando redirecionamento específico');
  
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
    
    // Configurar listener para requisições
    page.on('request', request => {
      console.log('🌐 Request:', request.url());
    });
    
    // Configurar listener para respostas
    page.on('response', response => {
      console.log('📥 Response:', response.url(), response.status());
    });
    
    console.log('📍 Navegando para Quarter...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle2' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📝 Preenchendo formulário...');
    await page.type('input[type="email"]', 'admin@canonika.io');
    await page.type('input[type="password"]', 'admin123');
    
    console.log('🖱️ Clicando no botão de login...');
    await page.click('button[type="submit"]');
    
    console.log('⏳ Aguardando redirecionamento...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('📍 URL atual:', page.url());
    
    // Verificar cookies
    const cookies = await page.cookies();
    console.log('🍪 Cookies:', cookies.map(c => `${c.name}=${c.value}`));
    
    // Tentar navegar manualmente para Harbor
    console.log('🔄 Tentando navegar manualmente para Harbor...');
    await page.goto('http://localhost:3701', { waitUntil: 'networkidle2' });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('📍 URL após navegação manual:', page.url());
    
    // Verificar se foi redirecionado de volta para Quarter
    if (page.url().includes('localhost:3700')) {
      console.log('⚠️ Harbor redirecionou de volta para Quarter');
      console.log('🔍 Isso indica que o Harbor não reconhece a autenticação');
    } else if (page.url().includes('localhost:3701')) {
      console.log('✅ Harbor carregou corretamente');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await browser.close();
    console.log('🏁 Debug finalizado');
  }
}

testDebugRedirect(); 