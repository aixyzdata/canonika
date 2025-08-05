const puppeteer = require("puppeteer");

async function testSimpleDebug() {
  console.log("🔍 Iniciando debug simples...");
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Interceptar logs do console
    page.on("console", msg => {
      console.log("📱 Console:", msg.text());
    });
    
    // Interceptar requisições para debug
    page.on('request', request => {
      console.log('🌐 Request:', request.url());
    });
    
    // Interceptar respostas para debug
    page.on('response', response => {
      console.log('📡 Response:', response.url(), response.status());
    });
    
    console.log("📍 Navegando para Harbor...");
    await page.goto("http://localhost:3701", { 
      waitUntil: "networkidle2",
      timeout: 30000 
    });
    
    // Aguardar um pouco e verificar URL
    await new Promise(resolve => setTimeout(resolve, 5000));
    const currentUrl = await page.url();
    console.log("📍 URL após 5 segundos:", currentUrl);
    
    // Se ainda estiver no Harbor, verificar se há elementos
    if (currentUrl.includes("localhost:3701")) {
      console.log("✅ Ainda no Harbor - verificando elementos...");
      
      // Verificar se há elementos do Harbor
      const harborElements = await page.$$('.canonika-header, .canonika-sidebar, .canonika-main');
      console.log("🏗️ Elementos do Harbor encontrados:", harborElements.length);
      
      if (harborElements.length > 0) {
        console.log("✅ Harbor carregado corretamente!");
      } else {
        console.log("❌ Harbor não carregou corretamente");
      }
    } else if (currentUrl.includes("localhost:3700")) {
      console.log("✅ Redirecionado para Quarter");
    } else {
      console.log("❌ URL inesperada:", currentUrl);
    }
    
    // Aguardar mais um pouco para ver se há loop
    await new Promise(resolve => setTimeout(resolve, 10000));
    const finalUrl = await page.url();
    console.log("📍 URL final após 15 segundos:", finalUrl);
    
    if (finalUrl.includes("localhost:3701")) {
      console.log("✅ Harbor estável - sem loop!");
    } else {
      console.log("❌ Possível loop detectado!");
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await browser.close();
    console.log("🏁 Debug finalizado");
  }
}

testSimpleDebug(); 