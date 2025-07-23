#!/bin/sh

# Iniciar nginx em background
nginx

# Iniciar a API FastAPI
cd /app
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload 