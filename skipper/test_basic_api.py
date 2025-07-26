#!/usr/bin/env python3
"""
Teste básico da API do Skipper

Este script testa a API sem depender dos agentes CrewAI
"""

import requests
import json
import time
from datetime import datetime

def test_api_health():
    """Testa se a API está respondendo"""
    try:
        response = requests.get("http://localhost:7722/health")
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check falhou: {str(e)}")
        return False

def test_sources_endpoint():
    """Testa o endpoint de fontes"""
    try:
        response = requests.get("http://localhost:7722/api/sources")
        print(f"✅ Sources endpoint: {response.status_code}")
        sources = response.json()
        print(f"   Fontes encontradas: {len(sources)}")
        for source in sources:
            print(f"   - {source['name']} ({source['type']})")
        return True
    except Exception as e:
        print(f"❌ Sources endpoint falhou: {str(e)}")
        return False

def test_simulation_endpoint():
    """Testa o endpoint de simulação"""
    try:
        # Dados de teste
        simulation_data = {
            "product_name": "iPhone 15",
            "auto_select_sources": True
        }
        
        print("🔄 Iniciando simulação...")
        response = requests.post("http://localhost:7722/api/simulation", json=simulation_data)
        print(f"✅ Simulation endpoint: {response.status_code}")
        
        if response.status_code == 200:
            simulation = response.json()
            print(f"   ID da simulação: {simulation['id']}")
            print(f"   Status: {simulation['status']}")
            print(f"   Fontes: {simulation['sources_used']}")
            
            # Aguardar conclusão
            simulation_id = simulation['id']
            max_wait = 30
            wait_time = 0
            
            while wait_time < max_wait:
                time.sleep(2)
                wait_time += 2
                
                try:
                    status_response = requests.get(f"http://localhost:7722/api/simulation/{simulation_id}")
                    if status_response.status_code == 200:
                        current_status = status_response.json()
                        print(f"   Status atual: {current_status['status']}")
                        
                        if current_status['status'] in ['completed', 'failed']:
                            print("✅ Simulação concluída!")
                            
                            # Buscar logs
                            logs_response = requests.get(f"http://localhost:7722/api/simulation/{simulation_id}/logs")
                            if logs_response.status_code == 200:
                                logs = logs_response.json()
                                print(f"   Logs encontrados: {len(logs)}")
                                for log in logs[-5:]:  # Últimos 5 logs
                                    timestamp = log['timestamp']
                                    agent = log['agent_type']
                                    source = log['source_name']
                                    status = log['status']
                                    message = log['message']
                                    print(f"   [{timestamp}] {agent} - {source}: {message}")
                            
                            if current_status['status'] == 'completed' and current_status.get('consolidated_product'):
                                product = current_status['consolidated_product']
                                print("🏆 Produto consolidado:")
                                print(f"   Nome: {product.get('nome', 'N/A')}")
                                print(f"   Marca: {product.get('marca', 'N/A')}")
                                print(f"   Preço: {product.get('preco', 'N/A')}")
                                print(f"   Score: {product.get('score_global', 0):.2f}")
                            
                            break
                except Exception as e:
                    print(f"   Erro ao verificar status: {str(e)}")
            
            return True
        else:
            print(f"   Erro na resposta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Simulation endpoint falhou: {str(e)}")
        return False

def main():
    """Executa todos os testes"""
    print("🚀 SKIPPER - TESTE BÁSICO DA API")
    print("=" * 50)
    
    # Teste 1: Health check
    print("\n1️⃣ Testando health check...")
    health_ok = test_api_health()
    
    # Teste 2: Sources endpoint
    print("\n2️⃣ Testando endpoint de fontes...")
    sources_ok = test_sources_endpoint()
    
    # Teste 3: Simulation endpoint
    print("\n3️⃣ Testando endpoint de simulação...")
    simulation_ok = test_simulation_endpoint()
    
    # Resumo
    print("\n" + "=" * 50)
    print("📊 RESUMO DOS TESTES")
    print("=" * 50)
    print(f"Health Check: {'✅ OK' if health_ok else '❌ FALHOU'}")
    print(f"Sources API: {'✅ OK' if sources_ok else '❌ FALHOU'}")
    print(f"Simulation API: {'✅ OK' if simulation_ok else '❌ FALHOU'}")
    
    if all([health_ok, sources_ok, simulation_ok]):
        print("\n🎉 Todos os testes passaram!")
    else:
        print("\n⚠️  Alguns testes falharam. Verifique os logs acima.")

if __name__ == "__main__":
    main() 