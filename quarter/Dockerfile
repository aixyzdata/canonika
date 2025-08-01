# Etapa 1: Build do frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY web/package*.json ./web/
RUN cd web && npm install
COPY web/ ./web/
RUN cd web && npm run build

# Etapa 2: Backend + Nginx
FROM nginx:1.25-alpine
RUN apk add --no-cache python3 py3-pip gcc musl-dev libffi-dev openssl-dev postgresql-dev nodejs npm
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/web/dist/ /usr/share/nginx/html/
COPY api/ /app/api/
COPY web/ /app/web/
RUN if [ -f /app/api/requirements.txt ]; then \
        pip3 install --no-cache-dir -r /app/api/requirements.txt --break-system-packages; \
    fi
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'nginx -g "daemon off;" &' >> /start.sh && \
    echo 'if [ -f /app/api/main.py ]; then' >> /start.sh && \
    echo '    cd /app/api && python3 main.py &' >> /start.sh && \
    echo 'fi' >> /start.sh && \
    echo 'if [ "$DEV_MODE" = "true" ]; then' >> /start.sh && \
    echo '    cd /app/web && rm -rf node_modules package-lock.json && npm install && npm run dev &' >> /start.sh && \
    echo 'fi' >> /start.sh && \
    echo 'wait' >> /start.sh && \
    chmod +x /start.sh
EXPOSE 80 5174
CMD ["/start.sh"] 