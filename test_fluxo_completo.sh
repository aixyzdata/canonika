#!/bin/bash

echo "🧪 TESTE DO FLUXO COMPLETO DE NAVEGAÇÃO"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local url=$1
    local description=$2
    
    echo -e "\n${BLUE}🔍 Testando: $description${NC}"
    echo "URL: $url"
    
    # Testar se responde
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ OK - Responde com 200${NC}"
        
        # Verificar se é HTML
        content_type=$(curl -s -I "$url" | grep -i "content-type" | head -1)
        if echo "$content_type" | grep -q "text/html"; then
            echo -e "${GREEN}✅ OK - Content-Type: text/html${NC}"
            
            # Verificar se tem elementos básicos do HTML
            html_content=$(curl -s "$url")
            if echo "$html_content" | grep -q "<!DOCTYPE html>"; then
                echo -e "${GREEN}✅ OK - HTML válido${NC}"
                
                # Verificar se tem título
                title=$(echo "$html_content" | grep -i "<title>" | head -1)
                if [ ! -z "$title" ]; then
                    echo -e "${GREEN}✅ OK - Título encontrado: $title${NC}"
                else
                    echo -e "${YELLOW}⚠️  Aviso - Título não encontrado${NC}"
                fi
            else
                echo -e "${RED}❌ ERRO - HTML inválido${NC}"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  Aviso - Content-Type não é text/html: $content_type${NC}"
        fi
    else
        echo -e "${RED}❌ ERRO - Não responde com 200${NC}"
        return 1
    fi
    
    return 0
}

# Função para testar redirecionamento
test_redirect() {
    local from_url=$1
    local expected_redirect=$2
    local description=$3
    
    echo -e "\n${BLUE}🔄 Testando redirecionamento: $description${NC}"
    echo "De: $from_url"
    echo "Para: $expected_redirect"
    
    # Simular redirecionamento (verificar se a página tem JavaScript que redireciona)
    html_content=$(curl -s "$from_url")
    
    if echo "$html_content" | grep -q "redirectToQuarter\|window.location.href"; then
        echo -e "${GREEN}✅ OK - Código de redirecionamento encontrado${NC}"
    else
        echo -e "${YELLOW}⚠️  Aviso - Código de redirecionamento não encontrado${NC}"
    fi
}

echo -e "\n${YELLOW}📋 INICIANDO TESTES...${NC}"

# 1. Testar Harbor (3701)
test_endpoint "http://localhost:3701/" "Harbor - Dashboard Principal"

# 2. Testar Quarter (3700)
test_endpoint "http://localhost:3700/" "Quarter - Sistema de Autenticação"

# 3. Testar Beacon (3703)
test_endpoint "http://localhost:3703/" "Beacon - WebSocket Broker"

# 4. Testar redirecionamentos
test_redirect "http://localhost:3701/" "http://localhost:3700/" "Harbor -> Quarter"
test_redirect "http://localhost:3703/" "http://localhost:3700/" "Beacon -> Quarter"

echo -e "\n${GREEN}🎉 TESTE COMPLETO FINALIZADO!${NC}"
echo -e "\n${YELLOW}📝 INSTRUÇÕES PARA TESTE MANUAL:${NC}"
echo "1. Acesse: http://localhost:3701/"
echo "2. Você deve ser redirecionado para: http://localhost:3700/"
echo "3. Faça login com: admin@canonika.io / admin123"
echo "4. Você deve ser redirecionado de volta para: http://localhost:3701/"
echo "5. Verifique se o conteúdo do Harbor está completo e funcional" 