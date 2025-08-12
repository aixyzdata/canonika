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

# Verificar se DEV_MODE está ativado
if [ "$DEV_MODE" = "true" ]; then
    echo "🎨 Iniciando Vite em modo de desenvolvimento..."
    cd /app/web
    npm run dev &
    VITE_PID=$!
    
    # Aguardar um pouco para o Vite inicializar
    sleep 5
    
    # Verificar se o Vite está rodando
    if ! kill -0 $VITE_PID 2>/dev/null; then
        echo "❌ Erro: Vite não iniciou corretamente"
        exit 1
    fi
    
    echo "✅ Vite iniciado em modo de desenvolvimento (PID: $VITE_PID)"
    
    # Configurar nginx para modo de desenvolvimento
    echo "🔧 Configurando nginx para modo de desenvolvimento..."
    cat > /etc/nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    upstream backend {
        server 127.0.0.1:8000;
    }

    upstream vite {
        server 127.0.0.1:5173;
    }

    server {
        listen 3703;
        server_name localhost;

        # API endpoints - devem vir antes do frontend
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Endpoints diretos do backend
        location ~ ^/(health|metrics|topics|clients|events|help)$ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket endpoint
        location /ws/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Frontend - proxy para Vite em desenvolvimento
        location / {
            proxy_pass http://vite;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
EOF
else
    echo "📦 Usando build estático"
fi

# Iniciar nginx
echo "🌐 Iniciando nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

echo "✅ Nginx iniciado (PID: $NGINX_PID)"
echo "🎉 Beacon WebSocket Broker está rodando!"

# Aguardar qualquer processo terminar
wait 