// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ email, password, orgName }) => {
	console.log(email, password, orgName);
	cy.visit('/auth/signin');
	cy.get('input[name=email]').type(email);
	cy.contains('button', 'Continue').click();
	cy.get('input[name=password]').type(password);
	cy.contains('button', 'Continue').click();
	// cy.get('input[name=username]').click().type(email);
	// cy.wait(1000);
	// cy.get('input[name=password]').click().type(password);
	// cy.get('#loginButton').click();
	// we should be redirected to /dashboard
	// cy.url().should('include', `${orgName}/dashboard`);
	// our auth cookie should be present
	// cy.getCookie('AccessToken').should('exist');
	// cy.getCookie('User').should('exist');
	// UI should reflect this user being logged in
	cy.contains('.breadcrumbItem', 'Tests');
});
