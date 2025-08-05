#!/bin/bash

# Script de automação para testes do Beacon
# Executa testes BDD e TDD completos

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para verificar se o Beacon está rodando
check_beacon_running() {
    log_info "Verificando se o Beacon está rodando..."
    
    if ! docker ps | grep -q "canonika_beacon"; then
        log_warning "Beacon não está rodando. Iniciando..."
        cd /Users/thiagonicolussi/Projects/canonika/beacon
        docker run -d --name canonika_beacon -p 3703:80 beacon:latest
        sleep 10
    else
        log_success "Beacon está rodando"
    fi
}

# Função para verificar se o Quarter está rodando
check_quarter_running() {
    log_info "Verificando se o Quarter está rodando..."
    
    if ! docker ps | grep -q "canonika_quarter"; then
        log_warning "Quarter não está rodando. Iniciando..."
        docker run -d --name canonika_quarter -p 80:80 quarter:latest
        sleep 5
    else
        log_success "Quarter está rodando"
    fi
}

# Função para limpar relatórios antigos
clean_reports() {
    log_info "Limpando relatórios antigos..."
    rm -f cucumber-report.html cucumber-report.json performance-report.html integration-report.html
    rm -rf coverage/
    log_success "Relatórios limpos"
}

# Função para instalar dependências
install_dependencies() {
    log_info "Instalando dependências..."
    
    # Instalar dependências Node.js
    if [ ! -d "node_modules" ]; then
        log_info "Instalando dependências Node.js..."
        npm install
    fi
    
    # Instalar dependências Python
    if ! pip show pytest > /dev/null 2>&1; then
        log_info "Instalando dependências Python..."
        pip install -r requirements.txt
    fi
    
    log_success "Dependências instaladas"
}

# Função para executar testes BDD
run_bdd_tests() {
    log_info "Executando testes BDD..."
    
    # Testes de autenticação
    log_info "🧪 Testes de Autenticação..."
    npm run test:bdd:auth
    if [ $? -eq 0 ]; then
        log_success "Testes de autenticação passaram"
    else
        log_error "Testes de autenticação falharam"
        return 1
    fi
    
    # Testes de WebSocket
    log_info "🧪 Testes de WebSocket..."
    npm run test:bdd:websocket
    if [ $? -eq 0 ]; then
        log_success "Testes de WebSocket passaram"
    else
        log_error "Testes de WebSocket falharam"
        return 1
    fi
    
    # Testes de eventos e métricas
    log_info "🧪 Testes de Eventos e Métricas..."
    npm run test:bdd:events
    if [ $? -eq 0 ]; then
        log_success "Testes de eventos passaram"
    else
        log_error "Testes de eventos falharam"
        return 1
    fi
    
    # Testes de performance
    log_info "🧪 Testes de Performance..."
    npm run test:bdd:performance
    if [ $? -eq 0 ]; then
        log_success "Testes de performance passaram"
    else
        log_error "Testes de performance falharam"
        return 1
    fi
    
    # Testes de integração
    log_info "🧪 Testes de Integração..."
    npm run test:bdd:integration
    if [ $? -eq 0 ]; then
        log_success "Testes de integração passaram"
    else
        log_error "Testes de integração falharam"
        return 1
    fi
    
    log_success "Todos os testes BDD passaram!"
}

# Função para executar testes TDD
run_tdd_tests() {
    log_info "Executando testes TDD..."
    
    # Testes unitários JavaScript
    log_info "🧪 Testes Unitários JavaScript..."
    npm run test:unit
    if [ $? -eq 0 ]; then
        log_success "Testes unitários JavaScript passaram"
    else
        log_error "Testes unitários JavaScript falharam"
        return 1
    fi
    
    # Testes backend Python
    log_info "🧪 Testes Backend Python..."
    npm run test:backend
    if [ $? -eq 0 ]; then
        log_success "Testes backend Python passaram"
    else
        log_error "Testes backend Python falharam"
        return 1
    fi
    
    log_success "Todos os testes TDD passaram!"
}

