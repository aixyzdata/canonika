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
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import httpx
from urllib.parse import urljoin, urlparse
import re
from bs4 import BeautifulSoup
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
import time

from cnpj_processor import CNPJProcessor
from cnpj_scraper import CNPJScraper
from sqlalchemy import text

# Modelo para request de download
class DownloadRequest(BaseModel):
    force_replace: bool = False

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="Fisher API", description="API para download de dados CNPJ")

# CORS - comentado temporariamente para teste
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     allow_websockets=True,
# )

# WebSocket connections
active_connections: List[WebSocket] = []

# Gerenciador de conexões WebSocket
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket conectado. Total de conexões: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket desconectado. Total de conexões: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        logger.info(f"Broadcast: enviando para {len(self.active_connections)} conexões")
        for i, connection in enumerate(self.active_connections):
            try:
                logger.info(f"Enviando para conexão {i+1}/{len(self.active_connections)} (ID: {id(connection)})")
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Erro ao enviar mensagem: {e}")
                # Remover conexão problemática
                if connection in self.active_connections:
                    self.active_connections.remove(connection)

manager = ConnectionManager()

# Armazenar downloads ativos
active_downloads = {}

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
    
    async def download_cnpj_file(self, filename: str, month_year: str = None, force_replace: bool = False) -> Dict[str, Any]:
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
                    # Se um mês específico foi solicitado, verificar se corresponde
                    if month_year and file["month_year"] != month_year:
                        continue
                    file_info = file
                    break
            
            if not file_info:
                if month_year:
                    return {
                        "status": "error",
                        "filename": filename,
                        "error": f"Arquivo {filename} não encontrado no mês {month_year}"
                    }
                else:
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
            
            # Verificar se arquivo já existe
            if local_path.exists() and not force_replace:
                return {
                    "status": "error",
                    "filename": filename,
                    "error": f"Arquivo {filename} já existe. Use force_replace=true para substituir.",
                    "local_path": str(local_path),
                    "month_year": month_year
                }
            
            # Se force_replace=True e arquivo existe, remover primeiro
            if local_path.exists() and force_replace:
                local_path.unlink()
                logger.info(f"🗑️ Arquivo existente removido: {local_path}")
            
            # Inicializar progresso
            download_id = f"download_{filename}_{int(time.time() * 1000)}"
            active_downloads[download_id] = {
                "filename": filename,
                "status": "downloading",
                "progress": 0,
                "speed": "0 MB/s",
                "eta": "calculando...",
                "message": "Iniciando download...",
                "start_time": time.time(),
                "bytes_downloaded": 0,
                "total_size": 0,
                "month_year": month_year
            }
            
            # Notificar início via WebSocket
            await broadcast_download_progress(download_id, {
                "filename": filename,
                "status": "downloading",
                "progress": 0,
                "speed": "0 MB/s",
                "eta": "calculando...",
                "message": "Iniciando download...",
                "bytes_downloaded": 0,
                "total_size": 0,
                "month_year": month_year
            })
            
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
                            active_downloads[download_id]["bytes_downloaded"] += len(chunk)
                            progress = (active_downloads[download_id]["bytes_downloaded"] / total_size) * 100
                            
                            # Calcular velocidade
                            elapsed = time.time() - active_downloads[download_id]["start_time"]
                            if elapsed > 0:
                                speed_mbps = (active_downloads[download_id]["bytes_downloaded"] / elapsed) / (1024 * 1024)
                                speed = f"{speed_mbps:.1f} MB/s"
                                
                                # Calcular ETA
                                if speed_mbps > 0:
                                    remaining_bytes = total_size - active_downloads[download_id]["bytes_downloaded"]
                                    eta_seconds = remaining_bytes / (speed_mbps * 1024 * 1024)
                                    eta = format_time(eta_seconds)
                                else:
                                    eta = "calculando..."
                            else:
                                speed = "0 MB/s"
                                eta = "calculando..."
                            
                            # Atualizar progresso
                            active_downloads[download_id].update({
                                "progress": round(progress, 1),
                                "speed": speed,
                                "eta": eta,
                                "message": f"Baixando... {progress:.1f}%",
                                "total_size": total_size
                            })
                            
                            # Broadcast progresso via WebSocket
                            await broadcast_download_progress(download_id, {
                                "filename": filename,
                                "status": "downloading",
                                "progress": round(progress, 1),
                                "speed": speed,
                                "eta": eta,
                                "message": f"Baixando... {progress:.1f}%",
                                "bytes_downloaded": active_downloads[download_id]["bytes_downloaded"],
                                "total_size": total_size,
                                "month_year": month_year
                            })
                            
                            # Pequena pausa para não sobrecarregar
                            await asyncio.sleep(0.1)
                
                # Download concluído
                active_downloads[download_id].update({
                    "status": "completed",
                    "progress": 100,
                    "message": "Download concluído com sucesso!",
                    "local_path": str(local_path),
                    "month_year": month_year,
                    "directory": str(month_dir)
                })
                
                # Broadcast conclusão
                await broadcast_download_completed(download_id, {
                    "filename": filename,
                    "status": "completed",
                    "progress": 100,
                    "message": "Download concluído com sucesso!",
                    "local_path": str(local_path),
                    "month_year": month_year,
                    "directory": str(month_dir),
                    "total_size": total_size,
                    "bytes_downloaded": total_size
                })
                
                # Atualizar tabela de controle no banco de dados
                try:
                    if not cnpj_processor.engine:
                        await cnpj_processor.initialize_db()
                    
                    async with cnpj_processor.session_factory() as session:
                        # Verificar se já existe registro
                        result = await session.execute(text("""
                            SELECT id FROM cnpj_file_control 
                            WHERE folder = :folder AND filename = :filename
                        """), {
                            "folder": month_year,
                            "filename": filename
                        })
                        
                        existing_record = result.fetchone()
                        
                        if existing_record:
                            # Atualizar registro existente
                            await session.execute(text("""
                                UPDATE cnpj_file_control 
                                SET status = 'DOWNLOADED',
                                    download_date = NOW(),
                                    local_path = :local_path,
                                    file_size_bytes = :file_size_bytes,
                                    download_attempts = download_attempts + 1,
                                    last_error = NULL,
                                    updated_at = NOW()
                                WHERE folder = :folder AND filename = :filename
                            """), {
                                "folder": month_year,
                                "filename": filename,
                                "local_path": str(local_path),
                                "file_size_bytes": total_size
                            })
                        else:
                            # Inserir novo registro
                            await session.execute(text("""
                                INSERT INTO cnpj_file_control 
                                (folder, filename, file_url, file_size_bytes, last_modified, status, download_date, local_path, download_attempts, created_at, updated_at)
                                VALUES (:folder, :filename, :file_url, :file_size_bytes, NOW(), 'DOWNLOADED', NOW(), :local_path, 1, NOW(), NOW())
                            """), {
                                "folder": month_year,
                                "filename": filename,
                                "file_url": file_url,
                                "file_size_bytes": total_size,
                                "local_path": str(local_path)
                            })
                        
                        await session.commit()
                        logger.info(f"✅ Controle de download atualizado no banco: {filename}")
                        
                except Exception as db_error:
                    logger.error(f"❌ Erro ao atualizar controle no banco: {db_error}")
                    # Não falhar o download por erro no banco
                
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
            if download_id in active_downloads:
                active_downloads[download_id].update({
                    "status": "error",
                    "message": f"Erro: {str(e)}"
                })
                await broadcast_download_error(download_id, {
                    "filename": filename,
                    "status": "error",
                    "message": f"Erro: {str(e)}",
                    "month_year": month_year
                })
            
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
            # Criar uma cópia dos dados de progresso para serialização
            progress_data = self.download_progress[download_id].copy()
            
            # Converter datetime para string se existir
            if 'start_time' in progress_data and isinstance(progress_data['start_time'], datetime):
                progress_data['start_time'] = progress_data['start_time'].isoformat()
            
            message_data = {
                "type": "download_progress",
                "download_id": download_id,
                "data": progress_data
            }
            
            logger.info(f"📡 Broadcast progresso: {download_id} - {progress_data['progress']}%")
            logger.info(f"📡 Conexões ativas: {len(active_connections)}")
            
            for connection in active_connections:
                try:
                    await connection.send_text(json.dumps(message_data))
                    logger.info(f"✅ Progresso enviado para conexão")
                except Exception as e:
                    logger.error(f"❌ Erro ao enviar progresso: {e}")
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
                    
                    # Determinar a última pasta baixada
                    cnpj_dir = self.data_dir / "cnpj"
                    last_downloaded_month = None
                    downloaded_months = set()
                    
                    if cnpj_dir.exists():
                        for year_dir in cnpj_dir.iterdir():
                            if year_dir.is_dir() and year_dir.name.isdigit():
                                for month_dir in year_dir.iterdir():
                                    if month_dir.is_dir() and month_dir.name.isdigit():
                                        # Verificar se há arquivos baixados neste mês
                                        if any(month_dir.glob("*.zip")):
                                            month_year = f"{year_dir.name}-{month_dir.name:0>2}"
                                            downloaded_months.add(month_year)
                                            if last_downloaded_month is None or month_year > last_downloaded_month:
                                                last_downloaded_month = month_year
                    
                    # Mostrar todos os meses disponíveis (não filtrar os já baixados)
                    logger.info(f"📁 Meses já baixados: {sorted(downloaded_months)}")
                    logger.info(f"📁 Todos os meses disponíveis: {len(directory_links)}")
                    
                    # Buscar arquivos em cada diretório
                    all_files = []
                    for dir_name in directory_links[:12]:  # Máximo 12 meses
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
                    downloaded_files = []
                    if cnpj_dir.exists():
                        # Buscar arquivos na estrutura: data/cnpj/YYYY/MM/
                        for year_dir in cnpj_dir.iterdir():
                            if year_dir.is_dir() and year_dir.name.isdigit():
                                for month_dir in year_dir.iterdir():
                                    if month_dir.is_dir() and month_dir.name.isdigit():
                                        for file_path in month_dir.glob("*.zip"):
                                            downloaded_files.append(file_path.name)
                    
                    # Buscar status dos arquivos no banco de dados
                    file_status_from_db = {}
                    try:
                        if not cnpj_processor.engine:
                            await cnpj_processor.initialize_db()
                        
                        async with cnpj_processor.session_factory() as session:
                            result = await session.execute(text("""
                                SELECT folder, filename, status, download_date, import_date, local_path
                                FROM cnpj_file_control 
                                WHERE folder IN :folders
                            """), {
                                "folders": tuple(directory_links)
                            })
                            
                            for row in result.fetchall():
                                key = f"{row[0]}/{row[1]}"
                                file_status_from_db[key] = {
                                    'status': row[2],
                                    'download_date': row[3],
                                    'import_date': row[4],
                                    'local_path': row[5]
                                }
                    except Exception as db_error:
                        logger.warning(f"Erro ao buscar status no banco: {db_error}")
                        # Continuar sem dados do banco
                    
                    # Mapear status de cada arquivo
                    files_status = []
                    for file_info in all_files:
                        filename = file_info["filename"]
                        month_year = file_info["month_year"]
                        key = f"{month_year}/{filename}"
                        
                        # Verificar se arquivo está baixado na estrutura correta
                        year = month_year.split('-')[0]
                        month = month_year.split('-')[1]
                        expected_path = cnpj_dir / year / month / filename
                        is_downloaded = expected_path.exists()
                        
                        # Determinar status baseado no banco de dados
                        db_status = file_status_from_db.get(key, {})
                        status = "available"
                        
                        if db_status.get('status') == 'IMPORTED':
                            status = "processed"
                        elif db_status.get('status') == 'DOWNLOADED' or is_downloaded:
                            status = "downloaded"
                        elif db_status.get('status') == 'FAILED':
                            status = "failed"
                        
                        files_status.append({
                            "filename": filename,
                            "month_year": file_info["month_year"],
                            "size": file_info["size"],
                            "last_updated": file_info["last_updated"],
                            "status": status,
                            "local_path": str(expected_path) if is_downloaded else db_status.get('local_path'),
                            "url": file_info["url"],
                            "directory": file_info["directory"],
                            "year": year,
                            "month": month,
                            "download_date": db_status.get('download_date'),
                            "import_date": db_status.get('import_date')
                        })
                    
                    return {
                        "status": "success",
                        "total_available": len(all_files),
                        "downloaded": len(downloaded_files),
                        "missing": len(all_files) - len(downloaded_files),
                        "files": files_status,
                        "source_url": base_url,
                        "last_check": datetime.now().isoformat(),
                        "last_downloaded_month": last_downloaded_month,
                        "available_months": directory_links[:12]
                    }
                    
        except Exception as e:
            logger.error(f"Erro ao buscar lista real de arquivos CNPJ: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "message": "Falha ao conectar com fonte oficial"
            }

