#!/bin/bash

# Canonika Ecosystem Manager
# Script para gerenciar todo o ecossistema de microserviços

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${BLUE}[CANONIKA]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Por favor, inicie o Docker e tente novamente."
        exit 1
    fi
    print_success "Docker está rodando"
}

# Função para parar containers existentes
stop_existing() {
    print_status "Parando containers existentes..."
    
    # Parar containers individuais se existirem
    docker stop canonika_quarter canonika_harbor canonika_guardian canonika_skipper canonika_beacon canonika_fisher canonika_tollgate canonika_ledger 2>/dev/null || true
    docker rm canonika_quarter canonika_harbor canonika_guardian canonika_skipper canonika_beacon canonika_fisher canonika_tollgate canonika_ledger 2>/dev/null || true
    
    print_success "Containers existentes parados"
}

# Função para construir imagens
build_images() {
    print_status "Construindo imagens dos microserviços..."
    
    # Construir Quarter
    print_status "Construindo Quarter..."
    cd quarter && docker build -t quarter:latest . && cd ..
    
    # Construir Harbor
    print_status "Construindo Harbor..."
    cd harbor && docker build -t harbor:latest . && cd ..
    
    # Construir Guardian
    print_status "Construindo Guardian..."
    cd guardian && docker build -t guardian:latest . && cd ..
    
    # Construir Skipper
    print_status "Construindo Skipper..."
    cd skipper && docker build -t skipper:latest . && cd ..
    
    # Construir Beacon
    print_status "Construindo Beacon..."
    cd beacon && docker build -t beacon:latest . && cd ..
    
    # Construir Fisher (se existir)
    if [ -d "fisher" ]; then
        print_status "Construindo Fisher..."
        cd fisher && docker build -t fisher:latest . && cd ..
    fi
    
    # Construir Tollgate (se existir)
    if [ -d "tollgate" ]; then
        print_status "Construindo Tollgate..."
        cd tollgate && docker build -t tollgate:latest . && cd ..
    fi
    
    # Construir Ledger (se existir)
    if [ -d "ledger" ]; then
        print_status "Construindo Ledger..."
        cd ledger && docker build -t ledger:latest . && cd ..
    fi
    
    print_success "Todas as imagens construídas"
}

# Função para iniciar com Docker Compose
start_ecosystem() {
    print_status "Iniciando ecossistema Canonika..."
    
    # Criar rede se não existir
    docker network create canonika-network 2>/dev/null || true
    
    # Iniciar com Docker Compose
    docker-compose up -d
    
    print_success "Ecosystem iniciado com Docker Compose"
}

# Função para verificar status
check_status() {
    print_status "Verificando status dos serviços..."
    
    echo ""
    echo "=== STATUS DOS SERVIÇOS ==="
    docker-compose ps
    
    echo ""
    echo "=== LOGS DOS SERVIÇOS ==="
    docker-compose logs --tail=10
}

# Função para mostrar URLs
show_urls() {
    echo ""
    echo "=== URLs DOS SERVIÇOS ==="
    echo "Quarter (Login):     http://localhost"
    echo "Harbor (Dashboard):  http://localhost:3701"
    echo "Guardian (Security): http://localhost:3705"
    echo "Skipper (Navigation): http://localhost:3702"
    echo "Beacon (Monitoring): http://localhost:3703"
    echo "Fisher (Data):       http://localhost:3706"
    echo "Tollgate (Gateway):  http://localhost:3707"
    echo "Ledger (Finance):    http://localhost:3708"
    echo ""
    echo "=== SERVIÇOS DE INFRAESTRUTURA ==="
    echo "Keycloak:            http://localhost:8080"
    echo "PostgreSQL:          localhost:5432"
    echo "Redis:               localhost:6379"
    echo "OPA:                 http://localhost:8181"
    echo "ClickHouse:          http://localhost:8123"
}

# Função para parar tudo
stop_ecosystem() {
    print_status "Parando ecossistema Canonika..."
    docker-compose down
    print_success "Ecosystem parado"
}

# Função para limpar tudo
clean_ecosystem() {
    print_status "Limpando ecossistema Canonika..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Ecosystem limpo"
}

# Menu principal
show_menu() {
    echo ""
    echo "=== CANONIKA ECOSYSTEM MANAGER ==="
    echo "1. Iniciar ecossistema completo"
    echo "2. Parar ecossistema"
    echo "3. Verificar status"
    echo "4. Mostrar URLs"
    echo "5. Limpar tudo"
    echo "6. Reconstruir imagens"
    echo "7. Sair"
    echo ""
    read -p "Escolha uma opção: " choice
}

# Função principal
main() {
    check_docker
    
    case "${1:-}" in
        "start")
            stop_existing
            build_images
            start_ecosystem
            check_status
            show_urls
            ;;
        "stop")
            stop_ecosystem
            ;;
        "status")
            check_status
            ;;
        "urls")
            show_urls
            ;;
        "clean")
            clean_ecosystem
            ;;
        "build")
            build_images
            ;;
        "menu")
            while true; do
                show_menu
                case $choice in
                    1)
                        stop_existing
                        build_images
                        start_ecosystem
                        check_status
                        show_urls
                        ;;
                    2)
                        stop_ecosystem
                        ;;
                    3)
                        check_status
                        ;;
                    4)
                        show_urls
                        ;;
                    5)
                        clean_ecosystem
                        ;;
                    6)
                        build_images
                        ;;
                    7)
                        print_status "Saindo..."
                        exit 0
                        ;;
                    *)
                        print_error "Opção inválida"
                        ;;
                esac
                echo ""
                read -p "Pressione Enter para continuar..."
            done
            ;;
        *)
            echo "Uso: $0 {start|stop|status|urls|clean|build|menu}"
            echo ""
            echo "Comandos:"
            echo "  start  - Iniciar ecossistema completo"
            echo "  stop   - Parar ecossistema"
            echo "  status - Verificar status"
            echo "  urls   - Mostrar URLs"
            echo "  clean  - Limpar tudo"
            echo "  build  - Reconstruir imagens"
            echo "  menu   - Menu interativo"
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@" 