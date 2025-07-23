#!/usr/bin/env python3
"""
Script de inicialização para o microserviço Tollgate
"""

import subprocess
import sys
import os
import time

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
    print("🚀 Iniciando Tollgate...")
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("Dockerfile"):
        print("❌ Erro: Dockerfile não encontrado. Execute este script no diretório do Tollgate.")
        sys.exit(1)
    
    # Verificar se o container já está rodando
    if check_container_status():
        print("⚠️  Container já está rodando. Parando primeiro...")
        if not run_command("docker stop canonika-tollgate", "Parando container existente"):
            sys.exit(1)
        time.sleep(2)
    
    # Remover container existente se houver
    run_command("docker rm -f canonika-tollgate", "Removendo container existente")
    
    # Iniciar o container
    if not run_command(
        "docker run -d --name canonika-tollgate -p 7732:80 canonika-tollgate",
        "Iniciando container Tollgate"
    ):
        sys.exit(1)
    
    # Aguardar inicialização
    print("⏳ Aguardando inicialização do serviço...")
    time.sleep(5)
    
    # Verificar status
    if check_container_status():
        print("🎉 Tollgate iniciado com sucesso!")
        print("\n📋 Informações de acesso:")
        print("🌐 Frontend: http://localhost:7732/web/")
        print("🔌 API: http://localhost:7732/api/")
        print("📚 Docs: http://localhost:7732/docs")
        print("💚 Health: http://localhost:7732/health")
        print("\n🔑 Credenciais de teste:")
        print("   Email: admin@canonika.io")
        print("   Senha: Admin@123")
        print("\n📊 Endpoints principais:")
        print("   GET  /api/credits/balance/{user_id}")
        print("   POST /api/credits/authorize")
        print("   POST /api/credits/revert")
        print("   POST /api/credits/add")
        print("   GET  /api/credits/transactions/{user_id}")
        print("   GET  /api/credits/plans")
        print("   GET  /api/credits/alerts/{user_id}")
    else:
        print("❌ Erro: Container não está rodando")
        sys.exit(1)

if __name__ == "__main__":
    main() 