# Instância global do serviço
fisher_service = FisherService()

# Endpoint de teste simples
@app.get("/test")
async def test_endpoint():
    return {"message": "Teste funcionando!"}

# WebSocket endpoint simples para teste
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    logger.info("WebSocket: Tentativa de conexão recebida")
    await websocket.accept()
    logger.info("WebSocket: Conexão aceita")
    
    try:
        await websocket.send_text("Conectado!")
        logger.info("WebSocket: Mensagem enviada")
        
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
            
    except WebSocketDisconnect:
        logger.info("WebSocket: Cliente desconectou")

# Endpoint de saúde
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}

# Instância global do processador CNPJ
cnpj_processor = CNPJProcessor()

# Função para broadcast de progresso
async def broadcast_download_progress(download_id: str, progress_data: dict):
    """Envia progresso de download para todos os clientes conectados"""
    message = {
        "type": "download_progress",
        "download_id": download_id,
        **progress_data,
        "timestamp": time.time()
    }
    await manager.broadcast(json.dumps(message))

# Função para broadcast de conclusão
async def broadcast_download_completed(download_id: str, completion_data: dict):
    """Envia notificação de conclusão de download"""
    message = {
        "type": "download_completed",
        "download_id": download_id,
        **completion_data,
        "timestamp": time.time()
    }
    await manager.broadcast(json.dumps(message))

