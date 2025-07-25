# 📦 Canonika - Módulo Skipper

## 🎯 Objetivo

O **Skipper** é um microserviço orquestrador de navegação e extração de dados na web com comportamento semelhante a um especialista humano em cadastro de produtos. Utiliza agentes autônomos via CrewAI, integrando com BrowserUse, Selenium (fallback), e tecnologias auxiliares como Redis, PostgreSQL e Milvus.

O objetivo do Skipper é pesquisar produtos em fontes confiáveis, obter o conteúdo das páginas e extrair atributos estruturados com alta precisão.

## 🔗 Requisitos Técnicos

### Stack Tecnológica
- **Linguagem**: Python
- **Orquestração de Agentes**: Crew AI
- **Navegação**: BrowserUse (principal), Selenium (fallback)
- **Armazenamento**:
  - PostgreSQL: base principal
  - Redis: cache de sessões
  - Milvus: vetor semântico (não FAISS)
  - Elastic + Kibana: logs e observabilidade
- **Automação**: N8N
- **Frontend**: Vue 3 + Bootstrap (tema inspirado em inovação, tecnologia e oceano)

### Infraestrutura
- **Docker** com NGINX embarcado em cada módulo
- **Rotas**:
  - `/api` → backend (FastAPI)
  - `/web` → frontend (Vue + Bootstrap)
- **Range de portas**:
  - 7700–7720 → stack de ferramentas (Milvus, Redis, N8N, Elastic, Kibana)
  - 7721–7799 → microserviços da solução (Skipper: 7721)

### Scripts Padrão
Cada microserviço deve conter:
- `build.py`
- `rebuild.py`
- `destroy.py`
- `start.py`
- `stop.py`
- `publish.py`

## 🧠 Pipeline de Pesquisa (Agentes)

### 1. Agente de Busca (Link Search Agent)
- Simula digitação em barra de pesquisa (DuckDuckGo, Google, Amazon, etc.)
- Retorna N links mais relevantes
- Prompt customizável por fonte (salvo no banco)
- N é parametrizável por configuração da fonte

### 2. Agente de Navegação (Page Navigator Agent)
- Acessa os links obtidos na etapa anterior
- Simula comportamento humano, evita bloqueios por bots
- Extrai o HTML da página, converte para texto limpo (sem scripts, estilos, espaços extras)
- Prompt também customizável por fonte

### 3. Agente de Extração (Attribute Extractor Agent)
- Recebe o texto limpo
- Usa LLM para identificar e estruturar atributos do produto
  - Nome, Marca, Dimensões, Volume, Ingredientes, etc.
  - Atributos fixos e variáveis
- Prompt customizável por tipo de produto e por fonte

## ⚙️ Módulo Dinâmico de Fontes

### Estrutura de Cadastro de Fontes
Cada fonte cadastrada possui:
- **Nome**
- **Tipo**: Fabricante, Marketplace, Buscador
- **URL base**
- **Prompts separados por agente**:
  - Prompt de busca
  - Prompt de navegação
  - Prompt de extração
- **Tags de recomendação** (ex: "cerveja", "celular", etc.)
- **Ativo/Inativo**

### Auto Feedback e Auto Reparo
- Cada prompt executado deve registrar resultado (sucesso, falha, atributos extraídos)
- Caso falhe, o agente pode reescrever o prompt com base no histórico
- **Módulo de versionamento de prompt**:
  - Versão ativa
  - Histórico de versões
  - Score de sucesso
  - Atualização automática por performance
- Base de dados de prompts versionada

## 🖥️ Interface Web (Vue 3 + Bootstrap)

### Rota: `/web/simulation`
- Campo para digitar o nome do produto
- **Opções de pesquisa**:
  - [x] Selecionar automaticamente as melhores fontes
  - [ ] Selecionar manualmente as fontes (checkbox com fontes disponíveis)
- Botão "🔍 Pesquisar"
- **Painel lateral em tempo real** mostrando:
  - Fonte atual em execução
  - Etapa do pipeline (busca, navegação, extração)
  - Log das ações
