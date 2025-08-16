const { Given, When, Then, After } = require('@cucumber/cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');

let browser, page;

Given('que estou na página Sefaz do Fisher', async function() {
  try {
    browser = await puppeteer.launch({ 
      headless: false, 
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Verifica se o Fisher está rodando
    const response = await page.goto('http://localhost:3707/sources/sefaz');
    if (!response.ok()) {
      throw new Error(`Fisher não está rodando. Status: ${response.status()}`);
    }
    
    await page.waitForSelector('#app', { timeout: 10000 });
  } catch (error) {
    console.error('Erro ao acessar página Sefaz:', error.message);
    throw error;
  }
});

When('eu clico no botão Sincronizar SEFAZ', async function() {
  await page.click('text=Sincronizar SEFAZ');
  await page.waitForTimeout(2000);
});

When('eu inspeciono a tabela de arquivos CNPJ', async function() {
  await page.waitForSelector('.table-responsive', { timeout: 5000 });
});

When('eu clico no botão de download de um arquivo', async function() {
  await page.click('.btn-outline-primary');
  await page.waitForTimeout(1000);
});

When('eu clico no botão de visualizar um arquivo', async function() {
  await page.click('.btn-outline-info');
  await page.waitForTimeout(1000);
});

When('eu redimensiono a janela do navegador', async function() {
  await page.setViewport({ width: 800, height: 600 });
  await page.waitForTimeout(1000);
});

When('eu clico na aba {string}', async function(tabName) {
  await page.click(`text=${tabName}`);
  await page.waitForTimeout(1000);
});

Then('eu devo ver uma tabela Bootstrap responsiva', async function() {
  const tableExists = await page.evaluate(() => {
    return document.querySelector('.table-responsive') !== null;
  });
  expect(tableExists).to.be.true;
});

Then('a tabela deve ter colunas {string}', async function(columns) {
  const columnList = columns.split(', ').map(col => col.replace(/"/g, ''));
  
  for (const column of columnList) {
    const columnExists = await page.evaluate((colName) => {
      const headers = Array.from(document.querySelectorAll('th'));
      return headers.some(header => header.textContent.includes(colName));
    }, column);
    
    expect(columnExists).to.be.true;
  }
});

Then('a tabela deve ter pelo menos {int} linhas de dados', async function(minRows) {
  const rowCount = await page.evaluate(() => {
    const rows = document.querySelectorAll('tbody tr');
    return rows.length;
  });
  
  expect(rowCount).to.be.at.least(minRows);
});

Then('a tabela deve ter paginação Bootstrap', async function() {
  const paginationExists = await page.evaluate(() => {
    return document.querySelector('.pagination') !== null;
  });
  expect(paginationExists).to.be.true;
});

Then('deve ser executada a ação de download', async function() {
  // Verifica se a ação foi executada (console.log)
  const logs = await page.evaluate(() => {
    return window.downloadExecuted || false;
  });
  expect(logs).to.be.true;
});

Then('deve ser executada a ação de visualização', async function() {
  // Verifica se a ação foi executada (console.log)
  const logs = await page.evaluate(() => {
    return window.viewExecuted || false;
  });
  expect(logs).to.be.true;
});

Then('a tabela deve se adaptar ao novo tamanho', async function() {
  const isResponsive = await page.evaluate(() => {
    const table = document.querySelector('.table-responsive');
    return table && table.style.overflowX === 'auto';
  });
  expect(isResponsive).to.be.true;
});

Then('a tabela deve permanecer funcional', async function() {
  const isFunctional = await page.evaluate(() => {
    const buttons = document.querySelectorAll('.btn');
    return buttons.length > 0;
  });
  expect(isFunctional).to.be.true;
});

Then('eu devo ver a tabela de testes de conexão', async function() {
  const testTableExists = await page.evaluate(() => {
    const tables = document.querySelectorAll('.table-responsive');
    return tables.length >= 2;
  });
  expect(testTableExists).to.be.true;
});

Then('a tabela deve mostrar serviços SEFAZ', async function() {
  const hasServices = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('td'));
    return cells.some(cell => cell.textContent.includes('SEFAZ'));
  });
  expect(hasServices).to.be.true;
});

Then('eu devo ver o botão {string}', async function(buttonText) {
  const buttonExists = await page.evaluate((text) => {
    const buttons = Array.from(document.querySelectorAll('.btn'));
    return buttons.some(button => button.textContent.includes(text));
  }, buttonText);
  expect(buttonExists).to.be.true;
});

After(async function() {
  if (browser) {
    await browser.close();
  }
}); 