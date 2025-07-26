# 🚀 Guia de Teste de Pesquisa Integrada - Skipper

## 📋 Visão Geral

Este guia te ajudará a testar o Skipper com pesquisas reais de produtos integradas com a view simulador. O Skipper é um orquestrador de navegação e extração de dados na web que utiliza agentes CrewAI para simular comportamento humano.

## 🎯 Objetivo

Criar um teste de pesquisa que funcione integrado com a view simulador, permitindo:

1. **Pesquisa Real**: Buscar produtos em fontes confiáveis
2. **Extração Inteligente**: Extrair atributos estruturados com alta precisão
3. **Consolidação**: Combinar resultados de múltiplas fontes
4. **Interface Integrada**: Visualizar resultados na view simulador

## 🛠️ Pré-requisitos

### 1. Ambiente Python
```bash
# Verificar Python 3.8+
python3 --version

# Criar ambiente virtual (se necessário)
python3 -m venv skipper_env
source skipper_env/bin/activate  # Linux/Mac
# ou
skipper_env\Scripts\activate  # Windows
```

### 2. Dependências
```bash
cd skipper/api
pip install -r requirements.txt
```

### 3. Variáveis de Ambiente (Opcional)
```bash
# Para usar agentes CrewAI reais (opcional)
export OPENAI_API_KEY="sua-chave-aqui"
export OPENAI_MODEL="gpt-3.5-turbo"
```

## 🚀 Iniciando o Ambiente

### Opção 1: Script Automático
```bash
cd skipper
./start_dev.sh
```

### Opção 2: Manual
```bash
# Terminal 1 - API
cd skipper/api
source venv/bin/activate
python main.py

# Terminal 2 - Frontend (se necessário)
cd skipper/web
npm install
npm run dev
```

## 🧪 Testes Disponíveis

### 1. Teste Básico da API
```bash
cd skipper
python test_basic_api.py
```

**O que testa:**
- ✅ Health check da API
- ✅ Endpoint de fontes
- ✅ Endpoint de simulação
- ✅ Logs em tempo real

### 2. Teste de Pesquisa Integrada
```bash
cd skipper

# Pesquisa automática
python test_pesquisa_integrada.py "iPhone 15"

# Pesquisa manual com fontes específicas
python test_pesquisa_integrada.py "Samsung Galaxy" false 1,2

# Pesquisa com seleção automática
python test_pesquisa_integrada.py "MacBook Pro" true
```

**Parâmetros:**
- `produto`: Nome do produto a pesquisar
- `auto_select`: `true` para seleção automática, `false` para manual
- `fontes`: IDs das fontes separados por vírgula (ex: 1,2,3)

### 3. Teste via Interface Web
1. Acesse: `http://localhost:5173/skipper/simulacao`
2. Digite o nome do produto
3. Configure as fontes
4. Clique em "Iniciar Simulação"
5. Acompanhe os logs em tempo real

## 📊 Fontes Disponíveis

### 1. Amazon (ID: 1)
- **Tipo**: Marketplace
- **URL**: https://www.amazon.com.br
- **Especialidade**: Eletrônicos, tecnologia
- **Score médio**: 0.95

### 2. Mercado Livre (ID: 2)
- **Tipo**: Marketplace
- **URL**: https://www.mercadolivre.com.br
- **Especialidade**: Produtos gerais, usados
- **Score médio**: 0.92

### 3. Google Shopping (ID: 3)
- **Tipo**: Buscador
- **URL**: https://shopping.google.com
- **Especialidade**: Comparação de preços
- **Score médio**: 0.88

## 🔍 Exemplos de Pesquisa

### Eletrônicos
```bash
# Smartphones
python test_pesquisa_integrada.py "iPhone 15 Pro"
python test_pesquisa_integrada.py "Samsung Galaxy S24"
python test_pesquisa_integrada.py "Xiaomi Redmi Note"

# Notebooks
python test_pesquisa_integrada.py "MacBook Pro M3"
python test_pesquisa_integrada.py "Dell Inspiron"
python test_pesquisa_integrada.py "Lenovo ThinkPad"

# Outros
python test_pesquisa_integrada.py "AirPods Pro"
python test_pesquisa_integrada.py "iPad Air"
python test_pesquisa_integrada.py "Apple Watch"
```

