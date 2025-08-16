#!/usr/bin/env node

/**
 * Debug Botão Sincronização - Verifica o que acontece após clicar
 */

const puppeteer = require('puppeteer');

async function debugSyncButton() {
  console.log('🔍 Debug Botão Sincronização');
  console.log('============================');
  
  let browser, page;
  
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      slowMo: 100
    });
    
    page = await browser.newPage();
    
    // Captura logs do console
    const logs = [];
    page.on('console', msg => {
      logs.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    console.log('📄 Navegando para Sefaz...');
    await page.goto('http://localhost:3707/sources/sefaz');
    await page.waitForSelector('#app', { timeout: 10000 });
    
    // Aguarda o Vue renderizar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🖱️ Clicando no botão Sincronização CNPJ...');
    await page.click('text=Sincronização CNPJ');
    
    // Aguarda e verifica o que aparece
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verifica se há novos botões após clicar
    console.log('🔍 Verificando botões após clicar...');
    const buttonsAfter = await page.evaluate(() => {
      const buttonElements = document.querySelectorAll('button');
      return Array.from(buttonElements).map(button => ({
        text: button.textContent.trim(),
        className: button.className,
        id: button.id,
        visible: button.offsetParent !== null
      }));
    });
    
    console.log('📊 Botões após clicar:', buttonsAfter.length);
    buttonsAfter.forEach((button, index) => {
      console.log(`  ${index + 1}. "${button.text}" (class: ${button.className}, visible: ${button.visible})`);
    });
    
    // Verifica se há elementos AG-Grid
    console.log('🔍 Verificando elementos AG-Grid...');
    const agGridElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="ag-"]');
      return elements.length;
    });
    
    console.log(`📊 Elementos AG-Grid: ${agGridElements}`);
    
    // Verifica se há elementos com tema
    console.log('🎨 Verificando elementos com tema...');
    const themeElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="theme"]');
      return elements.length;
    });
    
    console.log(`📊 Elementos com tema: ${themeElements}`);
    
    // Verifica logs do console
    console.log('📋 Logs do console:', logs.length);
    logs.forEach((log, index) => {
      console.log(`  ${index + 1}. [${log.type.toUpperCase()}] ${log.text}`);
    });
    
    // Verifica se há elementos de tabela
    console.log('📊 Verificando elementos de tabela...');
    const tableElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('table, [role="grid"], [class*="grid"]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        className: el.className,
        role: el.getAttribute('role')
      }));
    });
    
    console.log('📊 Elementos de tabela:', tableElements.length);
    tableElements.forEach((element, index) => {
      console.log(`  ${index + 1}. ${element.tagName} - ${element.className} (role: ${element.role})`);
    });
    
    // Aguarda para visualização
    console.log('👀 Aguardando 5 segundos para visualização...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🎯 Debug do botão concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o debug:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugSyncButton().catch(console.error); 