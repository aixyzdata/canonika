#!/usr/bin/env python3
"""
Script de teste para a simulação do Skipper

Este script testa o pipeline completo de agentes CrewAI:
1. Busca de links
2. Navegação e extração de conteúdo
3. Extração de atributos
4. Consolidação de resultados
"""

import asyncio
import sys
import os
from datetime import datetime

# Adicionar o diretório api ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))

from api.services.simulation_service import simulation_service
from api.agents.crew_agents import skipper_agents

async def test_simulation():
    """Testa uma simulação completa"""
    
    print("🚀 Iniciando teste de simulação do Skipper...")
    print("=" * 50)
    
    # Configuração de teste
    product_name = "iPhone 15"
    simulation_id = f"test_sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Configurações de fontes de teste
    source_configs = [
        {
            "name": "Amazon",
            "type": "marketplace",
            "base_url": "https://www.amazon.com.br",
            "search_prompt": "Pesquise por {product} no Amazon Brasil",
            "navigation_prompt": "Acesse a página do produto e extraia o conteúdo",
            "extraction_prompt": "Extraia os atributos do produto: nome, marca, preço, descrição",
            "recommendation_tags": ["eletronicos", "smartphones", "tecnologia"],
            "is_active": True
        },
        {
            "name": "Mercado Livre",
            "type": "marketplace", 
            "base_url": "https://www.mercadolivre.com.br",
            "search_prompt": "Busque por {product} no Mercado Livre",
            "navigation_prompt": "Navegue até a página do produto",
            "extraction_prompt": "Extraia informações do produto: título, preço, especificações",
            "recommendation_tags": ["geral", "usados", "novos"],
            "is_active": True
        }
    ]
    
    try:
        print(f"📦 Produto: {product_name}")
        print(f"🆔 ID da Simulação: {simulation_id}")
        print(f"🔍 Fontes: {[source['name'] for source in source_configs]}")
        print()
        
        # Iniciar simulação
        print("🔄 Iniciando simulação...")
        result = await simulation_service.start_simulation(
            simulation_id, 
            product_name, 
            source_configs
        )
        
        print(f"✅ Simulação iniciada com status: {result.get('status', 'unknown')}")
        print()
        
        # Aguardar conclusão
        print("⏳ Aguardando conclusão da simulação...")
        max_wait = 60  # segundos
        wait_time = 0
        
        while wait_time < max_wait:
            status = simulation_service.get_simulation_status(simulation_id)
            if status and status.get('status') in ['completed', 'failed']:
                break
            
            await asyncio.sleep(2)
            wait_time += 2
            print(f"⏱️  Aguardando... ({wait_time}s)")
        
        # Obter resultado final
        final_result = simulation_service.get_simulation_status(simulation_id)
        logs = simulation_service.get_simulation_logs(simulation_id)
        
        print()
        print("📊 RESULTADOS DA SIMULAÇÃO")
        print("=" * 50)
        
        if final_result:
            print(f"📈 Status: {final_result.get('status', 'unknown')}")
            print(f"📦 Produto: {final_result.get('product_name', 'N/A')}")
            print(f"🔍 Fontes consultadas: {final_result.get('sources_used', [])}")
            
            if final_result.get('consolidated_product'):
                consolidated = final_result['consolidated_product']
                print()
                print("🏆 PRODUTO CONSOLIDADO:")
                print(f"   Nome: {consolidated.get('nome', 'N/A')}")
                print(f"   Marca: {consolidated.get('marca', 'N/A')}")
                print(f"   Preço: {consolidated.get('preco', 'N/A')}")
                print(f"   Categoria: {consolidated.get('categoria', 'N/A')}")
                print(f"   Score Global: {consolidated.get('score_global', 0):.2f}")
            
            if final_result.get('results'):
                print()
                print("📋 RESULTADOS POR FONTE:")
                for source_name, result in final_result['results'].items():
                    print(f"   {source_name}:")
                    print(f"     - Score: {result.get('score_confianca', 0):.2f}")
                    print(f"     - Nome: {result.get('nome', 'N/A')}")
                    print(f"     - Marca: {result.get('marca', 'N/A')}")
                    print(f"     - Preço: {result.get('preco', 'N/A')}")
        
        print()
        print("📝 LOGS DOS AGENTES:")
        print("=" * 50)
        
        for log in logs:
            timestamp = log.get('timestamp', datetime.now()).strftime('%H:%M:%S')
            agent_type = log.get('agent_type', 'unknown').upper()
            source = log.get('source_name', 'unknown')
            status = log.get('status', 'unknown')
            message = log.get('message', '')
            
            status_icon = "✅" if status == "completed" else "❌" if status == "failed" else "🔄"
            
            print(f"{status_icon} [{timestamp}] {agent_type} - {source}: {message}")
        
        print()
        print("🎉 Teste concluído!")
        
    except Exception as e:
        print(f"❌ Erro durante o teste: {str(e)}")
        import traceback
        traceback.print_exc()

async def test_individual_agents():
    """Testa os agentes individualmente"""
    
    print("🧪 Testando agentes individualmente...")
    print("=" * 50)
    
    product_name = "Samsung Galaxy"
    source_config = {
        "name": "Amazon",
        "type": "marketplace",
        "base_url": "https://www.amazon.com.br",
        "search_prompt": "Pesquise por {product} no Amazon Brasil",
        "navigation_prompt": "Acesse a página do produto e extraia o conteúdo",
        "extraction_prompt": "Extraia os atributos do produto: nome, marca, preço, descrição",
        "recommendation_tags": ["eletronicos", "smartphones", "tecnologia"],
        "is_active": True
    }
    
    try:
        # Teste do agente de busca
        print("🔍 Testando agente de busca...")
        urls = await skipper_agents.search_product_links(product_name, source_config)
        print(f"   URLs encontradas: {len(urls)}")
        for url in urls[:3]:
            print(f"   - {url}")
        
        if urls:
            # Teste do agente de navegação
            print("\n🌐 Testando agente de navegação...")
            contents = await skipper_agents.navigate_and_extract_content(urls[:1], source_config)
            print(f"   Páginas processadas: {len(contents)}")
            
            if contents:
                # Teste do agente de extração
                print("\n📋 Testando agente de extração...")
                attributes = await skipper_agents.extract_product_attributes(contents, source_config)
                print(f"   Atributos extraídos: {len(attributes)}")
                for key, value in attributes.items():
                    if value:
                        print(f"   - {key}: {value}")
        
        print("\n✅ Teste dos agentes concluído!")
        
    except Exception as e:
        print(f"❌ Erro no teste dos agentes: {str(e)}")

if __name__ == "__main__":
    print("🚀 SKIPPER - TESTE DE SIMULAÇÃO")
    print("=" * 50)
    
    # Configurar variáveis de ambiente para teste
    os.environ.setdefault("OPENAI_API_KEY", "sk-mock-key-for-development")
    os.environ.setdefault("OPENAI_MODEL", "gpt-3.5-turbo")
    
    # Executar testes
    asyncio.run(test_individual_agents())
    print("\n" + "=" * 50 + "\n")
    asyncio.run(test_simulation()) 