describe('Quarter Logout - Teste Simples', () => {
  it('Devo poder fazer logout do Harbor e ir para o Quarter', () => {
    // Given: Estou no Quarter
    cy.visit('http://localhost:80')
    cy.shouldBeOnLoginPage()

    // When: Faço login
    cy.loginQuarter()
    cy.shouldBeRedirectedToHarbor()

    // And: Faço logout
    cy.get('.logout-btn').click()

    // Then: Devo estar no Quarter
    cy.url().should('eq', 'http://localhost:80/')
    cy.shouldBeOnLoginPage()
  })

  it('Devo ter estado limpo após logout', () => {
    // Given: Estou logado no Harbor
    cy.visit('http://localhost:80')
    cy.loginQuarter()
    cy.shouldBeRedirectedToHarbor()

    // When: Faço logout
    cy.get('.logout-btn').click()

    // Then: Estado deve estar limpo
    cy.window().then((win) => {
      expect(win.localStorage.getItem('canonika_authenticated')).to.be.null
      expect(win.localStorage.getItem('canonika_user')).to.be.null
    })
  })
}) 