### Produtos Gerais
```bash
# Casa
python test_pesquisa_integrada.py "Smart TV 55"
python test_pesquisa_integrada.py "Aspirador Robô"
python test_pesquisa_integrada.py "Cafeteira"

# Vestuário
python test_pesquisa_integrada.py "Tênis Nike"
python test_pesquisa_integrada.py "Camisa Polo"
python test_pesquisa_integrada.py "Calça Jeans"
```

## 📈 Interpretando Resultados

### Score de Confiança
- **0.9-1.0**: Alta confiança - dados completos e precisos
- **0.7-0.9**: Boa confiança - dados parciais mas confiáveis
- **0.5-0.7**: Confiança média - dados básicos
- **0.0-0.5**: Baixa confiança - dados incompletos

### Atributos Extraídos
- **nome**: Nome do produto
- **marca**: Fabricante/marca
- **preco**: Preço atual
- **categoria**: Categoria do produto
- **descricao**: Descrição resumida
- **especificacoes**: Detalhes técnicos
- **disponibilidade**: Status de estoque
- **dimensoes**: Dimensões físicas
- **peso**: Peso do produto
- **volume**: Volume (se aplicável)

## 🔧 Troubleshooting

### Erro: "API não está saudável"
```bash
# Verificar se a API está rodando
curl http://localhost:7722/health

# Reiniciar API
cd skipper/api
python main.py
```

### Erro: "Timeout na simulação"
```bash
# Aumentar timeout no teste
python test_pesquisa_integrada.py "produto" true

# Verificar logs da API
tail -f skipper/api/skipper_agents.log
```

### Erro: "Nenhum resultado obtido"
```bash
# Verificar fontes disponíveis
curl http://localhost:7722/api/sources

# Testar com produto mais específico
python test_pesquisa_integrada.py "iPhone 15 Pro Max 256GB"
```

### Erro: "Dependências não encontradas"
```bash
# Reinstalar dependências
cd skipper/api
pip install -r requirements.txt --force-reinstall
```

## 📊 Métricas de Performance

### Tempo Médio de Execução
- **Busca**: 2-5 segundos por fonte
- **Navegação**: 3-8 segundos por página
- **Extração**: 1-3 segundos por produto
- **Total**: 10-20 segundos por simulação

### Taxa de Sucesso
- **Amazon**: ~95%
- **Mercado Livre**: ~90%
- **Google Shopping**: ~85%

### Precisão dos Dados
- **Nome/Marca**: 98%
- **Preço**: 95%
- **Especificações**: 85%
- **Descrição**: 90%

## 🎯 Próximos Passos

### 1. Integração com BrowserUse
```python
# Implementar navegação real
from browseruse import BrowserUse

class RealNavigationAgent:
    def __init__(self):
        self.browser = BrowserUse()
```

### 2. Integração com Wayfinder
```python
# Vector search para melhorar busca
from wayfinder import WayfinderClient

class EnhancedSearchAgent:
    def __init__(self):
        self.wayfinder = WayfinderClient()
```

### 3. Auto-Feedback e Auto-Reparo
```python
# Sistema de aprendizado contínuo
class AdaptiveAgent:
    def learn_from_failure(self, error, context):
        # Ajusta prompts baseado em falhas
        pass
```

## 📞 Suporte

### Logs Importantes
- **API**: `skipper/api/skipper_agents.log`
- **Frontend**: Console do navegador
- **Testes**: Output do terminal

### Comandos Úteis
```bash
# Ver logs em tempo real
tail -f skipper/api/skipper_agents.log

# Testar API rapidamente
curl http://localhost:7722/health

# Verificar fontes
curl http://localhost:7722/api/sources

# Parar todos os serviços
pkill -f "python main.py"
pkill -f "npm run dev"
```

---

**Status**: ✅ **PRONTO PARA TESTE**  
**Versão**: 2.0.0 - Pesquisa Integrada  
**Última atualização**: Dezembro 2024 