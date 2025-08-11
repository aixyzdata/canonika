#!/bin/bash

echo "🧪 Iniciando testes BDD do Template Service"
echo "=============================================="

# Verificar se os serviços estão rodando
echo "🔍 Verificando serviços..."

# Template Service (3790)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3790 | grep -q "200"; then
    echo "✅ Template Service (3790) - OK"
else
    echo "❌ Template Service (3790) - FALHOU"
    exit 1
fi

# Quarter Service (3700)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3700 | grep -q "200"; then
    echo "✅ Quarter Service (3700) - OK"
else
    echo "❌ Quarter Service (3700) - FALHOU"
    exit 1
fi

# Harbor Service (3701)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3701 | grep -q "200"; then
    echo "✅ Harbor Service (3701) - OK"
else
    echo "❌ Harbor Service (3701) - FALHOU"
    exit 1
fi

echo ""
echo "🚀 Executando testes BDD..."
echo "=========================="

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Executar testes
npm run test:auth

echo ""
echo "📊 Relatório gerado: cucumber-report.html"
echo "🎯 Testes concluídos!" 