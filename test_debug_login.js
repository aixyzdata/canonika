const puppeteer = require('puppeteer');

async function testarDebugLogin() {
    console.log('🧪 TESTE DE DEBUG - LOGIN');
    console.log('===========================');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        slowMo: 500,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        // Capturar logs do console
        page.on('console', msg => console.log('📱 CONSOLE:', msg.text()));
        
        console.log('\n1️⃣ Acessando Quarter...');
        
        // Acessar Quarter diretamente
        await page.goto('http://localhost:3700/?redirect_to=http%3A%2F%2Flocalhost%3A3701%2F', { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });
        
        console.log(`📍 URL atual: ${page.url()}`);
        
        // Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('\n2️⃣ Preenchendo formulário...');
        
        // Preencher email
        await page.type('input[type="email"]', 'admin@canonika.io');
        console.log('✅ Email preenchido');
        
        // Preencher senha
        await page.type('input[type="password"]', 'admin123');
        console.log('✅ Senha preenchida');
        
        // Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('\n3️⃣ Clicando no botão ENTRAR...');
        
        // Clicar no botão de login
        await page.click('button[type="submit"]');
        console.log('✅ Botão clicado');
        
        // Aguardar um pouco para ver os logs
        console.log('\n4️⃣ Aguardando logs do console...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log(`📍 URL final: ${page.url()}`);
        
        // Verificar cookies
        const cookies = await page.cookies();
        console.log('\n5️⃣ Cookies encontrados:');
        cookies.forEach(cookie => {
            console.log(`- ${cookie.name}: ${cookie.value.substring(0, 50)}...`);
        });
        
        // Verificar localStorage
        const localStorage = await page.evaluate(() => {
            return {
                authenticated: localStorage.getItem('canonika_authenticated'),
                user: localStorage.getItem('canonika_user')
            };
        });
        console.log('\n6️⃣ localStorage:');
        console.log('- authenticated:', localStorage.authenticated);
        console.log('- user:', localStorage.user ? localStorage.user.substring(0, 50) + '...' : 'null');
        
        // Aguardar mais um pouco para visualizar
        console.log('\n⏳ Aguardando 3 segundos para visualização...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
    } catch (error) {
        console.error('❌ ERRO durante o teste:', error.message);
    } finally {
        await browser.close();
    }
}

// Capturar erros do console
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

testarDebugLogin(); 