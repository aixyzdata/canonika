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
RUN pip install --no-cache-dir fastapi uvicorn python-jose[cryptography]

# Etapa 3: Nginx + integração
FROM nginx:1.25-alpine
WORKDIR /app
COPY --from=frontend-build /app/web/dist /app/web
COPY --from=backend /app/api /app/api
COPY beacon/nginx/nginx.conf /etc/nginx/nginx.conf

# Uvicorn para backend
RUN apk add --no-cache python3 py3-pip
RUN pip install --break-system-packages fastapi uvicorn python-jose[cryptography]

EXPOSE 80

CMD ["/bin/sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"] 