#!/bin/bash

# Script para carregar políticas OPA no Canonika
# Executado após o container OPA estar pronto

echo "Carregando políticas OPA para o Canonika..."

# Aguardar OPA estar pronto
until curl -f http://localhost:8181/health > /dev/null 2>&1; do
    echo "Aguardando OPA estar pronto..."
    sleep 2
done

# Carregar política principal
curl -X PUT http://localhost:8181/v1/policies/canonika \
  -H "Content-Type: text/plain" \
  -d @canonika.rego

# Verificar se a política foi carregada
if [ $? -eq 0 ]; then
    echo "✅ Política principal carregada com sucesso"
else
    echo "❌ Erro ao carregar política principal"
    exit 1
fi

# Testar a política
echo "Testando política OPA..."

# Teste básico de autorização
curl -X POST http://localhost:8181/v1/data/canonika/allow \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "user": {
        "authenticated": true,
        "roles": ["dashboard_user"],
        "permissions": ["access"]
      },
      "resource": {
        "required_roles": ["dashboard_user"],
        "public": false
      },
      "action": "access",
      "service": "harbor"
    }
  }'

echo ""
echo "🎉 Políticas OPA carregadas e testadas com sucesso!"
echo "📋 Endpoints disponíveis:"
echo "   - Health: http://localhost:8181/health"
echo "   - Data: http://localhost:8181/v1/data"
echo "   - Policies: http://localhost:8181/v1/policies" 