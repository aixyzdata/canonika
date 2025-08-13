/**
 * Serviço de Autenticação Centralizado para Fisher
 * Gerencia autenticação JWT e cookies entre todos os serviços
 */

class AuthService {
  constructor() {
    this.tokenKey = 'canonika_token'
    this.refreshKey = 'canonika_refresh'
    this.authKey = 'canonika_authenticated'
    this.userKey = 'canonika_user'
  }

  // Verificar se o usuário está autenticado
  isAuthenticated() {
    // Verificar JWT token
    const token = this.getCookie(this.tokenKey)
    if (!token) {
      console.log('🔍 Token não encontrado')
      return false
    }

    // Verificar se o token é válido
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp < now) {
        console.log('🔍 Token expirado')
        return false
      }
    } catch (e) {
      console.log('🔍 Token inválido')
      return false
    }

    // Verificar cookie de autenticação
    const authCookie = this.getCookie(this.authKey)
    if (!authCookie) {
      console.log('🔍 Cookie de autenticação não encontrado')
      return false
    }

    // Verificar localStorage
    const authLocal = localStorage.getItem(this.authKey)
    if (!authLocal) {
      console.log('🔍 LocalStorage de autenticação não encontrado')
      return false
    }

    console.log('✅ Usuário autenticado')
    return true
  }

  // Verificar e renovar token se necessário
  async checkAndRefreshToken() {
    if (!this.isAuthenticated()) {
      return false
    }

    const refreshToken = this.getCookie(this.refreshKey)
    if (!refreshToken) {
      console.log('🔍 Refresh token não encontrado')
      return false
    }

    try {
      const payload = JSON.parse(atob(refreshToken))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp < now) {
        console.log('🔍 Refresh token expirado')
        this.logout()
        return false
      }

      console.log('✅ Token válido')
      return true
    } catch (e) {
      console.log('🔍 Refresh token inválido')
      return false
    }
  }

  // Obter usuário atual
  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        console.log('🔍 Erro ao parsear usuário')
        return null
      }
    }
    return null
  }

  // Redirecionar para Quarter
  redirectToQuarter() {
    const currentUrl = window.location.href
    const redirectUrl = encodeURIComponent(currentUrl)
    console.log('🔄 Redirecionando para Quarter:', `http://localhost:3700?redirect_to=${redirectUrl}`)
    window.location.href = `http://localhost:3700?redirect_to=${redirectUrl}`
  }

  // Logout
  logout() {
    console.log('🚪 Iniciando logout...');
    
    // Limpar cookies
    this.deleteCookie(this.tokenKey)
    this.deleteCookie(this.refreshKey)
    this.deleteCookie(this.authKey)
    
    // Limpar localStorage
    localStorage.removeItem(this.authKey)
    localStorage.removeItem(this.userKey)
    
    // Redirecionar para Quarter com logout e return_url (URL limpa)
    const baseUrl = window.location.origin + window.location.pathname;
    const returnUrl = encodeURIComponent(baseUrl);
    const quarterUrl = `http://localhost:3700?logout=1&return_url=${returnUrl}&service=fisher`;
    
    console.log('🔄 Redirecionando para Quarter (URL limpa):', quarterUrl);
    
    // Forçar redirecionamento
    window.location.replace(quarterUrl);
  }

  // Renovar token
  async refreshToken() {
    const refreshToken = this.getCookie(this.refreshKey)
    if (!refreshToken) {
      return false
    }

    try {
      const payload = JSON.parse(atob(refreshToken))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp < now) {
        this.logout()
        return false
      }

      // Em produção, faria uma chamada para renovar o token
      // Por enquanto, apenas retorna true se o refresh token é válido
      return true
    } catch (e) {
      return false
    }
  }

  // Utilitários para cookies
  getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }

  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }
}

export default new AuthService() 