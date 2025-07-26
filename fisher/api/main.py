"""
API do Fisher - Tripulante de Pesca de Dados
Responsável por download e processamento de dados estruturados de fontes externas
"""

import json
import asyncio
import logging
import aiohttp
import aiofiles
import zipfile
import csv
import io
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List, Tuple
from pathlib import Path
import hashlib
import os

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FisherService:
    """Serviço principal do Fisher para pesca de dados"""
    
    def __init__(self):
        self.data_dir = Path("data")
        self.data_dir.mkdir(exist_ok=True)
        self.cache_dir = Path("cache")
        self.cache_dir.mkdir(exist_ok=True)
        self.execution_log = []
        
    async def run_fishing_mission(self, source: str, mission_type: str = "incremental") -> Dict[str, Any]:
        """Executa missão de pesca de dados"""
        logger.info(f"🎣 Fisher: Iniciando missão {mission_type} para fonte {source}")
        
        start_time = datetime.now()
        
        try:
            # Determinar fonte e configuração
            source_config = self.get_source_config(source)
            
            # Verificar se há atualizações disponíveis
            if mission_type == "incremental":
                should_update = await self.check_for_updates(source_config)
                if not should_update:
                    return {
                        "status": "skipped",
                        "message": "Nenhuma atualização disponível",
                        "source": source,
                        "timestamp": start_time.isoformat()
                    }
            
            # Executar pipeline de pesca
            results = await self.execute_fishing_pipeline(source_config, mission_type)
            
            # Registrar execução
            execution_record = {
                "source": source,
                "mission_type": mission_type,
                "start_time": start_time.isoformat(),
                "end_time": datetime.now().isoformat(),
                "duration_seconds": (datetime.now() - start_time).total_seconds(),
                "records_processed": results.get("records_processed", 0),
                "files_downloaded": results.get("files_downloaded", 0),
                "status": "success",
                "errors": results.get("errors", [])
            }
            
            self.execution_log.append(execution_record)
            await self.save_execution_log()
            
            return {
                "status": "success",
                "source": source,
                "mission_type": mission_type,
                "results": results,
                "execution_record": execution_record
            }
            
        except Exception as e:
            logger.error(f"❌ Fisher: Erro na missão {source}: {str(e)}")
            return {
                "status": "error",
                "source": source,
                "error": str(e),
                "timestamp": start_time.isoformat()
            }
    
    def get_source_config(self, source: str) -> Dict[str, Any]:
        """Retorna configuração da fonte de dados"""
        configs = {
            "receita-federal": {
                "name": "Receita Federal - CNPJs",
                "base_url": "https://dados.gov.br/dados/cnpj/",
                "metadata_url": "https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf",
                "file_patterns": ["*.zip", "*.csv"],
                "update_frequency": "monthly",
                "schema": {
                    "cnpj": "string",
                    "razao_social": "string", 
                    "nome_fantasia": "string",
                    "uf": "string",
                    "municipio": "string",
                    "data_inicio_atividade": "date",
                    "atividade_principal": "string"
                }
            },
            "open-food-facts": {
                "name": "Open Food Facts",
                "base_url": "https://world.openfoodfacts.org/data",
                "file_patterns": ["*.csv", "*.json"],
                "update_frequency": "daily",
                "schema": {
                    "code": "string",
                    "product_name": "string",
                    "brands": "string",
                    "categories": "string",
                    "ingredients": "string",
                    "nutrition_grade": "string"
                }
            }
        }
        
        if source not in configs:
            raise ValueError(f"Fonte {source} não suportada")
        
        return configs[source]
    
    async def check_for_updates(self, source_config: Dict[str, Any]) -> bool:
        """Verifica se há atualizações disponíveis"""
        logger.info(f"🔍 Fisher: Verificando atualizações para {source_config['name']}")
        
        # Simula verificação de atualizações
        await asyncio.sleep(1)
        
        # Para demonstração, sempre retorna True
        # Em implementação real, verificaria timestamps, ETags, etc.
        return True
    
    async def execute_fishing_pipeline(self, source_config: Dict[str, Any], mission_type: str) -> Dict[str, Any]:
        """Executa pipeline completo de pesca de dados"""
        logger.info(f"🎣 Fisher: Executando pipeline para {source_config['name']}")
        
        results = {
            "files_downloaded": 0,
            "records_processed": 0,
            "errors": [],
            "output_files": []
        }
        
        try:
            # 1. Download dos arquivos
            downloaded_files = await self.download_files(source_config)
            results["files_downloaded"] = len(downloaded_files)
            
            # 2. Processamento e normalização
            for file_path in downloaded_files:
                try:
                    processed_data = await self.process_file(file_path, source_config)
                    results["records_processed"] += len(processed_data)
                    
                    # 3. Salvar dados normalizados
                    output_file = await self.save_normalized_data(processed_data, source_config)
                    results["output_files"].append(output_file)
                    
                except Exception as e:
                    error_msg = f"Erro processando {file_path}: {str(e)}"
                    results["errors"].append(error_msg)
                    logger.error(f"❌ {error_msg}")
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Fisher: Erro no pipeline: {str(e)}")
            results["errors"].append(str(e))
            return results
    
    async def download_files(self, source_config: Dict[str, Any]) -> List[Path]:
        """Download de arquivos da fonte"""
        logger.info(f"📥 Fisher: Baixando arquivos de {source_config['name']}")
        
        # URLs simuladas para demonstração
        urls = [
            f"{source_config['base_url']}/sample-data-1.csv",
            f"{source_config['base_url']}/sample-data-2.zip"
        ]
        
        downloaded_files = []
        
        async with aiohttp.ClientSession() as session:
            for url in urls:
                try:
                    file_path = await self.download_file(session, url, source_config)
                    if file_path:
                        downloaded_files.append(file_path)
                        
                except Exception as e:
                    logger.error(f"❌ Erro baixando {url}: {str(e)}")
        
        return downloaded_files
    
    async def download_file(self, session: aiohttp.ClientSession, url: str, source_config: Dict[str, Any]) -> Optional[Path]:
        """Download de um arquivo específico"""
        try:
            # Simula download para demonstração
            await asyncio.sleep(2)
            
            # Cria arquivo simulado
            filename = url.split("/")[-1]
            file_path = self.data_dir / filename
            
            # Simula conteúdo baseado no tipo de fonte
            if "receita-federal" in source_config["name"].lower():
                content = self.generate_mock_cnpj_data()
            else:
                content = self.generate_mock_product_data()
            
            async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
                await f.write(content)
            
            logger.info(f"✅ Fisher: Arquivo baixado {filename}")
            return file_path
            
        except Exception as e:
            logger.error(f"❌ Erro no download: {str(e)}")
            return None
    
    def generate_mock_cnpj_data(self) -> str:
        """Gera dados simulados de CNPJ"""
        return """cnpj,razao_social,nome_fantasia,uf,municipio,data_inicio_atividade,atividade_principal
12345678000199,LENOVO TECNOLOGIA BRASIL LTDA,Lenovo,SP,Indaiatuba,2001-01-01,Comércio varejista de equipamentos
98765432000188,SAMSUNG ELETRONICA DA AMAZONIA LTDA,Samsung,AM,Manaus,1995-03-15,Fabricação de equipamentos eletrônicos
45678912000177,APPLE COMPUTER BRASIL LTDA,Apple,SP,São Paulo,2010-06-20,Comércio varejista de informática"""
    
    def generate_mock_product_data(self) -> str:
        """Gera dados simulados de produtos"""
        return """code,product_name,brands,categories,ingredients,nutrition_grade
7891234567890,Notebook Lenovo Ideapad 3,Lenovo,Informática > Notebook,Componentes eletrônicos,A
7891234567891,Samsung Galaxy S24,Samsung,Telefonia > Smartphone,Componentes eletrônicos,A
7891234567892,iPhone 15,Apple,Telefonia > Smartphone,Componentes eletrônicos,A"""
    
    async def process_file(self, file_path: Path, source_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Processa e normaliza arquivo"""
        logger.info(f"⚙️ Fisher: Processando {file_path.name}")
        
        # Simula processamento
        await asyncio.sleep(1)
        
        # Lê arquivo e normaliza dados
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
        
        # Parse CSV
        lines = content.strip().split('\n')
        headers = lines[0].split(',')
        data = []
        
        for line in lines[1:]:
            values = line.split(',')
            row = dict(zip(headers, values))
            
            # Normalização
            normalized_row = self.normalize_data(row, source_config)
            data.append(normalized_row)
        
        logger.info(f"✅ Fisher: Processados {len(data)} registros de {file_path.name}")
        return data
    
    def normalize_data(self, row: Dict[str, Any], source_config: Dict[str, Any]) -> Dict[str, Any]:
        """Normaliza dados para formato canônico"""
        normalized = {}
        
        for field, value in row.items():
            # Converter para snake_case
            field_normalized = field.lower().replace(' ', '_')
            
            # Aplicar transformações baseadas no schema
            if field_normalized in source_config["schema"]:
                field_type = source_config["schema"][field_normalized]
                
                if field_type == "date":
                    # Normalizar formato de data
                    try:
                        date_obj = datetime.strptime(value, "%Y-%m-%d")
                        normalized[field_normalized] = date_obj.strftime("%Y-%m-%d")
                    except:
                        normalized[field_normalized] = value
                elif field_type == "string":
                    # Limpar e normalizar strings
                    normalized[field_normalized] = value.strip()
                else:
                    normalized[field_normalized] = value
        
        return normalized
    
    async def save_normalized_data(self, data: List[Dict[str, Any]], source_config: Dict[str, Any]) -> str:
        """Salva dados normalizados"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        source_name = source_config["name"].lower().replace(" ", "_")
        
        # Salvar como JSON
        json_file = self.data_dir / f"{source_name}_{timestamp}.json"
        async with aiofiles.open(json_file, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(data, indent=2, ensure_ascii=False))
        
        # Salvar como Parquet (simulado)
        parquet_file = self.data_dir / f"{source_name}_{timestamp}.parquet"
        # Em implementação real, usaria pandas ou pyarrow
        
        logger.info(f"💾 Fisher: Dados salvos em {json_file.name}")
        return str(json_file)
    
    async def save_execution_log(self):
        """Salva log de execuções"""
        log_file = self.data_dir / "execution_log.jsonl"
        
        async with aiofiles.open(log_file, 'a', encoding='utf-8') as f:
            for record in self.execution_log[-10:]:  # Últimas 10 execuções
                await f.write(json.dumps(record) + '\n')
    
    async def get_execution_history(self) -> List[Dict[str, Any]]:
        """Retorna histórico de execuções"""
        return self.execution_log[-20:]  # Últimas 20 execuções

# Instância global do serviço
fisher_service = FisherService()

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
        
        elif path == "/fisher/mission" and method == "POST":
            data = json.loads(body.decode())
            source = data.get("source", "")
            mission_type = data.get("mission_type", "incremental")
            
            if source:
                response_data = await fisher_service.run_fishing_mission(source, mission_type)
            else:
                headers[0] = "HTTP/1.1 400 Bad Request"
                response_data = {"error": "Source é obrigatório"}
        
        elif path == "/fisher/history" and method == "GET":
            response_data = await fisher_service.get_execution_history()
        
        elif path == "/fisher/sources" and method == "GET":
            response_data = {
                "sources": [
                    {
                        "id": "receita-federal",
                        "name": "Receita Federal - CNPJs",
                        "description": "Dados de empresas brasileiras",
                        "update_frequency": "monthly",
                        "last_update": "2024-01-15T00:00:00Z"
                    },
                    {
                        "id": "open-food-facts",
                        "name": "Open Food Facts",
                        "description": "Base de dados de produtos alimentícios",
                        "update_frequency": "daily",
                        "last_update": "2024-01-15T12:00:00Z"
                    }
                ]
            }
        
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
        7724
    )
    
    logger.info("🎣 Servidor Fisher API iniciado em http://localhost:7724")
    logger.info("📋 Endpoints disponíveis:")
    logger.info("   GET  /health")
    logger.info("   POST /fisher/mission")
    logger.info("   GET  /fisher/history")
    logger.info("   GET  /fisher/sources")
    
    async with server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main()) 