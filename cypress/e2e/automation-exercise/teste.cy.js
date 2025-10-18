import { faker } from '@faker-js/faker'

describe('Automation Exercise XPATH', () => {
	beforeEach(() => {
		cy.viewport('iphone-xr')
		cy.visit('https://automationexercise.com')
		cy.xpath('//a[@href="/login"]').click()
	})

	it('Cadastrar um usuário', () => {
		const timestamp = new Date().getTime()
		const firstName = faker.person.firstName()
		const lastName = faker.person.lastName()

		cy.xpath('//*[@data-qa="signup-name"]').type(`${firstName} ${lastName}`)
		cy.xpath('//*[@data-qa="signup-email"]').type(`qa-tester-${timestamp}@test.com`)
		cy.contains('button', 'Signup').click()

		cy.xpath('//input[@id="password"]').type('12345', { log: false })

		// comboboxes / selects
		cy.xpath('//select[@data-qa="days"]').select('20')
		cy.xpath('//select[@data-qa="months"]').select('September')
		cy.xpath('//select[@data-qa="years"]').select('1992')

		// checkboxes
		cy.xpath('//input[@type="checkbox" and @id="newsletter"]').check()
		cy.xpath('//input[@type="checkbox" and @id="optin"]').check()

		cy.xpath('//input[@id="first_name"]').type(firstName)
		cy.xpath('//input[@id="last_name"]').type(lastName)
		cy.xpath('//input[@id="company"]').type(`PGATS ${faker.company.name()}`)
		cy.xpath('//input[@id="address1"]').type(faker.location.streetAddress())
		cy.xpath('//select[@id="country"]').select('Canada')
		cy.xpath('//input[@id="state"]').type(faker.location.state())
		cy.xpath('//input[@id="city"]').type(faker.location.city())
		cy.xpath('//*[@data-qa="zipcode"]').type(faker.location.zipCode())
		cy.xpath('//*[@data-qa="mobile_number"]').type('111 222 333')

		// Act
		cy.xpath('//*[@data-qa="create-account"]').click()

		// Assert
		cy.url().should('includes', 'account_created')
		cy.contains('b', 'Account Created!')
		cy.xpath('//h2[@data-qa="account-created"]').should('have.text', 'Account Created!')
	})

	it('Login de Usuário com e-mail e senha corretos', () => {
		cy.xpath('//*[@data-qa="login-email"]').type('qa-tester-1759530219181@test.com')
		cy.xpath('//*[@data-qa="login-password"]').type('12345')
		cy.xpath('//*[@data-qa="login-button"]').click()

		const nomeDoUsuario = 'QA Tester'

		cy.xpath('//*[contains(@class, "fa-user")]/parent::*').should('contain', nomeDoUsuario)
		cy.xpath('//a[@href="/logout"]').should('be.visible')

		cy.xpath('(//li)[10]/a')
			.should('be.visible')
			.and('have.text', ` Logged in as ${nomeDoUsuario}`)

		cy.contains('b', nomeDoUsuario)
		cy.contains(`Logged in as ${nomeDoUsuario}`).should('be.visible')
	})

	it('Login de Usuário com e-mail e senha incorretos', () => {
		cy.xpath('//*[@data-qa="login-email"]').type('qa-tester-1759530219181@test.com')
		cy.xpath('//*[@data-qa="login-password"]').type('54321')
		cy.xpath('//*[@data-qa="login-button"]').click()

		cy.xpath('//div[contains(@class,"login-form")]//form//p').should(
			'contain',
			'Your email or password is incorrect!'
		)
	})

	it('Logout de Usuário', () => {
		cy.xpath('//*[@data-qa="login-email"]').type('qa-tester-1759530219181@test.com')
		cy.xpath('//*[@data-qa="login-password"]').type('12345')
		cy.xpath('//*[@data-qa="login-button"]').click()

		const nomeDoUsuario = 'QA Tester'

		cy.xpath('//*[contains(@class, "fa-user")]/parent::*').should('contain', nomeDoUsuario)

		// Act
		cy.xpath('//a[@href="/logout"]').should('be.visible').click()

		// Assert
		cy.url().should('contain', 'login')
		cy.contains('Login to your account')
		cy.xpath('//a[@href="/logout"]').should('not.exist')
		cy.xpath('//a[@href="/login"]').should('contain', 'Signup / Login')
	})

	it('Cadastrar Usuário com e-mail existente no sistema', () => {
		cy.xpath('//*[@data-qa="signup-name"]').type('QA Tester')
		cy.xpath('//*[@data-qa="signup-email"]').type('qa-tester-1759530219181@test.com')
		cy.contains('button', 'Signup').click()

		cy.xpath('//div[contains(@class,"signup-form")]//form//p').should(
			'contain',
			'Email Address already exist!'
		)
	})
})