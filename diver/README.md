# 🤿 Diver - Tripulante de Consulta Canônica

> **Ponto de entrada principal dos usuários no ecossistema Canonika**

O **Diver** é o tripulante responsável por receber dados informados manualmente ou por upload, consultar a base canônica através do `Wayfinder`, enriquecer dados usando o `Skipper` quando necessário, e persistir novas versões canônicas garantindo que pesquisas futuras estejam otimizadas.

## 🎯 Objetivo Principal

O Diver atua como **interface principal de consulta** para usuários que precisam obter informações canônicas sobre produtos e empresas. Ele implementa a lógica de decisão inteligente que determina quando usar dados existentes vs. buscar novas informações.

## 🏗️ Arquitetura e Fluxo

### Diagrama de Fluxo
```
Usuário → Diver → Wayfinder (Consulta) → [Dados Encontrados?]
                                           ↓
                                    Sim → Retorna Dados
                                           ↓
                                    Não → Skipper (Busca Web)
                                           ↓
                                    → Normalização IA
                                           ↓
                                    → Persistência Wayfinder
                                           ↓
                                    → Retorna Dados Canônicos
```

### Integrações Principais

#### 🔍 **Wayfinder** (Primeira Consulta)
- **Responsabilidade**: Base de dados canônica
- **Interface**: `wayfinder.get_product(ean)`, `wayfinder.get_company(cnpj)`
- **Comportamento**: Consulta prioritária - sempre verifica primeiro
- **Retorno**: Dados estruturados e normalizados

#### 🌐 **Skipper** (Enriquecimento)
- **Responsabilidade**: Busca externa e web scraping
- **Interface**: `skipper.lookup_product(ean, description)`, `skipper.lookup_company(cnpj, razao_social)`
- **Comportamento**: Acionado apenas quando Wayfinder não retorna dados
- **Retorno**: Dados brutos que serão normalizados

## 📋 Funcionalidades Implementadas

### 1. Consulta Manual por Produto
- **Input**: EAN (código de barras) + descrição opcional
- **Processo**:
  1. Validação do EAN
  2. Consulta no Wayfinder
  3. Se não encontrado → aciona Skipper
  4. Normalização dos dados
  5. Persistência no Wayfinder
  6. Retorno da ficha técnica canônica

### 2. Upload de Nota Fiscal (NFe)
- **Input**: Arquivo XML da NFe
- **Processo**:
  1. Parse do XML da NFe
  2. Extração de emitente e produtos
  3. Consulta individual de cada item
  4. Processamento paralelo quando possível
  5. Retorno consolidado com emitente + produtos

### 3. Interface Web Moderna
- **Design**: Responsivo e acessível
- **Tabs**: Consulta Manual vs Upload NFe
- **Feedback**: Loading states, validações, mensagens de erro
- **Resultados**: Visualização estruturada dos dados

## 🛠️ Estrutura Técnica

### Backend (API)
```
diver/
├── api/
│   ├── main.py              # Servidor HTTP principal
│   ├── requirements.txt      # Dependências Python
│   └── README.md           # Documentação da API
```

### Frontend (Vue.js)
```
diver/
├── web/
│   ├── src/
│   │   └── views/
│   │       └── DiverView.vue  # Componente principal
│   ├── package.json
│   └── vite.config.js
```

### Integração Harbor
```
harbor/
├── web/
│   ├── views/
│   │   └── Diver/
│   │       └── DiverView.vue  # Versão integrada
│   └── routes.js              # Rota /diver
```

## 🔌 Endpoints da API

### Health Check
```http
GET /health
```
**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Consulta Manual
```http
POST /diver/consulta
Content-Type: application/json

{
  "ean": "7891234567890",
  "description": "Notebook Lenovo Ideapad 3 15"
}
```

**Resposta:**
```json
{
  "produto": {
    "ean": "7891234567890",
    "nome": "Notebook Lenovo Ideapad 3",
    "fabricante": "Lenovo",
    "ncm": "84713012",
    "dimensoes": {
      "largura_cm": 35.7,
      "altura_cm": 1.9,
      "profundidade_cm": 23.6
    },
    "peso_kg": 1.65,
    "categoria": "Informática > Notebook",
    "fonte": "wayfinder_cache"
  },
  "empresa": null
}
```

### Upload NFe
```http
POST /diver/upload
Content-Type: application/json

{
  "xml_content": "<xml>...</xml>"
}
```

**Resposta:**
```json
{
  "emitente": {
    "cnpj": "12345678000199",
    "razao_social": "LENOVO TECNOLOGIA BRASIL LTDA",
    "nome_fantasia": "Lenovo",
    "uf": "SP",
    "municipio": "Indaiatuba",
    "fonte": "wayfinder_cache"
  },
  "produtos": [
    {
      "ean": "7891234567890",
      "nome": "Notebook Lenovo Ideapad 3",
      "fabricante": "Lenovo",
      "categoria": "Informática > Notebook",
      "fonte": "wayfinder_cache"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🧠 Lógica de Decisão

### Algoritmo de Consulta
```python
async def consulta_produto(ean: str, description: str = "") -> Dict[str, Any]:
    # 1. Consultar Wayfinder primeiro
    produto = await wayfinder.get_product(ean)
    
    if produto:
        return {"produto": produto, "empresa": None}
    
    # 2. Se não encontrado, acionar Skipper
    produto = await skipper.lookup_product(ean, description)
    
    if produto:
        # 3. Salvar no Wayfinder
        await wayfinder.save_product(produto)
        return {"produto": produto, "empresa": None}
    
    return {"produto": None, "empresa": None, "error": "Produto não encontrado"}
