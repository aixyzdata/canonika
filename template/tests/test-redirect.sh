#!/bin/bash

echo "🧪 Testando redirecionamento do Template Service..."
echo "=================================================="

# Teste 1: Acesso direto ao Template
echo "🔍 Teste 1: Acesso direto ao Template (3790)"
echo "curl -I http://localhost:3790"
curl -I http://localhost:3790 2>/dev/null | head -n 5

echo ""
echo "🔍 Teste 2: Verificar se há redirecionamento JavaScript"
echo "curl -s http://localhost:3790 | grep -i 'redirect\|location'"
curl -s http://localhost:3790 | grep -i "redirect\|location" || echo "Nenhum redirecionamento encontrado no HTML"

echo ""
echo "🔍 Teste 3: Verificar se há window.location no JavaScript"
echo "curl -s http://localhost:3790 | grep -i 'window.location'"
curl -s http://localhost:3790 | grep -i "window.location" || echo "Nenhum window.location encontrado"

echo ""
echo "🔍 Teste 4: Verificar se há redirectToQuarter no JavaScript"
echo "curl -s http://localhost:3790 | grep -i 'redirectToQuarter'"
curl -s http://localhost:3790 | grep -i "redirectToQuarter" || echo "Função redirectToQuarter não encontrada"

echo ""
echo "🔍 Teste 5: Verificar se há localhost:3700 no JavaScript"
echo "curl -s http://localhost:3790 | grep -i 'localhost:3700'"
curl -s http://localhost:3790 | grep -i "localhost:3700" || echo "URL do Quarter não encontrada"

echo ""
echo "🔍 Teste 6: Verificar se há localhost:3790 no JavaScript"
echo "curl -s http://localhost:3790 | grep -i 'localhost:3790'"
curl -s http://localhost:3790 | grep -i "localhost:3790" || echo "URL do Template não encontrada"

echo ""
echo "🔍 Teste 7: Verificar se o Quarter está respondendo"
echo "curl -I http://localhost:3700"
curl -I http://localhost:3700 2>/dev/null | head -n 5

echo ""
echo "🎯 Testes concluídos!" 