# Função para broadcast de erro
async def broadcast_download_error(download_id: str, error_data: dict):
    """Envia notificação de erro de download"""
    message = {
        "type": "download_error",
        "download_id": download_id,
        **error_data,
        "timestamp": time.time()
    }
    await manager.broadcast(json.dumps(message))

# Função para formatar tempo
def format_time(seconds):
    """Formata segundos em formato legível"""
    if seconds < 60:
        return f"{int(seconds)}s"
    elif seconds < 3600:
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        return f"{minutes}m {secs}s"
    else:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        return f"{hours}h {minutes}m"

# Endpoint para obter status dos downloads ativos
@app.get("/api/downloads/status")
async def get_downloads_status():
    """Retorna o status de todos os downloads ativos"""
    return {
        "active_downloads": len(active_downloads),
        "downloads": active_downloads
    }

# Endpoint para obter status de um download específico
@app.get("/api/downloads/status/{download_id}")
async def get_download_status(download_id: str):
    """Retorna o status de um download específico"""
    if download_id in active_downloads:
        return active_downloads[download_id]
    else:
        raise HTTPException(status_code=404, detail="Download não encontrado")

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
async def download_single_cnpj_file(filename: str, month_year: str = None, request: DownloadRequest = DownloadRequest()):
    """Download de um arquivo CNPJ específico"""
    return await fisher_service.download_cnpj_file(filename, month_year, request.force_replace)

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
    """Atualiza lista de arquivos CNPJ disponíveis"""
    return await fisher_service.get_real_cnpj_files_list()

