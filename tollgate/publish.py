#!/usr/bin/env python3
"""
Script de publicação para o microserviço Tollgate
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Executa um comando e trata erros"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} concluído")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao {description.lower()}: {e}")
        print(f"Stderr: {e.stderr}")
        return False

def main():
    print("🚀 Publicando Tollgate...")
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("Dockerfile"):
        print("❌ Erro: Dockerfile não encontrado. Execute este script no diretório do Tollgate.")
        sys.exit(1)
    
    # Construir imagem para produção
    if not run_command(
        "docker build -t canonika/tollgate:latest .",
        "Construindo imagem para produção"
    ):
        sys.exit(1)
    
    # Tag para versão específica (se necessário)
    version = "1.0.0"
    if not run_command(
        f"docker tag canonika/tollgate:latest canonika/tollgate:{version}",
        f"Tagging versão {version}"
    ):
        sys.exit(1)
    
    print("🎉 Tollgate preparado para publicação!")
    print("\n📋 Comandos para publicação:")
    print("1. Login no registry: docker login")
    print("2. Push da imagem: docker push canonika/tollgate:latest")
    print("3. Push da versão: docker push canonika/tollgate:1.0.0")
    print("\n📋 Para deploy em produção:")
    print("docker pull canonika/tollgate:latest")
    print("docker run -d --name tollgate-prod -p 7723:80 canonika/tollgate:latest")

if __name__ == "__main__":
    main() 