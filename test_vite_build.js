const puppeteer = require('puppeteer');

async function testViteBuild() {
  console.log('🔍 Testando build do Vite...');
  
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
    
    // Verificar se há algum erro específico no build do Vite
    const viteBuildCheck = await page.evaluate(() => {
      console.log('Verificando build do Vite...');
      
      // Verificar se há algum erro específico no build
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
      
      // Verificar se há algum erro específico no build
      if (window.viteBuildError) {
        console.log('Erro no build do Vite:', window.viteBuildError);
        errors.push({ message: window.viteBuildError });
      }
      
      // Verificar se há algum erro específico na importação
      if (window.viteImportError) {
        console.log('Erro na importação do Vite:', window.viteImportError);
        errors.push({ message: window.viteImportError });
      }
      
      // Verificar se há algum erro específico na compilação
      if (window.viteCompilationError) {
        console.log('Erro na compilação do Vite:', window.viteCompilationError);
        errors.push({ message: window.viteCompilationError });
      }
      
      // Verificar se há algum erro específico na resolução de módulos
      if (window.viteModuleResolutionError) {
        console.log('Erro na resolução de módulos do Vite:', window.viteModuleResolutionError);
        errors.push({ message: window.viteModuleResolutionError });
      }
      
      return {
        errors: errors
      };
    });
    
    console.log('🔍 Verificação do build do Vite:', viteBuildCheck);
    
    // Se há erros, tentar recarregar a página
    if (viteBuildCheck.errors.length > 0) {
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

testViteBuild(); 