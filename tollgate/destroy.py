#!/usr/bin/env python3
"""
Script de destruição para o microserviço Tollgate
"""

import subprocess
import sys

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
    print("💥 Destruindo Tollgate...")
    
    # Parar e remover container
    print("🛑 Parando e removendo container...")
    subprocess.run("docker stop canonika-tollgate", shell=True)
    subprocess.run("docker rm canonika-tollgate", shell=True)
    
    # Remover imagem
    print("🗑️  Removendo imagem...")
    subprocess.run("docker rmi canonika-tollgate", shell=True)
    
    # Remover volumes relacionados (se houver)
    print("🗑️  Removendo volumes...")
    subprocess.run("docker volume prune -f", shell=True)
    
    print("🎉 Tollgate destruído com sucesso!")
    print("\n📋 Para recriar:")
    print("1. Execute: python build.py")
    print("2. Execute: python start.py")

if __name__ == "__main__":
    main() 