#!/usr/bin/env python3
"""
Script de build para o microserviço Tollgate
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
    print("🚀 Iniciando build do Tollgate...")
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("Dockerfile"):
        print("❌ Erro: Dockerfile não encontrado. Execute este script no diretório do Tollgate.")
        sys.exit(1)
    
    # Construir a imagem Docker
    if not run_command(
        "docker build -t canonika-tollgate .",
        "Construindo imagem Docker"
    ):
        sys.exit(1)
    
    print("🎉 Build do Tollgate concluído com sucesso!")
    print("\n📋 Próximos passos:")
    print("1. Execute: python start.py")
    print("2. Acesse: http://localhost:7732/web/")
    print("3. Login: admin@canonika.io / Admin@123")

if __name__ == "__main__":
    main() 