@app.get("/cnpj/files/months")
async def get_available_months():
    """Obtém lista de meses/anos disponíveis para download"""
    try:
        files_list = await fisher_service.get_real_cnpj_files_list()
        
        if files_list["status"] != "success":
            return {
                "status": "error",
                "error": "Não foi possível obter a lista de arquivos"
            }
        
        # Extrair meses únicos dos arquivos disponíveis
        available_months = set()
        for file in files_list["files"]:
            if file["status"] == "available":
                available_months.add(file["month_year"])
        
        # Ordenar meses (mais recente primeiro)
        sorted_months = sorted(list(available_months), reverse=True)
        
        return {
            "status": "success",
            "months": sorted_months,
            "total_months": len(sorted_months)
        }
        
    except Exception as e:
        logger.error(f"Erro ao obter meses disponíveis: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/cnpj/search")
async def search_cnpj(q: str, limit: int = 10):
    """Busca CNPJs na base local"""
    try:
        # Inicializar processador se necessário
        if not cnpj_processor.engine:
            await cnpj_processor.initialize_db()
        
                    # Buscar na base de dados
            async with cnpj_processor.session_factory() as session:
                # Busca por CNPJ, razão social ou nome fantasia
                query = text("""
                    SELECT 
                        cnpj_base,
                        company_name,
                        trade_name,
                        state,
                        city,
                        activity_start_date,
                        main_fiscal_cnae
                    FROM cnpj_companies 
                    WHERE 
                        cnpj_base LIKE :search OR
                        company_name ILIKE :search OR
                        trade_name ILIKE :search
                    LIMIT :limit
                """)
            
            result = await session.execute(query, {
                "search": f"%{q}%",
                "limit": limit
            })
            
            rows = result.fetchall()
            
            # Format results
            results = []
            for row in rows:
                results.append({
                    "cnpj": row[0],
                    "company_name": row[1],
                    "trade_name": row[2],
                    "state": row[3],
                    "city": row[4],
                    "activity_start_date": row[5],
                    "main_fiscal_cnae": row[6]
                })
            
            return {
                "status": "success",
                "query": q,
                "total_results": len(results),
                "results": results
            }
            
    except Exception as e:
        logger.error(f"Erro na busca CNPJ: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/cnpj/stats")
