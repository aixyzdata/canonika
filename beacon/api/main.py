from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import time
import logging
import asyncio

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Beacon WebSocket API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Endpoint de saúde
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}

# WebSocket endpoint - SIMPLES E FUNCIONAL
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    
    # Enviar mensagem de boas-vindas
    welcome_message = {
        "type": "connection",
        "message": "WebSocket conectado com sucesso!",
        "timestamp": time.time(),
        "connections_count": len(manager.active_connections)
    }
    await websocket.send_text(json.dumps(welcome_message))
    
    try:
        while True:
            # Receber mensagem do cliente
            data = await websocket.receive_text()
            logger.info(f"Mensagem recebida: {data}")
            
            # Echo da mensagem (resposta simples)
            response = {
                "type": "echo",
                "original_message": data,
                "timestamp": time.time(),
                "connections_count": len(manager.active_connections)
            }
            await websocket.send_text(json.dumps(response))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket desconectado")

# Armazenar testes ativos e downloads
active_tests = {}
active_downloads = {}

# Endpoint para testar envio de mensagens
@app.post("/api/test/websocket")
async def start_websocket_test(request: Request):
    """Endpoint para testar envio de mensagens WebSocket"""
    try:
        # Obter dados da requisição
        body = await request.json()
        topic = body.get("topic", "test")  # Usar tópico do frontend ou "test" como padrão
        
        # Gerar ID único para o teste
        test_id = f"test_{int(time.time() * 1000)}"
        
        # Criar teste ativo
        active_tests[test_id] = {
            "id": test_id,
            "status": "running",
            "start_time": time.time(),
            "message_count": 0,
            "total_messages": 10,  # Padrão
            "topic": topic
        }
        
        # Enviar mensagens de teste
        for i in range(10):
            test_message = {
                "type": "test",
                "topic": topic,  # Usar tópico do frontend
                "test_id": test_id,
                "message": f"Mensagem de teste {i+1}/10",
                "timestamp": time.time(),
                "connections_count": len(manager.active_connections),
                "progress": (i + 1) * 10
            }
            
            logger.info(f"Enviando mensagem {i+1}/10 para {len(manager.active_connections)} conexões")
            logger.info(f"Tópico da mensagem: {topic}")
            logger.info(f"Conexões ativas: {[id(conn) for conn in manager.active_connections]}")
            await manager.broadcast(json.dumps(test_message))
            active_tests[test_id]["message_count"] = i + 1
            
            # Pequena pausa entre mensagens
            await asyncio.sleep(0.5)
        
        # Marcar teste como concluído
        active_tests[test_id]["status"] = "completed"
        active_tests[test_id]["end_time"] = time.time()
        
        return {
            "success": True,
            "test_id": test_id,
            "message": f"Teste iniciado com ID: {test_id}",
            "connections_count": len(manager.active_connections)
        }
        
    except Exception as e:
        logger.error(f"Erro no teste WebSocket: {e}")
        return {"success": False, "error": str(e)}

# Endpoint para obter status do teste
@app.get("/api/test/status/{test_id}")
async def get_test_status(test_id: str):
    """Endpoint para obter status de um teste"""
    if test_id in active_tests:
        test = active_tests[test_id]
        return {
            "test_id": test_id,
            "status": test["status"],
            "message_count": test["message_count"],
            "total_messages": test["total_messages"],
            "progress": (test["message_count"] / test["total_messages"]) * 100 if test["total_messages"] > 0 else 0
        }
    else:
        return {"error": "Teste não encontrado"}

# Endpoint para iniciar download com progresso
@app.post("/api/download/start")
async def start_download(request: Request):
    """Endpoint para iniciar um download com progresso real"""
    try:
        body = await request.json()
        filename = body.get("filename", "arquivo.zip")
        file_size = body.get("file_size", 100)  # MB
        download_speed = body.get("download_speed", 10)  # MB/s
        
        # Gerar ID único para o download
        download_id = f"download_{int(time.time() * 1000)}"
        
        # Calcular tempo total estimado
        total_time = file_size / download_speed  # segundos
        
        # Criar download ativo
        active_downloads[download_id] = {
            "id": download_id,
            "filename": filename,
            "file_size": file_size,
            "download_speed": download_speed,
            "status": "running",
            "start_time": time.time(),
            "total_time": total_time,
            "bytes_downloaded": 0,
            "progress": 0,
            "eta": total_time
        }
        
        # Iniciar task de download em background
        asyncio.create_task(simulate_download(download_id))
        
        return {
            "success": True,
            "download_id": download_id,
            "message": f"Download iniciado: {filename}",
            "file_size": file_size,
            "estimated_time": total_time
        }
        
    except Exception as e:
        logger.error(f"Erro ao iniciar download: {e}")
        return {"success": False, "error": str(e)}

