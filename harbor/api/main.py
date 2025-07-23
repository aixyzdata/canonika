from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from pydantic import BaseModel
from jose import jwt
import datetime

SECRET_KEY = "canonika_secret"
ALGORITHM = "HS256"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Harbor API está funcionando!"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "harbor"}

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(data: LoginRequest):
    # Mock simples: aceita qualquer usuário/senha
    if not data.username or not data.password:
        raise HTTPException(status_code=400, detail="Usuário e senha obrigatórios")
    token = jwt.encode({
        "sub": data.username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"} 