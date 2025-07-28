-- Schema CNPJ baseado no dicionário de dados oficial da Receita Federal
-- https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf

-- Tabela de Empresas
CREATE TABLE IF NOT EXISTS cnpj_empresas (
    id SERIAL PRIMARY KEY,
    cnpj_basico VARCHAR(8) NOT NULL UNIQUE,
    razao_social TEXT,
    natureza_juridica VARCHAR(4),
    qualificacao_responsavel VARCHAR(2),
    capital_social DECIMAL(15,2),
    porte_empresa VARCHAR(2),
    ente_federativo_responsavel TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Estabelecimentos
CREATE TABLE IF NOT EXISTS cnpj_estabelecimentos (
    id SERIAL PRIMARY KEY,
    cnpj_basico VARCHAR(8) NOT NULL,
    cnpj_ordem VARCHAR(4) NOT NULL,
    cnpj_dv VARCHAR(2) NOT NULL,
    identificador_matriz_filial VARCHAR(1),
    nome_fantasia TEXT,
    situacao_cadastral VARCHAR(2),
    data_situacao_cadastral DATE,
    motivo_situacao_cadastral VARCHAR(2),
    nome_cidade_exterior TEXT,
    pais VARCHAR(3),
    data_inicio_atividade DATE,
    cnae_fiscal_principal VARCHAR(7),
    cnae_fiscal_secundaria TEXT,
    tipo_logradouro VARCHAR(20),
    logradouro TEXT,
    numero VARCHAR(10),
    complemento TEXT,
    bairro VARCHAR(50),
    cep VARCHAR(8),
    uf VARCHAR(2),
    municipio VARCHAR(4),
    ddd1 VARCHAR(2),
    telefone1 VARCHAR(9),
    ddd2 VARCHAR(2),
    telefone2 VARCHAR(9),
    ddd_fax VARCHAR(2),
    fax VARCHAR(9),
    correio_eletronico TEXT,
    situacao_especial VARCHAR(2),
    data_situacao_especial DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(cnpj_basico, cnpj_ordem, cnpj_dv)
);

-- Tabela de Sócios
CREATE TABLE IF NOT EXISTS cnpj_socios (
    id SERIAL PRIMARY KEY,
    cnpj_basico VARCHAR(8) NOT NULL,
    identificador_socio VARCHAR(1) NOT NULL,
    nome_socio TEXT NOT NULL,
    cnpj_cpf_socio VARCHAR(14),
    qualificacao_socio VARCHAR(2),
    data_entrada_sociedade DATE,
    pais VARCHAR(3),
    representante_legal VARCHAR(11),
    nome_representante TEXT,
    qualificacao_representante_legal VARCHAR(2),
    faixa_etaria VARCHAR(1),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(cnpj_basico, identificador_socio, nome_socio)
);

-- Tabela do Simples Nacional
CREATE TABLE IF NOT EXISTS cnpj_simples (
    id SERIAL PRIMARY KEY,
    cnpj_basico VARCHAR(8) NOT NULL UNIQUE,
    opcao_simples VARCHAR(1),
    data_opcao_simples DATE,
    data_exclusao_simples DATE,
    opcao_mei VARCHAR(1),
    data_opcao_mei DATE,
    data_exclusao_mei DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabelas de Domínio

-- Países
CREATE TABLE IF NOT EXISTS cnpj_paises (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(3) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Municípios
CREATE TABLE IF NOT EXISTS cnpj_municipios (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(4) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Qualificações de Sócios
CREATE TABLE IF NOT EXISTS cnpj_qualificacoes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(2) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Naturezas Jurídicas
CREATE TABLE IF NOT EXISTS cnpj_naturezas_juridicas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(4) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CNAEs (Classificação Nacional de Atividades Econômicas)
CREATE TABLE IF NOT EXISTS cnpj_cnaes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(7) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cnpj_empresas_cnpj_basico ON cnpj_empresas(cnpj_basico);
CREATE INDEX IF NOT EXISTS idx_cnpj_estabelecimentos_cnpj_basico ON cnpj_estabelecimentos(cnpj_basico);
CREATE INDEX IF NOT EXISTS idx_cnpj_estabelecimentos_cnpj_completo ON cnpj_estabelecimentos(cnpj_basico, cnpj_ordem, cnpj_dv);
CREATE INDEX IF NOT EXISTS idx_cnpj_socios_cnpj_basico ON cnpj_socios(cnpj_basico);
CREATE INDEX IF NOT EXISTS idx_cnpj_simples_cnpj_basico ON cnpj_simples(cnpj_basico);
CREATE INDEX IF NOT EXISTS idx_cnpj_estabelecimentos_situacao ON cnpj_estabelecimentos(situacao_cadastral);
CREATE INDEX IF NOT EXISTS idx_cnpj_estabelecimentos_uf ON cnpj_estabelecimentos(uf);
CREATE INDEX IF NOT EXISTS idx_cnpj_estabelecimentos_cnae ON cnpj_estabelecimentos(cnae_fiscal_principal);

-- Comentários das tabelas
COMMENT ON TABLE cnpj_empresas IS 'Dados das empresas conforme dicionário oficial da Receita Federal';
COMMENT ON TABLE cnpj_estabelecimentos IS 'Dados dos estabelecimentos conforme dicionário oficial da Receita Federal';
COMMENT ON TABLE cnpj_socios IS 'Dados dos sócios conforme dicionário oficial da Receita Federal';
COMMENT ON TABLE cnpj_simples IS 'Dados do Simples Nacional conforme dicionário oficial da Receita Federal';
COMMENT ON TABLE cnpj_paises IS 'Tabela de domínio - Países';
COMMENT ON TABLE cnpj_municipios IS 'Tabela de domínio - Municípios';
COMMENT ON TABLE cnpj_qualificacoes IS 'Tabela de domínio - Qualificações de Sócios';
COMMENT ON TABLE cnpj_naturezas_juridicas IS 'Tabela de domínio - Naturezas Jurídicas';
COMMENT ON TABLE cnpj_cnaes IS 'Tabela de domínio - CNAEs (Classificação Nacional de Atividades Econômicas)'; 