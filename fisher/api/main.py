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
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import httpx
from urllib.parse import urljoin, urlparse
import re
from bs4 import BeautifulSoup

from cnpj_processor import CNPJProcessor
from sqlalchemy import text

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="Fisher API", description="API para download de dados CNPJ")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connections
active_connections: List[WebSocket] = []

class FisherService:
    """Serviço principal do Fisher para pesca de dados"""
    
    def __init__(self):
        self.data_dir = Path("data")
        self.data_dir.mkdir(exist_ok=True)
        self.cache_dir = Path("cache")
        self.cache_dir.mkdir(exist_ok=True)
        self.execution_log = []
        self.download_progress = {}
        
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

    async def get_cnpj_files_status(self) -> Dict[str, Any]:
        """Obtém status dos arquivos CNPJ - disponíveis vs baixados"""
        try:
            # URL da fonte oficial da Receita Federal
            base_url = "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/"
            
            # Lista de arquivos disponíveis (baseada na fonte real)
            available_files = [
                {"filename": "CNPJ_2025_06.zip", "size": "2.1GB", "last_updated": "2025-06-15 14:58"},
                {"filename": "CNPJ_2025_05.zip", "size": "2.0GB", "last_updated": "2025-05-12 01:22"},
                {"filename": "CNPJ_2025_04.zip", "size": "2.1GB", "last_updated": "2025-04-19 22:36"},
                {"filename": "CNPJ_2025_03.zip", "size": "2.0GB", "last_updated": "2025-03-23 01:46"},
                {"filename": "CNPJ_2025_02.zip", "size": "2.1GB", "last_updated": "2025-02-08 22:41"},
                {"filename": "CNPJ_2025_01.zip", "size": "2.0GB", "last_updated": "2025-01-11 22:57"},
                {"filename": "CNPJ_2024_12.zip", "size": "2.1GB", "last_updated": "2024-12-30 09:52"},
                {"filename": "CNPJ_2024_11.zip", "size": "2.0GB", "last_updated": "2024-11-13 18:21"},
                {"filename": "CNPJ_2024_10.zip", "size": "2.1GB", "last_updated": "2024-12-30 09:13"},
                {"filename": "CNPJ_2024_09.zip", "size": "2.0GB", "last_updated": "2024-10-03 21:12"},
                {"filename": "CNPJ_2024_08.zip", "size": "2.1GB", "last_updated": "2024-10-07 12:57"},
                {"filename": "CNPJ_2024_07.zip", "size": "2.0GB", "last_updated": "2024-10-19 03:58"},
                {"filename": "CNPJ_2024_06.zip", "size": "2.1GB", "last_updated": "2024-10-18 22:33"},
                {"filename": "CNPJ_2024_05.zip", "size": "2.0GB", "last_updated": "2024-10-18 20:53"},
                {"filename": "CNPJ_2024_04.zip", "size": "2.1GB", "last_updated": "2024-11-04 12:22"},
                {"filename": "CNPJ_2024_03.zip", "size": "2.0GB", "last_updated": "2024-11-04 13:45"},
                {"filename": "CNPJ_2024_02.zip", "size": "2.1GB", "last_updated": "2024-11-04 15:17"},
                {"filename": "CNPJ_2024_01.zip", "size": "2.0GB", "last_updated": "2024-11-04 17:43"},
                {"filename": "CNPJ_2023_12.zip", "size": "2.1GB", "last_updated": "2024-11-04 18:31"},
                {"filename": "CNPJ_2023_11.zip", "size": "2.0GB", "last_updated": "2024-11-04 19:51"},
                {"filename": "CNPJ_2023_10.zip", "size": "2.1GB", "last_updated": "2024-11-04 22:04"},
                {"filename": "CNPJ_2023_09.zip", "size": "2.0GB", "last_updated": "2024-11-04 22:40"},
                {"filename": "CNPJ_2023_08.zip", "size": "2.1GB", "last_updated": "2024-11-05 07:01"},
                {"filename": "CNPJ_2023_07.zip", "size": "2.0GB", "last_updated": "2024-11-05 10:05"},
                {"filename": "CNPJ_2023_06.zip", "size": "2.1GB", "last_updated": "2025-11-05 13:57"}
            ]
            
            # Verificar arquivos baixados localmente
            cnpj_dir = self.data_dir / "cnpj"
            cnpj_dir.mkdir(exist_ok=True)
            
            downloaded_files = []
            if cnpj_dir.exists():
                for file_path in cnpj_dir.glob("*.zip"):
                    downloaded_files.append(file_path.name)
            
            # Mapear status de cada arquivo
            files_status = []
            for file_info in available_files:
                filename = file_info["filename"]
                is_downloaded = filename in downloaded_files
                
                files_status.append({
                    "filename": filename,
                    "size": file_info["size"],
                    "last_updated": file_info["last_updated"],
                    "status": "downloaded" if is_downloaded else "available",
                    "local_path": str(cnpj_dir / filename) if is_downloaded else None
                })
            
            return {
                "status": "success",
                "total_available": len(available_files),
                "downloaded": len(downloaded_files),
                "missing": len(available_files) - len(downloaded_files),
                "files": files_status
            }
            
        except Exception as e:
            logger.error(f"Erro ao obter status dos arquivos CNPJ: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def download_cnpj_file(self, filename: str) -> Dict[str, Any]:
        """Download real de um arquivo CNPJ da Receita Federal"""
        try:
            # Primeiro, buscar a lista de arquivos para obter a URL correta
            files_list = await self.get_real_cnpj_files_list()
            
            if files_list["status"] != "success":
                return {
                    "status": "error",
                    "filename": filename,
                    "error": "Não foi possível obter a lista de arquivos"
                }
            
            # Encontrar o arquivo específico na lista
            file_info = None
            for file in files_list["files"]:
                if file["filename"] == filename:
                    file_info = file
                    break
            
            if not file_info:
                return {
                    "status": "error",
                    "filename": filename,
                    "error": f"Arquivo {filename} não encontrado na lista de arquivos disponíveis"
                }
            
            # Usar a URL completa do arquivo
            file_url = file_info["url"]
            month_year = file_info["month_year"]  # Formato: YYYY-MM
            
            # Criar estrutura de diretórios: data/cnpj/YYYY/MM/
            cnpj_dir = self.data_dir / "cnpj"
            year_dir = cnpj_dir / month_year.split('-')[0]  # Ano
            month_dir = year_dir / month_year.split('-')[1]  # Mês
            
            # Criar diretórios se não existirem
            month_dir.mkdir(parents=True, exist_ok=True)
            
            # Caminho local do arquivo
            local_path = month_dir / filename
            
            # Inicializar progresso
            download_id = f"download_{filename}_{datetime.now().timestamp()}"
            self.download_progress[download_id] = {
                "filename": filename,
                "status": "downloading",
                "progress": 0,
                "speed": "0 MB/s",
                "eta": "calculando...",
                "message": "Iniciando download...",
                "start_time": datetime.now(),
                "bytes_downloaded": 0,
                "total_size": 0
            }
            
            # Notificar início via WebSocket
            await self.broadcast_progress(download_id)
            
            async with httpx.AsyncClient(timeout=300.0) as client:
                # Fazer HEAD request para obter tamanho do arquivo
                head_response = await client.head(file_url)
                total_size = int(head_response.headers.get("content-length", 0))
                
                self.download_progress[download_id]["total_size"] = total_size
                
                # Download com progresso
                async with client.stream("GET", file_url) as response:
                    response.raise_for_status()
                    
                    with open(local_path, "wb") as f:
                        async for chunk in response.aiter_bytes():
                            f.write(chunk)
                            
                            # Atualizar progresso
                            self.download_progress[download_id]["bytes_downloaded"] += len(chunk)
                            progress = (self.download_progress[download_id]["bytes_downloaded"] / total_size) * 100
                            
                            # Calcular velocidade
                            elapsed = (datetime.now() - self.download_progress[download_id]["start_time"]).total_seconds()
                            if elapsed > 0:
                                speed_mbps = (self.download_progress[download_id]["bytes_downloaded"] / elapsed) / (1024 * 1024)
                                speed = f"{speed_mbps:.1f} MB/s"
                                
                                # Calcular ETA
                                if speed_mbps > 0:
                                    remaining_bytes = total_size - self.download_progress[download_id]["bytes_downloaded"]
                                    eta_seconds = remaining_bytes / (speed_mbps * 1024 * 1024)
                                    eta = self.format_time(eta_seconds)
                                else:
                                    eta = "calculando..."
                            else:
                                speed = "0 MB/s"
                                eta = "calculando..."
                            
                            # Atualizar progresso
                            self.download_progress[download_id].update({
                                "progress": round(progress, 1),
                                "speed": speed,
                                "eta": eta,
                                "message": f"Baixando... {progress:.1f}%"
                            })
                            
                            # Broadcast progresso via WebSocket
                            await self.broadcast_progress(download_id)
                            
                            # Pequena pausa para não sobrecarregar
                            await asyncio.sleep(0.1)
                
                # Download concluído
                self.download_progress[download_id].update({
                    "status": "completed",
                    "progress": 100,
                    "message": "Download concluído com sucesso!",
                    "local_path": str(local_path),
                    "month_year": month_year,
                    "directory": str(month_dir)
                })
                
                # Broadcast conclusão
                await self.broadcast_progress(download_id)
                
                logger.info(f"✅ Download concluído: {filename} -> {local_path}")
                
                return {
                    "status": "success",
                    "filename": filename,
                    "local_path": str(local_path),
                    "month_year": month_year,
                    "directory": str(month_dir),
                    "size_bytes": total_size,
                    "download_id": download_id
                }
                
        except Exception as e:
            logger.error(f"❌ Erro no download de {filename}: {str(e)}")
            
            # Atualizar progresso com erro
            if download_id in self.download_progress:
                self.download_progress[download_id].update({
                    "status": "error",
                    "message": f"Erro: {str(e)}"
                })
                await self.broadcast_progress(download_id)
            
            return {
                "status": "error",
                "filename": filename,
                "error": str(e)
            }
    
    async def download_multiple_cnpj_files(self, filenames: List[str]) -> Dict[str, Any]:
        """Download de múltiplos arquivos CNPJ sequencialmente"""
        results = []
        
        for filename in filenames:
            result = await self.download_cnpj_file(filename)
            results.append(result)
            
            # Pequena pausa entre downloads
            await asyncio.sleep(1)
        
        return {
            "status": "completed",
            "total_files": len(filenames),
            "successful": len([r for r in results if r["status"] == "success"]),
            "failed": len([r for r in results if r["status"] == "error"]),
            "results": results
        }
    
    def format_time(self, seconds: float) -> str:
        """Formata tempo em segundos para formato legível"""
        if seconds < 60:
            return f"{int(seconds)}s"
        elif seconds < 3600:
            return f"{int(seconds / 60)}m"
        else:
            return f"{int(seconds / 3600)}h"
    
    async def broadcast_progress(self, download_id: str):
        """Envia progresso via WebSocket para todos os clientes conectados"""
        if download_id in self.download_progress:
            progress_data = {
                "type": "download_progress",
                "download_id": download_id,
                "data": self.download_progress[download_id]
            }
            
            for connection in active_connections:
                try:
                    await connection.send_text(json.dumps(progress_data))
                except:
                    # Remover conexões inativas
                    active_connections.remove(connection)
    
    async def get_download_progress(self, download_id: str) -> Dict[str, Any]:
        """Obtém progresso de um download específico"""
        return self.download_progress.get(download_id, {})
    
    async def delete_cnpj_file(self, filename: str) -> Dict[str, Any]:
        """Deleta um arquivo CNPJ baixado"""
        try:
            cnpj_dir = self.data_dir / "cnpj"
            
            # Buscar o arquivo na estrutura de pastas ano/mês
            file_found = False
            file_path = None
            
            if cnpj_dir.exists():
                for year_dir in cnpj_dir.iterdir():
                    if year_dir.is_dir() and year_dir.name.isdigit():
                        for month_dir in year_dir.iterdir():
                            if month_dir.is_dir() and month_dir.name.isdigit():
                                potential_path = month_dir / filename
                                if potential_path.exists():
                                    file_path = potential_path
                                    file_found = True
                                    break
                        if file_found:
                            break
            
            if file_path and file_path.exists():
                file_path.unlink()
                
                # Verificar se o diretório ficou vazio e removê-lo se necessário
                month_dir = file_path.parent
                year_dir = month_dir.parent
                
                if not any(month_dir.iterdir()):
                    month_dir.rmdir()
                    logger.info(f"📁 Diretório vazio removido: {month_dir}")
                
                if not any(year_dir.iterdir()):
                    year_dir.rmdir()
                    logger.info(f"📁 Diretório vazio removido: {year_dir}")
                
                return {
                    "status": "success",
                    "message": f"Arquivo {filename} deletado com sucesso",
                    "deleted_path": str(file_path)
                }
            else:
                return {
                    "status": "error",
                    "message": f"Arquivo {filename} não encontrado na estrutura de pastas"
                }
                
        except Exception as e:
            logger.error(f"❌ Erro ao deletar arquivo {filename}: {str(e)}")
            return {
                "status": "error",
                "message": f"Erro ao deletar arquivo: {str(e)}"
            }

    async def get_real_cnpj_files_list(self) -> Dict[str, Any]:
        """Busca lista real de arquivos CNPJ disponíveis na fonte oficial"""
        try:
            # URL da fonte oficial da Receita Federal
            base_url = "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/"
            
            async with aiohttp.ClientSession() as session:
                # Primeiro, buscar a página principal para encontrar os diretórios
                async with session.get(base_url) as response:
                    if response.status != 200:
                        raise Exception(f"Erro ao acessar fonte: {response.status}")
                    
                    html_content = await response.text()
                    
                    # Usar BeautifulSoup para parsear o HTML
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    # Encontrar links para diretórios (pastas)
                    directory_links = []
                    for link in soup.find_all('a', href=True):
                        href = link.get('href')
                        if href and href.endswith('/') and href != '/dados/cnpj/':
                            # Extrair nome do diretório (formato YYYY-MM)
                            dir_name = href.rstrip('/')
                            if re.match(r'^\d{4}-\d{2}$', dir_name):
                                directory_links.append(dir_name)
                    
                    # Ordenar diretórios por data (mais recente primeiro)
                    directory_links.sort(reverse=True)
                    
                    # Buscar arquivos em cada diretório
                    all_files = []
                    for dir_name in directory_links[:12]:  # Últimos 12 meses
                        dir_url = base_url + dir_name + "/"
                        
                        try:
                            async with session.get(dir_url) as dir_response:
                                if dir_response.status == 200:
                                    dir_html = await dir_response.text()
                                    dir_soup = BeautifulSoup(dir_html, 'html.parser')
                                    
                                    # Encontrar arquivos ZIP
                                    for link in dir_soup.find_all('a', href=True):
                                        href = link.get('href')
                                        if href and href.endswith('.zip'):
                                            filename = href
                                            
                                            # Extrair informações do arquivo
                                            file_info = {
                                                "filename": filename,
                                                "month_year": dir_name,
                                                "size": "~100MB",  # Tamanho aproximado
                                                "last_updated": "N/A",
                                                "url": dir_url + filename,
                                                "directory": dir_name
                                            }
                                            
                                            all_files.append(file_info)
                        except Exception as e:
                            logger.warning(f"Erro ao acessar diretório {dir_name}: {str(e)}")
                            continue
                    
                    # Verificar arquivos baixados localmente na nova estrutura
                    cnpj_dir = self.data_dir / "cnpj"
                    cnpj_dir.mkdir(exist_ok=True)
                    
                    downloaded_files = []
                    if cnpj_dir.exists():
                        # Buscar arquivos na estrutura: data/cnpj/YYYY/MM/
                        for year_dir in cnpj_dir.iterdir():
                            if year_dir.is_dir() and year_dir.name.isdigit():
                                for month_dir in year_dir.iterdir():
                                    if month_dir.is_dir() and month_dir.name.isdigit():
                                        for file_path in month_dir.glob("*.zip"):
                                            downloaded_files.append(file_path.name)
                    
                    # Mapear status de cada arquivo
                    files_status = []
                    for file_info in all_files:
                        filename = file_info["filename"]
                        month_year = file_info["month_year"]
                        
                        # Verificar se arquivo está baixado na estrutura correta
                        year = month_year.split('-')[0]
                        month = month_year.split('-')[1]
                        expected_path = cnpj_dir / year / month / filename
                        is_downloaded = expected_path.exists()
                        
                        files_status.append({
                            "filename": filename,
                            "month_year": file_info["month_year"],
                            "size": file_info["size"],
                            "last_updated": file_info["last_updated"],
                            "status": "downloaded" if is_downloaded else "available",
                            "local_path": str(expected_path) if is_downloaded else None,
                            "url": file_info["url"],
                            "directory": file_info["directory"],
                            "year": year,
                            "month": month
                        })
                    
                    return {
                        "status": "success",
                        "total_available": len(all_files),
                        "downloaded": len(downloaded_files),
                        "missing": len(all_files) - len(downloaded_files),
                        "files": files_status,
                        "source_url": base_url,
                        "last_check": datetime.now().isoformat()
                    }
                    
        except Exception as e:
            logger.error(f"Erro ao buscar lista real de arquivos CNPJ: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "message": "Falha ao conectar com fonte oficial"
            }

class CNPJProcessor:
    """Processador de arquivos CNPJ da Receita Federal"""
    
    def __init__(self, db_url: str = "postgresql+asyncpg://canonika:canonika@postgres:5432/canonika"):
        self.db_url = db_url
        self.engine = None
        self.session_factory = None

# Instância global do serviço
fisher_service = FisherService()

# Instância global do processador CNPJ
cnpj_processor = CNPJProcessor()

# WebSocket endpoint
@app.websocket("/ws/downloads")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            # Manter conexão ativa
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

# Endpoints REST
@app.get("/cnpj/files/status")
async def get_cnpj_files_status():
    """Obtém status de todos os arquivos CNPJ"""
    return await fisher_service.get_cnpj_files_status()

@app.post("/cnpj/download")
async def download_cnpj_files(filenames: List[str]):
    """Inicia download de arquivos CNPJ"""
    return await fisher_service.download_multiple_cnpj_files(filenames)

@app.post("/cnpj/download/{filename}")
async def download_single_cnpj_file(filename: str):
    """Download de um arquivo CNPJ específico"""
    return await fisher_service.download_cnpj_file(filename)

@app.delete("/cnpj/files/{filename}")
async def delete_cnpj_file(filename: str):
    """Deleta um arquivo CNPJ"""
    return await fisher_service.delete_cnpj_file(filename)

@app.get("/cnpj/downloads/{download_id}/progress")
async def get_download_progress(download_id: str):
    """Obtém progresso de um download específico"""
    return await fisher_service.get_download_progress(download_id)

@app.post("/cnpj/process/{filename}")
async def process_cnpj_file(filename: str):
    """Processa um arquivo CNPJ baixado"""
    try:
        # Buscar arquivo na nova estrutura de pastas
        cnpj_dir = fisher_service.data_dir / "cnpj"
        file_path = None
        
        if cnpj_dir.exists():
            for year_dir in cnpj_dir.iterdir():
                if year_dir.is_dir() and year_dir.name.isdigit():
                    for month_dir in year_dir.iterdir():
                        if month_dir.is_dir() and month_dir.name.isdigit():
                            potential_path = month_dir / filename
                            if potential_path.exists():
                                file_path = potential_path
                                break
                    if file_path:
                        break
        
        if not file_path or not file_path.exists():
            return {
                "status": "error",
                "message": f"Arquivo {filename} não encontrado na estrutura de pastas"
            }
        
        # Inicializar processador se necessário
        if not cnpj_processor.engine:
            await cnpj_processor.initialize_db()
        
        # Processar arquivo
        result = await cnpj_processor.process_cnpj_file(file_path)
        
        return result
        
    except Exception as e:
        logger.error(f"Erro ao processar arquivo {filename}: {e}")
        return {
            "status": "error",
            "filename": filename,
            "error": str(e)
        }

@app.post("/cnpj/process-all")
async def process_all_cnpj_files():
    """Processa todos os arquivos CNPJ baixados"""
    try:
        # Verificar arquivos baixados na nova estrutura
        cnpj_dir = fisher_service.data_dir / "cnpj"
        downloaded_files = []
        
        if cnpj_dir.exists():
            for year_dir in cnpj_dir.iterdir():
                if year_dir.is_dir() and year_dir.name.isdigit():
                    for month_dir in year_dir.iterdir():
                        if month_dir.is_dir() and month_dir.name.isdigit():
                            for file_path in month_dir.glob("*.zip"):
                                downloaded_files.append(file_path)
        
        if not downloaded_files:
            return {
                "status": "error",
                "message": "Nenhum arquivo CNPJ baixado encontrado na estrutura de pastas"
            }
        
        # Inicializar processador se necessário
        if not cnpj_processor.engine:
            await cnpj_processor.initialize_db()
        
        # Processar cada arquivo
        results = []
        for file_path in downloaded_files:
            result = await cnpj_processor.process_cnpj_file(file_path)
            results.append(result)
        
        return {
            "status": "completed",
            "total_files": len(downloaded_files),
            "successful": len([r for r in results if r["status"] == "success"]),
            "failed": len([r for r in results if r["status"] == "error"]),
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Erro ao processar arquivos CNPJ: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/cnpj/processing-status")
async def get_processing_status():
    """Obtém status do processamento dos arquivos CNPJ"""
    try:
        # Verificar arquivos baixados vs processados
        cnpj_dir = fisher_service.data_dir / "cnpj"
        downloaded_files = list(cnpj_dir.glob("*.zip"))
        
        # Verificar arquivos processados (baseado em logs ou metadados)
        processed_files = []
        for file_path in downloaded_files:
            # Verificar se existe diretório extraído
            extracted_dir = file_path.parent / f"extracted_{file_path.stem}"
            if extracted_dir.exists():
                processed_files.append(file_path.name)
        
        return {
            "status": "success",
            "downloaded_files": [f.name for f in downloaded_files],
            "processed_files": processed_files,
            "pending_files": [f.name for f in downloaded_files if f.name not in processed_files],
            "total_downloaded": len(downloaded_files),
            "total_processed": len(processed_files),
            "total_pending": len(downloaded_files) - len(processed_files)
        }
        
    except Exception as e:
        logger.error(f"Erro ao obter status de processamento: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.post("/cnpj/setup-database")
async def setup_cnpj_database():
    """Configura o banco de dados para os dados CNPJ"""
    try:
        # Ler schema SQL
        schema_file = Path(__file__).parent / "schema.sql"
        
        if not schema_file.exists():
            return {
                "status": "error",
                "message": "Arquivo schema.sql não encontrado"
            }
        
        # Inicializar processador
        await cnpj_processor.initialize_db()
        
        # Executar schema SQL
        async with cnpj_processor.session_factory() as session:
            with open(schema_file, 'r') as f:
                schema_sql = f.read()
            
            # Executar cada comando SQL separadamente
            commands = schema_sql.split(';')
            for command in commands:
                command = command.strip()
                if command:
                    await session.execute(text(command))
            
            await session.commit()
        
        return {
            "status": "success",
            "message": "Banco de dados configurado com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao configurar banco de dados: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/cnpj/files/refresh")
async def refresh_cnpj_files_list():
    """Atualiza lista de arquivos CNPJ da fonte oficial"""
    return await fisher_service.get_real_cnpj_files_list()

@app.get("/health")
async def health_check():
    """Health check da API"""
    return {"status": "healthy", "service": "fisher"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7724) 