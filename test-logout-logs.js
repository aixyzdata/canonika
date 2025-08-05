const puppeteer = require('puppeteer');

async function testLogoutLogs() {
  console.log('🔍 Testando logs de logout...');
  
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
        
        // 3. Capturar logs do console antes do clique
        const logs = [];
        page.on('console', msg => {
          logs.push(msg.text());
          console.log('📝 Console:', msg.text());
        });
        
        // 4. Clicar no botão de logout
        console.log('\n📍 Clicando no botão de logout...');
        await logoutButton.click();
        
        // 5. Aguardar um pouco para ver os logs
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 6. Verificar se apareceram logs de logout
        const logoutLogs = logs.filter(log => 
          log.includes('BOTÃO LOGOUT CLICADO') || 
          log.includes('INICIANDO LOGOUT') ||
          log.includes('FIM DO LOGOUT')
        );
        
        console.log('\n📋 Logs de logout encontrados:', logoutLogs.length);
        logoutLogs.forEach(log => console.log('  -', log));
        
        if (logoutLogs.length > 0) {
          console.log('✅ Logs de logout apareceram!');
        } else {
          console.log('❌ Nenhum log de logout apareceu');
        }
        
        // 7. Verificar URL final
        const finalUrl = page.url();
        console.log('📍 URL final:', finalUrl);
        
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

testLogoutLogs().catch(console.error); 