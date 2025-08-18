# Etapa 1: Backend Python
FROM python:3.11-slim AS backend
WORKDIR /app/api
COPY api/ ./
RUN pip install --no-cache-dir fastapi uvicorn aiohttp aiofiles beautifulsoup4 sqlalchemy asyncpg pandas httpx websockets

# Etapa 2: Nginx + integração
FROM nginx:1.25-alpine
WORKDIR /app
COPY web/dist /usr/share/nginx/html/dist
COPY --from=backend /app/api /app/api
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY start.sh /app/start.sh

# Instalar Python para o backend
RUN apk add --no-cache python3 py3-pip bash
RUN pip install --break-system-packages fastapi uvicorn aiohttp aiofiles beautifulsoup4 sqlalchemy asyncpg pandas httpx websockets

# Criar diretórios necessários
RUN mkdir -p /app/api/data/cnpj /app/api/cache

# Tornar o script executável
RUN chmod +x /app/start.sh

EXPOSE 3706

CMD ["/bin/bash", "/app/start.sh"] 