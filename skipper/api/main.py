from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
import json
import uuid
from datetime import datetime
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Skipper API", version="1.0.0")

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
    id: Optional[str] = None
    name: str
    type: str  # "manufacturer", "marketplace", "search_engine"
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
    auto_select_sources: bool = True
    selected_sources: Optional[List[str]] = None
    max_results_per_source: int = 5

class SimulationResult(BaseModel):
    id: str
    product_name: str
    sources_results: Dict[str, Any]
    consolidated_product: Dict[str, Any]
    status: str
    created_at: datetime

# Dados mock iniciais
MOCK_SOURCES = [
    {
        "id": "1",
        "name": "DuckDuckGo",
        "type": "search_engine",
        "base_url": "https://duckduckgo.com",
        "search_prompt": "Pesquise por '{product_name}' e retorne os 5 links mais relevantes",
        "navigation_prompt": "Acesse cada link e extraia o conteúdo HTML limpo",
        "extraction_prompt": "Extraia os seguintes atributos do produto: nome, marca, preço, descrição, especificações técnicas",
        "recommendation_tags": ["geral", "buscador"],
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "2",
        "name": "Amazon",
        "type": "marketplace",
        "base_url": "https://amazon.com",
        "search_prompt": "Pesquise por '{product_name}' no marketplace e retorne os 3 produtos mais relevantes",
        "navigation_prompt": "Acesse cada página de produto e extraia o conteúdo",
        "extraction_prompt": "Extraia: nome, marca, preço, avaliações, especificações, descrição",
        "recommendation_tags": ["eletronicos", "livros", "casa"],
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "3",
        "name": "Mercado Livre",
        "type": "marketplace",
        "base_url": "https://mercadolivre.com.br",
        "search_prompt": "Pesquise por '{product_name}' e retorne os 4 produtos mais relevantes",
        "navigation_prompt": "Acesse cada anúncio e extraia o conteúdo",
        "extraction_prompt": "Extraia: título, preço, vendedor, especificações, descrição",
        "recommendation_tags": ["geral", "brasil"],
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

# Armazenamento em memória (será substituído por PostgreSQL)
sources_db = {source["id"]: source for source in MOCK_SOURCES}
simulations_db = {}

# Simulação de agentes CrewAI
class MockCrewAI:
    def __init__(self):
        self.logs = []
    
    async def search_agent(self, product_name: str, source: dict) -> List[str]:
        """Simula o agente de busca"""
        await asyncio.sleep(1)
        self.logs.append(f"🔍 Buscando '{product_name}' em {source['name']}")
        
        # Mock de links
        mock_links = [
            f"https://{source['base_url']}/product1",
            f"https://{source['base_url']}/product2",
            f"https://{source['base_url']}/product3"
        ]
        
        self.logs.append(f"✅ Encontrados {len(mock_links)} links em {source['name']}")
        return mock_links
    
    async def navigation_agent(self, links: List[str], source: dict) -> List[str]:
        """Simula o agente de navegação"""
        await asyncio.sleep(2)
        self.logs.append(f"🌐 Navegando em {len(links)} páginas de {source['name']}")
        
        # Mock de conteúdo extraído
        mock_contents = [
            f"Conteúdo extraído da página 1 de {source['name']}",
            f"Conteúdo extraído da página 2 de {source['name']}",
            f"Conteúdo extraído da página 3 de {source['name']}"
        ]
        
        self.logs.append(f"✅ Extraído conteúdo de {len(mock_contents)} páginas")
        return mock_contents
    
    async def extraction_agent(self, contents: List[str], source: dict) -> Dict[str, Any]:
        """Simula o agente de extração"""
        await asyncio.sleep(1.5)
        self.logs.append(f"📊 Extraindo atributos de {source['name']}")
        
        # Mock de atributos extraídos
        extracted_attributes = {
            "nome": f"Produto Teste {source['name']}",
            "marca": "Marca Teste",
            "preco": "R$ 99,90",
            "descricao": f"Descrição do produto encontrado em {source['name']}",
            "especificacoes": {
                "peso": "500g",
                "dimensoes": "10x20x30cm",
                "cor": "Azul"
            },
            "confianca": 0.85
        }
        
        self.logs.append(f"✅ Extraídos {len(extracted_attributes)} atributos")
        return extracted_attributes

# Instância global do CrewAI
crew_ai = MockCrewAI()

@app.get("/")
async def root():
    return {"message": "Skipper API - Orquestrador de Navegação e Extração de Dados"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "skipper"}

# Endpoints para fontes
@app.get("/api/sources", response_model=List[Source])
async def get_sources():
    """Lista todas as fontes cadastradas"""
    return list(sources_db.values())

@app.get("/api/sources/{source_id}", response_model=Source)
async def get_source(source_id: str):
    """Obtém uma fonte específica"""
    if source_id not in sources_db:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    return sources_db[source_id]

@app.post("/api/sources", response_model=Source)
async def create_source(source: Source):
    """Cria uma nova fonte"""
    source_id = str(uuid.uuid4())
    source.id = source_id
    source.created_at = datetime.now()
    source.updated_at = datetime.now()
    
    sources_db[source_id] = source.dict()
    return source

@app.put("/api/sources/{source_id}", response_model=Source)
async def update_source(source_id: str, source: Source):
    """Atualiza uma fonte existente"""
    if source_id not in sources_db:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    
    source.id = source_id
    source.updated_at = datetime.now()
    sources_db[source_id] = source.dict()
    return source

@app.delete("/api/sources/{source_id}")
async def delete_source(source_id: str):
    """Remove uma fonte"""
    if source_id not in sources_db:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    
    del sources_db[source_id]
    return {"message": "Fonte removida com sucesso"}

# Endpoints para simulação
@app.post("/api/simulation", response_model=SimulationResult)
async def start_simulation(request: SimulationRequest, background_tasks: BackgroundTasks):
    """Inicia uma simulação de pesquisa"""
    simulation_id = str(uuid.uuid4())
    
    # Limpa logs anteriores
    crew_ai.logs.clear()
    
    # Determina fontes a usar
    if request.auto_select_sources:
        selected_sources = [s for s in sources_db.values() if s["is_active"]]
    else:
        selected_sources = [s for s in sources_db.values() 
                          if s["id"] in (request.selected_sources or [])]
    
    if not selected_sources:
        raise HTTPException(status_code=400, detail="Nenhuma fonte válida selecionada")
    
    # Cria resultado inicial
    simulation_result = SimulationResult(
        id=simulation_id,
        product_name=request.product_name,
        sources_results={},
        consolidated_product={},
        status="running",
        created_at=datetime.now()
    )
    
    simulations_db[simulation_id] = simulation_result.dict()
    
    # Executa simulação em background
    background_tasks.add_task(
        run_simulation,
        simulation_id,
        request.product_name,
        selected_sources,
        request.max_results_per_source
    )
    
    return simulation_result

@app.get("/api/simulation/{simulation_id}", response_model=SimulationResult)
async def get_simulation(simulation_id: str):
    """Obtém o resultado de uma simulação"""
    if simulation_id not in simulations_db:
        raise HTTPException(status_code=404, detail="Simulação não encontrada")
    return simulations_db[simulation_id]

@app.get("/api/simulation/{simulation_id}/logs")
async def get_simulation_logs(simulation_id: str):
    """Obtém os logs de uma simulação"""
    if simulation_id not in simulations_db:
        raise HTTPException(status_code=404, detail="Simulação não encontrada")
    
    return {
        "simulation_id": simulation_id,
        "logs": crew_ai.logs
    }

async def run_simulation(simulation_id: str, product_name: str, sources: List[dict], max_results: int):
    """Executa a simulação completa"""
    try:
        crew_ai.logs.append(f"🚀 Iniciando simulação para '{product_name}'")
        
        sources_results = {}
        all_attributes = []
        
        for source in sources:
            crew_ai.logs.append(f"📋 Processando fonte: {source['name']}")
            
            # Agente de busca
            links = await crew_ai.search_agent(product_name, source)
            
            # Agente de navegação
            contents = await crew_ai.navigation_agent(links, source)
            
            # Agente de extração
            attributes = await crew_ai.extraction_agent(contents, source)
            
            sources_results[source['name']] = {
                "source": source,
                "links": links,
                "contents": contents,
                "attributes": attributes,
                "confidence": attributes.get("confianca", 0.5)
            }
            
            all_attributes.append(attributes)
        
        # Consolidação dos resultados
        consolidated_product = consolidate_attributes(all_attributes)
        
        # Atualiza resultado
        simulations_db[simulation_id]["sources_results"] = sources_results
        simulations_db[simulation_id]["consolidated_product"] = consolidated_product
        simulations_db[simulation_id]["status"] = "completed"
        
        crew_ai.logs.append("✅ Simulação concluída com sucesso!")
        
    except Exception as e:
        logger.error(f"Erro na simulação {simulation_id}: {str(e)}")
        simulations_db[simulation_id]["status"] = "error"
        crew_ai.logs.append(f"❌ Erro na simulação: {str(e)}")

def consolidate_attributes(attributes_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Consolida atributos de múltiplas fontes"""
    if not attributes_list:
        return {}
    
    # Atributos fixos
    consolidated = {
        "nome": "",
        "marca": "",
        "preco": "",
        "descricao": "",
        "especificacoes": {},
        "confianca_global": 0.0,
        "fontes_consultadas": len(attributes_list)
    }
    
    # Soma de confianças
    total_confidence = 0
    
    for attrs in attributes_list:
        total_confidence += attrs.get("confianca", 0.5)
        
        # Atribui valores baseado na maior confiança
        if attrs.get("confianca", 0) > consolidated.get("confianca_global", 0):
            consolidated["nome"] = attrs.get("nome", "")
            consolidated["marca"] = attrs.get("marca", "")
            consolidated["preco"] = attrs.get("preco", "")
            consolidated["descricao"] = attrs.get("descricao", "")
            consolidated["especificacoes"] = attrs.get("especificacoes", {})
    
    consolidated["confianca_global"] = total_confidence / len(attributes_list)
    
    return consolidated

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 