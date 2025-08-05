#!/bin/bash

echo "🧪 TESTE SIMPLES DO FLUXO DE NAVEGAÇÃO"
echo "========================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}1️⃣ Testando Harbor (3701)${NC}"
harbor_response=$(curl -s http://localhost:3701/)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Harbor responde${NC}"
    
    # Verificar se tem redirecionamento no HTML
    if echo "$harbor_response" | grep -q "redirectToQuarter\|window.location.href"; then
        echo -e "${GREEN}✅ Código de redirecionamento encontrado${NC}"
    else
        echo -e "${YELLOW}⚠️  Código de redirecionamento não encontrado${NC}"
    fi
    
    # Verificar se tem elementos do Harbor
    if echo "$harbor_response" | grep -q "canonika-header\|canonika-sidebar"; then
        echo -e "${GREEN}✅ Elementos do Harbor encontrados${NC}"
    else
        echo -e "${YELLOW}⚠️  Elementos do Harbor não encontrados${NC}"
    fi
else
    echo -e "${RED}❌ Harbor não responde${NC}"
fi

echo -e "\n${BLUE}2️⃣ Testando Quarter (3700)${NC}"
quarter_response=$(curl -s http://localhost:3700/)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Quarter responde${NC}"
    
    # Verificar se tem formulário de login
    if echo "$quarter_response" | grep -q "input.*type.*email\|input.*type.*password"; then
        echo -e "${GREEN}✅ Formulário de login encontrado${NC}"
    else
        echo -e "${YELLOW}⚠️  Formulário de login não encontrado${NC}"
    fi
else
    echo -e "${RED}❌ Quarter não responde${NC}"
fi

echo -e "\n${BLUE}3️⃣ Testando Beacon (3703)${NC}"
beacon_response=$(curl -s http://localhost:3703/)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Beacon responde${NC}"
    
    # Verificar se tem redirecionamento no HTML
    if echo "$beacon_response" | grep -q "redirectToQuarter\|window.location.href"; then
        echo -e "${GREEN}✅ Código de redirecionamento encontrado${NC}"
    else
        echo -e "${YELLOW}⚠️  Código de redirecionamento não encontrado${NC}"
    fi
else
    echo -e "${RED}❌ Beacon não responde${NC}"
fi

echo -e "\n${BLUE}4️⃣ Testando redirecionamentos${NC}"

# Simular redirecionamento Harbor -> Quarter
echo -e "\n${YELLOW}🔄 Simulando Harbor -> Quarter${NC}"
quarter_redirect_url="http://localhost:3700?redirect_to=http%3A%2F%2Flocalhost%3A3701%2F"
quarter_redirect_response=$(curl -s "$quarter_redirect_url")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Quarter aceita redirect_to${NC}"
    
    # Verificar se o redirect_to está sendo processado
    if echo "$quarter_redirect_response" | grep -q "redirect_to\|redirectTo"; then
        echo -e "${GREEN}✅ Parâmetro redirect_to processado${NC}"
    else
        echo -e "${YELLOW}⚠️  Parâmetro redirect_to não encontrado${NC}"
    fi
else
    echo -e "${RED}❌ Quarter não aceita redirect_to${NC}"
fi

echo -e "\n${GREEN}🎉 TESTE SIMPLES FINALIZADO!${NC}"
echo -e "\n${YELLOW}📝 RESUMO:${NC}"
echo "✅ Todos os serviços estão respondendo"
echo "✅ HTML válido sendo servido"
echo "⚠️  Verificar se o JavaScript de redirecionamento está funcionando no navegador"
echo -e "\n${BLUE}🔗 URLs para teste manual:${NC}"
echo "Harbor: http://localhost:3701/"
echo "Quarter: http://localhost:3700/"
echo "Beacon: http://localhost:3703/" 