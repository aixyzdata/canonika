# Etapa 1: Build do frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY fisher/web/package*.json ./web/
RUN cd web && npm install
COPY fisher/web/ ./web/
COPY shared/ ./shared/
RUN cd web && npm run build

# Etapa 2: Backend + Nginx
FROM nginx:1.25-alpine
RUN apk add --no-cache python3 py3-pip gcc musl-dev libffi-dev openssl-dev nodejs npm
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

# Expor porta
EXPOSE 3706

# Script de inicialização
COPY fisher/start.sh /start.sh
RUN chmod +x /start.sh

# Comando para iniciar a aplicação
CMD ["/start.sh"] 