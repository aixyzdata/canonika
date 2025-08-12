"""
Middleware de Autenticação JWT
Para verificar tokens em requisições API
"""

import time
from functools import wraps
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
import json
import base64

class JWTAuthMiddleware:
    def __init__(self, secret_key="canonika_secret_key"):
        self.secret_key = secret_key
    
    def verify_token(self, token: str) -> dict:
        """
        Verifica e decodifica um token JWT
        """
        try:
            # Para simulação, vamos decodificar base64
            # Em produção, usar jwt.decode com a chave secreta
            payload = json.loads(base64.b64decode(token).decode('utf-8'))
            
            # Verificar expiração
            if 'exp' in payload and payload['exp'] < time.time():
                raise HTTPException(status_code=401, detail="Token expirado")
            
            return payload
        except Exception as e:
            raise HTTPException(status_code=401, detail="Token inválido")
    
    def get_token_from_request(self, request: Request) -> str:
        """
        Extrai token do header Authorization ou cookie
        """
        # Verificar header Authorization
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            return auth_header.split(' ')[1]
        
        # Verificar cookie
        token = request.cookies.get('canonika_token')
        if token:
            return token
        
        raise HTTPException(status_code=401, detail="Token não fornecido")
    
    def require_auth(self, func):
        """
        Decorator para proteger endpoints
        """
        @wraps(func)
        async def wrapper(*args, request: Request = None, **kwargs):
            try:
                token = self.get_token_from_request(request)
                payload = self.verify_token(token)
                
                # Adicionar dados do usuário ao request
                request.state.user = payload
                
                return await func(*args, request=request, **kwargs)
            except HTTPException:
                raise
            except Exception as e:
                raise HTTPException(status_code=401, detail="Erro de autenticação")
        
        return wrapper
    
    def optional_auth(self, func):
        """
        Decorator para endpoints que podem ser acessados com ou sem autenticação
        """
        @wraps(func)
        async def wrapper(*args, request: Request = None, **kwargs):
            try:
                token = self.get_token_from_request(request)
                payload = self.verify_token(token)
                request.state.user = payload
            except:
                request.state.user = None
            
            return await func(*args, request=request, **kwargs)
        
        return wrapper

# Instância global
auth_middleware = JWTAuthMiddleware()

# Decorators de conveniência
require_auth = auth_middleware.require_auth
optional_auth = auth_middleware.optional_auth 