package canonika

import future.keywords.if
import future.keywords.in

# Política principal de autorização
default allow = false

# Permitir acesso se o usuário tem a role necessária
allow if {
    # Verificar se o usuário está autenticado
    input.user.authenticated == true
    
    # Verificar se o usuário tem a role necessária para o recurso
    has_required_role(input.user.roles, input.resource.required_roles)
    
    # Verificar se o usuário tem permissão para a ação
    has_permission(input.user.permissions, input.action)
    
    # Verificar se o recurso está acessível para o usuário
    is_resource_accessible(input.user, input.resource)
}

# Verificar se o usuário tem a role necessária
has_required_role(user_roles, required_roles) if {
    some role in required_roles
    role in user_roles
}

# Verificar se o usuário tem permissão para a ação
has_permission(user_permissions, action) if {
    action in user_permissions
}

# Verificar se o recurso está acessível para o usuário
is_resource_accessible(user, resource) if {
    # Recursos públicos são sempre acessíveis
    resource.public == true
}

is_resource_accessible(user, resource) if {
    # Recursos privados só para usuários autenticados
    user.authenticated == true
    
    # Verificar se o usuário é o proprietário do recurso
    resource.owner_id == user.id
}

is_resource_accessible(user, resource) if {
    # Recursos compartilhados com usuários específicos
    user.authenticated == true
    user.id in resource.shared_with
}

# Políticas específicas por serviço

# Quarter - Autenticação
quarter_login_allow if {
    input.service == "quarter"
    input.action == "login"
    input.user.authenticated == false  # Login só para usuários não autenticados
}

quarter_logout_allow if {
    input.service == "quarter"
    input.action == "logout"
    input.user.authenticated == true
}

# Harbor - Dashboard
harbor_access_allow if {
    input.service == "harbor"
    input.action == "access"
    input.user.authenticated == true
    has_role(input.user.roles, "dashboard_user")
}

# Fisher - Dados
fisher_read_allow if {
    input.service == "fisher"
    input.action == "read"
    input.user.authenticated == true
    has_role(input.user.roles, "data_viewer")
}

fisher_write_allow if {
    input.service == "fisher"
    input.action == "write"
    input.user.authenticated == true
    has_role(input.user.roles, "data_editor")
}

# Ledger - Financeiro
ledger_read_allow if {
    input.service == "ledger"
    input.action == "read"
    input.user.authenticated == true
    has_role(input.user.roles, "financial_viewer")
}

ledger_write_allow if {
    input.service == "ledger"
    input.action == "write"
    input.user.authenticated == true
    has_role(input.user.roles, "financial_editor")
}

# Guardian - Segurança
guardian_admin_allow if {
    input.service == "guardian"
    input.action == "admin"
    input.user.authenticated == true
    has_role(input.user.roles, "security_admin")
}

# Echo - Comunicação
echo_send_allow if {
    input.service == "echo"
    input.action == "send"
    input.user.authenticated == true
    has_role(input.user.roles, "communicator")
}

# Diver - Exploração
diver_explore_allow if {
    input.service == "diver"
    input.action == "explore"
    input.user.authenticated == true
    has_role(input.user.roles, "explorer")
}

# Dock - Porto
dock_access_allow if {
    input.service == "dock"
    input.action == "access"
    input.user.authenticated == true
    has_role(input.user.roles, "port_user")
}

# Mapmaker - Mapeamento
mapmaker_create_allow if {
    input.service == "mapmaker"
    input.action == "create"
    input.user.authenticated == true
    has_role(input.user.roles, "mapper")
}

# Seagull - Monitoramento
seagull_monitor_allow if {
    input.service == "seagull"
    input.action == "monitor"
    input.user.authenticated == true
    has_role(input.user.roles, "monitor")
}

# Skipper - Navegação rápida
skipper_navigate_allow if {
    input.service == "skipper"
    input.action == "navigate"
    input.user.authenticated == true
    has_role(input.user.roles, "navigator")
}

# Tollgate - Controle de acesso
tollgate_control_allow if {
    input.service == "tollgate"
    input.action == "control"
    input.user.authenticated == true
    has_role(input.user.roles, "gatekeeper")
}

# Wayfinder - Descoberta
wayfinder_discover_allow if {
    input.service == "wayfinder"
    input.action == "discover"
    input.user.authenticated == true
    has_role(input.user.roles, "discoverer")
}

# Função auxiliar para verificar roles
has_role(user_roles, required_role) if {
    required_role in user_roles
}

# Políticas de auditoria
audit_log_required if {
    input.action in ["write", "delete", "admin", "control"]
}

# Políticas de rate limiting
rate_limit_exceeded if {
    input.user.request_count > input.limits.max_requests_per_minute
}

# Políticas de horário de acesso
business_hours_only if {
    input.time.hour >= 8
    input.time.hour <= 18
    input.time.weekday in ["monday", "tuesday", "wednesday", "thursday", "friday"]
}

# Políticas de localização
location_allowed if {
    input.user.location in input.allowed_locations
}

# Políticas de dispositivo
device_allowed if {
    input.user.device_type in input.allowed_devices
}

# Políticas de força da senha
password_strength_ok if {
    input.password.length >= 8
    input.password.has_uppercase == true
    input.password.has_lowercase == true
    input.password.has_number == true
    input.password.has_special == true
}

# Políticas de sessão
session_valid if {
    input.session.created_at + input.session.timeout > input.current_time
    input.session.active == true
}

# Políticas de IP
ip_allowed if {
    input.user.ip in input.allowed_ips
}

# Políticas de MFA
mfa_required if {
    input.action in ["admin", "financial_write", "security_admin"]
    input.user.mfa_enabled == true
    input.user.mfa_verified == true
}

# Políticas de dados sensíveis
sensitive_data_access if {
    input.user.clearance_level >= input.resource.sensitivity_level
    input.user.need_to_know == true
}

# Políticas de conformidade
compliance_ok if {
    input.user.compliance_training_completed == true
    input.user.compliance_training_expiry > input.current_time
}

# Políticas de backup e recuperação
backup_allowed if {
    input.user.authenticated == true
    has_role(input.user.roles, "backup_admin")
    input.action == "backup"
}

# Políticas de desenvolvimento
dev_access if {
    input.environment == "development"
    has_role(input.user.roles, "developer")
}

# Políticas de produção
prod_access if {
    input.environment == "production"
    has_role(input.user.roles, "production_admin")
    input.user.production_certified == true
} 