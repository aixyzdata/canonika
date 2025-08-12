// BeaconAuthService - Mock para demonstração
class BeaconAuthService {
  constructor() {
    this.isAuthenticatedValue = true; // Sempre autenticado para demonstração
    this.userInfo = {
      id: 'admin-001',
      name: 'Administrador Beacon',
      email: 'admin@canonika.io',
      roles: ['canonika_admin']
    };
  }

  // Verificar se está autenticado
  isAuthenticated() {
    return this.isAuthenticatedValue;
  }

  // Obter informações do usuário
  getUserInfo() {
    return this.userInfo;
  }

  // Processar token de autenticação
  processAuthToken() {
    console.log('🔐 Processando token de autenticação...');
    // Mock - sempre retorna sucesso
    return true;
  }

  // Redirecionar para Quarter
  redirectToQuarter() {
    console.log('🔄 Redirecionando para Quarter...');
    // Mock - não redireciona na demonstração
    return false;
  }

  // Fazer logout
  logout() {
    console.log('🚪 Logout solicitado...');
    // Mock - não faz logout na demonstração
    return false;
  }
}

// Exportar instância singleton
export default new BeaconAuthService(); 