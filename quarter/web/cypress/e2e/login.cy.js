describe('Quarter Login - BDD Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Como um usuário do Canonika', () => {
    describe('Quando acesso a página de login do Quarter', () => {
      it('Devo ver a interface de login completa', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // Then: Devo ver todos os elementos necessários
        cy.get('.canonika-header').should('be.visible')
        cy.get('.logo-text').should('contain', 'CANONIKA')
        cy.get('.logo-subtitle').should('contain', 'QUARTER')
        cy.get('.login-card').should('be.visible')
        cy.get('.login-title').should('contain', 'Portal Canonika')
        cy.get('.login-subtitle').should('contain', 'Acesso Centralizado')
        cy.get('.login-form').should('be.visible')
        cy.get('input[type="email"]').should('be.visible')
        cy.get('input[type="password"]').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible')
        cy.get('.status-indicator.online').should('be.visible')
      })

      it('Devo ver as credenciais padrão preenchidas', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // Then: Devo ver as credenciais padrão
        cy.get('input[type="email"]').should('have.value', 'admin@canonika.io')
        cy.get('input[type="password"]').should('have.value', 'admin123')
      })
    })

    describe('Quando faço login com credenciais válidas', () => {
      it('Devo ser redirecionado para o Harbor', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // When: Faço login com credenciais válidas
        cy.loginQuarter()

        // Then: Devo ser redirecionado para o Harbor
        cy.shouldBeRedirectedToHarbor()
      })

      it('Devo ter meu estado de autenticação salvo', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // When: Faço login com credenciais válidas
        cy.loginQuarter()

        // Then: Meu estado de autenticação deve ser salvo
        cy.window().then((win) => {
          expect(win.localStorage.getItem('canonika_authenticated')).to.eq('true')
          expect(win.localStorage.getItem('canonika_user')).to.not.be.null
        })
      })
    })

    describe('Quando faço login com credenciais inválidas', () => {
      it('Devo ver uma mensagem de erro', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // When: Faço login com credenciais inválidas
        cy.get('input[type="email"]').clear().type('invalid@email.com')
        cy.get('input[type="password"]').clear().type('wrongpassword')
        cy.get('button[type="submit"]').click()

        // Then: Devo ver uma mensagem de erro
        cy.shouldShowError('Credenciais inválidas.')
      })

      it('Não devo ser redirecionado', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // When: Faço login com credenciais inválidas
        cy.get('input[type="email"]').clear().type('invalid@email.com')
        cy.get('input[type="password"]').clear().type('wrongpassword')
        cy.get('button[type="submit"]').click()

        // Then: Devo permanecer na página de login
        cy.shouldBeOnLoginPage()
      })
    })

    describe('Quando faço login com email inválido', () => {
      it('Devo ver uma mensagem de erro', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // When: Faço login com email inválido
        cy.get('input[type="email"]').clear().type('invalid-email')
        cy.get('input[type="password"]').clear().type('admin123')
        cy.get('button[type="submit"]').click()

        // Then: Devo ver uma mensagem de erro
        cy.shouldShowError('Credenciais inválidas.')
      })
    })

    describe('Quando faço login com senha inválida', () => {
      it('Devo ver uma mensagem de erro', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // When: Faço login com senha inválida
        cy.get('input[type="email"]').clear().type('admin@canonika.io')
        cy.get('input[type="password"]').clear().type('wrongpassword')
        cy.get('button[type="submit"]').click()

        // Then: Devo ver uma mensagem de erro
        cy.shouldShowError('Credenciais inválidas.')
      })
    })
  })

  describe('Como um administrador do sistema', () => {
    describe('Quando acesso o Quarter', () => {
      it('Devo ver o status do sistema online', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // Then: Devo ver o status online
        cy.get('.system-status').should('be.visible')
        cy.get('.status-indicator.online').should('be.visible')
        cy.get('.system-status span').should('contain', 'ONLINE')
      })

      it('Devo ver a identidade visual do Canonika', () => {
        // Given: Estou na página de login
        cy.shouldBeOnLoginPage()

        // Then: Devo ver a identidade visual
        cy.get('.logo-hexagon').should('be.visible')
        cy.get('.logo-pulse').should('be.visible')
        cy.get('.logo-hexagon-large').should('be.visible')
        cy.get('.logo-pulse-large').should('be.visible')
      })
    })
  })

  describe('Como um usuário que já fez login', () => {
    describe('Quando retorno à página de login', () => {
      it('Devo poder fazer login novamente', () => {
        // Given: Já fiz login anteriormente
        cy.loginQuarter()
        cy.shouldBeRedirectedToHarbor()

        // When: Retorno à página de login
        cy.visit('/')

        // Then: Devo poder fazer login novamente
        cy.shouldBeOnLoginPage()
        cy.loginQuarter()
        cy.shouldBeRedirectedToHarbor()
      })
    })
  })
}) 