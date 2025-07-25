"""
Agentes CrewAI para o Skipper - Orquestrador de Navegação e Extração

Este módulo implementa os três agentes principais:
1. Link Search Agent - Busca links relevantes
2. Page Navigator Agent - Navega pelas páginas
3. Attribute Extractor Agent - Extrai atributos dos produtos
"""

from crewai import Agent, Task, Crew, Process
from langchain.tools import Tool
from langchain_openai import ChatOpenAI
from typing import List, Dict, Any, Optional
import asyncio
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SkipperAgents:
    """Classe principal para gerenciar os agentes do Skipper"""
    
    def __init__(self, llm_model: str = "gpt-3.5-turbo"):
        self.llm = ChatOpenAI(model=llm_model, temperature=0.1)
        self.setup_agents()
    
    def setup_agents(self):
        """Configura os três agentes principais"""
        
        # Agente de Busca (Link Search Agent)
        self.search_agent = Agent(
            role="Especialista em Busca Web",
            goal="Encontrar os links mais relevantes para produtos específicos em diferentes fontes",
            backstory="""Você é um especialista em busca web com vasta experiência em encontrar 
            produtos em marketplaces, sites de fabricantes e buscadores. Você conhece as melhores 
            estratégias para obter resultados precisos e relevantes.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        # Agente de Navegação (Page Navigator Agent)
        self.navigation_agent = Agent(
            role="Especialista em Navegação Web",
            goal="Acessar páginas de produtos e extrair conteúdo limpo",
            backstory="""Você é um especialista em navegação web que simula comportamento humano 
            para acessar páginas de produtos sem ser detectado como bot. Você extrai o conteúdo 
            HTML e converte para texto limpo, removendo scripts, estilos e elementos desnecessários.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        # Agente de Extração (Attribute Extractor Agent)
        self.extraction_agent = Agent(
            role="Especialista em Extração de Dados",
            goal="Extrair atributos estruturados de produtos a partir de texto",
            backstory="""Você é um especialista em processamento de linguagem natural e extração 
            de dados. Você analisa textos de produtos e identifica atributos como nome, marca, 
            preço, dimensões, especificações técnicas e outras características relevantes.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    async def search_product_links(self, product_name: str, source_config: Dict[str, Any]) -> List[str]:
        """
        Busca links relevantes para um produto em uma fonte específica
        
        Args:
            product_name: Nome do produto a buscar
            source_config: Configuração da fonte (URL, prompts, etc.)
        
        Returns:
            Lista de URLs encontradas
        """
        try:
            # Criar task para busca
            search_task = Task(
                description=f"""
                Busque links relevantes para o produto '{product_name}' na fonte {source_config['name']}.
                
                Fonte: {source_config['name']}
                URL Base: {source_config['base_url']}
                Prompt de Busca: {source_config['search_prompt'].format(product=product_name)}
                
                Retorne uma lista de URLs das páginas de produtos mais relevantes encontradas.
                Foque em páginas que contenham informações detalhadas do produto.
                """,
                agent=self.search_agent,
                expected_output="Lista de URLs separadas por vírgula"
            )
            
            # Executar busca
            crew = Crew(
                agents=[self.search_agent],
                tasks=[search_task],
                process=Process.sequential,
                verbose=True
            )
            
            result = await crew.kickoff()
            
            # Processar resultado
            urls = self._parse_urls_from_result(result)
            logger.info(f"Encontrados {len(urls)} links para '{product_name}' em {source_config['name']}")
            
            return urls
            
        except Exception as e:
            logger.error(f"Erro na busca de links: {str(e)}")
            return []
    
    async def navigate_and_extract_content(self, urls: List[str], source_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Navega pelas URLs e extrai conteúdo das páginas
        
        Args:
            urls: Lista de URLs para navegar
            source_config: Configuração da fonte
        
        Returns:
            Lista de conteúdos extraídos
        """
        try:
            contents = []
            
            for url in urls[:3]:  # Limitar a 3 URLs por simulação
                # Criar task para navegação
                navigation_task = Task(
                    description=f"""
                    Navegue para a URL {url} e extraia o conteúdo da página de produto.
                    
                    Fonte: {source_config['name']}
                    Prompt de Navegação: {source_config['navigation_prompt']}
                    
                    Simule comportamento humano:
                    - Aguarde carregamento da página
                    - Role a página para carregar conteúdo dinâmico
                    - Extraia o HTML da página
                    - Converta para texto limpo (remova scripts, estilos, espaços extras)
                    - Foque no conteúdo principal do produto
                    """,
                    agent=self.navigation_agent,
                    expected_output="Texto limpo da página de produto"
                )
                
                # Executar navegação
                crew = Crew(
                    agents=[self.navigation_agent],
                    tasks=[navigation_task],
                    process=Process.sequential,
                    verbose=True
                )
                
                result = await crew.kickoff()
                
                contents.append({
                    "url": url,
                    "content": result,
                    "source": source_config['name']
                })
                
                # Aguardar entre navegações
                await asyncio.sleep(1)
            
            logger.info(f"Extraído conteúdo de {len(contents)} páginas de {source_config['name']}")
            return contents
            
        except Exception as e:
            logger.error(f"Erro na navegação: {str(e)}")
            return []
    
    async def extract_product_attributes(self, contents: List[Dict[str, Any]], source_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extrai atributos de produtos dos conteúdos navegados
        
        Args:
            contents: Lista de conteúdos extraídos
            source_config: Configuração da fonte
        
        Returns:
            Dicionário com atributos extraídos
        """
        try:
            all_attributes = []
            
            for content in contents:
                # Criar task para extração
                extraction_task = Task(
                    description=f"""
                    Analise o seguinte conteúdo de produto e extraia atributos estruturados:
                    
                    Conteúdo: {content['content'][:2000]}...
                    
                    Prompt de Extração: {source_config['extraction_prompt']}
                    
                    Extraia os seguintes atributos:
                    - nome: Nome do produto
                    - marca: Marca/fabricante
                    - preco: Preço (se disponível)
                    - descricao: Descrição do produto
                    - categoria: Categoria do produto
                    - especificacoes: Especificações técnicas
                    - disponibilidade: Status de estoque
                    - dimensoes: Dimensões (se aplicável)
                    - peso: Peso (se aplicável)
                    - volume: Volume (se aplicável)
                    
                    Retorne os atributos em formato JSON.
                    """,
                    agent=self.extraction_agent,
                    expected_output="JSON com atributos extraídos"
                )
                
                # Executar extração
                crew = Crew(
                    agents=[self.extraction_agent],
                    tasks=[extraction_task],
                    process=Process.sequential,
                    verbose=True
                )
                
                result = await crew.kickoff()
                
                # Processar resultado
                attributes = self._parse_attributes_from_result(result)
                attributes['source'] = content['source']
                attributes['url'] = content['url']
                attributes['score_confianca'] = self._calculate_confidence_score(attributes)
                
                all_attributes.append(attributes)
            
            # Consolidar resultados
            if all_attributes:
                best_result = max(all_attributes, key=lambda x: x.get('score_confianca', 0))
                logger.info(f"Extraídos atributos de {len(all_attributes)} páginas de {source_config['name']}")
                return best_result
            
            return {}
            
        except Exception as e:
            logger.error(f"Erro na extração de atributos: {str(e)}")
            return {}
    
    def _parse_urls_from_result(self, result: str) -> List[str]:
        """Extrai URLs do resultado do agente de busca"""
        try:
            # Simular extração de URLs (em produção, usar regex ou parsing mais robusto)
            urls = []
            lines = result.split('\n')
            for line in lines:
                if 'http' in line and any(domain in line.lower() for domain in ['amazon', 'mercadolivre', 'google']):
                    # Extrair URL da linha
                    url = line.strip()
                    if url.startswith('http'):
                        urls.append(url)
            
            return urls[:5]  # Limitar a 5 URLs
        except Exception as e:
            logger.error(f"Erro ao processar URLs: {str(e)}")
            return []
    
    def _parse_attributes_from_result(self, result: str) -> Dict[str, Any]:
        """Extrai atributos do resultado do agente de extração"""
        try:
            # Simular parsing de JSON (em produção, usar json.loads)
            attributes = {
                "nome": "",
                "marca": "",
                "preco": "",
                "descricao": "",
                "categoria": "",
                "especificacoes": "",
                "disponibilidade": "",
                "dimensoes": "",
                "peso": "",
                "volume": ""
            }
            
            # Extrair informações do resultado
            lines = result.split('\n')
            for line in lines:
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip().lower()
                    value = value.strip()
                    
                    if key in attributes:
                        attributes[key] = value
            
            return attributes
        except Exception as e:
            logger.error(f"Erro ao processar atributos: {str(e)}")
            return {}
    
    def _calculate_confidence_score(self, attributes: Dict[str, Any]) -> float:
        """Calcula score de confiança baseado na completude dos atributos"""
        try:
            required_attrs = ['nome', 'marca', 'descricao']
            optional_attrs = ['preco', 'categoria', 'especificacoes']
            
            score = 0.0
            total_attrs = len(required_attrs) + len(optional_attrs)
            
            # Verificar atributos obrigatórios
            for attr in required_attrs:
                if attributes.get(attr) and len(attributes[attr]) > 0:
                    score += 1.0
            
            # Verificar atributos opcionais
            for attr in optional_attrs:
                if attributes.get(attr) and len(attributes[attr]) > 0:
                    score += 0.5
            
            return min(score / total_attrs, 1.0)
        except Exception as e:
            logger.error(f"Erro ao calcular score: {str(e)}")
            return 0.0

# Instância global dos agentes
skipper_agents = SkipperAgents() 