# Multi-stage build para Quartermaster
FROM node:18-alpine AS frontend-builder

WORKDIR /app/web
COPY web/package*.json ./
RUN npm install

COPY web/ ./
RUN npm run build

# Backend stage
FROM python:3.11-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copiar requirements e instalar dependências Python
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

# Copiar código do backend
COPY api/ ./api/

# Copiar frontend buildado
COPY --from=frontend-builder /app/web/dist ./web/dist

# Copiar configuração do nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Instalar nginx
RUN apk add --no-cache nginx

# Expor porta
EXPOSE 80

# Script de inicialização
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"] 