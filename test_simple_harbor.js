const puppeteer = require("puppeteer");

async function testSimpleHarbor() {
  console.log("🔓 Testando Harbor de forma simples...");
  
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
    
    console.log("📍 Navegando para Harbor...");
    await page.goto("http://localhost:3701", { 
      waitUntil: "domcontentloaded",
      timeout: 10000 
    });
    
    console.log("📍 URL atual:", await page.url());
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("📍 URL após 3 segundos:", await page.url());
    
    // Verificar se há elementos básicos
    const body = await page.$('body');
    if (body) {
      console.log("✅ Body encontrado");
    } else {
      console.log("❌ Body não encontrado");
    }
    
    const app = await page.$('#app');
    if (app) {
      console.log("✅ #app encontrado");
    } else {
      console.log("❌ #app não encontrado");
    }
    
    // Verificar se há elementos do Harbor
    const harborElements = await page.$$('.canonika-header, .canonika-sidebar, .canonika-main');
    console.log("🏗️ Elementos do Harbor encontrados:", harborElements.length);
    
    if (harborElements.length > 0) {
      console.log("✅ Harbor carregou corretamente!");
    } else {
      console.log("❌ Harbor não carregou corretamente");
    }
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await browser.close();
    console.log("🏁 Teste finalizado");
  }
}

testSimpleHarbor(); 