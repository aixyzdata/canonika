import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestQuarterAPI:
    """Testes TDD para a API do Quarter"""
    
    def test_root_endpoint(self):
        """Teste: GET / deve retornar informações do Quarter"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "Quarter"
        assert data["description"] == "Ponto de entrada centralizado do Canonika"
        assert data["status"] == "online"
        assert "timestamp" in data
    
    def test_health_endpoint(self):
        """Teste: GET /api/health deve retornar status healthy"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "Quarter"
        assert data["status"] == "healthy"
        assert data["version"] == "1.0.0"
        assert "timestamp" in data
    
    def test_services_endpoint(self):
        """Teste: GET /api/services deve retornar lista de serviços"""
        response = client.get("/api/services")
        assert response.status_code == 200
        data = response.json()
        assert "services" in data
        assert len(data["services"]) > 0
        
        # Verificar se Harbor está na lista
        harbor_service = next((s for s in data["services"] if s["name"] == "Harbor"), None)
        assert harbor_service is not None
        assert harbor_service["description"] == "Dashboard principal"
        assert harbor_service["port"] == 3701
        
        # Verificar se Guardian está na lista
        guardian_service = next((s for s in data["services"] if s["name"] == "Guardian"), None)
        assert guardian_service is not None
        assert guardian_service["description"] == "Sistema de segurança"
        assert guardian_service["port"] == 3705
        
        # Verificar se Keycloak está na lista
        keycloak_service = next((s for s in data["services"] if s["name"] == "Keycloak"), None)
        assert keycloak_service is not None
        assert keycloak_service["description"] == "Identity Provider"
        assert keycloak_service["port"] == 8080

class TestQuarterAPIIntegration:
    """Testes de integração para a API do Quarter"""
    
    def test_all_endpoints_accessible(self):
        """Teste: Todos os endpoints devem estar acessíveis"""
        endpoints = ["/", "/api/health", "/api/services"]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.status_code == 200, f"Endpoint {endpoint} falhou"
    
    def test_response_format_consistency(self):
        """Teste: Todos os endpoints devem retornar JSON válido"""
        endpoints = ["/", "/api/health", "/api/services"]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.headers["content-type"] == "application/json"
            data = response.json()
            assert isinstance(data, dict)
    
    def test_timestamp_format(self):
        """Teste: Timestamps devem estar no formato ISO"""
        endpoints = ["/", "/api/health"]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            data = response.json()
            timestamp = data["timestamp"]
            
            # Verificar se é uma string ISO válida
            import re
            iso_pattern = r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$'
            assert re.match(iso_pattern, timestamp), f"Timestamp inválido em {endpoint}"

class TestQuarterAPIErrorHandling:
    """Testes de tratamento de erros para a API do Quarter"""
    
    def test_404_for_unknown_endpoint(self):
        """Teste: Endpoints inexistentes devem retornar 404"""
        response = client.get("/api/unknown")
        assert response.status_code == 404
    
    def test_method_not_allowed(self):
        """Teste: Métodos HTTP não suportados devem retornar 405"""
        response = client.post("/")
        assert response.status_code == 405
        
        response = client.put("/api/health")
        assert response.status_code == 405
        
        response = client.delete("/api/services")
        assert response.status_code == 405

class TestQuarterAPIPerformance:
    """Testes de performance para a API do Quarter"""
    
    def test_response_time(self):
        """Teste: Resposta deve ser rápida (< 100ms)"""
        import time
        
        start_time = time.time()
        response = client.get("/")
        end_time = time.time()
        
        response_time = (end_time - start_time) * 1000  # em milissegundos
        assert response_time < 100, f"Resposta muito lenta: {response_time}ms"
        assert response.status_code == 200
    
    def test_multiple_requests(self):
        """Teste: Múltiplas requisições simultâneas devem funcionar"""
        import concurrent.futures
        
        def make_request():
            response = client.get("/api/health")
            return response.status_code
        
        # Fazer 10 requisições simultâneas
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            results = [future.result() for future in futures]
        
        # Todas as requisições devem retornar 200
        assert all(status == 200 for status in results)

if __name__ == "__main__":
    pytest.main([__file__]) 