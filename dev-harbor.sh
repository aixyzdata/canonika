#!/bin/bash

echo "🚀 Iniciando Harbor em modo de desenvolvimento..."
echo "📱 Acesse: http://localhost:3000"
echo "🔄 Hot reload ativado - mudanças serão aplicadas automaticamente"
echo "⏹️  Pressione Ctrl+C para parar"

cd harbor/web
npm run dev 