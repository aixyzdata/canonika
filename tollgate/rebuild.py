#!/usr/bin/env python3
"""
Script de rebuild para o microserviço Tollgate
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
    print("🔧 Rebuild do Tollgate...")
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("Dockerfile"):
        print("❌ Erro: Dockerfile não encontrado. Execute este script no diretório do Tollgate.")
        sys.exit(1)
    
    # Parar e remover container existente
    print("🛑 Parando container existente...")
    subprocess.run("docker stop canonika-tollgate", shell=True)
    subprocess.run("docker rm canonika-tollgate", shell=True)
    
    # Remover imagem existente
    print("🗑️  Removendo imagem existente...")
    subprocess.run("docker rmi canonika-tollgate", shell=True)
    
    # Reconstruir imagem
    if not run_command(
        "docker build --no-cache -t canonika-tollgate .",
        "Reconstruindo imagem Docker"
    ):
        sys.exit(1)
    
    # Iniciar novo container
    if not run_command(
        "docker run -d --name canonika-tollgate -p 7732:80 canonika-tollgate",
        "Iniciando novo container"
    ):
        sys.exit(1)
    
    print("🎉 Rebuild do Tollgate concluído com sucesso!")
    print("\n📋 Informações de acesso:")
    print("🌐 Frontend: http://localhost:7732/web/")
    print("🔌 API: http://localhost:7732/api/")
    print("📚 Docs: http://localhost:7732/docs")

if __name__ == "__main__":
    main() 