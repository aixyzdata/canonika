# Etapa 1: Build do frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY beacon/web/package*.json ./web/
RUN cd web && npm install
COPY beacon/web/ ./web/
COPY shared/ ./shared/
RUN cd web && npm run build

# Etapa 2: Backend Python
FROM python:3.11-slim AS backend
WORKDIR /app/api
COPY beacon/api/ ./
RUN pip install --no-cache-dir fastapi uvicorn python-jose[cryptography] redis PyJWT

# Etapa 3: Nginx + integração
FROM nginx:1.25-alpine
WORKDIR /app
COPY --from=frontend-build /app/web/dist /app/web
COPY --from=backend /app/api /app/api
COPY beacon/nginx/nginx.conf /etc/nginx/nginx.conf
COPY beacon/start.sh /app/start.sh

# Instalar Node.js e npm para desenvolvimento
RUN apk add --no-cache nodejs npm python3 py3-pip
RUN pip install --break-system-packages fastapi uvicorn python-jose[cryptography] redis PyJWT

# Copiar arquivos do frontend para desenvolvimento
COPY beacon/web/package*.json ./web/
COPY beacon/web/ ./web/
COPY shared/ ./shared/

# Instalar dependências do frontend
RUN cd web && npm install

# Tornar o script executável
RUN chmod +x /app/start.sh

EXPOSE 3703

CMD ["/app/start.sh"] 