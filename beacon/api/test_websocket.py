import asyncio
import websockets
import json

async def test_websocket():
    try:
        # Conectar ao WebSocket
        uri = "ws://localhost:8000/ws"
        print(f"Conectando a {uri}...")
        
        async with websockets.connect(uri) as websocket:
            print("Conectado! Aguardando mensagem...")
            
            # Receber mensagem de boas-vindas
            message = await websocket.recv()
            print(f"Mensagem recebida: {message}")
            
            # Enviar uma mensagem de teste
            test_message = "Olá, WebSocket!"
            await websocket.send(test_message)
            print(f"Mensagem enviada: {test_message}")
            
            # Receber resposta
            response = await websocket.recv()
            print(f"Resposta recebida: {response}")
            
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket()) 