#!/bin/sh

# Script de inicialização para o Beacon
# Garante que tanto o uvicorn quanto o nginx rodem

echo "🚀 Iniciando Beacon WebSocket Broker..."

# Iniciar uvicorn em background
echo "📡 Iniciando backend uvicorn..."
cd /app/api
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
UVICORN_PID=$!

# Aguardar um pouco para o uvicorn inicializar
sleep 3

# Verificar se o uvicorn está rodando
if ! kill -0 $UVICORN_PID 2>/dev/null; then
    echo "❌ Erro: uvicorn não iniciou corretamente"
    exit 1
fi

echo "✅ Backend uvicorn iniciado (PID: $UVICORN_PID)"

# Iniciar nginx
echo "🌐 Iniciando nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

echo "✅ Nginx iniciado (PID: $NGINX_PID)"
echo "🎉 Beacon WebSocket Broker está rodando!"

# Aguardar qualquer processo terminar
wait 