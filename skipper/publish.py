#!/usr/bin/env python3
"""
Script de publish do Skipper
Publica as imagens Docker no registry
"""

import os
import sys
import subprocess
import json
from pathlib import Path

class SkipperPublisher:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.registry = "canonika"
        self.version = "1.0.0"
        
    def build_images(self):
        """Constrói as imagens Docker"""
        print("🔨 Construindo imagens...")
        
        try:
            # Build da API
            subprocess.run([
                "docker", "build", "-t", f"{self.registry}/skipper-api:{self.version}", 
                "-t", f"{self.registry}/skipper-api:latest", "."
            ], check=True, cwd=self.project_root)
            print("✅ Imagem skipper-api construída")
            
            # Build do Web
            subprocess.run([
                "docker", "build", "-t", f"{self.registry}/skipper-web:{self.version}", 
                "-t", f"{self.registry}/skipper-web:latest", "."
            ], check=True, cwd=self.project_root)
            print("✅ Imagem skipper-web construída")
            
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao construir imagens: {e}")
            return False
    
    def tag_images(self):
        """Adiciona tags às imagens"""
        print("🏷️ Adicionando tags...")
        
        images = [
            f"{self.registry}/skipper-api",
            f"{self.registry}/skipper-web"
        ]
        
        for image in images:
            try:
                # Tag com versão
                subprocess.run([
                    "docker", "tag", f"{image}:latest", f"{image}:{self.version}"
                ], check=True)
                print(f"✅ Tag {self.version} adicionada a {image}")
            except subprocess.CalledProcessError as e:
                print(f"❌ Erro ao adicionar tag: {e}")
                return False
        
        return True
    
    def push_images(self):
        """Envia as imagens para o registry"""
        print("📤 Enviando imagens para o registry...")
        
        images = [
            f"{self.registry}/skipper-api",
            f"{self.registry}/skipper-web"
        ]
        
        for image in images:
            try:
                # Push da versão
                subprocess.run([
                    "docker", "push", f"{image}:{self.version}"
                ], check=True)
                print(f"✅ {image}:{self.version} enviado")
                
                # Push da latest
                subprocess.run([
                    "docker", "push", f"{image}:latest"
                ], check=True)
                print(f"✅ {image}:latest enviado")
                
            except subprocess.CalledProcessError as e:
                print(f"❌ Erro ao enviar {image}: {e}")
                return False
        
        return True
    
    def create_manifest(self):
        """Cria manifest para multi-arch"""
        print("📋 Criando manifest...")
        
        try:
            # Manifest para API
            subprocess.run([
                "docker", "manifest", "create", 
                f"{self.registry}/skipper-api:{self.version}",
                f"{self.registry}/skipper-api:{self.version}"
            ], check=True)
            
            # Manifest para Web
            subprocess.run([
                "docker", "manifest", "create", 
                f"{self.registry}/skipper-web:{self.version}",
                f"{self.registry}/skipper-web:{self.version}"
            ], check=True)
            
            print("✅ Manifests criados")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao criar manifests: {e}")
            return False
    
    def update_changelog(self):
        """Atualiza o changelog"""
        print("📝 Atualizando changelog...")
        
        changelog_file = self.project_root / "CHANGELOG.md"
        
        if not changelog_file.exists():
            changelog_content = f"""# Changelog

## [{self.version}] - {self.get_current_date()}

### Added
- Versão inicial do Skipper
- API FastAPI com endpoints de simulação
- Frontend Vue.js com interface moderna
- Sistema de fontes dinâmicas
- Agentes CrewAI para navegação e extração

### Changed
- N/A

### Fixed
- N/A
"""
            with open(changelog_file, 'w') as f:
                f.write(changelog_content)
        else:
            # Adicionar nova versão ao changelog existente
            with open(changelog_file, 'r') as f:
                content = f.read()
            
            new_version = f"""## [{self.version}] - {self.get_current_date()}

### Added
- N/A

### Changed
- N/A

### Fixed
- N/A

"""
            updated_content = new_version + content
            
            with open(changelog_file, 'w') as f:
                f.write(updated_content)
        
        print("✅ Changelog atualizado")
        return True
    
    def get_current_date(self):
        """Retorna a data atual no formato YYYY-MM-DD"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d")
    
    def publish(self):
        """Executa o processo completo de publish"""
        print(f"🚀 Iniciando publish do Skipper v{self.version}...")
        
        # Construir imagens
        if not self.build_images():
            return False
        
        # Adicionar tags
        if not self.tag_images():
            return False
        
        # Enviar para registry
        if not self.push_images():
            return False
        
        # Criar manifests
        if not self.create_manifest():
            return False
        
        # Atualizar changelog
        if not self.update_changelog():
            return False
        
        print("🎉 Publish do Skipper concluído com sucesso!")
        print(f"📦 Versão {self.version} publicada no registry {self.registry}")
        
        return True

def main():
    publisher = SkipperPublisher()
    success = publisher.publish()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 