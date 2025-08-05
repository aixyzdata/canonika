const puppeteer = require('puppeteer');

async function testarNavegacaoReal() {
    console.log('🧪 TESTE DE NAVEGAÇÃO REAL - SIMULANDO USUÁRIO');
    console.log('==================================================');
    
    const browser = await puppeteer.launch({ 
        headless: false, // Mostrar navegador
        slowMo: 1000, // Desacelerar para visualizar
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        // Capturar logs do console
        page.on('console', msg => console.log('📱 CONSOLE:', msg.text()));
        
        console.log('\n1️⃣ INICIANDO NAVEGAÇÃO - Acessando Harbor...');
        
        // Acessar Harbor
        await page.goto('http://localhost:3701/', { 
            waitUntil: 'networkidle0',
            timeout: 15000 
        });
        
        console.log(`📍 URL atual: ${page.url()}`);
        
        // Aguardar um pouco para ver o que acontece
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`📍 URL após 3 segundos: ${page.url()}`);
        
        // Verificar se foi redirecionado para Quarter
        if (page.url().includes('localhost:3700')) {
            console.log('✅ Redirecionamento para Quarter detectado!');
            
            console.log('\n2️⃣ VERIFICANDO ELEMENTOS DO QUARTER...');
            
            // Verificar se há formulário de login
            const hasLoginForm = await page.evaluate(() => {
                return !!document.querySelector('input[type="email"]') && 
                       !!document.querySelector('input[type="password"]') &&
                       !!document.querySelector('button[type="submit"]');
            });
            
            if (hasLoginForm) {
                console.log('✅ Formulário de login encontrado!');
                
                console.log('\n3️⃣ PREENCHENDO FORMULÁRIO...');
                
                // Preencher email
                await page.type('input[type="email"]', 'admin@canonika.io');
                console.log('✅ Email preenchido');
                
                // Preencher senha
                await page.type('input[type="password"]', 'admin123');
                console.log('✅ Senha preenchida');
                
                // Aguardar um pouco
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                console.log('\n4️⃣ CLICANDO NO BOTÃO ENTRAR...');
                
                // Clicar no botão de login
                await page.click('button[type="submit"]');
                console.log('✅ Botão clicado');
                
                // Aguardar redirecionamento
                await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 });
                
                console.log(`📍 URL após login: ${page.url()}`);
                
                if (page.url().includes('localhost:3701')) {
                    console.log('✅ SUCCESS: Redirecionamento para Harbor funcionou!');
                    
                    console.log('\n5️⃣ TESTANDO PERSISTÊNCIA...');
                    
                    // Aguardar um pouco
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Tentar acessar Quarter novamente
                    console.log('\n6️⃣ Acessando Quarter novamente...');
                    await page.goto('http://localhost:3700/?redirect_to=http%3A%2F%2Flocalhost%3A3701%2F', { 
                        waitUntil: 'networkidle0',
                        timeout: 15000 
                    });
                    
                    console.log(`📍 URL após acesso direto ao Quarter: ${page.url()}`);
                    
                    if (page.url().includes('localhost:3701')) {
                        console.log('🎉 SUCESSO TOTAL: Autenticação persistiu!');
                        console.log('✅ SISTEMA FUNCIONANDO PERFEITAMENTE!');
                    } else if (page.url().includes('localhost:3700')) {
                        console.log('❌ PROBLEMA: Autenticação não persistiu!');
                        console.log('🔍 Verificando cookies...');
                        
                        // Verificar cookies
                        const cookies = await page.cookies();
                        console.log('Cookies encontrados:', cookies.map(c => c.name));
                        
                        // Verificar localStorage
                        const localStorage = await page.evaluate(() => {
                            return {
                                authenticated: localStorage.getItem('canonika_authenticated'),
                                user: localStorage.getItem('canonika_user')
                            };
                        });
                        console.log('localStorage:', localStorage);
                        
                    } else {
                        console.log('❌ ERROR: URL inesperada após teste de persistência');
                    }
                    
                } else {
                    console.log('❌ ERROR: Não foi redirecionado para Harbor após login');
                    console.log(`URL atual: ${page.url()}`);
                }
                
            } else {
                console.log('❌ ERROR: Formulário de login não encontrado!');
                
                // Verificar o que há na página
                const pageContent = await page.evaluate(() => {
                    return {
                        title: document.title,
                        hasForm: !!document.querySelector('form'),
                        hasInputs: !!document.querySelector('input'),
                        bodyText: document.body.textContent.substring(0, 200)
                    };
                });
                
                console.log('Conteúdo da página:', pageContent);
            }
            
        } else if (page.url().includes('localhost:3701')) {
            console.log('✅ Usuário já está autenticado no Harbor');
            
            console.log('\n2️⃣ TESTANDO PERSISTÊNCIA...');
            
            // Tentar acessar Quarter diretamente
            console.log('\n3️⃣ Acessando Quarter para testar persistência...');
            await page.goto('http://localhost:3700/?redirect_to=http%3A%2F%2Flocalhost%3A3701%2F', { 
                waitUntil: 'networkidle0',
                timeout: 15000 
            });
            
            console.log(`📍 URL após acesso direto ao Quarter: ${page.url()}`);
            
            if (page.url().includes('localhost:3701')) {
                console.log('🎉 SUCESSO: Autenticação persistiu!');
            } else if (page.url().includes('localhost:3700')) {
                console.log('❌ PROBLEMA: Autenticação não persistiu!');
            }
            
        } else {
            console.log('❌ ERROR: URL inesperada');
            console.log(`URL atual: ${page.url()}`);
        }
        
        // Aguardar um pouco para visualizar
        console.log('\n⏳ Aguardando 5 segundos para visualização final...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
    } catch (error) {
        console.error('❌ ERRO durante o teste:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        await browser.close();
    }
}

// Capturar erros do console
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

testarNavegacaoReal(); 