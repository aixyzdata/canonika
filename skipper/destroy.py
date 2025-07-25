#!/usr/bin/env python3
"""
Script de destroy do Skipper
Remove containers, imagens e volumes Docker
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def stop_containers():
    """Para e remove containers Docker"""
    print("🛑 Parando containers...")
    
    try:
        # Parar containers
        subprocess.run(["docker-compose", "down"], check=True, cwd=Path(__file__).parent)
        print("✅ Containers parados")
    except subprocess.CalledProcessError:
        print("⚠️ Nenhum container encontrado")

def remove_images():
    """Remove imagens Docker do Skipper"""
    print("🗑️ Removendo imagens...")
    
    images_to_remove = ["skipper-api:latest", "skipper-web:latest"]
    
    for image in images_to_remove:
        try:
            subprocess.run(["docker", "rmi", image], check=True)
            print(f"✅ Imagem {image} removida")
        except subprocess.CalledProcessError:
            print(f"⚠️ Imagem {image} não encontrada")

def remove_volumes():
    """Remove volumes Docker"""
    print("🗑️ Removendo volumes...")
    
    volumes_to_remove = [
        "skipper_postgres_data",
        "skipper_milvus_data", 
        "skipper_etcd_data"
    ]
    
    for volume in volumes_to_remove:
        try:
            subprocess.run(["docker", "volume", "rm", volume], check=True)
            print(f"✅ Volume {volume} removido")
        except subprocess.CalledProcessError:
            print(f"⚠️ Volume {volume} não encontrado")

def remove_networks():
    """Remove redes Docker"""
    print("🗑️ Removendo redes...")
    
    networks_to_remove = ["skipper_skipper-network"]
    
    for network in networks_to_remove:
        try:
            subprocess.run(["docker", "network", "rm", network], check=True)
            print(f"✅ Rede {network} removida")
        except subprocess.CalledProcessError:
            print(f"⚠️ Rede {network} não encontrada")

def clean_project_files():
    """Remove arquivos de build do projeto"""
    print("🧹 Limpando arquivos do projeto...")
    
    project_root = Path(__file__).parent
    web_dir = project_root / "web"
    
    # Remover arquivos de build
    build_files = [
        web_dir / "dist",
        web_dir / "node_modules",
        project_root / "docker-compose.yml"
    ]
    
    for file_path in build_files:
        if file_path.exists():
            if file_path.is_dir():
                shutil.rmtree(file_path)
            else:
                file_path.unlink()
            print(f"✅ {file_path.name} removido")

def main():
    print("💥 Iniciando destroy do Skipper...")
    
    # Confirmar ação
    response = input("⚠️ Tem certeza que deseja destruir o ambiente do Skipper? (y/N): ")
    if response.lower() != 'y':
        print("❌ Operação cancelada")
        return
    
    # Executar limpeza
    stop_containers()
    remove_images()
    remove_volumes()
    remove_networks()
    clean_project_files()
    
    print("🎉 Destroy do Skipper concluído!")
    print("💡 Para recriar o ambiente, execute: python build.py")

if __name__ == "__main__":
    main() 