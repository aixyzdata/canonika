-- CNPJ Database Schema based on official Receita Federal data dictionary
-- https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf

-- Companies table
CREATE TABLE IF NOT EXISTS cnpj_companies (
    id SERIAL PRIMARY KEY,
    cnpj_base VARCHAR(8) NOT NULL UNIQUE,
    company_name TEXT,
    legal_nature VARCHAR(4),
    responsible_qualification VARCHAR(2),
    capital_social DECIMAL(15,2),
    company_size VARCHAR(2),
    responsible_federative_entity TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Establishments table
CREATE TABLE IF NOT EXISTS cnpj_establishments (
    id SERIAL PRIMARY KEY,
    cnpj_base VARCHAR(8) NOT NULL,
    cnpj_order VARCHAR(4) NOT NULL,
    cnpj_dv VARCHAR(2) NOT NULL,
    matrix_branch_identifier VARCHAR(1),
    trade_name TEXT,
    registration_status VARCHAR(2),
    registration_status_date DATE,
    registration_status_reason VARCHAR(2),
    foreign_city_name TEXT,
    country VARCHAR(3),
    activity_start_date DATE,
    main_fiscal_cnae VARCHAR(7),
    secondary_fiscal_cnae TEXT,
    street_type VARCHAR(20),
    street TEXT,
    number VARCHAR(10),
    complement TEXT,
    neighborhood VARCHAR(50),
    zip_code VARCHAR(8),
    state VARCHAR(2),
    city VARCHAR(4),
    phone1_ddd VARCHAR(2),
    phone1 VARCHAR(9),
    phone2_ddd VARCHAR(2),
    phone2 VARCHAR(9),
    fax_ddd VARCHAR(2),
    fax VARCHAR(9),
    email TEXT,
    special_status VARCHAR(2),
    special_status_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(cnpj_base, cnpj_order, cnpj_dv)
);

-- Partners table
CREATE TABLE IF NOT EXISTS cnpj_partners (
    id SERIAL PRIMARY KEY,
    cnpj_base VARCHAR(8) NOT NULL,
    partner_identifier VARCHAR(1) NOT NULL,
    partner_name TEXT NOT NULL,
    partner_cnpj_cpf VARCHAR(14),
    partner_qualification VARCHAR(2),
    partnership_entry_date DATE,
    country VARCHAR(3),
    legal_representative VARCHAR(11),
    representative_name TEXT,
    legal_representative_qualification VARCHAR(2),
    age_range VARCHAR(1),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(cnpj_base, partner_identifier, partner_name)
);

-- Simples Nacional table
CREATE TABLE IF NOT EXISTS cnpj_simples (
    id SERIAL PRIMARY KEY,
    cnpj_base VARCHAR(8) NOT NULL UNIQUE,
    simples_option VARCHAR(1),
    simples_option_date DATE,
    simples_exclusion_date DATE,
    mei_option VARCHAR(1),
    mei_option_date DATE,
    mei_exclusion_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Domain tables

-- Countries
CREATE TABLE IF NOT EXISTS cnpj_countries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cities
CREATE TABLE IF NOT EXISTS cnpj_cities (
    id SERIAL PRIMARY KEY,
    code VARCHAR(4) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Partner qualifications
CREATE TABLE IF NOT EXISTS cnpj_qualifications (
    id SERIAL PRIMARY KEY,
    code VARCHAR(2) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Legal natures
CREATE TABLE IF NOT EXISTS cnpj_legal_natures (
    id SERIAL PRIMARY KEY,
    code VARCHAR(4) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CNAEs (National Classification of Economic Activities)
CREATE TABLE IF NOT EXISTS cnpj_cnaes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(7) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- File control table for CNPJ synchronization
CREATE TABLE IF NOT EXISTS cnpj_file_control (
    id SERIAL PRIMARY KEY,
                    folder VARCHAR(10) NOT NULL,
    filename VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    last_modified TIMESTAMP,
                    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    download_date TIMESTAMP,
    import_date TIMESTAMP,
    local_path TEXT,
    download_attempts INTEGER DEFAULT 0,
    import_attempts INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(folder, filename)
);

-- Performance indexes (criados após as tabelas)
-- CREATE INDEX IF NOT EXISTS idx_cnpj_companies_cnpj_base ON cnpj_companies(cnpj_base);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_establishments_cnpj_base ON cnpj_establishments(cnpj_base);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_establishments_cnpj_complete ON cnpj_establishments(cnpj_base, cnpj_order, cnpj_dv);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_partners_cnpj_base ON cnpj_partners(cnpj_base);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_simples_cnpj_base ON cnpj_simples(cnpj_base);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_establishments_status ON cnpj_establishments(registration_status);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_establishments_state ON cnpj_establishments(state);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_establishments_cnae ON cnpj_establishments(main_fiscal_cnae);

-- File control indexes (criados após as tabelas)
-- CREATE INDEX IF NOT EXISTS idx_cnpj_file_control_folder ON cnpj_file_control(folder);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_file_control_status ON cnpj_file_control(status);
-- CREATE INDEX IF NOT EXISTS idx_cnpj_file_control_last_modified ON cnpj_file_control(last_modified);

-- Table comments (executados após as tabelas)
-- COMMENT ON TABLE cnpj_companies IS 'Company data according to official Receita Federal dictionary';
-- COMMENT ON TABLE cnpj_establishments IS 'Establishment data according to official Receita Federal dictionary';
-- COMMENT ON TABLE cnpj_partners IS 'Partner data according to official Receita Federal dictionary';
-- COMMENT ON TABLE cnpj_simples IS 'Simples Nacional data according to official Receita Federal dictionary';
-- COMMENT ON TABLE cnpj_countries IS 'Domain table - Countries';
-- COMMENT ON TABLE cnpj_cities IS 'Domain table - Cities';
-- COMMENT ON TABLE cnpj_qualifications IS 'Domain table - Partner Qualifications';
-- COMMENT ON TABLE cnpj_legal_natures IS 'Domain table - Legal Natures';
-- COMMENT ON TABLE cnpj_cnaes IS 'Domain table - CNAEs (National Classification of Economic Activities)';
-- COMMENT ON TABLE cnpj_file_control IS 'Control of downloaded and processed CNPJ files'; 