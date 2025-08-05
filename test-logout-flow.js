const puppeteer = require('puppeteer');

async function testLogoutFlow() {
  console.log('🚪 Testando fluxo de logout...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Fazer login primeiro
    console.log('\n📍 Passo 1: Fazendo login...');
    await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.login-form', { timeout: 10000 });
    
    // Login com credenciais pré-preenchidas
    await page.click('.login-btn');
    
    // Aguardar redirecionamento para Harbor
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const harborUrl = page.url();
    console.log('📍 URL após login:', harborUrl);
    
    if (harborUrl.includes('localhost:3701')) {
      console.log('✅ Login bem-sucedido, agora testando logout...');
      
      // 2. Verificar se está autenticado no Harbor
      await page.waitForSelector('.canonika-header', { timeout: 10000 });
      console.log('✅ Harbor carregado com autenticação');
      
      // Verificar se há informações do usuário
      const userInfo = await page.evaluate(() => {
        const userElement = document.querySelector('.user-name');
        return userElement ? userElement.textContent : null;
      });
      
      console.log('👤 Usuário logado:', userInfo);
      
      // 3. Testar logout
      console.log('\n📍 Passo 2: Testando logout...');
      const logoutButton = await page.$('.logout-btn');
      
      if (logoutButton) {
        console.log('✅ Botão de logout encontrado, clicando...');
        await logoutButton.click();
        
        // Aguardar redirecionamento para Quarter
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const logoutUrl = page.url();
        console.log('📍 URL após logout:', logoutUrl);
        
        if (logoutUrl.includes('localhost:3700')) {
          console.log('✅ Logout funcionando - redirecionado para Quarter');
          
          // 4. Verificar se a sessão foi limpa
          console.log('\n📍 Passo 3: Verificando se sessão foi limpa...');
          
          // Tentar acessar Harbor novamente
          await page.goto('http://localhost:3701', { waitUntil: 'networkidle0' });
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const redirectUrl = page.url();
          console.log('📍 URL ao tentar acessar Harbor:', redirectUrl);
          
          if (redirectUrl.includes('localhost:3700')) {
            console.log('✅ Sessão limpa corretamente - redirecionado para login');
          } else {
            console.log('❌ Sessão não foi limpa - ainda autenticado');
          }
          
        } else {
          console.log('❌ Logout não redirecionou para Quarter');
        }
        
      } else {
        console.log('❌ Botão de logout não encontrado');
      }
      
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
testLogoutFlow().catch(console.error); 