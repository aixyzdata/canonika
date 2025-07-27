#!/bin/bash

echo "🔨 Build do Harbor para produção..."
cd harbor/web
npm run build

echo "📁 Copiando build para o container..."
docker cp dist/. canonika_harbor:/usr/share/nginx/html/dist/

echo "✅ Build e deploy concluídos!"
echo "🌐 Acesse: http://localhost:3701" 