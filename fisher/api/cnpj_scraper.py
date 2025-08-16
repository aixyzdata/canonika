import asyncio
import aiohttp
import logging
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Any
import re

logger = logging.getLogger(__name__)

class CNPJScraper:
    """Scraper para buscar dados dinâmicos do site da Receita Federal"""
    
    def __init__(self):
        self.base_url = "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/"
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def get_folders_list(self) -> List[Dict[str, Any]]:
        """Busca a lista de pastas disponíveis no site da Receita Federal"""
        try:
            async with self.session.get(self.base_url) as response:
                if response.status != 200:
                    logger.error(f"Erro ao acessar {self.base_url}: {response.status}")
                    return []
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                folders = []
                # Procurar por links de pastas (formato YYYY-MM)
                for link in soup.find_all('a'):
                    href = link.get('href', '')
                    # Padrão de pasta: YYYY-MM/
                    if re.match(r'^\d{4}-\d{2}/$', href):
                        folder_name = href.rstrip('/')
                        # Extrair data de modificação se disponível
                        parent_td = link.find_parent('td')
                        if parent_td:
                            # Procurar pela data na linha da tabela
                            row = parent_td.find_parent('tr')
                            if row:
                                cells = row.find_all('td')
                                if len(cells) >= 3:
                                    last_modified = cells[2].get_text(strip=True)
                                else:
                                    last_modified = None
                            else:
                                last_modified = None
                        else:
                            last_modified = None
                        
                        folders.append({
                            'folder': folder_name,
                            'url': f"{self.base_url}{href}",
                            'last_modified': last_modified,
                            'status': 'PENDING'
                        })
                
                logger.info(f"Encontradas {len(folders)} pastas no site da Receita Federal")
                return folders
                
        except Exception as e:
            logger.error(f"Erro ao buscar pastas: {e}")
            return []
    
    async def get_files_in_folder(self, folder_url: str) -> List[Dict[str, Any]]:
        """Busca os arquivos dentro de uma pasta específica"""
        try:
            async with self.session.get(folder_url) as response:
                if response.status != 200:
                    logger.error(f"Erro ao acessar {folder_url}: {response.status}")
                    return []
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                files = []
                for link in soup.find_all('a'):
                    href = link.get('href', '')
                    # Procurar por arquivos .zip
                    if href.endswith('.zip'):
                        filename = href
                        file_url = f"{folder_url}{filename}"
                        
                        # Extrair informações do arquivo
                        parent_td = link.find_parent('td')
                        file_size = None
                        last_modified = None
                        
                        if parent_td:
                            row = parent_td.find_parent('tr')
                            if row:
                                cells = row.find_all('td')
                                if len(cells) >= 4:
                                    file_size = cells[3].get_text(strip=True)
                                    last_modified = cells[2].get_text(strip=True)
                        
                        files.append({
                            'filename': filename,
                            'file_url': file_url,
                            'file_size': file_size,
                            'last_modified': last_modified,
                            'status': 'PENDING'
                        })
                
                logger.info(f"Encontrados {len(files)} arquivos em {folder_url}")
                return files
                
        except Exception as e:
            logger.error(f"Erro ao buscar arquivos em {folder_url}: {e}")
            return []
    
    async def get_complete_hierarchy(self) -> Dict[str, Any]:
        """Busca a hierarquia completa de pastas e arquivos"""
        try:
            folders = await self.get_folders_list()
            
            all_files = []
            for folder in folders:
                folder_files = await self.get_files_in_folder(folder['url'])
                for file in folder_files:
                    file['folder'] = folder['folder']
                all_files.extend(folder_files)
            
            return {
                'folders': folders,
                'files': all_files,
                'total_folders': len(folders),
                'total_files': len(all_files),
                'last_check': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erro ao buscar hierarquia completa: {e}")
            return {
                'folders': [],
                'files': [],
                'total_folders': 0,
                'total_files': 0,
                'last_check': datetime.now().isoformat()
            } 