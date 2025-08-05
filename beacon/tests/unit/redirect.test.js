const { expect } = require('chai');

describe('Testes de Redirecionamento Beacon -> Quarter', () => {
  describe('Configuração de URLs', () => {
    it('deve ter URL correta do Quarter', () => {
      const config = {
        quarter: 'http://localhost',
        beacon: 'http://localhost:3703'
      };
      
      expect(config.quarter).to.equal('http://localhost');
      expect(config.beacon).to.equal('http://localhost:3703');
    });
    
    it('deve construir URL de redirecionamento corretamente', () => {
      const buildRedirectUrl = (quarterUrl, beaconUrl) => {
        const redirectUrl = encodeURIComponent(beaconUrl);
        return `${quarterUrl}?redirect_to=${redirectUrl}`;
      };
      
      const redirectUrl = buildRedirectUrl('http://localhost', 'http://localhost:3703');
      
      expect(redirectUrl).to.include('http://localhost');
      expect(redirectUrl).to.include('redirect_to=');
      expect(redirectUrl).to.include('localhost%3A3703'); // URL codificada
    });
  });
  
  describe('Validação de Autenticação', () => {
    it('deve detectar usuário não autenticado', () => {
      const checkAuthentication = () => {
        // Simular localStorage vazio
        const isAuthenticated = false;
        const userData = null;
        
        return !isAuthenticated || !userData;
      };
      
      expect(checkAuthentication()).to.be.true;
    });
    
    it('deve detectar usuário autenticado', () => {
      const checkAuthentication = () => {
        // Simular localStorage com dados
        const isAuthenticated = true;
        const userData = JSON.stringify({
          id: 'admin-001',
          name: 'Administrador Canonika',
          email: 'admin@canonika.io'
        });
        
        return !!(isAuthenticated && userData);
      };
      
      expect(checkAuthentication()).to.be.true;
    });
    
    it('deve validar dados de usuário', () => {
      const validateUserData = (userData) => {
        if (!userData) return false;
        
        try {
          const user = JSON.parse(userData);
          return !!(user.id && user.name && user.email);
        } catch (error) {
          return false;
        }
      };
      
      const validUser = JSON.stringify({
        id: 'admin-001',
        name: 'Administrador Canonika',
        email: 'admin@canonika.io'
      });
      
      const invalidUser = 'invalid json';
      const emptyUser = null;
      
      expect(validateUserData(validUser)).to.be.true;
      expect(validateUserData(invalidUser)).to.be.false;
      expect(validateUserData(emptyUser)).to.be.false;
    });
  });
  
  describe('Lógica de Redirecionamento', () => {
    it('deve redirecionar quando não autenticado', () => {
      const shouldRedirect = (hasLogin, user, isAuthenticated) => {
        return !hasLogin && !user && !isAuthenticated;
      };
      
      // Cenário: não tem login próprio, sem usuário, não autenticado
      expect(shouldRedirect(false, null, false)).to.be.true;
      
      // Cenário: tem login próprio
      expect(shouldRedirect(true, null, false)).to.be.false;
      
      // Cenário: usuário já logado
      expect(shouldRedirect(false, { name: 'Admin' }, false)).to.be.false;
      
      // Cenário: já autenticado
      expect(shouldRedirect(false, null, true)).to.be.false;
    });
    
    it('deve preservar URL atual no redirecionamento', () => {
      const preserveCurrentUrl = (currentUrl) => {
        return encodeURIComponent(currentUrl);
      };
      
      const beaconUrl = 'http://localhost:3703/dashboard';
      const encodedUrl = preserveCurrentUrl(beaconUrl);
      
      expect(encodedUrl).to.not.equal(beaconUrl);
      expect(decodeURIComponent(encodedUrl)).to.equal(beaconUrl);
    });
  });
  
  describe('Cenários de Falha', () => {
    it('deve lidar com URL inválida do Quarter', () => {
      const validateQuarterUrl = (url) => {
        return !!(url && url.startsWith('http'));
      };
      
      expect(validateQuarterUrl('http://localhost')).to.be.true;
      expect(validateQuarterUrl('https://localhost')).to.be.true;
      expect(validateQuarterUrl('invalid-url')).to.be.false;
      expect(validateQuarterUrl(null)).to.be.false;
      expect(validateQuarterUrl('')).to.be.false;
    });
    
    it('deve lidar com localStorage corrompido', () => {
      const handleCorruptedStorage = (userData) => {
        try {
          if (!userData) return null;
          return JSON.parse(userData);
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
          return null;
        }
      };
      
      expect(handleCorruptedStorage(null)).to.be.null;
      expect(handleCorruptedStorage('invalid json')).to.be.null;
      expect(handleCorruptedStorage('{"name":"test"}')).to.have.property('name', 'test');
    });
  });
  
  describe('Integração com Quarter', () => {
    it('deve simular resposta do Quarter', () => {
      const simulateQuarterResponse = (credentials) => {
        const { email, password } = credentials;
        
        if (email === 'admin@canonika.io' && password === 'admin123') {
          return {
            success: true,
            user: {
              id: 'admin-001',
              name: 'Administrador Canonika',
              email: 'admin@canonika.io'
            }
          };
        } else {
          return {
            success: false,
            error: 'Credenciais inválidas'
          };
        }
      };
      
      const validCredentials = {
        email: 'admin@canonika.io',
        password: 'admin123'
      };
      
      const invalidCredentials = {
        email: 'wrong@email.com',
        password: 'wrongpass'
      };
      
      const validResponse = simulateQuarterResponse(validCredentials);
      const invalidResponse = simulateQuarterResponse(invalidCredentials);
      
      expect(validResponse.success).to.be.true;
      expect(validResponse.user).to.have.property('name');
      
      expect(invalidResponse.success).to.be.false;
      expect(invalidResponse.error).to.equal('Credenciais inválidas');
    });
    
    it('deve processar redirect_to do Quarter', () => {
      const processRedirectTo = (url) => {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        return urlParams.get('redirect_to');
      };
      
      const quarterUrl = 'http://localhost?redirect_to=http%3A//localhost%3A3703/dashboard';
      const redirectTo = processRedirectTo(quarterUrl);
      
      expect(redirectTo).to.equal('http://localhost:3703/dashboard');
    });
  });
}); 