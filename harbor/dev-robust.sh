#!/bin/bash

# Script de desenvolvimento robusto do Harbor
# Com melhor controle, debugging e hot reload garantido

set -e  # Para em caso de erro

echo "🚀 Harbor Development Environment (Robust)"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para verificar se porta está em uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Função para matar processos em porta
kill_port() {
    local port=$1
    if check_port $port; then
        log "Matando processo na porta $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Função para mostrar ajuda
show_help() {
    echo ""
    echo "Comandos disponíveis:"
    echo "  clean     - Limpa ambiente e para todos os processos"
    echo "  setup     - Instala dependências (primeira vez)"
    echo "  start     - Inicia ambiente completo com hot reload"
    echo "  frontend  - Inicia apenas frontend"
    echo "  backend   - Inicia apenas backend"
    echo "  test      - Testa se tudo está funcionando"
    echo "  logs      - Mostra logs em tempo real"
    echo "  help      - Mostra esta ajuda"
    echo ""
    echo "Portas utilizadas:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend:  http://localhost:8000"
    echo ""
}

# Função para limpar ambiente
clean() {
    log "🧹 Limpando ambiente..."
    
    # Matar processos
    kill_port 5173
    kill_port 8000
    
    # Limpar cache do Vite
    if [ -d "harbor/web/node_modules/.vite" ]; then
        rm -rf harbor/web/node_modules/.vite
        log "Cache do Vite limpo"
    fi
    
    # Limpar cache do navegador (se possível)
    log "💡 Dica: Limpe o cache do navegador (Ctrl+Shift+R)"
    
    echo "✅ Ambiente limpo!"
}

# Função para instalar dependências
setup() {
    log "📦 Instalando dependências..."
    
    # Frontend
    log "  - Instalando dependências do frontend..."
    cd harbor/web
    npm install
    cd ../..
    
    # Backend
    log "  - Instalando dependências do backend..."
    cd harbor/api
    if [ ! -d "venv" ]; then
        log "    - Criando ambiente virtual..."
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements-dev.txt
    cd ../..
    
    log "✅ Dependências instaladas!"
}

# Função para testar ambiente
test_env() {
    log "🧪 Testando ambiente..."
    
    # Testa se o backend está rodando
    if check_port 8000; then
        if curl -s http://localhost:8000/health > /dev/null; then
            log "✅ Backend está rodando em http://localhost:8000"
        else
            error "❌ Backend não está respondendo"
        fi
    else
        error "❌ Backend não está rodando"
    fi
    
    # Testa se o frontend está rodando
    if check_port 5173; then
        if curl -s http://localhost:5173 > /dev/null; then
            log "✅ Frontend está rodando em http://localhost:5173"
        else
            error "❌ Frontend não está respondendo"
        fi
    else
        error "❌ Frontend não está rodando"
    fi
    
    echo ""
    log "📋 Status dos processos:"
    ps aux | grep -E "(uvicorn|vite)" | grep -v grep || echo "Nenhum processo encontrado"
}

# Função para iniciar frontend
start_frontend() {
    log "🎨 Iniciando frontend..."
    
    # Limpar porta se necessário
    kill_port 5173
    
    cd harbor/web
    
    # Configurar variáveis de ambiente para desenvolvimento
    export VITE_DEV_MODE=true
    export VITE_API_URL=http://localhost:8000
    
    log "  - Iniciando Vite com hot reload..."
    npm run dev:local
}

# Função para iniciar backend
start_backend() {
    log "🔧 Iniciando backend..."
    
    # Limpar porta se necessário
    kill_port 8000
    
    cd harbor/api
    
    # Ativar ambiente virtual
    source venv/bin/activate
    
    # Configurar variáveis de ambiente
    export PYTHONPATH=$PWD
    export ENVIRONMENT=development
    
    log "  - Iniciando FastAPI com reload..."
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info
}

# Função para iniciar ambos
start_both() {
    log "🚀 Iniciando Harbor completo..."
    
    # Limpar ambiente primeiro
    clean
    
    # Iniciar backend em background
    log "  - Iniciando backend..."
    cd harbor/api
    source venv/bin/activate
    export PYTHONPATH=$PWD
    export ENVIRONMENT=development
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info &
    BACKEND_PID=$!
    cd ../..
    
    # Aguardar backend iniciar
    log "  - Aguardando backend iniciar..."
    sleep 3
    
    # Testar backend
    if curl -s http://localhost:8000/health > /dev/null; then
        log "✅ Backend iniciado com sucesso"
    else
        error "❌ Falha ao iniciar backend"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    # Iniciar frontend
    log "  - Iniciando frontend..."
    cd harbor/web
    export VITE_DEV_MODE=true
    export VITE_API_URL=http://localhost:8000
    npm run dev:local &
    FRONTEND_PID=$!
    cd ../..
    
    # Aguardar frontend iniciar
    log "  - Aguardando frontend iniciar..."
    sleep 5
    
    # Testar frontend
    if curl -s http://localhost:5173 > /dev/null; then
        log "✅ Frontend iniciado com sucesso"
    else
        error "❌ Falha ao iniciar frontend"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
    
    echo ""
    log "🎉 Ambiente iniciado com sucesso!"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend:  http://localhost:8000"
    echo "  Health:   http://localhost:8000/health"
    echo ""
    log "💡 Hot reload ativo! Faça mudanças nos arquivos e veja em tempo real."
    log "💡 Pressione Ctrl+C para parar ambos"
    
    # Aguarda interrupção
    trap "log '🛑 Parando serviços...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
}

# Função para mostrar logs
show_logs() {
    log "📋 Mostrando logs em tempo real..."
    echo "Pressione Ctrl+C para sair"
    tail -f /dev/null & # Placeholder para logs futuros
    wait
}

# Verifica se foi passado um comando
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

# Processa comandos
case "$1" in
    "clean")
        clean
        ;;
    "setup")
        setup
        ;;
    "start")
        start_both
        ;;
    "frontend")
        start_frontend
        ;;
    "backend")
        start_backend
        ;;
    "test")
        test_env
        ;;
    "logs")
        show_logs
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        error "Comando desconhecido: $1"
        show_help
        exit 1
        ;;
esac 