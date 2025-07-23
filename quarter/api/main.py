from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import jwt
import bcrypt
import uuid
from datetime import datetime, timedelta
import json
from enum import Enum

# Configuração JWT
SECRET_KEY = "canonika-quartermaster-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Modelos Pydantic
class UserBase(BaseModel):
    email: EmailStr
    name: str
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RoleBase(BaseModel):
    name: str
    description: str
    is_active: bool = True

class Role(RoleBase):
    id: str
    created_at: datetime
    permissions: List[str] = []

class Permission(BaseModel):
    module: str
    menu: str
    action: str

class APITokenBase(BaseModel):
    name: str
    description: str
    scopes: List[str]
    rate_limit_per_day: int = 1000
    rate_limit_per_minute: int = 60
    expires_at: Optional[datetime] = None

class APIToken(APITokenBase):
    id: str
    user_id: str
    token_hash: str
    is_active: bool = True
    created_at: datetime
    last_used_at: Optional[datetime] = None

class CreditUsage(BaseModel):
    user_id: str
    module: str
    action: str
    credits_consumed: int
    timestamp: datetime

class AuditLog(BaseModel):
    user_id: str
    action: str
    module: str
    details: Dict[str, Any]
    ip_address: str
    timestamp: datetime

# Enums
class ModuleEnum(str, Enum):
    SKIPPER = "skipper"
    WAYFINDER = "wayfinder"
    MAPMAKER = "mapmaker"
    HARBOR = "harbor"
    QUARTERMASTER = "quartermaster"

class ActionEnum(str, Enum):
    VIEW = "view"
    CREATE = "create"
    EDIT = "edit"
    DELETE = "delete"
    EXPORT = "export"
    SIMULATE = "simulate"
    PUBLISH = "publish"

# Dados mockados
mock_users = {
    "admin": {
        "id": "admin-001",
        "email": "admin@canonika.io",
        "name": "Administrador",
        "password_hash": bcrypt.hashpw("Admin@123".encode(), bcrypt.gensalt()).decode(),
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "roles": ["admin"]
    },
    "supervisor": {
        "id": "supervisor-001",
        "email": "supervisor@canonika.io",
        "name": "Supervisor",
        "password_hash": bcrypt.hashpw("Super@123".encode(), bcrypt.gensalt()).decode(),
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "roles": ["analyst"]
    },
    "operator": {
        "id": "operator-001",
        "email": "operator@canonika.io",
        "name": "Operador",
        "password_hash": bcrypt.hashpw("Oper@123".encode(), bcrypt.gensalt()).decode(),
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "roles": ["operator"]
    }
}

mock_roles = {
    "admin": {
        "id": "role-admin",
        "name": "Administrador",
        "description": "Acesso total ao sistema",
        "is_active": True,
        "created_at": datetime.now(),
        "permissions": ["*"]
    },
    "analyst": {
        "id": "role-analyst",
        "name": "Analista",
        "description": "Acesso de leitura e análise",
        "is_active": True,
        "created_at": datetime.now(),
        "permissions": [
            "skipper:view", "wayfinder:view", "mapmaker:view",
            "skipper:export", "wayfinder:export", "mapmaker:export"
        ]
    },
    "operator": {
        "id": "role-operator",
        "name": "Operador",
        "description": "Acesso operacional limitado",
        "is_active": True,
        "created_at": datetime.now(),
        "permissions": [
            "skipper:view", "skipper:create", "skipper:edit",
            "wayfinder:view", "mapmaker:view"
        ]
    }
}

mock_api_tokens = {}
mock_audit_logs = []
mock_credit_usage = []

# Funções de autenticação
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def get_user_by_email(email: str):
    for user_id, user in mock_users.items():
        if user["email"] == email:
            return user
    return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    # Procurar usuário por ID em todos os mock_users
    for user_key, user in mock_users.items():
        if user["id"] == user_id:
            return user
    
    raise HTTPException(status_code=401, detail="Usuário não encontrado")

def check_permission(user: dict, module: str, action: str) -> bool:
    user_roles = user.get("roles", [])
    for role_name in user_roles:
        role = mock_roles.get(role_name)
        if role and role["is_active"]:
            permissions = role.get("permissions", [])
            if "*" in permissions or f"{module}:{action}" in permissions:
                return True
    return False

