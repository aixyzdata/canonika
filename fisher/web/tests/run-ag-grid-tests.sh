#!/bin/bash

# Script para executar testes BDD do AG-Grid Canonika Theme
# Fisher Service - AG-Grid Theme Validation

echo "🧪 Iniciando testes BDD do AG-Grid Canonika Theme..."
echo "=================================================="

# Verifica se o Fisher está rodando
echo "🔍 Verificando se o Fisher está rodando..."
if curl -s http://localhost:3707 > /dev/null; then
    echo "✅ Fisher está rodando em http://localhost:3707"
else
    echo "❌ Fisher não está rodando. Inicie o serviço primeiro."
    echo "   cd fisher/web && npm run dev"
    exit 1
fi

# Instala dependências se necessário
echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
fi

# Executa os testes
echo "🚀 Executando testes BDD..."
echo ""

# Executa teste específico do AG-Grid
npm run test:ag-grid

echo ""
echo "📊 Testes concluídos!"
echo "📄 Relatório gerado em: cucumber-report.html"
echo ""

# Verifica se os testes passaram
if [ $? -eq 0 ]; then
    echo "✅ Todos os testes passaram! AG-Grid está usando o tema Canonika corretamente."
else
    echo "❌ Alguns testes falharam. Verifique o relatório para detalhes."
fi

echo ""
echo "🎯 Para ver o relatório detalhado:"
echo "   open cucumber-report.html" 