#!/bin/bash

# Script para executar teste rápido do AG-Grid Canonika Theme
# Fisher Service - Validação Rápida

echo "🚀 Teste Rápido - AG-Grid Canonika Theme"
echo "========================================"

# Verifica se o Fisher está rodando
echo "🔍 Verificando se o Fisher está rodando..."
if curl -s http://localhost:3707 > /dev/null; then
    echo "✅ Fisher está rodando em http://localhost:3707"
else
    echo "❌ Fisher não está rodando. Inicie o serviço primeiro."
    echo "   cd fisher/web && npm run dev"
    exit 1
fi

# Verifica se Puppeteer está instalado
echo "📦 Verificando dependências..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado"
    exit 1
fi

# Executa o teste rápido
echo "🧪 Executando teste rápido..."
echo ""

cd tests
node quick-ag-grid-test.js

echo ""
echo "📊 Teste rápido concluído!"
echo ""
echo "🎯 Para executar testes BDD completos:"
echo "   ./run-ag-grid-tests.sh" 