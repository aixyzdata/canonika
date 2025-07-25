#!/bin/bash

# Script de desenvolvimento Canonika - Versão Simplificada
# Foca nos serviços essenciais para desenvolvimento rápido

echo "🚀 Canonika Development Environment"
echo "=================================="

# Função para mostrar ajuda
show_help() {
    echo ""
    echo "Comandos disponíveis:"
    echo "  start     - Inicia o ambiente de desenvolvimento"
    echo "  stop      - Para todos os containers"
    echo "  restart   - Reinicia todos os containers"
    echo "  logs      - Mostra logs dos containers"
    echo "  status    - Mostra status dos containers"
    echo "  rebuild   - Reconstrói as imagens"
    echo "  clean     - Para e remove containers/volumes"
    echo "  help      - Mostra esta ajuda"
    echo ""
}

# Função para iniciar desenvolvimento
start_dev() {
    echo "📦 Iniciando ambiente de desenvolvimento..."
    docker-compose up -d
    echo "✅ Ambiente iniciado! Acesse os módulos:"
    echo "   Harbor: http://localhost:3701"
    echo "   Skipper: http://localhost:3702"
    echo "   Tollgate: http://localhost:3703"
    echo "   Quarter: http://localhost:3704"
    echo ""
    echo "🗄️  Banco de dados: localhost:5432"
    echo "🔴 Redis: localhost:6379"
    echo ""
    echo "💡 Dica: Use 'logs' para ver logs em tempo real"
}

# Função para parar
stop_dev() {
    echo "🛑 Parando ambiente de desenvolvimento..."
    docker-compose down
    echo "✅ Ambiente parado!"
}

# Função para reiniciar
restart_dev() {
    echo "🔄 Reiniciando ambiente de desenvolvimento..."
    docker-compose restart
    echo "✅ Ambiente reiniciado!"
}

# Função para mostrar logs
show_logs() {
    echo "📋 Mostrando logs dos containers..."
    docker-compose logs -f
}

# Função para mostrar status
show_status() {
    echo "📊 Status dos containers:"
    docker-compose ps
}

# Função para reconstruir imagens
rebuild_dev() {
    echo "🔨 Reconstruindo imagens..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    echo "✅ Imagens reconstruídas e ambiente iniciado!"
}

# Função para limpar tudo
clean_dev() {
    echo "🧹 Limpando ambiente..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Ambiente limpo!"
}

# Verifica se foi passado um comando
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

# Processa comandos
case "$1" in
    "start")
        start_dev
        ;;
    "stop")
        stop_dev
        ;;
    "restart")
        restart_dev
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "rebuild")
        rebuild_dev
        ;;
    "clean")
        clean_dev
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "❌ Comando desconhecido: $1"
        show_help
        exit 1
        ;;
esac 