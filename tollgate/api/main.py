from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any, Literal
import jwt
import bcrypt
import uuid
from datetime import datetime, timedelta
import json
from enum import Enum

# Configuração JWT
SECRET_KEY = "canonika-tollgate-secret-key-2024"
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

class CreditBalance(BaseModel):
    user_id: str
    total_credits: float
    standard_credits: float
    bonus_credits: float
    recurring_credits: float
    plan_name: Optional[str] = None
    next_renewal: Optional[datetime] = None

class CreditTransaction(BaseModel):
    id: str
    user_id: str
    transaction_type: Literal["consumption", "addition", "reversal", "renewal"]
    module: str
    credits_amount: float
    external_reference: Optional[str] = None
    reversible: bool = True
    timestamp: datetime
    description: str

class CreditPlan(BaseModel):
    id: str
    name: str
    monthly_credits: float
    price: float
    features: List[str]
    is_active: bool = True

class CreditAddition(BaseModel):
    user_id: str
    credit_type: Literal["standard", "bonus", "recurring"]
    amount: float
    source: str
    expires_at: Optional[datetime] = None
    description: str

class CreditAuthorization(BaseModel):
    user_id: str
    module: str
    operation_type: str
    estimated_consumption: float
    external_reference: Optional[str] = None

class CreditReversal(BaseModel):
    user_id: str
    transaction_id: str
    reason: str

class CreditAlert(BaseModel):
    id: str
    user_id: str
    alert_type: Literal["threshold", "zero"]
    percentage_value: float
    triggered_at: Optional[datetime] = None
    is_active: bool = True

class APIToken(BaseModel):
    id: str
    user_id: str
    token: str
    scopes: List[str]
    created_at: datetime
    expires_at: Optional[datetime] = None
    is_active: bool = True

# Enums
class ModuleEnum(str, Enum):
    SKIPPER = "skipper"
    WAYFINDER = "wayfinder"
    MAPMAKER = "mapmaker"
    HARBOR = "harbor"
    QUARTERMASTER = "quartermaster"
    TOLLGATE = "tollgate"

class TransactionTypeEnum(str, Enum):
    CONSUMPTION = "consumption"
    ADDITION = "addition"
    REVERSAL = "reversal"
    RENEWAL = "renewal"

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
    "user1": {
        "id": "user-001",
        "email": "user1@canonika.io",
        "name": "Usuário Teste",
        "password_hash": bcrypt.hashpw("User@123".encode(), bcrypt.gensalt()).decode(),
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "roles": ["user"]
    }
}

mock_credit_balances = {
    "admin-001": {
        "total_credits": 1000.0,
        "standard_credits": 500.0,
        "bonus_credits": 300.0,
        "recurring_credits": 200.0,
        "plan_name": "Premium",
        "next_renewal": datetime.now() + timedelta(days=15)
    },
    "user-001": {
        "total_credits": 250.0,
        "standard_credits": 100.0,
        "bonus_credits": 150.0,
        "recurring_credits": 0.0,
        "plan_name": "Basic",
        "next_renewal": datetime.now() + timedelta(days=5)
    }
}

mock_credit_transactions = [
    {
        "id": "tx-001",
        "user_id": "admin-001",
        "transaction_type": "consumption",
        "module": "skipper",
        "credits_amount": 10.0,
        "external_reference": "req-123",
        "reversible": True,
        "timestamp": datetime.now() - timedelta(hours=2),
        "description": "Consulta de dados"
    },
    {
        "id": "tx-002",
        "user_id": "admin-001",
        "transaction_type": "addition",
        "module": "tollgate",
        "credits_amount": 100.0,
        "external_reference": None,
        "reversible": False,
        "timestamp": datetime.now() - timedelta(days=1),
        "description": "Carga de créditos"
    },
    {
        "id": "tx-003",
        "user_id": "user-001",
        "transaction_type": "consumption",
        "module": "wayfinder",
        "credits_amount": 5.0,
        "external_reference": "req-456",
        "reversible": True,
        "timestamp": datetime.now() - timedelta(hours=1),
        "description": "Análise de rota"
    }
]

