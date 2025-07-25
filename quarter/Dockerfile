# Dockerfile simplificado para Quarter - Desenvolvimento
FROM nginx:1.25-alpine

# Instalar Python e dependências
RUN apk add --no-cache \
    python3 \
    py3-pip \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    postgresql-dev

# Copiar configuração do nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos da aplicação
COPY web/ /usr/share/nginx/html/
COPY api/ /app/api/

# Instalar dependências Python se existirem
RUN if [ -f /app/api/requirements.txt ]; then \
        pip3 install --no-cache-dir -r /app/api/requirements.txt --break-system-packages; \
    fi

# Script de inicialização
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'nginx -g "daemon off;" &' >> /start.sh && \
    echo 'if [ -f /app/api/main.py ]; then' >> /start.sh && \
    echo '    cd /app/api && python3 main.py &' >> /start.sh && \
    echo 'fi' >> /start.sh && \
    echo 'wait' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"] 