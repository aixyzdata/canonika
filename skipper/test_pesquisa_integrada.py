#!/usr/bin/env python3
"""
Teste de Pesquisa Integrada do Skipper

Este script testa uma pesquisa completa de produtos integrada com a view simulador
"""

import requests
import json
import time
from datetime import datetime
import sys

class SkipperPesquisaTest:
    def __init__(self, api_url="http://localhost:7722"):
        self.api_url = api_url
        self.session = requests.Session()
    
    def test_health(self):
        """Testa se a API está saudável"""
        try:
            response = self.session.get(f"{self.api_url}/health")
            if response.status_code == 200:
                print("✅ API está saudável")
                return True
            else:
                print(f"❌ API não está saudável: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erro ao conectar com API: {str(e)}")
            return False
    
    def test_sources(self):
        """Testa o endpoint de fontes"""
        try:
            response = self.session.get(f"{self.api_url}/api/sources")
            if response.status_code == 200:
                sources = response.json()
                print(f"✅ Fontes disponíveis: {len(sources)}")
                for source in sources:
                    print(f"   - {source['name']} ({source['type']})")
                return sources
            else:
                print(f"❌ Erro ao buscar fontes: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Erro ao buscar fontes: {str(e)}")
            return []
    
    def start_simulation(self, product_name, auto_select=True, sources=None):
        """Inicia uma simulação de pesquisa"""
        try:
            data = {
                "product_name": product_name,
                "auto_select_sources": auto_select
            }
            
            if not auto_select and sources:
                data["sources"] = sources
            
            print(f"🔄 Iniciando simulação para: {product_name}")
            response = self.session.post(f"{self.api_url}/api/simulation", json=data)
            
            if response.status_code == 200:
                simulation = response.json()
                print(f"✅ Simulação iniciada: {simulation['id']}")
                print(f"   Status: {simulation['status']}")
                print(f"   Fontes: {simulation['sources_used']}")
                return simulation
            else:
                print(f"❌ Erro ao iniciar simulação: {response.status_code}")
                print(f"   Resposta: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Erro ao iniciar simulação: {str(e)}")
            return None
    
    def monitor_simulation(self, simulation_id, max_wait=60):
        """Monitora o progresso da simulação"""
        print(f"⏳ Monitorando simulação: {simulation_id}")
        
        start_time = time.time()
        last_status = None
        
        while time.time() - start_time < max_wait:
            try:
                # Verificar status
                status_response = self.session.get(f"{self.api_url}/api/simulation/{simulation_id}")
                if status_response.status_code == 200:
                    current_status = status_response.json()
                    current_status_str = current_status['status']
                    
                    if current_status_str != last_status:
                        print(f"   Status: {current_status_str}")
                        last_status = current_status_str
                    
                    # Verificar logs
                    logs_response = self.session.get(f"{self.api_url}/api/simulation/{simulation_id}/logs")
                    if logs_response.status_code == 200:
                        logs = logs_response.json()
                        if logs:
                            latest_log = logs[-1]
                            timestamp = latest_log['timestamp']
                            agent = latest_log['agent_type']
                            source = latest_log['source_name']
                            status = latest_log['status']
                            message = latest_log['message']
                            
                            status_icon = "✅" if status == "completed" else "❌" if status == "failed" else "🔄"
                            print(f"   {status_icon} [{timestamp}] {agent.upper()} - {source}: {message}")
                    
                    # Verificar se terminou
                    if current_status_str in ['completed', 'failed']:
                        print(f"✅ Simulação {current_status_str}!")
                        return current_status
                
                time.sleep(2)
                
            except Exception as e:
                print(f"   Erro ao monitorar: {str(e)}")
                time.sleep(2)
        
        print(f"⏰ Timeout - simulação não terminou em {max_wait}s")
        return None
    
    def display_results(self, simulation_data):
        """Exibe os resultados da simulação"""
        if not simulation_data:
            print("❌ Nenhum resultado para exibir")
            return
        
        print("\n" + "="*60)
        print("🏆 RESULTADOS DA PESQUISA")
        print("="*60)
        
        # Informações básicas
        print(f"📦 Produto: {simulation_data.get('product_name', 'N/A')}")
        print(f"🆔 ID: {simulation_data.get('id', 'N/A')}")
        print(f"📅 Criado: {simulation_data.get('created_at', 'N/A')}")
        print(f"📊 Status: {simulation_data.get('status', 'N/A')}")
        
        # Produto consolidado
        consolidated = simulation_data.get('consolidated_product', {})
        if consolidated:
            print("\n🏆 PRODUTO CONSOLIDADO:")
            print("-" * 40)
            
            attributes = [
                ('nome', 'Nome'),
                ('marca', 'Marca'),
                ('preco', 'Preço'),
                ('categoria', 'Categoria'),
                ('descricao', 'Descrição'),
                ('especificacoes', 'Especificações'),
                ('disponibilidade', 'Disponibilidade'),
                ('dimensoes', 'Dimensões'),
                ('peso', 'Peso'),
                ('volume', 'Volume'),
                ('score_global', 'Score Global')
            ]
            
            for key, label in attributes:
                value = consolidated.get(key, 'N/A')
                if key == 'score_global' and isinstance(value, (int, float)):
                    value = f"{value:.2f}"
                print(f"   {label}: {value}")
        
        # Resultados por fonte
        results = simulation_data.get('results', {})
        if results:
            print(f"\n📋 RESULTADOS POR FONTE ({len(results)} fontes):")
            print("-" * 40)
            
            for source_name, result in results.items():
                print(f"\n   🔍 {source_name}:")
                score = result.get('score_confianca', 0)
                print(f"      Score: {score:.2f}")
                print(f"      Nome: {result.get('nome', 'N/A')}")
                print(f"      Marca: {result.get('marca', 'N/A')}")
                print(f"      Preço: {result.get('preco', 'N/A')}")
                print(f"      Categoria: {result.get('categoria', 'N/A')}")
        
        # Logs finais
        logs_response = self.session.get(f"{self.api_url}/api/simulation/{simulation_data['id']}/logs")
        if logs_response.status_code == 200:
            logs = logs_response.json()
            if logs:
                print(f"\n📝 ÚLTIMOS LOGS ({len(logs)} total):")
                print("-" * 40)
                
                for log in logs[-10:]:  # Últimos 10 logs
                    timestamp = log['timestamp']
                    agent = log['agent_type'].upper()
                    source = log['source_name']
                    status = log['status']
                    message = log['message']
                    
                    status_icon = "✅" if status == "completed" else "❌" if status == "failed" else "🔄"
                    print(f"   {status_icon} [{timestamp}] {agent} - {source}: {message}")
    
    def run_complete_test(self, product_name, auto_select=True, sources=None):
        """Executa um teste completo de pesquisa"""
        print("🚀 SKIPPER - TESTE DE PESQUISA INTEGRADA")
        print("=" * 60)
        
        # Teste 1: Health check
        print("\n1️⃣ Verificando saúde da API...")
        if not self.test_health():
            return False
        
        # Teste 2: Verificar fontes
        print("\n2️⃣ Verificando fontes disponíveis...")
        available_sources = self.test_sources()
        if not available_sources:
            return False
        
        # Teste 3: Iniciar simulação
        print(f"\n3️⃣ Iniciando pesquisa para: {product_name}")
        simulation = self.start_simulation(product_name, auto_select, sources)
        if not simulation:
            return False
        
        # Teste 4: Monitorar progresso
        print("\n4️⃣ Monitorando progresso...")
        final_result = self.monitor_simulation(simulation['id'])
        
        # Teste 5: Exibir resultados
        print("\n5️⃣ Exibindo resultados...")
        self.display_results(final_result)
        
        print("\n" + "=" * 60)
        print("🎉 TESTE CONCLUÍDO!")
        print("=" * 60)
        
        return True

def main():
    """Função principal"""
    if len(sys.argv) < 2:
        print("Uso: python test_pesquisa_integrada.py <produto> [auto_select] [fonte1,fonte2,...]")
        print("Exemplo: python test_pesquisa_integrada.py 'iPhone 15' true")
        print("Exemplo: python test_pesquisa_integrada.py 'Samsung Galaxy' false 1,2")
        sys.exit(1)
    
    product_name = sys.argv[1]
    auto_select = True if len(sys.argv) < 3 else sys.argv[2].lower() == 'true'
    sources = None
    
    if not auto_select and len(sys.argv) > 3:
        try:
            sources = [int(s.strip()) for s in sys.argv[3].split(',')]
        except ValueError:
            print("❌ Erro: IDs das fontes devem ser números separados por vírgula")
            sys.exit(1)
    
    # Criar instância do teste
    tester = SkipperPesquisaTest()
    
    # Executar teste
    success = tester.run_complete_test(product_name, auto_select, sources)
    
    if success:
        print("✅ Teste executado com sucesso!")
        sys.exit(0)
    else:
        print("❌ Teste falhou!")
        sys.exit(1)

if __name__ == "__main__":
    main() 