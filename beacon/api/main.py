from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

app = FastAPI(title="Beacon API", version="1.0.0", description="Sistema de Sinalizadores e Alertas")

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
        "service": "Beacon",
        "version": "1.0.0",
        "description": "Sistema de Sinalizadores e Alertas",
        "status": "Em Desenvolvimento",
        "endpoints": {
            "health": "/health",
            "help": "/help",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "beacon"}

@app.get("/help")
async def help():
    return {
        "service": "Beacon",
        "description": "Sistema de Sinalizadores e Alertas",
        "purpose": "Gerenciamento de alertas, notificações e sinalizações do sistema",
        "features": [
            "Emissão de alertas em tempo real",
            "Configuração de sinalizadores",
            "Monitoramento de eventos críticos",
            "Dashboard de alertas ativos"
        ],
        "status": "Em Desenvolvimento",
        "contact": "dev@canonika.com"
    }

@app.get("/help/html", response_class=HTMLResponse)
async def help_html():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Beacon API - Ajuda</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            h1 { color: #2563eb; }
            h2 { color: #1e40af; margin-top: 30px; }
            .feature { background: #eff6ff; padding: 10px; margin: 5px 0; border-left: 4px solid #2563eb; }
            .status { background: #fef3c7; padding: 10px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚨 Beacon API</h1>
            <p><strong>Sistema de Sinalizadores e Alertas</strong></p>
            
            <div class="status">
                📋 <strong>Status:</strong> Em Desenvolvimento
            </div>
            
            <h2>🎯 Propósito</h2>
            <p>O Beacon é responsável pelo gerenciamento de alertas, notificações e sinalizações do sistema Canonika.</p>
            
            <h2>✨ Funcionalidades Planejadas</h2>
            <div class="feature">🔴 Emissão de alertas em tempo real</div>
            <div class="feature">⚙️ Configuração de sinalizadores</div>
            <div class="feature">📊 Monitoramento de eventos críticos</div>
            <div class="feature">📈 Dashboard de alertas ativos</div>
            
            <h2>🔗 Endpoints Disponíveis</h2>
            <ul>
                <li><strong>GET /</strong> - Informações gerais da API</li>
                <li><strong>GET /health</strong> - Status de saúde do serviço</li>
                <li><strong>GET /help</strong> - Ajuda em formato JSON</li>
                <li><strong>GET /help/html</strong> - Esta página de ajuda</li>
                <li><strong>GET /docs</strong> - Documentação interativa (Swagger)</li>
            </ul>
            
            <p><em>Contato: dev@canonika.com</em></p>
        </div>
    </body>
    </html>
    """