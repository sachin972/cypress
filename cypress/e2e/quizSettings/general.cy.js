const adminCredentials = require('../../fixtures/login.fixture.json');
const orgDetails = require('../../fixtures/orgDetails.fixture.json');
const { randomString } = require('../../helpers/utils.helper');

describe('Testing interaction with general settings', () => {
	beforeEach(() => {
		cy.login(adminCredentials);
		cy.get('[data-tooltip="Settings"]').click();
		cy.get('.justify-end > .button').should('be.disabled');
		cy.contains('.margin-bottom-24 > .padding-vertical-12', 'Organization Description');
		cy.get('[name="groups"]').click().should('have.class', 'active');
	});

	it('Edit name of the test', () => { });
	it('Edit duration of the test', () => { });
	it('Deactivate Test', () => { });
	it('Reload Active Tests', () => { });
	it('Lock Test Editor', () => { });
	it('Revert all changes', () => { });
	it('Delete Test', () => { });
});
