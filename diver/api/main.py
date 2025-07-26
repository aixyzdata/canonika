"""
API do Diver - Tripulante de Consulta Canônica
Responsável por receber dados e consultar Wayfinder/Skipper
"""

import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List
import xml.etree.ElementTree as ET
import re

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simulação dos módulos Wayfinder e Skipper
class WayfinderService:
    """Simulação do serviço Wayfinder"""
    
    def __init__(self):
        self.products_db = {
            "7891234567890": {
                "ean": "7891234567890",
                "nome": "Notebook Lenovo Ideapad 3",
                "fabricante": "Lenovo",
                "ncm": "84713012",
                "dimensoes": {
                    "largura_cm": 35.7,
                    "altura_cm": 1.9,
                    "profundidade_cm": 23.6
                },
                "peso_kg": 1.65,
                "categoria": "Informática > Notebook",
                "fonte": "wayfinder_cache"
            }
        }
        
        self.companies_db = {
            "12345678000199": {
                "cnpj": "12345678000199",
                "razao_social": "LENOVO TECNOLOGIA BRASIL LTDA",
                "nome_fantasia": "Lenovo",
                "uf": "SP",
                "municipio": "Indaiatuba",
                "fonte": "wayfinder_cache"
            }
        }
    
    async def get_product(self, ean: str) -> Optional[Dict[str, Any]]:
        """Consulta produto no Wayfinder"""
        logger.info(f"🔍 Wayfinder: Consultando produto EAN {ean}")
        return self.products_db.get(ean)
    
    async def get_company(self, cnpj: str) -> Optional[Dict[str, Any]]:
        """Consulta empresa no Wayfinder"""
        logger.info(f"🔍 Wayfinder: Consultando empresa CNPJ {cnpj}")
        return self.companies_db.get(cnpj)
    
    async def save_product(self, data: Dict[str, Any]) -> bool:
        """Salva produto no Wayfinder"""
        ean = data.get("ean")
        if ean:
            self.products_db[ean] = data
            logger.info(f"💾 Wayfinder: Produto {ean} salvo")
            return True
        return False
    
    async def save_company(self, data: Dict[str, Any]) -> bool:
        """Salva empresa no Wayfinder"""
        cnpj = data.get("cnpj")
        if cnpj:
            self.companies_db[cnpj] = data
            logger.info(f"💾 Wayfinder: Empresa {cnpj} salva")
            return True
        return False

class SkipperService:
    """Simulação do serviço Skipper"""
    
    async def lookup_product(self, ean: str, description: str) -> Optional[Dict[str, Any]]:
        """Busca produto externamente via Skipper"""
        logger.info(f"🌐 Skipper: Buscando produto EAN {ean} - {description}")
        
        # Simula busca externa
        await asyncio.sleep(2)
        
        # Retorna dados simulados
        return {
            "ean": ean,
            "nome": f"Produto {description[:20]}...",
            "fabricante": "Fabricante Simulado",
            "ncm": "84713012",
            "dimensoes": {
                "largura_cm": 30.0,
                "altura_cm": 2.0,
                "profundidade_cm": 20.0
            },
            "peso_kg": 1.5,
            "categoria": "Eletrônicos > Informática",
            "fonte": "skipper_web_search"
        }
    
    async def lookup_company(self, cnpj: str, razao_social: str) -> Optional[Dict[str, Any]]:
        """Busca empresa externamente via Skipper"""
        logger.info(f"🌐 Skipper: Buscando empresa CNPJ {cnpj} - {razao_social}")
        
        # Simula busca externa
        await asyncio.sleep(2)
        
        # Retorna dados simulados
        return {
            "cnpj": cnpj,
            "razao_social": razao_social,
            "nome_fantasia": razao_social.split()[0],
            "uf": "SP",
            "municipio": "São Paulo",
            "fonte": "skipper_web_search"
        }

