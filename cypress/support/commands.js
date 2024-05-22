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

/**
 *
 */
import 'cypress-file-upload';
import 'cypress-iframe';

Cypress.Commands.add('login', ({ email, password }, options = {}) => {
	cy.clearCookies();
	if (options.callback) {
		cy.visit(`/auth/signin?callbackUrl=${options.callback}`);
	} else {
		cy.visit('/auth/signin');
	}
	cy.get('input[name=email]').click().type(email);
	cy.get('.blue-button').click();
	cy.wait(1000);
	cy.get('input[name=password]').click().type(password);
	cy.get('.blue-button').click();
	// TODO: Check for cookies to be set
	// we should be redirected to /dashboard
	// cy.url().should('include', `${orgName}/dashboard`);
	// our auth cookie should be present
	// cy.getCookie('AccessToken').should('exist');
	// cy.getCookie('User').should('exist');
	// UI should reflect this user being logged in
	// cy.contains('.breadcrumbItem', 'Tests');
});

Cypress.Commands.add('logout', () => {
	// TODO: Fix this code to work properly using deleteCookies or using other navigation methods
	cy.clearCookies();
});
