#!/usr/bin/env node

/**
 * Debug Console - Captura erros do navegador
 */

const puppeteer = require('puppeteer');

async function debugConsole() {
  console.log('🔍 Debug Console - Capturando erros');
  console.log('===================================');
  
  let browser, page;
  
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      slowMo: 100
    });
    
    page = await browser.newPage();
    
    // Captura todos os logs do console
    const logs = [];
    page.on('console', msg => {
      logs.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });
    
    // Captura erros de rede
    const networkErrors = [];
    page.on('error', err => {
      networkErrors.push(err.message);
    });
    
    page.on('pageerror', err => {
      networkErrors.push(err.message);
    });
    
    console.log('📄 Navegando para Sefaz...');
    await page.goto('http://localhost:3707/sources/sefaz');
    
    // Aguarda para capturar logs
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('📊 Logs capturados:', logs.length);
    logs.forEach((log, index) => {
      console.log(`${index + 1}. [${log.type.toUpperCase()}] ${log.text}`);
    });
    
    console.log('🚨 Erros de rede:', networkErrors.length);
    networkErrors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
    
    // Verifica se há elementos Vue com erros
    console.log('⚡ Verificando elementos Vue...');
    const vueElements = await page.evaluate(() => {
      return {
        appExists: !!document.querySelector('#app'),
        appContent: document.querySelector('#app')?.innerHTML?.substring(0, 1000),
        allElements: document.querySelectorAll('*').length,
        divElements: document.querySelectorAll('div').length
      };
    });
    
    console.log('📱 Elementos encontrados:');
    console.log(`  - #app existe: ${vueElements.appExists}`);
    console.log(`  - Total de elementos: ${vueElements.allElements}`);
    console.log(`  - Total de divs: ${vueElements.divElements}`);
    console.log(`  - Conteúdo do #app: ${vueElements.appContent}`);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugConsole().catch(console.error); 