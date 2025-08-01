describe('Quarter Logout - BDD Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Como um usuário logado no Harbor', () => {
    describe('Quando faço logout no Harbor', () => {
      it('Devo ser redirecionado para o Quarter', () => {
        // Given: Estou logado no Harbor
        cy.visit('http://localhost:3701')
        cy.get('.user-info').should('be.visible')
        cy.get('.logout-btn').should('be.visible')

        // When: Faço logout
        cy.get('.logout-btn').click()

        // Then: Devo ser redirecionado para o Quarter
        cy.url().should('eq', 'http://localhost:80/')
        cy.shouldBeOnLoginPage()
      })

      it('Devo ter meu estado de autenticação limpo', () => {
        // Given: Estou logado no Harbor
        cy.visit('http://localhost:3701')
        cy.get('.user-info').should('be.visible')

        // When: Faço logout
        cy.get('.logout-btn').click()

        // Then: Meu estado de autenticação deve ser limpo
        cy.window().then((win) => {
          expect(win.localStorage.getItem('canonika_authenticated')).to.be.null
          expect(win.localStorage.getItem('canonika_user')).to.be.null
        })
      })

      it('Devo ver a página de login do Quarter', () => {
        // Given: Estou logado no Harbor
        cy.visit('http://localhost:3701')
        cy.get('.user-info').should('be.visible')

        // When: Faço logout
        cy.get('.logout-btn').click()

        // Then: Devo ver a página de login do Quarter
        cy.shouldBeOnLoginPage()
        cy.get('.login-title').should('contain', 'Portal Canonika')
        cy.get('.login-subtitle').should('contain', 'Acesso Centralizado')
      })
    })

    describe('Quando retorno ao Harbor após logout', () => {
      it('Devo ser redirecionado para o Quarter novamente', () => {
        // Given: Estou logado no Harbor
        cy.visit('http://localhost:3701')
        cy.get('.user-info').should('be.visible')

        // When: Faço logout
        cy.get('.logout-btn').click()

        // And: Tento acessar o Harbor novamente
        cy.visit('http://localhost:3701')

        // Then: Devo ser redirecionado para o Quarter
        cy.url().should('eq', 'http://localhost:80/')
        cy.shouldBeOnLoginPage()
      })
    })
  })

  describe('Como um usuário que fez logout', () => {
    describe('Quando acesso o Quarter após logout', () => {
      it('Devo poder fazer login novamente', () => {
        // Given: Fiz logout do Harbor
        cy.visit('http://localhost:3701')
        cy.get('.logout-btn').click()
        cy.shouldBeOnLoginPage()

        // When: Faço login novamente
        cy.loginQuarter()

        // Then: Devo ser redirecionado para o Harbor
        cy.shouldBeRedirectedToHarbor()
      })

      it('Devo ter credenciais limpas para novo login', () => {
        // Given: Fiz logout do Harbor
        cy.visit('http://localhost:3701')
        cy.get('.logout-btn').click()
        cy.shouldBeOnLoginPage()

        // Then: Devo ver as credenciais padrão
        cy.get('input[type="email"]').should('have.value', 'admin@canonika.io')
        cy.get('input[type="password"]').should('have.value', 'admin123')
      })
    })
  })

  describe('Como um administrador do sistema', () => {
    describe('Quando faço logout do Harbor', () => {
      it('Devo ver o Quarter como ponto de entrada centralizado', () => {
        // Given: Estou logado no Harbor como administrador
        cy.visit('http://localhost:3701')
        cy.get('.user-info').should('be.visible')

        // When: Faço logout
        cy.get('.logout-btn').click()

        // Then: Devo ver o Quarter como ponto de entrada
        cy.shouldBeOnLoginPage()
        cy.get('.logo-text').should('contain', 'CANONIKA')
        cy.get('.logo-subtitle').should('contain', 'QUARTER')
        cy.get('.login-subtitle').should('contain', 'Acesso Centralizado')
      })

      it('Devo ter acesso ao sistema de segurança (Guardian)', () => {
        // Given: Fiz logout do Harbor
        cy.visit('http://localhost:3701')
        cy.get('.logout-btn').click()
        cy.shouldBeOnLoginPage()

        // When: Faço login novamente
        cy.loginQuarter()
        cy.shouldBeRedirectedToHarbor()

        // Then: Devo ter acesso ao Guardian
        cy.visit('http://localhost:3705')
        cy.get('.logo-text').should('contain', 'CANONIKA')
        cy.get('.logo-subtitle').should('contain', 'GUARDIAN')
      })
    })
  })

  describe('Como um usuário que navega entre serviços', () => {
    describe('Quando faço logout de qualquer serviço', () => {
      it('Devo sempre retornar ao Quarter', () => {
        // Given: Estou logado no Harbor
        cy.visit('http://localhost:3701')
        cy.get('.user-info').should('be.visible')

        // When: Faço logout
        cy.get('.logout-btn').click()

        // Then: Devo estar no Quarter
        cy.shouldBeOnLoginPage()

        // And: Posso fazer login novamente
        cy.loginQuarter()
        cy.shouldBeRedirectedToHarbor()
      })
    })

    describe('Quando acesso o Guardian após logout', () => {
      it('Devo ser redirecionado para o Quarter', () => {
        // Given: Fiz logout do Harbor
        cy.visit('http://localhost:3701')
        cy.get('.logout-btn').click()
        cy.shouldBeOnLoginPage()

        // When: Tento acessar o Guardian diretamente
        cy.visit('http://localhost:3705')

        // Then: Devo ser redirecionado para o Quarter
        cy.url().should('eq', 'http://localhost:80/')
        cy.shouldBeOnLoginPage()
      })
    })
  })

  describe('Como um usuário que testa o fluxo completo', () => {
    describe('Quando faço o ciclo completo de login/logout', () => {
      it('Devo poder fazer login e logout múltiplas vezes', () => {
        // Given: Estou no Quarter
        cy.shouldBeOnLoginPage()

        // When: Faço login
        cy.loginQuarter()
        cy.shouldBeRedirectedToHarbor()

        // And: Faço logout
        cy.get('.logout-btn').click()
        cy.shouldBeOnLoginPage()

        // And: Faço login novamente
        cy.loginQuarter()
        cy.shouldBeRedirectedToHarbor()

        // And: Faço logout novamente
        cy.get('.logout-btn').click()
        cy.shouldBeOnLoginPage()

        // Then: Devo poder fazer login uma terceira vez
        cy.loginQuarter()
        cy.shouldBeRedirectedToHarbor()
      })

      it('Devo ter estado limpo entre sessões', () => {
        // Given: Fiz logout
        cy.visit('http://localhost:3701')
        cy.get('.logout-btn').click()
        cy.shouldBeOnLoginPage()

        // When: Faço login novamente
        cy.loginQuarter()
        cy.shouldBeRedirectedToHarbor()

        // Then: Devo ter estado limpo
        cy.window().then((win) => {
          expect(win.localStorage.getItem('canonika_authenticated')).to.eq('true')
          expect(win.localStorage.getItem('canonika_user')).to.not.be.null
        })
      })
    })
  })
}) 