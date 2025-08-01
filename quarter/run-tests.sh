#!/bin/bash

# Script para executar todos os testes do Quarter
# TDD (Unit Tests) + BDD (E2E Tests) + Logout Tests

echo "🧪 Executando testes do Quarter..."
echo "=================================="

# Verificar se o Quarter está rodando
echo "📡 Verificando se o Quarter está rodando..."
if ! curl -s http://localhost:80 > /dev/null; then
    echo "❌ Quarter não está rodando. Inicie primeiro: docker-compose up -d quarter"
    exit 1
fi

echo "✅ Quarter está rodando!"

# Instalar dependências de teste (se necessário)
echo "📦 Instalando dependências de teste..."
cd web && npm install --silent

# Executar testes unitários (TDD)
echo ""
echo "🔬 Executando testes unitários (TDD)..."
npm run test -- --run --reporter=verbose

if [ $? -eq 0 ]; then
    echo "✅ Testes unitários passaram!"
else
    echo "❌ Testes unitários falharam!"
    exit 1
fi

# Executar testes de API
echo ""
echo "🔌 Executando testes de API..."
cd ..
docker exec canonika_quarter python -m pytest /app/api/test_main.py -v

if [ $? -eq 0 ]; then
    echo "✅ Testes de API passaram!"
else
    echo "❌ Testes de API falharam!"
    exit 1
fi

# Executar testes E2E (BDD) - Login
echo ""
echo "🌐 Executando testes E2E - Login (BDD)..."
cd web
npx cypress run --spec "cypress/e2e/login.cy.js" --headless

if [ $? -eq 0 ]; then
    echo "✅ Testes E2E - Login passaram!"
else
    echo "❌ Testes E2E - Login falharam!"
    exit 1
fi

# Executar testes E2E (BDD) - Logout
echo ""
echo "🚪 Executando testes E2E - Logout (BDD)..."
npx cypress run --spec "cypress/e2e/logout.cy.js" --headless

if [ $? -eq 0 ]; then
    echo "✅ Testes E2E - Logout passaram!"
else
    echo "❌ Testes E2E - Logout falharam!"
    exit 1
fi

echo ""
echo "🎉 Todos os testes passaram!"
echo "=================================="
echo "📊 Resumo:"
echo "  ✅ Testes unitários (TDD)"
echo "  ✅ Testes de API"
echo "  ✅ Testes E2E - Login (BDD)"
echo "  ✅ Testes E2E - Logout (BDD)"
echo ""
echo "🚀 Quarter está funcionando corretamente!"
echo "🔄 Fluxo de logout Harbor → Quarter implementado!" 