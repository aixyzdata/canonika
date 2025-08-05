const puppeteer = require('puppeteer');

async function testarClickSimulation() {
    console.log('🧪 TESTE DE SIMULAÇÃO DE CLIQUE');
    console.log('==================================');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        slowMo: 1000,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        // Capturar logs do console
        page.on('console', msg => console.log('📱 CONSOLE:', msg.text()));
        
        console.log('\n1️⃣ Acessando Quarter...');
        
        // Acessar Quarter
        await page.goto('http://localhost:3700/?redirect_to=http%3A%2F%2Flocalhost%3A3701%2F', { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });
        
        console.log(`📍 URL atual: ${page.url()}`);
        
        // Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('\n2️⃣ Preenchendo formulário...');
        
        // Preencher formulário
        await page.type('input[type="email"]', 'admin@canonika.io');
        await page.type('input[type="password"]', 'admin123');
        
        console.log('✅ Formulário preenchido');
        
        // Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('\n3️⃣ Testando diferentes formas de clique...');
        
        // Teste 1: Clique direto no botão
        console.log('\n3.1️⃣ Clique direto no botão...');
        await page.click('button[type="submit"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Teste 2: Clique via JavaScript
        console.log('\n3.2️⃣ Clique via JavaScript...');
        await page.evaluate(() => {
            const button = document.querySelector('button[type="submit"]');
            if (button) {
                console.log('🎯 Clicando via JavaScript...');
                button.click();
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Teste 3: Submit via JavaScript
        console.log('\n3.3️⃣ Submit via JavaScript...');
        await page.evaluate(() => {
            const form = document.querySelector('form');
            if (form) {
                console.log('🎯 Submetendo formulário via JavaScript...');
                form.submit();
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Teste 4: Disparar evento submit
        console.log('\n3.4️⃣ Disparando evento submit...');
        await page.evaluate(() => {
            const form = document.querySelector('form');
            if (form) {
                console.log('🎯 Disparando evento submit...');
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Teste 5: Disparar evento click no botão
        console.log('\n3.5️⃣ Disparando evento click no botão...');
        await page.evaluate(() => {
            const button = document.querySelector('button[type="submit"]');
            if (button) {
                console.log('🎯 Disparando evento click no botão...');
                const clickEvent = new Event('click', { bubbles: true, cancelable: true });
                button.dispatchEvent(clickEvent);
            }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`📍 URL final: ${page.url()}`);
        
        // Verificar se houve mudança
        const finalUrl = page.url();
        if (finalUrl.includes('localhost:3701')) {
            console.log('✅ SUCESSO: Redirecionamento funcionou!');
        } else {
            console.log('❌ FALHA: Não houve redirecionamento');
        }
        
        // Aguardar mais um pouco
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

testarClickSimulation(); 