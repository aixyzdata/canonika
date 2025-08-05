const puppeteer = require('puppeteer');

async function testQuarterGuardianFlow() {
  console.log('🔄 Testando fluxo completo: Quarter -> Harbor -> Guardian');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Acessar Quarter e fazer login
    console.log('\n📍 Passo 1: Acessando Quarter...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.login-form', { timeout: 10000 });
    
    console.log('🔐 Fazendo login...');
    await page.type('input[type="email"]', 'admin@canonika.io');
    await page.type('input[type="password"]', 'admin123');
    await page.click('.login-btn');
    
    // Aguardar redirecionamento para Harbor
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const harborUrl = page.url();
    console.log('✅ Redirecionado para Harbor:', harborUrl);
    
    // 2. Verificar se Harbor carregou
    console.log('\n📍 Passo 2: Verificando Harbor...');
    await page.waitForSelector('.canonika-header', { timeout: 10000 });
    console.log('✅ Harbor carregado com sucesso');
    
    // 3. Verificar se há link para Guardian no sidebar
    console.log('\n📍 Passo 3: Verificando sidebar do Harbor...');
    const guardianLink = await page.$('a[href*="3705"]');
    if (guardianLink) {
      console.log('✅ Link para Guardian encontrado no sidebar');
      
      // 4. Clicar no link do Guardian
      console.log('\n📍 Passo 4: Acessando Guardian...');
      await guardianLink.click();
      
      // Aguardar carregamento do Guardian
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const guardianUrl = page.url();
      console.log('📍 URL do Guardian:', guardianUrl);
      
      if (guardianUrl.includes('3705')) {
        console.log('✅ Guardian acessado com sucesso');
        
        // Verificar elementos do Guardian
        const guardianElements = await page.evaluate(() => {
          return {
            hasBody: !!document.body,
            hasAnyContent: document.body ? document.body.innerHTML.length > 0 : false,
            title: document.title
          };
        });
        
        console.log('🔍 Elementos do Guardian:', guardianElements);
        
      } else {
        console.log('❌ Falha ao acessar Guardian');
      }
      
    } else {
      console.log('⚠️ Link para Guardian não encontrado no sidebar');
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
testQuarterGuardianFlow().catch(console.error); 