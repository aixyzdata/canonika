import pytest
import json
import time
from unittest.mock import Mock, patch, AsyncMock
from fastapi.testclient import TestClient
from api.main import app, beacon_state, Event, Message, ClientInfo, MessageType, EventPriority

client = TestClient(app)

class TestBeaconBackend:
    """Testes unitários para o backend do Beacon"""
    
    def setup_method(self):
        """Setup para cada teste"""
        # Limpar estado global
        beacon_state.clients.clear()
        beacon_state.client_info.clear()
        beacon_state.topics.clear()
        beacon_state.message_queue.clear()
        beacon_state.event_history.clear()
        beacon_state.metrics = {
            "total_messages": 0,
            "total_events": 0,
            "active_clients": 0,
            "active_topics": 0,
            "queue_size": 0,
            "uptime": time.time()
        }
    
    def test_root_endpoint(self):
        """Teste do endpoint raiz"""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["service"] == "Beacon WebSocket Broker"
        assert data["version"] == "2.0.0"
        assert "metrics" in data
        assert "endpoints" in data
    
    def test_health_endpoint(self):
        """Teste do endpoint de health"""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "beacon"
        assert "uptime" in data
        assert "active_clients" in data
        assert "active_topics" in data
    
    def test_metrics_endpoint(self):
        """Teste do endpoint de métricas"""
        response = client.get("/metrics")
        assert response.status_code == 200
        
        data = response.json()
        assert "metrics" in data
        assert "system_info" in data
        assert data["system_info"]["total_clients"] == 0
        assert data["system_info"]["total_topics"] == 0
    
    def test_topics_endpoint(self):
        """Teste do endpoint de tópicos"""
        # Adicionar alguns tópicos de teste
        beacon_state.topics["test.topic"] = {"client1", "client2"}
        beacon_state.topics["another.topic"] = {"client1"}
        
        response = client.get("/topics")
        assert response.status_code == 200
        
        data = response.json()
        assert "topics" in data
        assert "test.topic" in data["topics"]
        assert "another.topic" in data["topics"]
        assert data["topics"]["test.topic"]["subscribers_count"] == 2
        assert data["topics"]["another.topic"]["subscribers_count"] == 1
    
    def test_clients_endpoint(self):
        """Teste do endpoint de clientes"""
        # Adicionar alguns clientes de teste
        beacon_state.client_info["client1"] = ClientInfo(
            id="client1",
            topics={"test.topic"},
            last_heartbeat=time.time(),
            connected_at=time.time() - 100,
            metadata={"user_agent": "test"}
        )
        
        response = client.get("/clients")
        assert response.status_code == 200
        
        data = response.json()
        assert "clients" in data
        assert len(data["clients"]) == 1
        assert data["clients"][0]["id"] == "client1"
        assert "test.topic" in data["clients"][0]["topics"]
    
    def test_events_endpoint_get(self):
        """Teste do endpoint GET de eventos"""
        # Adicionar alguns eventos de teste
        event1 = Event(
            id="event1",
            topic="test.topic",
            data={"message": "test1"},
            priority=EventPriority.MEDIUM,
            source="test",
            timestamp=time.time()
        )
        event2 = Event(
            id="event2",
            topic="test.topic",
            data={"message": "test2"},
            priority=EventPriority.HIGH,
            source="test",
            timestamp=time.time()
        )
        beacon_state.event_history = [event1, event2]
        
        response = client.get("/events")
        assert response.status_code == 200
        
        data = response.json()
        assert "events" in data
        assert len(data["events"]) == 2
        assert data["total_events"] == 2
    
    def test_events_endpoint_post(self):
        """Teste do endpoint POST de eventos"""
        event_data = {
            "topic": "test.topic",
            "data": {"message": "test event"},
            "priority": "high",
            "source": "test"
        }
        
        response = client.post("/events", json=event_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "success"
        assert "event_id" in data
        assert "event" in data
        assert data["event"]["topic"] == "test.topic"
        assert data["event"]["data"]["message"] == "test event"
    
    def test_events_endpoint_post_invalid_topic(self):
        """Teste do endpoint POST de eventos com tópico inválido"""
        event_data = {
            "data": {"message": "test event"},
            "priority": "high",
            "source": "test"
        }
        
        response = client.post("/events", json=event_data)
        assert response.status_code == 400
        assert "Topic é obrigatório" in response.json()["detail"]
    
    def test_help_endpoint(self):
        """Teste do endpoint de ajuda"""
        response = client.get("/help")
        assert response.status_code == 200
        
        data = response.json()
        assert data["service"] == "Beacon WebSocket Broker"
        assert "features" in data
        assert "websocket_commands" in data
        assert "status" in data
    
    @pytest.mark.asyncio
    async def test_connect_client(self):
        """Teste da função de conexão de cliente"""
        websocket = AsyncMock()
        client_id = "test_client"
        metadata = {"user_agent": "test"}
        
        await app.state.connect_client(websocket, client_id, metadata)
        
        assert client_id in beacon_state.clients
        assert client_id in beacon_state.client_info
        assert beacon_state.clients[client_id] == websocket
        assert beacon_state.client_info[client_id].id == client_id
        assert beacon_state.client_info[client_id].metadata == metadata
        assert beacon_state.metrics["active_clients"] == 1
    
    @pytest.mark.asyncio
    async def test_disconnect_client(self):
        """Teste da função de desconexão de cliente"""
        # Setup: conectar cliente
        websocket = AsyncMock()
        client_id = "test_client"
        beacon_state.clients[client_id] = websocket
        beacon_state.client_info[client_id] = ClientInfo(
            id=client_id,
            topics={"test.topic"},
            last_heartbeat=time.time(),
            connected_at=time.time(),
            metadata={}
        )
        beacon_state.topics["test.topic"] = {client_id}
        beacon_state.metrics["active_clients"] = 1
        beacon_state.metrics["active_topics"] = 1
        
        await app.state.disconnect_client(client_id)
        
        assert client_id not in beacon_state.clients
        assert client_id not in beacon_state.client_info
        assert "test.topic" not in beacon_state.topics
        assert beacon_state.metrics["active_clients"] == 0
        assert beacon_state.metrics["active_topics"] == 0
    
    @pytest.mark.asyncio
    async def test_subscribe_client(self):
        """Teste da função de subscrição de cliente"""
        client_id = "test_client"
        topic = "test.topic"
        
        # Setup: adicionar cliente
        beacon_state.client_info[client_id] = ClientInfo(
            id=client_id,
            topics=set(),
            last_heartbeat=time.time(),
            connected_at=time.time(),
            metadata={}
        )
        
        await app.state.subscribe_client(client_id, topic)
        
        assert topic in beacon_state.client_info[client_id].topics
        assert client_id in beacon_state.topics[topic]
        assert beacon_state.metrics["active_topics"] == 1
    
    @pytest.mark.asyncio
    async def test_unsubscribe_client(self):
        """Teste da função de cancelamento de subscrição"""
        client_id = "test_client"
        topic = "test.topic"
        
        # Setup: adicionar cliente e subscrição
        beacon_state.client_info[client_id] = ClientInfo(
            id=client_id,
            topics={topic},
            last_heartbeat=time.time(),
            connected_at=time.time(),
            metadata={}
        )
        beacon_state.topics[topic] = {client_id}
        beacon_state.metrics["active_topics"] = 1
        
        await app.state.unsubscribe_client(client_id, topic)
        
        assert topic not in beacon_state.client_info[client_id].topics
        assert client_id not in beacon_state.topics[topic]
        assert topic not in beacon_state.topics
        assert beacon_state.metrics["active_topics"] == 0
    
    @pytest.mark.asyncio
    async def test_send_message(self):
        """Teste da função de envio de mensagem"""
        websocket = AsyncMock()
        client_id = "test_client"
        message = Message(
            id="msg1",
            type=MessageType.EVENT,
            topic="test.topic",
            data={"test": True},
            timestamp=time.time(),
            source="test"
        )
        
        # Setup: adicionar cliente
        beacon_state.clients[client_id] = websocket
        
        await app.state.send_message(client_id, message)
        
        websocket.send_text.assert_called_once()
        sent_data = json.loads(websocket.send_text.call_args[0][0])
        assert sent_data["id"] == "msg1"
        assert sent_data["type"] == "event"
        assert beacon_state.metrics["total_messages"] == 1
    
    @pytest.mark.asyncio
    async def test_broadcast_to_topic(self):
        """Teste da função de broadcast para tópico"""
        websocket1 = AsyncMock()
        websocket2 = AsyncMock()
        message = Message(
            id="msg1",
            type=MessageType.EVENT,
            topic="test.topic",
            data={"test": True},
            timestamp=time.time(),
            source="test"
        )
        
        # Setup: adicionar clientes e tópico
        beacon_state.clients["client1"] = websocket1
        beacon_state.clients["client2"] = websocket2
        beacon_state.topics["test.topic"] = {"client1", "client2"}
        
        await app.state.broadcast_to_topic("test.topic", message)
        
        websocket1.send_text.assert_called_once()
        websocket2.send_text.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_broadcast_event(self):
        """Teste da função de broadcast de evento"""
        event = Event(
            id="event1",
            topic="test.topic",
            data={"message": "test"},
            priority=EventPriority.MEDIUM,
            source="test",
            timestamp=time.time()
        )
        
        # Setup: adicionar cliente e tópico
        websocket = AsyncMock()
        beacon_state.clients["client1"] = websocket
        beacon_state.topics["test.topic"] = {"client1"}
        
        await app.state.broadcast_event(event)
        
        websocket.send_text.assert_called_once()
        assert len(beacon_state.event_history) == 1
        assert beacon_state.event_history[0].id == "event1"
        assert beacon_state.metrics["total_events"] == 1
    
    @pytest.mark.asyncio
    async def test_process_message_subscribe(self):
        """Teste do processamento de mensagem de subscrição"""
        websocket = AsyncMock()
        client_id = "test_client"
        message_data = {
            "type": "subscribe",
            "topic": "test.topic"
        }
        
        # Setup: adicionar cliente
        beacon_state.clients[client_id] = websocket
        beacon_state.client_info[client_id] = ClientInfo(
            id=client_id,
            topics=set(),
            last_heartbeat=time.time(),
            connected_at=time.time(),
            metadata={}
        )
        
        await app.state.process_message(client_id, message_data)
        
        websocket.send_text.assert_called_once()
        sent_data = json.loads(websocket.send_text.call_args[0][0])
        assert sent_data["type"] == "response"
        assert sent_data["data"]["status"] == "subscribed"
        assert sent_data["data"]["topic"] == "test.topic"
    
    @pytest.mark.asyncio
    async def test_process_message_unsubscribe(self):
        """Teste do processamento de mensagem de cancelamento de subscrição"""
        websocket = AsyncMock()
        client_id = "test_client"
        message_data = {
            "type": "unsubscribe",
            "topic": "test.topic"
        }
        
        # Setup: adicionar cliente com subscrição
        beacon_state.clients[client_id] = websocket
        beacon_state.client_info[client_id] = ClientInfo(
            id=client_id,
            topics={"test.topic"},
            last_heartbeat=time.time(),
            connected_at=time.time(),
            metadata={}
        )
        beacon_state.topics["test.topic"] = {client_id}
        
        await app.state.process_message(client_id, message_data)
        
        websocket.send_text.assert_called_once()
        sent_data = json.loads(websocket.send_text.call_args[0][0])
        assert sent_data["type"] == "response"
        assert sent_data["data"]["status"] == "unsubscribed"
        assert sent_data["data"]["topic"] == "test.topic"
    
    @pytest.mark.asyncio
    async def test_process_message_heartbeat(self):
        """Teste do processamento de mensagem de heartbeat"""
        websocket = AsyncMock()
        client_id = "test_client"
        message_data = {
            "type": "heartbeat"
        }
        
        # Setup: adicionar cliente
        beacon_state.clients[client_id] = websocket
        beacon_state.client_info[client_id] = ClientInfo(
            id=client_id,
            topics=set(),
            last_heartbeat=time.time() - 100,
            connected_at=time.time(),
            metadata={}
        )
        
        await app.state.process_message(client_id, message_data)
        
        websocket.send_text.assert_called_once()
        sent_data = json.loads(websocket.send_text.call_args[0][0])
        assert sent_data["type"] == "heartbeat"
        assert "timestamp" in sent_data["data"]
    
    @pytest.mark.asyncio
    async def test_process_message_event(self):
        """Teste do processamento de mensagem de evento"""
        websocket = AsyncMock()
        client_id = "test_client"
        message_data = {
            "type": "event",
            "topic": "test.topic",
            "data": {"message": "test"},
            "priority": "high",
            "source": "test"
        }
        
        # Setup: adicionar cliente
        beacon_state.clients[client_id] = websocket
        
        await app.state.process_message(client_id, message_data)
        
        # Verificar se evento foi adicionado ao histórico
        assert len(beacon_state.event_history) == 1
        assert beacon_state.event_history[0].topic == "test.topic"
        assert beacon_state.event_history[0].priority == EventPriority.HIGH
    
    @pytest.mark.asyncio
    async def test_process_message_command_get_metrics(self):
        """Teste do processamento de comando get_metrics"""
        websocket = AsyncMock()
        client_id = "test_client"
        message_data = {
            "type": "command",
            "command": "get_metrics"
        }
        
        # Setup: adicionar cliente
        beacon_state.clients[client_id] = websocket
        
        await app.state.process_message(client_id, message_data)
        
        websocket.send_text.assert_called_once()
        sent_data = json.loads(websocket.send_text.call_args[0][0])
        assert sent_data["type"] == "response"
        assert "metrics" in sent_data["data"]
    
    @pytest.mark.asyncio
    async def test_process_message_command_get_topics(self):
        """Teste do processamento de comando get_topics"""
        websocket = AsyncMock()
        client_id = "test_client"
        message_data = {
            "type": "command",
            "command": "get_topics"
        }
        
        # Setup: adicionar cliente e tópicos
        beacon_state.clients[client_id] = websocket
        beacon_state.topics["test.topic"] = {client_id}
        
        await app.state.process_message(client_id, message_data)
        
        websocket.send_text.assert_called_once()
        sent_data = json.loads(websocket.send_text.call_args[0][0])
        assert sent_data["type"] == "response"
        assert "topics" in sent_data["data"]
        assert "test.topic" in sent_data["data"]["topics"]
    
    @pytest.mark.asyncio
    async def test_process_message_command_get_clients(self):
        """Teste do processamento de comando get_clients"""
        websocket = AsyncMock()
        client_id = "test_client"
        message_data = {
            "type": "command",
            "command": "get_clients"
        }
        
        # Setup: adicionar cliente
        beacon_state.clients[client_id] = websocket
        beacon_state.client_info[client_id] = ClientInfo(
            id=client_id,
            topics={"test.topic"},
            last_heartbeat=time.time(),
            connected_at=time.time(),
            metadata={"user_agent": "test"}
        )
        
        await app.state.process_message(client_id, message_data)
        
        websocket.send_text.assert_called_once()
        sent_data = json.loads(websocket.send_text.call_args[0][0])
        assert sent_data["type"] == "response"
        assert "clients" in sent_data["data"]
        assert len(sent_data["data"]["clients"]) == 1
        assert sent_data["data"]["clients"][0]["id"] == client_id
    
    def test_event_creation(self):
        """Teste da criação de eventos"""
        event = Event(
            id="event1",
            topic="test.topic",
            data={"message": "test"},
            priority=EventPriority.HIGH,
            source="test",
            timestamp=time.time()
        )
        
        assert event.id == "event1"
        assert event.topic == "test.topic"
        assert event.data["message"] == "test"
        assert event.priority == EventPriority.HIGH
        assert event.source == "test"
        assert event.ttl == 3600  # Valor padrão
    
    def test_message_creation(self):
        """Teste da criação de mensagens"""
        message = Message(
            id="msg1",
            type=MessageType.EVENT,
            topic="test.topic",
            data={"test": True},
            timestamp=time.time(),
            source="test"
        )
        
        assert message.id == "msg1"
        assert message.type == MessageType.EVENT
        assert message.topic == "test.topic"
        assert message.data["test"] is True
        assert message.source == "test"
    
    def test_client_info_creation(self):
        """Teste da criação de informações de cliente"""
        client_info = ClientInfo(
            id="client1",
            topics={"test.topic"},
            last_heartbeat=time.time(),
            connected_at=time.time() - 100,
            metadata={"user_agent": "test"}
        )
        
        assert client_info.id == "client1"
        assert "test.topic" in client_info.topics
        assert client_info.metadata["user_agent"] == "test"
    
    def test_enum_values(self):
        """Teste dos valores dos enums"""
        assert MessageType.EVENT.value == "event"
        assert MessageType.COMMAND.value == "command"
        assert MessageType.RESPONSE.value == "response"
        assert MessageType.HEARTBEAT.value == "heartbeat"
        
        assert EventPriority.LOW.value == "low"
        assert EventPriority.MEDIUM.value == "medium"
        assert EventPriority.HIGH.value == "high"
        assert EventPriority.CRITICAL.value == "critical"
    
    def test_metrics_tracking(self):
        """Teste do rastreamento de métricas"""
        # Simular algumas atividades
        beacon_state.metrics["total_messages"] = 10
        beacon_state.metrics["total_events"] = 5
        beacon_state.metrics["active_clients"] = 2
        beacon_state.metrics["active_topics"] = 3
        
        assert beacon_state.metrics["total_messages"] == 10
        assert beacon_state.metrics["total_events"] == 5
        assert beacon_state.metrics["active_clients"] == 2
        assert beacon_state.metrics["active_topics"] == 3
    
    def test_event_history_limitation(self):
        """Teste da limitação do histórico de eventos"""
        # Adicionar mais de 1000 eventos
        for i in range(1100):
            event = Event(
                id=f"event{i}",
                topic="test.topic",
                data={"index": i},
                priority=EventPriority.MEDIUM,
                source="test",
                timestamp=time.time()
            )
            beacon_state.event_history.append(event)
        
        # Verificar que apenas os últimos 1000 eventos permanecem
        assert len(beacon_state.event_history) == 1000
        assert beacon_state.event_history[0].id == "event100"
        assert beacon_state.event_history[-1].id == "event1099"

if __name__ == "__main__":
    pytest.main([__file__]) 