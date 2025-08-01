// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para fazer login no Quarter
Cypress.Commands.add('loginQuarter', (email = 'admin@canonika.io', password = 'admin123') => {
  cy.visit('/')
  cy.get('input[type="email"]').clear().type(email)
  cy.get('input[type="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
})

// Comando para verificar se está na página de login
Cypress.Commands.add('shouldBeOnLoginPage', () => {
  cy.url().should('eq', Cypress.config().baseUrl + '/')
  cy.get('.login-form').should('be.visible')
  cy.get('.logo-text').should('contain', 'CANONIKA')
})

// Comando para verificar se foi redirecionado para Harbor
Cypress.Commands.add('shouldBeRedirectedToHarbor', () => {
  cy.url().should('eq', 'http://localhost:3701/')
})

// Comando para verificar mensagem de erro
Cypress.Commands.add('shouldShowError', (message) => {
  cy.get('.error-message').should('be.visible').and('contain', message)
}) 