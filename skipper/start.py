#!/usr/bin/env python3
"""
Script de inicialização do Skipper
Inicia o backend FastAPI e frontend Vue.js
"""

import os
import sys
import subprocess
import time
import signal
import threading
from pathlib import Path

class SkipperDev:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.api_dir = self.project_root / "api"
        self.web_dir = self.project_root / "web"
        self.processes = []
        
    def check_dependencies(self):
        """Verifica se as dependências estão instaladas"""
        print("🔍 Verificando dependências...")
        
        # Verificar Python
        try:
            subprocess.run([sys.executable, "--version"], check=True, capture_output=True)
            print("✅ Python encontrado")
        except subprocess.CalledProcessError:
            print("❌ Python não encontrado")
            return False
            
        # Verificar Node.js
        try:
            subprocess.run(["node", "--version"], check=True, capture_output=True)
            print("✅ Node.js encontrado")
        except subprocess.CalledProcessError:
            print("❌ Node.js não encontrado")
            return False
            
        # Verificar npm
        try:
            subprocess.run(["npm", "--version"], check=True, capture_output=True)
            print("✅ npm encontrado")
        except subprocess.CalledProcessError:
            print("❌ npm não encontrado")
            return False
            
        return True
    
    def install_dependencies(self):
        """Instala as dependências do projeto"""
        print("📦 Instalando dependências...")
        
        # Instalar dependências Python
        print("🐍 Instalando dependências Python...")
        try:
            subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", 
                str(self.api_dir / "requirements.txt")
            ], check=True, cwd=self.api_dir)
            print("✅ Dependências Python instaladas")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao instalar dependências Python: {e}")
            return False
            
        # Instalar dependências Node.js
        print("📦 Instalando dependências Node.js...")
        try:
            subprocess.run(["npm", "install"], check=True, cwd=self.web_dir)
            print("✅ Dependências Node.js instaladas")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao instalar dependências Node.js: {e}")
            return False
            
        return True
    
    def start_backend(self):
        """Inicia o backend FastAPI"""
        print("🚀 Iniciando backend FastAPI...")
        
        try:
            process = subprocess.Popen([
                sys.executable, "-m", "uvicorn", "main:app", 
                "--host", "0.0.0.0", "--port", "8000", "--reload"
            ], cwd=self.api_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            self.processes.append(("Backend", process))
            print("✅ Backend iniciado em http://localhost:8000")
            return True
        except Exception as e:
            print(f"❌ Erro ao iniciar backend: {e}")
            return False
    
    def start_frontend(self):
        """Inicia o frontend Vue.js"""
        print("🎨 Iniciando frontend Vue.js...")
        
        try:
            process = subprocess.Popen([
                "npm", "run", "dev"
            ], cwd=self.web_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            self.processes.append(("Frontend", process))
            print("✅ Frontend iniciado em http://localhost:3000")
            return True
        except Exception as e:
            print(f"❌ Erro ao iniciar frontend: {e}")
            return False
    
    def wait_for_services(self):
        """Aguarda os serviços ficarem disponíveis"""
        print("⏳ Aguardando serviços ficarem disponíveis...")
        
        import requests
        import time
        
        # Aguardar backend
        backend_ready = False
        for i in range(30):  # 30 segundos
            try:
                response = requests.get("http://localhost:8000/health", timeout=1)
                if response.status_code == 200:
                    backend_ready = True
                    print("✅ Backend está respondendo")
                    break
            except:
                pass
            time.sleep(1)
            
        if not backend_ready:
            print("⚠️ Backend pode não estar funcionando corretamente")
            
        # Aguardar frontend
        frontend_ready = False
        for i in range(30):  # 30 segundos
            try:
                response = requests.get("http://localhost:3000", timeout=1)
                if response.status_code == 200:
                    frontend_ready = True
                    print("✅ Frontend está respondendo")
                    break
            except:
                pass
            time.sleep(1)
            
        if not frontend_ready:
            print("⚠️ Frontend pode não estar funcionando corretamente")
    
    def print_status(self):
        """Imprime o status dos serviços"""
        print("\n" + "="*50)
        print("🚢 SKIPPER - STATUS DOS SERVIÇOS")
        print("="*50)
        print("📊 Backend API:  http://localhost:8000")
        print("🎨 Frontend Web: http://localhost:3000")
        print("📚 Documentação: http://localhost:8000/docs")
        print("="*50)
        print("💡 Pressione Ctrl+C para parar todos os serviços")
        print("="*50 + "\n")
    
    def signal_handler(self, signum, frame):
        """Manipulador de sinal para parar os serviços"""
        print("\n🛑 Parando serviços...")
        self.stop_all()
        sys.exit(0)
    
    def stop_all(self):
        """Para todos os processos"""
        for name, process in self.processes:
            try:
                print(f"🛑 Parando {name}...")
                process.terminate()
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                print(f"⚠️ Forçando parada do {name}...")
                process.kill()
            except Exception as e:
                print(f"❌ Erro ao parar {name}: {e}")
    
    def run(self):
        """Executa o ambiente de desenvolvimento"""
        print("🚢 Iniciando ambiente de desenvolvimento do Skipper...")
        
        # Verificar dependências
        if not self.check_dependencies():
            print("❌ Dependências não encontradas. Execute 'pip install -r requirements.txt' e 'npm install'")
            return False
        
        # Instalar dependências se necessário
        if not self.install_dependencies():
            print("❌ Erro ao instalar dependências")
            return False
        
        # Configurar handler de sinal
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        # Iniciar serviços
        if not self.start_backend():
            return False
            
        if not self.start_frontend():
            self.stop_all()
            return False
        
        # Aguardar serviços
        self.wait_for_services()
        
        # Imprimir status
        self.print_status()
        
        # Manter rodando
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.signal_handler(signal.SIGINT, None)

if __name__ == "__main__":
    skipper = SkipperDev()
    skipper.run() 