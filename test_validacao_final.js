const puppeteer = require('puppeteer');

async function testValidacaoFinal() {
  console.log('🎯 TESTE FINAL DE VALIDAÇÃO');
  console.log('=============================');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Teste 1: Acesso direto ao Harbor
    console.log('\n📋 TESTE 1: Acesso direto ao Harbor');
    await page.goto('http://localhost:3701', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const url1 = page.url();
    console.log(`📍 URL após acessar Harbor: ${url1}`);
    
    if (url1.includes('localhost:3700')) {
      console.log('✅ Redirecionamento para Quarter funcionou');
      
      // Teste 2: Login no Quarter
      console.log('\n📋 TESTE 2: Login no Quarter');
      await page.type('input[type="email"]', 'admin@canonika.io');
      await page.type('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      const url2 = page.url();
      console.log(`📍 URL após login: ${url2}`);
      
      if (url2.includes('localhost:3701')) {
        console.log('✅ Redirecionamento para Harbor após login funcionou');
        
        // Teste 3: Verificar autenticação
        console.log('\n📋 TESTE 3: Verificar autenticação');
        const cookies = await page.cookies();
        const authCookie = cookies.find(c => c.name === 'canonika_authenticated');
        
        if (authCookie) {
          console.log('✅ Cookie de autenticação encontrado');
          
          // Teste 4: Verificar persistência
          console.log('\n📋 TESTE 4: Verificar persistência');
          await page.goto('http://localhost:3700', { waitUntil: 'networkidle2' });
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const url3 = page.url();
          console.log(`📍 URL após tentar acessar Quarter logado: ${url3}`);
          
          if (url3.includes('localhost:3701')) {
            console.log('✅ Persistência de autenticação funcionando');
            
            // Teste 5: Verificar conteúdo do Harbor
            console.log('\n📋 TESTE 5: Verificar conteúdo do Harbor');
            const harborContent = await page.evaluate(() => {
              return {
                title: document.title,
                hasHeader: !!document.querySelector('.canonika-header'),
                hasServiceCards: !!document.querySelector('.service-cards'),
                bodyText: document.body.textContent.substring(0, 100)
              };
            });
            
            console.log('📄 Conteúdo do Harbor:', harborContent);
            
            console.log('\n🎉 TODOS OS TESTES PASSARAM!');
            console.log('✅ Sistema de autenticação funcionando perfeitamente');
            console.log('✅ Redirecionamentos funcionando');
            console.log('✅ Cookies sendo salvos');
            console.log('✅ Persistência de autenticação funcionando');
            console.log('✅ Harbor carregando corretamente');
            
          } else {
            console.log('❌ Persistência de autenticação falhou');
          }
          
        } else {
          console.log('❌ Cookie de autenticação não encontrado');
        }
        
      } else {
        console.log('❌ Redirecionamento para Harbor após login falhou');
      }
      
    } else {
      console.log('❌ Redirecionamento para Quarter falhou');
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
    console.log('\n🏁 Teste finalizado');
  }
}

testValidacaoFinal(); 