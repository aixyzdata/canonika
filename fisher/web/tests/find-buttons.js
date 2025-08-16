#!/usr/bin/env node

/**
 * Encontrar Botões - Identifica botões disponíveis na página
 */

const puppeteer = require('puppeteer');

async function findButtons() {
  console.log('🔍 Encontrando Botões na Página Sefaz');
  console.log('=====================================');
  
  let browser, page;
  
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      slowMo: 100
    });
    
    page = await browser.newPage();
    
    console.log('📄 Navegando para Sefaz...');
    await page.goto('http://localhost:3707/sources/sefaz');
    await page.waitForSelector('#app', { timeout: 10000 });
    
    // Aguarda o Vue renderizar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Encontra todos os botões
    console.log('🔍 Procurando botões...');
    const buttons = await page.evaluate(() => {
      const buttonElements = document.querySelectorAll('button');
      return Array.from(buttonElements).map(button => ({
        text: button.textContent.trim(),
        className: button.className,
        id: button.id,
        type: button.type
      }));
    });
    
    console.log('📊 Botões encontrados:', buttons.length);
    buttons.forEach((button, index) => {
      console.log(`  ${index + 1}. "${button.text}" (class: ${button.className}, id: ${button.id})`);
    });
    
    // Encontra elementos clicáveis
    console.log('🔍 Procurando elementos clicáveis...');
    const clickableElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[onclick], [@click], button, a, [role="button"]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        text: el.textContent.trim().substring(0, 50),
        className: el.className,
        id: el.id,
        onclick: el.getAttribute('onclick'),
        role: el.getAttribute('role')
      }));
    });
    
    console.log('📊 Elementos clicáveis encontrados:', clickableElements.length);
    clickableElements.forEach((element, index) => {
      console.log(`  ${index + 1}. ${element.tagName} - "${element.text}" (class: ${element.className})`);
    });
    
    // Procura por texto relacionado a sincronização
    console.log('🔍 Procurando texto relacionado a sincronização...');
    const syncTexts = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements)
        .filter(el => el.textContent && el.textContent.toLowerCase().includes('sincron'))
        .map(el => el.textContent.trim().substring(0, 100));
    });
    
    console.log('📋 Textos com "sincron":', syncTexts.length);
    syncTexts.forEach((text, index) => {
      console.log(`  ${index + 1}. "${text}"`);
    });
    
    // Aguarda para visualização
    console.log('👀 Aguardando 5 segundos para visualização...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🎯 Busca de botões concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a busca:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

findButtons().catch(console.error); 