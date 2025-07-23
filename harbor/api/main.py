from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="Harbor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Harbor - Portal Central Canonika",
        "version": "1.0.0",
        "timestamp": datetime.now()
    }

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "harbor",
        "timestamp": datetime.now()
    }

@app.get("/health")
async def health_simple():
    return {
        "status": "healthy",
        "service": "harbor",
        "timestamp": datetime.now()
    } 