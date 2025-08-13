#!/bin/bash

echo "🚀 Iniciando Fisher Service..."

# Iniciar o backend Python em background
echo "🐍 Iniciando backend Python..."
cd /app/api
python main.py &
BACKEND_PID=$!

# Aguardar um pouco para o backend inicializar
sleep 3

# Verificar se o backend está rodando
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Erro: Backend não iniciou corretamente"
    exit 1
fi

echo "✅ Backend iniciado com PID: $BACKEND_PID"

# Iniciar o Nginx
echo "🌐 Iniciando Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

echo "✅ Nginx iniciado com PID: $NGINX_PID"

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
echo "🎣 Fisher Service rodando..."
wait 