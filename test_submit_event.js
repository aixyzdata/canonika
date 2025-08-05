const puppeteer = require('puppeteer');

async function testarSubmitEvent() {
    console.log('🧪 TESTE DE EVENTO SUBMIT');
    console.log('===========================');
    
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
        
        console.log('\n2️⃣ Verificando formulário...');
        
        // Verificar se o formulário existe
        const formInfo = await page.evaluate(() => {
            const form = document.querySelector('form');
            const button = document.querySelector('button[type="submit"]');
            const emailInput = document.querySelector('input[type="email"]');
            const passwordInput = document.querySelector('input[type="password"]');
            
            return {
                hasForm: !!form,
                hasButton: !!button,
                hasEmailInput: !!emailInput,
                hasPasswordInput: !!passwordInput,
                formAction: form?.action,
                formMethod: form?.method,
                buttonText: button?.textContent,
                buttonType: button?.type
            };
        });
        
        console.log('Informações do formulário:', formInfo);
        
        if (formInfo.hasForm) {
            console.log('\n3️⃣ Adicionando listener para evento submit...');
            
            // Adicionar listener para o evento submit
            await page.evaluate(() => {
                const form = document.querySelector('form');
                if (form) {
                    console.log('🎯 Formulário encontrado, adicionando listener...');
                    
                    form.addEventListener('submit', (e) => {
                        console.log('🎯 EVENTO SUBMIT DISPARADO!');
                        console.log('🎯 Evento:', e);
                        console.log('🎯 Target:', e.target);
                        console.log('🎯 PreventDefault chamado');
                        e.preventDefault();
                        console.log('🎯 Formulário interceptado');
                    });
                    
                    console.log('✅ Listener adicionado ao formulário');
                } else {
                    console.log('❌ Formulário não encontrado');
                }
            });
            
            console.log('\n4️⃣ Preenchendo formulário...');
            
            // Preencher formulário
            await page.type('input[type="email"]', 'admin@canonika.io');
            await page.type('input[type="password"]', 'admin123');
            
            console.log('✅ Formulário preenchido');
            
            // Aguardar um pouco
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('\n5️⃣ Clicando no botão ENTRAR...');
            
            // Clicar no botão
            await page.click('button[type="submit"]');
            console.log('✅ Botão clicado');
            
            // Aguardar logs
            console.log('\n6️⃣ Aguardando logs do console...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            console.log(`📍 URL final: ${page.url()}`);
            
        } else {
            console.log('❌ Formulário não encontrado!');
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

testarSubmitEvent(); 