-- Script de inicialização do banco de dados Canonika
-- Executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar schema para logs de auditoria
CREATE SCHEMA IF NOT EXISTS audit;

-- Tabela de usuários do sistema
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sessões
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit.logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit.logs(created_at);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (username, email, full_name) 
VALUES ('admin', 'admin@canonika.com', 'Administrador do Sistema')
ON CONFLICT (username) DO NOTHING;

-- Comentários sobre as tabelas
COMMENT ON TABLE users IS 'Tabela de usuários do sistema Canonika';
COMMENT ON TABLE sessions IS 'Tabela de sessões ativas dos usuários';
COMMENT ON TABLE audit.logs IS 'Tabela de logs de auditoria do sistema';
COMMENT ON COLUMN users.id IS 'Identificador único do usuário';
COMMENT ON COLUMN users.username IS 'Nome de usuário único';
COMMENT ON COLUMN users.email IS 'Email único do usuário';
COMMENT ON COLUMN users.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN users.is_active IS 'Indica se o usuário está ativo';
COMMENT ON COLUMN sessions.session_token IS 'Token único da sessão';
COMMENT ON COLUMN sessions.expires_at IS 'Data de expiração da sessão';
COMMENT ON COLUMN audit.logs.action IS 'Ação realizada (CREATE, UPDATE, DELETE, LOGIN, etc.)';
COMMENT ON COLUMN audit.logs.resource_type IS 'Tipo do recurso afetado';
COMMENT ON COLUMN audit.logs.resource_id IS 'ID do recurso afetado';
COMMENT ON COLUMN audit.logs.details IS 'Detalhes adicionais em formato JSON'; 