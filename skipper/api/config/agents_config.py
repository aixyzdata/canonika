"""
Configurações para os agentes CrewAI do Skipper
"""

import os
from typing import Dict, Any

# Configurações de LLM
LLM_CONFIG = {
    "model": os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
    "temperature": 0.1,
    "max_tokens": 4000,
    "api_key": os.getenv("OPENAI_API_KEY", "")
}

# Configurações dos agentes
AGENT_CONFIGS = {
    "search_agent": {
        "role": "Especialista em Busca Web",
        "goal": "Encontrar os links mais relevantes para produtos específicos em diferentes fontes",
        "backstory": """Você é um especialista em busca web com vasta experiência em encontrar 
        produtos em marketplaces, sites de fabricantes e buscadores. Você conhece as melhores 
        estratégias para obter resultados precisos e relevantes.""",
        "verbose": True,
        "allow_delegation": False
    },
    
    "navigation_agent": {
        "role": "Especialista em Navegação Web",
        "goal": "Acessar páginas de produtos e extrair conteúdo limpo",
        "backstory": """Você é um especialista em navegação web que simula comportamento humano 
        para acessar páginas de produtos sem ser detectado como bot. Você extrai o conteúdo 
        HTML e converte para texto limpo, removendo scripts, estilos e elementos desnecessários.""",
        "verbose": True,
        "allow_delegation": False
    },
    
    "extraction_agent": {
        "role": "Especialista em Extração de Dados",
        "goal": "Extrair atributos estruturados de produtos a partir de texto",
        "backstory": """Você é um especialista em processamento de linguagem natural e extração 
        de dados. Você analisa textos de produtos e identifica atributos como nome, marca, 
        preço, dimensões, especificações técnicas e outras características relevantes.""",
        "verbose": True,
        "allow_delegation": False
    }
}

# Configurações de prompts por tipo de fonte
SOURCE_PROMPTS = {
    "marketplace": {
        "search_prompt": "Pesquise por {product} no {source_name}. Foque em produtos com informações detalhadas.",
        "navigation_prompt": "Acesse a página do produto e extraia o conteúdo principal, incluindo título, preço, descrição e especificações.",
        "extraction_prompt": "Extraia os seguintes atributos do produto: nome, marca, preço, descrição, categoria, especificações técnicas, disponibilidade."
    },
    
    "fabricante": {
        "search_prompt": "Busque informações sobre {product} no site oficial do fabricante {source_name}.",
        "navigation_prompt": "Navegue até a página do produto e extraia informações técnicas detalhadas.",
        "extraction_prompt": "Extraia informações técnicas: nome, marca, especificações técnicas, dimensões, peso, volume, descrição técnica."
    },
    
    "buscador": {
        "search_prompt": "Pesquise {product} no {source_name} e encontre páginas de produtos relevantes.",
        "navigation_prompt": "Acesse os resultados de busca e extraia informações dos produtos encontrados.",
        "extraction_prompt": "Extraia dados dos produtos: nome, marca, preço, descrição, categoria, disponibilidade."
    }
}

# Configurações de atributos por categoria de produto
PRODUCT_ATTRIBUTES = {
    "eletronicos": [
        "nome", "marca", "preco", "descricao", "categoria", "especificacoes", 
        "dimensoes", "peso", "cor", "modelo", "garantia"
    ],
    "alimentos": [
        "nome", "marca", "preco", "descricao", "categoria", "peso", "volume", 
        "ingredientes", "validade", "conservacao", "alergicos"
    ],
    "vestuario": [
        "nome", "marca", "preco", "descricao", "categoria", "tamanho", "cor", 
        "material", "genero", "idade", "estilo"
    ],
    "casa": [
        "nome", "marca", "preco", "descricao", "categoria", "dimensoes", 
        "material", "cor", "peso", "volume", "ambiente"
    ]
}

# Configurações de simulação
SIMULATION_CONFIG = {
    "max_urls_per_source": 3,
    "max_sources_per_simulation": 5,
    "timeout_per_agent": 30,  # segundos
    "retry_attempts": 2,
    "delay_between_agents": 1,  # segundos
}

# Configurações de logging
LOGGING_CONFIG = {
    "level": "INFO",
    "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    "file": "skipper_agents.log"
}

def get_agent_config(agent_type: str) -> Dict[str, Any]:
    """Retorna configuração de um agente específico"""
    return AGENT_CONFIGS.get(agent_type, {})

def get_source_prompts(source_type: str) -> Dict[str, str]:
    """Retorna prompts para um tipo de fonte"""
    return SOURCE_PROMPTS.get(source_type, SOURCE_PROMPTS["marketplace"])

def get_product_attributes(category: str) -> list:
    """Retorna atributos para uma categoria de produto"""
    return PRODUCT_ATTRIBUTES.get(category, PRODUCT_ATTRIBUTES["eletronicos"]) 