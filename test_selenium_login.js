const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testSeleniumLogin() {
  console.log('🚀 Iniciando teste Selenium...');
  
  // Configurar Chrome
  const options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-web-security');
  options.addArguments('--disable-features=VizDisplayCompositor');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  try {
    console.log('📍 Navegando para Harbor...');
    await driver.get('http://localhost:3701');
    
    // Aguardar um pouco para ver se redireciona
    await driver.sleep(3000);
    
    let currentUrl = await driver.getCurrentUrl();
    console.log('📍 URL atual:', currentUrl);
    
    // Se foi redirecionado para Quarter, fazer login
    if (currentUrl.includes('localhost:3700')) {
      console.log('✅ Redirecionado para Quarter, fazendo login...');
      
      // Aguardar formulário de login
      await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
      
      // Preencher formulário
      const emailInput = await driver.findElement(By.css('input[type="email"]'));
      const passwordInput = await driver.findElement(By.css('input[type="password"]'));
      
      await emailInput.clear();
      await emailInput.sendKeys('admin@canonika.io');
      
      await passwordInput.clear();
      await passwordInput.sendKeys('admin123');
      
      console.log('🖱️ Clicando no botão de login...');
      const loginButton = await driver.findElement(By.css('button[type="submit"]'));
      await loginButton.click();
      
      // Aguardar redirecionamento
      await driver.sleep(5000);
      
      currentUrl = await driver.getCurrentUrl();
      console.log('📍 URL após login:', currentUrl);
      
      if (currentUrl.includes('localhost:3701')) {
        console.log('✅ Login bem-sucedido! Harbor carregado.');
        
        // Verificar se a página carregou corretamente
        const pageTitle = await driver.getTitle();
        console.log('📄 Título da página:', pageTitle);
        
        // Verificar se há elementos do Harbor
        const harborElements = await driver.findElements(By.css('.canonika-header, .canonika-sidebar, .canonika-main'));
        console.log('🏗️ Elementos do Harbor encontrados:', harborElements.length);
        
        if (harborElements.length > 0) {
          console.log('✅ Harbor carregado corretamente!');
          
          // Aguardar mais um pouco para verificar se não há loop
          await driver.sleep(10000);
          currentUrl = await driver.getCurrentUrl();
          console.log('📍 URL após 10 segundos:', currentUrl);
          
          if (currentUrl.includes('localhost:3701')) {
            console.log('✅ Não há loop de redirecionamento!');
            console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!');
          } else {
            console.log('❌ Detectado loop de redirecionamento!');
          }
        } else {
          console.log('❌ Harbor não carregou corretamente');
        }
      } else {
        console.log('❌ Não foi redirecionado para Harbor após login');
        console.log('📍 URL atual:', currentUrl);
      }
    } else {
      console.log('❌ Não foi redirecionado para Quarter');
      console.log('📍 URL atual:', currentUrl);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await driver.quit();
    console.log('🏁 Teste finalizado');
  }
}

testSeleniumLogin(); 