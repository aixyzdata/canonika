# Multi-stage build for Skipper
FROM node:18-alpine AS frontend-builder

WORKDIR /app/web
COPY web/package*.json ./
RUN npm install

COPY web/ ./
RUN npm run build

# Backend stage
FROM python:3.11-alpine AS backend

WORKDIR /app/api

# Install system dependencies
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    postgresql-dev \
    && rm -rf /var/cache/apk/*

# Copy requirements and install Python dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY api/ .

# Final stage with NGINX
FROM nginx:1.25-alpine

# Install Python runtime and dependencies for backend
RUN apk add --no-cache \
    python3 \
    py3-pip \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    postgresql-dev

# Install Python packages directly in final stage
COPY api/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt --break-system-packages

# Copy backend code
COPY --from=backend /app/api /app/api

# Copy frontend build
COPY --from=frontend-builder /app/web/dist /usr/share/nginx/html

# Copy NGINX configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE 80

# Start script
CMD ["/start.sh"] 