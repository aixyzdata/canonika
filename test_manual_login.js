const puppeteer = require("puppeteer");

async function testManualLogin() {
  console.log("🔍 Iniciando teste de login manual...");
  
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
    
    console.log("📍 Navegando para Quarter...");
    await page.goto("http://localhost:3700", { 
      waitUntil: "networkidle2",
      timeout: 30000 
    });
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 3000));
    let currentUrl = await page.url();
    console.log("📍 URL atual:", currentUrl);
    
    // Verificar se há formulário de login
    const loginForm = await page.$('form');
    if (loginForm) {
      console.log("✅ Formulário de login encontrado");
      
      // Preencher formulário
      console.log("📝 Preenchendo formulário...");
      await page.type("input[type=\"email\"]", "admin@canonika.io");
      await page.type("input[type=\"password\"]", "admin123");
      
      console.log("🖱️ Clicando no botão de login...");
      await page.click("button[type=\"submit\"]");
      
      // Aguardar redirecionamento
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      currentUrl = await page.url();
      console.log("📍 URL após login:", currentUrl);
      
      if (currentUrl.includes("localhost:3701")) {
        console.log("✅ Login bem-sucedido! Redirecionado para Harbor.");
        
        // Verificar cookies
        const cookies = await page.cookies();
        console.log("🍪 Cookies encontrados:", cookies.length);
        
        const authCookie = cookies.find(c => c.name === "canonika_authenticated");
        const tokenCookie = cookies.find(c => c.name === "canonika_token");
        
        console.log("🍪 Cookie de autenticação:", authCookie ? "Encontrado" : "Não encontrado");
        console.log("🍪 Cookie de token:", tokenCookie ? "Encontrado" : "Não encontrado");
        
        // Agora testar se o Harbor funciona com os cookies
        console.log("📍 Testando Harbor com cookies...");
        await page.goto("http://localhost:3701", { 
          waitUntil: "networkidle2",
          timeout: 30000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        currentUrl = await page.url();
        console.log("📍 URL no Harbor:", currentUrl);
        
        if (currentUrl.includes("localhost:3701")) {
          console.log("✅ Harbor carregou corretamente com cookies!");
          
          // Verificar se há elementos do Harbor
          const harborElements = await page.$$('.canonika-header, .canonika-sidebar, .canonika-main');
          console.log("🏗️ Elementos do Harbor encontrados:", harborElements.length);
          
          if (harborElements.length > 0) {
            console.log("✅ Harbor funcionando perfeitamente!");
          } else {
            console.log("❌ Harbor não carregou corretamente");
          }
        } else {
          console.log("❌ Harbor redirecionou novamente para Quarter");
        }
        
      } else {
        console.log("❌ Não foi redirecionado para Harbor após login");
        console.log("📍 URL atual:", currentUrl);
      }
    } else {
      console.log("❌ Formulário de login não encontrado");
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await browser.close();
    console.log("🏁 Teste finalizado");
  }
}

testManualLogin(); 