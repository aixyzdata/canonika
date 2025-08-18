const puppeteer = require('puppeteer');

async function debugAgGridHeight() {
  const browser = await puppeteer.launch({ 
    headless: true, // Modo headless para evitar problemas de conexão
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Navegando para a página SEFAZ...');
    await page.goto('http://localhost:3706/sources/sefaz', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('⏳ Aguardando carregamento...');
    await page.waitForTimeout(5000);
    
    // Aguardar AG-Grid
    await page.waitForSelector('.ag-theme-quartz', { timeout: 10000 });
    
    console.log('🔍 Analisando elementos AG-Grid...');
    
    // Verificar todos os elementos AG-Grid
    const agGridElements = await page.$$('.ag-theme-quartz');
    console.log(`📊 Encontrados ${agGridElements.length} elementos AG-Grid`);
    
    for (let i = 0; i < agGridElements.length; i++) {
      console.log(`\n🔍 Elemento AG-Grid #${i + 1}:`);
      
      const element = agGridElements[i];
      
      // Verificar classes
      const classes = await page.evaluate(el => el.className, element);
      console.log(`   Classes: ${classes}`);
      
      // Verificar atributos
      const attributes = await page.evaluate(el => {
        const attrs = {};
        for (let attr of el.attributes) {
          attrs[attr.name] = attr.value;
        }
        return attrs;
      }, element);
      console.log(`   Atributos:`, attributes);
      
      // Verificar estilos computados
      const styles = await page.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          height: computed.height,
          minHeight: computed.minHeight,
          maxHeight: computed.maxHeight,
          width: computed.width,
          display: computed.display,
          position: computed.position,
          overflow: computed.overflow
        };
      }, element);
      console.log(`   Estilos computados:`, styles);
      
      // Verificar se tem filhos
      const children = await page.evaluate(el => el.children.length, element);
      console.log(`   Filhos: ${children}`);
      
      // Verificar se tem conteúdo
      const hasContent = await page.evaluate(el => {
        return el.innerHTML.length > 0;
      }, element);
      console.log(`   Tem conteúdo: ${hasContent}`);
    }
    
    // Verificar container pai
    console.log('\n🔍 Verificando containers pais...');
    const containers = await page.$$('.ag-grid-container');
    console.log(`📊 Encontrados ${containers.length} containers`);
    
    for (let i = 0; i < containers.length; i++) {
      console.log(`\n🔍 Container #${i + 1}:`);
      
      const container = containers[i];
      
      // Verificar estilos do container
      const containerStyles = await page.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          height: computed.height,
          minHeight: computed.minHeight,
          width: computed.width,
          display: computed.display
        };
      }, container);
      console.log(`   Estilos do container:`, containerStyles);
    }
    
    // Verificar CSS aplicado
    console.log('\n🔍 Verificando CSS aplicado...');
    const cssRules = await page.evaluate(() => {
      const rules = [];
      for (let sheet of document.styleSheets) {
        try {
          for (let rule of sheet.cssRules) {
            if (rule.selectorText && rule.selectorText.includes('ag-theme-quartz')) {
              rules.push({
                selector: rule.selectorText,
                cssText: rule.cssText
              });
            }
          }
        } catch (e) {
          // Ignorar erros de CORS
        }
      }
      return rules;
    });
    
    console.log(`📊 Encontradas ${cssRules.length} regras CSS para ag-theme-quartz:`);
    cssRules.forEach((rule, index) => {
      console.log(`   ${index + 1}. ${rule.selector}`);
      console.log(`      ${rule.cssText}`);
    });
    
    console.log('\n✅ Debug concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante debug:', error);
  } finally {
    await browser.close();
  }
}

debugAgGridHeight().catch(console.error); 