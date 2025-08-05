const puppeteer = require('puppeteer');

async function testRoutesImport() {
  console.log('🔍 Testando importação do routes.js...');
  
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
    
    // Verificar se há algum erro específico na importação
    const importCheck = await page.evaluate(() => {
      if (window.app) {
        console.log('App Vue encontrado');
        
        // Verificar se há algum erro específico
        if (window.importError) {
          console.log('Erro de importação:', window.importError);
        }
        
        if (window.routerError) {
          console.log('Erro do router:', window.routerError);
        }
        
        // Tentar criar um router simples para testar
        try {
          if (typeof window.VueRouter !== 'undefined') {
            console.log('VueRouter disponível');
            
            const testRouter = window.VueRouter.createRouter({
              history: window.VueRouter.createWebHistory(),
              routes: []
            });
            
            console.log('Router de teste criado com sucesso');
            return { success: true, error: null };
          } else {
            console.log('VueRouter não disponível');
            return { success: false, error: 'VueRouter não disponível' };
          }
        } catch (error) {
          console.log('Erro ao criar router de teste:', error.message);
          return { success: false, error: error.message };
        }
      } else {
        console.log('App Vue não encontrado');
        return { success: false, error: 'App Vue não encontrado' };
      }
    });
    
    console.log('🔍 Verificação de importação:', importCheck);
    
    // Se o VueRouter não está disponível, verificar se há algum erro no build
    if (!importCheck.success) {
      console.log('🔍 Verificando se há erro no build...');
      
      const buildCheck = await page.evaluate(() => {
        // Verificar se há algum erro no console
        const errors = [];
        
        // Interceptar erros de módulo
        window.addEventListener('error', (event) => {
          if (event.filename && event.filename.includes('index-')) {
            errors.push({
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            });
          }
        });
        
        // Verificar se há algum erro específico
        if (window.moduleError) {
          errors.push({ message: window.moduleError });
        }
        
        return errors;
      });
      
      console.log('🔍 Erros do build:', buildCheck);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('🏁 Teste finalizado');
}

testRoutesImport(); 