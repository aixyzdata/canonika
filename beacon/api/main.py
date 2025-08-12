from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
import uvicorn
import time
import asyncio
import json
import logging
import random
from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List, Set, Callable
from enum import Enum
from collections import defaultdict
import redis.asyncio as redis
from contextlib import asynccontextmanager
import jwt
from datetime import datetime, timedelta
import gzip
import base64
import uuid

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurações
MAX_CONNECTIONS_PER_USER = 5
RATE_LIMIT_PER_MINUTE = 100
HEARTBEAT_INTERVAL = 30
COMPRESSION_THRESHOLD = 1024  # bytes

# Redis para pub/sub e cache
redis_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global redis_client
    redis_client = redis.from_url("redis://redis:6379", decode_responses=True)
    await redis_client.ping()
    logger.info("Redis connected")
    yield
    # Shutdown
    if redis_client:
        await redis_client.close()

app = FastAPI(
    title="Beacon WebSocket Broker", 
    description="Broker de mensagens em tempo real com progress tracking",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Estruturas de dados
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = defaultdict(list)
        self.topic_subscribers: Dict[str, Set[str]] = defaultdict(set)
        self.user_connections: Dict[str, Set[str]] = defaultdict(set)
        self.connection_metadata: Dict[str, Dict] = {}
        self.rate_limits: Dict[str, List[float]] = defaultdict(list)
        self.running_tasks: Dict[str, Dict] = {}  # task_id -> task_info
        
    async def connect(self, websocket: WebSocket, user_id: str, connection_id: str):
        await websocket.accept()
        self.active_connections[user_id].append(websocket)
        self.user_connections[user_id].add(connection_id)
        self.connection_metadata[connection_id] = {
            "user_id": user_id,
            "connected_at": time.time(),
            "last_heartbeat": time.time(),
            "topics": set(),
            "message_count": 0
        }
        logger.info(f"User {user_id} connected with ID {connection_id}")
        
    def disconnect(self, user_id: str, connection_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id] = [
                ws for ws in self.active_connections[user_id] 
                if not ws.client_state.DISCONNECTED
            ]
        if connection_id in self.user_connections.get(user_id, set()):
            self.user_connections[user_id].discard(connection_id)
        if connection_id in self.connection_metadata:
            # Remover de todos os tópicos
            topics = self.connection_metadata[connection_id].get("topics", set())
            for topic in topics:
                self.topic_subscribers[topic].discard(connection_id)
            del self.connection_metadata[connection_id]
        logger.info(f"User {user_id} disconnected from {connection_id}")
        
    async def subscribe_to_topic(self, connection_id: str, topic: str):
        if connection_id in self.connection_metadata:
            self.connection_metadata[connection_id]["topics"].add(topic)
            self.topic_subscribers[topic].add(connection_id)
            logger.info(f"Connection {connection_id} subscribed to topic {topic}")
            
    async def unsubscribe_from_topic(self, connection_id: str, topic: str):
        if connection_id in self.connection_metadata:
            self.connection_metadata[connection_id]["topics"].discard(topic)
            self.topic_subscribers[topic].discard(connection_id)
            logger.info(f"Connection {connection_id} unsubscribed from topic {topic}")
            
    async def broadcast_to_topic(self, topic: str, message: Dict[str, Any]):
        subscribers = self.topic_subscribers.get(topic, set())
        sent_count = 0
        
        for connection_id in subscribers:
            if connection_id in self.connection_metadata:
                user_id = self.connection_metadata[connection_id]["user_id"]
                for websocket in self.active_connections.get(user_id, []):
                    if not websocket.client_state.DISCONNECTED:
                        try:
                            await websocket.send_text(json.dumps(message))
                            sent_count += 1
                        except Exception as e:
                            logger.error(f"Error sending to {connection_id}: {e}")
                            
        logger.info(f"Broadcasted to {sent_count} subscribers of topic {topic}")
        return sent_count
        
    def check_rate_limit(self, user_id: str) -> bool:
        now = time.time()
        # Limpar timestamps antigos (mais de 1 minuto)
        self.rate_limits[user_id] = [
            ts for ts in self.rate_limits[user_id] 
            if now - ts < 60
        ]
        
        if len(self.rate_limits[user_id]) >= RATE_LIMIT_PER_MINUTE:
            return False
            
        self.rate_limits[user_id].append(now)
        return True

    async def start_task_progress(self, task_id: str, task_type: str, user_id: str, initial_data: Dict = None):
        """Iniciar tracking de progresso de uma tarefa"""
        self.running_tasks[task_id] = {
            "task_id": task_id,
            "task_type": task_type,
            "user_id": user_id,
            "status": "running",
            "progress": 0,
            "started_at": time.time(),
            "data": initial_data or {},
            "updates": []
        }
        
        # Notificar início da tarefa
        await self.broadcast_to_topic(f"tasks.{task_id}", {
            "type": "task_started",
            "task_id": task_id,
            "task_type": task_type,
            "status": "running",
            "progress": 0,
            "timestamp": time.time()
        })
        
        logger.info(f"Started tracking task {task_id} for user {user_id}")

    async def update_task_progress(self, task_id: str, progress: int, status: str = None, data: Dict = None):
        """Atualizar progresso de uma tarefa"""
        if task_id not in self.running_tasks:
            logger.warning(f"Task {task_id} not found")
            return
            
        task = self.running_tasks[task_id]
        task["progress"] = progress
        if status:
            task["status"] = status
        if data:
            task["data"].update(data)
            
        task["updates"].append({
            "timestamp": time.time(),
            "progress": progress,
            "status": task["status"],
            "data": data
        })
        
        # Notificar atualização
        await self.broadcast_to_topic(f"tasks.{task_id}", {
            "type": "task_progress",
            "task_id": task_id,
            "progress": progress,
            "status": task["status"],
            "data": data,
            "timestamp": time.time()
        })
        
        logger.info(f"Updated task {task_id} progress to {progress}%")

    async def complete_task(self, task_id: str, final_data: Dict = None):
        """Completar uma tarefa"""
        if task_id not in self.running_tasks:
            logger.warning(f"Task {task_id} not found")
            return
            
        task = self.running_tasks[task_id]
        task["status"] = "completed"
        task["progress"] = 100
        task["completed_at"] = time.time()
        if final_data:
            task["data"].update(final_data)
            
        # Notificar conclusão
        await self.broadcast_to_topic(f"tasks.{task_id}", {
            "type": "task_completed",
            "task_id": task_id,
            "status": "completed",
            "progress": 100,
            "data": final_data,
            "timestamp": time.time()
        })
        
        # Manter histórico por 1 hora
        await asyncio.sleep(3600)
        if task_id in self.running_tasks:
            del self.running_tasks[task_id]
            
        logger.info(f"Completed task {task_id}")

    async def fail_task(self, task_id: str, error: str, error_data: Dict = None):
        """Falhar uma tarefa"""
        if task_id not in self.running_tasks:
            logger.warning(f"Task {task_id} not found")
            return
            
        task = self.running_tasks[task_id]
        task["status"] = "failed"
        task["error"] = error
        task["failed_at"] = time.time()
        if error_data:
            task["data"].update(error_data)
            
        # Notificar falha
        await self.broadcast_to_topic(f"tasks.{task_id}", {
            "type": "task_failed",
            "task_id": task_id,
            "status": "failed",
            "error": error,
            "data": error_data,
            "timestamp": time.time()
        })
        
        logger.error(f"Task {task_id} failed: {error}")

manager = ConnectionManager()

class TaskManager:
    def __init__(self):
        self.running_tasks: Dict[str, Dict] = {}
    
    async def start_task(self, task_id: str, task_type: str, user_id: str, data: Dict = None):
        """Iniciar tracking de uma tarefa"""
        self.running_tasks[task_id] = {
            "task_id": task_id,
            "task_type": task_type,
            "user_id": user_id,
            "status": "running",
            "progress": 0,
            "started_at": time.time(),
            "data": data or {}
        }
        
        # Notificar início
        await manager.broadcast_to_topic(f"tasks.{task_id}", {
            "type": "task_started",
            "task_id": task_id,
            "task_type": task_type,
            "status": "running",
            "progress": 0,
            "timestamp": time.time()
        })
    
    async def update_progress(self, task_id: str, progress: int, status: str = None, data: Dict = None):
        """Atualizar progresso de uma tarefa"""
        if task_id not in self.running_tasks:
            return
            
        task = self.running_tasks[task_id]
        task["progress"] = progress
        if status:
            task["status"] = status
        if data:
            task["data"].update(data)
        
        # Notificar atualização
        await manager.broadcast_to_topic(f"tasks.{task_id}", {
            "type": "task_progress",
            "task_id": task_id,
            "progress": progress,
            "status": task["status"],
            "data": data,
            "timestamp": time.time()
        })
    
    async def complete_task(self, task_id: str, final_data: Dict = None):
        """Completar uma tarefa"""
        if task_id not in self.running_tasks:
            return
            
        task = self.running_tasks[task_id]
        task["status"] = "completed"
        task["progress"] = 100
        task["completed_at"] = time.time()
        if final_data:
            task["data"].update(final_data)
        
        # Notificar conclusão
        await manager.broadcast_to_topic(f"tasks.{task_id}", {
            "type": "task_completed",
            "task_id": task_id,
            "status": "completed",
            "progress": 100,
            "data": final_data,
            "timestamp": time.time()
        })

task_manager = TaskManager()

@dataclass
class Event:
    id: str
    type: str
    topic: str
    data: Dict[str, Any]
    source: str
    timestamp: float = None
    ttl: Optional[int] = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = time.time()

@dataclass
class Message:
    id: str
    type: str
    source: str
    topic: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    timestamp: float = None
    compression: bool = False
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = time.time()

class MessageType(str, Enum):
    EVENT = "event"
    COMMAND = "command"
    RESPONSE = "response"
    HEARTBEAT = "heartbeat"
    SUBSCRIBE = "subscribe"
    UNSUBSCRIBE = "unsubscribe"
    ERROR = "error"
    TASK_PROGRESS = "task_progress"

class CommandType(str, Enum):
    SUBSCRIBE = "subscribe"
    UNSUBSCRIBE = "unsubscribe"
    PUBLISH = "publish"
    GET_TOPICS = "get_topics"
    GET_SUBSCRIBERS = "get_subscribers"
    START_TASK = "start_task"
    GET_TASK_STATUS = "get_task_status"

# Autenticação
security = HTTPBearer()

async def get_current_user(request: Request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid token")
            
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Utilitários
def compress_data(data: str) -> str:
    """Comprime dados se exceder o threshold"""
    if len(data.encode()) > COMPRESSION_THRESHOLD:
        compressed = gzip.compress(data.encode())
        return base64.b64encode(compressed).decode()
    return data

def decompress_data(data: str) -> str:
    """Descomprime dados se necessário"""
    try:
        decoded = base64.b64decode(data)
        return gzip.decompress(decoded).decode()
    except:
        return data

# Endpoints protegidos
@app.get("/api/status")
async def get_status(request: Request, user: Dict = Depends(get_current_user)):
    """Endpoint protegido que requer autenticação"""
    return {
        "status": "online",
        "service": "beacon",
        "user": user,
        "connections": len(manager.active_connections.get(user.get("id", ""), [])),
        "topics": len(manager.topic_subscribers),
        "total_subscribers": sum(len(subscribers) for subscribers in manager.topic_subscribers.values()),
        "running_tasks": len(manager.running_tasks)
    }

@app.get("/api/metrics")
async def get_metrics(request: Request, user: Dict = Depends(get_current_user)):
    """Métricas detalhadas do sistema"""
    user_id = user.get("id", "")
    user_connections = len(manager.active_connections.get(user_id, []))
    
    return {
        "active_connections": sum(len(conns) for conns in manager.active_connections.values()),
        "user_connections": user_connections,
        "topics_count": len(manager.topic_subscribers),
        "total_subscribers": sum(len(subscribers) for subscribers in manager.topic_subscribers.values()),
        "user_topics": len(manager.connection_metadata.get(user_id, {}).get("topics", set())),
        "running_tasks": len(manager.running_tasks),
        "uptime": time.time(),
        "rate_limited": not manager.check_rate_limit(user_id)
    }

@app.get("/api/topics")
async def get_topics(request: Request, user: Dict = Depends(get_current_user)):
    """Lista todos os tópicos disponíveis"""
    return {
        "topics": list(manager.topic_subscribers.keys()),
        "user_topics": list(manager.connection_metadata.get(user.get("id", ""), {}).get("topics", set()))
    }

@app.get("/api/tasks")
async def get_tasks(request: Request, user: Dict = Depends(get_current_user)):
    """Lista tarefas do usuário"""
    user_id = user.get("id", "")
    user_tasks = {
        task_id: task for task_id, task in manager.running_tasks.items()
        if task["user_id"] == user_id
    }
    return {"tasks": user_tasks}

@app.post("/api/tasks/{task_type}")
async def start_task(
    task_type: str, 
    request: Request, 
    user: Dict = Depends(get_current_user),
    background_tasks: BackgroundTasks = None
):
    """Iniciar uma nova tarefa"""
    user_id = user.get("id", "")
    task_id = str(uuid.uuid4())
    
    data = await request.json() if request.headers.get("content-type") == "application/json" else {}
    
    await task_manager.start_task(task_id, task_type, user_id, data)
    
    # Simular tarefa em background
    if background_tasks:
        background_tasks.add_task(simulate_task, task_id, task_type, data)
    
    return {
        "task_id": task_id,
        "task_type": task_type,
        "status": "started"
    }

async def simulate_task(task_id: str, task_type: str, data: Dict):
    """Simular uma tarefa em background (exemplo: download)"""
    try:
        # Simular progresso de download
        for progress in range(0, 101, 10):
            await asyncio.sleep(1)
            
            if progress == 50:
                await task_manager.update_progress(task_id, progress, "processing", {
                    "message": "Downloading file...",
                    "bytes_downloaded": progress * 1024
                })
            else:
                await task_manager.update_progress(task_id, progress, "running", {
                    "bytes_downloaded": progress * 1024
                })
        
        # Completar tarefa
        await task_manager.complete_task(task_id, {
            "message": "Download completed successfully",
            "file_size": 102400,
            "download_url": f"/downloads/{task_id}.zip"
        })
        
    except Exception as e:
        logger.error(f"Task {task_id} failed: {e}")

# Endpoints públicos
@app.get("/health")
async def health_check():
    """Health check público"""
    return {
        "status": "healthy", 
        "service": "beacon",
        "timestamp": time.time(),
        "redis_connected": redis_client is not None,
        "running_tasks": len(manager.running_tasks)
    }

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "message": "Beacon WebSocket Broker", 
        "status": "online",
        "version": "2.0.0",
        "features": ["observable", "topics", "compression", "rate_limiting", "fallback", "task_progress"]
    }

# WebSocket principal com observable pattern
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Autenticação via query params ou headers
    token = websocket.query_params.get("token") or websocket.headers.get("authorization", "").replace("Bearer ", "")
    
    if not token:
        await websocket.close(code=4001, reason="Authentication required")
        return
        
    try:
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
        user_id = payload.get("id", "anonymous")
    except:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    # Rate limiting
    if not manager.check_rate_limit(user_id):
        await websocket.close(code=4002, reason="Rate limit exceeded")
        return
    
    # Limite de conexões por usuário
    if len(manager.active_connections.get(user_id, [])) >= MAX_CONNECTIONS_PER_USER:
        await websocket.close(code=4003, reason="Too many connections")
        return
    
    connection_id = f"{user_id}_{int(time.time() * 1000)}"
    await manager.connect(websocket, user_id, connection_id)
    
    # Enviar confirmação de conexão
    welcome_message = {
        "type": "connection",
        "id": connection_id,
        "data": {
            "user_id": user_id,
            "connection_id": connection_id,
            "features": ["observable", "topics", "compression", "heartbeat", "task_progress"],
            "rate_limit": RATE_LIMIT_PER_MINUTE,
            "heartbeat_interval": HEARTBEAT_INTERVAL
        },
        "timestamp": time.time()
    }
    await websocket.send_text(json.dumps(welcome_message))
    
    # Task para heartbeat
    heartbeat_task = asyncio.create_task(heartbeat_loop(websocket, connection_id))
    
    try:
        while True:
            data = await websocket.receive_text()
            
            # Rate limiting por mensagem
            if not manager.check_rate_limit(user_id):
                error_msg = {
                    "type": "error",
                    "id": "rate_limit",
                    "data": {"message": "Rate limit exceeded"},
                    "timestamp": time.time()
                }
                await websocket.send_text(json.dumps(error_msg))
                continue
            
            # Processar mensagem
            try:
                message = json.loads(data)
                response = await process_message(message, connection_id, user_id)
                
                # Comprimir se necessário
                response_str = json.dumps(response)
                if len(response_str.encode()) > COMPRESSION_THRESHOLD:
                    response["compression"] = True
                    response["data"] = compress_data(response_str)
                    response_str = json.dumps(response)
                
                await websocket.send_text(response_str)
                
            except json.JSONDecodeError:
                error_msg = {
                    "type": "error",
                    "id": "invalid_json",
                    "data": {"message": "Invalid JSON format"},
                    "timestamp": time.time()
                }
                await websocket.send_text(json.dumps(error_msg))
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {connection_id}")
    except Exception as e:
        logger.error(f"Error in WebSocket {connection_id}: {e}")
    finally:
        heartbeat_task.cancel()
        manager.disconnect(user_id, connection_id)

async def heartbeat_loop(websocket: WebSocket, connection_id: str):
    """Loop de heartbeat para manter conexão ativa"""
    while True:
        try:
            await asyncio.sleep(HEARTBEAT_INTERVAL)
            
            if connection_id in manager.connection_metadata:
                manager.connection_metadata[connection_id]["last_heartbeat"] = time.time()
                
            heartbeat_msg = {
                "type": "heartbeat",
                "id": connection_id,
                "data": {"timestamp": time.time()},
                "timestamp": time.time()
            }
            await websocket.send_text(json.dumps(heartbeat_msg))
            
        except Exception as e:
            logger.error(f"Heartbeat error for {connection_id}: {e}")
            break

async def process_message(message: Dict, connection_id: str, user_id: str) -> Dict:
    """Processa mensagens recebidas"""
    msg_type = message.get("type")
    msg_id = message.get("id", "unknown")
    
    try:
        if msg_type == MessageType.SUBSCRIBE:
            topic = message.get("topic")
            if topic:
                await manager.subscribe_to_topic(connection_id, topic)
                return {
                    "type": "response",
                    "id": msg_id,
                    "data": {"subscribed": True, "topic": topic},
                    "timestamp": time.time()
                }
                
        elif msg_type == MessageType.UNSUBSCRIBE:
            topic = message.get("topic")
            if topic:
                await manager.unsubscribe_from_topic(connection_id, topic)
                return {
                    "type": "response",
                    "id": msg_id,
                    "data": {"unsubscribed": True, "topic": topic},
                    "timestamp": time.time()
                }
                
        elif msg_type == MessageType.EVENT:
            topic = message.get("topic")
            if topic:
                # Broadcast para tópico
                sent_count = await manager.broadcast_to_topic(topic, message)
                return {
                    "type": "response",
                    "id": msg_id,
                    "data": {"published": True, "topic": topic, "subscribers": sent_count},
                    "timestamp": time.time()
                }
                
        elif msg_type == MessageType.COMMAND:
            command = message.get("command")
            if command == CommandType.GET_TOPICS:
                user_topics = manager.connection_metadata.get(connection_id, {}).get("topics", set())
                return {
                    "type": "response",
                    "id": msg_id,
                    "data": {
                        "topics": list(user_topics),
                        "all_topics": list(manager.topic_subscribers.keys())
                    },
                    "timestamp": time.time()
                }
            elif command == CommandType.GET_TASK_STATUS:
                task_id = message.get("task_id")
                if task_id in manager.running_tasks:
                    task = manager.running_tasks[task_id]
                    return {
                        "type": "response",
                        "id": msg_id,
                        "data": {"task": task},
                        "timestamp": time.time()
                    }
                else:
                    return {
                        "type": "error",
                        "id": msg_id,
                        "data": {"message": "Task not found"},
                        "timestamp": time.time()
                    }
                
        elif msg_type == MessageType.HEARTBEAT:
            return {
                "type": "response",
                "id": msg_id,
                "data": {"heartbeat": True},
                "timestamp": time.time()
            }
            
        # Resposta padrão
        return {
            "type": "response",
            "id": msg_id,
            "data": {"received": True, "processed": True},
            "timestamp": time.time()
        }
        
    except Exception as e:
        logger.error(f"Error processing message {msg_id}: {e}")
        return {
            "type": "error",
            "id": msg_id,
            "data": {"message": str(e)},
            "timestamp": time.time()
        }

# Fallback endpoint para HTTP long polling
@app.post("/api/events")
async def events_endpoint(request: Request, user: Dict = Depends(get_current_user)):
    """Endpoint de fallback para HTTP long polling"""
    data = await request.json()
    topic = data.get("topic")
    
    if not topic:
        raise HTTPException(status_code=400, detail="Topic required")
    
    # Simular broadcast via Redis
    if redis_client:
        await redis_client.publish(f"topic:{topic}", json.dumps(data))
    
    return {"status": "published", "topic": topic}

# =============================================================================
# TESTE ENDPOINTS
# =============================================================================

@app.post("/api/test/websocket")
async def test_websocket_endpoint(request: Request, user: Dict = Depends(get_current_user)):
    """Endpoint para iniciar teste de WebSocket"""
    data = await request.json()
    message_count = data.get("message_count", 10)
    test_type = data.get("test_type", "random")
    topic = data.get("topic", "test")
    delay_ms = data.get("delay_ms", 1000)
    
    # Gerar ID único para o teste
    test_id = f"test_{user['id']}_{int(time.time() * 1000)}"
    
    # Iniciar teste em background
    asyncio.create_task(run_websocket_test(test_id, message_count, test_type, topic, delay_ms, user['id']))
    
    return {
        "test_id": test_id,
        "status": "started",
        "message_count": message_count,
        "test_type": test_type,
        "topic": topic,
        "delay_ms": delay_ms
    }

@app.get("/api/test/status/{test_id}")
async def get_test_status(test_id: str, user: Dict = Depends(get_current_user)):
    """Endpoint para verificar status do teste"""
    if test_id in manager.running_tasks:
        task = manager.running_tasks[test_id]
        return {
            "test_id": test_id,
            "status": task.get("status", "running"),
            "progress": task.get("progress", 0),
            "sent_count": task.get("sent_count", 0),
            "total_count": task.get("total_count", 0),
            "start_time": task.get("start_time"),
            "errors": task.get("errors", [])
        }
    else:
        raise HTTPException(status_code=404, detail="Test not found")

@app.post("/api/test/stop/{test_id}")
async def stop_test(test_id: str, user: Dict = Depends(get_current_user)):
    """Endpoint para parar teste em execução"""
    if test_id in manager.running_tasks:
        manager.running_tasks[test_id]["status"] = "stopped"
        return {"test_id": test_id, "status": "stopped"}
    else:
        raise HTTPException(status_code=404, detail="Test not found")

async def run_websocket_test(test_id: str, message_count: int, test_type: str, topic: str, delay_ms: int, user_id: str):
    """Executar teste de WebSocket em background"""
    try:
        # Registrar teste
        manager.running_tasks[test_id] = {
            "status": "running",
            "progress": 0,
            "sent_count": 0,
            "total_count": message_count,
            "start_time": time.time(),
            "errors": [],
            "test_type": test_type,
            "topic": topic,
            "user_id": user_id
        }
        
        logger.info(f"Starting WebSocket test {test_id}: {message_count} messages, type={test_type}, topic={topic}")
        
        for i in range(message_count):
            # Verificar se teste foi parado
            if manager.running_tasks[test_id]["status"] == "stopped":
                break
                
            try:
                # Gerar mensagem baseada no tipo de teste
                message = generate_test_message(test_type, i + 1, message_count)
                
                # Enviar via WebSocket para conexões do usuário
                sent_count = 0
                if user_id in manager.active_connections:
                    for websocket in manager.active_connections[user_id]:
                        try:
                            await websocket.send_text(json.dumps(message))
                            sent_count += 1
                        except Exception as e:
                            logger.error(f"Error sending to WebSocket: {e}")
                            manager.running_tasks[test_id]["errors"].append({
                                "message": f"WebSocket send error: {str(e)}",
                                "timestamp": time.time()
                            })
                
                # Enviar via Redis para tópico se especificado
                if topic and redis_client:
                    try:
                        await redis_client.publish(f"topic:{topic}", json.dumps(message))
                        sent_count += 1
                    except Exception as e:
                        logger.error(f"Error publishing to Redis: {e}")
                        manager.running_tasks[test_id]["errors"].append({
                            "message": f"Redis publish error: {str(e)}",
                            "timestamp": time.time()
                        })
                
                # Atualizar progresso
                manager.running_tasks[test_id]["sent_count"] = i + 1
                manager.running_tasks[test_id]["progress"] = ((i + 1) / message_count) * 100
                
                # Aguardar delay
                await asyncio.sleep(delay_ms / 1000)
                
            except Exception as e:
                logger.error(f"Error in test iteration {i}: {e}")
                manager.running_tasks[test_id]["errors"].append({
                    "message": f"Test iteration error: {str(e)}",
                    "timestamp": time.time()
                })
        
        # Finalizar teste
        manager.running_tasks[test_id]["status"] = "completed"
        manager.running_tasks[test_id]["progress"] = 100
        
        logger.info(f"WebSocket test {test_id} completed: {manager.running_tasks[test_id]['sent_count']} messages sent")
        
    except Exception as e:
        logger.error(f"Error in WebSocket test {test_id}: {e}")
        if test_id in manager.running_tasks:
            manager.running_tasks[test_id]["status"] = "error"
            manager.running_tasks[test_id]["errors"].append({
                "message": f"Test execution error: {str(e)}",
                "timestamp": time.time()
            })

def generate_test_message(test_type: str, message_number: int, total_messages: int) -> Dict:
    """Gerar mensagem de teste baseada no tipo"""
    base_message = {
        "type": "test_message",
        "id": f"test_msg_{message_number}",
        "timestamp": time.time(),
        "message_number": message_number,
        "total_messages": total_messages,
        "progress": (message_number / total_messages) * 100
    }
    
    if test_type == "random":
        # Mensagens aleatórias
        messages = [
            "Teste de conectividade WebSocket",
            "Mensagem de teste aleatória",
            "Validando comunicação em tempo real",
            "Teste de performance da conexão",
            "Verificando estabilidade do WebSocket",
            "Mensagem de teste para validação",
            "Teste de throughput da conexão",
            "Validando latência da comunicação",
            "Teste de confiabilidade do WebSocket",
            "Mensagem de teste para monitoramento"
        ]
        base_message["data"] = {
            "text": random.choice(messages),
            "random_value": random.randint(1, 1000),
            "random_float": random.uniform(0, 1),
            "timestamp_iso": datetime.now().isoformat()
        }
        
    elif test_type == "sequential":
        # Mensagens sequenciais
        base_message["data"] = {
            "text": f"Mensagem sequencial #{message_number}",
            "sequence": message_number,
            "hex_value": hex(message_number),
            "binary_value": bin(message_number),
            "timestamp_iso": datetime.now().isoformat()
        }
        
    elif test_type == "json":
        # Mensagens JSON complexas
        base_message["data"] = {
            "user": {
                "id": message_number,
                "name": f"User_{message_number}",
                "email": f"user{message_number}@test.com"
            },
            "metrics": {
                "cpu": random.uniform(0, 100),
                "memory": random.uniform(0, 100),
                "network": random.uniform(0, 1000)
            },
            "status": "active" if message_number % 2 == 0 else "inactive",
            "tags": [f"tag_{i}" for i in range(1, random.randint(2, 6))],
            "timestamp_iso": datetime.now().isoformat()
        }
        
    elif test_type == "error_simulation":
        # Simular erros ocasionais
        if message_number % 5 == 0:  # A cada 5 mensagens
            base_message["type"] = "test_error"
            base_message["data"] = {
                "error": "Simulated error for testing",
                "error_code": random.randint(100, 599),
                "error_message": "This is a simulated error for testing purposes"
            }
        else:
            base_message["data"] = {
                "text": f"Mensagem normal #{message_number}",
                "status": "ok",
                "timestamp_iso": datetime.now().isoformat()
            }
    
    return base_message

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)