const puppeteer = require('puppeteer');

async function testarAutenticacaoCompleta() {
    console.log('🧪 TESTE DE AUTENTICAÇÃO COMPLETA');
    console.log('====================================');
    
    const browser = await puppeteer.launch({ 
        headless: false, // Mostrar navegador para debug
        slowMo: 1000, // Desacelerar para visualizar
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        console.log('\n1️⃣ Acessando Harbor (3701)...');
        
        // Acessar Harbor
        await page.goto('http://localhost:3701/', { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });
        
        console.log(`📍 URL atual: ${page.url()}`);
        
        // Verificar se foi redirecionado para Quarter
        if (page.url().includes('localhost:3700')) {
            console.log('✅ SUCCESS: Redirecionamento para Quarter funcionou!');
            
            console.log('\n2️⃣ Fazendo login no Quarter...');
            
            // Aguardar elementos do formulário
            await page.waitForSelector('input[type="email"]', { timeout: 5000 });
            await page.waitForSelector('input[type="password"]', { timeout: 5000 });
            
            // Preencher formulário
            await page.type('input[type="email"]', 'admin@canonika.io');
            await page.type('input[type="password"]', 'admin123');
            
            // Clicar no botão de login
            await page.click('button[type="submit"]');
            
            // Aguardar redirecionamento
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
            
            console.log(`📍 URL após login: ${page.url()}`);
            
            if (page.url().includes('localhost:3701')) {
                console.log('✅ SUCCESS: Redirecionamento de volta para Harbor funcionou!');
                
                console.log('\n3️⃣ Testando persistência da autenticação...');
                
                // Aguardar um pouco
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Tentar acessar Quarter novamente
                console.log('\n4️⃣ Acessando Quarter novamente para testar persistência...');
                await page.goto('http://localhost:3700/?redirect_to=http%3A%2F%2Flocalhost%3A3701%2F', { 
                    waitUntil: 'networkidle0',
                    timeout: 10000 
                });
                
                console.log(`📍 URL após acesso direto ao Quarter: ${page.url()}`);
                
                if (page.url().includes('localhost:3701')) {
                    console.log('✅ SUCCESS: Autenticação persistiu! Usuário foi redirecionado automaticamente.');
                } else if (page.url().includes('localhost:3700')) {
                    console.log('❌ ERROR: Autenticação não persistiu. Usuário vê tela de login.');
                } else {
                    console.log('❌ ERROR: URL inesperada após teste de persistência.');
                }
                
            } else {
                console.log('❌ ERROR: Não foi redirecionado de volta para Harbor');
                console.log(`URL atual: ${page.url()}`);
            }
        } else if (page.url().includes('localhost:3701')) {
            console.log('✅ SUCCESS: Usuário já está autenticado, permanecendo no Harbor');
            
            console.log('\n2️⃣ Testando persistência da autenticação...');
            
            // Tentar acessar Quarter diretamente
            console.log('\n3️⃣ Acessando Quarter para testar persistência...');
            await page.goto('http://localhost:3700/?redirect_to=http%3A%2F%2Flocalhost%3A3701%2F', { 
                waitUntil: 'networkidle0',
                timeout: 10000 
            });
            
            console.log(`📍 URL após acesso direto ao Quarter: ${page.url()}`);
            
            if (page.url().includes('localhost:3701')) {
                console.log('✅ SUCCESS: Autenticação persistiu! Usuário foi redirecionado automaticamente.');
            } else if (page.url().includes('localhost:3700')) {
                console.log('❌ ERROR: Autenticação não persistiu. Usuário vê tela de login.');
            } else {
                console.log('❌ ERROR: URL inesperada após teste de persistência.');
            }
        } else {
            console.log('❌ ERROR: URL inesperada');
        }
        
        // Aguardar um pouco para visualizar
        console.log('\n⏳ Aguardando 5 segundos para visualização...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
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

testarAutenticacaoCompleta(); 