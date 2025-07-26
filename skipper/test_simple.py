#!/usr/bin/env python3
"""
Teste simples para verificar se as dependências estão funcionando
"""

import sys
import os

# Adicionar o diretório api ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))

def test_imports():
    """Testa se as importações básicas funcionam"""
    try:
        print("🔍 Testando importações...")
        
        # Teste 1: FastAPI
        print("   Testando FastAPI...")
        from fastapi import FastAPI
        print("   ✅ FastAPI importado com sucesso")
        
        # Teste 2: Pydantic
        print("   Testando Pydantic...")
        from pydantic import BaseModel, Field
        print("   ✅ Pydantic importado com sucesso")
        
        # Teste 3: Uvicorn
        print("   Testando Uvicorn...")
        import uvicorn
        print("   ✅ Uvicorn importado com sucesso")
        
        # Teste 4: Requests (para testes)
        print("   Testando Requests...")
        import requests
        print("   ✅ Requests importado com sucesso")
        
        print("✅ Todas as importações funcionaram!")
        return True
        
    except ImportError as e:
        print(f"❌ Erro de importação: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Erro inesperado: {str(e)}")
        return False

def test_basic_app():
    """Testa se consegue criar uma aplicação FastAPI básica"""
    try:
        print("\n🔍 Testando criação de app FastAPI...")
        
        from fastapi import FastAPI
        from pydantic import BaseModel, Field
        
        # Criar app
        app = FastAPI(title="Test App")
        
        # Criar modelo
        class TestModel(BaseModel):
            name: str = Field(default="test")
            value: int = Field(default=0)
        
        # Adicionar rota
        @app.get("/test")
        async def test_endpoint():
            return {"message": "test", "model": TestModel()}
        
        print("✅ App FastAPI criado com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar app: {str(e)}")
        return False

def main():
    """Executa todos os testes"""
    print("🚀 SKIPPER - TESTE SIMPLES")
    print("=" * 40)
    
    # Teste 1: Importações
    imports_ok = test_imports()
    
    # Teste 2: App básico
    app_ok = test_basic_app()
    
    # Resumo
    print("\n" + "=" * 40)
    print("📊 RESUMO DOS TESTES")
    print("=" * 40)
    print(f"Importações: {'✅ OK' if imports_ok else '❌ FALHOU'}")
    print(f"App Básico: {'✅ OK' if app_ok else '❌ FALHOU'}")
    
    if all([imports_ok, app_ok]):
        print("\n🎉 Todos os testes passaram!")
        print("💡 Agora você pode tentar iniciar a API:")
        print("   cd skipper/api")
        print("   source venv/bin/activate")
        print("   python main.py")
    else:
        print("\n⚠️  Alguns testes falharam.")
        print("💡 Tente reinstalar as dependências:")
        print("   cd skipper/api")
        print("   pip install -r requirements.txt --force-reinstall")

if __name__ == "__main__":
    main() 