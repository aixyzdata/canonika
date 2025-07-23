#!/usr/bin/env python3
"""
Script de rebuild para o microserviço Harbor
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
    print("🔧 Rebuild do Harbor...")
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("Dockerfile"):
        print("❌ Erro: Dockerfile não encontrado. Execute este script no diretório do Harbor.")
        sys.exit(1)
    
    # Parar e remover container existente
    print("🛑 Parando container existente...")
    subprocess.run("docker stop canonika-harbor", shell=True)
    subprocess.run("docker rm canonika-harbor", shell=True)
    
    # Remover imagem existente
    print("🗑️  Removendo imagem existente...")
    subprocess.run("docker rmi canonika-harbor", shell=True)
    
    # Reconstruir imagem
    if not run_command(
        "docker build --no-cache -t canonika-harbor .",
        "Reconstruindo imagem Docker"
    ):
        sys.exit(1)
    
    # Iniciar novo container
    if not run_command(
        "docker run -d --name canonika-harbor -p 7721:80 canonika-harbor",
        "Iniciando novo container"
    ):
        sys.exit(1)
    
    print("🎉 Rebuild do Harbor concluído com sucesso!")
    print("\n📋 Informações de acesso:")
    print("🌐 Portal: http://localhost:7721/web/")
    print("🔌 API: http://localhost:7721/api/")
    print("📚 Docs: http://localhost:7721/docs")

if __name__ == "__main__":
    main() 