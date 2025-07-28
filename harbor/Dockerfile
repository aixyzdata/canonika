# Dockerfile simplificado para Harbor - Desenvolvimento
FROM nginx:1.25-alpine

# Instalar dependências básicas
RUN apk add --no-cache \
    python3 \
    py3-pip \
    gcc \
    musl-dev \
    libffi-dev

# Copiar configuração do Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos da aplicação
COPY web/dist/ /usr/share/nginx/html/

# Criar script de inicialização
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Expor porta
EXPOSE 80

# Comando padrão
CMD ["/start.sh"] 