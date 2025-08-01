#!/bin/bash

# Script para configurar Keycloak com realm Canonika e usuário admin
# Executar após o Keycloak estar pronto

echo "🔧 Configurando Keycloak para Canonika..."

# Aguardar Keycloak estar pronto
echo "⏳ Aguardando Keycloak estar pronto..."
until curl -f http://localhost:8080/health/ready > /dev/null 2>&1; do
    echo "   Aguardando..."
    sleep 5
done

echo "✅ Keycloak está pronto!"

# Obter token de admin
echo "🔑 Obtendo token de admin..."
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/realms/master/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=admin123" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
    echo "❌ Erro ao obter token de admin"
    exit 1
fi

echo "✅ Token de admin obtido!"

# Criar realm Canonika
echo "🏗️ Criando realm Canonika..."
curl -s -X POST http://localhost:8080/admin/realms \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "canonika",
    "enabled": true,
    "displayName": "Canonika",
    "displayNameHtml": "<div class=\"kc-logo-text\"><span>CANONIKA</span></div>",
    "attributes": {
      "canonika": "true"
    }
  }'

if [ $? -eq 0 ]; then
    echo "✅ Realm Canonika criado!"
else
    echo "⚠️ Realm Canonika já existe ou erro na criação"
fi

# Aguardar um pouco para o realm ser criado
sleep 3

# Obter token para o realm Canonika
echo "🔑 Obtendo token para realm Canonika..."
CANONIKA_TOKEN=$(curl -s -X POST http://localhost:8080/realms/canonika/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=admin123" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

if [ "$CANONIKA_TOKEN" = "null" ] || [ -z "$CANONIKA_TOKEN" ]; then
    echo "⚠️ Usando token master para configurações do realm"
    CANONIKA_TOKEN=$ADMIN_TOKEN
fi

# Criar usuário admin@canonika.io
echo "👤 Criando usuário admin@canonika.io..."
curl -s -X POST http://localhost:8080/admin/realms/canonika/users \
  -H "Authorization: Bearer $CANONIKA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@canonika.io",
    "firstName": "Administrador",
    "lastName": "Canonika",
    "enabled": true,
    "emailVerified": true,
    "credentials": [
      {
        "type": "password",
        "value": "admin123",
        "temporary": false
      }
    ],
    "attributes": {
      "canonika_user": "true",
      "role": "admin"
    }
  }'

if [ $? -eq 0 ]; then
    echo "✅ Usuário admin@canonika.io criado!"
else
    echo "⚠️ Usuário admin@canonika.io já existe ou erro na criação"
fi

# Criar roles do Canonika
echo "🎭 Criando roles do Canonika..."

# Role admin
curl -s -X POST http://localhost:8080/admin/realms/canonika/roles \
  -H "Authorization: Bearer $CANONIKA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "canonika_admin",
    "description": "Administrador do sistema Canonika",
    "composite": false,
    "clientRole": false
  }'

# Role user
curl -s -X POST http://localhost:8080/admin/realms/canonika/roles \
  -H "Authorization: Bearer $CANONIKA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "canonika_user",
    "description": "Usuário do sistema Canonika",
    "composite": false,
    "clientRole": false
  }'

# Role security_admin
curl -s -X POST http://localhost:8080/admin/realms/canonika/roles \
  -H "Authorization: Bearer $CANONIKA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "security_admin",
    "description": "Administrador de segurança",
    "composite": false,
    "clientRole": false
  }'

echo "✅ Roles do Canonika criadas!"

# Atribuir roles ao usuário admin
echo "👤 Atribuindo roles ao usuário admin..."

# Obter ID do usuário admin
ADMIN_USER_ID=$(curl -s -X GET "http://localhost:8080/admin/realms/canonika/users?username=admin" \
  -H "Authorization: Bearer $CANONIKA_TOKEN" | jq -r '.[0].id')

