const puppeteer = require('puppeteer');

async function testarAutenticacaoSimples() {
    console.log('🧪 TESTE SIMPLES DE AUTENTICAÇÃO');
    console.log('==================================');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        slowMo: 500,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        console.log('\n1️⃣ Acessando Quarter diretamente...');
        
        // Acessar Quarter diretamente
        await page.goto('http://localhost:3700/?redirect_to=http%3A%2F%2Flocalhost%3A3701%2F', { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });
        
        console.log(`📍 URL atual: ${page.url()}`);
        
        // Verificar se foi redirecionado automaticamente
        if (page.url().includes('localhost:3701')) {
            console.log('✅ SUCCESS: Autenticação persistiu! Usuário foi redirecionado automaticamente.');
            console.log('🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!');
        } else if (page.url().includes('localhost:3700')) {
            console.log('ℹ️  Usuário não está autenticado, mostrando tela de login.');
            console.log('Isso é normal se você ainda não fez login.');
        } else {
            console.log('❌ ERROR: URL inesperada');
        }
        
        // Aguardar um pouco para visualizar
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

testarAutenticacaoSimples(); 