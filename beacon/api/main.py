from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import time
from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List
from enum import Enum
import json

# Importar middleware de autenticação
from auth_middleware import require_auth, optional_auth

app = FastAPI(title="Beacon WebSocket Broker", description="Broker de mensagens em tempo real")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexões WebSocket ativas
active_connections: List[WebSocket] = []

@dataclass
class Event:
    id: str
    type: str
    data: Dict[str, Any]
    timestamp: float = None
    
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
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = time.time()

class MessageType(str, Enum):
    EVENT = "event"
    COMMAND = "command"
    RESPONSE = "response"
    HEARTBEAT = "heartbeat"

# Endpoints protegidos
@app.get("/api/status")
@require_auth
async def get_status(request: Request):
    """Endpoint protegido que requer autenticação"""
    user = request.state.user
    return {
        "status": "online",
        "service": "beacon",
        "user": user,
        "connections": len(active_connections)
    }

@app.get("/api/metrics")
@optional_auth
async def get_metrics(request: Request):
    """Endpoint que pode ser acessado com ou sem autenticação"""
    user = request.state.user
    return {
        "active_connections": len(active_connections),
        "messages_processed": 0,
        "uptime": time.time(),
        "user": user
    }

# Endpoints públicos
@app.get("/health")
async def health_check():
    """Health check público"""
    return {"status": "healthy", "service": "beacon"}

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {"message": "Beacon WebSocket Broker", "status": "online"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Processar mensagem
            response = {
                "type": "response",
                "id": message.get("id", "unknown"),
                "data": {"received": True},
                "timestamp": time.time()
            }
            
            await websocket.send_text(json.dumps(response))
            
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    except Exception as e:
        print(f"Erro no WebSocket: {e}")
        if websocket in active_connections:
            active_connections.remove(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3706)