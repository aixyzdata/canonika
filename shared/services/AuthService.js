/**
 * Serviço de Autenticação Centralizado
 * Gerencia autenticação JWT e cookies entre todos os serviços
 */

class AuthService {
  constructor() {
    this.tokenKey = 'canonika_token';
    this.refreshKey = 'canonika_refresh';
    this.authKey = 'canonika_authenticated';
    this.userKey = 'canonika_user';
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    // Verificar JWT token primeiro
    const token = this.getCookie(this.tokenKey);
    if (token && this.isValidToken(token)) {
      return true;
    }

    // Fallback para localStorage
    const isAuth = localStorage.getItem(this.authKey);
    return isAuth === 'true';
  }

  /**
   * Obtém dados do usuário autenticado
   * @returns {Object|null}
   */
  getCurrentUser() {
    // Tentar obter do JWT primeiro
    const token = this.getCookie(this.tokenKey);
    if (token && this.isValidToken(token)) {
      try {
        const payload = JSON.parse(atob(token));
        return {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          roles: payload.roles
        };
      } catch (e) {
        console.warn('Erro ao decodificar JWT:', e);
      }
    }

    // Fallback para localStorage
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.warn('Erro ao parsear usuário:', e);
      }
    }

    return null;
  }

  /**
   * Valida se o token JWT é válido
   * @param {string} token
   * @returns {boolean}
   */
  isValidToken(token) {
    try {
      const payload = JSON.parse(atob(token));
      const now = Math.floor(Date.now() / 1000);
      
      // Verificar expiração
      if (payload.exp && payload.exp < now) {
        return false;
      }

      // Verificar se tem campos obrigatórios
      return payload.sub && payload.name && payload.email;
    } catch (e) {
      return false;
    }
  }

  /**
   * Renova o token se necessário
   * @returns {Promise<boolean>}
   */
  async refreshToken() {
    const refreshToken = this.getCookie(this.refreshKey);
    if (!refreshToken) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(refreshToken));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < now) {
        this.logout();
        return false;
      }

      // Aqui você faria uma chamada para renovar o token
      // Por enquanto, vamos apenas retornar true se o refresh token é válido
      return true;
    } catch (e) {
      console.warn('Erro ao renovar token:', e);
      return false;
    }
  }

  /**
   * Faz logout do usuário
   */
  logout() {
    // Limpar cookies
    this.deleteCookie(this.tokenKey);
    this.deleteCookie(this.refreshKey);
    
    // Limpar localStorage
    localStorage.removeItem(this.authKey);
    localStorage.removeItem(this.userKey);
    
    // Redirecionar para Quarter com logout e return_url (URL limpa)
    const quarterUrl = 'http://localhost:3700';
    const baseUrl = window.location.origin + window.location.pathname;
    const returnUrl = encodeURIComponent(baseUrl);
    
    // Determinar o serviço baseado na URL atual
    let service = 'template'; // padrão
    if (window.location.hostname === 'localhost') {
      const port = window.location.port;
      if (port === '3701') service = 'harbor';
      else if (port === '3790') service = 'template';
      else if (port === '3799') service = 'beacon';
      // Adicionar outros serviços conforme necessário
    }
    
    const quarterRedirectUrl = `${quarterUrl}?logout=1&return_url=${returnUrl}&service=${service}`;
    
    console.log('🚪 Iniciando logout...');
    console.log('🔄 Redirecionando para Quarter (URL limpa):', quarterRedirectUrl);
    
    // Forçar redirecionamento
    window.location.replace(quarterRedirectUrl);
  }

  /**
   * Obtém um cookie pelo nome
   * @param {string} name
   * @returns {string|null}
   */
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  /**
   * Remove um cookie
   * @param {string} name
   */
  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /**
   * Verifica e renova o token se necessário
   * @returns {Promise<boolean>}
   */
  async checkAndRefreshToken() {
    if (this.isAuthenticated()) {
      return true;
    }

    return await this.refreshToken();
  }
}

// Exportar instância única
export default new AuthService(); 