class DiverService:
    """Serviço principal do Diver"""
    
    def __init__(self):
        self.wayfinder = WayfinderService()
        self.skipper = SkipperService()
    
    async def consulta_produto(self, ean: str, description: str = "") -> Dict[str, Any]:
        """Consulta produto seguindo a lógica canônica"""
        logger.info(f"🤿 Diver: Iniciando consulta produto EAN {ean}")
        
        # 1. Consultar Wayfinder primeiro
        produto = await self.wayfinder.get_product(ean)
        
        if produto:
            logger.info(f"✅ Diver: Produto encontrado no Wayfinder")
            return {"produto": produto, "empresa": None}
        
        # 2. Se não encontrado, acionar Skipper
        logger.info(f"🔍 Diver: Produto não encontrado, acionando Skipper")
        produto = await self.skipper.lookup_product(ean, description)
        
        if produto:
            # 3. Salvar no Wayfinder
            await self.wayfinder.save_product(produto)
            logger.info(f"💾 Diver: Produto salvo no Wayfinder")
            return {"produto": produto, "empresa": None}
        
        return {"produto": None, "empresa": None, "error": "Produto não encontrado"}
    
    async def consulta_empresa(self, cnpj: str, razao_social: str = "") -> Dict[str, Any]:
        """Consulta empresa seguindo a lógica canônica"""
        logger.info(f"🤿 Diver: Iniciando consulta empresa CNPJ {cnpj}")
        
        # 1. Consultar Wayfinder primeiro
        empresa = await self.wayfinder.get_company(cnpj)
        
        if empresa:
            logger.info(f"✅ Diver: Empresa encontrada no Wayfinder")
            return {"produto": None, "empresa": empresa}
        
        # 2. Se não encontrada, acionar Skipper
        logger.info(f"🔍 Diver: Empresa não encontrada, acionando Skipper")
        empresa = await self.skipper.lookup_company(cnpj, razao_social)
        
        if empresa:
            # 3. Salvar no Wayfinder
            await self.wayfinder.save_company(empresa)
            logger.info(f"💾 Diver: Empresa salva no Wayfinder")
            return {"produto": None, "empresa": empresa}
        
        return {"produto": None, "empresa": None, "error": "Empresa não encontrada"}
    
    def parse_xml_nfe(self, xml_content: str) -> Dict[str, Any]:
        """Parse XML da NFe e extrai dados"""
        try:
            root = ET.fromstring(xml_content)
            
            # Namespace da NFe
            ns = {'nfe': 'http://www.portalfiscal.inf.br/nfe'}
            
            # Extrair dados do emitente
            emitente = root.find('.//nfe:emit', ns)
            if emitente is not None:
                cnpj = emitente.find('nfe:CNPJ', ns)
                razao_social = emitente.find('nfe:xNome', ns)
                
                emitente_data = {
                    "cnpj": cnpj.text if cnpj is not None else "",
                    "razao_social": razao_social.text if razao_social is not None else ""
                }
            else:
                emitente_data = {"cnpj": "", "razao_social": ""}
            
            # Extrair produtos
            produtos = []
            for det in root.findall('.//nfe:det', ns):
                prod = det.find('nfe:prod', ns)
                if prod is not None:
                    ean = prod.find('nfe:cEAN', ns)
                    descricao = prod.find('nfe:xProd', ns)
                    
                    produto_data = {
                        "ean": ean.text if ean is not None else "",
                        "descricao": descricao.text if descricao is not None else ""
                    }
                    produtos.append(produto_data)
            
            return {
                "emitente": emitente_data,
                "produtos": produtos
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao parsear XML: {str(e)}")
            return {"error": f"Erro ao parsear XML: {str(e)}"}
    
    async def processar_nfe(self, xml_content: str) -> Dict[str, Any]:
        """Processa NFe completa"""
        logger.info(f"📄 Diver: Processando NFe")
        
        # Parse XML
        dados_nfe = self.parse_xml_nfe(xml_content)
        if "error" in dados_nfe:
            return dados_nfe
        
        resultados = {
            "emitente": None,
            "produtos": [],
            "timestamp": datetime.now().isoformat()
        }
        
        # Processar emitente
        if dados_nfe["emitente"]["cnpj"]:
            consulta_empresa = await self.consulta_empresa(
                dados_nfe["emitente"]["cnpj"],
                dados_nfe["emitente"]["razao_social"]
            )
            resultados["emitente"] = consulta_empresa.get("empresa")
        
        # Processar produtos
        for produto_nfe in dados_nfe["produtos"]:
            if produto_nfe["ean"]:
                consulta_produto = await self.consulta_produto(
                    produto_nfe["ean"],
                    produto_nfe["descricao"]
                )
                if consulta_produto.get("produto"):
                    resultados["produtos"].append(consulta_produto["produto"])
        
        return resultados

# Instância global do serviço
diver_service = DiverService()

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
        
        elif path == "/diver/consulta" and method == "POST":
            data = json.loads(body.decode())
            ean = data.get("ean", "")
            description = data.get("description", "")
            
            if ean:
                response_data = await diver_service.consulta_produto(ean, description)
            else:
                headers[0] = "HTTP/1.1 400 Bad Request"
                response_data = {"error": "EAN é obrigatório"}
        
        elif path == "/diver/upload" and method == "POST":
            data = json.loads(body.decode())
            xml_content = data.get("xml_content", "")
            
            if xml_content:
                response_data = await diver_service.processar_nfe(xml_content)
            else:
                headers[0] = "HTTP/1.1 400 Bad Request"
                response_data = {"error": "XML content é obrigatório"}
        
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
        7723
    )
    
    logger.info("🤿 Servidor Diver API iniciado em http://localhost:7723")
    logger.info("📋 Endpoints disponíveis:")
    logger.info("   GET  /health")
    logger.info("   POST /diver/consulta")
    logger.info("   POST /diver/upload")
    
    async with server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main()) 