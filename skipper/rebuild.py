#!/usr/bin/env python3
"""
Script de rebuild do Skipper
Limpa e reconstrói o projeto
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def clean_project():
    """Limpa arquivos de build e cache"""
    print("🧹 Limpando projeto...")
    
    project_root = Path(__file__).parent
    web_dir = project_root / "web"
    
    # Limpar node_modules
    node_modules = web_dir / "node_modules"
    if node_modules.exists():
        shutil.rmtree(node_modules)
        print("✅ node_modules removido")
    
    # Limpar dist
    dist_dir = web_dir / "dist"
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
        print("✅ dist removido")
    
    # Limpar cache Python
    cache_dirs = [
        project_root / "__pycache__",
        project_root / "api" / "__pycache__",
        project_root / ".pytest_cache"
    ]
    
    for cache_dir in cache_dirs:
        if cache_dir.exists():
            shutil.rmtree(cache_dir)
            print(f"✅ {cache_dir.name} removido")
    
    # Limpar arquivos .pyc
    for pyc_file in project_root.rglob("*.pyc"):
        pyc_file.unlink()
        print(f"✅ {pyc_file.name} removido")

def main():
    print("🔄 Iniciando rebuild do Skipper...")
    
    # Limpar projeto
    clean_project()
    
    # Executar build
    print("🔨 Executando build...")
    result = subprocess.run([sys.executable, "build.py"], cwd=Path(__file__).parent)
    
    if result.returncode == 0:
        print("🎉 Rebuild concluído com sucesso!")
    else:
        print("❌ Erro durante rebuild")
        sys.exit(1)

if __name__ == "__main__":
    main() 