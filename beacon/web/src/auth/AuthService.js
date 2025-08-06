class BeaconAuthService {
  constructor() {
    this.quarterUrl = 'http://localhost:3700';
    this.tokenKey = 'beacon_access_token';
    this.refreshTokenKey = 'beacon_refresh_token';
  }

  // Verificar se usuário está autenticado
  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const payload = this.decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      
      return payload.exp > now;
    } catch (error) {
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

  // Decodificar token
  decodeToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Token inválido');
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  // Obter informações do usuário
  getUserInfo() {
    const token = this.getAccessToken();
    if (!token) return null;
    
    try {
      return this.decodeToken(token);
    } catch (error) {
      return null;
    }
  }

  // Processar token da URL (quando retorna do Quarter)
  processAuthToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('auth_token');
    
    if (token) {
      console.log('🔑 Token recebido do Quarter');
      
      // Salvar token
      localStorage.setItem(this.tokenKey, token);
      
      // Limpar URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      return true;
    }
    
    return false;
  }

  // Redirecionar para Quarter para login
  redirectToQuarter() {
    const currentUrl = encodeURIComponent(window.location.href);
    const quarterUrl = `${this.quarterUrl}?return_url=${currentUrl}&service=beacon`;
    
    console.log('🔄 Redirecionando para Quarter:', quarterUrl);
    
    // Forçar redirecionamento
    setTimeout(() => {
      window.location.href = quarterUrl;
    }, 100);
  }
  
  // Redirecionar para Quarter para logout
  redirectToQuarterForLogout() {
    const quarterUrl = `${this.quarterUrl}?logout=true`;
    
    console.log('🚪 Redirecionando para Quarter para logout:', quarterUrl);
    
    // Forçar redirecionamento
    setTimeout(() => {
      window.location.href = quarterUrl;
    }, 100);
  }

  // Fazer logout
  logout() {
    console.log('🚪 Iniciando logout...');
    
    // Limpar localStorage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    
    // Limpar cookies
    document.cookie = `${this.tokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${this.refreshTokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    console.log('🧹 Tokens limpos, redirecionando para Quarter...');
    
    // Redirecionar imediatamente para Quarter
    console.log('🔄 Redirecionando para:', this.quarterUrl);
    window.location.href = this.quarterUrl;
  }

  // Verificar e renovar token se necessário
  async checkAndRefreshToken() {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const payload = this.decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      
      // Se token expira em menos de 1 hora, renovar
      if (payload.exp - now < 3600) {
        console.log('🔄 Token expirando, renovando...');
        return await this.refreshToken();
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  // Renovar token
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    
    try {
      const payload = this.decodeToken(refreshToken);
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp <= now) {
        this.logout();
        return false;
      }
      
      // Em produção, faria uma chamada para o Quarter para renovar
      // Por enquanto, vamos simular uma renovação
      const newAccessToken = this.generateJWT({
        id: payload.id,
        name: payload.name,
        email: payload.email,
        roles: payload.roles,
        permissions: payload.permissions
      });
      
      localStorage.setItem(this.tokenKey, newAccessToken);
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Gerar JWT Token (simulação)
  generateJWT(payload) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + (60 * 60 * 24), // 24 horas
      iss: 'quarter.canonika.io',
      aud: 'canonika-ecosystem'
    };
    
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(tokenPayload));
    
    return `${encodedHeader}.${encodedPayload}.signature`;
  }

  // Obter cookie
  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Verificar permissões
  hasPermission(permission) {
    const user = this.getUserInfo();
    if (!user) return false;
    
    return user.permissions && user.permissions.includes(permission);
  }

  // Verificar roles
  hasRole(role) {
    const user = this.getUserInfo();
    if (!user) return false;
    
    return user.roles && user.roles.includes(role);
  }
}

export default new BeaconAuthService(); 