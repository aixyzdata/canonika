# Multi-stage build para Tollgate
FROM node:18-alpine AS frontend-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ ./
RUN npm run build

FROM python:3.11-alpine AS stage-1
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    postgresql-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

COPY api/ ./api/
COPY --from=frontend-builder /app/web/dist ./web/dist
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN apk add --no-cache nginx

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"] 