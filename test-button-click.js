const puppeteer = require('puppeteer');

async function testButtonClick() {
  console.log('🔘 Testando clique no botão de logout...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Fazer login
    console.log('\n📍 Fazendo login...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.login-form', { timeout: 10000 });
    await page.click('.login-btn');
    
    // Aguardar redirecionamento para Harbor
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const harborUrl = page.url();
    console.log('📍 URL após login:', harborUrl);
    
    if (harborUrl.includes('localhost:3701')) {
      console.log('✅ Login bem-sucedido');
      
      // 2. Verificar se o botão de logout existe
      console.log('\n📍 Verificando botão de logout...');
      const logoutButton = await page.$('.logout-btn');
      
      if (logoutButton) {
        console.log('✅ Botão de logout encontrado');
        
        // 3. Verificar se o botão está visível
        const isVisible = await logoutButton.isVisible();
        console.log('👁️ Botão visível:', isVisible);
        
        // 4. Clicar no botão
        console.log('\n📍 Clicando no botão de logout...');
        await logoutButton.click();
        
        // 5. Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 6. Verificar se houve mudança na URL
        const finalUrl = page.url();
        console.log('📍 URL após clique:', finalUrl);
        
        if (finalUrl.includes('localhost:3700')) {
          console.log('✅ Logout funcionou - Redirecionado para Quarter');
        } else {
          console.log('❌ Logout não funcionou - Ainda no Harbor');
          
          // 7. Verificar console logs
          console.log('\n📍 Verificando console logs...');
          const logs = await page.evaluate(() => {
            return window.consoleLogs || [];
          });
          
          if (logs.length > 0) {
            console.log('📝 Console logs:', logs);
          } else {
            console.log('📝 Nenhum console log encontrado');
          }
        }
        
      } else {
        console.log('❌ Botão de logout não encontrado');
      }
      
    } else {
      console.log('❌ Login falhou');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await browser.close();
  }
}

testButtonClick().catch(console.error); 