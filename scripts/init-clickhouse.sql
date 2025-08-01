-- Script de inicialização do ClickHouse para Canonika
-- Executado automaticamente quando o container ClickHouse é criado

-- Criar banco de dados para logs
CREATE DATABASE IF NOT EXISTS canonika_logs;

-- Usar o banco de dados
USE canonika_logs;

-- Tabela de logs de aplicação
CREATE TABLE IF NOT EXISTS application_logs (
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now(),
    level Enum8('TRACE' = 1, 'DEBUG' = 2, 'INFO' = 3, 'WARN' = 4, 'ERROR' = 5, 'FATAL' = 6),
    service String,
    message String,
    user_id UUID,
    session_id String,
    ip_address IPv4,
    user_agent String,
    request_id String,
    duration_ms UInt32,
    status_code UInt16,
    method String,
    path String,
    query_params String,
    request_body String,
    response_body String,
    error_details String,
    metadata JSON
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, service, level)
TTL timestamp + INTERVAL 1 YEAR;

-- Tabela de métricas de performance
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now(),
    service String,
    metric_name String,
    metric_value Float64,
    metric_unit String,
    tags Map(String, String),
    user_id UUID,
    session_id String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, service, metric_name)
TTL timestamp + INTERVAL 6 MONTH;

-- Tabela de eventos de segurança
CREATE TABLE IF NOT EXISTS security_events (
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now(),
    event_type Enum8('LOGIN' = 1, 'LOGOUT' = 2, 'AUTH_FAILURE' = 3, 'PERMISSION_DENIED' = 4, 'SUSPICIOUS_ACTIVITY' = 5, 'PASSWORD_CHANGE' = 6, 'ACCOUNT_LOCKED' = 7),
    user_id UUID,
    username String,
    ip_address IPv4,
    user_agent String,
    session_id String,
    details String,
    severity Enum8('LOW' = 1, 'MEDIUM' = 2, 'HIGH' = 3, 'CRITICAL' = 4),
    source_service String,
    target_resource String,
    success Boolean,
    metadata JSON
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, event_type, severity)
TTL timestamp + INTERVAL 2 YEAR;

-- Tabela de auditoria de dados
CREATE TABLE IF NOT EXISTS data_audit (
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now(),
    action Enum8('CREATE' = 1, 'READ' = 2, 'UPDATE' = 3, 'DELETE' = 4, 'EXPORT' = 5, 'IMPORT' = 6),
    table_name String,
    record_id String,
    user_id UUID,
    username String,
    old_values JSON,
    new_values JSON,
    ip_address IPv4,
    session_id String,
    service String,
    transaction_id String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, table_name, action)
TTL timestamp + INTERVAL 3 YEAR;

-- Tabela de logs de API
CREATE TABLE IF NOT EXISTS api_logs (
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now(),
    service String,
    endpoint String,
    method String,
    status_code UInt16,
    response_time_ms UInt32,
    request_size_bytes UInt32,
    response_size_bytes UInt32,
    user_id UUID,
    ip_address IPv4,
    user_agent String,
    request_id String,
    error_message String,
    query_params String,
    request_headers JSON,
    response_headers JSON
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, service, endpoint, status_code)
TTL timestamp + INTERVAL 1 YEAR;

-- Tabela de métricas de negócio
CREATE TABLE IF NOT EXISTS business_metrics (
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now(),
    metric_name String,
    metric_value Float64,
    metric_unit String,
    category String,
    subcategory String,
    user_id UUID,
    service String,
    tags Map(String, String),
    period String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, metric_name, category)
TTL timestamp + INTERVAL 1 YEAR;

-- Criar views materializadas para consultas frequentes

-- View para logs de erro dos últimos 7 dias
CREATE MATERIALIZED VIEW IF NOT EXISTS recent_errors
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, service)
TTL timestamp + INTERVAL 7 DAY
AS SELECT
    timestamp,
    service,
    message,
    user_id,
    ip_address,
    error_details
FROM application_logs
WHERE level >= 4; -- WARN, ERROR, FATAL

-- View para métricas de performance por hora
CREATE MATERIALIZED VIEW IF NOT EXISTS hourly_performance
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, service, metric_name)
TTL timestamp + INTERVAL 30 DAY
AS SELECT
    toStartOfHour(timestamp) as hour,
    service,
    metric_name,
    avg(metric_value) as avg_value,
    min(metric_value) as min_value,
    max(metric_value) as max_value,
    count() as sample_count
FROM performance_metrics
GROUP BY hour, service, metric_name;

-- View para eventos de segurança críticos
CREATE MATERIALIZED VIEW IF NOT EXISTS critical_security_events
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, event_type, severity)
TTL timestamp + INTERVAL 90 DAY
AS SELECT
    timestamp,
    event_type,
    username,
    ip_address,
    severity,
    details,
    source_service
FROM security_events
WHERE severity >= 3; -- HIGH, CRITICAL

-- Inserir dados de exemplo para teste
INSERT INTO application_logs (level, service, message, user_id, ip_address, user_agent, status_code, method, path)
VALUES 
    ('INFO', 'quarter', 'Sistema Canonika inicializado com sucesso', NULL, '127.0.0.1', 'Canonika/1.0', 200, 'GET', '/health'),
    ('INFO', 'harbor', 'Dashboard principal carregado', NULL, '127.0.0.1', 'Canonika/1.0', 200, 'GET', '/'),
    ('INFO', 'keycloak', 'Identity Provider configurado', NULL, '127.0.0.1', 'Canonika/1.0', 200, 'POST', '/auth');

INSERT INTO performance_metrics (service, metric_name, metric_value, metric_unit, tags)
VALUES 
    ('quarter', 'response_time', 45.2, 'ms', {'endpoint': '/api/health'}),
    ('harbor', 'response_time', 32.1, 'ms', {'endpoint': '/api/dashboard'}),
    ('keycloak', 'response_time', 78.5, 'ms', {'endpoint': '/auth/login'});

INSERT INTO security_events (event_type, username, ip_address, severity, details, source_service)
VALUES 
    ('LOGIN', 'admin', '127.0.0.1', 1, 'Login bem-sucedido via Keycloak', 'quarter'),
    ('LOGIN', 'admin', '127.0.0.1', 1, 'Sessão iniciada no Harbor', 'harbor');

-- Comentários sobre as tabelas
-- As tabelas do ClickHouse são otimizadas para consultas analíticas e logs de alta performance
-- Todas as tabelas usam MergeTree engine para melhor performance em inserções e consultas
-- TTL (Time To Live) é configurado para limpeza automática de dados antigos
-- Índices são criados automaticamente baseados na ORDER BY clause 