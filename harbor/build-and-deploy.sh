#!/bin/bash

# Script para build e deploy do Harbor
# Resolve problemas de inconsistência entre dist/ e html/

echo "🔨 Build e Deploy do Harbor"
echo "============================"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script de dentro do diretório harbor/web/"
    exit 1
fi

# Limpar build anterior
echo "🧹 Limpando build anterior..."
rm -rf dist/

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Fazer o build
echo "🔨 Fazendo build da aplicação..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -f "dist/index.html" ]; then
    echo "❌ Erro: Build falhou - index.html não encontrado"
    exit 1
fi

echo "✅ Build concluído com sucesso!"
echo "📁 Arquivos gerados em dist/:"
ls -la dist/

# Verificar se o Docker está rodando
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Erro: Docker não está rodando"
    exit 1
fi

# Rebuild do container Harbor
echo "🐳 Rebuild do container Harbor..."
cd ../..
docker-compose stop harbor
docker-compose up --build -d harbor

echo "✅ Harbor rebuild e iniciado com sucesso!"
echo "🌐 Acesse: http://localhost:3701" 