async def get_cnpj_stats():
    """Obtém estatísticas da base local CNPJ"""
    try:
        # Inicializar processador se necessário
        if not cnpj_processor.engine:
            await cnpj_processor.initialize_db()
        
        async with cnpj_processor.session_factory() as session:
            # Count total companies
            total_companies = await session.execute(text("SELECT COUNT(*) FROM cnpj_companies"))
            total_companies = total_companies.scalar()
            
            # Count total establishments
            total_establishments = await session.execute(text("SELECT COUNT(*) FROM cnpj_establishments"))
            total_establishments = total_establishments.scalar()
            
            # Count total partners
            total_partners = await session.execute(text("SELECT COUNT(*) FROM cnpj_partners"))
            total_partners = total_partners.scalar()
            
            # Last update
            last_update = await session.execute(text("SELECT MAX(activity_start_date) FROM cnpj_establishments"))
            last_update = last_update.scalar()
            
            # Tamanho da base (estimativa)
            base_size = await session.execute(text("""
                SELECT pg_size_pretty(pg_database_size(current_database()))
            """))
            base_size = base_size.scalar()
            
            return {
                "status": "success",
                "stats": {
                    "total_companies": total_companies,
                    "total_establishments": total_establishments,
                    "total_partners": total_partners,
                    "last_update": str(last_update) if last_update else None,
                    "base_size": base_size
                }
            }
            
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas CNPJ: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/cnpj/sync/status")
async def get_sync_status():
    """Obtém status da sincronização CNPJ (dinâmico + local)"""
    try:
        # Buscar dados dinâmicos do site da Receita Federal
        async with CNPJScraper() as scraper:
            remote_hierarchy = await scraper.get_complete_hierarchy()
        
        # Buscar dados locais da tabela de controle
        if not cnpj_processor.engine:
            await cnpj_processor.initialize_db()
        
        async with cnpj_processor.session_factory() as session:
            result = await session.execute(text("""
                SELECT status, download_date
                FROM cnpj_file_control 
                WHERE status IN ('DOWNLOADED', 'IMPORTED')
                ORDER BY download_date DESC
                LIMIT 1
            """))
            
            last_download_row = result.fetchone()
            last_download = last_download_row[1].isoformat() if last_download_row and last_download_row[1] else None
        
        # Calcular estatísticas
        total_available = remote_hierarchy['total_files']
        total_downloaded = remote_hierarchy['total_files']  # Por enquanto, todos estão pendentes
        
        # Contar arquivos baixados localmente
        async with cnpj_processor.session_factory() as session:
            result = await session.execute(text("""
                SELECT COUNT(*) as downloaded_count
                FROM cnpj_file_control 
                WHERE status IN ('DOWNLOADED', 'IMPORTED')
            """))
            
            downloaded_count = result.fetchone()[0]
            total_pending = total_available - downloaded_count
        
        return {
            "status": "success",
            "sync_status": {
                "total_available": total_available,
                "total_downloaded": downloaded_count,
                "total_pending": total_pending,
                "sync_percentage": (downloaded_count / total_available * 100) if total_available > 0 else 0,
                "last_download": last_download,
                "last_check": remote_hierarchy['last_check']
            }
        }
        
    except Exception as e:
        logger.error(f"Erro ao obter status de sincronização: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/cnpj/files/hierarchy")
