#!/usr/bin/env node

/**
 * Script para aplicar o Canonika Design System em todas as views do projeto
 * 
 * Este script automatiza a aplicação do design system unificado em todas as views,
 * garantindo consistência visual em todo o projeto.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapeamento de classes antigas para novas classes do design system
const classMappings = {
  // Headings
  'h1': 'canonika-h1',
  'h2': 'canonika-h2', 
  'h3': 'canonika-h3',
  'h4': 'canonika-h4',
  'h5': 'canonika-h5',
  'h6': 'canonika-h6',
  
  // Textos
  'text-muted': 'canonika-subtitle',
  'text-secondary': 'canonika-text-sm',
  'text-light': 'canonika-text-base',
  
  // Layout
  'row': 'canonika-grid',
  'col-12': '',
  'col-md-6': '',
  'col-md-4': '',
  'col-md-3': '',
  'd-flex': 'canonika-flex',
  'justify-content-between': 'canonika-flex-between',
  'justify-content-center': 'canonika-flex-center',
  'align-items-center': 'canonika-flex-center',
  'gap-2': 'canonika-flex-gap-sm',
  'gap-3': 'canonika-flex-gap-md',
  
  // Espaçamentos
  'mb-4': 'canonika-mb-lg',
  'mb-3': 'canonika-mb-md',
  'mb-2': 'canonika-mb-sm',
  'mt-4': 'canonika-mt-lg',
  'mt-3': 'canonika-mt-md',
  'mt-2': 'canonika-mt-sm',
  'p-4': 'canonika-p-xl',
  'p-3': 'canonika-p-lg',
  'p-2': 'canonika-p-md',
  
  // Botões
  'btn': 'canonika-btn',
  'btn-primary': 'canonika-btn-primary',
  'btn-secondary': 'canonika-btn-secondary',
  'btn-outline-light': 'canonika-btn-outline',
  'btn-outline-secondary': 'canonika-btn-outline',
  'btn-sm': 'canonika-btn-sm',
  'btn-lg': 'canonika-btn-lg',
  'btn-canonika-primary': 'canonika-btn-primary',
  
  // Formulários
  'form-group': 'canonika-form-group',
  'form-label': 'canonika-form-label',
  'form-control': 'canonika-form-input',
  'form-check': 'canonika-form-check',
  'form-check-input': 'canonika-form-check-input',
  'form-check-label': 'canonika-form-check-label',
  
  // Cards
  'card': 'canonika-card',
  'card-header': 'canonika-card-header',
  'card-body': 'canonika-card-body',
  'card-footer': 'canonika-card-footer',
  
  // Badges
  'badge': 'canonika-badge',
  'bg-success': 'canonika-badge-success',
  'bg-warning': 'canonika-badge-warning',
  'bg-danger': 'canonika-badge-error',
  'bg-info': 'canonika-badge-info',
  'bg-secondary': 'canonika-badge-info',
  
  // Utilitários
  'text-center': 'canonika-flex canonika-flex-center',
  'text-right': 'canonika-flex canonika-flex-end',
  'text-left': 'canonika-flex canonika-flex-start',
  
  // Ícones
  'me-1': '',
  'me-2': '',
  'ms-1': '',
  'ms-2': ''
};

// Padrões de substituição para estruturas complexas
const structuralMappings = [
  {
    pattern: /<div class="page-header">\s*<div class="canonika-card p-4">\s*<div class="d-flex justify-content-between align-items-center">/g,
    replacement: '<div class="canonika-page-header">\n  <div class="canonika-page-header-content">'
  },
  {
    pattern: /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g,
    replacement: '\n  </div>\n</div>'
  },
  {
    pattern: /<h([1-6])>\s*<i class="fas fa-([^"]+) me-2"><\/i>\s*([^<]+)<\/h[1-6]>/g,
    replacement: '<div class="canonika-section-title">\n    <i class="fas fa-$2 canonika-section-icon"></i>\n    <h$1 class="canonika-h$1">$3</h$1>\n  </div>'
  },
  {
    pattern: /<p class="text-muted">([^<]+)<\/p>/g,
    replacement: '<p class="canonika-subtitle">$1</p>'
  },
  {
    pattern: /<div class="d-flex gap-2">/g,
    replacement: '<div class="canonika-page-header-actions">'
  },
  {
    pattern: /<form([^>]*)>/g,
    replacement: '<form$1 class="canonika-form">'
  },
  {
    pattern: /<div class="grid-container">/g,
    replacement: '<div class="canonika-grid canonika-grid-2">'
  },
  {
    pattern: /<div class="row">/g,
    replacement: '<div class="canonika-grid canonika-grid-2">'
  },
  {
    pattern: /<div class="row mb-4">/g,
    replacement: '<div class="canonika-mb-lg">'
  },
  {
    pattern: /<div class="col-12">/g,
    replacement: ''
  },
  {
    pattern: /<\/div>\s*<\/div>/g,
    replacement: '</div>'
  }
];

/**
 * Aplica as substituições de classes em um arquivo
 */
function applyDesignSystem(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Aplicar mapeamentos estruturais
    structuralMappings.forEach(mapping => {
      if (content.match(mapping.pattern)) {
        content = content.replace(mapping.pattern, mapping.replacement);
        modified = true;
      }
    });
    
    // Aplicar mapeamentos de classes
    Object.entries(classMappings).forEach(([oldClass, newClass]) => {
      const classPattern = new RegExp(`\\b${oldClass}\\b`, 'g');
      if (content.match(classPattern)) {
        content = content.replace(classPattern, newClass);
        modified = true;
      }
    });
    
    // Limpar classes vazias
    content = content.replace(/\s+class="\s*"/g, '');
    content = content.replace(/\s+class="\s*([^"]*)\s*"/g, ' class="$1"');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Aplicado design system em: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  Nenhuma mudança necessária em: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Encontra todos os arquivos Vue no projeto
 */
function findVueFiles() {
  const patterns = [
    '**/web/src/views/**/*.vue',
    '**/web/src/components/**/*.vue',
    '**/views/**/*.vue',
    '**/web/App.vue'
  ];
  
  let files = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, { ignore: ['**/node_modules/**'] });
    files = files.concat(matches);
  });
  
  return files;
}

/**
 * Função principal
 */
function main() {
  console.log('🎨 Aplicando Canonika Design System...\n');
  
  const vueFiles = findVueFiles();
  console.log(`📁 Encontrados ${vueFiles.length} arquivos Vue\n`);
  
  let processed = 0;
  let modified = 0;
  
  vueFiles.forEach(file => {
    processed++;
    if (applyDesignSystem(file)) {
      modified++;
    }
  });
  
  console.log(`\n📊 Resumo:`);
  console.log(`   Arquivos processados: ${processed}`);
  console.log(`   Arquivos modificados: ${modified}`);
  console.log(`   Arquivos inalterados: ${processed - modified}`);
  
  if (modified > 0) {
    console.log(`\n✨ Design system aplicado com sucesso!`);
    console.log(`📖 Consulte a documentação em: shared/styles/DESIGN_SYSTEM.md`);
  } else {
    console.log(`\n🎉 Todos os arquivos já estão usando o design system!`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  applyDesignSystem,
  findVueFiles,
  classMappings,
  structuralMappings
}; 