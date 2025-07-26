#!/usr/bin/env python3
"""
Skipper API - Versão Mínima
API simples para testar funcionalidades básicas
"""

import json
import asyncio
import random
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configuração básica
app = FastAPI(
    title="Skipper API - Versão Mínima",
    description="API simples para testes de pesquisa",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos simples
class SimulationRequest(BaseModel):
    product_name: str
    auto_select_sources: bool = True
    sources: Optional[List[int]] = None

class SimulationResult(BaseModel):
    id: str
    product_name: str
    sources_used: List[str]
    results: Dict[str, Any]
    consolidated_product: Dict[str, Any]
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

# Dados mock
mock_sources = [
    {"id": 1, "name": "Amazon", "type": "marketplace"},
    {"id": 2, "name": "Mercado Livre", "type": "marketplace"},
    {"id": 3, "name": "Google Shopping", "type": "buscador"}
]

mock_products = {
    "iphone": [
        {
            "nome": "iPhone 15 Pro Max 256GB",
            "marca": "Apple",
            "preco": "R$ 8.999,00",
            "descricao": "iPhone 15 Pro Max com chip A17 Pro",
            "categoria": "Smartphone",
            "especificacoes": "Chip A17 Pro, 256GB, 6.7\"",
            "disponibilidade": "Em estoque",
            "score_confianca": 0.95
        }
    ],
    "samsung": [
        {
            "nome": "Samsung Galaxy S24 Ultra 256GB",
            "marca": "Samsung",
            "preco": "R$ 9.499,00",
            "descricao": "Samsung Galaxy S24 Ultra com chip Snapdragon 8 Gen 3",
            "categoria": "Smartphone",
            "especificacoes": "Snapdragon 8 Gen 3, 256GB, 6.8\"",
            "disponibilidade": "Em estoque",
            "score_confianca": 0.94
        }
    ],
    "macbook": [
        {
            "nome": "MacBook Pro 14\" M3 Pro 512GB",
            "marca": "Apple",
            "preco": "R$ 18.999,00",
            "descricao": "MacBook Pro 14 polegadas com chip M3 Pro",
            "categoria": "Notebook",
            "especificacoes": "Chip M3 Pro, 512GB SSD, 18GB RAM",
            "disponibilidade": "Em estoque",
            "score_confianca": 0.96
        }
    ]
}

# Armazenamento em memória
simulations_db = {}
agent_logs = []

@app.get("/")
async def root():
    return {"message": "Skipper API - Versão Mínima"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "timestamp": datetime.now(), 
        "version": "minimal"
    }

@app.get("/api/sources")
async def get_sources():
    """Lista todas as fontes cadastradas"""
    return mock_sources

@app.post("/api/simulation")
async def start_simulation(request: SimulationRequest):
    """Inicia uma nova simulação de pesquisa"""
    simulation_id = f"sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Determinar fontes a usar
    if request.auto_select_sources:
        selected_sources = mock_sources
    else:
        selected_sources = [s for s in mock_sources if s["id"] in (request.sources or [])]
    
    if not selected_sources:
        raise HTTPException(status_code=400, detail="Nenhuma fonte válida encontrada")
    
    # Criar simulação inicial
    simulation = SimulationResult(
        id=simulation_id,
        product_name=request.product_name,
        sources_used=[source["name"] for source in selected_sources],
        results={},
        consolidated_product={},
        status="running",
        created_at=datetime.now()
    )
    
    # Iniciar simulação em background
    asyncio.create_task(simulate_product_search(simulation_id, request.product_name, selected_sources))
    
    return simulation

async def simulate_product_search(simulation_id: str, product_name: str, sources: List[Dict]):
    """Simula a busca de produtos"""
    try:
        # Log de início
        await log_agent_activity(simulation_id, "system", "Skipper", "started", 
                               f"Iniciando simulação para '{product_name}'")
        
        results = {}
        
        for source in sources:
            source_name = source["name"]
            
            # Simular busca
            await log_agent_activity(simulation_id, "search", source_name, "started",
                                   f"Buscando '{product_name}' em {source_name}")
            
            await asyncio.sleep(2)  # Simular tempo de busca
            
            await log_agent_activity(simulation_id, "search", source_name, "completed",
                                   f"Busca concluída em {source_name}")
            
            # Simular navegação
            await log_agent_activity(simulation_id, "navigation", source_name, "started",
                                   f"Navegando páginas de produtos em {source_name}")
            
            await asyncio.sleep(1.5)  # Simular tempo de navegação
            
            await log_agent_activity(simulation_id, "navigation", source_name, "completed",
                                   f"Navegação concluída em {source_name}")
            
            # Simular extração
            await log_agent_activity(simulation_id, "extraction", source_name, "started",
                                   f"Extraindo atributos em {source_name}")
            
            await asyncio.sleep(1)  # Simular tempo de extração
            
            # Gerar dados simulados
            product_key = product_name.lower().split()[0]
            mock_data = mock_products.get(product_key, mock_products.get("iphone", []))
            
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
                
                await log_agent_activity(simulation_id, "extraction", source_name, "completed",
                                       f"Extração concluída em {source_name}")
            else:
                await log_agent_activity(simulation_id, "extraction", source_name, "failed",
                                       f"Nenhum produto encontrado em {source_name}")
        
        # Consolidar resultados
        if results:
            consolidated = consolidate_results(results)
            
            # Atualizar simulação
            simulation_data = {
                "id": simulation_id,
                "product_name": product_name,
                "sources_used": [source["name"] for source in sources],
                "results": results,
                "consolidated_product": consolidated,
                "status": "completed",
                "created_at": datetime.now(),
                "completed_at": datetime.now()
            }
            
            simulations_db[simulation_id] = simulation_data
            
            await log_agent_activity(simulation_id, "system", "Skipper", "completed",
                                   f"Simulação concluída com sucesso - {len(results)} fontes processadas")
        else:
            await log_agent_activity(simulation_id, "system", "Skipper", "failed",
                                   "Nenhum resultado obtido das fontes")
            
    except Exception as e:
        await log_agent_activity(simulation_id, "system", "Skipper", "failed",
                               f"Erro: {str(e)}")

def consolidate_results(results: Dict[str, Any]) -> Dict[str, Any]:
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
        "score_global": sum(r.get("score_confianca", 0) for r in results.values()) / len(results),
        "fontes_consultadas": list(results.keys()),
        "atributos_por_fonte": results
    }
    
    return consolidated

async def log_agent_activity(simulation_id: str, agent_type: str, source_name: str, 
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
    
    agent_logs.append(log_entry)
    print(f"[{agent_type.upper()}] {source_name}: {message}")

@app.get("/api/simulation/{simulation_id}")
async def get_simulation(simulation_id: str):
    """Obtém o status e resultados de uma simulação"""
    simulation_data = simulations_db.get(simulation_id)
    if not simulation_data:
        raise HTTPException(status_code=404, detail="Simulação não encontrada")
    return simulation_data

@app.get("/api/simulation/{simulation_id}/logs")
async def get_simulation_logs(simulation_id: str):
    """Obtém os logs de uma simulação"""
    logs = [log for log in agent_logs if log.get("simulation_id") == simulation_id]
    if not logs and simulation_id not in simulations_db:
        raise HTTPException(status_code=404, detail="Simulação não encontrada")
    return logs

if __name__ == "__main__":
    print("🚀 Iniciando Skipper API - Versão Mínima...")
    print("🌐 API disponível em: http://localhost:7722")
    print("📚 Documentação: http://localhost:7722/docs")
    uvicorn.run(app, host="0.0.0.0", port=7722) 