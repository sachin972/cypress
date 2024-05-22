const adminCredentials = require('../../fixtures/login.fixture.json');

describe('Testing interaction with integration settings', () => {
	beforeEach(() => {
		cy.login(adminCredentials);
		cy.get('[data-tooltip="Settings"]').click();
		cy.get('.justify-end > .button').should('be.disabled');
		cy.contains('.margin-bottom-24 > .padding-vertical-12', 'Organization Description');
		cy.get('[name="integrations"]').click().should('have.class', 'active');
	});

	// TODO: Add test cases
});
