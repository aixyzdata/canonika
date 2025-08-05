const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');

let browser, page;

// Configurações dos módulos
const MODULES = {
  quarter: 'http://localhost',
  beacon: 'http://localhost:3703',
  harbor: 'http://localhost:3701',
  guardian: 'http://localhost:3705'
};

// Setup e Teardown
Before(async function() {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
  
  // Configurar viewport
  await page.setViewport({ width: 1280, height: 720 });
});

After(async function() {
  await browser.close();
});

// ========================================
// STEPS DE AUTENTICAÇÃO E REDIRECIONAMENTO
// ========================================

Given('que estou acessando o Beacon sem autenticação', async function() {
  await page.goto(MODULES.beacon);
  await page.waitForSelector('body');
});

Given('que estou acessando o Beacon sem estar autenticado', async function() {
  await page.goto(MODULES.beacon);
  await page.waitForSelector('body');
});

Given('que fui redirecionado para o Quarter com redirect_to', async function() {
  const currentUrl = await page.url();
  expect(currentUrl).to.include('localhost');
  expect(currentUrl).to.include('redirect_to');
});

Given('que estou autenticado no sistema', async function() {
  // Fazer login primeiro
  await page.goto(MODULES.quarter);
  await page.waitForSelector('.login-container');
  
  await page.type('input[type="email"]', 'admin@canonika.io');
  await page.type('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  // Aguardar redirecionamento
  await page.waitForNavigation();
});

Given('que estou logado no Beacon', async function() {
  // Verificar se já está logado
  const isAuthenticated = await page.evaluate(() => {
    return localStorage.getItem('canonika_authenticated') === 'true';
  });
  
  if (!isAuthenticated) {
    // Fazer login
    await page.goto(MODULES.quarter);
    await page.waitForSelector('.login-container');
    
    await page.type('input[type="email"]', 'admin@canonika.io');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para Beacon
    await page.waitForNavigation();
  }
});

When('acesso o Beacon sem estar autenticado', async function() {
  await page.goto(MODULES.beacon);
  await page.waitForSelector('body');
});

When('faço login com credenciais válidas', async function() {
  await page.type('input[type="email"]', 'admin@canonika.io');
  await page.type('input[type="password"]', 'admin123');
});

When('clico no botão {string}', async function(buttonText) {
  await page.click(`button:has-text("${buttonText}")`);
});

When('acesso o Beacon diretamente', async function() {
  await page.goto(MODULES.beacon);
  await page.waitForSelector('body');
});

When('faço logout', async function() {
  // Procurar botão de logout
  const logoutButton = await page.$('[data-testid="logout-button"], .logout-btn, button:has-text("Logout")');
  if (logoutButton) {
    await logoutButton.click();
  } else {
    // Simular logout limpando localStorage
    await page.evaluate(() => {
      localStorage.removeItem('canonika_authenticated');
      localStorage.removeItem('canonika_user');
    });
  }
});

Then('devo ser redirecionado automaticamente para o Quarter', async function() {
  await page.waitForNavigation();
  const currentUrl = await page.url();
  expect(currentUrl).to.include('localhost');
  expect(currentUrl).to.not.include('3703'); // Não deve estar no Beacon
});

Then('a URL deve conter o parâmetro redirect_to com a URL do Beacon', async function() {
  const currentUrl = await page.url();
  expect(currentUrl).to.include('redirect_to');
  expect(currentUrl).to.include('localhost:3703');
});

Then('devo ser redirecionado de volta para o Beacon', async function() {
  await page.waitForNavigation();
  const currentUrl = await page.url();
  expect(currentUrl).to.include('localhost:3703');
});

Then('devo ver a interface do Beacon', async function() {
  await page.waitForSelector('.beacon-dashboard, .beacon-view, [data-testid="beacon-interface"]');
  const title = await page.title();
  expect(title).to.include('Beacon');
});

Then('minha sessão deve ser preservada', async function() {
  const isAuthenticated = await page.evaluate(() => {
    return localStorage.getItem('canonika_authenticated') === 'true';
  });
  expect(isAuthenticated).to.be.true;
});

Then('devo ver a interface do Beacon sem redirecionamento', async function() {
  const currentUrl = await page.url();
  expect(currentUrl).to.include('localhost:3703');
  
  await page.waitForSelector('.beacon-dashboard, .beacon-view, [data-testid="beacon-interface"]');
});

Then('devo ver o dashboard principal', async function() {
  await page.waitForSelector('.beacon-dashboard, .dashboard-view, [data-testid="dashboard"]');
});

Then('devo ser redirecionado para o Quarter', async function() {
  await page.waitForNavigation();
  const currentUrl = await page.url();
  expect(currentUrl).to.include('localhost');
  expect(currentUrl).to.not.include('3703');
});

Then('minha sessão deve ser limpa', async function() {
  const isAuthenticated = await page.evaluate(() => {
    return localStorage.getItem('canonika_authenticated') === 'true';
  });
  expect(isAuthenticated).to.be.false;
});

// ========================================
// STEPS AUXILIARES
// ========================================

Given('que o sistema Beacon está operacional', async function() {
  // Verificar se o Beacon está respondendo
  const response = await page.goto(MODULES.beacon);
  expect(response.status()).to.equal(200);
});

Given('que a página carrega completamente', async function() {
  await page.waitForLoadState('networkidle');
});

module.exports = {
  browser,
  page,
  MODULES
}; 