- **Resultado final por fonte**:
  - Exibição amigável (cards, tabela)
  - Alternância para JSON puro
- **Resultado final consolidado**:
  - Produto final canônico com grau de confiança dos atributos

## 📊 Estrutura do Produto Consolidado

### Atributos Fixos
- nome, marca, peso, altura, largura, volume, descrição

### Atributos Variáveis
- preço, estoque, categoria, fabricante, tags

### Atributos Flexíveis
- estrutura key-value por tipo de produto

### Métricas
- Grau de confiança por atributo (score)
- Score global do produto

## 🧪 Testes

- Mock de dados realistas inicialmente
- Log de navegação e resultado para cada execução
- Simulador ativo no frontend

## 🖍️ Identidade Visual

### Paleta de Cores
- **Azul profundo**: #002F6C
- **Verde oceano**: #00BFA6
- **Branco**: #FFFFFF
- **Grafite tecnológico**: #1F1F1F

### Layout
- Layout unificado entre os módulos
- Header fixo com logo Canonika
- Sidebar esquerda (icones recolhidos, labels expandidos)
- Menu usuário no canto superior direito

## 📦 Estrutura de Deploy

### Contêineres
- skipper-api
- skipper-web
- postgres
- redis
- milvus
- n8n
- elasticsearch
- kibana

### Configuração
- Todos os serviços com porta entre 7700–7799
- Skipper com porta padrão 7721
- Projeto raiz com Docker Compose

## 🔒 Autenticação

- Integração com tela de login global (serviço: "Harbor")
- Usuário logado terá acesso completo às features
- Autenticação baseada em token + permissões

## ✅ Futuras Features

- Agentes especialistas por categoria de produto (vinhos, eletrônicos, etc.)
- Integração com Wayfinder (vector search)
- Integração com MapMaker (mapeamento para modelo canônico)
- Criação de workflows N8N para automatização de tarefas

## 🚀 Instruções de Desenvolvimento

### O que deve ser gerado pelo Cursor AI:

1. **Estrutura completa do Skipper**:
   - API (FastAPI)
   - Web (Vue 3 + Bootstrap)
   - Banco (PostgreSQL)
   - Config (Docker + NGINX)

2. **Endpoints**:
   - Simulação de pesquisa
   - Cadastro de fontes
   - Gerenciamento de prompts

3. **Interface**:
   - Tela de simulação com logs e visualizações
   - Dashboard de fontes
   - Configuração de prompts

4. **Base inicial**:
   - Prompts genéricos para teste
   - Configuração dockerizada pronta para rodar
   - Dados mock para desenvolvimento

5. **NGINX**:
   - Configurado para rotas `/web` e `/api`

## 📁 Estrutura de Arquivos

```
skipper/
├── api/
│   ├── main.py
│   ├── requirements.txt
│   ├── models/
│   ├── services/
│   └── agents/
├── web/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── Dockerfile
├── build.py
├── rebuild.py
├── destroy.py
├── start.py
├── stop.py
├── publish.py
└── README.md
```

## 🔧 Comandos de Desenvolvimento

```bash
# Iniciar desenvolvimento
./start.py

# Construir imagem
./build.py

# Parar serviços
./stop.py

# Reconstruir
./rebuild.py

# Publicar
./publish.py

# Destruir ambiente
./destroy.py
```

## 📋 Checklist de Implementação

- [ ] Estrutura base do projeto
- [ ] Configuração Docker
- [ ] API FastAPI com endpoints básicos
- [ ] Frontend Vue 3 com Bootstrap
- [ ] Integração CrewAI
- [ ] Agentes de busca, navegação e extração
- [ ] Sistema de fontes dinâmicas
- [ ] Interface de simulação
- [ ] Sistema de logs e observabilidade
- [ ] Autenticação integrada
- [ ] Testes com dados mock
- [ ] Documentação completa

---

**Status**: 🚧 Em desenvolvimento  
**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024 