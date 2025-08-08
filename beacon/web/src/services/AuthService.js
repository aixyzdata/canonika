/**
 * Serviço de Autenticação Centralizado
 * Gerencia autenticação JWT e cookies entre todos os serviços
 */

// AuthService para o Beacon
class AuthService {
  constructor() {
    this.tokenKey = 'canonika_access_token'
    this.userKey = 'canonika_user'
  }

  // Verificar se o token é válido
  async checkAndRefreshToken() {
    const token = this.getToken()
    if (!token) {
      return false
    }

    try {
      // Simular verificação de token
      const payload = this.decodeToken(token)
      const now = Date.now() / 1000
      
      if (payload.exp && payload.exp < now) {
        this.logout()
        return false
      }
      
      return true
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      this.logout()
      return false
    }
  }

  // Obter token do localStorage
  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  // Obter usuário atual
  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey)
    return userStr ? JSON.parse(userStr) : null
  }

  // Decodificar token JWT
  decodeToken(token) {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) throw new Error('Token inválido')
      
      const payload = JSON.parse(atob(parts[1]))
      return payload
    } catch (error) {
      throw new Error('Token inválido')
    }
  }

  // Logout
  logout() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    console.log('Logout realizado')
  }

  // Processar token da URL
  processTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('auth_token')
    
    if (token) {
      try {
        const payload = this.decodeToken(token)
        
        const user = {
          id: payload.id || 'demo-001',
          name: payload.name || 'Usuário Demo',
          email: payload.email || 'demo@canonika.io',
          roles: payload.roles || ['admin'],
          permissions: payload.permissions || []
        }
        
        localStorage.setItem(this.tokenKey, token)
        localStorage.setItem(this.userKey, JSON.stringify(user))
        
        // Limpar URL
        const newUrl = window.location.pathname
        window.history.replaceState({}, document.title, newUrl)
        
        console.log('Token processado com sucesso')
        return user
      } catch (error) {
        console.error('Erro ao processar token:', error)
        return null
      }
    }
    
    return null
  }
}

export default new AuthService() 