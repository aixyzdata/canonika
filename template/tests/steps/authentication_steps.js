const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');

let browser, page;
let currentUrl = '';

Given('the Template Service is running on port {int}', async function (port) {
  const response = await fetch(`http://localhost:${port}`);
  expect(response.status).to.equal(200);
});

Given('the Quarter Service is running on port {int}', async function (port) {
  const response = await fetch(`http://localhost:${port}`);
  expect(response.status).to.equal(200);
});

Given('the Harbor Service is running on port {int}', async function (port) {
  const response = await fetch(`http://localhost:${port}`);
  expect(response.status).to.equal(200);
});

Given('I am not authenticated', async function () {
  // Navegar para uma página primeiro para poder acessar localStorage
  await page.goto('http://localhost:3790', { waitUntil: 'networkidle0' });
  
  // Limpar localStorage e cookies
  await page.evaluate(() => {
    localStorage.clear();
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
  });
});

When('I access {string}', async function (url) {
  currentUrl = url;
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Aguardar redirecionamento se houver
  await page.waitForTimeout(2000);
  
  const finalUrl = page.url();
  console.log(`🔍 Acessado: ${url}`);
  console.log(`📍 URL final: ${finalUrl}`);
});

Then('I should be redirected to {string}', async function (expectedUrl) {
  const currentPageUrl = page.url();
  console.log(`🔄 Redirecionamento esperado: ${expectedUrl}`);
  console.log(`📍 URL atual: ${currentPageUrl}`);
  
  // Verificar se foi redirecionado para a URL esperada
  expect(currentPageUrl).to.include(expectedUrl);
});

Then('the redirect URL should contain {string}', async function (expectedParam) {
  const currentPageUrl = page.url();
  console.log(`🔍 Verificando parâmetro: ${expectedParam}`);
  console.log(`📍 URL atual: ${currentPageUrl}`);
  
  expect(currentPageUrl).to.include(expectedParam);
});

Given('I am on the Quarter login page', async function () {
  await page.goto('http://localhost:3700', { waitUntil: 'networkidle0' });
  const title = await page.title();
  expect(title).to.include('Quarter');
});

When('I fill in the email with {string}', async function (email) {
  await page.type('input[type="email"]', email);
});

When('I fill in the password with {string}', async function (password) {
  await page.type('input[type="password"]', password);
});

When('I click the login button', async function () {
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
});

Then('I should see the Template Service dashboard', async function () {
  const title = await page.title();
  expect(title).to.include('Template Service');
  
  // Verificar se há elementos do dashboard
  const dashboardElement = await page.$('.canonika-view');
  expect(dashboardElement).to.not.be.null;
});

Then('I should be authenticated', async function () {
  const isAuthenticated = await page.evaluate(() => {
    return localStorage.getItem('canonika_authenticated') === 'true';
  });
  expect(isAuthenticated).to.be.true;
});

Given('I am authenticated on the Template Service', async function () {
  // Simular autenticação
  await page.evaluate(() => {
    localStorage.setItem('canonika_authenticated', 'true');
    localStorage.setItem('canonika_user', JSON.stringify({
      id: 'admin-001',
      name: 'Administrador',
      email: 'admin@canonika.io',
      roles: ['admin']
    }));
  });
  
  await page.goto('http://localhost:3790', { waitUntil: 'networkidle0' });
});

When('I click the logout button', async function () {
  await page.click('.logout-btn');
  await page.waitForTimeout(2000);
});

Then('I should not be authenticated', async function () {
  const isAuthenticated = await page.evaluate(() => {
    return localStorage.getItem('canonika_authenticated') === 'true';
  });
  expect(isAuthenticated).to.be.false;
});

Given('I have a valid authentication token', async function () {
  // Criar token válido
  const validToken = btoa(JSON.stringify({
    sub: 'admin-001',
    name: 'Administrador',
    email: 'admin@canonika.io',
    roles: ['admin'],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hora
  }));
  
  await page.goto(`http://localhost:3790?auth_token=${validToken}`, { waitUntil: 'networkidle0' });
});

Then('I should not be redirected to Quarter', async function () {
  const currentPageUrl = page.url();
  expect(currentPageUrl).to.not.include('localhost:3700');
});

Given('I have an expired authentication token', async function () {
  // Criar token expirado
  const expiredToken = btoa(JSON.stringify({
    sub: 'admin-001',
    name: 'Administrador',
    email: 'admin@canonika.io',
    roles: ['admin'],
    iat: Math.floor(Date.now() / 1000) - 7200, // 2 horas atrás
    exp: Math.floor(Date.now() / 1000) - 3600  // 1 hora atrás
  }));
  
  await page.goto(`http://localhost:3790?auth_token=${expiredToken}`, { waitUntil: 'networkidle0' });
});

When('I access the Template Service dashboard', async function () {
  await page.goto('http://localhost:3790', { waitUntil: 'networkidle0' });
});

Then('all shared styles should load successfully', async function () {
  // Verificar se não há erros 404 para CSS
  const response = await page.evaluate(() => {
    return fetch('/shared/styles/canonika-theme.css').then(r => r.status);
  });
  expect(response).to.equal(200);
});

Then('I should not see 404 errors for CSS files', async function () {
  const consoleErrors = await page.evaluate(() => {
    return window.consoleErrors || [];
  });
  
  const css404Errors = consoleErrors.filter(error => 
    error.includes('404') && error.includes('.css')
  );
  
  expect(css404Errors).to.have.length(0);
});

const { Before, After } = require('@cucumber/cucumber');

// Hooks
Before(async function () {
  browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
  
  // Capturar erros do console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  // Capturar erros de rede
  page.on('response', response => {
    if (response.status() === 404) {
      console.log(`❌ 404 Error: ${response.url()}`);
    }
  });
});

After(async function () {
  if (browser) {
    await browser.close();
  }
}); 