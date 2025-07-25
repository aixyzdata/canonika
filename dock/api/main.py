from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

app = FastAPI(title="Dock API", version="1.0.0", description="Sistema de Containers e Deploy")

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
        "service": "Dock",
        "version": "1.0.0",
        "description": "Sistema de Containers e Deploy",
        "status": "Em Desenvolvimento",
        "endpoints": {
            "health": "/health",
            "help": "/help",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "dock"}

@app.get("/help")
async def help():
    return {
        "service": "Dock",
        "description": "Sistema de Containers e Deploy",
        "purpose": "Gerenciamento de containers, orquestração e deployment de aplicações",
        "features": [
            "Gerenciamento de containers Docker",
            "Orquestração de serviços",
            "Deploy automatizado",
            "Monitoramento de aplicações",
            "Escalabilidade horizontal"
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
        <title>Dock API - Ajuda</title>
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
            <h1>🐳 Dock API</h1>
            <p><strong>Sistema de Containers e Deploy</strong></p>
            
            <div class="status">
                📋 <strong>Status:</strong> Em Desenvolvimento
            </div>
            
            <h2>🎯 Propósito</h2>
            <p>O Dock é responsável pelo gerenciamento de containers, orquestração de serviços e deployment automatizado no sistema Canonika.</p>
            
            <h2>✨ Funcionalidades Planejadas</h2>
            <div class="feature">🐳 Gerenciamento de containers Docker</div>
            <div class="feature">🎛️ Orquestração de serviços</div>
            <div class="feature">🚀 Deploy automatizado</div>
            <div class="feature">📊 Monitoramento de aplicações</div>
            <div class="feature">📈 Escalabilidade horizontal</div>
            
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