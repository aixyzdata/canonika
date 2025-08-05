class BeaconAuthService {
  constructor() {
    this.quarterUrl = 'http://localhost:3700';
    this.tokenKey = 'beacon_access_token';
    this.refreshTokenKey = 'beacon_refresh_token';
  }

  // Verificar se está autenticado
  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return false;
    }
  }

  // Obter token de acesso
  getAccessToken() {
    return localStorage.getItem(this.tokenKey) || this.getCookie(this.tokenKey);
  }

  // Obter token de refresh
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey) || this.getCookie(this.refreshTokenKey);
  }

  // Decodificar token JWT
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Obter informações do usuário
  getUserInfo() {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const decoded = this.decodeToken(token);
    return decoded ? {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      roles: decoded.roles || [],
      permissions: decoded.permissions || []
    } : null;
  }

  // Processar token de autenticação da URL
  processAuthToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth_token');
    
    if (authToken) {
      console.log('🔐 Processando token de autenticação do Beacon...');
      
      try {
        // Decodificar token para verificar validade
        const decoded = this.decodeToken(authToken);
        if (decoded && decoded.exp > Date.now() / 1000) {
          // Salvar tokens
          localStorage.setItem(this.tokenKey, authToken);
          
          // Gerar refresh token (simulado)
          const refreshToken = this.generateJWT({
            ...decoded,
            type: 'refresh',
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 dias
          });
          localStorage.setItem(this.refreshTokenKey, refreshToken);
          
          // Limpar URL
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          console.log('✅ Token de autenticação processado com sucesso');
          return true;
        } else {
          console.log('❌ Token expirado ou inválido');
          return false;
        }
      } catch (error) {
        console.error('❌ Erro ao processar token:', error);
        return false;
      }
    }
    
    return false;
  }

  // Redirecionar para Quarter
  redirectToQuarter() {
    const currentUrl = encodeURIComponent(window.location.href);
    const quarterUrl = `${this.quarterUrl}?return_url=${currentUrl}&service=beacon`;
    window.location.href = quarterUrl;
  }

  // Fazer logout
  logout() {
    console.log('🚪 Iniciando logout no Beacon...');
    
    // Limpar tokens
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    
    // Limpar cookies
    document.cookie = `${this.tokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${this.refreshTokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    // Redirecionar para Quarter
    window.location.href = `${this.quarterUrl}?logout=1`;
  }

  // Verificar e renovar token
  async checkAndRefreshToken() {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      const now = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - now;
      
      // Se o token expira em menos de 5 minutos, renovar
      if (timeUntilExpiry < 300) {
        return await this.refreshToken();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }

  // Renovar token
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    
    try {
      // Simular renovação de token
      const decoded = this.decodeToken(refreshToken);
      const newToken = this.generateJWT({
        ...decoded,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
      });
      
      localStorage.setItem(this.tokenKey, newToken);
      console.log('✅ Token renovado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao renovar token:', error);
      return false;
    }
  }

  // Gerar JWT (simulado)
  generateJWT(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = 'signature'; // Simulado
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  // Obter cookie
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Verificar permissão
  hasPermission(permission) {
    const userInfo = this.getUserInfo();
    return userInfo && userInfo.permissions && userInfo.permissions.includes(permission);
  }

  // Verificar role
  hasRole(role) {
    const userInfo = this.getUserInfo();
    return userInfo && userInfo.roles && userInfo.roles.includes(role);
  }
}

export default new BeaconAuthService(); 