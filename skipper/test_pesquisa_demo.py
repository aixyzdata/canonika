#!/usr/bin/env python3
"""
Demonstração de Pesquisa Integrada do Skipper

Este script demonstra como seria uma pesquisa completa de produtos
sem depender do FastAPI para evitar problemas de compatibilidade
"""

import json
import asyncio
import random
import time
from datetime import datetime
from typing import Dict, List, Any, Optional

class SkipperPesquisaDemo:
    """Demonstração de pesquisa integrada do Skipper"""
    
    def __init__(self):
        self.mock_sources = [
            {"id": 1, "name": "Amazon", "type": "marketplace"},
            {"id": 2, "name": "Mercado Livre", "type": "marketplace"},
            {"id": 3, "name": "Google Shopping", "type": "buscador"}
        ]
        
        self.mock_products = {
            "iphone": [
                {
                    "nome": "iPhone 15 Pro Max 256GB",
                    "marca": "Apple",
                    "preco": "R$ 8.999,00",
                    "descricao": "iPhone 15 Pro Max com chip A17 Pro, câmera tripla de 48MP, tela de 6.7 polegadas Super Retina XDR OLED",
                    "categoria": "Smartphone",
                    "especificacoes": "Chip A17 Pro, 256GB, 6.7\", 48MP + 12MP + 12MP, iOS 17",
                    "disponibilidade": "Em estoque",
                    "dimensoes": "159.9 x 76.7 x 8.25 mm",
                    "peso": "221g",
                    "volume": "N/A",
                    "score_confianca": 0.95,
                    "url": "https://www.amazon.com.br/iphone-15-pro-max"
                },
                {
                    "nome": "iPhone 15 Pro 128GB",
                    "marca": "Apple",
                    "preco": "R$ 7.499,00",
                    "descricao": "iPhone 15 Pro com chip A17 Pro, câmera tripla de 48MP, tela de 6.1 polegadas Super Retina XDR OLED",
                    "categoria": "Smartphone",
                    "especificacoes": "Chip A17 Pro, 128GB, 6.1\", 48MP + 12MP + 12MP, iOS 17",
                    "disponibilidade": "Em estoque",
                    "dimensoes": "146.7 x 71.5 x 8.25 mm",
                    "peso": "187g",
                    "volume": "N/A",
                    "score_confianca": 0.92,
                    "url": "https://www.mercadolivre.com.br/iphone-15-pro"
                }
            ],
            "samsung": [
                {
                    "nome": "Samsung Galaxy S24 Ultra 256GB",
                    "marca": "Samsung",
                    "preco": "R$ 9.499,00",
                    "descricao": "Samsung Galaxy S24 Ultra com chip Snapdragon 8 Gen 3, câmera quádrupla de 200MP, S Pen integrada",
                    "categoria": "Smartphone",
                    "especificacoes": "Snapdragon 8 Gen 3, 256GB, 6.8\", 200MP + 12MP + 50MP + 10MP, Android 14",
                    "disponibilidade": "Em estoque",
                    "dimensoes": "163.4 x 79.0 x 8.6 mm",
                    "peso": "232g",
                    "volume": "N/A",
                    "score_confianca": 0.94,
                    "url": "https://shopping.google.com/samsung-galaxy-s24-ultra"
                }
            ],
            "macbook": [
                {
                    "nome": "MacBook Pro 14\" M3 Pro 512GB",
                    "marca": "Apple",
                    "preco": "R$ 18.999,00",
                    "descricao": "MacBook Pro 14 polegadas com chip M3 Pro, 512GB SSD, 18GB RAM unificada",
                    "categoria": "Notebook",
                    "especificacoes": "Chip M3 Pro, 512GB SSD, 18GB RAM, 14\" Liquid Retina XDR, macOS Sonoma",
                    "disponibilidade": "Em estoque",
                    "dimensoes": "312.6 x 221.2 x 15.5 mm",
                    "peso": "1.55kg",
                    "volume": "N/A",
                    "score_confianca": 0.96,
                    "url": "https://www.amazon.com.br/macbook-pro-14-m3"
                }
            ]
        }
        
        self.agent_logs = []
    
    async def simular_pesquisa_completa(self, product_name: str, auto_select: bool = True, sources: List[int] = None):
        """Simula uma pesquisa completa de produtos"""
        
        print("🚀 SKIPPER - DEMONSTRAÇÃO DE PESQUISA INTEGRADA")
        print("=" * 60)
        print(f"📦 Produto: {product_name}")
        print(f"🔍 Modo: {'Automático' if auto_select else 'Manual'}")
        print()
        
        # Determinar fontes
        if auto_select:
            selected_sources = self.mock_sources
            print("✅ Seleção automática de fontes ativada")
        else:
            selected_sources = [s for s in self.mock_sources if s["id"] in (sources or [])]
            print(f"✅ Fontes selecionadas: {[s['name'] for s in selected_sources]}")
        
        print(f"📊 Total de fontes: {len(selected_sources)}")
        print()
        
        # Iniciar simulação
        simulation_id = f"demo_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        print(f"🆔 ID da Simulação: {simulation_id}")
        print()
        
        # Log de início
        await self.log_agent_activity(simulation_id, "system", "Skipper", "started", 
                                    f"Iniciando simulação para '{product_name}'")
        
        results = {}
        
        # Processar cada fonte
        for source in selected_sources:
            source_name = source["name"]
            
            print(f"🔍 Processando fonte: {source_name}")
            
            # Simular busca
            await self.log_agent_activity(simulation_id, "search", source_name, "started",
                                        f"Buscando '{product_name}' em {source_name}")
            
            await asyncio.sleep(2)  # Simular tempo de busca
            
            await self.log_agent_activity(simulation_id, "search", source_name, "completed",
                                        f"Busca concluída em {source_name}")
            
            # Simular navegação
            await self.log_agent_activity(simulation_id, "navigation", source_name, "started",
                                        f"Navegando páginas de produtos em {source_name}")
            
            await asyncio.sleep(1.5)  # Simular tempo de navegação
            
            await self.log_agent_activity(simulation_id, "navigation", source_name, "completed",
                                        f"Navegação concluída em {source_name}")
            
            # Simular extração
            await self.log_agent_activity(simulation_id, "extraction", source_name, "started",
                                        f"Extraindo atributos em {source_name}")
            
            await asyncio.sleep(1)  # Simular tempo de extração
            
            # Gerar dados simulados
            product_key = product_name.lower().split()[0]
            mock_data = self.mock_products.get(product_key, self.mock_products.get("iphone", []))
            
            if mock_data:
                base_product = random.choice(mock_data).copy()
                base_product["source"] = source_name
                base_product["url"] = f"https://{source_name.lower().replace(' ', '')}.com/{product_name.lower().replace(' ', '-')}"
                
                # Variações de preço por fonte
                price_variations = {
                    "Amazon": 1.0,
                    "Mercado Livre": 0.95,
                    "Google Shopping": 0.98
                }
                
                if source_name in price_variations:
                    original_price = float(base_product["preco"].replace("R$ ", "").replace(".", "").replace(",", "."))
                    new_price = original_price * price_variations[source_name]
                    base_product["preco"] = f"R$ {new_price:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
                
                results[source_name] = base_product
                
                await self.log_agent_activity(simulation_id, "extraction", source_name, "completed",
                                            f"Extração concluída em {source_name} - {len(base_product)} atributos extraídos")
                
                print(f"   ✅ {source_name}: {base_product['nome']} - {base_product['preco']}")
            else:
                await self.log_agent_activity(simulation_id, "extraction", source_name, "failed",
                                            f"Nenhum produto encontrado em {source_name}")
                print(f"   ❌ {source_name}: Nenhum produto encontrado")
        
        print()
        
        # Consolidar resultados
        if results:
            consolidated = self.consolidate_results(results)
            
            await self.log_agent_activity(simulation_id, "system", "Skipper", "completed",
                                        f"Simulação concluída com sucesso - {len(results)} fontes processadas")
            
            # Exibir resultados
            self.display_results(product_name, results, consolidated)
        else:
            await self.log_agent_activity(simulation_id, "system", "Skipper", "failed",
                                        "Nenhum resultado obtido das fontes")
            print("❌ Nenhum resultado obtido das fontes")
        
        print()
        print("🎉 Demonstração concluída!")
        print("=" * 60)
    
    def consolidate_results(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Consolida resultados de múltiplas fontes"""
        if not results:
            return {}
        
        # Encontrar o melhor resultado baseado no score de confiança
        best_result = max(results.values(), key=lambda x: x.get("score_confianca", 0))
        
        consolidated = {
            "nome": best_result.get("nome", ""),
            "marca": best_result.get("marca", ""),
            "preco": best_result.get("preco", ""),
            "descricao": best_result.get("descricao", ""),
            "categoria": best_result.get("categoria", ""),
            "especificacoes": best_result.get("especificacoes", ""),
            "disponibilidade": best_result.get("disponibilidade", ""),
            "dimensoes": best_result.get("dimensoes", ""),
            "peso": best_result.get("peso", ""),
            "volume": best_result.get("volume", ""),
            "score_global": sum(r.get("score_confianca", 0) for r in results.values()) / len(results),
            "fontes_consultadas": list(results.keys()),
            "atributos_por_fonte": results
        }
        
        return consolidated
    
    def display_results(self, product_name: str, results: Dict[str, Any], consolidated: Dict[str, Any]):
        """Exibe os resultados da pesquisa"""
        
        print("🏆 RESULTADOS DA PESQUISA")
        print("=" * 60)
        
        # Produto consolidado
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
            print(f"      URL: {result.get('url', 'N/A')}")
        
        # Logs finais
        print(f"\n📝 LOGS DOS AGENTES ({len(self.agent_logs)} total):")
        print("-" * 40)
        
        for log in self.agent_logs[-10:]:  # Últimos 10 logs
            timestamp = log['timestamp'].strftime('%H:%M:%S')
            agent = log['agent_type'].upper()
            source = log['source_name']
            status = log['status']
            message = log['message']
            
            status_icon = "✅" if status == "completed" else "❌" if status == "failed" else "🔄"
            print(f"   {status_icon} [{timestamp}] {agent} - {source}: {message}")
    
    async def log_agent_activity(self, simulation_id: str, agent_type: str, source_name: str, 
                                status: str, message: str, details: Optional[Dict] = None):
        """Registra atividade dos agentes"""
        log_entry = {
            "simulation_id": simulation_id,
            "agent_type": agent_type,
            "source_name": source_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now(),
            "details": details
        }
        
        self.agent_logs.append(log_entry)
        
        # Exibir log em tempo real
        status_icon = "✅" if status == "completed" else "❌" if status == "failed" else "🔄"
        timestamp = log_entry['timestamp'].strftime('%H:%M:%S')
        print(f"   {status_icon} [{timestamp}] {agent_type.upper()} - {source_name}: {message}")

async def main():
    """Função principal"""
    demo = SkipperPesquisaDemo()
    
    # Exemplos de pesquisa
    exemplos = [
        ("iPhone 15", True, None),
        ("Samsung Galaxy", True, None),
        ("MacBook Pro", False, [1, 2]),  # Apenas Amazon e Mercado Livre
    ]
    
    for i, (produto, auto_select, sources) in enumerate(exemplos, 1):
        print(f"\n{'='*20} EXEMPLO {i} {'='*20}")
        await demo.simular_pesquisa_completa(produto, auto_select, sources)
        
        if i < len(exemplos):
            print("\n⏳ Aguardando 3 segundos para próximo exemplo...")
            await asyncio.sleep(3)

if __name__ == "__main__":
    print("🚀 SKIPPER - DEMONSTRAÇÃO DE PESQUISA INTEGRADA")
    print("=" * 60)
    print("Este script demonstra como seria uma pesquisa completa")
    print("de produtos usando o Skipper com agentes CrewAI.")
    print()
    
    asyncio.run(main()) 