```

### Processamento de NFe
```python
async def processar_nfe(xml_content: str) -> Dict[str, Any]:
    # 1. Parse XML
    dados_nfe = parse_xml_nfe(xml_content)
    
    # 2. Processar emitente
    if dados_nfe["emitente"]["cnpj"]:
        consulta_empresa = await consulta_empresa(
            dados_nfe["emitente"]["cnpj"],
            dados_nfe["emitente"]["razao_social"]
        )
    
    # 3. Processar produtos
    for produto_nfe in dados_nfe["produtos"]:
        if produto_nfe["ean"]:
            consulta_produto = await consulta_produto(
                produto_nfe["ean"],
                produto_nfe["descricao"]
            )
    
    return resultados
```

## 📊 Modelo de Dados Canônico

### Produto
```json
{
  "ean": "7891234567890",
  "nome": "Notebook Lenovo Ideapad 3",
  "fabricante": "Lenovo",
  "ncm": "84713012",
  "dimensoes": {
    "largura_cm": 35.7,
    "altura_cm": 1.9,
    "profundidade_cm": 23.6
  },
  "peso_kg": 1.65,
  "categoria": "Informática > Notebook",
  "fonte": "wayfinder_cache"
}
```

### Empresa
```json
{
  "cnpj": "12345678000199",
  "razao_social": "LENOVO TECNOLOGIA BRASIL LTDA",
  "nome_fantasia": "Lenovo",
  "uf": "SP",
  "municipio": "Indaiatuba",
  "fonte": "wayfinder_cache"
}
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- Docker (opcional)

### Backend
```bash
cd diver/api
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python3 main.py
```

### Frontend (Desenvolvimento)
```bash
cd diver/web
npm install
npm run dev
```

### Docker
```bash
cd diver
docker build -t canonika-diver .
docker run -p 7723:7723 canonika-diver
```

## 🧪 Testes

### Teste da API
```bash
# Health check
curl http://localhost:7723/health

# Consulta produto
curl -X POST http://localhost:7723/diver/consulta \
  -H "Content-Type: application/json" \
  -d '{"ean": "7891234567890", "description": "Notebook"}'

# Upload NFe (exemplo)
curl -X POST http://localhost:7723/diver/upload \
  -H "Content-Type: application/json" \
  -d '{"xml_content": "<xml>...</xml>"}'
```

### Teste da Interface
1. Acesse `http://localhost:7721/diver`
2. Teste consulta manual com EAN: `7891234567890`
3. Teste upload de NFe com arquivo XML válido

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# API Base URLs
WAYFINDER_API_URL=http://localhost:7724
SKIPPER_API_URL=http://localhost:7722

# Configurações de Log
LOG_LEVEL=INFO
LOG_FORMAT=json

# Configurações de Cache
CACHE_TTL=3600
CACHE_MAX_SIZE=1000
```

### Configuração de Desenvolvimento
```bash
# Desenvolvimento local
export ENVIRONMENT=development
export DEBUG=true

# Produção
export ENVIRONMENT=production
export DEBUG=false
```

## 📈 Monitoramento e Logs

### Logs Estruturados
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "service": "diver",
  "operation": "consulta_produto",
  "ean": "7891234567890",
  "source": "wayfinder_cache",
  "duration_ms": 150,
  "success": true
}
```

### Métricas Importantes
- **Taxa de Sucesso**: % de consultas que retornam dados
- **Tempo de Resposta**: Latência média das consultas
- **Cache Hit Rate**: % de dados encontrados no Wayfinder
- **Skipper Usage**: % de consultas que precisaram do Skipper

## 🔒 Segurança

### Validações
- **EAN**: Validação de formato e checksum
- **CNPJ**: Validação de formato e dígitos verificadores
- **XML**: Validação de schema da NFe
- **Input Sanitization**: Prevenção de XSS e injection

### Autenticação (Futuro)
- JWT tokens para APIs
- Rate limiting por usuário
- Auditoria de consultas

## 🚀 Roadmap

### Versão 1.1 (Próxima)
- [ ] Integração real com Wayfinder
- [ ] Integração real com Skipper
- [ ] Cache Redis para performance
- [ ] Validação avançada de EAN/CNPJ

### Versão 1.2
- [ ] Autenticação e autorização
- [ ] Rate limiting
- [ ] Métricas avançadas
- [ ] Webhooks para notificações

### Versão 2.0
- [ ] Suporte a múltiplos idiomas
- [ ] API GraphQL
- [ ] Streaming de resultados
- [ ] Machine Learning para normalização

## 🤝 Contribuição

### Padrões de Código
- **Python**: PEP 8, type hints, docstrings
- **Vue.js**: Vue 3 Composition API, TypeScript
- **Commits**: Conventional Commits
- **Tests**: Cobertura mínima de 80%

### Processo de Desenvolvimento
1. Fork do repositório
2. Criação de branch feature
3. Implementação com testes
4. Pull Request com descrição detalhada
5. Code review obrigatório
6. Merge após aprovação

## 📞 Suporte

### Canais de Comunicação
- **Issues**: GitHub Issues para bugs e features
- **Discussions**: GitHub Discussions para dúvidas
- **Documentação**: Este README e docs inline

### Contatos
- **Desenvolvedor Principal**: [Seu Nome]
- **Email**: [seu-email@canonika.com]
- **Slack**: #diver-dev

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**🤿 Diver** - Mergulhando na base canônica para trazer a melhor versão dos dados para você! 