# Canonika – Cadastro Canônico de Produtos

## 🌊 Visão Geral

Canonika é uma solução modular e inteligente para estruturar e enriquecer cadastros de produtos, a partir de fontes desestruturadas como XMLs de notas fiscais e buscas na web. Cada microserviço da solução representa um tripulante de uma embarcação, com responsabilidades bem definidas, utilizando IA, NLP, vector search e automações. Toda a solução será containerizada e padronizada para facilitar a escalabilidade e o reuso.

## 🛳 Tripulação e Módulos
- **Harbor**: SPA que concentra login, dashboard, gerenciamento de créditos e acesso aos demais serviços.
- **Skipper**: crawler inteligente com CrewAI + BrowserUse, navega na web em fontes confiáveis coletando dados para enriquecer cadastros.
- **Wayfinder**: microserviço com Milvus que opera como mecanismo de busca vetorial semântica (indexação, pesquisa e manutenção).
- **MapMaker**: interpreta estruturas CSV/JSON desestruturadas e mapeia para o schema canônico.
- **Quarter**: CRUD do cadastro canônico, detentor da versão final dos produtos estruturados.
- **Ledger**: sistema de créditos e billing, responsável por contabilizar e descontar tokens por requisição.
- **Seagull**: upload de XMLs (como notas fiscais), interpreta os dados e converte para a estrutura canônica de entidades.
- **Beacon**: interface de consumo do stack, que permite testar o enriquecimento de produtos em tempo real.
- **Dock**: serviço para simular chamadas e mostrar exemplos de uso da API com dados mock.
- **Guardian**: controle de autenticação, segurança, tokens e permissões.
- **Echo**: observabilidade e logging centralizado usando Elastic, Kibana, N8N e Evolution API.

## ⚙️ Stack Tecnológico

### Infraestrutura
- Docker + Docker Compose
- PostgreSQL
- Redis
- RabbitMQ
- Milvus
- N8N
- ElasticSearch + Kibana
- Evolution API
- Nginx (reverse proxy)

### Frontend
- Vue 3
- Bootstrap 5
- SPA
- Paleta sugerida:
  - Azul Profundo (#002E5D)
  - Verde Esmeralda (#00A896)
  - Cinza Grafite (#1A1A1A)
  - Branco Perolado (#F4F4F4)

### Backend
- Python 3.11+
- FastAPI
- JWT para autenticação
- CrewAI + BrowserUse (para Skipper)
- OpenTelemetry (observabilidade futura)

### IA
- Azure GPT (oficial)
- Versão Mini local para simulação

## 🌐 Padrão de Endpoints por Serviço

Cada microserviço terá um container com Nginx configurado:
- `/api`: API do serviço (FastAPI)
- `/web`: interface visual (Vue)

## 🔐 Regras de Infraestrutura
- Portas 7700 a 7720: stack de ferramentas (Postgres, Redis, RabbitMQ, N8N, Evolution, Elastic, Kibana)
- Portas 7721 a 7799: serviços Canonika (um por microserviço)
- Cada microserviço terá scripts auxiliares:
  - build.py, rebuild.py, start.py, stop.py, destroy.py, publish.py

## 🧪 Dados Mock
- Todos os serviços devem iniciar com dados mockados que simulem operações reais.
- O sistema deve ser funcional mesmo sem integrações externas durante o desenvolvimento.

## ✅ Primeiras Tarefas
1. Criar estrutura de pastas e containers para todos os serviços.
2. Implementar SPA base do Harbor com login funcional.
3. Criar containers com Nginx interno roteando para /api e /web em cada serviço.
4. Levantar infraestrutura no docker-compose.yml com Postgres, Redis, Milvus, RabbitMQ, Elastic, Kibana, Evolution, N8N.
5. Mockar chamadas de cada microserviço com rotas de exemplo e simulações básicas. 