async def get_cnpj_files_hierarchy():
    """Retorna a hierarquia de arquivos CNPJ disponíveis (dinâmico + local)"""
    try:
        if not cnpj_processor.engine:
            await cnpj_processor.initialize_db()
        
        # Buscar dados dinâmicos do site da Receita Federal
        async with CNPJScraper() as scraper:
            remote_hierarchy = await scraper.get_complete_hierarchy()
        
        # Buscar dados locais da tabela de controle
        async with cnpj_processor.session_factory() as session:
            result = await session.execute(text("""
                SELECT folder, filename, file_url, file_size_bytes, 
                       last_modified, status, download_date, import_date,
                       download_attempts, import_attempts, last_error
                FROM cnpj_file_control 
                ORDER BY folder DESC, filename
            """))
            
            local_files = result.fetchall()
            
            # Criar dicionário de arquivos locais para cruzamento
            local_files_dict = {}
            for file in local_files:
                key = f"{file[0]}/{file[1]}"
                local_files_dict[key] = {
                    'status': file[5],
                    'download_date': file[6].isoformat() if file[6] else None,
                    'import_date': file[7].isoformat() if file[7] else None,
                    'local_size': file[3],
                    'download_attempts': file[8],
                    'import_attempts': file[9],
                    'last_error': file[10]
                }
        
        # Cruzar dados remotos com locais
        merged_folders = {}
        
        for file in remote_hierarchy['files']:
            folder = file['folder']
            filename = file['filename']
            key = f"{folder}/{filename}"
            
            if folder not in merged_folders:
                merged_folders[folder] = {
                    'folder': folder,
                    'files': [],
                    'total_files': 0,
                    'downloaded_files': 0,
                    'pending_files': 0,
                    'imported_files': 0,
                    'failed_files': 0
                }
            
            # Verificar se arquivo existe localmente
            local_info = local_files_dict.get(key, {})
            
            file_info = {
                'filename': filename,
                'file_url': file['file_url'],
                'file_size': file['file_size'],
                'last_modified': file['last_modified'],
                'status': local_info.get('status', 'PENDING'),
                'download_date': local_info.get('download_date'),
                'import_date': local_info.get('import_date'),
                'local_size': local_info.get('local_size'),
                'download_attempts': local_info.get('download_attempts', 0),
                'import_attempts': local_info.get('import_attempts', 0),
                'last_error': local_info.get('last_error')
            }
            
            merged_folders[folder]['files'].append(file_info)
            merged_folders[folder]['total_files'] += 1
            
            status = file_info['status']
            if status == 'DOWNLOADED':
                merged_folders[folder]['downloaded_files'] += 1
            elif status == 'PENDING':
                merged_folders[folder]['pending_files'] += 1
            elif status == 'IMPORTED':
                merged_folders[folder]['imported_files'] += 1
            elif status == 'FAILED':
                merged_folders[folder]['failed_files'] += 1
        
        # Converter para lista ordenada
        folders_list = list(merged_folders.values())
        folders_list.sort(key=lambda x: x["folder"], reverse=True)
        
        return {
            "status": "success",
            "folders": folders_list,
            "total_folders": len(folders_list),
            "total_files": sum(len(f['files']) for f in folders_list),
            "last_check": remote_hierarchy['last_check']
        }
            
    except Exception as e:
        logger.error(f"Erro ao buscar hierarquia de arquivos: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.post("/init-db")
async def initialize_database():
    """Inicializa o banco de dados com as tabelas necessárias"""
    try:
        # Inicializar processador se necessário
        if not cnpj_processor.engine:
            await cnpj_processor.initialize_db()
        
        # Executar schema SQL
        async with cnpj_processor.session_factory() as session:
            # Ler arquivo schema.sql
            schema_path = Path(__file__).parent / "schema.sql"
            logger.info(f"Lendo schema de: {schema_path}")
            
            with open(schema_path, 'r', encoding='utf-8') as f:
                schema_sql = f.read()
            
            logger.info(f"Schema SQL lido, tamanho: {len(schema_sql)} caracteres")
            
            # Executar comandos SQL
            commands_executed = 0
            
            # Processar linha por linha para separar comentários de comandos
            lines = schema_sql.split('\n')
            current_command = []
            
            for line in lines:
                line = line.strip()
                if not line or line.startswith('--'):
                    continue
                
                current_command.append(line)
                
                if line.endswith(';'):
                    # Comando completo encontrado
                    full_command = ' '.join(current_command)
                    if full_command and not full_command.startswith('--'):
                        logger.info(f"Executando comando: {full_command[:100]}...")
                        await session.execute(text(full_command))
                        commands_executed += 1
                    current_command = []
            
            logger.info(f"Total de comandos executados: {commands_executed}")
            await session.commit()
        
        return {
            "status": "success",
            "message": f"Banco de dados inicializado com sucesso. {commands_executed} comandos executados.",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Erro ao inicializar banco de dados: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.post("/load-test-data")
async def load_test_data():
    """Carrega dados de teste na tabela cnpj_file_control"""
    try:
        if not cnpj_processor.engine:
            await cnpj_processor.initialize_db()
        
        # Dados de teste hardcoded
        test_data = [
            # Arquivos PENDENTES
            ("2025-08", "CNPJ_2025_08.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-08/CNPJ_2025_08.zip", 1280000000, "2025-08-01 10:00:00", "PENDING", None, None, None, 0, 0, None),
            ("2025-07", "CNPJ_2025_07.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-07/CNPJ_2025_07.zip", 1250000000, "2025-07-01 10:00:00", "PENDING", None, None, None, 0, 0, None),
            ("2025-06", "CNPJ_2025_06.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-06/CNPJ_2025_06.zip", 1220000000, "2025-06-01 10:00:00", "PENDING", None, None, None, 0, 0, None),
            
            # Arquivos BAIXADOS
            ("2025-05", "CNPJ_2025_05.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-05/CNPJ_2025_05.zip", 1200000000, "2025-05-01 10:00:00", "DOWNLOADED", "2025-08-14 15:30:00", None, "/app/api/data/cnpj/2025-05/CNPJ_2025_05.zip", 1, 0, None),
            ("2025-04", "CNPJ_2025_04.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-04/CNPJ_2025_04.zip", 1180000000, "2025-04-01 10:00:00", "DOWNLOADED", "2025-08-14 14:45:00", None, "/app/api/data/cnpj/2025-04/CNPJ_2025_04.zip", 1, 0, None),
            ("2025-03", "CNPJ_2025_03.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-03/CNPJ_2025_03.zip", 1150000000, "2025-03-01 10:00:00", "DOWNLOADED", "2025-08-14 13:20:00", None, "/app/api/data/cnpj/2025-03/CNPJ_2025_03.zip", 1, 0, None),
            
            # Arquivos IMPORTADOS
            ("2025-02", "CNPJ_2025_02.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-02/CNPJ_2025_02.zip", 1120000000, "2025-02-01 10:00:00", "IMPORTED", "2025-08-14 12:15:00", "2025-08-14 12:45:00", "/app/api/data/cnpj/2025-02/CNPJ_2025_02.zip", 1, 1, None),
            ("2025-01", "CNPJ_2025_01.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-01/CNPJ_2025_01.zip", 1100000000, "2025-01-01 10:00:00", "IMPORTED", "2025-08-14 11:30:00", "2025-08-14 12:00:00", "/app/api/data/cnpj/2025-01/CNPJ_2025_01.zip", 1, 1, None),
            ("2024-12", "CNPJ_2024_12.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-12/CNPJ_2024_12.zip", 1080000000, "2024-12-01 10:00:00", "IMPORTED", "2025-08-14 10:45:00", "2025-08-14 11:15:00", "/app/api/data/cnpj/2024-12/CNPJ_2024_12.zip", 1, 1, None),
            
            # Arquivos com FALHA
            ("2024-11", "CNPJ_2024_11.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-11/CNPJ_2024_11.zip", 1050000000, "2024-11-01 10:00:00", "FAILED", None, None, None, 3, 0, "Connection timeout after 30 seconds"),
            ("2024-10", "CNPJ_2024_10.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-10/CNPJ_2024_10.zip", 1020000000, "2024-10-01 10:00:00", "FAILED", None, None, None, 2, 0, "HTTP 404 - File not found"),
            ("2024-09", "CNPJ_2024_09.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-09/CNPJ_2024_09.zip", 1000000000, "2024-09-01 10:00:00", "FAILED", "2025-08-14 09:30:00", None, "/app/api/data/cnpj/2024-09/CNPJ_2024_09.zip", 1, 2, "Invalid ZIP file format"),
            
            # Mais arquivos PENDENTES
            ("2024-08", "CNPJ_2024_08.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-08/CNPJ_2024_08.zip", 980000000, "2024-08-01 10:00:00", "PENDING", None, None, None, 0, 0, None),
            ("2024-07", "CNPJ_2024_07.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-07/CNPJ_2024_07.zip", 950000000, "2024-07-01 10:00:00", "PENDING", None, None, None, 0, 0, None),
            ("2024-06", "CNPJ_2024_06.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-06/CNPJ_2024_06.zip", 920000000, "2024-06-01 10:00:00", "PENDING", None, None, None, 0, 0, 0),
            
            # Arquivos mais antigos IMPORTADOS
            ("2024-05", "CNPJ_2024_05.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-05/CNPJ_2024_05.zip", 900000000, "2024-05-01 10:00:00", "IMPORTED", "2025-08-14 07:30:00", "2025-08-14 08:00:00", "/app/api/data/cnpj/2024-05/CNPJ_2024_05.zip", 1, 1, None),
            ("2024-04", "CNPJ_2024_04.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-04/CNPJ_2024_04.zip", 880000000, "2024-04-01 10:00:00", "IMPORTED", "2025-08-14 06:45:00", "2025-08-14 07:15:00", "/app/api/data/cnpj/2024-04/CNPJ_2024_04.zip", 1, 1, None),
            ("2024-03", "CNPJ_2024_03.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-03/CNPJ_2024_03.zip", 850000000, "2024-03-01 10:00:00", "IMPORTED", "2025-08-14 06:00:00", "2025-08-14 06:30:00", "/app/api/data/cnpj/2024-03/CNPJ_2024_03.zip", 1, 1, None),
            ("2024-02", "CNPJ_2024_02.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-02/CNPJ_2024_02.zip", 820000000, "2024-02-01 10:00:00", "IMPORTED", "2025-08-14 05:15:00", "2025-08-14 05:45:00", "/app/api/data/cnpj/2024-02/CNPJ_2024_02.zip", 1, 1, None),
            ("2024-01", "CNPJ_2024_01.zip", "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-01/CNPJ_2024_01.zip", 800000000, "2024-01-01 10:00:00", "IMPORTED", "2025-08-14 04:30:00", "2025-08-14 05:00:00", "/app/api/data/cnpj/2024-01/CNPJ_2024_01.zip", 1, 1, None),
        ]
        
        # Executar inserções
        async with cnpj_processor.session_factory() as session:
            for data in test_data:
                try:
                    await session.execute(text("""
                        INSERT INTO cnpj_file_control 
                        (folder, filename, file_url, file_size_bytes, last_modified, status, download_date, import_date, local_path, download_attempts, import_attempts, last_error)
                        VALUES (:folder, :filename, :file_url, :file_size_bytes, :last_modified, :status, :download_date, :import_date, :local_path, :download_attempts, :import_attempts, :last_error)
                    """), {
                        "folder": data[0],
                        "filename": data[1],
                        "file_url": data[2],
                        "file_size_bytes": data[3],
                        "last_modified": data[4],
                        "status": data[5],
                        "download_date": data[6],
                        "import_date": data[7],
                        "local_path": data[8],
                        "download_attempts": data[9],
                        "import_attempts": data[10],
                        "last_error": data[11]
                    })
                    logger.info(f"Dado inserido: {data[1]}")
                except Exception as e:
                    logger.warning(f"Erro ao inserir {data[1]}: {e}")
                    # Continuar com outros dados
            
            await session.commit()
        
        return {
            "status": "success",
            "message": f"Dados de teste carregados com sucesso! {len(test_data)} registros inseridos."
        }
        
    except Exception as e:
        logger.error(f"Erro ao carregar dados de teste: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 