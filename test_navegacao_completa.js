const puppeteer = require('puppeteer');

async function testarFluxoCompleto() {
    console.log('🧪 INICIANDO TESTE DE NAVEGAÇÃO COMPLETA');
    console.log('==========================================');
    
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
        
        // Tentar acessar Harbor
        try {
            await page.goto('http://localhost:3701/', { 
                waitUntil: 'networkidle0',
                timeout: 10000 
            });
        } catch (error) {
            console.log('⚠️  Erro ao acessar Harbor, tentando novamente...');
            await page.goto('http://localhost:3701/', { 
                waitUntil: 'domcontentloaded',
                timeout: 10000 
            });
        }
        
        // Verificar se foi redirecionado para Quarter
        const currentUrl = page.url();
        console.log(`📍 URL atual: ${currentUrl}`);
        
        if (currentUrl.includes('localhost:3700')) {
            console.log('✅ SUCCESS: Redirecionamento para Quarter funcionou!');
        } else if (currentUrl.includes('localhost:3701')) {
            console.log('✅ SUCCESS: Permaneceu no Harbor (usuário pode estar autenticado)');
        } else {
            console.log('❌ ERROR: URL inesperada');
            console.log('🔍 Verificando se há usuário logado...');
            
            try {
                // Verificar se há localStorage com autenticação
                const isAuthenticated = await page.evaluate(() => {
                    try {
                        return localStorage.getItem('canonika_authenticated') === 'true';
                    } catch (e) {
                        return false;
                    }
                });
                
                if (isAuthenticated) {
                    console.log('✅ Usuário já está autenticado, permanecendo no Harbor');
                } else {
                    console.log('❌ Usuário não autenticado e não foi redirecionado');
                    console.log('🔍 Verificando se há JavaScript de redirecionamento...');
                    
                    // Verificar se há código de redirecionamento
                    const hasRedirectCode = await page.evaluate(() => {
                        return document.body.innerHTML.includes('redirectToQuarter') || 
                               document.body.innerHTML.includes('window.location.href');
                    });
                    
                    if (hasRedirectCode) {
                        console.log('✅ Código de redirecionamento encontrado no HTML');
                    } else {
                        console.log('❌ Código de redirecionamento não encontrado');
                    }
                }
            } catch (error) {
                console.log('⚠️  Erro ao verificar localStorage:', error.message);
            }
        }
        
        // Se estamos no Quarter, fazer login
        if (currentUrl.includes('localhost:3700')) {
            console.log('\n2️⃣ Fazendo login no Quarter...');
            
            try {
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
                } else {
                    console.log('❌ ERROR: Não foi redirecionado de volta para Harbor');
                    console.log(`URL atual: ${page.url()}`);
                }
            } catch (error) {
                console.log('❌ Erro durante login:', error.message);
            }
        }
        
        // Verificar conteúdo do Harbor
        console.log('\n3️⃣ Verificando conteúdo do Harbor...');
        
        // Aguardar carregamento completo
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        try {
            // Verificar se há elementos do Harbor
            const harborElements = await page.evaluate(() => {
                const elements = {
                    hasTitle: !!document.querySelector('title'),
                    titleText: document.querySelector('title')?.textContent,
                    hasApp: !!document.querySelector('#app'),
                    hasHeader: !!document.querySelector('.canonika-header'),
                    hasSidebar: !!document.querySelector('.canonika-sidebar'),
                    hasContent: !!document.querySelector('.canonika-view'),
                    hasBody: !!document.querySelector('body'),
                    bodyText: document.querySelector('body')?.textContent?.substring(0, 100)
                };
                
                return elements;
            });
            
            console.log('📊 Elementos encontrados no Harbor:');
            console.log(`- Título: ${harborElements.titleText}`);
            console.log(`- #app: ${harborElements.hasApp ? '✅' : '❌'}`);
            console.log(`- Header: ${harborElements.hasHeader ? '✅' : '❌'}`);
            console.log(`- Sidebar: ${harborElements.hasSidebar ? '✅' : '❌'}`);
            console.log(`- Content: ${harborElements.hasContent ? '✅' : '❌'}`);
            console.log(`- Body: ${harborElements.hasBody ? '✅' : '❌'}`);
            
            if (harborElements.bodyText) {
                console.log(`- Texto inicial: ${harborElements.bodyText}...`);
            }
            
        } catch (error) {
            console.log('❌ Erro ao verificar elementos:', error.message);
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

testarFluxoCompleto(); 