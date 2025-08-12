const puppeteer = require('puppeteer');

async function testTemplateRedirect() {
  console.log('🧪 Testando redirecionamento do Template Service...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Modo visível para debug
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capturar logs do console
  page.on('console', msg => {
    console.log(`📝 Console: ${msg.type()} - ${msg.text()}`);
  });
  
  // Capturar erros de rede
  page.on('response', response => {
    if (response.status() === 404) {
      console.log(`❌ 404 Error: ${response.url()}`);
    }
  });
  
  try {
    console.log('🔍 Acessando http://localhost:3790...');
    await page.goto('http://localhost:3790', { waitUntil: 'networkidle0' });
    
    console.log('📍 URL inicial:', page.url());
    
    // Aguardar redirecionamento
    console.log('⏳ Aguardando redirecionamento...');
    await page.waitForTimeout(3000);
    
    const finalUrl = page.url();
    console.log('📍 URL final:', finalUrl);
    
    // Verificar se foi redirecionado para Quarter
    if (finalUrl.includes('localhost:3700')) {
      console.log('✅ Redirecionamento para Quarter funcionou!');
      
      // Verificar se tem o parâmetro redirect_to
      if (finalUrl.includes('redirect_to=')) {
        console.log('✅ Parâmetro redirect_to presente!');
        
        // Decodificar o redirect_to
        const urlParams = new URLSearchParams(finalUrl.split('?')[1]);
        const redirectTo = urlParams.get('redirect_to');
        console.log('🔍 redirect_to decodificado:', decodeURIComponent(redirectTo));
        
        if (redirectTo && redirectTo.includes('localhost:3790')) {
          console.log('✅ redirect_to contém URL correta do Template!');
        } else {
          console.log('❌ redirect_to não contém URL correta do Template');
        }
      } else {
        console.log('❌ Parâmetro redirect_to não encontrado');
      }
    } else {
      console.log('❌ Não foi redirecionado para Quarter');
      console.log('📍 URL atual:', finalUrl);
    }
    
    // Verificar se há erros no console
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (consoleErrors.length > 0) {
      console.log('⚠️ Erros no console:', consoleErrors);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    // Manter o navegador aberto por 5 segundos para inspeção
    console.log('⏳ Mantendo navegador aberto por 5 segundos para inspeção...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
  }
}

// Executar o teste
testTemplateRedirect().catch(console.error); 