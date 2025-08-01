import os
from typing import Optional

class CanonikaSettings:
    """Configurações centralizadas para Canonika"""
    
    # URLs dos microserviços
    QUARTER_URL: str = os.getenv('QUARTER_URL', 'http://quarter:80')
    HARBOR_URL: str = os.getenv('HARBOR_URL', 'http://harbor:3701')
    GUARDIAN_URL: str = os.getenv('GUARDIAN_URL', 'http://guardian:3705')
    SKIPPER_URL: str = os.getenv('SKIPPER_URL', 'http://skipper:3702')
    BEACON_URL: str = os.getenv('BEACON_URL', 'http://beacon:3703')
    FISHER_URL: str = os.getenv('FISHER_URL', 'http://fisher:3706')
    TOLLGATE_URL: str = os.getenv('TOLLGATE_URL', 'http://tollgate:3707')
    LEDGER_URL: str = os.getenv('LEDGER_URL', 'http://ledger:3708')
    
    # URLs da infraestrutura
    KEYCLOAK_URL: str = os.getenv('KEYCLOAK_URL', 'http://keycloak:8080')
    POSTGRES_URL: str = os.getenv('POSTGRES_URL', 'postgresql://canonika:canonika123@postgres:5432/canonika')
    REDIS_URL: str = os.getenv('REDIS_URL', 'redis://redis:6379')
    OPA_URL: str = os.getenv('OPA_URL', 'http://opa:8181')
    CLICKHOUSE_URL: str = os.getenv('CLICKHOUSE_URL', 'http://clickhouse:8123')
    
    # Configurações gerais
    DEV_MODE: bool = os.getenv('DEV_MODE', 'false').lower() == 'true'
    API_TIMEOUT: int = int(os.getenv('API_TIMEOUT', '30'))
    RETRY_ATTEMPTS: int = int(os.getenv('RETRY_ATTEMPTS', '3'))
    
    # Configurações de segurança
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'canonika-secret-key-change-in-production')
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '30'))
    
    # Configurações de logging
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT: str = os.getenv('LOG_FORMAT', '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    @classmethod
    def get_service_url(cls, service_name: str) -> Optional[str]:
        """Obter URL de um serviço"""
        service_urls = {
            'quarter': cls.QUARTER_URL,
            'harbor': cls.HARBOR_URL,
            'guardian': cls.GUARDIAN_URL,
            'skipper': cls.SKIPPER_URL,
            'beacon': cls.BEACON_URL,
            'fisher': cls.FISHER_URL,
            'tollgate': cls.TOLLGATE_URL,
            'ledger': cls.LEDGER_URL
        }
        return service_urls.get(service_name)
    
    @classmethod
    def get_infra_url(cls, infra_name: str) -> Optional[str]:
        """Obter URL de infraestrutura"""
        infra_urls = {
            'keycloak': cls.KEYCLOAK_URL,
            'postgres': cls.POSTGRES_URL,
            'redis': cls.REDIS_URL,
            'opa': cls.OPA_URL,
            'clickhouse': cls.CLICKHOUSE_URL
        }
        return infra_urls.get(infra_name)
    
    @classmethod
    def build_api_url(cls, service_name: str, endpoint: str) -> Optional[str]:
        """Construir URL de API"""
        base_url = cls.get_service_url(service_name)
        if not base_url:
            return None
        return f"{base_url}/api{endpoint}"
    
    @classmethod
    def build_health_url(cls, service_name: str) -> Optional[str]:
        """Construir URL de health check"""
        return cls.build_api_url(service_name, '/health')
    
    @classmethod
    def is_dev_mode(cls) -> bool:
        """Verificar se está em modo de desenvolvimento"""
        return cls.DEV_MODE

# Instância global das configurações
settings = CanonikaSettings() 