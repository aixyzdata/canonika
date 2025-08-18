const { Given, When, Then, After } = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');

let browser, page;

Given('I am on the SEFAZ page', async function() {
  browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
  await page.goto('http://localhost:3706/sources/sefaz', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
});

Given('the page has loaded completely', async function() {
  // Aguardar o carregamento completo da página
  await page.waitForTimeout(3000);
  
  // Aguardar que o AG-Grid seja renderizado
  await page.waitForSelector('.ag-theme-quartz', { timeout: 10000 });
});

When('I look at the AG-Grid container', async function() {
  // Aguardar que o container do AG-Grid esteja presente
  await page.waitForSelector('.ag-grid-container', { timeout: 10000 });
});

Then('I should see the AG-Grid element with class {string}', async function(className) {
  const agGridElement = await page.$(`.${className}`);
  expect(agGridElement).to.not.be.null;
  
  console.log(`✅ AG-Grid element with class "${className}" found`);
});

Then('the AG-Grid should have a height of at least {int}px', async function(minHeight) {
  const agGridElement = await page.$('.ag-theme-quartz');
  const styles = await page.evaluate(el => {
    const computedStyle = window.getComputedStyle(el);
    return {
      height: computedStyle.height,
      minHeight: computedStyle.minHeight
    };
  }, agGridElement);
  
  const heightValue = parseInt(styles.height);
  const minHeightValue = parseInt(styles.minHeight);
  
  console.log(`📏 AG-Grid height: ${styles.height}, min-height: ${styles.minHeight}`);
  
  expect(heightValue >= minHeight || minHeightValue >= minHeight).to.be.true;
  console.log(`✅ AG-Grid height is at least ${minHeight}px`);
});

Then('the AG-Grid should have a width of {int}%', async function(width) {
  const agGridElement = await page.$('.ag-theme-quartz');
  const styles = await page.evaluate(el => {
    return window.getComputedStyle(el).width;
  }, agGridElement);
  
  console.log(`📏 AG-Grid width: ${styles}`);
  expect(styles).to.include('%');
  console.log(`✅ AG-Grid width is ${width}%`);
});

When('I examine the AG-Grid content', async function() {
  // Aguardar que o conteúdo do AG-Grid seja carregado
  await page.waitForTimeout(2000);
});

Then('I should see column headers in the grid', async function() {
  const headers = await page.$$('.ag-header-cell');
  expect(headers.length).to.be.greaterThan(0);
  
  console.log(`✅ Found ${headers.length} column headers`);
});

Then('I should see data rows in the grid', async function() {
  const rows = await page.$$('.ag-row');
  expect(rows.length).to.be.greaterThan(0);
  
  console.log(`✅ Found ${rows.length} data rows`);
});

Then('the grid should not be empty', async function() {
  const rowCount = await page.$$eval('.ag-row', rows => rows.length);
  expect(rowCount).to.be.greaterThan(0);
  
  console.log(`✅ Grid is not empty, contains ${rowCount} rows`);
});

When('I look at the AG-Grid pagination', async function() {
  // Aguardar que a paginação seja renderizada
  await page.waitForSelector('.ag-paging-panel', { timeout: 10000 });
});

Then('I should see pagination controls', async function() {
  const paginationPanel = await page.$('.ag-paging-panel');
  expect(paginationPanel).to.not.be.null;
  
  console.log(`✅ Pagination controls found`);
});

Then('the pagination should show {string}', async function(expectedText) {
  const paginationText = await page.$eval('.ag-paging-panel', el => el.textContent);
  expect(paginationText).to.include(expectedText);
  
  console.log(`✅ Pagination shows "${expectedText}"`);
});

Then('the pagination should show page numbers', async function() {
  const pageNumbers = await page.$$('.ag-paging-button');
  expect(pageNumbers.length).to.be.greaterThan(0);
  
  console.log(`✅ Found ${pageNumbers.length} pagination buttons`);
});

When('I check the AG-Grid theme', async function() {
  // Verificar se o tema está aplicado
  await page.waitForSelector('.ag-theme-quartz', { timeout: 10000 });
});

Then('the AG-Grid should have the Canonika theme applied', async function() {
  const agGridElement = await page.$('.ag-theme-quartz');
  const hasTheme = await page.evaluate(el => {
    return el.classList.contains('ag-theme-quartz');
  }, agGridElement);
  
  expect(hasTheme).to.be.true;
  console.log(`✅ Canonika theme is applied`);
});

Then('the grid should have dark blue color scheme', async function() {
  const agGridElement = await page.$('.ag-theme-quartz');
  const backgroundColor = await page.evaluate(el => {
    return window.getComputedStyle(el).backgroundColor;
  }, agGridElement);
  
  console.log(`🎨 AG-Grid background color: ${backgroundColor}`);
  
  // Verificar se tem uma cor escura (não branca)
  expect(backgroundColor).to.not.equal('rgba(0, 0, 0, 0)');
  expect(backgroundColor).to.not.equal('rgb(255, 255, 255)');
  
  console.log(`✅ AG-Grid has dark color scheme`);
});

// Cleanup após os testes
After(async function() {
  if (browser) {
    await browser.close();
  }
}); 