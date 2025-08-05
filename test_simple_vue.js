const puppeteer = require('puppeteer');

async function testSimpleVue() {
  console.log('🔍 Testando Vue simples...');
  
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
    
    // Verificar se há erros no console
    const consoleLogs = await page.evaluate(() => {
      return window.consoleLogs || [];
    });
    
    console.log('🔍 Logs do console:', consoleLogs);
    
    // Verificar se o elemento #app existe
    const appElement = await page.$('#app');
    if (appElement) {
      console.log('✅ Elemento #app encontrado');
    } else {
      console.log('❌ Elemento #app não encontrado');
    }
    
    // Verificar se há algum script carregado
    const scripts = await page.$$('script');
    console.log('🔍 Scripts encontrados:', scripts.length);
    
    // Verificar se há algum erro de rede
    const networkErrors = await page.evaluate(() => {
      return window.networkErrors || [];
    });
    
    console.log('🔍 Erros de rede:', networkErrors);
    
    // Verificar se o Vue está disponível globalmente
    const vueAvailable = await page.evaluate(() => {
      return typeof window.Vue !== 'undefined';
    });
    
    console.log('🔍 Vue disponível globalmente:', vueAvailable);
    
    // Verificar se há algum erro de JavaScript
    const jsErrors = await page.evaluate(() => {
      return window.jsErrors || [];
    });
    
    console.log('🔍 Erros JavaScript:', jsErrors);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testSimpleVue(); 