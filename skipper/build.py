#!/usr/bin/env python3
"""
Script de build do Skipper
Constrói as imagens Docker e prepara para deploy
"""

import os
import sys
import subprocess
import json
from pathlib import Path

class SkipperBuilder:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.api_dir = self.project_root / "api"
        self.web_dir = self.project_root / "web"
        
    def build_frontend(self):
        """Constrói o frontend Vue.js"""
        print("🎨 Construindo frontend...")
        
        try:
            # Instalar dependências
            subprocess.run(["npm", "install"], check=True, cwd=self.web_dir)
            print("✅ Dependências instaladas")
            
            # Build de produção
            subprocess.run(["npm", "run", "build"], check=True, cwd=self.web_dir)
            print("✅ Frontend construído")
            
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao construir frontend: {e}")
            return False
    
    def build_backend(self):
        """Prepara o backend para build"""
        print("🐍 Preparando backend...")
        
        try:
            # Verificar se requirements.txt existe
            requirements_file = self.api_dir / "requirements.txt"
            if not requirements_file.exists():
                print("❌ requirements.txt não encontrado")
                return False
            
            print("✅ Backend preparado")
            return True
        except Exception as e:
            print(f"❌ Erro ao preparar backend: {e}")
            return False
    
    def build_docker(self):
        """Constrói as imagens Docker"""
        print("🐳 Construindo imagens Docker...")
        
        try:
            # Build da imagem da API
            subprocess.run([
                "docker", "build", "-t", "skipper-api:latest", 
                "-f", "Dockerfile", "."
            ], check=True, cwd=self.project_root)
            print("✅ Imagem skipper-api construída")
            
            # Build da imagem do frontend
            subprocess.run([
                "docker", "build", "-t", "skipper-web:latest", 
                "-f", "web/Dockerfile", "."
            ], check=True, cwd=self.project_root)
            print("✅ Imagem skipper-web construída")
            
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao construir imagens Docker: {e}")
            return False
    
    def create_docker_compose(self):
        """Cria arquivo docker-compose.yml"""
        print("📝 Criando docker-compose.yml...")
        
        compose_content = """version: '3.8'

services:
  skipper-api:
    image: skipper-api:latest
    container_name: skipper-api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/skipper
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - skipper-network

  skipper-web:
    image: skipper-web:latest
    container_name: skipper-web
    ports:
      - "3000:80"
    depends_on:
      - skipper-api
    networks:
      - skipper-network

  postgres:
    image: postgres:15
    container_name: skipper-postgres
    environment:
      - POSTGRES_DB=skipper
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - skipper-network

  redis:
    image: redis:7-alpine
    container_name: skipper-redis
    ports:
      - "6379:6379"
    networks:
      - skipper-network

  milvus:
    image: milvusdb/milvus:v2.3.4
    container_name: skipper-milvus
    environment:
      - ETCD_ENDPOINTS=etcd:2379
    volumes:
      - milvus_data:/var/lib/milvus
    ports:
      - "19530:19530"
    networks:
      - skipper-network

  etcd:
    image: quay.io/coreos/etcd:v3.5.5
    container_name: skipper-etcd
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
    volumes:
      - etcd_data:/etcd
    networks:
      - skipper-network

volumes:
  postgres_data:
  milvus_data:
  etcd_data:

networks:
  skipper-network:
    driver: bridge
"""
        
        compose_file = self.project_root / "docker-compose.yml"
        with open(compose_file, 'w') as f:
            f.write(compose_content)
        
        print("✅ docker-compose.yml criado")
        return True
    
    def build(self):
        """Executa o build completo"""
        print("🚀 Iniciando build do Skipper...")
        
        # Build do frontend
        if not self.build_frontend():
            return False
        
        # Preparar backend
        if not self.build_backend():
            return False
        
        # Criar docker-compose
        if not self.create_docker_compose():
            return False
        
        # Build Docker (opcional)
        if len(sys.argv) > 1 and sys.argv[1] == "--docker":
            if not self.build_docker():
                return False
        
        print("🎉 Build do Skipper concluído com sucesso!")
        print("\n📋 Próximos passos:")
        print("1. Para desenvolvimento: python start.py")
        print("2. Para produção: docker-compose up -d")
        print("3. Para parar: python stop.py")
        
        return True

if __name__ == "__main__":
    builder = SkipperBuilder()
    success = builder.build()
    sys.exit(0 if success else 1) 