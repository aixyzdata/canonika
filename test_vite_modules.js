const puppeteer = require('puppeteer');

async function testViteModules() {
  console.log('🔍 Testando resolução de módulos do Vite...');
  
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
    
    // Verificar se há algum erro específico na resolução de módulos
    const viteModulesCheck = await page.evaluate(() => {
      console.log('Verificando resolução de módulos do Vite...');
      
      // Verificar se há algum erro específico na resolução de módulos
      const errors = [];
      
      // Interceptar erros
      window.addEventListener('error', (event) => {
        errors.push({
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });
      
      // Verificar se há algum erro específico na resolução de módulos
      if (window.viteModuleResolutionError) {
        console.log('Erro na resolução de módulos do Vite:', window.viteModuleResolutionError);
        errors.push({ message: window.viteModuleResolutionError });
      }
      
      // Verificar se há algum erro específico na importação de módulos
      if (window.viteModuleImportError) {
        console.log('Erro na importação de módulos do Vite:', window.viteModuleImportError);
        errors.push({ message: window.viteModuleImportError });
      }
      
      // Verificar se há algum erro específico na compilação de módulos
      if (window.viteModuleCompilationError) {
        console.log('Erro na compilação de módulos do Vite:', window.viteModuleCompilationError);
        errors.push({ message: window.viteModuleCompilationError });
      }
      
      // Verificar se há algum erro específico na bundling de módulos
      if (window.viteModuleBundlingError) {
        console.log('Erro no bundling de módulos do Vite:', window.viteModuleBundlingError);
        errors.push({ message: window.viteModuleBundlingError });
      }
      
      return {
        errors: errors
      };
    });
    
    console.log('🔍 Verificação de resolução de módulos do Vite:', viteModulesCheck);
    
    // Se há erros, tentar recarregar a página
    if (viteModulesCheck.errors.length > 0) {
      console.log('🔍 Erros encontrados, tentando recarregar a página...');
      
      await page.reload({ waitUntil: 'networkidle2' });
      
      // Aguardar um pouco para carregar
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar se os erros persistem
      const reloadCheck = await page.evaluate(() => {
        console.log('Verificando após recarregar...');
        
        // Verificar se o Vue está disponível
        if (typeof window.Vue !== 'undefined') {
          console.log('Vue disponível após recarregar');
          return { vueAvailable: true };
        } else {
          console.log('Vue não disponível após recarregar');
          return { vueAvailable: false };
        }
      });
      
      console.log('🔍 Verificação após recarregar:', reloadCheck);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testViteModules(); 