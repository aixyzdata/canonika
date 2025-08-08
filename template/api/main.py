from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(
    title="template",
    description="Descrição do serviço template",
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

# Models
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

class ServiceData(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    active: bool = True

# Health Check
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="template",
        version="1.0.0"
    )

# API Routes
@app.get("/api/v1/data")
async def get_data():
    """Obter dados do serviço"""
    return {"message": "Dados do serviço template"}

@app.post("/api/v1/data")
async def create_data(data: ServiceData):
    """Criar novo dado"""
    return {"message": "Dado criado", "data": data}

@app.get("/api/v1/data/{item_id}")
async def get_data_by_id(item_id: int):
    """Obter dado por ID"""
    return {"message": f"Dado {item_id}", "id": item_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8015)
