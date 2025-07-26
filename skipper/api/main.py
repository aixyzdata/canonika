from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uvicorn
import json
import asyncio
from datetime import datetime
import logging
import os
import random
import time

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Skipper API",
    description="Orquestrador de navegação e extração de dados na web",
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

# Modelos Pydantic
class Source(BaseModel):
    id: Optional[int] = Field(default=None)
    name: str
    type: str  # "fabricante", "marketplace", "buscador"
    base_url: str
    search_prompt: str
    navigation_prompt: str
    extraction_prompt: str
    search_autofeedback: Optional[str] = Field(default=None)
    navigation_autofeedback: Optional[str] = Field(default=None)
    extraction_autofeedback: Optional[str] = Field(default=None)
    recommendation_tags: List[str]
    is_active: bool = Field(default=True)
    connection_timeout: Optional[int] = Field(default=30)
    request_delay: Optional[float] = Field(default=1.0)
    max_retries: Optional[int] = Field(default=3)
    user_agent: Optional[str] = Field(default="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    custom_headers: Optional[Dict[str, str]] = Field(default=None)
    proxy_settings: Optional[Dict[str, str]] = Field(default=None)
    rate_limit_delay: Optional[float] = Field(default=2.0)
    max_requests_per_minute: Optional[int] = Field(default=30)
    created_at: Optional[datetime] = Field(default=None)
    updated_at: Optional[datetime] = Field(default=None)

class SimulationRequest(BaseModel):
    product_name: str
    sources: Optional[List[int]] = Field(default=None)
    auto_select_sources: bool = Field(default=True)

class SimulationResult(BaseModel):
    id: str
    product_name: str
    sources_used: List[str]
    results: Dict[str, Any]
    consolidated_product: Dict[str, Any]
    status: str  # "running", "completed", "failed"
    created_at: datetime
    completed_at: Optional[datetime] = Field(default=None)

class AgentLog(BaseModel):
    agent_type: str  # "search", "navigation", "extraction"
    source_name: str
    status: str  # "started", "completed", "failed"
    message: str
    timestamp: datetime
    details: Optional[Dict[str, Any]] = Field(default=None)

# Dados mock iniciais
mock_sources = [
    {
        "id": 1,
        "name": "Amazon",
        "type": "marketplace",
        "base_url": "https://www.amazon.com.br",
        "search_prompt": "Pesquise por {product} no Amazon Brasil. Use termos específicos e sinônimos para melhorar os resultados.",
        "navigation_prompt": "Acesse a página do produto principal. Navegue pelos resultados e identifique o produto mais relevante baseado em avaliações, preço e disponibilidade.",
        "extraction_prompt": "Extraia os seguintes atributos do produto: nome completo, marca, preço atual, preço original (se disponível), avaliação média, número de avaliações, disponibilidade, especificações técnicas principais, descrição resumida.",
        "search_autofeedback": "Prompt adaptado para busca na Amazon: Foque em produtos com boa avaliação e preço competitivo. Priorize produtos Prime quando disponíveis.",
        "navigation_autofeedback": "Prompt adaptado para navegação na Amazon: Sempre verifique a disponibilidade e opções de entrega. Considere produtos similares se o principal não estiver disponível.",
        "extraction_autofeedback": "Prompt adaptado para extração na Amazon: Extraia sempre o preço com e sem frete. Inclua informações de garantia e política de devolução quando disponíveis.",
        "recommendation_tags": ["eletronicos", "smartphones", "tecnologia"],
        "is_active": True,
        "connection_timeout": 30,
        "request_delay": 1.0,
        "max_retries": 3,
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "custom_headers": {"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
        "proxy_settings": None,
        "rate_limit_delay": 2.0,
        "max_requests_per_minute": 30,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 2,
        "name": "Mercado Livre",
        "type": "marketplace",
        "base_url": "https://www.mercadolivre.com.br",
        "search_prompt": "Busque por {product} no Mercado Livre. Considere variações do nome do produto e use filtros de localização.",
        "navigation_prompt": "Navegue até a página do produto. Verifique se é um vendedor confiável com boa reputação e envio rápido.",
        "extraction_prompt": "Extraia: título do produto, preço, condição (novo/usado), localização do vendedor, reputação do vendedor, opções de envio, garantia, especificações técnicas.",
        "search_autofeedback": "Prompt adaptado para busca no Mercado Livre: Priorize vendedores com boa reputação e envio rápido. Considere produtos usados em bom estado.",
        "navigation_autofeedback": "Prompt adaptado para navegação no Mercado Livre: Sempre verifique a reputação do vendedor e as condições de envio. Evite produtos com poucas informações.",
        "extraction_autofeedback": "Prompt adaptado para extração no Mercado Livre: Inclua sempre informações sobre o vendedor e condições de envio. Extraia especificações técnicas quando disponíveis.",
        "recommendation_tags": ["geral", "usados", "novos"],
        "is_active": True,
        "connection_timeout": 30,
        "request_delay": 1.5,
        "max_retries": 3,
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "custom_headers": {"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
        "proxy_settings": None,
        "rate_limit_delay": 3.0,
        "max_requests_per_minute": 20,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 3,
        "name": "Google Shopping",
        "type": "buscador",
        "base_url": "https://shopping.google.com",
        "search_prompt": "Pesquise {product} no Google Shopping para comparar preços e encontrar as melhores ofertas.",
        "navigation_prompt": "Acesse os resultados de compra e navegue pelos diferentes vendedores para comparar preços e condições.",
        "extraction_prompt": "Extraia: nome do produto, preços de diferentes vendedores, avaliações, especificações básicas, condições de envio, reputação dos vendedores.",
        "search_autofeedback": "Prompt adaptado para busca no Google Shopping: Foque em produtos com boa avaliação e preço competitivo. Compare múltiplos vendedores.",
        "navigation_autofeedback": "Prompt adaptado para navegação no Google Shopping: Sempre compare preços entre diferentes vendedores. Verifique condições de envio e reputação.",
        "extraction_autofeedback": "Prompt adaptado para extração no Google Shopping: Extraia sempre múltiplos preços para comparação. Inclua informações de reputação dos vendedores.",
        "recommendation_tags": ["comparacao", "precos", "geral"],
        "is_active": True,
        "connection_timeout": 30,
        "request_delay": 2.0,
        "max_retries": 3,
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "custom_headers": {"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
        "proxy_settings": None,
        "rate_limit_delay": 5.0,
        "max_requests_per_minute": 15,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

# Armazenamento em memória
sources_db = {source["id"]: source for source in mock_sources}
simulations_db = {}
agent_logs = []

# Simulação de dados de produtos
mock_products = {
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

@app.get("/")
async def root():
    return {"message": "Skipper API - Orquestrador de Navegação e Extração"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# Endpoints de Fontes
@app.get("/api/sources", response_model=List[Source])
async def get_sources():
    """Lista todas as fontes cadastradas"""
    return list(sources_db.values())

@app.get("/api/sources/{source_id}", response_model=Source)
async def get_source(source_id: int):
    """Obtém uma fonte específica"""
    if source_id not in sources_db:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    return sources_db[source_id]

# Endpoints de Simulação
@app.post("/api/simulation", response_model=SimulationResult)
async def start_simulation(request: SimulationRequest, background_tasks: BackgroundTasks):
    """Inicia uma nova simulação de pesquisa"""
    simulation_id = f"sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    try:
        # Determinar fontes a usar
        if request.auto_select_sources:
            selected_source_ids = [1, 2, 3]  # Amazon, Mercado Livre, Google
        else:
            selected_source_ids = request.sources or [1, 2, 3]
        
        # Obter configurações das fontes
        source_configs = []
        for source_id in selected_source_ids:
            if source_id in sources_db:
                source_configs.append(sources_db[source_id])
        
        if not source_configs:
            raise HTTPException(status_code=400, detail="Nenhuma fonte válida encontrada")
        
        # Criar simulação inicial
        simulation = SimulationResult(
            id=simulation_id,
            product_name=request.product_name,
            sources_used=[source["name"] for source in source_configs],
            results={},
            consolidated_product={},
            status="running",
            created_at=datetime.now()
        )
        
        # Iniciar simulação em background
        background_tasks.add_task(
            simulate_product_search, 
            simulation_id, 
            request.product_name, 
            source_configs
        )
        
        return simulation
        
    except Exception as e:
        logger.error(f"Erro ao iniciar simulação: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao iniciar simulação: {str(e)}")

async def simulate_product_search(simulation_id: str, product_name: str, source_configs: List[Dict]):
    """Simula a busca de produtos"""
    try:
        # Simular logs de início
        await log_agent_activity(simulation_id, "system", "Skipper", "started", 
                               f"Iniciando simulação para '{product_name}'")
        
        results = {}
        
        for source_config in source_configs:
            source_name = source_config["name"]
            
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
            
            # Gerar dados simulados baseados no produto
            product_key = product_name.lower().split()[0]  # Primeira palavra do produto
            mock_data = mock_products.get(product_key, mock_products.get("iphone", []))
            
            if mock_data:
                # Selecionar um produto aleatório e adicionar variações
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
                    # Simular variação de preço
                    original_price = float(base_product["preco"].replace("R$ ", "").replace(".", "").replace(",", "."))
                    new_price = original_price * price_variations[source_name]
                    base_product["preco"] = f"R$ {new_price:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
                
                results[source_name] = base_product
                
                await log_agent_activity(simulation_id, "extraction", source_name, "completed",
                                       f"Extração concluída em {source_name} - {len(base_product)} atributos extraídos")
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
                "sources_used": [source["name"] for source in source_configs],
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
        logger.error(f"Erro na simulação {simulation_id}: {str(e)}")
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
        "dimensoes": best_result.get("dimensoes", ""),
        "peso": best_result.get("peso", ""),
        "volume": best_result.get("volume", ""),
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
    logger.info(f"[{agent_type.upper()}] {source_name}: {message}")

@app.get("/api/simulation/{simulation_id}", response_model=SimulationResult)
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
    uvicorn.run(app, host="0.0.0.0", port=7722) 