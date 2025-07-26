#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento do Skipper

echo "🚀 Iniciando ambiente de desenvolvimento do Skipper..."

# Verificar se estamos no diretório correto
if [ ! -f "api/main.py" ]; then
    echo "❌ Erro: Execute este script do diretório skipper/"
    exit 1
fi

# Criar ambiente virtual se não existir
if [ ! -d "api/venv" ]; then
    echo "📦 Criando ambiente virtual..."
    cd api
    python3 -m venv venv
    cd ..
fi

# Ativar ambiente virtual
echo "🔧 Ativando ambiente virtual..."
source api/venv/bin/activate

# Instalar dependências
echo "📥 Instalando dependências..."
cd api
pip install -r requirements.txt
cd ..

# Verificar se a API está rodando
echo "🔍 Verificando se a API está rodando..."
if curl -s http://localhost:7722/health > /dev/null 2>&1; then
    echo "⚠️  API já está rodando na porta 7722"
else
    echo "🚀 Iniciando API..."
    cd api
    python main.py &
    API_PID=$!
    cd ..
    
    # Aguardar API inicializar
    echo "⏳ Aguardando API inicializar..."
    sleep 5
    
    # Verificar se iniciou corretamente
    if curl -s http://localhost:7722/health > /dev/null 2>&1; then
        echo "✅ API iniciada com sucesso!"
        echo "📋 PID da API: $API_PID"
        echo "🌐 API disponível em: http://localhost:7722"
        echo "📚 Documentação: http://localhost:7722/docs"
    else
        echo "❌ Falha ao iniciar API"
        exit 1
    fi
fi

# Iniciar frontend se necessário
echo "🎨 Verificando frontend..."
if [ -d "web" ]; then
    cd web
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências do frontend..."
        npm install
    fi
    
    echo "🚀 Iniciando frontend..."
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ Frontend iniciado!"
    echo "📋 PID do Frontend: $FRONTEND_PID"
    echo "🌐 Frontend disponível em: http://localhost:5173"
fi

echo ""
echo "🎉 Ambiente de desenvolvimento iniciado!"
echo ""
echo "📋 Comandos úteis:"
echo "   - Testar API: python test_basic_api.py"
echo "   - Ver logs da API: tail -f api/skipper_agents.log"
echo "   - Parar serviços: pkill -f 'python main.py' && pkill -f 'npm run dev'"
echo ""
echo "🔗 URLs:"
echo "   - API: http://localhost:7722"
echo "   - Frontend: http://localhost:5173"
echo "   - Docs API: http://localhost:7722/docs"
echo ""

# Manter script rodando
echo "⏳ Pressione Ctrl+C para parar todos os serviços..."
wait 