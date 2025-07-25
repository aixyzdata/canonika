from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import json
import asyncio
from datetime import datetime
import logging

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
    id: Optional[int] = None
    name: str
    type: str  # "fabricante", "marketplace", "buscador"
    base_url: str
    search_prompt: str
    navigation_prompt: str
    extraction_prompt: str
    recommendation_tags: List[str]
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class SimulationRequest(BaseModel):
    product_name: str
    sources: Optional[List[int]] = None  # IDs das fontes, se None usa automático
    auto_select_sources: bool = True

class SimulationResult(BaseModel):
    id: str
    product_name: str
    sources_used: List[str]
    results: Dict[str, Any]
    consolidated_product: Dict[str, Any]
    status: str  # "running", "completed", "failed"
    created_at: datetime
    completed_at: Optional[datetime] = None

class AgentLog(BaseModel):
    agent_type: str  # "search", "navigation", "extraction"
    source_name: str
    status: str  # "started", "completed", "failed"
    message: str
    timestamp: datetime
    details: Optional[Dict[str, Any]] = None

# Dados mock iniciais
mock_sources = [
    {
        "id": 1,
        "name": "Amazon",
        "type": "marketplace",
        "base_url": "https://www.amazon.com.br",
        "search_prompt": "Pesquise por {product} no Amazon Brasil",
        "navigation_prompt": "Acesse a página do produto e extraia o conteúdo",
        "extraction_prompt": "Extraia os atributos do produto: nome, marca, preço, descrição",
        "recommendation_tags": ["eletronicos", "smartphones", "tecnologia"],
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 2,
        "name": "Mercado Livre",
        "type": "marketplace",
        "base_url": "https://www.mercadolivre.com.br",
        "search_prompt": "Busque por {product} no Mercado Livre",
        "navigation_prompt": "Navegue até a página do produto",
        "extraction_prompt": "Extraia informações do produto: título, preço, especificações",
        "recommendation_tags": ["geral", "usados", "novos"],
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 3,
        "name": "Google Shopping",
        "type": "buscador",
        "base_url": "https://shopping.google.com",
        "search_prompt": "Pesquise {product} no Google Shopping",
        "navigation_prompt": "Acesse os resultados de compra",
        "extraction_prompt": "Extraia dados dos produtos encontrados",
        "recommendation_tags": ["comparacao", "precos", "geral"],
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

# Armazenamento em memória (será substituído por banco de dados)
sources_db = {source["id"]: source for source in mock_sources}
simulations_db = {}
agent_logs = []

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

@app.post("/api/sources", response_model=Source)
async def create_source(source: Source):
    """Cria uma nova fonte"""
    source_id = max(sources_db.keys()) + 1 if sources_db else 1
    source_dict = source.dict()
    source_dict["id"] = source_id
    source_dict["created_at"] = datetime.now()
    source_dict["updated_at"] = datetime.now()
    sources_db[source_id] = source_dict
    return source_dict

@app.put("/api/sources/{source_id}", response_model=Source)
async def update_source(source_id: int, source: Source):
    """Atualiza uma fonte existente"""
    if source_id not in sources_db:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    
    source_dict = source.dict()
    source_dict["id"] = source_id
    source_dict["updated_at"] = datetime.now()
    source_dict["created_at"] = sources_db[source_id]["created_at"]
    sources_db[source_id] = source_dict
    return source_dict

@app.delete("/api/sources/{source_id}")
async def delete_source(source_id: int):
    """Remove uma fonte"""
    if source_id not in sources_db:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    
    del sources_db[source_id]
    return {"message": "Fonte removida com sucesso"}

# Endpoints de Simulação
@app.post("/api/simulation", response_model=SimulationResult)
async def start_simulation(request: SimulationRequest, background_tasks: BackgroundTasks):
    """Inicia uma nova simulação de pesquisa"""
    simulation_id = f"sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Determinar fontes a usar
    if request.auto_select_sources:
        # Seleção automática baseada em tags (mock)
        selected_sources = [1, 2, 3]  # Amazon, Mercado Livre, Google
    else:
        selected_sources = request.sources or [1, 2, 3]
    
    sources_used = [sources_db[sid]["name"] for sid in selected_sources if sid in sources_db]
    
    simulation = SimulationResult(
        id=simulation_id,
        product_name=request.product_name,
        sources_used=sources_used,
        results={},
        consolidated_product={},
        status="running",
        created_at=datetime.now()
    )
    
    simulations_db[simulation_id] = simulation.dict()
    
    # Iniciar simulação em background
    background_tasks.add_task(run_simulation, simulation_id, request.product_name, selected_sources)
    
    return simulation

@app.get("/api/simulation/{simulation_id}", response_model=SimulationResult)
async def get_simulation(simulation_id: str):
    """Obtém o status e resultados de uma simulação"""
    if simulation_id not in simulations_db:
        raise HTTPException(status_code=404, detail="Simulação não encontrada")
    return simulations_db[simulation_id]

@app.get("/api/simulation/{simulation_id}/logs")
async def get_simulation_logs(simulation_id: str):
    """Obtém os logs de uma simulação"""
    if simulation_id not in simulations_db:
        raise HTTPException(status_code=404, detail="Simulação não encontrada")
    
    # Filtrar logs da simulação
    simulation_logs = [log for log in agent_logs if log.get("simulation_id") == simulation_id]
    return simulation_logs

# Função de simulação (mock)
async def run_simulation(simulation_id: str, product_name: str, source_ids: List[int]):
    """Executa a simulação em background"""
    logger.info(f"Iniciando simulação {simulation_id} para produto: {product_name}")
    
    try:
        # Simular execução dos agentes
        for source_id in source_ids:
            if source_id not in sources_db:
                continue
                
            source = sources_db[source_id]
            
            # Log do agente de busca
            await log_agent_activity(simulation_id, "search", source["name"], "started", 
                                   f"Iniciando busca por '{product_name}' em {source['name']}")
            
            await asyncio.sleep(2)  # Simular tempo de busca
            
            await log_agent_activity(simulation_id, "search", source["name"], "completed", 
                                   f"Busca concluída - 5 links encontrados")
            
            # Log do agente de navegação
            await log_agent_activity(simulation_id, "navigation", source["name"], "started", 
                                   f"Navegando para páginas de produtos")
            
            await asyncio.sleep(3)  # Simular tempo de navegação
            
            await log_agent_activity(simulation_id, "navigation", source["name"], "completed", 
                                   f"Navegação concluída - conteúdo extraído")
            
            # Log do agente de extração
            await log_agent_activity(simulation_id, "extraction", source["name"], "started", 
                                   f"Extraindo atributos do produto")
            
            await asyncio.sleep(2)  # Simular tempo de extração
            
            # Resultado mock
            mock_result = {
                "nome": f"{product_name} - {source['name']}",
                "marca": "Marca Exemplo",
                "preco": "R$ 299,90",
                "descricao": f"Produto {product_name} encontrado em {source['name']}",
                "categoria": "Eletrônicos",
                "disponibilidade": "Em estoque",
                "score_confianca": 0.85
            }
            
            simulations_db[simulation_id]["results"][source["name"]] = mock_result
            
            await log_agent_activity(simulation_id, "extraction", source["name"], "completed", 
                                   f"Extração concluída - {len(mock_result)} atributos extraídos")
        
        # Consolidar resultados
        consolidated = consolidate_results(simulations_db[simulation_id]["results"])
        simulations_db[simulation_id]["consolidated_product"] = consolidated
        simulations_db[simulation_id]["status"] = "completed"
        simulations_db[simulation_id]["completed_at"] = datetime.now()
        
        logger.info(f"Simulação {simulation_id} concluída com sucesso")
        
    except Exception as e:
        logger.error(f"Erro na simulação {simulation_id}: {str(e)}")
        simulations_db[simulation_id]["status"] = "failed"
        await log_agent_activity(simulation_id, "system", "system", "failed", f"Erro: {str(e)}")

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

def consolidate_results(results: Dict[str, Any]) -> Dict[str, Any]:
    """Consolida resultados de múltiplas fontes"""
    if not results:
        return {}
    
    # Lógica simples de consolidação (mock)
    consolidated = {
        "nome": "",
        "marca": "",
        "preco": "",
        "descricao": "",
        "categoria": "",
        "disponibilidade": "",
        "score_global": 0.0,
        "fontes_consultadas": list(results.keys())
    }
    
    # Encontrar o resultado com maior score
    best_result = max(results.values(), key=lambda x: x.get("score_confianca", 0))
    
    for key in ["nome", "marca", "preco", "descricao", "categoria", "disponibilidade"]:
        if key in best_result:
            consolidated[key] = best_result[key]
    
    # Calcular score global
    scores = [r.get("score_confianca", 0) for r in results.values()]
    consolidated["score_global"] = sum(scores) / len(scores) if scores else 0.0
    
    return consolidated

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 