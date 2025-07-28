"""
Processador de dados CNPJ da Receita Federal
Baseado no dicionário de dados oficial: https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf
"""

import csv
import zipfile
import logging
import asyncio
from pathlib import Path
from typing import Dict, List, Any, Optional
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import asyncpg

logger = logging.getLogger(__name__)

class CNPJProcessor:
    """Processador de arquivos CNPJ da Receita Federal"""
    
    def __init__(self, db_url: str = "postgresql+asyncpg://canonika:canonika@postgres:5432/canonika"):
        self.db_url = db_url
        self.engine = None
        self.session_factory = None
        
    async def initialize_db(self):
        """Inicializa conexão com banco de dados"""
        try:
            self.engine = create_async_engine(self.db_url, echo=False)
            self.session_factory = sessionmaker(
                self.engine, class_=AsyncSession, expire_on_commit=False
            )
            logger.info("✅ Conexão com PostgreSQL estabelecida")
        except Exception as e:
            logger.error(f"❌ Erro ao conectar com PostgreSQL: {e}")
            raise
    
    async def process_cnpj_file(self, file_path: Path) -> Dict[str, Any]:
        """Processa um arquivo CNPJ completo"""
        try:
            logger.info(f"🎯 Processando arquivo: {file_path.name}")
            
            # Extrair arquivo ZIP
            extracted_dir = await self.extract_zip_file(file_path)
            
            # Processar cada tabela
            results = {}
            
            # 1. Empresas
            if (extracted_dir / "EMPRECSV").exists():
                results['empresas'] = await self.process_empresas(extracted_dir / "EMPRECSV")
            
            # 2. Estabelecimentos
            if (extracted_dir / "ESTABELE").exists():
                results['estabelecimentos'] = await self.process_estabelecimentos(extracted_dir / "ESTABELE")
            
            # 3. Sócios
            if (extracted_dir / "SOCIOCSV").exists():
                results['socios'] = await self.process_socios(extracted_dir / "SOCIOCSV")
            
            # 4. Simples
            if (extracted_dir / "SIMPLES").exists():
                results['simples'] = await self.process_simples(extracted_dir / "SIMPLES")
            
            # 5. Tabelas de domínio
            results['dominios'] = await self.process_dominios(extracted_dir)
            
            logger.info(f"✅ Processamento concluído: {file_path.name}")
            return {
                "status": "success",
                "filename": file_path.name,
                "results": results
            }
            
        except Exception as e:
            logger.error(f"❌ Erro no processamento de {file_path.name}: {e}")
            return {
                "status": "error",
                "filename": file_path.name,
                "error": str(e)
            }
    
    async def extract_zip_file(self, file_path: Path) -> Path:
        """Extrai arquivo ZIP CNPJ"""
        extract_dir = file_path.parent / f"extracted_{file_path.stem}"
        extract_dir.mkdir(exist_ok=True)
        
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        logger.info(f"📦 Arquivo extraído: {extract_dir}")
        return extract_dir
    
    async def process_empresas(self, file_path: Path) -> Dict[str, Any]:
        """Processa arquivo de empresas"""
        logger.info("🏢 Processando empresas...")
        
        # Schema baseado no dicionário oficial
        columns = [
            'cnpj_basico', 'razao_social', 'natureza_juridica', 'qualificacao_responsavel',
            'capital_social', 'porte_empresa', 'ente_federativo_responsavel'
        ]
        
        # Ler CSV com separador ';'
        df = pd.read_csv(file_path, sep=';', names=columns, encoding='latin1', dtype=str)
        
        # Limpar dados
        df = df.replace('', None)
        
        # Inserir no PostgreSQL
        await self.insert_empresas(df)
        
        return {
            "total_records": len(df),
            "processed": len(df)
        }
    
    async def process_estabelecimentos(self, file_path: Path) -> Dict[str, Any]:
        """Processa arquivo de estabelecimentos"""
        logger.info("🏪 Processando estabelecimentos...")
        
        # Schema baseado no dicionário oficial
        columns = [
            'cnpj_basico', 'cnpj_ordem', 'cnpj_dv', 'identificador_matriz_filial',
            'nome_fantasia', 'situacao_cadastral', 'data_situacao_cadastral',
            'motivo_situacao_cadastral', 'nome_cidade_exterior', 'pais',
            'data_inicio_atividade', 'cnae_fiscal_principal', 'cnae_fiscal_secundaria',
            'tipo_logradouro', 'logradouro', 'numero', 'complemento', 'bairro',
            'cep', 'uf', 'municipio', 'ddd1', 'telefone1', 'ddd2', 'telefone2',
            'ddd_fax', 'fax', 'correio_eletronico', 'situacao_especial',
            'data_situacao_especial'
        ]
        
        # Ler CSV com separador ';'
        df = pd.read_csv(file_path, sep=';', names=columns, encoding='latin1', dtype=str)
        
        # Limpar dados
        df = df.replace('', None)
        
        # Inserir no PostgreSQL
        await self.insert_estabelecimentos(df)
        
        return {
            "total_records": len(df),
            "processed": len(df)
        }
    
    async def process_socios(self, file_path: Path) -> Dict[str, Any]:
        """Processa arquivo de sócios"""
        logger.info("👥 Processando sócios...")
        
        # Schema baseado no dicionário oficial
        columns = [
            'cnpj_basico', 'identificador_socio', 'nome_socio', 'cnpj_cpf_socio',
            'qualificacao_socio', 'data_entrada_sociedade', 'pais', 'representante_legal',
            'nome_representante', 'qualificacao_representante_legal', 'faixa_etaria'
        ]
        
        # Ler CSV com separador ';'
        df = pd.read_csv(file_path, sep=';', names=columns, encoding='latin1', dtype=str)
        
        # Limpar dados
        df = df.replace('', None)
        
        # Inserir no PostgreSQL
        await self.insert_socios(df)
        
        return {
            "total_records": len(df),
            "processed": len(df)
        }
    
    async def process_simples(self, file_path: Path) -> Dict[str, Any]:
        """Processa arquivo do Simples Nacional"""
        logger.info("📋 Processando Simples Nacional...")
        
        # Schema baseado no dicionário oficial
        columns = [
            'cnpj_basico', 'opcao_simples', 'data_opcao_simples',
            'data_exclusao_simples', 'opcao_mei', 'data_opcao_mei',
            'data_exclusao_mei'
        ]
        
        # Ler CSV com separador ';'
        df = pd.read_csv(file_path, sep=';', names=columns, encoding='latin1', dtype=str)
        
        # Limpar dados
        df = df.replace('', None)
        
        # Inserir no PostgreSQL
        await self.insert_simples(df)
        
        return {
            "total_records": len(df),
            "processed": len(df)
        }
    
    async def process_dominios(self, extracted_dir: Path) -> Dict[str, Any]:
        """Processa tabelas de domínio"""
        logger.info("📚 Processando tabelas de domínio...")
        
        dominios = {}
        
        # Processar cada arquivo de domínio
        dominio_files = {
            'paises': 'PAISESCSV',
            'municipios': 'MUNICCSV', 
            'qualificacoes': 'QUALSCSV',
            'naturezas_juridicas': 'NATJUCSV',
            'cnaes': 'CNAECSV'
        }
        
        for dominio_name, filename in dominio_files.items():
            file_path = extracted_dir / filename
            if file_path.exists():
                dominios[dominio_name] = await self.process_dominio_file(file_path, dominio_name)
        
        return dominios
    
    async def process_dominio_file(self, file_path: Path, dominio_name: str) -> Dict[str, Any]:
        """Processa arquivo de domínio específico"""
        logger.info(f"📖 Processando domínio: {dominio_name}")
        
        # Schema padrão para domínios
        columns = ['codigo', 'descricao']
        
        # Ler CSV com separador ';'
        df = pd.read_csv(file_path, sep=';', names=columns, encoding='latin1', dtype=str)
        
        # Limpar dados
        df = df.replace('', None)
        
        # Inserir no PostgreSQL
        await self.insert_dominio(df, dominio_name)
        
        return {
            "total_records": len(df),
            "processed": len(df)
        }
    
    async def insert_empresas(self, df: pd.DataFrame):
        """Insere dados de empresas no PostgreSQL"""
        async with self.session_factory() as session:
            for _, row in df.iterrows():
                # Query de upsert (insert or update)
                query = text("""
                    INSERT INTO cnpj_empresas (
                        cnpj_basico, razao_social, natureza_juridica, 
                        qualificacao_responsavel, capital_social, porte_empresa,
                        ente_federativo_responsavel, created_at, updated_at
                    ) VALUES (
                        :cnpj_basico, :razao_social, :natureza_juridica,
                        :qualificacao_responsavel, :capital_social, :porte_empresa,
                        :ente_federativo_responsavel, NOW(), NOW()
                    )
                    ON CONFLICT (cnpj_basico) DO UPDATE SET
                        razao_social = EXCLUDED.razao_social,
                        natureza_juridica = EXCLUDED.natureza_juridica,
                        qualificacao_responsavel = EXCLUDED.qualificacao_responsavel,
                        capital_social = EXCLUDED.capital_social,
                        porte_empresa = EXCLUDED.porte_empresa,
                        ente_federativo_responsavel = EXCLUDED.ente_federativo_responsavel,
                        updated_at = NOW()
                """)
                
                await session.execute(query, {
                    'cnpj_basico': row['cnpj_basico'],
                    'razao_social': row['razao_social'],
                    'natureza_juridica': row['natureza_juridica'],
                    'qualificacao_responsavel': row['qualificacao_responsavel'],
                    'capital_social': row['capital_social'],
                    'porte_empresa': row['porte_empresa'],
                    'ente_federativo_responsavel': row['ente_federativo_responsavel']
                })
            
            await session.commit()
    
    async def insert_estabelecimentos(self, df: pd.DataFrame):
        """Insere dados de estabelecimentos no PostgreSQL"""
        async with self.session_factory() as session:
            for _, row in df.iterrows():
                # Query de upsert
                query = text("""
                    INSERT INTO cnpj_estabelecimentos (
                        cnpj_basico, cnpj_ordem, cnpj_dv, identificador_matriz_filial,
                        nome_fantasia, situacao_cadastral, data_situacao_cadastral,
                        motivo_situacao_cadastral, nome_cidade_exterior, pais,
                        data_inicio_atividade, cnae_fiscal_principal, cnae_fiscal_secundaria,
                        tipo_logradouro, logradouro, numero, complemento, bairro,
                        cep, uf, municipio, ddd1, telefone1, ddd2, telefone2,
                        ddd_fax, fax, correio_eletronico, situacao_especial,
                        data_situacao_especial, created_at, updated_at
                    ) VALUES (
                        :cnpj_basico, :cnpj_ordem, :cnpj_dv, :identificador_matriz_filial,
                        :nome_fantasia, :situacao_cadastral, :data_situacao_cadastral,
                        :motivo_situacao_cadastral, :nome_cidade_exterior, :pais,
                        :data_inicio_atividade, :cnae_fiscal_principal, :cnae_fiscal_secundaria,
                        :tipo_logradouro, :logradouro, :numero, :complemento, :bairro,
                        :cep, :uf, :municipio, :ddd1, :telefone1, :ddd2, :telefone2,
                        :ddd_fax, :fax, :correio_eletronico, :situacao_especial,
                        :data_situacao_especial, NOW(), NOW()
                    )
                    ON CONFLICT (cnpj_basico, cnpj_ordem, cnpj_dv) DO UPDATE SET
                        nome_fantasia = EXCLUDED.nome_fantasia,
                        situacao_cadastral = EXCLUDED.situacao_cadastral,
                        data_situacao_cadastral = EXCLUDED.data_situacao_cadastral,
                        motivo_situacao_cadastral = EXCLUDED.motivo_situacao_cadastral,
                        nome_cidade_exterior = EXCLUDED.nome_cidade_exterior,
                        pais = EXCLUDED.pais,
                        data_inicio_atividade = EXCLUDED.data_inicio_atividade,
                        cnae_fiscal_principal = EXCLUDED.cnae_fiscal_principal,
                        cnae_fiscal_secundaria = EXCLUDED.cnae_fiscal_secundaria,
                        tipo_logradouro = EXCLUDED.tipo_logradouro,
                        logradouro = EXCLUDED.logradouro,
                        numero = EXCLUDED.numero,
                        complemento = EXCLUDED.complemento,
                        bairro = EXCLUDED.bairro,
                        cep = EXCLUDED.cep,
                        uf = EXCLUDED.uf,
                        municipio = EXCLUDED.municipio,
                        ddd1 = EXCLUDED.ddd1,
                        telefone1 = EXCLUDED.telefone1,
                        ddd2 = EXCLUDED.ddd2,
                        telefone2 = EXCLUDED.telefone2,
                        ddd_fax = EXCLUDED.ddd_fax,
                        fax = EXCLUDED.fax,
                        correio_eletronico = EXCLUDED.correio_eletronico,
                        situacao_especial = EXCLUDED.situacao_especial,
                        data_situacao_especial = EXCLUDED.data_situacao_especial,
                        updated_at = NOW()
                """)
                
                await session.execute(query, {
                    'cnpj_basico': row['cnpj_basico'],
                    'cnpj_ordem': row['cnpj_ordem'],
                    'cnpj_dv': row['cnpj_dv'],
                    'identificador_matriz_filial': row['identificador_matriz_filial'],
                    'nome_fantasia': row['nome_fantasia'],
                    'situacao_cadastral': row['situacao_cadastral'],
                    'data_situacao_cadastral': row['data_situacao_cadastral'],
                    'motivo_situacao_cadastral': row['motivo_situacao_cadastral'],
                    'nome_cidade_exterior': row['nome_cidade_exterior'],
                    'pais': row['pais'],
                    'data_inicio_atividade': row['data_inicio_atividade'],
                    'cnae_fiscal_principal': row['cnae_fiscal_principal'],
                    'cnae_fiscal_secundaria': row['cnae_fiscal_secundaria'],
                    'tipo_logradouro': row['tipo_logradouro'],
                    'logradouro': row['logradouro'],
                    'numero': row['numero'],
                    'complemento': row['complemento'],
                    'bairro': row['bairro'],
                    'cep': row['cep'],
                    'uf': row['uf'],
                    'municipio': row['municipio'],
                    'ddd1': row['ddd1'],
                    'telefone1': row['telefone1'],
                    'ddd2': row['ddd2'],
                    'telefone2': row['telefone2'],
                    'ddd_fax': row['ddd_fax'],
                    'fax': row['fax'],
                    'correio_eletronico': row['correio_eletronico'],
                    'situacao_especial': row['situacao_especial'],
                    'data_situacao_especial': row['data_situacao_especial']
                })
            
            await session.commit()
    
    async def insert_socios(self, df: pd.DataFrame):
        """Insere dados de sócios no PostgreSQL"""
        async with self.session_factory() as session:
            for _, row in df.iterrows():
                # Query de upsert
                query = text("""
                    INSERT INTO cnpj_socios (
                        cnpj_basico, identificador_socio, nome_socio, cnpj_cpf_socio,
                        qualificacao_socio, data_entrada_sociedade, pais, representante_legal,
                        nome_representante, qualificacao_representante_legal, faixa_etaria,
                        created_at, updated_at
                    ) VALUES (
                        :cnpj_basico, :identificador_socio, :nome_socio, :cnpj_cpf_socio,
                        :qualificacao_socio, :data_entrada_sociedade, :pais, :representante_legal,
                        :nome_representante, :qualificacao_representante_legal, :faixa_etaria,
                        NOW(), NOW()
                    )
                    ON CONFLICT (cnpj_basico, identificador_socio, nome_socio) DO UPDATE SET
                        cnpj_cpf_socio = EXCLUDED.cnpj_cpf_socio,
                        qualificacao_socio = EXCLUDED.qualificacao_socio,
                        data_entrada_sociedade = EXCLUDED.data_entrada_sociedade,
                        pais = EXCLUDED.pais,
                        representante_legal = EXCLUDED.representante_legal,
                        nome_representante = EXCLUDED.nome_representante,
                        qualificacao_representante_legal = EXCLUDED.qualificacao_representante_legal,
                        faixa_etaria = EXCLUDED.faixa_etaria,
                        updated_at = NOW()
                """)
                
                await session.execute(query, {
                    'cnpj_basico': row['cnpj_basico'],
                    'identificador_socio': row['identificador_socio'],
                    'nome_socio': row['nome_socio'],
                    'cnpj_cpf_socio': row['cnpj_cpf_socio'],
                    'qualificacao_socio': row['qualificacao_socio'],
                    'data_entrada_sociedade': row['data_entrada_sociedade'],
                    'pais': row['pais'],
                    'representante_legal': row['representante_legal'],
                    'nome_representante': row['nome_representante'],
                    'qualificacao_representante_legal': row['qualificacao_representante_legal'],
                    'faixa_etaria': row['faixa_etaria']
                })
            
            await session.commit()
    
    async def insert_simples(self, df: pd.DataFrame):
        """Insere dados do Simples Nacional no PostgreSQL"""
        async with self.session_factory() as session:
            for _, row in df.iterrows():
                # Query de upsert
                query = text("""
                    INSERT INTO cnpj_simples (
                        cnpj_basico, opcao_simples, data_opcao_simples,
                        data_exclusao_simples, opcao_mei, data_opcao_mei,
                        data_exclusao_mei, created_at, updated_at
                    ) VALUES (
                        :cnpj_basico, :opcao_simples, :data_opcao_simples,
                        :data_exclusao_simples, :opcao_mei, :data_opcao_mei,
                        :data_exclusao_mei, NOW(), NOW()
                    )
                    ON CONFLICT (cnpj_basico) DO UPDATE SET
                        opcao_simples = EXCLUDED.opcao_simples,
                        data_opcao_simples = EXCLUDED.data_opcao_simples,
                        data_exclusao_simples = EXCLUDED.data_exclusao_simples,
                        opcao_mei = EXCLUDED.opcao_mei,
                        data_opcao_mei = EXCLUDED.data_opcao_mei,
                        data_exclusao_mei = EXCLUDED.data_exclusao_mei,
                        updated_at = NOW()
                """)
                
                await session.execute(query, {
                    'cnpj_basico': row['cnpj_basico'],
                    'opcao_simples': row['opcao_simples'],
                    'data_opcao_simples': row['data_opcao_simples'],
                    'data_exclusao_simples': row['data_exclusao_simples'],
                    'opcao_mei': row['opcao_mei'],
                    'data_opcao_mei': row['data_opcao_mei'],
                    'data_exclusao_mei': row['data_exclusao_mei']
                })
            
            await session.commit()
    
    async def insert_dominio(self, df: pd.DataFrame, dominio_name: str):
        """Insere dados de domínio no PostgreSQL"""
        table_name = f"cnpj_{dominio_name}"
        
        async with self.session_factory() as session:
            for _, row in df.iterrows():
                # Query de upsert
                query = text(f"""
                    INSERT INTO {table_name} (
                        codigo, descricao, created_at, updated_at
                    ) VALUES (
                        :codigo, :descricao, NOW(), NOW()
                    )
                    ON CONFLICT (codigo) DO UPDATE SET
                        descricao = EXCLUDED.descricao,
                        updated_at = NOW()
                """)
                
                await session.execute(query, {
                    'codigo': row['codigo'],
                    'descricao': row['descricao']
                })
            
            await session.commit() 