# Etapa 1: Build do frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY web/package*.json ./web/
RUN cd web && npm install
COPY web/ ./web/
RUN cd web && npm run build

# Etapa 2: Backend Python
FROM python:3.11-slim AS backend
WORKDIR /app/api
COPY api/ ./
RUN pip install --no-cache-dir fastapi uvicorn python-jose[cryptography]

# Etapa 3: Nginx + integração
FROM nginx:1.25-alpine
WORKDIR /app
COPY --from=frontend-build /app/web/dist /app/web
COPY --from=backend /app/api /app/api
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY start.sh /app/start.sh

# Uvicorn para backend
RUN apk add --no-cache python3 py3-pip
RUN pip install --break-system-packages fastapi uvicorn python-jose[cryptography]

# Tornar o script executável
RUN chmod +x /app/start.sh

EXPOSE 3703

CMD ["/app/start.sh"] 