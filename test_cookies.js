const puppeteer = require("puppeteer");

async function testCookies() {
  console.log("🍪 Testando cookies...");
  
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
    
    // Verificar cookies antes do login
    let cookies = await page.cookies();
    console.log("🍪 Cookies antes do login:", cookies.length);
    cookies.forEach(c => console.log(`  - ${c.name}: ${c.value.substring(0, 20)}...`));
    
    // Fazer login
    console.log("📝 Fazendo login...");
    await page.type("input[type=\"email\"]", "admin@canonika.io");
    await page.type("input[type=\"password\"]", "admin123");
    await page.click("button[type=\"submit\"]");
    
    // Aguardar redirecionamento
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar cookies após login
    cookies = await page.cookies();
    console.log("🍪 Cookies após login:", cookies.length);
    cookies.forEach(c => console.log(`  - ${c.name}: ${c.value.substring(0, 20)}...`));
    
    // Verificar URL atual
    const currentUrl = await page.url();
    console.log("📍 URL atual:", currentUrl);
    
    // Se foi redirecionado para Harbor, verificar se os cookies persistem
    if (currentUrl.includes("localhost:3701")) {
      console.log("✅ Redirecionado para Harbor, verificando cookies...");
      
      // Aguardar um pouco para o Harbor carregar
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      cookies = await page.cookies();
      console.log("🍪 Cookies no Harbor:", cookies.length);
      cookies.forEach(c => console.log(`  - ${c.name}: ${c.value.substring(0, 20)}...`));
      
      // Verificar se o Harbor detecta autenticação
      const authCookie = cookies.find(c => c.name === "canonika_authenticated");
      const tokenCookie = cookies.find(c => c.name === "canonika_token");
      
      console.log("🍪 Cookie de autenticação:", authCookie ? "Encontrado" : "Não encontrado");
      console.log("🍪 Cookie de token:", tokenCookie ? "Encontrado" : "Não encontrado");
      
      if (authCookie && tokenCookie) {
        console.log("✅ Cookies encontrados! Harbor deve reconhecer autenticação.");
      } else {
        console.log("❌ Cookies não encontrados!");
      }
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await browser.close();
    console.log("🏁 Teste finalizado");
  }
}

testCookies(); 