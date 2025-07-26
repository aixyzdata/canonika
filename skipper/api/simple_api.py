"""
API Simplificada do Skipper para testar agentes CrewAI
Usa HTTP server básico para evitar problemas de compatibilidade
"""

import json
import asyncio
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import random
import time

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simulação de dados dos agentes
class SkipperAgents:
    """Simulação dos agentes CrewAI"""
    
    def __init__(self):
        self.logs = []
    
    async def search_product_links(self, product_name: str, source_config: Dict[str, Any]) -> List[str]:
        """Simula busca de links"""
        await self._log_activity("search", source_config["name"], "started", f"Buscando links para {product_name}")
        
        # Simula tempo de processamento
        await asyncio.sleep(2)
        
        # Retorna URLs simuladas
        urls = [
            f"https://{source_config['base_url']}/produto/{product_name.lower().replace(' ', '-')}-1",
            f"https://{source_config['base_url']}/produto/{product_name.lower().replace(' ', '-')}-2"
        ]
        
        await self._log_activity("search", source_config["name"], "completed", f"Encontrados {len(urls)} links")
        return urls
    
    async def navigate_and_extract_content(self, urls: List[str], source_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Simula navegação e extração"""
        await self._log_activity("navigation", source_config["name"], "started", f"Navegando em {len(urls)} páginas")
        
        await asyncio.sleep(3)
        
        contents = []
        for i, url in enumerate(urls):
            content = {
                "url": url,
                "title": f"Produto {i+1} - {source_config['name']}",
                "html_content": f"<html><body><h1>Produto {i+1}</h1><p>Conteúdo extraído</p></body></html>",
                "text_content": f"Produto {i+1} - Descrição detalhada do produto encontrado em {source_config['name']}"
            }
            contents.append(content)
        
        await self._log_activity("navigation", source_config["name"], "completed", f"Extraído conteúdo de {len(contents)} páginas")
        return contents
    
    async def extract_product_attributes(self, contents: List[Dict[str, Any]], source_config: Dict[str, Any]) -> Dict[str, Any]:
        """Simula extração de atributos"""
        await self._log_activity("extraction", source_config["name"], "started", "Extraindo atributos dos produtos")
        
        await asyncio.sleep(2)
        
        # Simula atributos extraídos
        attributes = {
            "nome": f"Produto {random.randint(1000, 9999)}",
            "marca": f"Marca {random.choice(['Apple', 'Samsung', 'Sony', 'LG'])}",
            "preco": f"R$ {random.randint(100, 5000)},00",
            "categoria": "Eletrônicos",
            "disponibilidade": "Em estoque",
            "avaliacao": f"{random.randint(3, 5)}.{random.randint(0, 9)}",
            "num_avaliacoes": random.randint(10, 1000),
            "score_confianca": random.uniform(0.7, 0.95)
        }
        
        await self._log_activity("extraction", source_config["name"], "completed", "Atributos extraídos com sucesso")
        return attributes
    
    async def _log_activity(self, agent_type: str, source_name: str, status: str, message: str):
        """Registra atividade dos agentes"""
        log_entry = {
            "agent_type": agent_type,
            "source_name": source_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        self.logs.append(log_entry)
        logger.info(f"[{agent_type.upper()}] {source_name}: {message}")

# Instância global dos agentes
skipper_agents = SkipperAgents()

# Dados mock das fontes
mock_sources = [
    {
        "id": 1,
        "name": "Amazon",
        "type": "marketplace",
        "base_url": "amazon.com.br",
        "search_prompt": "Pesquise por {product} no Amazon Brasil",
        "navigation_prompt": "Acesse a página do produto principal",
        "extraction_prompt": "Extraia os seguintes atributos do produto",
        "recommendation_tags": ["eletronicos", "smartphones", "tecnologia"],
        "is_active": True
    },
    {
        "id": 2,
        "name": "Mercado Livre",
        "type": "marketplace", 
        "base_url": "mercadolivre.com.br",
        "search_prompt": "Pesquise por {product} no Mercado Livre",
        "navigation_prompt": "Acesse a página do produto principal",
        "extraction_prompt": "Extraia os seguintes atributos do produto",
        "recommendation_tags": ["eletronicos", "smartphones", "tecnologia"],
        "is_active": True
    }
]

# Simulações ativas
active_simulations = {}

async def simulate_product_search(simulation_id: str, product_name: str, source_configs: List[Dict]) -> Dict[str, Any]:
    """Executa simulação completa de busca de produtos"""
    
    logger.info(f"Iniciando simulação {simulation_id} para '{product_name}'")
    
    # Inicializar simulação
    simulation_data = {
        "id": simulation_id,
        "product_name": product_name,
        "sources_used": [source["name"] for source in source_configs],
        "results": {},
        "consolidated_product": {},
        "status": "running",
        "created_at": datetime.now().isoformat(),
        "completed_at": None,
        "error": None
    }
    
    active_simulations[simulation_id] = simulation_data
    
    try:
        # Processar cada fonte
        for source_config in source_configs:
            source_name = source_config["name"]
            
            # 1. Buscar links
            urls = await skipper_agents.search_product_links(product_name, source_config)
            
            # 2. Navegar e extrair conteúdo
            contents = await skipper_agents.navigate_and_extract_content(urls, source_config)
            
            # 3. Extrair atributos
            attributes = await skipper_agents.extract_product_attributes(contents, source_config)
            
            # Salvar resultado da fonte
            simulation_data["results"][source_name] = {
                "urls": urls,
                "contents": contents,
                "attributes": attributes
            }
        
        # Consolidar resultados
        if simulation_data["results"]:
            simulation_data["consolidated_product"] = consolidate_results(simulation_data["results"])
            simulation_data["status"] = "completed"
            simulation_data["completed_at"] = datetime.now().isoformat()
            
            logger.info(f"Simulação {simulation_id} concluída com sucesso")
        else:
            simulation_data["status"] = "failed"
            simulation_data["error"] = "Nenhum resultado obtido das fontes"
            logger.warning(f"Simulação {simulation_id} falhou - nenhum resultado")
        
        return simulation_data
        
    except Exception as e:
        logger.error(f"Erro na simulação {simulation_id}: {str(e)}")
        simulation_data["status"] = "failed"
        simulation_data["error"] = str(e)
        return simulation_data

def consolidate_results(results: Dict[str, Any]) -> Dict[str, Any]:
    """Consolida resultados de múltiplas fontes"""
    consolidated = {
        "nome": "",
        "marca": "",
        "preco": "",
        "categoria": "",
        "disponibilidade": "",
        "avaliacao": "",
        "num_avaliacoes": 0,
        "score_confianca": 0.0,
        "fontes_consultadas": list(results.keys())
    }
    
    # Lógica de consolidação simples
    for source_name, result in results.items():
        attributes = result["attributes"]
        
        # Usar o primeiro resultado válido para cada campo
        if not consolidated["nome"] and attributes.get("nome"):
            consolidated["nome"] = attributes["nome"]
        if not consolidated["marca"] and attributes.get("marca"):
            consolidated["marca"] = attributes["marca"]
        if not consolidated["preco"] and attributes.get("preco"):
            consolidated["preco"] = attributes["preco"]
        if not consolidated["categoria"] and attributes.get("categoria"):
            consolidated["categoria"] = attributes["categoria"]
        if not consolidated["disponibilidade"] and attributes.get("disponibilidade"):
            consolidated["disponibilidade"] = attributes["disponibilidade"]
        if not consolidated["avaliacao"] and attributes.get("avaliacao"):
            consolidated["avaliacao"] = attributes["avaliacao"]
        if not consolidated["num_avaliacoes"] and attributes.get("num_avaliacoes"):
            consolidated["num_avaliacoes"] = attributes["num_avaliacoes"]
        
        # Média do score de confiança
        if attributes.get("score_confianca"):
            consolidated["score_confianca"] = max(consolidated["score_confianca"], attributes["score_confianca"])
    
    return consolidated

# Endpoints da API
async def handle_request(reader, writer):
    """Manipula requisições HTTP"""
    request_line = await reader.readline()
    method, path, version = request_line.decode().strip().split(' ')
    
    # Ler headers
    headers = []
    while True:
        line = await reader.readline()
        if line == b'\r\n':
            break
        headers.append(line.decode().strip())
    
    # Ler body se houver
    body = b''
    if 'Content-Length' in str(headers):
        content_length = int([h for h in headers if h.startswith('Content-Length')][0].split(': ')[1])
        body = await reader.read(content_length)
    
    # Processar requisição
    response = await process_request(method, path, body)
    
    # Enviar resposta
    writer.write(response.encode())
    await writer.drain()
    writer.close()
    await writer.wait_closed()

async def process_request(method: str, path: str, body: bytes) -> str:
    """Processa requisição e retorna resposta"""
    
    # Headers padrão
    headers = [
        "HTTP/1.1 200 OK",
        "Content-Type: application/json",
        "Access-Control-Allow-Origin: *",
        "Access-Control-Allow-Methods: GET, POST, OPTIONS",
        "Access-Control-Allow-Headers: Content-Type",
        ""
    ]
    
    try:
        if path == "/health":
            response_data = {"status": "healthy", "timestamp": datetime.now().isoformat()}
        
        elif path == "/api/sources":
            response_data = mock_sources
        
        elif path == "/api/simulation" and method == "POST":
            data = json.loads(body.decode())
            product_name = data.get("product_name", "")
            auto_select_sources = data.get("auto_select_sources", True)
            
            if auto_select_sources:
                source_configs = mock_sources[:2]  # Usar primeiras 2 fontes
            else:
                source_configs = mock_sources
            
            simulation_id = f"sim_{int(time.time())}"
            result = await simulate_product_search(simulation_id, product_name, source_configs)
            response_data = result
        
        elif path.startswith("/api/simulation/") and method == "GET":
            simulation_id = path.split("/")[-1]
            if simulation_id in active_simulations:
                response_data = active_simulations[simulation_id]
            else:
                headers[0] = "HTTP/1.1 404 Not Found"
                response_data = {"error": "Simulação não encontrada"}
        
        elif path.startswith("/api/simulation/") and path.endswith("/logs") and method == "GET":
            response_data = skipper_agents.logs
        
        else:
            headers[0] = "HTTP/1.1 404 Not Found"
            response_data = {"error": "Endpoint não encontrado"}
    
    except Exception as e:
        headers[0] = "HTTP/1.1 500 Internal Server Error"
        response_data = {"error": str(e)}
    
    # Montar resposta
    response = "\r\n".join(headers) + "\r\n" + json.dumps(response_data, indent=2)
    return response

async def main():
    """Inicia o servidor HTTP"""
    server = await asyncio.start_server(
        handle_request, 
        "localhost", 
        7722
    )
    
    logger.info("🚀 Servidor Skipper API iniciado em http://localhost:7722")
    logger.info("📋 Endpoints disponíveis:")
    logger.info("   GET  /health")
    logger.info("   GET  /api/sources")
    logger.info("   POST /api/simulation")
    logger.info("   GET  /api/simulation/{id}")
    logger.info("   GET  /api/simulation/{id}/logs")
    
    async with server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main()) 