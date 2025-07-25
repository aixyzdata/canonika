#!/usr/bin/env node

/**
 * Script para importar automaticamente o Canonika Design System
 * em todos os projetos Vue do workspace
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Encontra todos os arquivos HTML principais dos projetos
 */
function findMainHtmlFiles() {
  const patterns = [
    '*/web/index.html',
    '*/index.html'
  ];
  
  let files = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, { ignore: ['**/node_modules/**'] });
    files = files.concat(matches);
  });
  
  return files;
}

/**
 * Verifica se o design system já está importado
 */
function isDesignSystemImported(content) {
  return content.includes('design-system.css') || 
         content.includes('canonika-design-system');
}

/**
 * Adiciona a importação do design system no HTML
 */
function addDesignSystemImport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (isDesignSystemImported(content)) {
      console.log(`⏭️  Design system já importado em: ${filePath}`);
      return false;
    }
    
    // Encontrar a posição para inserir o CSS
    const headMatch = content.match(/<head[^>]*>/);
    if (!headMatch) {
      console.log(`⚠️  Não foi possível encontrar a tag <head> em: ${filePath}`);
      return false;
    }
    
    // Calcular o caminho relativo para o design system
    const relativePath = path.relative(path.dirname(filePath), 'shared/styles/design-system.css');
    const importTag = `    <link rel="stylesheet" href="${relativePath}">\n`;
    
    // Inserir após a tag <head>
    const insertPosition = headMatch.index + headMatch[0].length;
    content = content.slice(0, insertPosition) + '\n' + importTag + content.slice(insertPosition);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Design system importado em: ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🎨 Importando Canonika Design System...\n');
  
  const htmlFiles = findMainHtmlFiles();
  console.log(`📁 Encontrados ${htmlFiles.length} arquivos HTML principais\n`);
  
  let processed = 0;
  let modified = 0;
  
  htmlFiles.forEach(file => {
    processed++;
    if (addDesignSystemImport(file)) {
      modified++;
    }
  });
  
  console.log(`\n📊 Resumo:`);
  console.log(`   Arquivos processados: ${processed}`);
  console.log(`   Arquivos modificados: ${modified}`);
  console.log(`   Arquivos já tinham importação: ${processed - modified}`);
  
  if (modified > 0) {
    console.log(`\n✨ Design system importado com sucesso!`);
    console.log(`📖 Consulte a documentação em: shared/styles/DESIGN_SYSTEM.md`);
  } else {
    console.log(`\n🎉 Todos os arquivos já têm o design system importado!`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  addDesignSystemImport,
  findMainHtmlFiles,
  isDesignSystemImported
}; 