mock_credit_plans = {
    "plan-basic": {
        "id": "plan-basic",
        "name": "Plano Básico",
        "monthly_credits": 100.0,
        "price": 29.90,
        "features": ["100 créditos/mês", "Suporte por email", "APIs básicas"],
        "is_active": True
    },
    "plan-premium": {
        "id": "plan-premium",
        "name": "Plano Premium",
        "monthly_credits": 500.0,
        "price": 99.90,
        "features": ["500 créditos/mês", "Suporte prioritário", "Todas as APIs", "Relatórios avançados"],
        "is_active": True
    },
    "plan-enterprise": {
        "id": "plan-enterprise",
        "name": "Plano Enterprise",
        "monthly_credits": 2000.0,
        "price": 299.90,
        "features": ["2000 créditos/mês", "Suporte 24/7", "APIs exclusivas", "SLA garantido"],
        "is_active": True
    }
}

mock_credit_alerts = [
    {
        "id": "alert-001",
        "user_id": "user-001",
        "alert_type": "threshold",
        "percentage_value": 90.0,
        "triggered_at": datetime.now() - timedelta(hours=1),
        "is_active": True
    }
]

mock_api_tokens = {
    "token-001": {
        "id": "token-001",
        "user_id": "admin-001",
        "token": "tlg_" + uuid.uuid4().hex[:16],
        "scopes": ["credits:read", "credits:write", "transactions:read"],
        "created_at": datetime.now() - timedelta(days=5),
        "expires_at": datetime.now() + timedelta(days=25),
        "is_active": True
    }
}

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
    
    user = mock_users.get(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    
    return user

def check_permission(user: dict, module: str, action: str) -> bool:
    roles = user.get("roles", [])
    if "admin" in roles:
        return True
    
    # Permissões específicas por módulo
    permissions = {
        "tollgate": {
            "view": ["admin", "analyst"],
            "write": ["admin"],
            "admin": ["admin"]
        }
    }
    
    if module in permissions and action in permissions[module]:
        return any(role in permissions[module][action] for role in roles)
    
    return False

# FastAPI app
app = FastAPI(title="Tollgate API", version="1.0.0")

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
    if request.url.path.startswith("/api/credits") or request.url.path.startswith("/api/auth"):
        try:
            user_id = "system"
            if "authorization" in request.headers:
                token = request.headers["authorization"].replace("Bearer ", "")
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = payload.get("sub", "unknown")
            
            log_entry = {
                "user_id": user_id,
                "action": f"{request.method} {request.url.path}",
                "module": "tollgate",
                "details": {"path": str(request.url.path), "method": request.method},
                "ip_address": request.client.host if request.client else "unknown",
                "timestamp": datetime.now()
            }
            # Aqui você salvaria no banco de dados
            print(f"AUDIT LOG: {json.dumps(log_entry, default=str)}")
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

# Rotas de créditos
@app.get("/api/credits/balance/{user_id}", response_model=CreditBalance)
async def get_credit_balance(user_id: str, current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    balance = mock_credit_balances.get(user_id)
    if not balance:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return CreditBalance(user_id=user_id, **balance)

@app.post("/api/credits/authorize")
async def authorize_credit_consumption(auth_request: CreditAuthorization, current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "write"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    user_id = auth_request.user_id
    balance = mock_credit_balances.get(user_id)
    
    if not balance:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if balance["total_credits"] < auth_request.estimated_consumption:
        raise HTTPException(status_code=402, detail="Créditos insuficientes")
    
    # Simular dedução
    balance["total_credits"] -= auth_request.estimated_consumption
    balance["standard_credits"] -= auth_request.estimated_consumption
    
    # Registrar transação
    transaction_id = f"tx-{uuid.uuid4().hex[:8]}"
    transaction = {
        "id": transaction_id,
        "user_id": user_id,
        "transaction_type": "consumption",
        "module": auth_request.module,
        "credits_amount": auth_request.estimated_consumption,
        "external_reference": auth_request.external_reference,
        "reversible": True,
        "timestamp": datetime.now(),
        "description": f"Consumo autorizado - {auth_request.module}"
    }
    mock_credit_transactions.append(transaction)
    
    return {
        "authorized": True,
        "transaction_id": transaction_id,
        "remaining_credits": balance["total_credits"],
        "consumed_credits": auth_request.estimated_consumption
    }

@app.post("/api/credits/revert")
async def revert_credit_consumption(reversal: CreditReversal, current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "write"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    # Encontrar transação
    transaction = None
    for tx in mock_credit_transactions:
        if tx["id"] == reversal.transaction_id and tx["user_id"] == reversal.user_id:
            transaction = tx
            break
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    
    if not transaction["reversible"]:
        raise HTTPException(status_code=400, detail="Transação não é reversível")
    
    # Reverter créditos
    balance = mock_credit_balances.get(reversal.user_id)
    if balance:
        balance["total_credits"] += transaction["credits_amount"]
        balance["standard_credits"] += transaction["credits_amount"]
    
    # Registrar reversão
    reversal_transaction = {
        "id": f"rev-{uuid.uuid4().hex[:8]}",
        "user_id": reversal.user_id,
        "transaction_type": "reversal",
        "module": transaction["module"],
        "credits_amount": transaction["credits_amount"],
        "external_reference": transaction["external_reference"],
        "reversible": False,
        "timestamp": datetime.now(),
        "description": f"Reversão: {reversal.reason}"
    }
    mock_credit_transactions.append(reversal_transaction)
    
    return {
        "reverted": True,
        "reversal_id": reversal_transaction["id"],
        "refunded_credits": transaction["credits_amount"]
    }

@app.post("/api/credits/add")
async def add_credits(addition: CreditAddition, current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "admin"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    balance = mock_credit_balances.get(addition.user_id)
    if not balance:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Adicionar créditos
    balance["total_credits"] += addition.amount
    
    if addition.credit_type == "standard":
        balance["standard_credits"] += addition.amount
    elif addition.credit_type == "bonus":
        balance["bonus_credits"] += addition.amount
    elif addition.credit_type == "recurring":
        balance["recurring_credits"] += addition.amount
    
    # Registrar transação
    transaction_id = f"add-{uuid.uuid4().hex[:8]}"
    transaction = {
        "id": transaction_id,
        "user_id": addition.user_id,
        "transaction_type": "addition",
        "module": "tollgate",
        "credits_amount": addition.amount,
        "external_reference": None,
        "reversible": False,
        "timestamp": datetime.now(),
        "description": f"Adição de créditos: {addition.description}"
    }
    mock_credit_transactions.append(transaction)
    
    return {
        "added": True,
        "transaction_id": transaction_id,
        "new_balance": balance["total_credits"]
    }

@app.get("/api/credits/transactions/{user_id}", response_model=List[CreditTransaction])
async def get_credit_transactions(
    user_id: str,
    limit: int = 100,
    offset: int = 0,
    current_user: dict = Depends(get_current_user)
):
    if not check_permission(current_user, "tollgate", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    user_transactions = [
        tx for tx in mock_credit_transactions
        if tx["user_id"] == user_id
    ]
    
    return user_transactions[offset:offset + limit]

@app.get("/api/credits/plans", response_model=List[CreditPlan])
async def get_credit_plans(current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    return list(mock_credit_plans.values())

@app.get("/api/credits/alerts/{user_id}", response_model=List[CreditAlert])
async def get_credit_alerts(user_id: str, current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    user_alerts = [
        alert for alert in mock_credit_alerts
        if alert["user_id"] == user_id
    ]
    
    return user_alerts

@app.post("/api/credits/alerts")
async def create_credit_alert(alert: CreditAlert, current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "write"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    alert["id"] = f"alert-{uuid.uuid4().hex[:8]}"
    mock_credit_alerts.append(alert.dict())
    
    return {"created": True, "alert_id": alert["id"]}

# Rotas de tokens de API
@app.get("/api/tokens", response_model=List[APIToken])
async def get_api_tokens(current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "view"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    user_tokens = [
        token for token in mock_api_tokens.values()
        if token["user_id"] == current_user["id"]
    ]
    
    return user_tokens

@app.post("/api/tokens", response_model=APIToken)
async def create_api_token(scopes: List[str], current_user: dict = Depends(get_current_user)):
    if not check_permission(current_user, "tollgate", "write"):
        raise HTTPException(status_code=403, detail="Permissão negada")
    
    token_id = f"token-{uuid.uuid4().hex[:8]}"
    token_value = f"tlg_{uuid.uuid4().hex}"
    
    new_token = {
        "id": token_id,
        "user_id": current_user["id"],
        "token": token_value,
        "scopes": scopes,
        "created_at": datetime.now(),
        "expires_at": datetime.now() + timedelta(days=30),
        "is_active": True
    }
    
    mock_api_tokens[token_id] = new_token
    
    return APIToken(**new_token)

# Rota de health check
@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "tollgate",
        "timestamp": datetime.now(),
        "users_count": len(mock_users),
        "transactions_count": len(mock_credit_transactions),
        "plans_count": len(mock_credit_plans)
    }

# Rota raiz
@app.get("/")
async def root():
    return {
        "message": "Tollgate API - Sistema de Controle de Créditos",
        "version": "1.0.0",
        "docs": "/docs"
    } 