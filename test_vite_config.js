const puppeteer = require('puppeteer');

async function testViteConfig() {
  console.log('🔍 Testando configuração do Vite...');
  
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
    
    // Verificar se há algum erro específico na configuração do Vite
    const viteConfigCheck = await page.evaluate(() => {
      console.log('Verificando configuração do Vite...');
      
      // Verificar se há algum erro específico na configuração
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
      
      // Verificar se há algum erro específico na configuração do Vite
      if (window.viteConfigError) {
        console.log('Erro na configuração do Vite:', window.viteConfigError);
        errors.push({ message: window.viteConfigError });
      }
      
      // Verificar se há algum erro específico no build
      if (window.buildError) {
        console.log('Erro no build:', window.buildError);
        errors.push({ message: window.buildError });
      }
      
      // Verificar se há algum erro específico na importação
      if (window.importError) {
        console.log('Erro na importação:', window.importError);
        errors.push({ message: window.importError });
      }
      
      // Verificar se há algum erro específico na compilação
      if (window.compilationError) {
        console.log('Erro na compilação:', window.compilationError);
        errors.push({ message: window.compilationError });
      }
      
      return {
        errors: errors
      };
    });
    
    console.log('🔍 Verificação da configuração do Vite:', viteConfigCheck);
    
    // Se há erros, tentar recarregar a página
    if (viteConfigCheck.errors.length > 0) {
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

testViteConfig(); 