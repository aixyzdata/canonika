const puppeteer = require('puppeteer');

async function testNewAuthFlow() {
  console.log('🔄 Testando nova arquitetura de autenticação OAuth-like...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    
    // 1. Acessar Harbor diretamente (deve redirecionar para Quarter)
    console.log('\n📍 Passo 1: Acessando Harbor diretamente...');
    await page.goto('http://localhost:3701', { waitUntil: 'networkidle0' });
    
    // Aguardar um pouco para ver o redirecionamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);
    
    if (currentUrl.includes('localhost:3700')) {
      console.log('✅ Redirecionamento para Quarter funcionando!');
      
      // 2. Fazer login no Quarter
      console.log('\n📍 Passo 2: Fazendo login no Quarter...');
      await page.waitForSelector('.login-form', { timeout: 10000 });
      
      await page.type('input[type="email"]', 'admin@canonika.io');
      await page.type('input[type="password"]', 'admin123');
      await page.click('.login-btn');
      
      // Aguardar redirecionamento de volta para Harbor
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const harborUrl = page.url();
      console.log('📍 URL após login:', harborUrl);
      
      if (harborUrl.includes('localhost:3701')) {
        console.log('✅ Redirecionamento de volta para Harbor funcionando!');
        
        // 3. Verificar se Harbor carregou com autenticação
        console.log('\n📍 Passo 3: Verificando Harbor autenticado...');
        await page.waitForSelector('.canonika-header', { timeout: 10000 });
        console.log('✅ Harbor carregado com sucesso');
        
        // Verificar se há informações do usuário
        const userInfo = await page.evaluate(() => {
          const userElement = document.querySelector('.user-name');
          return userElement ? userElement.textContent : null;
        });
        
        console.log('👤 Informações do usuário:', userInfo);
        
        // 4. Verificar se há token na URL
        const urlParams = new URLSearchParams(harborUrl.split('?')[1] || '');
        const authToken = urlParams.get('auth_token');
        
        if (authToken) {
          console.log('🔑 Token de autenticação encontrado na URL');
        } else {
          console.log('⚠️ Token não encontrado na URL');
        }
        
        // 5. Testar logout
        console.log('\n📍 Passo 4: Testando logout...');
        const logoutButton = await page.$('.logout-btn');
        if (logoutButton) {
          console.log('✅ Botão de logout encontrado');
          await logoutButton.click();
          
          // Aguardar redirecionamento para Quarter
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const logoutUrl = page.url();
          console.log('📍 URL após logout:', logoutUrl);
          
          if (logoutUrl.includes('localhost:3700')) {
            console.log('✅ Logout funcionando - redirecionado para Quarter');
          } else {
            console.log('❌ Logout não redirecionou para Quarter');
          }
        } else {
          console.log('❌ Botão de logout não encontrado');
        }
        
      } else {
        console.log('❌ Falha no redirecionamento para Harbor');
      }
      
    } else {
      console.log('❌ Não foi redirecionado para Quarter');
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
testNewAuthFlow().catch(console.error); 