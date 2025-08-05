const puppeteer = require("puppeteer");

async function testHarborSemAuth() {
  console.log("🔓 Testando Harbor sem autenticação...");
  
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
      waitUntil: "networkidle2",
      timeout: 30000 
    });
    
    // Aguardar um pouco para carregar
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = await page.url();
    console.log("📍 URL atual:", currentUrl);
    
    // Verificar se ainda está no Harbor
    if (currentUrl.includes("localhost:3701")) {
      console.log("✅ Harbor carregou sem redirecionamento!");
      
      // Verificar se há elementos do Harbor
      const harborElements = await page.$$('.canonika-header, .canonika-sidebar, .canonika-main');
      console.log("🏗️ Elementos do Harbor encontrados:", harborElements.length);
      
      if (harborElements.length > 0) {
        console.log("✅ Harbor carregou corretamente!");
        
        // Verificar se há menu de serviços
        const serviceMenu = await page.$$('.service-card, .service-item');
        console.log("📋 Itens de menu encontrados:", serviceMenu.length);
        
        // Verificar se há header
        const header = await page.$('.canonika-header');
        if (header) {
          console.log("✅ Header encontrado!");
        } else {
          console.log("❌ Header não encontrado");
        }
        
        // Verificar se há sidebar
        const sidebar = await page.$('.canonika-sidebar');
        if (sidebar) {
          console.log("✅ Sidebar encontrada!");
        } else {
          console.log("❌ Sidebar não encontrada");
        }
        
        // Verificar se há main content
        const main = await page.$('.canonika-main');
        if (main) {
          console.log("✅ Main content encontrado!");
        } else {
          console.log("❌ Main content não encontrado");
        }
        
        // Aguardar mais um pouco para verificar se não há loop
        await new Promise(resolve => setTimeout(resolve, 10000));
        const finalUrl = await page.url();
        console.log("📍 URL após 10 segundos:", finalUrl);
        
        if (finalUrl.includes("localhost:3701")) {
          console.log("✅ Harbor estável - sem loop!");
          console.log("🎉 MASTERPAGE FUNCIONANDO CORRETAMENTE!");
        } else {
          console.log("❌ Possível loop detectado!");
        }
        
      } else {
        console.log("❌ Harbor não carregou corretamente");
      }
    } else {
      console.log("❌ Harbor redirecionou para:", currentUrl);
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await browser.close();
    console.log("🏁 Teste finalizado");
  }
}

testHarborSemAuth(); 