async def simulate_download(download_id: str):
    """Simula um download real com progresso"""
    if download_id not in active_downloads:
        return
    
    download = active_downloads[download_id]
    file_size_mb = download["file_size"]
    download_speed_mbps = download["download_speed"]
    
    # Converter para bytes
    file_size_bytes = file_size_mb * 1024 * 1024
    bytes_per_second = download_speed_mbps * 1024 * 1024
    
    # Calcular intervalos de atualização (a cada 1% do progresso)
    update_interval = file_size_bytes / (100 * bytes_per_second)
    
    logger.info(f"Iniciando download {download_id}: {file_size_mb}MB a {download_speed_mbps}MB/s")
    
    bytes_downloaded = 0
    start_time = time.time()
    
    while bytes_downloaded < file_size_bytes and download["status"] == "running":
        # Simular download de um chunk
        chunk_size = min(bytes_per_second * update_interval, file_size_bytes - bytes_downloaded)
        bytes_downloaded += chunk_size
        
        # Calcular progresso
        progress = (bytes_downloaded / file_size_bytes) * 100
        elapsed_time = time.time() - start_time
        eta = (file_size_bytes - bytes_downloaded) / bytes_per_second
        
        # Atualizar download
        download["bytes_downloaded"] = bytes_downloaded
        download["progress"] = progress
        download["eta"] = eta
        
        # Enviar atualização via WebSocket
        download_message = {
            "type": "download_progress",
            "download_id": download_id,
            "filename": download["filename"],
            "progress": round(progress, 2),
            "bytes_downloaded": bytes_downloaded,
            "file_size_bytes": file_size_bytes,
            "download_speed_mbps": download_speed_mbps,
            "eta": round(eta, 2),
            "elapsed_time": round(elapsed_time, 2),
            "status": "downloading",
            "timestamp": time.time()
        }
        
        logger.info(f"Download {download_id}: {progress:.1f}% - {bytes_downloaded}/{file_size_bytes} bytes")
        await manager.broadcast(json.dumps(download_message))
        
        # Aguardar próximo intervalo
        await asyncio.sleep(update_interval)
    
    # Download concluído
    download["status"] = "completed"
    download["progress"] = 100
    download["eta"] = 0
    
    completion_message = {
        "type": "download_completed",
        "download_id": download_id,
        "filename": download["filename"],
        "progress": 100,
        "bytes_downloaded": file_size_bytes,
        "file_size_bytes": file_size_bytes,
        "total_time": round(time.time() - start_time, 2),
        "status": "completed",
        "timestamp": time.time()
    }
    
    logger.info(f"Download {download_id} concluído em {completion_message['total_time']}s")
    await manager.broadcast(json.dumps(completion_message))

# Endpoint para obter status do download
@app.get("/api/download/status/{download_id}")
async def get_download_status(download_id: str):
    """Endpoint para obter status de um download"""
    if download_id in active_downloads:
        download = active_downloads[download_id]
        return {
            "download_id": download_id,
            "filename": download["filename"],
            "status": download["status"],
            "progress": download["progress"],
            "bytes_downloaded": download["bytes_downloaded"],
            "file_size_bytes": download["file_size"] * 1024 * 1024,
            "eta": download["eta"],
            "download_speed_mbps": download["download_speed"]
        }
    else:
        return {"error": "Download não encontrado"}

# Endpoint para cancelar download
@app.post("/api/download/cancel/{download_id}")
async def cancel_download(download_id: str):
    """Endpoint para cancelar um download"""
    if download_id in active_downloads:
        active_downloads[download_id]["status"] = "cancelled"
        
        cancel_message = {
            "type": "download_cancelled",
            "download_id": download_id,
            "filename": active_downloads[download_id]["filename"],
            "status": "cancelled",
            "timestamp": time.time()
        }
        
        await manager.broadcast(json.dumps(cancel_message))
        return {"success": True, "message": "Download cancelado"}
    else:
        return {"error": "Download não encontrado"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)