const puppeteer = require('puppeteer');

async function testExplorerRestaurado() {
  console.log('🔍 Testando Explorer restaurado...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Capturar logs do console
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    
    page.on('pageerror', error => {
      console.log('Page Error:', error.message);
    });
    
    console.log('📍 Navegando para Harbor...');
    await page.goto('http://localhost:3701/', { waitUntil: 'networkidle2', timeout: 15000 });
    
    console.log('📍 URL atual:', page.url());
    
    // Aguardar um pouco para carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se o login está presente
    const loginForm = await page.$('.login-form');
    if (loginForm) {
      console.log('✅ Formulário de login encontrado');
      
      // Simular login
      console.log('🔍 Simulando login...');
      await page.evaluate(() => {
        if (window.app) {
          window.app.user = {
            id: 'admin-001',
            name: 'Administrador',
            email: 'admin@canonika.io',
            roles: ['admin']
          };
          console.log('User definido:', window.app.user);
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se o login form desapareceu
      const loginFormAfter = await page.$('.login-form');
      if (!loginFormAfter) {
        console.log('✅ Formulário de login desapareceu após login');
      } else {
        console.log('❌ Formulário de login ainda presente após login');
      }
      
      // Verificar se o sidebar apareceu
      const sidebar = await page.$('.sidebar');
      if (sidebar) {
        console.log('✅ Sidebar apareceu após login');
      } else {
        console.log('❌ Sidebar não apareceu após login');
      }
      
      // Navegar para o Explorer
      console.log('🔍 Navegando para o Explorer...');
      await page.goto('http://localhost:3701/explorer', { waitUntil: 'networkidle2', timeout: 15000 });
      
      console.log('📍 URL atual:', page.url());
      
      // Aguardar um pouco para carregar
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar se o Explorer carregou
      const explorerContent = await page.$('.explorer-content');
      if (explorerContent) {
        console.log('✅ Conteúdo do Explorer carregou');
        
        // Verificar se há a barra de pesquisa
        const searchInput = await page.$('.search-input');
        if (searchInput) {
          console.log('✅ Barra de pesquisa encontrada');
        } else {
          console.log('❌ Barra de pesquisa não encontrada');
        }
        
        // Verificar se há botões de ação
        const searchButton = await page.$('.search-button');
        if (searchButton) {
          console.log('✅ Botão de pesquisa encontrado');
        } else {
          console.log('❌ Botão de pesquisa não encontrado');
        }
        
        // Verificar se há histórico
        const historySection = await page.$('.history-section');
        if (historySection) {
          console.log('✅ Seção de histórico encontrada');
        } else {
          console.log('❌ Seção de histórico não encontrada');
        }
        
        // Verificar se há logo do Explorer
        const explorerLogo = await page.$('.explorer-logo');
        if (explorerLogo) {
          console.log('✅ Logo do Explorer encontrada');
        } else {
          console.log('❌ Logo do Explorer não encontrada');
        }
        
        // Verificar se há subtítulo
        const explorerSubtitle = await page.$('.explorer-subtitle');
        if (explorerSubtitle) {
          console.log('✅ Subtítulo do Explorer encontrado');
        } else {
          console.log('❌ Subtítulo do Explorer não encontrado');
        }
        
        // Testar pesquisa
        console.log('🔍 Testando pesquisa...');
        await page.type('.search-input', 'produto teste');
        await page.click('.search-button');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se apareceram resultados
        const resultsSection = await page.$('.results-section');
        if (resultsSection) {
          console.log('✅ Seção de resultados encontrada após pesquisa');
        } else {
          console.log('❌ Seção de resultados não encontrada após pesquisa');
        }
        
        // Verificar se há cartões de produtos
        const serviceCards = await page.$$('.service-card');
        if (serviceCards.length > 0) {
          console.log(`✅ ${serviceCards.length} cartões de produtos encontrados`);
        } else {
          console.log('❌ Nenhum cartão de produto encontrado');
        }
        
        // Testar clique em detalhes
        if (serviceCards.length > 0) {
          console.log('🔍 Testando clique em detalhes...');
          const detailButton = await serviceCards[0].$('.btn-primary');
          if (detailButton) {
            await detailButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar se o chat do Diver apareceu
            const diverChat = await page.$('.diver-chat');
            if (diverChat) {
              console.log('✅ Chat do Diver apareceu após clique em detalhes');
            } else {
              console.log('❌ Chat do Diver não apareceu após clique em detalhes');
            }
          } else {
            console.log('❌ Botão de detalhes não encontrado');
          }
        }
        
      } else {
        console.log('❌ Conteúdo do Explorer não carregou');
        
        // Verificar se há algum erro
        const errorElement = await page.$('.error');
        if (errorElement) {
          const errorText = await page.evaluate(el => el.textContent, errorElement);
          console.log('❌ Erro encontrado:', errorText);
        }
      }
      
    } else {
      console.log('❌ Formulário de login não encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testExplorerRestaurado(); 