if [ "$ADMIN_USER_ID" != "null" ] && [ -n "$ADMIN_USER_ID" ]; then
    # Obter roles
    ADMIN_ROLE_ID=$(curl -s -X GET "http://localhost:8080/admin/realms/canonika/roles/canonika_admin" \
      -H "Authorization: Bearer $CANONIKA_TOKEN" | jq -r '.id')
    
    SECURITY_ROLE_ID=$(curl -s -X GET "http://localhost:8080/admin/realms/canonika/roles/security_admin" \
      -H "Authorization: Bearer $CANONIKA_TOKEN" | jq -r '.id')
    
    # Atribuir roles
    if [ "$ADMIN_ROLE_ID" != "null" ] && [ -n "$ADMIN_ROLE_ID" ]; then
        curl -s -X POST "http://localhost:8080/admin/realms/canonika/users/$ADMIN_USER_ID/role-mappings/realm" \
          -H "Authorization: Bearer $CANONIKA_TOKEN" \
          -H "Content-Type: application/json" \
          -d "[{\"id\":\"$ADMIN_ROLE_ID\",\"name\":\"canonika_admin\"}]"
    fi
    
    if [ "$SECURITY_ROLE_ID" != "null" ] && [ -n "$SECURITY_ROLE_ID" ]; then
        curl -s -X POST "http://localhost:8080/admin/realms/canonika/users/$ADMIN_USER_ID/role-mappings/realm" \
          -H "Authorization: Bearer $CANONIKA_TOKEN" \
          -H "Content-Type: application/json" \
          -d "[{\"id\":\"$SECURITY_ROLE_ID\",\"name\":\"security_admin\"}]"
    fi
    
    echo "✅ Roles atribuídas ao usuário admin!"
else
    echo "⚠️ Não foi possível obter ID do usuário admin"
fi

# Criar cliente OAuth para Guardian
echo "🔐 Criando cliente OAuth para Guardian..."
curl -s -X POST http://localhost:8080/admin/realms/canonika/clients \
  -H "Authorization: Bearer $CANONIKA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "guardian",
    "name": "Guardian - Sistema de Segurança",
    "enabled": true,
    "publicClient": true,
    "standardFlowEnabled": true,
    "directAccessGrantsEnabled": true,
    "redirectUris": [
      "http://localhost:3705/*",
      "http://localhost:3705"
    ],
    "webOrigins": [
      "http://localhost:3705"
    ],
    "attributes": {
      "canonika_service": "guardian"
    }
  }'

if [ $? -eq 0 ]; then
    echo "✅ Cliente Guardian criado!"
else
    echo "⚠️ Cliente Guardian já existe ou erro na criação"
fi

# Configurar tema personalizado (opcional)
echo "🎨 Configurando tema personalizado..."
curl -s -X PUT http://localhost:8080/admin/realms/canonika \
  -H "Authorization: Bearer $CANONIKA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "canonika",
    "enabled": true,
    "displayName": "Canonika",
    "displayNameHtml": "<div class=\"kc-logo-text\"><span>CANONIKA</span></div>",
    "attributes": {
      "canonika": "true",
      "canonika_theme": "true"
    }
  }'

echo "✅ Tema personalizado configurado!"

echo ""
echo "🎉 Configuração do Keycloak concluída!"
echo ""
echo "📋 Resumo da configuração:"
echo "   Realm: canonika"
echo "   Admin: admin@canonika.io"
echo "   Senha: admin123"
echo "   Roles: canonika_admin, canonika_user, security_admin"
echo "   Cliente: guardian (http://localhost:3705)"
echo ""
echo "🔗 URLs importantes:"
echo "   Keycloak Admin: http://localhost:8080/admin"
echo "   Account Console: http://localhost:8080/auth/realms/canonika/account"
echo "   Guardian: http://localhost:3705"
echo ""
echo "✅ Configuração concluída com sucesso!" 