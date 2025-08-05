const puppeteer = require("puppeteer");

async function testFluxoHarbor() {
  console.log("🚀 Iniciando teste do fluxo Harbor...");
  
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
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("📍 URL atual:", page.url());
    
    // Verificar se foi redirecionado para Quarter
    if (page.url().includes("localhost:3700")) {
      console.log("✅ Redirecionamento para Quarter funcionou");
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("📝 Preenchendo formulário...");
      await page.type("input[type=\"email\"]", "admin@canonika.io");
      await page.type("input[type=\"password\"]", "admin123");
      
      console.log("🖱️ Clicando no botão de login...");
      await page.click("button[type=\"submit\"]");
      
      // Aguardar mais tempo para o redirecionamento
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      console.log("📍 URL após login:", page.url());
      
      if (page.url().includes("localhost:3701")) {
        console.log("✅ Fluxo completo funcionou!");
        
        // Verificar cookies
        const cookies = await page.cookies();
        console.log("🍪 Cookies encontrados:", cookies.length);
        
        const authCookie = cookies.find(c => c.name === "canonika_authenticated");
        const tokenCookie = cookies.find(c => c.name === "canonika_token");
        
        console.log("🍪 Cookie de autenticação:", authCookie ? "Encontrado" : "Não encontrado");
        console.log("🍪 Cookie de token:", tokenCookie ? "Encontrado" : "Não encontrado");
        
        // Verificar se a página carregou corretamente
        const pageTitle = await page.title();
        console.log("📄 Título da página:", pageTitle);
        
        // Verificar se há elementos do Harbor
        const harborElements = await page.$$('.canonika-header, .canonika-sidebar, .canonika-main');
        console.log("🏗️ Elementos do Harbor encontrados:", harborElements.length);
        
        if (harborElements.length > 0) {
          console.log("✅ Harbor carregado corretamente!");
        } else {
          console.log("❌ Harbor não carregou corretamente");
        }
        
      } else {
        console.log("❌ Não foi redirecionado para Harbor após login");
        console.log("📍 URL atual:", page.url());
      }
    } else {
      console.log("❌ Não foi redirecionado para Quarter");
      console.log("📍 URL atual:", page.url());
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await browser.close();
    console.log("🏁 Teste finalizado");
  }
}

testFluxoHarbor(); 