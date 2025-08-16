#!/usr/bin/env node

/**
 * Debug Erro 404 - Captura detalhes do erro
 */

const puppeteer = require('puppeteer');

async function debug404Error() {
  console.log('🔍 Debug Erro 404');
  console.log('=================');
  
  let browser, page;
  
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      slowMo: 100
    });
    
    page = await browser.newPage();
    
    // Captura todos os logs e erros
    const logs = [];
    const errors = [];
    
    page.on('console', msg => {
      logs.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    page.on('error', err => {
      errors.push(err.message);
    });
    
    page.on('pageerror', err => {
      errors.push(err.message);
    });
    
    // Captura requisições que falharam
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure().errorText
      });
    });
    
    console.log('📄 Navegando para Sefaz...');
    await page.goto('http://localhost:3707/sources/sefaz');
    
    // Aguarda para capturar erros
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🚨 Erros capturados:', errors.length);
    errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
    
    console.log('❌ Requisições que falharam:', failedRequests.length);
    failedRequests.forEach((request, index) => {
      console.log(`  ${index + 1}. ${request.url} - ${request.failure}`);
    });
    
    console.log('📋 Logs capturados:', logs.length);
    logs.forEach((log, index) => {
      console.log(`  ${index + 1}. [${log.type.toUpperCase()}] ${log.text}`);
    });
    
    // Verifica se há elementos Vue
    console.log('⚡ Verificando elementos Vue...');
    const vueElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-v-]');
      return elements.length;
    });
    
    console.log(`📊 Elementos Vue: ${vueElements}`);
    
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
    
    // Aguarda para visualização
    console.log('👀 Aguardando 3 segundos para visualização...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🎯 Debug 404 concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o debug:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debug404Error().catch(console.error); 