# Etapa 1: Build do frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY fisher/web/package*.json ./web/
RUN cd web && npm install
COPY fisher/web/ ./web/
COPY shared/ ./shared/
RUN cd web && npm run build

# Etapa 2: Backend + Nginx
FROM python:3.11-slim
RUN apt-get update && apt-get install -y \
    nginx \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*
COPY fisher/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/web/dist/ /usr/share/nginx/html/
COPY fisher/api/ /app/api/
COPY fisher/web/ /app/web/

# Instalar dependências Python
WORKDIR /app/api
COPY fisher/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Criar diretórios necessários
RUN mkdir -p data/cnpj cache

# Expor portas
EXPOSE 3706 80

# Script de inicialização
COPY fisher/start.sh /start.sh
RUN chmod +x /start.sh

# Comando para iniciar a aplicação
CMD ["/start.sh"] 