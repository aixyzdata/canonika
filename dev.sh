#!/bin/bash

# Script de desenvolvimento Canonika
# Permite mudanças em tempo real nos arquivos CSS sem recompilar

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
    echo "  css       - Aplica mudanças CSS em tempo real"
    echo "  help      - Mostra esta ajuda"
    echo ""
}

# Função para iniciar desenvolvimento
start_dev() {
    echo "📦 Iniciando ambiente de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml up -d
    echo "✅ Ambiente iniciado! Acesse os módulos:"
    echo "   Harbor: http://localhost:7721"
    echo "   Skipper: http://localhost:7722"
    echo "   Wayfinder: http://localhost:7723"
    echo "   Mapmaker: http://localhost:7724"
    echo "   Quartermaster: http://localhost:7725"
    echo "   Ledger: http://localhost:7726"
    echo "   Seagull: http://localhost:7727"
    echo "   Beacon: http://localhost:7728"
    echo "   Dock: http://localhost:7729"
    echo "   Guardian: http://localhost:7730"
    echo "   Echo: http://localhost:7731"
    echo "   Tollgate: http://localhost:7732"
    echo ""
    echo "🎨 Para mudanças CSS: edite ./shared/styles/ e use 'css' para aplicar"
}

# Função para parar
stop_dev() {
    echo "🛑 Parando ambiente de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Ambiente parado!"
}

# Função para reiniciar
restart_dev() {
    echo "🔄 Reiniciando ambiente de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml restart
    echo "✅ Ambiente reiniciado!"
}

# Função para mostrar logs
show_logs() {
    echo "📋 Mostrando logs dos containers..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Função para mostrar status
show_status() {
    echo "📊 Status dos containers:"
    docker-compose -f docker-compose.dev.yml ps
}

# Função para aplicar mudanças CSS
apply_css() {
    echo "🎨 Aplicando mudanças CSS em tempo real..."
    
    # Verifica se os containers estão rodando
    if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        echo "❌ Containers não estão rodando. Use 'start' primeiro."
        return 1
    fi
    
    # Lista os containers que precisam ser reiniciados
    containers=(
        "canonika_harbor"
        "canonika_skipper" 
        "canonika_wayfinder"
        "canonika_mapmaker"
        "canonika_quartermaster"
        "canonika_ledger"
        "canonika_seagull"
        "canonika_beacon"
        "canonika_dock"
        "canonika_guardian"
        "canonika_echo"
        "canonika_tollgate"
    )
    
    echo "🔄 Reiniciando containers para aplicar mudanças CSS..."
    for container in "${containers[@]}"; do
        if docker ps | grep -q "$container"; then
            echo "  - Reiniciando $container..."
            docker restart "$container" > /dev/null 2>&1
        fi
    done
    
    echo "✅ Mudanças CSS aplicadas! Os containers foram reiniciados."
    echo "🌐 Acesse qualquer módulo para ver as mudanças."
    echo "💡 Dica: Use Ctrl+F5 para forçar reload do cache do navegador"
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
    "css")
        apply_css
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