# Função para gerar relatórios
generate_reports() {
    log_info "Gerando relatórios..."
    
    # Abrir relatórios no navegador
    if [ -f "cucumber-report.html" ]; then
        log_info "Abrindo relatório BDD..."
        open cucumber-report.html
    fi
    
    if [ -f "performance-report.html" ]; then
        log_info "Abrindo relatório de performance..."
        open performance-report.html
    fi
    
    if [ -f "integration-report.html" ]; then
        log_info "Abrindo relatório de integração..."
        open integration-report.html
    fi
    
    log_success "Relatórios gerados"
}

# Função para executar testes específicos
run_specific_tests() {
    case $1 in
        "auth")
            log_info "Executando apenas testes de autenticação..."
            npm run test:bdd:auth
            ;;
        "websocket")
            log_info "Executando apenas testes de WebSocket..."
            npm run test:bdd:websocket
            ;;
        "events")
            log_info "Executando apenas testes de eventos..."
            npm run test:bdd:events
            ;;
        "performance")
            log_info "Executando apenas testes de performance..."
            npm run test:bdd:performance
            ;;
        "integration")
            log_info "Executando apenas testes de integração..."
            npm run test:bdd:integration
            ;;
        "unit")
            log_info "Executando apenas testes unitários..."
            npm run test:unit
            ;;
        "backend")
            log_info "Executando apenas testes backend..."
            npm run test:backend
            ;;
        *)
            log_error "Tipo de teste inválido: $1"
            log_info "Tipos válidos: auth, websocket, events, performance, integration, unit, backend"
            exit 1
            ;;
    esac
}

# Função principal
main() {
    echo "🚀 Iniciando testes do Beacon WebSocket Broker..."
    echo "================================================"
    
    # Verificar argumentos
    if [ "$1" = "clean" ]; then
        clean_reports
        exit 0
    fi
    
    if [ "$1" = "setup" ]; then
        install_dependencies
        exit 0
    fi
    
    if [ "$1" = "report" ]; then
        generate_reports
        exit 0
    fi
    
    if [ -n "$1" ]; then
        run_specific_tests "$1"
        exit 0
    fi
    
    # Execução completa
    clean_reports
    install_dependencies
    check_quarter_running
    check_beacon_running
    
    # Executar testes
    log_info "Iniciando execução de testes..."
    
    # Executar testes BDD
    if run_bdd_tests; then
        log_success "Testes BDD concluídos com sucesso!"
    else
        log_error "Testes BDD falharam!"
        exit 1
    fi
    
    # Executar testes TDD
    if run_tdd_tests; then
        log_success "Testes TDD concluídos com sucesso!"
    else
        log_error "Testes TDD falharam!"
        exit 1
    fi
    
    # Gerar relatórios
    generate_reports
    
    echo ""
    echo "🎉 Todos os testes foram executados com sucesso!"
    echo "📊 Relatórios gerados:"
    echo "   - cucumber-report.html (BDD)"
    echo "   - performance-report.html (Performance)"
    echo "   - integration-report.html (Integração)"
    echo ""
    echo "📋 Resumo:"
    echo "   ✅ Testes de Autenticação"
    echo "   ✅ Testes de WebSocket"
    echo "   ✅ Testes de Eventos e Métricas"
    echo "   ✅ Testes de Performance"
    echo "   ✅ Testes de Integração"
    echo "   ✅ Testes Unitários JavaScript"
    echo "   ✅ Testes Backend Python"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   ./run-tests.sh auth        - Apenas testes de autenticação"
    echo "   ./run-tests.sh websocket   - Apenas testes de WebSocket"
    echo "   ./run-tests.sh events      - Apenas testes de eventos"
    echo "   ./run-tests.sh performance - Apenas testes de performance"
    echo "   ./run-tests.sh integration - Apenas testes de integração"
    echo "   ./run-tests.sh unit        - Apenas testes unitários"
    echo "   ./run-tests.sh backend     - Apenas testes backend"
    echo "   ./run-tests.sh clean       - Limpar relatórios"
    echo "   ./run-tests.sh setup       - Instalar dependências"
    echo "   ./run-tests.sh report      - Abrir relatórios"
}

# Executar função principal
main "$@" 