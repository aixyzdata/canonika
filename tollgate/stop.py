#!/usr/bin/env python3
"""
Script de parada para o microserviço Tollgate
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

def check_container_status():
    """Verifica se o container está rodando"""
    try:
        result = subprocess.run(
            "docker ps --filter name=canonika-tollgate --format '{{.Names}}'",
            shell=True, capture_output=True, text=True
        )
        return "canonika-tollgate" in result.stdout
    except:
        return False

def main():
    print("🛑 Parando Tollgate...")
    
    # Verificar se o container está rodando
    if not check_container_status():
        print("ℹ️  Container não está rodando")
        return
    
    # Parar o container
    if not run_command("docker stop canonika-tollgate", "Parando container Tollgate"):
        sys.exit(1)
    
    # Remover o container
    if not run_command("docker rm canonika-tollgate", "Removendo container Tollgate"):
        sys.exit(1)
    
    print("🎉 Tollgate parado com sucesso!")

if __name__ == "__main__":
    main() 