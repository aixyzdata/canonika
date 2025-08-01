from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime

app = FastAPI(
    title="Quarter - Canonika",
    description="Ponto de entrada centralizado do Canonika",
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

@app.get("/")
async def root():
    """Página inicial do Quarter"""
    return {
        "service": "Quarter",
        "description": "Ponto de entrada centralizado do Canonika",
        "status": "online",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health():
    """Health check do Quarter"""
    return {
        "service": "Quarter",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/services")
async def get_services():
    """Lista de serviços disponíveis"""
    return {
        "services": [
            {
                "name": "Harbor",
                "description": "Dashboard principal",
                "url": "http://localhost:3701",
                "port": 3701
            },
            {
                "name": "Guardian", 
                "description": "Sistema de segurança",
                "url": "http://localhost:3705",
                "port": 3705
            },
            {
                "name": "Keycloak",
                "description": "Identity Provider",
                "url": "http://localhost:8080/admin",
                "port": 8080
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)