const puppeteer = require('puppeteer');

async function testLogoutFinal() {
  console.log('🚪 Testando logout final...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Fazer login
    console.log('\n📍 Passo 1: Fazendo login...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.login-form', { timeout: 10000 });
    await page.click('.login-btn');
    
    // Aguardar redirecionamento para Harbor
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const harborUrl = page.url();
    console.log('📍 URL após login:', harborUrl);
    
    if (harborUrl.includes('localhost:3701')) {
      console.log('✅ Login bem-sucedido');
      
      // 2. Verificar se está autenticado
      console.log('\n📍 Passo 2: Verificando autenticação...');
      await page.waitForSelector('.user-info', { timeout: 10000 });
      const userInfo = await page.$eval('.user-info', el => el.textContent);
      console.log('👤 Usuário autenticado:', userInfo);
      
      // 3. Clicar no botão de logout
      console.log('\n📍 Passo 3: Clicando em logout...');
      await page.waitForSelector('.logout-btn', { timeout: 10000 });
      await page.click('.logout-btn');
      
      // Aguardar o processo de logout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 4. Verificar se foi redirecionado para Quarter
      const finalUrl = page.url();
      console.log('📍 URL após logout:', finalUrl);
      
      if (finalUrl.includes('localhost:3700')) {
        console.log('✅ Logout bem-sucedido - Redirecionado para Quarter');
        
        // 5. Verificar se não há tokens na URL
        if (!finalUrl.includes('auth_token')) {
          console.log('✅ URL limpa - Sem tokens');
        } else {
          console.log('⚠️ URL ainda contém tokens');
        }
        
        // 6. Tentar acessar Harbor novamente (deve redirecionar para Quarter)
        console.log('\n📍 Passo 4: Tentando acessar Harbor novamente...');
        await page.goto('http://localhost:3701', { waitUntil: 'networkidle0' });
        
        const redirectUrl = page.url();
        console.log('📍 URL após tentativa de acesso:', redirectUrl);
        
        if (redirectUrl.includes('localhost:3700')) {
          console.log('✅ Proteção funcionando - Redirecionado para Quarter');
        } else {
          console.log('❌ Proteção falhou - Ainda no Harbor');
        }
        
      } else {
        console.log('❌ Logout falhou - Não foi redirecionado para Quarter');
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

testLogoutFinal().catch(console.error); 