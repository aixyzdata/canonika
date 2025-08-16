#!/bin/bash

echo "🚀 Iniciando Fisher Service..."

# Iniciar o backend Python em background
echo "🐍 Iniciando backend Python..."
cd /app/api
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Aguardar um pouco para o backend inicializar
sleep 3

# Verificar se o backend está rodando
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Erro: Backend não iniciou corretamente"
    exit 1
fi

echo "✅ Backend iniciado com PID: $BACKEND_PID na porta 8000"

# Iniciar o Nginx na porta 3706
echo "🌐 Iniciando Nginx na porta 3706..."
nginx -g "daemon off;" &
NGINX_PID=$!

echo "✅ Nginx iniciado com PID: $NGINX_PID na porta 3706"

# Função para limpeza ao sair
cleanup() {
    echo "🛑 Parando Fisher Service..."
    kill $BACKEND_PID 2>/dev/null
    kill $NGINX_PID 2>/dev/null
    exit 0
}

# Capturar sinais de interrupção
trap cleanup SIGTERM SIGINT

# Manter o container rodando
echo "🎣 Fisher Service rodando em http://localhost:3706"
wait 