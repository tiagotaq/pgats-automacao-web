import { faker } from '@faker-js/faker';

describe('Automation Exercise', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr')
    cy.visit('https://automationexercise.com')
    cy.get('a[href="/login"]').click()
  })

  it('Cadastrar um usuário', () => {
    const timestamp = new Date().getTime()

    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    cy.get('[data-qa="signup-name"]').type(`${firstName} ${lastName}`)
    cy.get('[data-qa="signup-email"]').type(`qa-tester-${timestamp}@test.com`)

    // qa-tester-1758398745991@test.com
    // qa-tester-1758389795821@test.com

    cy.contains('button', 'Signup').click()
    cy.get('input#password').type('12345', { log: false })

    // para comboboxes ou selects -> select
    cy.get('select[data-qa=days]').select('20')
    cy.get('select[data-qa=months]').select('September')
    cy.get('select[data-qa=years]').select('1992')

    // radio ou checkboxes -> check
    cy.get('input[type=checkbox]#newsletter').check()
    cy.get('input[type=checkbox]#optin').check()

    cy.get('input#first_name').type(firstName)
    cy.get('input#last_name').type(lastName)
    cy.get('input#company').type(`PGATS ${faker.company.name()}`)
    cy.get('input#address1').type(faker.location.streetAddress())
    cy.get('select#country').select('Canada')
    cy.get('input#state').type(faker.location.state())
    cy.get('input#city').type(faker.location.city())
    cy.get('[data-qa=zipcode]').type(faker.location.zipCode())
    cy.get('[data-qa=mobile_number]').type('111 222 333')

    // Act
    cy.get('[data-qa=create-account]').click()

    // Assert
    cy.url().should('includes', 'account_created')

    cy.contains('b', 'Account Created!')
    cy.get('h2[data-qa=account-created]').should('have.text', 'Account Created!')
  })

  it('Login de Usuário com e-mail e senha corretos', () => {

    cy.get('[data-qa=login-email]').type('qa-tester-1759530219181@test.com')
    cy.get('[data-qa=login-password]').type('12345')
    cy.get('[data-qa=login-button]').click()

    const nomeDoUsuario = "QA Tester"

    cy.get('.fa-user').parent().should('contain', nomeDoUsuario)
    cy.get('a[href="/logout"]').should('be.visible')

    cy.get(':nth-child(10) > a')
      .should('be.visible')
      .and('have.text', ` Logged in as ${nomeDoUsuario}`)

    cy.contains('b', nomeDoUsuario)
    cy.contains(`Logged in as ${nomeDoUsuario}`).should('be.visible')
    cy.contains(`Logged in as ${nomeDoUsuario}`).should('be.visible')
  });

  it('Login de Usuário com e-mail e senha incorretos', () => {
    cy.get('[data-qa="login-email"]').type('qa-tester-1759530219181@test.com')
    cy.get('[data-qa="login-password"]').type('54321')

    cy.get('[data-qa="login-button"]').click()

    cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!')
  });

  it('Logout de Usuário', () => {

    cy.get('[data-qa=login-email]').type('qa-tester-1759530219181@test.com')
    cy.get('[data-qa=login-password]').type('12345')
    cy.get('[data-qa=login-button]').click()

    const nomeDoUsuario = "QA Tester"

    cy.get('.fa-user').parent().should('contain', nomeDoUsuario)

    // Act
    cy.get('a[href="/logout"]').should('be.visible').click()
    cy.get('.shop-menu > .nav > :nth-child(4) > a').click()

    // Assert
    cy.url().should('contain', 'login')
    cy.contains('Login to your account')

    cy.get('a[href="/logout"]').should('not.exist')
    cy.get('a[href="/login"]').should('contain', 'Signup / Login')
  });

  it('Cadastrar Usuário com e-mail existente no sistema', () => {
    // Arrange
    cy.get('[data-qa="signup-name"]').type('QA Tester')
    cy.get('[data-qa="signup-email"]').type('qa-tester-1759530219181@test.com')

    cy.contains('button', 'Signup').click()

    cy.get('.signup-form > form > p').should('contain', 'Email Address already exist!')
  });

})