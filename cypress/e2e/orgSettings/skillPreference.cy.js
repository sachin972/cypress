const adminCredentials = require('../../fixtures/login.fixture.json');
const orgDetails = require('../../fixtures/orgDetails.fixture.json');
const { randomString } = require('../../helpers/utils.helper');

describe('Testing interaction with candidate report', () => {
	beforeEach(() => {
		cy.login(adminCredentials);
		cy.get('[data-tooltip="Settings"]').click();
		cy.get('.justify-end > .button').should('be.disabled');
		cy.contains('.margin-bottom-24 > .padding-vertical-12', 'Organization Description');
		cy.get('[name="skill-preference"]').click().should('have.class', 'active');
	});
});
