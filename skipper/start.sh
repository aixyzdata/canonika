#!/bin/sh

# Start backend
echo "Starting Skipper API..."
cd /app/api
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start NGINX
echo "Starting NGINX..."
nginx -g 'daemon off;' 