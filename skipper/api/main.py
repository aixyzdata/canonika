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
import os

# Importar agentes CrewAI e serviços
# from agents.crew_agents import skipper_agents
# from services.simulation_service import simulation_service

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
    search_autofeedback: Optional[str] = None
    navigation_autofeedback: Optional[str] = None
    extraction_autofeedback: Optional[str] = None
    recommendation_tags: List[str]
    is_active: bool = True
    # Novos campos de configuração
    connection_timeout: Optional[int] = 30  # Timeout em segundos
    request_delay: Optional[float] = 1.0  # Delay entre requests em segundos
    max_retries: Optional[int] = 3  # Número máximo de tentativas
    user_agent: Optional[str] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    custom_headers: Optional[Dict[str, str]] = None  # Headers personalizados
    proxy_settings: Optional[Dict[str, str]] = None  # Configurações de proxy
    rate_limit_delay: Optional[float] = 2.0  # Delay para rate limiting
    max_requests_per_minute: Optional[int] = 30  # Limite de requests por minuto
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

# Endpoint para atualizar prompts de auto-feedback
class AutofeedbackUpdate(BaseModel):
    search_autofeedback: Optional[str] = None
    navigation_autofeedback: Optional[str] = None
    extraction_autofeedback: Optional[str] = None

@app.patch("/api/sources/{source_id}/autofeedback")
async def update_source_autofeedback(source_id: int, autofeedback: AutofeedbackUpdate):
    """Atualiza os prompts de auto-feedback de uma fonte"""
    if source_id not in sources_db:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    
    source = sources_db[source_id]
    
    # Atualizar apenas os campos fornecidos
    if autofeedback.search_autofeedback is not None:
        source["search_autofeedback"] = autofeedback.search_autofeedback
    if autofeedback.navigation_autofeedback is not None:
        source["navigation_autofeedback"] = autofeedback.navigation_autofeedback
    if autofeedback.extraction_autofeedback is not None:
        source["extraction_autofeedback"] = autofeedback.extraction_autofeedback
    
    source["updated_at"] = datetime.now()
    sources_db[source_id] = source
    
    return {
        "message": "Auto-feedback atualizado com sucesso",
        "source_id": source_id,
        "updated_fields": {
            k: v for k, v in autofeedback.dict().items() 
            if v is not None
        }
    }

@app.get("/api/sources/templates/{source_type}")
async def get_source_templates(source_type: str):
    """Obtém templates de prompts baseados no tipo de fonte"""
    templates = {
        "marketplace": {
            "search_prompt": "Pesquise por {product} no {source_name}. Use termos específicos e sinônimos para melhorar os resultados.",
            "navigation_prompt": "Acesse a página do produto principal. Navegue pelos resultados e identifique o produto mais relevante baseado em avaliações, preço e disponibilidade.",
            "extraction_prompt": "Extraia os seguintes atributos do produto: nome completo, marca, preço atual, preço original (se disponível), avaliação média, número de avaliações, disponibilidade, especificações técnicas principais, descrição resumida.",
            "search_autofeedback": "Prompt adaptado para busca em marketplace: Foque em produtos com boa avaliação e preço competitivo.",
            "navigation_autofeedback": "Prompt adaptado para navegação em marketplace: Sempre verifique a disponibilidade e opções de entrega.",
            "extraction_autofeedback": "Prompt adaptado para extração em marketplace: Extraia sempre informações de garantia e política de devolução quando disponíveis."
        },
        "fabricante": {
            "search_prompt": "Pesquise por {product} no site oficial do fabricante {source_name}. Use o nome exato do produto.",
            "navigation_prompt": "Navegue até a página específica do produto no site oficial. Verifique especificações técnicas detalhadas.",
            "extraction_prompt": "Extraia: nome completo do produto, especificações técnicas detalhadas, preço oficial, disponibilidade, garantia, informações de suporte técnico.",
            "search_autofeedback": "Prompt adaptado para busca em fabricante: Use sempre o nome oficial do produto conforme especificado pelo fabricante.",
            "navigation_autofeedback": "Prompt adaptado para navegação em fabricante: Priorize páginas oficiais do produto com especificações completas.",
            "extraction_autofeedback": "Prompt adaptado para extração em fabricante: Extraia sempre especificações técnicas completas e informações de garantia oficial."
        },
        "buscador": {
            "search_prompt": "Pesquise {product} no {source_name} para comparar preços e encontrar as melhores ofertas.",
            "navigation_prompt": "Acesse os resultados de compra e navegue pelos diferentes vendedores para comparar preços e condições.",
            "extraction_prompt": "Extraia: nome do produto, preços de diferentes vendedores, avaliações, especificações básicas, condições de envio, reputação dos vendedores.",
            "search_autofeedback": "Prompt adaptado para busca em buscador: Foque em produtos com boa avaliação e preço competitivo.",
            "navigation_autofeedback": "Prompt adaptado para navegação em buscador: Sempre compare preços entre diferentes vendedores.",
            "extraction_autofeedback": "Prompt adaptado para extração em buscador: Extraia sempre múltiplos preços para comparação."
        }
    }
    
    if source_type not in templates:
        raise HTTPException(status_code=400, detail="Tipo de fonte não suportado")
    
    return templates[source_type]

# Endpoints de Simulação
@app.post("/api/simulation", response_model=SimulationResult)
async def start_simulation(request: SimulationRequest, background_tasks: BackgroundTasks):
    """Inicia uma nova simulação de pesquisa usando agentes CrewAI"""
    simulation_id = f"sim_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    try:
        # Determinar fontes a usar
        if request.auto_select_sources:
            # Seleção automática baseada em tags (mock)
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
        
        # Iniciar simulação em background usando o serviço
        background_tasks.add_task(
            simulation_service.start_simulation, 
            simulation_id, 
            request.product_name, 
            source_configs
        )
        
        return simulation
        
    except Exception as e:
        logger.error(f"Erro ao iniciar simulação: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao iniciar simulação: {str(e)}")

@app.get("/api/simulation/{simulation_id}", response_model=SimulationResult)
async def get_simulation(simulation_id: str):
    """Obtém o status e resultados de uma simulação"""
    simulation_data = simulation_service.get_simulation_status(simulation_id)
    if not simulation_data:
        raise HTTPException(status_code=404, detail="Simulação não encontrada")
    return simulation_data

@app.get("/api/simulation/{simulation_id}/logs")
async def get_simulation_logs(simulation_id: str):
    """Obtém os logs de uma simulação"""
    logs = simulation_service.get_simulation_logs(simulation_id)
    if not logs and not simulation_service.get_simulation_status(simulation_id):
        raise HTTPException(status_code=404, detail="Simulação não encontrada")
    return logs

# Configuração de variáveis de ambiente para agentes
os.environ.setdefault("OPENAI_API_KEY", "sk-mock-key-for-development")
os.environ.setdefault("OPENAI_MODEL", "gpt-3.5-turbo")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 