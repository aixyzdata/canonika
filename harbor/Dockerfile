# Build simples para Harbor
FROM python:3.11-alpine

RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    postgresql-dev \
    nginx \
    && rm -rf /var/cache/apk/*

WORKDIR /app
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

COPY api/ ./api/
COPY web/dist ./web/dist
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"] 