# FastAPI app
app = FastAPI(title="Quartermaster API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para auditoria
@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    response = await call_next(request)
    
    # Log de auditoria para ações importantes
    if request.url.path.startswith("/api/auth") or request.url.path.startswith("/api/users"):
        try:
            user_id = "system"
            if "authorization" in request.headers:
                token = request.headers["authorization"].replace("Bearer ", "")
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = payload.get("sub", "unknown")
            
            log_entry = {
                "user_id": user_id,
                "action": f"{request.method} {request.url.path}",
                "module": "quartermaster",
                "details": {"path": str(request.url.path), "method": request.method},
                "ip_address": request.client.host if request.client else "unknown",
                "timestamp": datetime.now()
            }
            mock_audit_logs.append(log_entry)
        except:
            pass
    
    return response

# Rotas de autenticação
@app.post("/api/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    user = get_user_by_email(user_credentials.email)
    if not user or not verify_password(user_credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    if not user["is_active"]:
        raise HTTPException(status_code=401, detail="Usuário inativo")
    
    access_token = create_access_token(data={"sub": user["id"]})
    refresh_token = create_refresh_token(data={"sub": user["id"]})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/api/auth/refresh", response_model=Token)
async def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token inválido")
        user_id = payload.get("sub")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = mock_users.get(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    
    access_token = create_access_token(data={"sub": user_id})
    new_refresh_token = create_refresh_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

# Rotas de usuários
@app.get("/api/users/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "is_active": current_user["is_active"],
        "roles": current_user.get("roles", []),
        "created_at": current_user["created_at"],
        "updated_at": current_user["updated_at"]
    }

@app.get("/api/users", response_model=List[User])
async def get_users(current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "quartermaster", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    return [
        User(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            is_active=user["is_active"],
            created_at=user["created_at"],
            updated_at=user["updated_at"]
        )
        for user in mock_users.values()
    ]

@app.post("/api/users", response_model=User)
async def create_user(user_data: UserCreate, current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "quartermaster", "create"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    # Verificar se email já existe
    if get_user_by_email(user_data.email):
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    user_id = f"user-{uuid.uuid4().hex[:8]}"
    password_hash = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt()).decode()
    
    new_user = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password_hash": password_hash,
        "is_active": user_data.is_active,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "roles": ["operator"]  # Role padrão
    }
    
    mock_users[user_id] = new_user
    
    return User(
        id=new_user["id"],
        email=new_user["email"],
        name=new_user["name"],
        is_active=new_user["is_active"],
        created_at=new_user["created_at"],
        updated_at=new_user["updated_at"]
    )

# Rotas de roles
@app.get("/api/roles", response_model=List[Role])
async def get_roles(current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "quartermaster", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    return [
        Role(
            id=role["id"],
            name=role["name"],
            description=role["description"],
            is_active=role["is_active"],
            created_at=role["created_at"],
            permissions=role["permissions"]
        )
        for role in mock_roles.values()
    ]

# Rotas de tokens de API
@app.get("/api/tokens", response_model=List[APIToken])
async def get_api_tokens(current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "quartermaster", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    user_tokens = [
        token for token in mock_api_tokens.values()
        if token["user_id"] == current_user["id"]
    ]
    
    return user_tokens

@app.post("/api/tokens", response_model=APIToken)
async def create_api_token(token_data: APITokenBase, current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "quartermaster", "create"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    token_id = f"token-{uuid.uuid4().hex[:8]}"
    token_value = f"qtm_{uuid.uuid4().hex}"
    token_hash = bcrypt.hashpw(token_value.encode(), bcrypt.gensalt()).decode()
    
    new_token = {
        "id": token_id,
        "user_id": current_user["id"],
        "name": token_data.name,
        "description": token_data.description,
        "scopes": token_data.scopes,
        "rate_limit_per_day": token_data.rate_limit_per_day,
        "rate_limit_per_minute": token_data.rate_limit_per_minute,
        "expires_at": token_data.expires_at,
        "token_hash": token_hash,
        "is_active": True,
        "created_at": datetime.now(),
        "last_used_at": None
    }
    
    mock_api_tokens[token_id] = new_token
    
    # Retornar o token real apenas uma vez
    new_token["token_value"] = token_value
    
    return APIToken(**new_token)

# Rotas de auditoria
@app.get("/api/audit-logs", response_model=List[AuditLog])
async def get_audit_logs(
    current_user: dict = Depends(get_current_user),
    limit: int = 100,
    offset: int = 0
):
    if not check_permission(current_user, "quartermaster", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    return mock_audit_logs[offset:offset + limit]

# Rotas de créditos
@app.get("/api/credits/usage")
async def get_credit_usage(current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "quartermaster", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    user_usage = [
        usage for usage in mock_credit_usage
        if usage["user_id"] == current_user["id"]
    ]
    
    return {
        "user_id": current_user["id"],
        "usage": user_usage,
        "total_consumed": sum(u["credits_consumed"] for u in user_usage)
    }

# Rota de health check
@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "quartermaster",
        "timestamp": datetime.now(),
        "users_count": len(mock_users),
        "roles_count": len(mock_roles),
        "tokens_count": len(mock_api_tokens)
    }

# Rota raiz
@app.get("/")
async def root():
    return {
        "message": "Quartermaster API - Sistema de Gestão de Usuários",
        "version": "1.0.0",
        "docs": "/docs"
    }