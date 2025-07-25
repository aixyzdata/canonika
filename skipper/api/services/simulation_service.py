"""
Serviço de Simulação do Skipper

Gerencia o pipeline completo de simulação usando agentes CrewAI:
1. Busca de links
2. Navegação e extração de conteúdo
3. Extração de atributos
4. Consolidação de resultados
"""

import asyncio
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from agents.crew_agents import skipper_agents
from config.agents_config import SIMULATION_CONFIG

logger = logging.getLogger(__name__)

class SimulationService:
    """Serviço para gerenciar simulações do Skipper"""
    
    def __init__(self):
        self.active_simulations = {}
        self.simulation_results = {}
        self.agent_logs = []
    
    async def start_simulation(self, simulation_id: str, product_name: str, 
                             source_configs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Inicia uma nova simulação
        
        Args:
            simulation_id: ID único da simulação
            product_name: Nome do produto a pesquisar
            source_configs: Lista de configurações de fontes
        
        Returns:
            Dicionário com informações da simulação
        """
        try:
            logger.info(f"Iniciando simulação {simulation_id} para '{product_name}'")
            
            # Inicializar simulação
            simulation_data = {
                "id": simulation_id,
                "product_name": product_name,
                "sources_used": [source["name"] for source in source_configs],
                "results": {},
                "consolidated_product": {},
                "status": "running",
                "created_at": datetime.now(),
                "completed_at": None,
                "error": None
            }
            
            self.active_simulations[simulation_id] = simulation_data
            
            # Executar pipeline para cada fonte
            for source_config in source_configs[:SIMULATION_CONFIG["max_sources_per_simulation"]]:
                await self._process_source(simulation_id, product_name, source_config)
            
            # Consolidar resultados
            if simulation_data["results"]:
                simulation_data["consolidated_product"] = self._consolidate_results(
                    simulation_data["results"]
                )
                simulation_data["status"] = "completed"
                simulation_data["completed_at"] = datetime.now()
                
                logger.info(f"Simulação {simulation_id} concluída com sucesso")
            else:
                simulation_data["status"] = "failed"
                simulation_data["error"] = "Nenhum resultado obtido das fontes"
                logger.warning(f"Simulação {simulation_id} falhou - nenhum resultado")
            
            # Salvar resultado final
            self.simulation_results[simulation_id] = simulation_data
            
            return simulation_data
            
        except Exception as e:
            logger.error(f"Erro na simulação {simulation_id}: {str(e)}")
            if simulation_id in self.active_simulations:
                self.active_simulations[simulation_id]["status"] = "failed"
                self.active_simulations[simulation_id]["error"] = str(e)
            return {"error": str(e)}
    
    async def _process_source(self, simulation_id: str, product_name: str, 
                            source_config: Dict[str, Any]) -> None:
        """
        Processa uma fonte específica na simulação
        
        Args:
            simulation_id: ID da simulação
            product_name: Nome do produto
            source_config: Configuração da fonte
        """
        source_name = source_config["name"]
        
        try:
            # 1. Agente de Busca
            await self._log_agent_activity(simulation_id, "search", source_name, "started",
                                         f"Iniciando busca por '{product_name}' em {source_name}")
            
            urls = await skipper_agents.search_product_links(product_name, source_config)
            
            if not urls:
                await self._log_agent_activity(simulation_id, "search", source_name, "failed",
                                             "Nenhum link encontrado")
                return
            
            await self._log_agent_activity(simulation_id, "search", source_name, "completed",
                                         f"Busca concluída - {len(urls)} links encontrados")
            
            # 2. Agente de Navegação
            await self._log_agent_activity(simulation_id, "navigation", source_name, "started",
                                         f"Navegando para páginas de produtos")
            
            contents = await skipper_agents.navigate_and_extract_content(urls, source_config)
            
            if not contents:
                await self._log_agent_activity(simulation_id, "navigation", source_name, "failed",
                                             "Falha na navegação")
                return
            
            await self._log_agent_activity(simulation_id, "navigation", source_name, "completed",
                                         f"Navegação concluída - {len(contents)} páginas processadas")
            
            # 3. Agente de Extração
            await self._log_agent_activity(simulation_id, "extraction", source_name, "started",
                                         f"Extraindo atributos do produto")
            
            attributes = await skipper_agents.extract_product_attributes(contents, source_config)
            
            if attributes:
                self.active_simulations[simulation_id]["results"][source_name] = attributes
                await self._log_agent_activity(simulation_id, "extraction", source_name, "completed",
                                             f"Extração concluída - {len(attributes)} atributos extraídos")
            else:
                await self._log_agent_activity(simulation_id, "extraction", source_name, "failed",
                                             "Falha na extração de atributos")
            
        except Exception as e:
            logger.error(f"Erro processando fonte {source_name}: {str(e)}")
            await self._log_agent_activity(simulation_id, "system", source_name, "failed",
                                         f"Erro: {str(e)}")
    
    def _consolidate_results(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Consolida resultados de múltiplas fontes
        
        Args:
            results: Dicionário com resultados por fonte
        
        Returns:
            Produto consolidado
        """
        if not results:
            return {}
        
        consolidated = {
            "nome": "",
            "marca": "",
            "preco": "",
            "descricao": "",
            "categoria": "",
            "especificacoes": "",
            "disponibilidade": "",
            "dimensoes": "",
            "peso": "",
            "volume": "",
            "score_global": 0.0,
            "fontes_consultadas": list(results.keys()),
            "atributos_por_fonte": {}
        }
        
        # Calcular score global
        scores = []
        for source_name, result in results.items():
            score = result.get("score_confianca", 0)
            scores.append(score)
            consolidated["atributos_por_fonte"][source_name] = result
        
        if scores:
            consolidated["score_global"] = sum(scores) / len(scores)
        
        # Encontrar o melhor resultado para cada atributo
        best_result = max(results.values(), key=lambda x: x.get("score_confianca", 0))
        
        for key in ["nome", "marca", "preco", "descricao", "categoria", 
                   "especificacoes", "disponibilidade", "dimensoes", "peso", "volume"]:
            if key in best_result and best_result[key]:
                consolidated[key] = best_result[key]
        
        return consolidated
    
    async def _log_agent_activity(self, simulation_id: str, agent_type: str, 
                                 source_name: str, status: str, message: str,
                                 details: Optional[Dict] = None) -> None:
        """
        Registra atividade dos agentes
        
        Args:
            simulation_id: ID da simulação
            agent_type: Tipo do agente (search, navigation, extraction)
            source_name: Nome da fonte
            status: Status da atividade (started, completed, failed)
            message: Mensagem descritiva
            details: Detalhes adicionais
        """
        log_entry = {
            "simulation_id": simulation_id,
            "agent_type": agent_type,
            "source_name": source_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now(),
            "details": details
        }
        
        self.agent_logs.append(log_entry)
        logger.info(f"[{agent_type.upper()}] {source_name}: {message}")
    
    def get_simulation_status(self, simulation_id: str) -> Optional[Dict[str, Any]]:
        """Obtém status de uma simulação"""
        return self.active_simulations.get(simulation_id) or self.simulation_results.get(simulation_id)
    
    def get_simulation_logs(self, simulation_id: str) -> List[Dict[str, Any]]:
        """Obtém logs de uma simulação"""
        return [log for log in self.agent_logs if log.get("simulation_id") == simulation_id]
    
    def get_all_simulations(self) -> List[Dict[str, Any]]:
        """Obtém todas as simulações"""
        all_sims = list(self.active_simulations.values())
        all_sims.extend(list(self.simulation_results.values()))
        return all_sims

# Instância global do serviço
simulation_service = SimulationService() 